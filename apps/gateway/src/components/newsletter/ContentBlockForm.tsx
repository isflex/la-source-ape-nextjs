'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonMarkup,
  Input,
  Select,
  type SelectChangeEvent,
  Textarea,
  type TextareaChangeEvent,
  VariantState,
  Text,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import { type ContentBlockData } from '@src/lib/newsletter-helpers';
import ImageUploader, { type ImageData } from './ImageUploader';
import S3ImageUploader, { type S3ImageData } from './S3ImageUploader';
import type { Schema } from '@amplify/data/resource';

// Use ContentBlockData from Zod schema for type safety
export type ContentBlockType = Schema['EContentBlockType']['type'];
export type ContentBlock = ContentBlockData;

interface ContentBlockFormProps {
  block: ContentBlock;
  index: number;
  onUpdate: (index: number, block: ContentBlock) => void;
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  errors?: {
    type?: string;
    content?: string;
  };
}

const CONTENT_BLOCK_TYPES: { value: ContentBlockType; label: string; description: string }[] = [
  { value: 'LEFT_ALIGNED_TEXT', label: 'Texte aligné à gauche', description: 'Texte standard aligné à gauche' },
  { value: 'LEFT_ALIGNED_URL', label: 'Lien aligné à gauche', description: 'Lien cliquable aligné à gauche' },
  { value: 'CENTRED_TEXT', label: 'Texte centré', description: 'Texte centré sur la page' },
  { value: 'CENTERED_URL', label: 'Lien centré', description: 'Lien cliquable centré' },
  { value: 'CENTRED_IMAGE', label: 'Image centrée', description: 'URL d\'image centrée' },
];

