'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonMarkup,
  Title,
  TitleLevel,
  Text,
  VariantState,
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';

interface NewsletterFormData {
  subject: string;
  eventDate: string;
  publicationDate: string;
  title: string;
  greetings: string;
  contentBlocks: Array<{
    type: string;
    content: string;
    order: number;
  }>;
}

interface SimpleNewsletterFormProps {
  onSubmit: (data: NewsletterFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function SimpleNewsletterForm({ onSubmit, onCancel, loading = false }: SimpleNewsletterFormProps) {
  const [formData, setFormData] = useState<NewsletterFormData>({
    subject: '',
    eventDate: '',
    publicationDate: '',
    title: '',
    greetings: '',
    contentBlocks: [],
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      setErrors('Le sujet est requis');
      return;
    }

    if (!formData.eventDate) {
      setErrors('La date d\'événement est requise');
      return;
    }

    if (!formData.publicationDate) {
      setErrors('La date de publication est requise');
      return;
    }

    try {
      setSubmitting(true);
      setErrors(null);
      await onSubmit({
        ...formData,
        contentBlocks: [{ type: 'LEFT_ALIGNED_TEXT', content: formData.greetings || 'Newsletter content', order: 0 }]
      });
    } catch (error) {
      setErrors('Erreur lors de la création du newsletter');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Title level={TitleLevel.LEVEL2} className={flexStyles.isMarginBottom3}>
        Créer un nouveau newsletter
      </Title>

      {errors && (
        <InfoBlock className={flexStyles.isMarginBottom3}>
          <InfoBlockHeader>
            <Title level={TitleLevel.LEVEL3}>Erreur</Title>
          </InfoBlockHeader>
          <InfoBlockContent>
            <Text>{errors}</Text>
          </InfoBlockContent>
        </InfoBlock>
      )}

      <form onSubmit={handleSubmit}>
        <Box>
          <Text>
            <label htmlFor="newsletter-subject">Sujet *</label>
          </Text>
          <input
            id="newsletter-subject"
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Sujet du newsletter..."
            className={flexStyles.isFullwidth}
            required
          />
        </Box>

        <Box>
          <Text>
            <label htmlFor="newsletter-event-date">Date de l&apos;événement *</label>
          </Text>
          <input
            id="newsletter-event-date"
            type="date"
            value={formData.eventDate}
            onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
            className={flexStyles.isFullwidth}
            required
          />
        </Box>

        <Box>
          <Text>
            <label htmlFor="newsletter-publication-date">Date de publication *</label>
          </Text>
          <input
            id="newsletter-publication-date"
            type="date"
            value={formData.publicationDate}
            onChange={(e) => setFormData(prev => ({ ...prev, publicationDate: e.target.value }))}
            className={flexStyles.isFullwidth}
            required
          />
        </Box>

        <Box>
          <Text>
            <label htmlFor="newsletter-title">Titre optionnel</label>
          </Text>
          <input
            id="newsletter-title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Titre optionnel..."
            className={flexStyles.isFullwidth}
          />
        </Box>

        <Box>
          <Text>
            <label htmlFor="newsletter-greetings">Contenu</label>
          </Text>
          <textarea
            id="newsletter-greetings"
            value={formData.greetings}
            onChange={(e) => setFormData(prev => ({ ...prev, greetings: e.target.value }))}
            placeholder="Contenu du newsletter..."
            rows={6}
            className={flexStyles.isFullwidth}
          />
        </Box>

        <Box className={flexStyles.isFlexDirectionRow}>
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
            onClick={onCancel}
            disabled={submitting}
          >
            Annuler
          </Button>
        </Box>
      </form>
    </Box>
  );
}
