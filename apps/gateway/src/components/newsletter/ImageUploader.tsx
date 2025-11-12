'use client'

import React, { useState, useRef, useCallback } from 'react'
import {
  Button,
  ButtonMarkup,
  Input,
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
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import classNames from 'classnames'

export interface ImageData {
  content: string // base64 encoded image data
  filename: string
  filetype: string
  encoding: string
  width: number
  height: number
  size: number // in bytes
}

interface ImageUploaderProps {
  onImageSelect: (imageData: ImageData | null) => void
  currentImage?: ImageData | null
  maxWidth?: number
  maxHeight?: number
  maxFileSize?: number // in bytes
  acceptedFormats?: string[]
  className?: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  currentImage,
  maxWidth = 1000,
  maxHeight = 1000,
  maxFileSize = 100 * 1024, // 100KB
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png'],
  className
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImage ? `data:${currentImage.filetype};${currentImage.encoding},${currentImage.content}` : null
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Helper function to resize image using canvas
  const resizeImage = useCallback((
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number = 0.8
  ): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }

        canvas.width = width
        canvas.height = height

        if (!ctx) {
          reject(new Error('Impossible de créer le contexte canvas'))
          return
        }

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Impossible de compresser l&apos;image"))
              return
            }

            const reader = new FileReader()
            reader.onload = () => {
              const base64String = (reader.result as string).split(',')[1]

              resolve({
                content: base64String,
                filename: file.name,
                filetype: file.type,
                encoding: 'base64',
                width: Math.round(width),
                height: Math.round(height),
                size: blob.size
              })
            }
            reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'))
            reader.readAsDataURL(blob)
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error("Impossible de charger l&apos;image"))
      img.src = URL.createObjectURL(file)
    })
  }, [])

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null)
    setIsProcessing(true)

    try {
      // Validate file type
      if (!acceptedFormats.includes(file.type)) {
        throw new Error(`Format non supporté. Utilisez: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`)
      }

      // Initial file size check
      if (file.size > maxFileSize * 2) { // Allow some overhead for processing
        throw new Error(`Fichier trop volumineux. Maximum: ${Math.round(maxFileSize / 1024)}KB`)
      }

      // Start with high quality and reduce if needed
      let quality = 0.8
      let imageData: ImageData | null = null
      let attempts = 0
      const maxAttempts = 5

      while (attempts < maxAttempts) {
        imageData = await resizeImage(file, maxWidth, maxHeight, quality)

        if (imageData.size <= maxFileSize) {
          break
        }

        // Reduce quality for next attempt
        quality -= 0.1
        attempts++

        if (quality < 0.3) {
          throw new Error("Impossible de réduire l&apos;image sous 100KB tout en conservant une qualité acceptable")
        }
      }

      if (!imageData || imageData.size > maxFileSize) {
        throw new Error("Impossible de réduire l&apos;image à la taille requise")
      }

      // Create preview URL
      const previewDataUrl = `data:${imageData.filetype};${imageData.encoding},${imageData.content}`
      setPreviewUrl(previewDataUrl)

      onImageSelect(imageData)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du traitement de l&apos;image"
      setError(errorMessage)
      onImageSelect(null)
    } finally {
      setIsProcessing(false)
    }
  }, [acceptedFormats, maxFileSize, maxWidth, maxHeight, resizeImage, onImageSelect])

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemoveImage = () => {
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
            Formats acceptés: PNG, JPEG, JPG<br/>
            Taille max: {Math.round(maxFileSize / 1024)}KB<br/>
            Dimensions max: {maxWidth}×{maxHeight}px
          </Text>
          <Button
            markup={ButtonMarkup.BUTTON}
            variant={VariantState.PRIMARY}
            onClick={handleBrowseFiles}
            disabled={isProcessing}
          >
            {isProcessing ? 'Traitement en cours...' : 'Choisir une image'}
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
              alt="Aperçu de l&apos;image"
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
              disabled={isProcessing}
            >
              Changer d&apos;image
            </Button>
            <Button
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.DANGER}
              onClick={handleRemoveImage}
              disabled={isProcessing}
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
      {isProcessing && (
        <InfoBlock>
          <InfoBlockHeader status={InfoBlockStatus.INFO} customIcon={IconName.UI_INFO_CIRCLE} />
          <InfoBlockContent>
            <Text>Traitement de l&apos;image en cours...</Text>
          </InfoBlockContent>
        </InfoBlock>
      )}
    </div>
  )
}

export default ImageUploader
