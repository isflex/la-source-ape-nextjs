/* eslint-disable no-alert */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';

const client = generateClient<Schema>();

import { useAuthenticator } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';

import {
  generateSlug,
  // prepareNewsletterDataForAPI,
  type NewsletterFormData
} from '@src/lib/newsletter-helpers';
import NewsletterForm from '@src/components/newsletter/NewsletterForm';
import AuthBanner from '@src/components/auth/AuthBanner';
import { LoadingBackdrop } from '@src/components/loading/LoadingBackdrop'

import classNames from 'classnames';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Container } from '@flex-design-system/react-ts/client-sync-styled-direct/container';
import { Section } from '@flex-design-system/react-ts/client-sync-styled-direct/section';
import {
  Table,
  TableHead,
  TableBody,
  TableTr,
  TableTh,
  TableTd
} from '@flex-design-system/react-ts/client-sync-styled-direct/table';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  InfoBlock,
  // InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import {
  IconName,
  // IconSize,
  // IconPosition,
  // IconStatus,
  // StatusIcon
} from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { default as flexStyles } from '@flex-design-system/framework';
import { debug } from '@flexiness/domain-utils';
import { useSafeAgentContext } from '@flexiness/copilotkit';

type Newsletter = {
  id: string;
  subject: string;
  slug: string;
  eventDate: string;
  publicationDate: string;
  title?: string | null;
  greetings?: string | null;
  isDeleted: boolean | null;
  createdAt: string;
  updatedAt: string;
};

