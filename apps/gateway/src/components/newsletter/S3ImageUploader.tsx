'use client'

import React, { useState, useRef, useCallback } from 'react'
import {
  Button,
  ButtonMarkup,
  VariantState,
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
  Icon,
  IconSize,
  IconPosition,
  IconName,
  IconColor,
  IconStatus,
  Text,
  Title,
  TitleLevel
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { getUrl } from 'aws-amplify/storage'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { fetchAuthSession } from 'aws-amplify/auth'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import classNames from 'classnames'

export interface S3ImageData {
  s3Key: string           // S3 object key
  s3Bucket: string        // S3 bucket name
  originalFilename: string // Original filename
  mimeType: string        // MIME type
  fileSize: number        // File size in bytes
  width: number           // Image width
  height: number          // Image height
  previewUrl?: string     // Temporary preview URL
}

interface S3ImageUploaderProps {
  onImageSelect: (imageData: S3ImageData | null) => void
  currentImage?: S3ImageData | null
  maxWidth?: number
  maxHeight?: number
  maxFileSize?: number // in bytes
  acceptedFormats?: string[]
  className?: string
}

const S3ImageUploader: React.FC<S3ImageUploaderProps> = ({
  onImageSelect,
  currentImage,
  maxWidth = 1000,
  maxHeight = 1000,
  maxFileSize = 2 * 1024 * 1024, // 2MB (increased for S3 storage)
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  className
}) => {
  const { user } = useAuthenticator()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImage?.previewUrl || null
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Helper function to get Cognito ID token for API authentication
  const getAuthToken = useCallback(async (): Promise<string | null> => {
    try {
      if (!user) return null

      const session = await fetchAuthSession()
      const idToken = session.tokens?.idToken?.toString()
      return idToken || null
    } catch (error) {
      console.error('Error getting auth token:', error)
      return null
    }
  }, [user])

  // Helper function to get image dimensions
  const getImageDimensions = useCallback((file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => reject(new Error("Impossible de charger l&apos;image"))
      img.src = URL.createObjectURL(file)
    })
  }, [])

  // Helper function to resize image if needed
  const resizeImageIfNeeded = useCallback((
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number = 0.8
  ): Promise<File> => {
    return new Promise(async (resolve, reject) => {
      try {
        const { width, height } = await getImageDimensions(file)

        // Check if resizing is needed
        if (width <= maxWidth && height <= maxHeight) {
          resolve(file) // No resizing needed
          return
        }

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
          // Calculate new dimensions maintaining aspect ratio
          let newWidth = width
          let newHeight = height

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            newWidth = width * ratio
            newHeight = height * ratio
          }

          canvas.width = newWidth
          canvas.height = newHeight

          if (!ctx) {
            reject(new Error("Impossible de créer le contexte canvas"))
            return
          }

          // Draw and compress image
          ctx.drawImage(img, 0, 0, newWidth, newHeight)

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Impossible de compresser l'image"))
                return
              }

              // Create a new File object with the compressed data
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })

              resolve(compressedFile)
            },
            file.type,
            quality
          )
        }

        img.onerror = () => reject(new Error("Impossible de charger l&apos;image"))
        img.src = URL.createObjectURL(file)
      } catch (error) {
        reject(error)
      }
    })
  }, [getImageDimensions])

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null)
    setIsUploading(true)

    try {
      // Validate file type
      if (!acceptedFormats.includes(file.type)) {
        throw new Error(`Format non supporté. Utilisez: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`)
      }

      // Initial file size check
      if (file.size > maxFileSize) {
        throw new Error(`Fichier trop volumineux. Maximum: ${Math.round(maxFileSize / 1024 / 1024)}MB`)
      }

      // Get original dimensions
      const originalDimensions = await getImageDimensions(file)

      // Resize image if needed
      let processedFile = file
      if (originalDimensions.width > maxWidth || originalDimensions.height > maxHeight) {
        processedFile = await resizeImageIfNeeded(file, maxWidth, maxHeight, 0.9)
      }

      console.log('Uploading via admin API:', { name: file.name, size: processedFile.size })

      // Get authentication token
      const authToken = await getAuthToken()
      if (!authToken) {
        throw new Error('Authentication requise. Veuillez vous connecter.')
      }

      // Upload via server-side API for authenticated admin users
      const formData = new FormData()
      formData.append('file', processedFile)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || `Upload failed: ${uploadResponse.status}`)
      }

      const uploadResult = await uploadResponse.json()
      console.log('Upload successful:', uploadResult)

      // Get a temporary preview URL using Amplify storage
      const previewUrl = await getUrl({
        key: uploadResult.s3Key,
        options: {
          expiresIn: 3600, // 1 hour
        }
      })

      const imageData: S3ImageData = {
        s3Key: uploadResult.s3Key,
        s3Bucket: uploadResult.s3Bucket,
        originalFilename: uploadResult.originalFilename,
        mimeType: uploadResult.mimeType,
        fileSize: uploadResult.fileSize,
        width: originalDimensions.width,
        height: originalDimensions.height,
        previewUrl: previewUrl.url.toString(),
      }

      setPreviewUrl(previewUrl.url.toString())
      onImageSelect(imageData)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du traitement de l'image"
      setError(errorMessage)
      onImageSelect(null)
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedFormats, maxFileSize, maxWidth, maxHeight, resizeImageIfNeeded, getImageDimensions, onImageSelect])

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemoveImage = async () => {
    try {
      // If there's a current image with S3 key, delete it from S3
      if (currentImage?.s3Key) {
        console.log('Deleting from S3:', currentImage.s3Key)

        // Get authentication token
        const authToken = await getAuthToken()
        if (!authToken) {
          console.warn('No auth token for delete - skipping S3 cleanup')
        } else {
          const deleteResponse = await fetch(`/api/upload?key=${encodeURIComponent(currentImage.s3Key)}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          })

          if (!deleteResponse.ok) {
            console.warn('Failed to delete from S3:', await deleteResponse.text())
            // Continue with UI cleanup even if S3 delete fails
          } else {
            console.log('Successfully deleted from S3:', currentImage.s3Key)
          }
        }
      }
    } catch (error) {
      console.warn('Error deleting from S3:', error)
      // Continue with UI cleanup even if delete fails
    }

    // Clear UI state
    setPreviewUrl(null)
    setError(null)
    onImageSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBrowseFiles = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={classNames(className, flexStyles.isMarginBottom2)}>
      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Upload Area */}
      {!previewUrl && (
        <div className={classNames(
          flexStyles.isPadding4,
          flexStyles.hasBorderDashed,
          flexStyles.hasTextCentered,
          flexStyles.isMarginBottom2
        )}
        style={{
          borderColor: error ? '#e74c3c' : '#3498db',
          backgroundColor: error ? '#fdf2f2' : '#f8f9fa'
        }}>
          <Title level={TitleLevel.LEVEL5}>
            Télécharger une image
          </Title>
          <Text>
            Formats acceptés: PNG, JPEG, JPG, WebP<br/>
            Taille max: {Math.round(maxFileSize / 1024 / 1024)}MB<br/>
            Dimensions max: {maxWidth}×{maxHeight}px
          </Text>
          <Button
            markup={ButtonMarkup.BUTTON}
            variant={VariantState.PRIMARY}
            onClick={handleBrowseFiles}
            disabled={isUploading}
          >
            {isUploading ? 'Téléchargement en cours...' : 'Choisir une image'}
          </Button>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div>
          <div className={classNames(
            flexStyles.hasTextCentered,
            flexStyles.isPadding2,
            flexStyles.hasBorderSolid,
            flexStyles.isMarginBottom2
          )}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Aperçu de l'image"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                objectFit: 'contain'
              }}
            />
          </div>
          <div className={flexStyles.isFlexDirectionRow}>
            <Button
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.SECONDARY}
              onClick={handleBrowseFiles}
              className={flexStyles.isMarginRight2}
              disabled={isUploading}
            >
              Changer d&apos;image
            </Button>
            <Button
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.DANGER}
              onClick={handleRemoveImage}
              disabled={isUploading}
            >
              Supprimer
            </Button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <InfoBlock>
          <InfoBlockHeader status={InfoBlockStatus.DANGER} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
            <Title level={TitleLevel.LEVEL5}>Erreur</Title>
          </InfoBlockHeader>
          <InfoBlockContent>
            <Text>{error}</Text>
          </InfoBlockContent>
        </InfoBlock>
      )}

      {/* Processing State */}
      {isUploading && (
        <InfoBlock>
          <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE} />
          <InfoBlockContent>
            <Text>Téléchargement en cours...</Text>
          </InfoBlockContent>
        </InfoBlock>
      )}

      {/* Success Info */}
      {currentImage && !isUploading && (
        <InfoBlock>
          <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK_CIRCLE} />
          <InfoBlockContent>
            <Text>
              Fichier: {currentImage.originalFilename}<br/>
              Taille: {Math.round(currentImage.fileSize / 1024)}KB<br/>
              Dimensions: {currentImage.width}×{currentImage.height}px
            </Text>
          </InfoBlockContent>
        </InfoBlock>
      )}
    </div>
  )
}

export default S3ImageUploader
