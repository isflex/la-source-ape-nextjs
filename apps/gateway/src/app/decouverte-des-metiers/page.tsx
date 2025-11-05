'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import DOMPurify from 'dompurify';
import parsePhoneNumberFromString from 'libphonenumber-js';

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import type { SelectionSet } from 'aws-amplify/data';
const client = generateClient<Schema>();

import { seedCareerDiscoveryTemplate } from '@src/lib/seed-career-discovery';
import {
  isAdminAuthenticated,
  setAdminAuthenticated,
  promptAdminPassword,
  logoutAdmin
} from '@src/lib/admin-auth';

import classNames from 'classnames';
import {
  Box,
  Button,
  ButtonMarkup,
  Container,
  Divider,
  Section,
  Text,
  Title,
  TitleLevel,
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
  Input,
  Radio,
  Rows,
  RowItem,
  Textarea,
  Link,
  View,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';

// Mapping objects for availability options
const AVAILABILITY_OPTIONS = [
  { value: 'DECEMBER_8_2025', label: 'Pour la présentation des métiers du 8 décembre 2025 de 8h45 à 9h30' },
  { value: 'FEBRUARY_9_2026_WOMEN_PRIORITY', label: 'Pour la présentation des métiers du 9 février 2026 avec priorité aux femmes faisant un métier "dit d\'homme"' },
  { value: 'LATER_PRESENTATION', label: 'Pour une présentation des métiers ultérieure' }
];

// SelectionSet for CareerDiscoveryResponse to ensure all fields are retrieved
const careerResponseSelectionSet = [
  'id', 'email', 'firstName', 'lastName', 'childrenClasses',
  'phone', 'availability', 'organization', 'jobDescription',
  'companySector', 'session', 'surveyType', 'templateYear',
  'createdAt', 'updatedAt'
] as const;

// Type helper for explicit field selection (keeping for potential future use)
// type CareerResponseWithAllFields = SelectionSet<
//   Schema['CareerDiscoveryResponse']['type'],
//   typeof careerResponseSelectionSet
// >;

// Zod validation schema for Career Discovery form
const CareerDiscoverySchema = z.object({
  email: z.string().min(1, 'Email requis').email('Format email invalide'),
  firstName: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Prénom requis')),
  lastName: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Nom de famille requis')),
  childrenClasses: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Classe des enfants requise')),
  phone: z.string()
    .transform((arg, ctx) => {
      if (!arg || arg.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Numéro de téléphone requis',
        });
        return z.NEVER;
      }

      const phone = parsePhoneNumberFromString(arg, {
        // set this to use a default country when the phone number omits country code
        defaultCountry: 'FR',
        // set to false to require that the whole string is exactly a phone number,
        // otherwise, it will search for a phone number anywhere within the string
        extract: false,
      });

      // when it's good
      if (phone && phone.isValid()) {
        return phone.number as string;
      }

      // when it's not
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Numéro de téléphone invalide',
      });
      return z.NEVER;
    }),
  availability: z.enum(['DECEMBER_8_2025', 'FEBRUARY_9_2026_WOMEN_PRIORITY', 'LATER_PRESENTATION'], {
    required_error: 'Veuillez sélectionner vos disponibilités'
  }),
  organization: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .optional(),
  jobDescription: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Description du métier requise')),
  companySector: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .optional(),
});

type CareerDiscoveryFormData = z.infer<typeof CareerDiscoverySchema>;

const showParticpantsRecents = false;