export default function NewsletterCreationPage() {
  const router = useRouter();
  const { user } = useAuthenticator();
  const isAuthenticated = !!user;

  const [showForm, setShowForm] = useState(false);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedNewsletters, setSelectedNewsletters] = useState<Set<string>>(new Set());
  const [reusedNewsletterData, setReusedNewsletterData] = useState<Partial<NewsletterFormData> | null>(null);

  // CopilotKit v2: Expose page context to AI agent
  useSafeAgentContext({
    description: 'Current page context - Newsletter management page for creating and managing school newsletters',
    value: {
      page: 'newsletter/creer',
      pageTitle: 'Gestion des Newsletters',
      isAuthenticated,
      totalNewsletters: newsletters.length,
      selectedCount: selectedNewsletters.size,
      showingForm: showForm,
    },
  });

  useSafeAgentContext({
    description: 'List of existing newsletters with their details',
    value: newsletters.map(newsletter => ({
      id: newsletter.id,
      subject: newsletter.subject,
      slug: newsletter.slug,
      eventDate: newsletter.eventDate,
      publicationDate: newsletter.publicationDate,
      title: newsletter.title ?? null,
    })),
  });

  const loadNewsletters = async () => {
    try {
      setLoading(true);

      // Use observeQuery for real-time updates in admin mode
      if (isAuthenticated) {
        const { unsubscribe } = client.models.Newsletter.observeQuery({
          filter: {
            isDeleted: { eq: false }
          }
        }).subscribe({
          next: ({ items }) => {
            setNewsletters(items || []);
            setLoading(false);
          },
          error: (error) => {
            setError('Error loading newsletters');
            debug.error('Error loading newsletters:', error);
            setLoading(false);
          }
        });

        // Store unsubscribe function for cleanup
        return unsubscribe;
      } else {
        // Use API route for public display (better SEO/SSR)
        const response = await fetch('/api/newsletter/');
        const data = await response.json();

        if (response.ok) {
          setNewsletters(data.data || []);
        } else {
          setError('Failed to load newsletters');
        }
      }
    } catch (err) {
      setError('Error loading newsletters');
      debug.error('Error loading newsletters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);

    const initializeNewsletters = async () => {
      await loadNewsletters();
    };

    initializeNewsletters();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent hydration mismatch by not rendering admin-specific content until mounted
  if (!mounted) {
    return (
      <Container>
        <Section>
          <Title level={TitleLevel.LEVEL1}>
            Gestion des Newsletters
          </Title>
          <LoadingBackdrop loadingText={'Chargement...'} />
        </Section>
      </Container>
    );
  }

  const handleAdminToggle = async () => {
    const returnUrl = encodeURIComponent('/newsletter/creer/');
    if (isAuthenticated) {
      await signOut({
        global: false,
        oauth: {
          redirectUrl: `/auth/?returnUrl=${returnUrl}`
        }
      });
      setShowForm(false);
    } else {
      // Redirect to auth page for admin login/signup
      router.push(`/auth/?mode=admin&returnUrl=${returnUrl}`);
    }
  };

  const handleDeleteNewsletter = async (id: string, subject: string) => {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer cette newsletter: "${subject}" ?`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/newsletter/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadNewsletters();
      } else {
        alert('Erreur lors de la suppression de la newsletter');
      }
    } catch (err) {
      alert('Erreur lors de la suppression de la newsletter');
      debug.error('Error deleting newsletter:', err);
    }
  };

  const handleViewOnline = (newsletter: Newsletter) => {
    const now = new Date();
    const publicationDate = new Date(newsletter.publicationDate);

    if (!isAuthenticated && publicationDate > now) {
      alert("L'événement n'est pas encore publié");
      return;
    }

    // Generate URL: /newsletter/year/month/day/slug
    const eventDate = new Date(newsletter.eventDate);
    const year = eventDate.getFullYear();
    const month = String(eventDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventDate.getDate()).padStart(2, '0');

    const url = `/newsletter/${year}/${month}/${day}/${newsletter.slug}`;
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleCreateNewsletter = async (formData: NewsletterFormData) => {
    try {
      setCreateError(null);

      // Get existing slugs to avoid conflicts
      const existingSlugs = newsletters.map(n => n.slug);
      const slug = generateSlug(formData.subject, existingSlugs);

      debug.newsletter('Creating newsletter with client-side AppSync:', { formData, slug });

      // Create newsletter using Amplify client
      const { data: newsletter, errors: newsletterErrors } = await client.models.Newsletter.create({
        eventDate: formData.eventDate.toISOString(),
        subject: formData.subject,
        slug: slug,
        publicationDate: formData.publicationDate.toISOString(),
        title: formData.title,
        greetings: formData.greetings,
        isDeleted: false,
      });

      if (newsletterErrors || !newsletter) {
        debug.error('Newsletter creation errors:', newsletterErrors);
        setCreateError('Erreur lors de la création de la newsletter');
        return;
      }

      debug.newsletter('Newsletter created successfully:', newsletter);

      // Create content blocks
      if (formData.contentBlocks && formData.contentBlocks.length > 0) {
        const contentBlockPromises = formData.contentBlocks.map(async (block) => {
          const contentBlockData = {
            newsletterId: newsletter.id,
            order: block.order,
            type: block.type as Schema['EContentBlockType']['type'],
            subtitle: block.subtitle,
            href: block.href,
            content: block.content,
            paragraph: block.paragraph,
            // S3 fields (if image)
            s3Key: block.s3Key,
            s3Bucket: block.s3Bucket,
            originalFilename: block.originalFilename,
            mimeType: block.mimeType,
            fileSize: block.fileSize,
            // Legacy fields for backward compatibility
            filename: block.filename,
            filetype: block.filetype,
            encoding: block.encoding,
            path: block.path,
            contentType: block.contentType,
          };

          const { data: contentBlock, errors } = await client.models.ContentBlock.create(contentBlockData);

          if (errors) {
            debug.error('ContentBlock creation error:', errors);
          }

          return contentBlock;
        });

        await Promise.all(contentBlockPromises);
      }

      setCreateSuccess(`Newsletter "${formData.subject}" créé avec succès !`);
      setShowForm(false);
      setReusedNewsletterData(null); // Clear reused data
      // Note: observeQuery will automatically update the newsletters list

      // Clear success message after 5 seconds
      setTimeout(() => setCreateSuccess(null), 5000);
    } catch (err) {
      debug.error('Error creating newsletter:', err);
      setCreateError('Erreur lors de la création du newsletter');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCreateError(null);
  };

  const handleNewsletterSelection = (newsletterId: string, selected: boolean) => {
    setSelectedNewsletters(prev => {
      const newSelected = new Set(prev);
      if (selected) {
        newSelected.add(newsletterId);
      } else {
        newSelected.delete(newsletterId);
      }
      return newSelected;
    });
  };

  const handleReuseContent = async () => {
    if (selectedNewsletters.size === 0) {
      setCreateError('Veuillez sélectionner au moins une newsletter pour réutiliser le contenu');
      return;
    }

    try {
      // Get detailed newsletter data including content blocks
      const selectedNewsletterData = newsletters.filter(n => selectedNewsletters.has(n.id));

      if (selectedNewsletterData.length === 1) {
        // Single newsletter selected - populate form with its data
        const newsletter = selectedNewsletterData[0];

        // Fetch full newsletter data with content blocks
        const response = await fetch(`/api/newsletter/${newsletter.id}`);
        if (response.ok) {
          const { data } = await response.json();

          // Transform the newsletter data to match form format
          const formData = {
            subject: `${data.subject} (copie)`, // Add (copie) to indicate it's reused
            eventDate: new Date(), // Reset dates for new newsletter
            publicationDate: new Date(),
            title: data.title || undefined,
            greetings: data.greetings || undefined,
            contentBlocks: data.contentBlocks || []
          };

          setReusedNewsletterData(formData);
          setShowForm(true);
          setCreateSuccess(`Contenu de "${newsletter.subject}" prêt à être réutilisé. Modifiez selon vos besoins.`);
          setSelectedNewsletters(new Set()); // Clear selection
        }
      } else {
        // Multiple newsletters selected - could merge content blocks or let user choose
        setShowForm(true);
        setCreateSuccess(`${selectedNewsletters.size} newsletters sélectionnées pour réutilisation. Créez un nouveau newsletter en combinant le contenu.`);
        setSelectedNewsletters(new Set()); // Clear selection
      }
    } catch (err) {
      debug.error('Error reusing content:', err);
      setCreateError('Erreur lors de la réutilisation du contenu');
    }
  };

  // Remove the table data mapping - we'll render directly

  return (
    <>
      <AuthBanner />
      <Container>
        <Section>
          <Title level={TitleLevel.LEVEL1}>
            Gestion des Newsletters
          </Title>

          {/* Success/Error Messages */}
          {createSuccess && (
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>Succès</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>{createSuccess}</Text>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {createError && (
            <InfoBlock>
              <InfoBlockHeader status={InfoBlockStatus.DANGER} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                <Title level={TitleLevel.LEVEL3}>Erreur</Title>
              </InfoBlockHeader>
              <InfoBlockContent>
                <Text>{createError}</Text>
              </InfoBlockContent>
            </InfoBlock>
          )}

          {/* Newsletter List */}
          <Box>
            {loading ? (
              <Text className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>Chargement des newsletters...</Text>
            ) : error ? (
              <InfoBlock>
                <InfoBlockHeader status={InfoBlockStatus.DANGER} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                  <Title level={TitleLevel.LEVEL3}>Erreur</Title>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Text>{error}</Text>
                </InfoBlockContent>
              </InfoBlock>
            ) : (
              <>
                <Title level={TitleLevel.LEVEL2}>
                  Newsletters existantes
                </Title>

                {newsletters.length === 0 ? (
                  <Text>Aucune newsletter trouvée.</Text>
                ) : (
                  <Table>
                    <TableHead>
                      <TableTr>
                        <TableTh>Sujet</TableTh>
                        <TableTh>Date de publication</TableTh>
                        <TableTh>Actions</TableTh>
                      </TableTr>
                    </TableHead>
                    <TableBody>
                      {newsletters.map(newsletter => (
                        <TableTr key={newsletter.id}>
                          <TableTd>{newsletter.subject}</TableTd>
                          <TableTd>{formatDate(newsletter.publicationDate)}</TableTd>
                          <TableTd>
                            <div className={flexStyles.isFlexDirectionRow}>
                              {isAuthenticated && (
                                <input
                                  type="checkbox"
                                  title="Réutiliser le contenu"
                                  checked={selectedNewsletters.has(newsletter.id)}
                                  onChange={(e) => handleNewsletterSelection(newsletter.id, e.target.checked)}
                                />
                              )}
                              <Button
                                markup={ButtonMarkup.BUTTON}
                                variant={VariantState.SECONDARY}
                                onClick={() => handleViewOnline(newsletter)}
                              >
                                Voir en ligne
                              </Button>
                              {isAuthenticated && (
                                <Button
                                  markup={ButtonMarkup.BUTTON}
                                  variant={VariantState.DANGER}
                                  onClick={() => handleDeleteNewsletter(newsletter.id, newsletter.subject)}
                                >
                                  ✕
                                </Button>
                              )}
                            </div>
                          </TableTd>
                        </TableTr>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </>
            )}
          </Box>

          {/* Admin Controls */}
          <Box>
            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
              flexStyles.isGridItemsCenter,
              flexStyles.isFullheight,
              flexStyles.isFullwidth,
            )}>
              <Button
                markup={ButtonMarkup.BUTTON}
                variant={isAuthenticated ? VariantState.SUCCESS : VariantState.TERTIARY}
                onClick={handleAdminToggle}
              >
                {isAuthenticated ? 'Déconnexion Admin 🔓' : 'Administration 🔒'}
              </Button>

              {isAuthenticated && (
                <>
                  <Button
                    markup={ButtonMarkup.BUTTON}
                    variant={VariantState.TERTIARY}
                    onClick={handleReuseContent}
                    disabled={selectedNewsletters.size === 0}
                  >
                    Réutiliser le contenu sélectionné ({selectedNewsletters.size})
                  </Button>
                  <Button
                    markup={ButtonMarkup.BUTTON}
                    variant={showForm ? VariantState.SECONDARY : VariantState.PRIMARY}
                    onClick={() => setShowForm(!showForm)}
                  >
                    {showForm ? 'Cacher le formulaire' : 'Créer un nouveau newsletter'}
                  </Button>
                </>
              )}
            </div>
          </Box>

          {/* Newsletter Creation Form */}
          {isAuthenticated && showForm && (
            <NewsletterForm
              onSubmit={handleCreateNewsletter}
              onCancel={handleCancelForm}
              loading={loading}
              initialData={reusedNewsletterData || undefined}
            />
          )}
        </Section>
      </Container>
    </>
  );
}
