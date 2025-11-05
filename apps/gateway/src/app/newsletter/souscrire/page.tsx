'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import DOMPurify from 'dompurify';

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
const client = generateClient<Schema>();

import classNames from 'classnames';
import {
  Box,
  Button,
  ButtonMarkup,
  Container,
  Divider,
  Section,
  Title,
  TitleLevel,
  VariantState,
  InfoBlock,
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
  Input,
  View,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';

// Zod validation schema for Newsletter signup
const NewsletterSignupSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Format email invalide'),
  firstName: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Prénom requis')),
  lastName: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Nom de famille requis')),
});

// Zod validation schema for Newsletter unsubscribe
const NewsletterUnsubscribeSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Format email invalide'),
});

type NewsletterSignupFormData = z.infer<typeof NewsletterSignupSchema>;
type NewsletterUnsubscribeFormData = z.infer<typeof NewsletterUnsubscribeSchema>;

export default function NewsletterSignupForm() {
  const router = useRouter();
  const [isUnsubscribeMode, setIsUnsubscribeMode] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<NewsletterSignupFormData>({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [unsubscribeEmail, setUnsubscribeEmail] = React.useState<string>('');

  const [hasError, setHasError] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  // Helper function to get field-specific errors by path
  const getFieldErrors = (fieldPath: string) => {
    return fieldErrors[fieldPath] || [];
  };

  const handleInputChange = (field: keyof NewsletterSignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateAndSubmit = async () => {
    try {
      setValidationErrors([]);
      setFieldErrors({});
      setIsSubmitting(true);
      setHasError(false);

      if (isUnsubscribeMode) {
        // Handle unsubscribe
        const validatedData = NewsletterUnsubscribeSchema.parse({ email: unsubscribeEmail });

        // Find existing subscription
        const existingSubscriptions = await client.models.NewsletterSubscription.list({
          filter: {
            email: {
              eq: validatedData.email
            },
            isActive: {
              eq: true
            }
          }
        });

        if (!existingSubscriptions.data || existingSubscriptions.data.length === 0) {
          setValidationErrors(['Cette adresse email n\'est pas abonnée à notre newsletter.']);
          return;
        }

        // Update subscription to inactive
        const subscription = existingSubscriptions.data[0];
        await client.models.NewsletterSubscription.update({
          id: subscription.id,
          isActive: false,
        });

        setIsSuccess(true);
        setUnsubscribeEmail('');
        setFieldErrors({});
        setValidationErrors([]);
      } else {
        // Handle subscribe
        const validatedData = NewsletterSignupSchema.parse(formData);

        // Check if email already exists
        const existingSubscriptions = await client.models.NewsletterSubscription.list({
          filter: {
            email: {
              eq: validatedData.email
            }
          }
        });

        if (existingSubscriptions.data && existingSubscriptions.data.length > 0) {
          setValidationErrors(['Cette adresse email est déjà abonnée à notre newsletter.']);
          return;
        }

        // Create Newsletter Subscription
        const response = await client.models.NewsletterSubscription.create({
          email: validatedData.email,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          subscribedAt: new Date().toISOString(),
          isActive: true,
        });

        if (response.data) {
          setIsSuccess(true);
          setFormData({
            email: '',
            firstName: '',
            lastName: '',
          });
          setFieldErrors({});
          setValidationErrors([]);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Create field-specific error mapping using Zod paths
        const newFieldErrors: Record<string, string[]> = {};

        error.errors.forEach(err => {
          const path = err.path.join('.');
          if (!newFieldErrors[path]) {
            newFieldErrors[path] = [];
          }
          newFieldErrors[path].push(err.message);
        });

        setFieldErrors(newFieldErrors);
        setValidationErrors(error.errors.map(e => e.message));
      } else {
        console.error('Erreur lors de la soumission:', error);
        setValidationErrors(['Erreur lors de la soumission du formulaire']);
        setFieldErrors({});
        setHasError(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasError) {
    return (
      <InfoBlock>
        <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
          <Title level={TitleLevel.LEVEL3}>{`AWS Amplify n'est pas configuré`}</Title>
        </InfoBlockHeader>
        <InfoBlockContent>
          <Title level={TitleLevel.LEVEL4}>
            Pensez à créer vos identifiants de connexion à AWS Amplify pour utiliser cette page.
          </Title>
        </InfoBlockContent>
      </InfoBlock>
    );
  }

  if (isSuccess) {
    return (
      <View>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <Box className={classNames(flexStyles.hasTextTeriary)}>
            <Section>
              <InfoBlock>
                <InfoBlockHeader status={InfoBlockStatus.SUCCESS} customIcon={IconName.UI_CHECK_CIRCLE}>
                  <Title level={TitleLevel.LEVEL3}>
                    {isUnsubscribeMode ? 'Désabonnement réussi !' : 'Inscription réussie !'}
                  </Title>
                </InfoBlockHeader>
                <InfoBlockContent>
                  <Title level={TitleLevel.LEVEL4}>
                    {isUnsubscribeMode
                      ? 'Vous êtes maintenant désabonné(e) de notre newsletter. Vous ne recevrez plus d\'emails de notre part.'
                      : 'Merci pour votre inscription à notre newsletter. Vous recevrez bientôt les dernières informations de l\'APE La Source.'
                    }
                  </Title>
                  <div className={classNames(
                    flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                    // flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                    flexStyles.isGridCols1,
                    flexStyles.isGridItemsCenter,
                    flexStyles.isFullheight,
                    flexStyles.isFullwidth,
                  )} style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                    {/*
                    <Button
                      id="newsletter-view-latest-success"
                      variant={VariantState.PRIMARY}
                      markup={ButtonMarkup.BUTTON}
                      onClick={() => router.push('/newsletter/2025-26/presentation-web-app')}
                    >
                      Voir la dernière newsletter
                    </Button>
                    */}
                    <Button
                      id="newsletter-toggle-mode-success"
                      variant={VariantState.SECONDARY}
                      markup={ButtonMarkup.BUTTON}
                      onClick={() => {
                        setIsSuccess(false);
                        setIsUnsubscribeMode(!isUnsubscribeMode);
                      }}
                    >
                      {isUnsubscribeMode ? 'S\'inscrire au newsletter' : 'Se désabonner'}
                    </Button>
                  </div>
                </InfoBlockContent>
              </InfoBlock>
            </Section>
          </Box>
        </div>
      </View>
    );
  }

  return (
    <View>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <Box className={classNames(flexStyles.hasTextTeriary)}>
          <Section>
            <div className={flexStyles.hasTextTeriary} style={{ marginBottom: '3rem' }}>
              <div className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
                <Icon size={IconSize.LARGE} position={IconPosition.UP} name={IconName.MAIL} />
              </div>
              {isUnsubscribeMode ? (
                <Title level={TitleLevel.LEVEL3} className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
                  Nous sommes désolés de vous voir partir, mais nous espérons vous revoir bientôt.
                </Title>
              ) : (
                <>
                  <Title level={TitleLevel.LEVEL3} className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
                    Restez informé(e) des derniers événements de l&apos;APE La Source
                  </Title>
                  <Title level={TitleLevel.LEVEL5} className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>
                    En vous abonnant à la newsletter, vous acceptez de recevoir des e-mails de <strong style={{ color: '#0055a4', }}>{`${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}</strong>.
                    Veuillez ajouter cette adresse à vos contacts pour ne rien manquer. Vous pouvez vous désabonner à tout moment sur cette page.
                  </Title>
                </>
              )}
            </div>
            <div id={isUnsubscribeMode ? "newsletter-signout-form" : "newsletter-signup-form"}>
              {isUnsubscribeMode ? (
                // Unsubscribe form
                <div>
                  <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                    Adresse e-mail à désabonner *
                  </Title>
                  <div className={classNames(
                    flexStyles.isGridDisplayGrid,
                    flexStyles.isGridItemsStart,
                    flexStyles.isFullheight,
                  )} style={{ marginTop: '1rem' }}>
                    <Input
                      id="newsletter-unsubscribe-email"
                      placeholder="Votre adresse email"
                      value={unsubscribeEmail}
                      onChange={(e) => setUnsubscribeEmail(e.inputValue)}
                    />
                    {getFieldErrors('email').map((error, errorIndex) => (
                      <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                        <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                        <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                // Signup form
                <>
                  {/* Email Section */}
                  <div>
                    <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                      1. Adresse e-mail *
                    </Title>
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid,
                      flexStyles.isGridItemsStart,
                      flexStyles.isFullheight,
                    )} style={{ marginTop: '1rem' }}>
                      <Input
                        id="newsletter-email"
                        placeholder="Votre adresse email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.inputValue)}
                      />
                      {getFieldErrors('email').map((error, errorIndex) => (
                        <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                          <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                          <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                        </span>
                      ))}
                    </div>
                  </div>

                  <Divider />

                  {/* First Name Section */}
                  <div>
                    <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                      2. Prénom *
                    </Title>
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid,
                      flexStyles.isGridItemsStart,
                      flexStyles.isFullheight,
                    )} style={{ marginTop: '1rem' }}>
                      <Input
                        id="newsletter-firstName"
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.inputValue)}
                      />
                      {getFieldErrors('firstName').map((error, errorIndex) => (
                        <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                          <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                          <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                        </span>
                      ))}
                    </div>
                  </div>

                  <Divider />

                  {/* Last Name Section */}
                  <div>
                    <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                      3. Nom de famille *
                    </Title>
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid,
                      flexStyles.isGridItemsStart,
                      flexStyles.isFullheight,
                    )} style={{ marginTop: '1rem' }}>
                      <Input
                        id="newsletter-lastName"
                        placeholder="Votre nom de famille"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.inputValue)}
                      />
                      {getFieldErrors('lastName').map((error, errorIndex) => (
                        <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                          <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                          <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Form Errors Section */}
              {validationErrors.length > 0 && (
                <div>
                  <InfoBlock>
                    <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                      <Title level={TitleLevel.LEVEL3}>{`Erreur(s) dans le formulaire !!`}</Title>
                    </InfoBlockHeader>
                    <InfoBlockContent>
                      <Title level={TitleLevel.LEVEL5}>
                        {validationErrors.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                      </Title>
                    </InfoBlockContent>
                  </InfoBlock>
                </div>
              )}
            </div>

            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
              flexStyles.isGridItemsCenter,
              flexStyles.isFullheight,
              flexStyles.isFullwidth,
            )} style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              <Button
                id={isUnsubscribeMode ? "newsletter-unsubscribe-submit" : "newsletter-submit"}
                onClick={validateAndSubmit}
                variant={VariantState.PRIMARY}
                markup={ButtonMarkup.BUTTON}
                disabled={isSubmitting}
              >
                <span style={{ marginBottom: '2rem' }}>
                  {isSubmitting
                    ? (isUnsubscribeMode ? 'Désabonnement en cours...' : 'Inscription en cours...')
                    : (isUnsubscribeMode ? 'Se désabonner de la newsletter' : 'S\'inscrire à la newsletter')
                  }
                </span>
              </Button>
              <Button
                id="newsletter-toggle-mode"
                variant={VariantState.SECONDARY}
                markup={ButtonMarkup.BUTTON}
                onClick={() => {
                  setIsUnsubscribeMode(!isUnsubscribeMode);
                  setValidationErrors([]);
                  setFieldErrors({});
                }}
              >
                {isUnsubscribeMode ? 'S\'inscrire au newsletter' : 'Se désabonner'}
              </Button>
            </div>
          </Section>
        </Box>
      </div>
    </View>
  );
}