export default function CareerDiscoveryForm() {
  const [formData, setFormData] = React.useState<CareerDiscoveryFormData>({
    email: '',
    firstName: '',
    lastName: '',
    childrenClasses: '',
    phone: '',
    availability: 'DECEMBER_8_2025' as const,
    organization: '',
    jobDescription: '',
    companySector: '',
  });

  const [hasError, setHasError] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [sessionId] = React.useState<string>(() => crypto.randomUUID());
  const [responses, setResponses] = React.useState<Array<Schema['CareerDiscoveryResponse']['type']>>([]);
  const [templates, setTemplates] = React.useState<Array<Schema['CareerDiscoveryTemplate']['type']>>([]);
  const [activeTemplate, setActiveTemplate] = React.useState<Schema['CareerDiscoveryTemplate']['type'] | null>(null);
  const [showForm, setShowForm] = React.useState<boolean>(true);
  const [showAdmin, setShowAdmin] = React.useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  const router = useRouter();

  // Store field-specific errors using Zod error paths
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  // Helper function to get field-specific errors by path
  const getFieldErrors = (fieldPath: string) => {
    return fieldErrors[fieldPath] || [];
  };

  function listResponses() {
    client.models.CareerDiscoveryResponse.observeQuery({
      selectionSet: careerResponseSelectionSet as any
    }).subscribe({
      next: (data) => setResponses([...data.items] as any),
    });
  }

  function listTemplates() {
    client.models.CareerDiscoveryTemplate.observeQuery().subscribe({
      next: (data) => {
        const templateList = [...data.items];
        setTemplates(templateList);
        // Find the active template
        const active = templateList.find(t => t.isActive);
        setActiveTemplate(active || null);
      },
    });
  }

  React.useEffect(() => {
    const initializeData = async () => {
      try {
        // Check if admin is already authenticated
        setIsAuthenticated(isAdminAuthenticated());

        // Seed default template if needed
        await seedCareerDiscoveryTemplate();

        listResponses();
        listTemplates();
      } catch (err) {
        console.error(err);
        setHasError(true);
      }
    };

    initializeData();
  }, []);

  const handleInputChange = (field: keyof CareerDiscoveryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleForm = () => {
    setShowForm(prev => !prev);
  };

  const toggleAdmin = async () => {
    if (!isAuthenticated) {
      // First time authentication required
      const authenticated = await promptAdminPassword('Mot de passe administrateur requis:');

      if (authenticated) {
        setIsAuthenticated(true);
        setShowAdmin(true);
      } else {
        alert('Mot de passe incorrect. Accès administrateur refusé.');
      }
    } else {
      // Already authenticated, just toggle visibility
      setShowAdmin(prev => !prev);
    }
  };

  const validateAndSubmit = async () => {
    try {
      setValidationErrors([]);
      setIsSubmitting(true);

      const validatedData = CareerDiscoverySchema.parse(formData);

      if (!activeTemplate) {
        setValidationErrors(['Aucun modèle de formulaire actif. Veuillez contacter l\'administrateur.']);
        return;
      }

      // Create Career Discovery Response
      const response = await client.models.CareerDiscoveryResponse.create({
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        childrenClasses: validatedData.childrenClasses,
        phone: validatedData.phone,
        availability: validatedData.availability,
        organization: validatedData.organization || null,
        jobDescription: validatedData.jobDescription,
        companySector: validatedData.companySector || null,
        session: sessionId,
        surveyType: 'CAREER_DISCOVERY',
        templateYear: activeTemplate.year,
      });

      if (response.data) {
        alert('Formulaire soumis avec succès !');

        // Reset form and hide it
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          childrenClasses: '',
          phone: '',
          availability: 'DECEMBER_8_2025' as const,
          organization: '',
          jobDescription: '',
          companySector: '',
        });
        setFieldErrors({});
        setValidationErrors([]);
        setShowForm(false);
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
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteResponse = async (id: string, responseSession: string) => {
    if (responseSession !== sessionId) {
      alert('Vous ne pouvez supprimer que vos propres réponses.');
      return;
    }

    try {
      await client.models.CareerDiscoveryResponse.delete({ id });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const exportResponsesAsCSV = (year: string) => {
    const yearResponses = responses.filter(r => r.templateYear === year);

    if (yearResponses.length === 0) {
      alert('Aucune réponse pour cette année.');
      return;
    }

    const headers = [
      'Email',
      'Prénom',
      'Nom de famille',
      'Classe des enfants',
      'Téléphone',
      'Disponibilités',
      'Organisation',
      'Description du métier',
      'Secteur de l\'entreprise',
      'Date de soumission'
    ];

    const csvData = yearResponses.map(response => [
      response.email,
      response.firstName,
      response.lastName,
      response.childrenClasses,
      response.phone,
      AVAILABILITY_OPTIONS.find(opt => opt.value === response.availability)?.label || response.availability,
      response.organization || '',
      response.jobDescription,
      response.companySector || '',
      response.createdAt ?? ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `decouverte-metiers-${year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <View>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <Box className={classNames(flexStyles.hasTextTeriary)}>
          <Section>
            <Title level={TitleLevel.LEVEL2} className={flexStyles.hasTextTeriary}>
              {activeTemplate?.title || "Découverte des métiers"}
            </Title>
            {activeTemplate?.subtitle ? (
              <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary} style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
                {activeTemplate.subtitle}
              </Title>
            ) : (
              <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary} style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
                 Des présentations des métiers pour le niveau II le lundi 8 décembre, de 8h45 à 9h30.
              </Title>
            )}

            {showForm && activeTemplate && (
              <div id="career-discovery-form">
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
                      id="career-email"
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
                      id="career-firstName"
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
                      id="career-lastName"
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

                <Divider />

                {/* Children Classes Section */}
                <div>
                  <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                    4. Classe de vos enfants *
                  </Title>
                  <div className={classNames(
                    flexStyles.isGridDisplayGrid,
                    flexStyles.isGridItemsStart,
                    flexStyles.isFullheight,
                  )} style={{ marginTop: '1rem' }}>
                    <Input
                      id="children-classes"
                      placeholder="ex: 3ème A, 4ème B"
                      value={formData.childrenClasses}
                      onChange={(e) => handleInputChange('childrenClasses', e.inputValue)}
                    />
                    {getFieldErrors('childrenClasses').map((error, errorIndex) => (
                      <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                        <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                        <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                      </span>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Phone Section */}
                <div>
                  <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                    5. Numéro de téléphone *
                  </Title>
                  <div className={classNames(
                    flexStyles.isGridDisplayGrid,
                    flexStyles.isGridItemsStart,
                    flexStyles.isFullheight,
                  )} style={{ marginTop: '1rem' }}>
                    <Input
                      id="phone"
                      placeholder="Votre numéro de téléphone (ex: 06 12 34 56 78 ou +33 6 12 34 56 78)"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.inputValue)}
                    />
                    {getFieldErrors('phone').map((error, errorIndex) => (
                      <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                        <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                        <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                      </span>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Availability Section */}
                <div>
                  <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                    6. Disponibilités *
                  </Title>
                  <div className={classNames(
                    flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                    flexStyles.isGridCols1,
                    flexStyles.isGridItemsStart,
                  )} style={{ marginTop: '1rem' }}>
                    {activeTemplate.availabilityOptions && activeTemplate.availabilityOptions.length > 0 ? (
                      activeTemplate.availabilityOptions.map((option, index) => (
                        <Radio
                          key={`${option || `empty-${index}`}-${index}`}
                          name="availability"
                          id={`availability-${index}`}
                          value={AVAILABILITY_OPTIONS[index]?.value || `OPTION_${index}`}
                          label={option || ''}
                          checked={formData.availability === (AVAILABILITY_OPTIONS[index]?.value || `OPTION_${index}`)}
                          onChange={() => handleInputChange('availability', AVAILABILITY_OPTIONS[index]?.value || `OPTION_${index}`)}
                        />
                      ))
                    ) : (
                      AVAILABILITY_OPTIONS.map((option) => (
                        <Radio
                          key={option.value}
                          name="availability"
                          id={`availability-${option.value.toLowerCase()}`}
                          value={option.value}
                          label={option.label}
                          checked={formData.availability === option.value}
                          onChange={() => handleInputChange('availability', option.value)}
                        />
                      ))
                    )}
                  </div>
                  {getFieldErrors('availability').map((error, errorIndex) => (
                    <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                      <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                      <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                    </span>
                  ))}
                </div>

                <Divider />

                {/* Organization Section */}
                <div>
                  <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                    7. L&apos;organisation pour laquelle vous travaillez
                  </Title>
                  <div className={classNames(
                    flexStyles.isGridDisplayGrid,
                    flexStyles.isGridItemsStart,
                    flexStyles.isFullheight,
                  )} style={{ marginTop: '1rem' }}>
                    <Input
                      id="organization"
                      placeholder="Nom de votre organisation"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.inputValue)}
                    />
                  </div>
                </div>

                <Divider />

                {/* Job Description Section */}
                <div>
                  <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                    8. Descriptif rapide de votre métier *
                  </Title>
                  <div className={classNames(
                    flexStyles.isGridDisplayGrid,
                    flexStyles.isGridItemsStart,
                    flexStyles.isFullheight,
                  )} style={{ marginTop: '1rem' }}>
                    <Input
                      id="job-description"
                      placeholder="Décrivez brièvement votre métier"
                      value={formData.jobDescription}
                      onChange={(e) => handleInputChange('jobDescription', e.inputValue)}
                    />
                    {getFieldErrors('jobDescription').map((error, errorIndex) => (
                      <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                        <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                        <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                      </span>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Company Sector Section */}
                <div>
                  <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                    9. Secteur de votre société
                  </Title>
                  <div className={classNames(
                    flexStyles.isGridDisplayGrid,
                    flexStyles.isGridItemsStart,
                    flexStyles.isFullheight,
                  )} style={{ marginTop: '1rem' }}>
                    <Input
                      id="company-sector"
                      placeholder="Secteur d'activité de votre société"
                      value={formData.companySector}
                      onChange={(e) => handleInputChange('companySector', e.inputValue)}
                    />
                  </div>
                </div>

                {/* Form Errors Section */}
                {validationErrors.length > 0 && (
                  <div>
                    <InfoBlock>
                      <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                        <Title level={TitleLevel.LEVEL3}>{`Erreur(s) dans le formulaire !!`}</Title>
                      </InfoBlockHeader>
                      <InfoBlockContent>
                        <Title level={TitleLevel.LEVEL5}>
                          Merci de corriger les erreurs ci-dessus pour pouvoir soumettre votre formulaire
                        </Title>
                      </InfoBlockContent>
                    </InfoBlock>
                  </div>
                )}
              </div>
            )}

            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1, flexStyles.isGridCols3Tablet,
              flexStyles.isGridItemsCenter,
              flexStyles.isFullheight,
              flexStyles.isFullwidth,
            )} style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
              {showForm && activeTemplate && (
                <Button
                  id="career-submit"
                  onClick={validateAndSubmit}
                  variant={VariantState.PRIMARY}
                  markup={ButtonMarkup.BUTTON}
                  disabled={isSubmitting}
                >
                  <span style={{ marginBottom: '2rem' }}>
                    {isSubmitting ? 'Envoi en cours...' : 'Soumettre le formulaire'}
                  </span>
                </Button>
              )}
              <Button
                id="toggle-form"
                onClick={toggleForm}
                variant={VariantState.SECONDARY}
                markup={ButtonMarkup.BUTTON}
              >
                {showForm ? 'Masquer le formulaire' : 'Participer'}
              </Button>
            </div>
          </Section>

          <Divider />

          {/* Display existing responses for current active template */}
          {responses.length > 0 && activeTemplate && (
            <Section>
              <Title level={TitleLevel.LEVEL2} className={flexStyles.hasTextTeriary}>
                Résultats pour {activeTemplate.year}
              </Title>

              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                flexStyles.isGridItemsCenter,
                flexStyles.isFullheight,
                flexStyles.isFullwidth,
              )} style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                <Title level={TitleLevel.LEVEL4} className={classNames(flexStyles.hasTextTeriary, flexStyles.isMarginless)}>
                  Nombre de participants ({responses.filter(r => r.templateYear === activeTemplate.year).length})
                </Title>
                {/* Export button for current year */}
                {isAuthenticated && (
                  <div style={{ justifySelf: 'end' }}>
                    <Button
                      onClick={() => exportResponsesAsCSV(activeTemplate.year)}
                      variant={VariantState.SECONDARY}
                      markup={ButtonMarkup.BUTTON}
                    >
                      Exporter en CSV
                    </Button>
                  </div>
                )}
              </div>

              {/* Response Statistics */}
              <div style={{
                  border: '1px solid #e0e0e0',
                  padding: '1rem',
                  marginBottom: '1rem',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}>
                <Text className={flexStyles.hasTextTeriary} style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Répartition des disponibilités
                </Text>
                <div className={classNames(
                    flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                    flexStyles.isGridCols1,
                    flexStyles.isGridItemsStart,
                  )}>
                  {AVAILABILITY_OPTIONS.map((option) => {
                    const count = responses.filter(r =>
                      r.templateYear === activeTemplate.year && r.availability === option.value
                    ).length;
                    const total = responses.filter(r => r.templateYear === activeTemplate.year).length;
                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={option.value} style={{
                        backgroundColor: '#e8f5e8',
                        padding: '0.75rem',
                        borderRadius: '4px'
                      }}>
                        <Text style={{ fontWeight: 'bold' }}>
                          {option.label}: {percentage}% ({count})
                        </Text>
                      </div>
                    );
                  })}
                </div>
              </div>

              {showParticpantsRecents && isAuthenticated && (
                <>
                  <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                    Participants récents
                  </Title>
                  {responses
                    .filter(r => r.templateYear === activeTemplate.year)
                    .sort((a, b) => {
                      // Current session participant appears first
                      if (a.session === sessionId && b.session !== sessionId) return -1;
                      if (a.session !== sessionId && b.session === sessionId) return 1;
                      return 0;
                    })
                    .slice(0, 10)
                    .map((response) => (
                      <div key={response.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
                        <Text className={flexStyles.hasTextTeriary}>
                          <strong>{response.firstName} {response.lastName}</strong> - {response.childrenClasses} - {response.jobDescription}<br/>
                          <strong>Disponibilité :</strong> {AVAILABILITY_OPTIONS.find(opt => opt.value === response.availability)?.label || response.availability}
                        </Text>
                        {response.session === sessionId && (
                          <Button
                            onClick={() => deleteResponse(response.id, response.session || '')}
                            variant={VariantState.PRIMARY}
                            markup={ButtonMarkup.BUTTON}
                          >
                            <span style={{ marginTop: '0.5rem' }}>Supprimer</span>
                          </Button>
                        )}
                      </div>
                    ))}
                </>
              )}

            </Section>
          )}

          <Section>
            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1, flexStyles.isGridCols3Tablet,
              flexStyles.isGridItemsCenter,
              flexStyles.isFullheight,
              flexStyles.isFullwidth,
            )} style={{ marginBottom: '0.5rem' }}>
              <Button
                id="toggle-admin"
                onClick={toggleAdmin}
                variant={VariantState.TERTIARY}
                markup={ButtonMarkup.BUTTON}
              >
                {isAuthenticated
                  ? (showAdmin ? 'Masquer admin' : 'Administration')
                  : 'Administration 🔒'
                }
              </Button>
              {isAuthenticated && (
                <Button
                  id="logout-admin"
                  onClick={() => {
                    logoutAdmin();
                    setIsAuthenticated(false);
                    setShowAdmin(false);
                  }}
                  variant={VariantState.SECONDARY}
                  markup={ButtonMarkup.BUTTON}
                >
                  Déconnexion
                </Button>
              )}
            </div>
          </Section>

          {showAdmin && isAuthenticated && (
            <AdminInterface
              templates={templates}
              responses={responses}
              onExportCSV={exportResponsesAsCSV}
            />
          )}
        </Box>
      </div>
    </View>
  );
}

// Admin Interface Component
function AdminInterface({
  templates,
  responses,
  onExportCSV
}: {
  templates: Array<Schema['CareerDiscoveryTemplate']['type']>;
  responses: Array<Schema['CareerDiscoveryResponse']['type']>;
  onExportCSV: (year: string) => void;
}) {
  const [newYear, setNewYear] = React.useState('');
  const [newTitle, setNewTitle] = React.useState('');
  const [newSubtitle, setNewSubtitle] = React.useState('');
  const [newAvailabilityOptions, setNewAvailabilityOptions] = React.useState<string[]>([
    'Pour la présentation des métiers du 8 décembre 2025 de 8h45 à 9h30',
    'Pour la présentation des métiers du 9 février 2026 avec priorité aux femmes faisant un métier "dit d\'homme"',
    'Pour une présentation des métiers ultérieure'
  ]);

  const createTemplate = async () => {
    if (!newYear || !newTitle || !newSubtitle) {
      alert('Veuillez remplir l\'année, le titre et le sous-titre');
      return;
    }

    try {
      await client.models.CareerDiscoveryTemplate.create({
        year: newYear,
        title: newTitle,
        subtitle: newSubtitle,
        availabilityOptions: newAvailabilityOptions,
        isActive: false,
      });

      setNewYear('');
      setNewTitle('');
      setNewSubtitle('');
      alert('Modèle créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création du modèle:', error);
      alert('Erreur lors de la création du modèle');
    }
  };

  const setActiveTemplate = async (templateId: string) => {
    try {
      // First, set all templates to inactive
      const updatePromises = templates.map(template =>
        client.models.CareerDiscoveryTemplate.update({
          id: template.id,
          isActive: false
        })
      );
      await Promise.all(updatePromises);

      // Then set the selected template as active
      await client.models.CareerDiscoveryTemplate.update({
        id: templateId,
        isActive: true
      });

      alert('Modèle activé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'activation du modèle:', error);
      alert('Erreur lors de l\'activation du modèle');
    }
  };

  const deleteTemplate = async (templateId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce modèle ?')) return;

    try {
      await client.models.CareerDiscoveryTemplate.delete({ id: templateId });
      alert('Modèle supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du modèle:', error);
      alert('Erreur lors de la suppression du modèle');
    }
  };

  return (
    <Section>
      <Title level={TitleLevel.LEVEL2} className={flexStyles.hasTextTeriary}>
        Administration des formulaires
      </Title>

      {/* Create New Template */}
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem', borderRadius: '4px' }}>
        <Title level={TitleLevel.LEVEL4}>Créer un nouveau modèle</Title>

        <div style={{ marginBottom: '1rem' }}>
          <Text><strong>Définir une période pour le nouveau formulaire (ex: 2025-2026) *</strong></Text>
          <div className={classNames(
            flexStyles.isGridDisplayGrid,
            flexStyles.isGridItemsCenter,
            flexStyles.isFullheight,
            flexStyles.isFullwidth,
          )}>
            <Input
              value={newYear}
              onChange={(e) => setNewYear(e.inputValue)}
              placeholder="Année"
            />
            <div className={classNames(flexStyles.help, flexStyles.isInfo, flexStyles.isFullwidth)}>
              <Icon
                content={`Cette valeur doit être unique pour distinguer les différentes formulaires.`}
                size={IconSize.SMALL}
                position={IconPosition.LEFT}
                name={IconName.UI_INFO_CIRCLE}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Text><strong>Attribuer une titre au nouveau formulaire (ex Découverte des métiers (2025-2026)) *</strong></Text>
          <div className={classNames(
            flexStyles.isGridDisplayGrid,
            flexStyles.isGridItemsCenter,
            flexStyles.isFullheight,
            flexStyles.isFullwidth,
          )}>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.inputValue)}
              placeholder="Titre du formulaire "
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Text><strong>Sous-titre *</strong></Text>
          <div className={classNames(
            flexStyles.isGridDisplayGrid,
            flexStyles.isGridItemsCenter,
            flexStyles.isFullheight,
            flexStyles.isFullwidth,
          )}>
            <Input
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.inputValue)}
              placeholder="Sous-titre pour plus de contexte"
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Text><strong>Options de disponibilité</strong></Text>
          {newAvailabilityOptions.map((option, index) => (
            <div key={index} className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1,
              flexStyles.isGridItemsCenter,
              flexStyles.isFullheight,
              flexStyles.isFullwidth,
            )} style={{ marginBottom: '0.5rem' }}>
              <div className={classNames(
                flexStyles.isGridDisplayGrid,
                flexStyles.isGridItemsCenter,
                flexStyles.isFullheight,
                flexStyles.isFullwidth,
              )}>
                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newAvailabilityOptions];
                    newOptions[index] = e.inputValue;
                    setNewAvailabilityOptions(newOptions);
                  }}
                  placeholder={`Texte pour l'option # ${index}`}
                />
              </div>
              <div style={{ width: 'auto', justifySelf: 'end' }}>
                <Button
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer cette option ?')) {
                      const newOptions = newAvailabilityOptions.filter((_, i) => i !== index);
                      setNewAvailabilityOptions(newOptions);
                    }
                  }}
                  variant={VariantState.SECONDARY}
                  markup={ButtonMarkup.BUTTON}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
          <Button
            onClick={() => setNewAvailabilityOptions([...newAvailabilityOptions, ''])}
            variant={VariantState.TERTIARY}
            markup={ButtonMarkup.BUTTON}
          >
            Ajouter une option
          </Button>
        </div>

        <Button
          onClick={createTemplate}
          variant={VariantState.PRIMARY}
          markup={ButtonMarkup.BUTTON}
        >
          Créer le modèle
        </Button>
      </div>

      {/* Existing Templates */}
      <Title level={TitleLevel.LEVEL4}>Modèles existants</Title>
      {templates.map((template) => {
        const responseCount = responses.filter(r => r.templateYear === template.year).length;
        return (
          <div
            key={template.id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '4px',
              backgroundColor: template.isActive ? '#e8f5e8' : '#f9f9f9'
            }}
          >
            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1,
              flexStyles.isGridItemsCenter,
              flexStyles.isFullheight,
              flexStyles.isFullwidth,
            )} style={{ marginBottom: '0.5rem' }}>
              <Text style={{ fontWeight: 'bold' }}>{template.title}</Text>
              <Text style={{ fontStyle: 'italic', color: '#666' }}>{template.subtitle}</Text>
              <Text>Année: {template.year}</Text>
              <div className={classNames(
                  flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                  flexStyles.isGridCols1, flexStyles.isGridCols3Tablet,
                  flexStyles.isGridItemsCenter,
                  flexStyles.isFullheight,
                  flexStyles.isFullwidth,
                )} style={{ marginBottom: '0.5rem' }}>
                {!template.isActive && (
                  <Button
                    onClick={() => setActiveTemplate(template.id)}
                    variant={VariantState.SECONDARY}
                    markup={ButtonMarkup.BUTTON}
                  >
                    Activer
                  </Button>
                )}
                <Button
                  onClick={() => onExportCSV(template.year)}
                  variant={VariantState.TERTIARY}
                  markup={ButtonMarkup.BUTTON}
                >
                  Exporter CSV
                </Button>
                <Button
                  onClick={() => deleteTemplate(template.id)}
                  variant={VariantState.PRIMARY}
                  markup={ButtonMarkup.BUTTON}
                >
                  Supprimer
                </Button>
              </div>
              <Text>Réponses: {responseCount}</Text>
              {template.isActive && <Text style={{ color: 'green' }}>✓ Actif</Text>}
            </div>
          </div>
        );
      })}
    </Section>
  );
}
