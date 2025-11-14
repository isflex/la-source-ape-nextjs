'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

import classNames from 'classnames';
import {
  Box,
  Container,
  Section,
  Title,
  TitleLevel,
  Text,
  Button,
  ButtonMarkup,
  VariantState,
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import PiscineCandidatTable from '@src/components/piscine/PiscineCandidatTable';
import { formatDayOfWeek, formatSchoolLevel } from '@src/lib/piscine-helpers';
import AuthBanner from '@src/components/auth/AuthBanner';

interface PiscineSlugPageProps {
  params: Promise<{
    slug: string[]
  }>
}

type PiscineFormData = {
  id: string;
  title: string;
  slug: string;
  dayOfWeek: Schema['EDayOfWeek']['type'];
  startTime: string;
  endTime: string;
  schoolLevel: Schema['ESchoolLevel']['type'];
  teacherName: string;
  owner: string;
};

export default function PiscineSlugPage({ params }: PiscineSlugPageProps) {
  const { user } = useAuthenticator();
  const [piscineForm, setPiscineForm] = useState<PiscineFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Check if current user is the creator of this form
  const isCreator = user?.userId && piscineForm?.owner === user.userId;

  useEffect(() => {
    const loadPiscineForm = async () => {
      try {
        const resolvedParams = await params;

        if (!resolvedParams.slug || resolvedParams.slug.length === 0) {
          setError('URL invalide');
          setIsLoading(false);
          return;
        }

        const slug = resolvedParams.slug[0]; // Take the first slug segment

        // Query for the piscine form by slug
        const { data: forms } = await client.models.PiscineForm.list({
          filter: { slug: { eq: slug } }
        });

        if (!forms || forms.length === 0) {
          setError('Planning non trouvé');
          setIsLoading(false);
          return;
        }

        setPiscineForm(forms[0]);

      } catch (error) {
        console.error('Error loading piscine form:', error);
        setError('Erreur lors du chargement');
      } finally {
        setIsLoading(false);
      }
    };

    loadPiscineForm();
  }, [params]);

  const handleMessage = (text: string, isError: boolean) => {
    setMessage({ text, isError });
    // Clear message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  const handleAuthRequired = () => {
    // Use pathname + search to avoid port issues with OAuth redirects
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/auth/?mode=user&returnUrl=${returnUrl}`;
  };

  if (isLoading) {
    return (
      <Container>
        <Section>
          <Title level={TitleLevel.LEVEL2} className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
            Chargement...
          </Title>
        </Section>
      </Container>
    );
  }

  if (error || !piscineForm) {
    return (
      <Container>
        <Box className={classNames(flexStyles.hasTextTeriary)}>
          <Section>
            <Title level={TitleLevel.LEVEL2} className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
              {error || 'Planning non trouvé'}
            </Title>
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              Le planning demandé n&apos;existe pas ou n&apos;est plus disponible.
            </p>
          </Section>
        </Box>
      </Container>
    );
  }

  return (
    <>
      {user && <AuthBanner />}
      <Container>
        <Section>
          {/* Success/Error Messages */}
          {message && (
            <InfoBlock>
              <InfoBlockHeader>
                <Title level={TitleLevel.LEVEL3}>
                  {message.isError ? 'Erreur' : 'Succès'}
                </Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>{message.text}</Text>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {/* Header */}
          <div>
            <Title level={TitleLevel.LEVEL1}>
              {piscineForm.title}
            </Title>

            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap2,
              flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
              flexStyles.isMarginBottom4
            )}>
              <div>
                <Text><strong>Jour:</strong> {formatDayOfWeek(piscineForm.dayOfWeek)}</Text>
                <Text><strong>Horaires:</strong> {piscineForm.startTime} - {piscineForm.endTime}</Text>
              </div>
              <div>
                <Text><strong>Niveau:</strong> {formatSchoolLevel(piscineForm.schoolLevel)}</Text>
                <Text><strong>Enseignant:</strong> {piscineForm.teacherName}</Text>
              </div>
            </div>
          </div>

          {/* Creator Badge */}
          {isCreator && (
            <InfoBlock>
              <InfoBlockHeader>
                <Title level={TitleLevel.LEVEL3}>Mode Créateur</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>Vous êtes le créateur de ce planning. Vous pouvez modifier et supprimer les inscriptions.</Text>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {/* Candidat Table */}
          <PiscineCandidatTable
            piscineFormId={piscineForm.id}
            isCreatorMode={!!isCreator}
            isAuthenticated={!!user}
            onMessage={handleMessage}
            onAuthRequired={handleAuthRequired}
            piscineFormData={{
              title: piscineForm.title,
              dayOfWeek: formatDayOfWeek(piscineForm.dayOfWeek),
              startTime: piscineForm.startTime,
              endTime: piscineForm.endTime,
              schoolLevel: formatSchoolLevel(piscineForm.schoolLevel),
              teacherName: piscineForm.teacherName
            }}
          />
        </Section>
      </Container>
    </>
  );
}
