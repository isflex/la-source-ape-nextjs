'use client';

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import {
  Box,
  Button,
  ButtonMarkup,
  Divider,
  Input,
  type InputChangeEvent,
  Textarea,
  type TextareaChangeEvent,
  Title,
  TitleLevel,
  Text,
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
  StatusIcon,
  Section,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import ContentBlockForm, { ContentBlock, ContentBlockType } from './ContentBlockForm';
import { NewsletterSchema, type NewsletterFormData } from '@src/lib/newsletter-helpers';
import NewsletterDatePicker from './NewsletterDatePicker';
import { z } from 'zod';

// Use NewsletterFormData from Zod schema instead of custom interface

interface NewsletterFormErrors {
  general?: string;
  fields?: Record<string, string>;
}

interface NewsletterFormProps {
  onSubmit: (data: NewsletterFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<NewsletterFormData>;
}

const INITIAL_FORM_DATA: NewsletterFormData = {
  subject: '',
  eventDate: new Date(),
  publicationDate: new Date(),
  title: undefined,
  greetings: undefined,
  contentBlocks: [],
};

export default function NewsletterForm({ onSubmit, onCancel, loading = false, initialData }: NewsletterFormProps) {
  const [formData, setFormData] = useState<NewsletterFormData>({
    ...INITIAL_FORM_DATA,
    ...initialData
  });
  const [errors, setErrors] = useState<NewsletterFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
  };

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...INITIAL_FORM_DATA,
        ...initialData
      });
    }
  }, [initialData]);

  // Helper function to convert Zod errors to user-friendly format
  const handleZodErrors = (error: z.ZodError): NewsletterFormErrors => {
    const fields: Record<string, string> = {};

    error.errors.forEach(err => {
      const path = err.path.join('.');
      fields[path] = err.message;
    });

    return { fields };
  };

  // Helper function to get field error
  const getFieldError = (fieldName: string): string | undefined => {
    return errors.fields?.[fieldName];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setErrors({});

      // Validate with Zod schema
      const validatedData = NewsletterSchema.parse(formData);

      await onSubmit(validatedData);
      resetForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(handleZodErrors(error));
      } else {
        setErrors({
          general: 'Erreur lors de la création du newsletter. Veuillez réessayer.'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const addContentBlock = () => {
    const newBlock: ContentBlock = {
      type: '' as ContentBlockType,
      content: '',
      order: formData.contentBlocks.length,
    };

    setFormData(prev => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, newBlock]
    }));
  };

  const updateContentBlock = (index: number, updatedBlock: ContentBlock) => {
    setFormData(prev => {
      const newBlocks = [...prev.contentBlocks];
      newBlocks[index] = updatedBlock;
      return {
        ...prev,
        contentBlocks: newBlocks
      };
    });

    // Clear errors for this block if they exist
    if (errors.fields) {
      const newFields = { ...errors.fields };
      // Remove any errors for this content block
      Object.keys(newFields).forEach(key => {
        if (key.startsWith(`contentBlocks.${index}.`)) {
          delete newFields[key];
        }
      });
      setErrors(prev => ({
        ...prev,
        fields: newFields
      }));
    }
  };

  const removeContentBlock = (index: number) => {
    setFormData(prev => {
      const newBlocks = prev.contentBlocks.filter((_, i) => i !== index);
      // Update order for remaining blocks
      return {
        ...prev,
        contentBlocks: newBlocks.map((block, i) => ({ ...block, order: i }))
      };
    });

    // Remove errors for this block and reindex remaining blocks
    if (errors.fields) {
      const newFields = { ...errors.fields };
      // Remove errors for the deleted block
      Object.keys(newFields).forEach(key => {
        if (key.startsWith(`contentBlocks.${index}.`)) {
          delete newFields[key];
        }
      });
      // Reindex errors for blocks that moved up
      const reindexedFields: Record<string, string> = {};
      Object.entries(newFields).forEach(([key, value]) => {
        const match = key.match(/^contentBlocks\.(\d+)\.(.*)/);
        if (match) {
          const blockIndex = parseInt(match[1]);
          if (blockIndex > index) {
            // Move this error up by one index
            reindexedFields[`contentBlocks.${blockIndex - 1}.${match[2]}`] = value;
          } else {
            reindexedFields[key] = value;
          }
        } else {
          reindexedFields[key] = value;
        }
      });
      setErrors(prev => ({
        ...prev,
        fields: reindexedFields
      }));
    }
  };

  const moveContentBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= formData.contentBlocks.length) {
      return;
    }

    setFormData(prev => {
      const newBlocks = [...prev.contentBlocks];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[newIndex];
      newBlocks[newIndex] = temp;

      // Update order
      return {
        ...prev,
        contentBlocks: newBlocks.map((block, i) => ({ ...block, order: i }))
      };
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box>
          <Title level={TitleLevel.LEVEL2} className={flexStyles.isMarginBottom3}>
            Formulaire de création de newsletter
          </Title>

          {errors.general && (
            <InfoBlock className={flexStyles.isMarginBottom3}>
              <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>Erreur</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>{errors.general}</Text>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {/* Basic Information Section */}
          <div>

            <Title level={TitleLevel.LEVEL3}>
              Informations de base
            </Title>

            {/* Subject */}
            <div>
              <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                Sujet <span className={flexStyles.hasTextDanger}>*</span>
              </Title>
              <div className={classNames(
                flexStyles.isGridDisplayGrid,
                flexStyles.isGridItemsStart,
                flexStyles.isFullheight,
              )} style={{ marginTop: '1rem' }}>
                <Input
                  id="newsletter-subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e: InputChangeEvent) => setFormData(prev => ({ ...prev, subject: e.inputValue }))}
                  placeholder="Sujet du newsletter..."
                  className={getFieldError('subject') ? flexStyles.hasTextDanger : ''}
                />
                {getFieldError('subject') && (
                  <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
                    {getFieldError('subject')}
                  </div>
                )}
                <div className={classNames(flexStyles.help, flexStyles.isInfo, flexStyles.isFullwidth, flexStyles.hasTextSmall)}>
                  <Icon
                    content={`Information non visible dans le contenu mais qui sera utilisée comme objet de l'e-mail.`}
                    size={IconSize.SMALL}
                    position={IconPosition.LEFT}
                    name={IconName.UI_INFO_CIRCLE}
                  />
                </div>
              </div>
            </div>

            <Divider/>

            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
              flexStyles.isGridItemsStart,
              flexStyles.isFullheight,
              flexStyles.isFullwidth,
            )}>
              <div>
                {/* Event Date */}
                <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                  Date de l&apos;événement <span className={flexStyles.hasTextDanger}>*</span>
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridItemsStart,
                  flexStyles.isFullheight,
                )} style={{ marginTop: '1rem' }}>
                  <NewsletterDatePicker
                    id="newsletter-event-date"
                    value={formData.eventDate.toISOString().split('T')[0]} // Convert Date to YYYY-MM-DD
                    onChange={(dateString) => setFormData(prev => ({ ...prev, eventDate: new Date(dateString) }))}
                    placeholder="Sélectionner la date d'événement"
                    hasError={!!getFieldError('eventDate')}
                    minDate={new Date()} // Event date cannot be in the past
                  />
                  {getFieldError('eventDate') && (
                    <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
                      {getFieldError('eventDate')}
                    </div>
                  )}
                  <div className={classNames(flexStyles.help, flexStyles.isInfo, flexStyles.isFullwidth, flexStyles.hasTextSmall)}>
                    <Icon
                      content={`Date à laquelle aura lieu l'événement du newsletter.`}
                      size={IconSize.SMALL}
                      position={IconPosition.LEFT}
                      name={IconName.UI_INFO_CIRCLE}
                    />
                  </div>
                </div>
              </div>

              <div>
                {/* Publication Date */}
                <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                  Date de publication <span className={flexStyles.hasTextDanger}>*</span>
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridItemsStart,
                  flexStyles.isFullheight,
                )} style={{ marginTop: '1rem' }}>
                  <NewsletterDatePicker
                    id="newsletter-publication-date"
                    value={formData.publicationDate.toISOString().split('T')[0]} // Convert Date to YYYY-MM-DD
                    onChange={(dateString) => setFormData(prev => ({ ...prev, publicationDate: new Date(dateString) }))}
                    placeholder="Sélectionner la date de publication"
                    hasError={!!getFieldError('publicationDate')}
                    minDate={new Date()} // Publication date cannot be in the past
                    maxDate={formData.eventDate} // Cannot be after event date
                  />
                  {getFieldError('publicationDate') && (
                    <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
                      {getFieldError('publicationDate')}
                    </div>
                  )}
                  <div className={classNames(flexStyles.help, flexStyles.isInfo, flexStyles.isFullwidth, flexStyles.hasTextSmall)}>
                    <Icon
                      content={`Date à partir de laquelle la newsletter sera visible en ligne et envoyée à la liste de diffusion.`}
                      size={IconSize.SMALL}
                      position={IconPosition.LEFT}
                      name={IconName.UI_INFO_CIRCLE}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Divider/>

            {/* Optional Title */}
            <div>
              <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                Titre en tête (optionnel)
              </Title>
              <div className={classNames(
                flexStyles.isGridDisplayGrid,
                flexStyles.isGridItemsStart,
                flexStyles.isFullheight,
              )} style={{ marginTop: '1rem' }}>
                <Textarea
                  id="newsletter-title"
                  defaultValue={formData.title || ''}
                  onChange={(e: TextareaChangeEvent) => setFormData(prev => ({ ...prev, title: e.textareaValue || undefined }))}
                  placeholder="Titre principale pour l'affichage..."
                />
              </div>
            </div>

            <Divider/>

            {/* Optional Greetings */}
            <div>
              <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                Message d&apos;accueil (optionnel)
              </Title>
              <div className={classNames(
                flexStyles.isGridDisplayGrid,
                flexStyles.isGridItemsStart,
                flexStyles.isFullheight,
              )} style={{ marginTop: '1rem' }}>
                <Input
                  id="newsletter-greetings"
                  type="text"
                  value={formData.greetings || ''}
                  onChange={(e: InputChangeEvent) => setFormData(prev => ({ ...prev, greetings: e.inputValue || undefined }))}
                  placeholder="Message d'accueil..."
                />
              </div>
            </div>

          </div>

          <Divider/>

          {/* Content Blocks Section */}
          <div>
            <Title level={TitleLevel.LEVEL3}>
              Blocs de contenu
            </Title>

            <div id="content-blocks-container">
              {formData.contentBlocks.map((block, index) => (
                <ContentBlockForm
                  key={index}
                  block={block}
                  index={index}
                  onUpdate={updateContentBlock}
                  onRemove={removeContentBlock}
                  onMoveUp={(i) => moveContentBlock(i, 'up')}
                  onMoveDown={(i) => moveContentBlock(i, 'down')}
                  canMoveUp={index > 0}
                  canMoveDown={index < formData.contentBlocks.length - 1}
                  errors={{
                    type: getFieldError(`contentBlocks.${index}.type`),
                    content: getFieldError(`contentBlocks.${index}.content`)
                  }}
                />
              ))}

              <Button
                id="add-content-block-btn"
                markup={ButtonMarkup.BUTTON}
                variant={VariantState.SECONDARY}
                onClick={addContentBlock}

              >
                + Ajouter un bloc
              </Button>
            </div>
          </div>
        </Box>

        {/* Form Actions */}
        <Box>
          <div className={classNames(
            flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
            flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
            flexStyles.isGridItemsCenter,
            flexStyles.isFullheight,
            flexStyles.isFullwidth,
          )}>
            <Button
              id="create-newsletter-btn"
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.PRIMARY}
              type="submit"
              disabled={submitting || loading}
              className={flexStyles.isMarginRight2}
            >
              {submitting ? 'Création en cours...' : 'Créer le newsletter'}
            </Button>

            <Button
              id="cancel-form-btn"
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.SECONDARY}
              onClick={handleCancel}
              disabled={submitting}
            >
              Annuler
            </Button>
          </div>
        </Box>
      </form>
    </div>
  );
}