export default function ContentBlockForm({
  block,
  index,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  errors = {}
}: ContentBlockFormProps) {
  const [hasInteractedWithType, setHasInteractedWithType] = useState(false);

  const handleTypeChange = (e: SelectChangeEvent) => {
    setHasInteractedWithType(true);
    onUpdate(index, {
      ...block,
      type: e.selectValue as ContentBlockType
    });
  };

  const handleTextareaContentChange = (e: TextareaChangeEvent): void => {
    onUpdate(index, {
      ...block,
      content: e.textareaValue
    });
  };

  const handleImageSelect = (imageData: ImageData | null) => {
    if (imageData) {
      onUpdate(index, {
        ...block,
        content: imageData.content,
        filename: imageData.filename,
        filetype: imageData.filetype,
        encoding: imageData.encoding,
        // Store dimensions for potential future use
        subtitle: `${imageData.width}x${imageData.height}px, ${Math.round(imageData.size / 1024)}KB`
      });
    } else {
      onUpdate(index, {
        ...block,
        content: '',
        filename: undefined,
        filetype: undefined,
        encoding: undefined,
        subtitle: undefined
      });
    }
  };

  const handleS3ImageSelect = (imageData: S3ImageData | null) => {
    if (imageData) {
      onUpdate(index, {
        ...block,
        // Store S3 information in new schema fields
        s3Key: imageData.s3Key,
        s3Bucket: imageData.s3Bucket,
        originalFilename: imageData.originalFilename,
        mimeType: imageData.mimeType,
        fileSize: imageData.fileSize,
        // Clear legacy base64 fields
        content: '', // No longer store base64
        filename: undefined,
        filetype: undefined,
        encoding: undefined,
        // Store display info
        subtitle: `${imageData.width}x${imageData.height}px, ${Math.round(imageData.fileSize / 1024)}KB`
      });
    } else {
      onUpdate(index, {
        ...block,
        // Clear all image-related fields
        content: '',
        s3Key: undefined,
        s3Bucket: undefined,
        originalFilename: undefined,
        mimeType: undefined,
        fileSize: undefined,
        filename: undefined,
        filetype: undefined,
        encoding: undefined,
        subtitle: undefined
      });
    }
  };

  const isUrlType = block.type === 'LEFT_ALIGNED_URL' || block.type === 'CENTERED_URL';
  const isImageType = block.type === 'CENTRED_IMAGE';
  const contentLabel = isUrlType ? 'URL' : isImageType ? 'Image' : 'Contenu';
  const contentPlaceholder = isUrlType
    ? 'https://exemple.com'
    : 'Saisissez le contenu du bloc...';

  return (
    <Box
      data-testid={`content-block-${index}`}
      className={`${flexStyles.isMarginBottom3} ${flexStyles.isPadding3} ${flexStyles.hasBorderGrey} ${flexStyles.hasBackgroundLightGrey}`}
    >
      {/* Header with move buttons and remove */}
      <Box className={`${flexStyles.isFlexDirectionRow} ${flexStyles.isJustifyContentBetween} ${flexStyles.isAlignItemsCenter} ${flexStyles.isMarginBottom2}`}>
        <div className={flexStyles.hasTextBold}>
          Bloc de contenu #{index + 1}
        </div>
        <div className={flexStyles.isFlexDirectionRow}>
          {canMoveUp && (
            <Button
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.SECONDARY}
              onClick={() => onMoveUp(index)}
              data-testid={`move-up-${index}`}
              className={flexStyles.isMarginRight1}
              title="Déplacer vers le haut"
            >
              ↑
            </Button>
          )}
          {canMoveDown && (
            <Button
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.SECONDARY}
              onClick={() => onMoveDown(index)}
              data-testid={`move-down-${index}`}
              className={flexStyles.isMarginRight2}
              title="Déplacer vers le bas"
            >
              ↓
            </Button>
          )}
          <Button
            markup={ButtonMarkup.BUTTON}
            variant={VariantState.DANGER}
            onClick={() => onRemove(index)}
            data-testid={`remove-block-${index}`}
            className={flexStyles.hasTextSmall}
            title="Supprimer ce bloc"
          >
            ✕
          </Button>
        </div>
      </Box>

      {/* Type selection */}
      <Box>
        <Text>
          <label htmlFor={`content-block-type-${index}`}>Type de bloc</label>
        </Text>
        <Select dynamicPlaceholder
          id={`content-block-type-${index}`}
          data-testid={`content-block-type-${index}`}
          value={block.type || ''}
          onChange={handleTypeChange}
          className={`${flexStyles.isFullwidth} ${errors.type ? flexStyles.hasTextDanger : ''}`}
        >
          <option value="">Sélectionner un type...</option>
          {CONTENT_BLOCK_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
        {errors.type && hasInteractedWithType && (
          <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
            {errors.type}
          </div>
        )}
        {block.type && (
          <div className={`${flexStyles.hasTextSecondary} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
            {CONTENT_BLOCK_TYPES.find(t => t.value === block.type)?.description}
          </div>
        )}
      </Box>

      {/* Content input */}
      <Box>
        <Text>
          <label htmlFor={`content-block-content-${index}`}>
            {contentLabel}
            {(isUrlType || isImageType) && <span className={flexStyles.hasTextDanger}> *</span>}
          </label>
        </Text>

        {isImageType ? (
          <S3ImageUploader
            onImageSelect={handleS3ImageSelect}
            currentImage={block.s3Key ? {
              s3Key: block.s3Key,
              s3Bucket: block.s3Bucket || '',
              originalFilename: block.originalFilename || 'image',
              mimeType: block.mimeType || 'image/jpeg',
              fileSize: block.fileSize || 0,
              width: 0, // Extract from subtitle if needed
              height: 0, // Extract from subtitle if needed
            } : null}
          />
        ) : (
          <Textarea
            id={`content-block-content-${index}`}
            data-testid={`content-block-content-${index}`}
            defaultValue={block.content || ''}
            onChange={handleTextareaContentChange}
            placeholder={contentPlaceholder}
            className={errors.content ? flexStyles.hasTextDanger : ''}
          />
        )}

        {errors.content && (
          <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
            {errors.content}
          </div>
        )}
        {isUrlType && block.content && block.content.trim() && (
          <div className={`${flexStyles.hasTextSecondary} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
            Aperçu: <a href={block.content} target="_blank" rel="noopener noreferrer">{block.content}</a>
          </div>
        )}
        {isImageType && block.subtitle && (
          <div className={`${flexStyles.hasTextSecondary} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
            Dimensions: {block.subtitle}
          </div>
        )}
      </Box>
    </Box>
  );
}
