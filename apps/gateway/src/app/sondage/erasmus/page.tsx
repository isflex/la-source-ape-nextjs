'use client';

import React from 'react';
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
  Text,
  Title,
  TitleLevel,
  VariantState,
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
  IconName,
  IconSize,
  IconPosition,
  IconStatus,
  StatusIcon,
  Input,
  Radio,
  Textarea,
  Link,
  View,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';

// Mapping objects for enum values (database vs display)
const ERASMUS_AWARENESS_OPTIONS = [
  { value: 'OUI', label: 'Oui' },
  { value: 'NON', label: 'Non' },
  { value: 'PAS_VRAIMENT', label: 'Pas vraiment' }
];

const ERASMUS_INTEREST_OPTIONS = [
  { value: 'OUI_BEAUCOUP', label: 'Oui, beaucoup' },
  { value: 'OUI_UN_PEU', label: 'oui, un peu' },
  { value: 'PAS_VRAIMENT', label: 'pas vraiment' },
  { value: 'PAS_DU_TOUT', label: 'pas du tout' }
];

const COMFORT_LEVEL_OPTIONS = [
  { value: 'TRES_A_LAISE', label: 'Très à l\'aise' },
  { value: 'ASSEZ_A_LAISE', label: 'Assez à l\'aise' },
  { value: 'PARTAGE', label: 'Partagé' },
  { value: 'PAS_DU_TOUT_A_LAISE', label: 'pas du tout à l\'aise' }
];

const MOTIVATION_OPTIONS = [
  { value: 'AMELIORER_COMPETENCES_LINGUISTIQUES', label: 'Améliorer les compétences linguistiques' },
  { value: 'DECOUVRIR_AUTRE_PAYS_CULTURE', label: 'Découvrir un autre pays et sa culture' },
  { value: 'RENCONTRER_AUTRES_ELEVES_EUROPEENS', label: 'Rencontrer d\'autres élèves européens' },
  { value: 'VALORISER_DOSSIER_SCOLAIRE', label: 'Valoriser son dossier scolaire' },
  { value: 'AUCUN', label: 'Aucun' }
];

const CONCERN_OPTIONS = [
  { value: 'COUT_FINANCIER', label: 'Coût financier' },
  { value: 'HEBERGEMENT', label: 'Hébergement' },
  { value: 'SECURITE', label: 'Sécurité' },
  { value: 'DIFFERENCES_CULTURELLES', label: 'Différences culturelles' },
  { value: 'BARRIERE_LINGUISTIQUE', label: 'Barrière linguistique' },
  { value: 'QUALITE_ENSEIGNEMENT', label: 'Qualité de l\'enseignement' },
  { value: 'AUTRE', label: 'Autre' }
];

const FINANCING_WILLINGNESS_OPTIONS = [
  { value: 'OUI_SANS_HESITATION', label: 'Oui, sans hésitation' },
  { value: 'OUI_SELON_COUT', label: 'Oui, selon le coût' },
  { value: 'PEUT_ETRE', label: 'Peut-être' },
  { value: 'PROBABLEMENT_PAS', label: 'Probablement pas' },
  { value: 'NON', label: 'Non' }
];

const IDEAL_DURATION_OPTIONS = [
  { value: 'UNE_SEMAINE', label: '1 semaine' },
  { value: 'DEUX_SEMAINES', label: '2 semaines' },
  { value: 'UN_MOIS', label: '1 mois' },
  { value: 'TROIS_MOIS_TRIMESTRE', label: '3 mois (un trimestre)' }
];

// Zod validation schema for Erasmus survey
const ErasmusSchema = z.object({
  email: z.string().min(1, 'Email requis').email('Format email invalide'),
  childDetails: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Détails de l\'enfant requis')),
  erasmusAwareness: z.enum(['OUI', 'NON', 'PAS_VRAIMENT'], {
    required_error: 'Veuillez répondre à cette question'
  }),
  erasmusDefinition: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .optional(),
  erasmusInterest: z.enum(['OUI_BEAUCOUP', 'OUI_UN_PEU', 'PAS_VRAIMENT', 'PAS_DU_TOUT'], {
    required_error: 'Veuillez indiquer votre niveau d\'intérêt'
  }),
  comfortLevel: z.enum(['TRES_A_LAISE', 'ASSEZ_A_LAISE', 'PARTAGE', 'PAS_DU_TOUT_A_LAISE'], {
    required_error: 'Veuillez indiquer votre niveau de confort'
  }),
  motivations: z.array(z.string()).min(1, 'Veuillez sélectionner au moins une motivation'),
  desiredInformation: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Veuillez indiquer les informations souhaitées')),
  concerns: z.array(z.string()).min(1, 'Veuillez sélectionner au moins une préoccupation'),
  financingWillingness: z.enum(['OUI_SANS_HESITATION', 'OUI_SELON_COUT', 'PEUT_ETRE', 'PROBABLEMENT_PAS', 'NON'], {
    required_error: 'Veuillez indiquer votre volonté de financement'
  }),
  idealDuration: z.enum(['UNE_SEMAINE', 'DEUX_SEMAINES', 'UN_MOIS', 'TROIS_MOIS_TRIMESTRE'], {
    required_error: 'Veuillez sélectionner la durée idéale'
  }),
  previousExperience: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .optional(),
  suggestions: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .optional(),
});

type ErasmusFormData = z.infer<typeof ErasmusSchema>;

export default function ErasmusSurvey() {
  const [formData, setFormData] = React.useState<ErasmusFormData>({
    email: '',
    childDetails: '',
    erasmusAwareness: 'OUI' as const,
    erasmusDefinition: '',
    erasmusInterest: 'OUI_BEAUCOUP' as const,
    comfortLevel: 'TRES_A_LAISE' as const,
    motivations: [],
    desiredInformation: '',
    concerns: [],
    financingWillingness: 'OUI_SANS_HESITATION' as const,
    idealDuration: 'UNE_SEMAINE' as const,
    previousExperience: '',
    suggestions: '',
  });

  const [hasError, setHasError] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [sessionId] = React.useState<string>(() => crypto.randomUUID());
  const [responses, setResponses] = React.useState<Array<Schema['ErasmusResponse']['type']>>([]);
  const [showSurveyForm, setShowSurveyForm] = React.useState<boolean>(false);

  const router = useRouter();

  const toggleSurveyForm = () => {
    setShowSurveyForm(prev => !prev);
  };

  // Store field-specific errors using Zod error paths
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  // Helper function to get field-specific errors by path
  const getFieldErrors = (fieldPath: string) => {
    return fieldErrors[fieldPath] || [];
  };

  function listResponses() {
    client.models.ErasmusResponse.observeQuery().subscribe({
      next: (data) => setResponses([...data.items]),
    });
  }

  React.useEffect(() => {
    try {
      listResponses();
    } catch (err) {
      console.error(err);
      setHasError(true);
    }
  }, []);

  const handleInputChange = (field: keyof ErasmusFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: 'motivations' | 'concerns', option: string) => {
    setFormData(prev => {
      const currentArray = prev[field];
      const isSelected = currentArray.includes(option);

      if (isSelected) {
        return { ...prev, [field]: currentArray.filter(item => item !== option) };
      } else {
        return { ...prev, [field]: [...currentArray, option] };
      }
    });
  };

  const validateAndSubmit = async () => {
    try {
      setValidationErrors([]);
      setIsSubmitting(true);

      const validatedData = ErasmusSchema.parse(formData);

      // Create Erasmus Response
      const response = await client.models.ErasmusResponse.create({
        email: validatedData.email,
        childDetails: validatedData.childDetails,
        erasmusAwareness: validatedData.erasmusAwareness,
        erasmusDefinition: validatedData.erasmusDefinition || null,
        erasmusInterest: validatedData.erasmusInterest,
        comfortLevel: validatedData.comfortLevel,
        motivations: validatedData.motivations,
        desiredInformation: validatedData.desiredInformation,
        concerns: validatedData.concerns,
        financingWillingness: validatedData.financingWillingness,
        idealDuration: validatedData.idealDuration,
        previousExperience: validatedData.previousExperience || null,
        suggestions: validatedData.suggestions || null,
        session: sessionId,
        surveyType: 'ERASMUS',
      });

      if (response.data) {
        alert('Sondage Erasmus soumis avec succès !');

        // Reset form and hide it
        setFormData({
          email: '',
          childDetails: '',
          erasmusAwareness: 'OUI' as const,
          erasmusDefinition: '',
          erasmusInterest: 'OUI_BEAUCOUP' as const,
          comfortLevel: 'TRES_A_LAISE' as const,
          motivations: [],
          desiredInformation: '',
          concerns: [],
          financingWillingness: 'OUI_SANS_HESITATION' as const,
          idealDuration: 'UNE_SEMAINE' as const,
          previousExperience: '',
          suggestions: '',
        });
        setFieldErrors({});
        setValidationErrors([]);
        setShowSurveyForm(false);
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
        setValidationErrors(['Erreur lors de la soumission du sondage']);
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
      await client.models.ErasmusResponse.delete({ id });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
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

  return (
    <View>
      <Box className={classNames(flexStyles.hasTextTeriary)}>
        <div style={{ maxWidth: '920px' }}>
          <Section>
            <Title level={TitleLevel.LEVEL2} className={flexStyles.hasTextTeriary}>
              {showSurveyForm
                ? "Sondage sur la mobilité Erasmus (à remplir par les familles)"
                : "Participer au sondage sur la mobilité Erasmus"
              }
            </Title>
            <Text>
              Dans le cadre d&apos;une demande d&apos;accréditation Erasmus, à laquelle nous pensons que notre établissement serait intéressé
              par une participation, nous souhaitons recueillir vos commentaires sur ce programme. Vos commentaires nous aideront
              à mieux comprendre vos attentes, à définir nos priorités et à élaborer un profil adapté aux besoins de notre communauté éducative.
            </Text>
            <div style={{ marginTop: '1rem' }}>
              <Button
                id="toggle-survey-form"
                onClick={toggleSurveyForm}
                variant={VariantState.SECONDARY}
                markup={ButtonMarkup.BUTTON}
              >
                {showSurveyForm ? 'Masquer le formulaire' : 'Participer'}
              </Button>
            </div>
          </Section>

          {showSurveyForm && (
            <div id="erasmus-survey-form">
              {/* Email Section */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  1.  Email *
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridItemsStart,
                  flexStyles.isFullheight,
                )}>
                  <Input
                    id="erasmus-email"
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
              </Section>

              <Divider />

              {/* Child Details Section */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  2.  Indiquez nom, prénom, classe de votre enfant *
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridItemsStart,
                  flexStyles.isFullheight,
                )}>
                  <Input
                    id="erasmus-child-details"
                    placeholder="ex: Martin Dupont, 3ème B"
                    value={formData.childDetails}
                    onChange={(e) => handleInputChange('childDetails', e.inputValue)}
                  />
                  {getFieldErrors('childDetails').map((error, errorIndex) => (
                    <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                      <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                      <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                    </span>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* Erasmus Awareness Section */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  3.  Connaissez-vous Erasmus ? *
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                  flexStyles.isGridCols3,
                  flexStyles.isGridItemsCenter,
                )} style={{ marginTop: '1rem' }}>
                  {ERASMUS_AWARENESS_OPTIONS.map((option) => (
                    <Radio
                      key={option.value}
                      name="erasmus-awareness"
                      id={`erasmus-awareness-${option.value.toLowerCase()}`}
                      value={option.value}
                      label={option.label}
                      checked={formData.erasmusAwareness === option.value}
                      onChange={() => handleInputChange('erasmusAwareness', option.value)}
                    />
                  ))}
                </div>
                {getFieldErrors('erasmusAwareness').map((error, errorIndex) => (
                  <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                    <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                    <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                  </span>
                ))}
              </Section>

              <Divider />

              {/* Erasmus Definition Section */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  4.  Si oui, comment définiriez-vous Erasmus ?
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridItemsStart,
                  flexStyles.isFullheight,
                )}>
                  <Textarea
                    id="erasmus-definition"
                    placeholder="Votre définition d'Erasmus..."
                    defaultValue={formData.erasmusDefinition}
                    onChange={(e) => handleInputChange('erasmusDefinition', e.textareaValue)}
                  />
                </div>
              </Section>

              <Divider />

              {/* Erasmus Interest Section */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  5.  Votre enfant serait-il intéressé par une mobilité Erasmus ? *
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                  flexStyles.isGridCols2, flexStyles.isGridCols4Tablet,
                  flexStyles.isGridItemsCenter,
                )} style={{ marginTop: '1rem' }}>
                  {ERASMUS_INTEREST_OPTIONS.map((option) => (
                    <Radio
                      key={option.value}
                      name="erasmus-interest"
                      id={`erasmus-interest-${option.value.toLowerCase()}`}
                      value={option.value}
                      label={option.label}
                      checked={formData.erasmusInterest === option.value}
                      onChange={() => handleInputChange('erasmusInterest', option.value)}
                    />
                  ))}
                </div>
                {getFieldErrors('erasmusInterest').map((error, errorIndex) => (
                  <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                    <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                    <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                  </span>
                ))}
              </Section>

              <Divider />

              {/* Comfort Level Section */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  6.  En tant que parent, vous sentez-vous à l&apos;aise avec l&apos;idée d&apos;une mobilité Erasmus pour votre enfant ? *
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                  flexStyles.isGridCols2, flexStyles.isGridCols4Tablet,
                  flexStyles.isGridItemsCenter,
                )} style={{ marginTop: '1rem' }}>
                  {COMFORT_LEVEL_OPTIONS.map((option) => (
                    <Radio
                      key={option.value}
                      name="comfort-level"
                      id={`comfort-level-${option.value.toLowerCase()}`}
                      value={option.value}
                      label={option.label}
                      checked={formData.comfortLevel === option.value}
                      onChange={() => handleInputChange('comfortLevel', option.value)}
                    />
                  ))}
                </div>
                {getFieldErrors('comfortLevel').map((error, errorIndex) => (
                  <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                    <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                    <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                  </span>
                ))}
              </Section>

              <Divider />

              {/* Motivations Section */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  7.  Quelles seraient vos motivations pour une mobilité Erasmus ? * (Plusieurs choix possibles)
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                  flexStyles.isGridCols1,
                  flexStyles.isGridItemsStart,
                )} style={{ marginTop: '1rem' }}>
                  {MOTIVATION_OPTIONS.map((option) => (
                    <label key={option.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.motivations.includes(option.value)}
                        onChange={() => handleCheckboxChange('motivations', option.value)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <Text>{option.label}</Text>
                    </label>
                  ))}
                </div>
                {getFieldErrors('motivations').map((error, errorIndex) => (
                  <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                    <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                    <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                  </span>
                ))}
              </Section>

              <Divider />

              {/* Desired Information Section */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  8.  Quelles sont les principales informations ou aides que vous souhaiteriez recevoir ? *
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridItemsStart,
                  flexStyles.isFullheight,
                )}>
                  <Textarea
                    id="desired-information"
                    placeholder="Décrivez les informations ou aides que vous souhaiteriez..."
                    defaultValue={formData.desiredInformation}
                    onChange={(e) => handleInputChange('desiredInformation', e.textareaValue)}
                  />
                  {getFieldErrors('desiredInformation').map((error, errorIndex) => (
                    <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                      <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                      <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                    </span>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* Concerns Section */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  9.  Quelles sont vos principales préoccupations concernant une mobilité Erasmus ? * (Plusieurs choix possibles)
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                  flexStyles.isGridCols1,
                  flexStyles.isGridItemsStart,
                )} style={{ marginTop: '1rem' }}>
                  {CONCERN_OPTIONS.map((option) => (
                    <label key={option.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.concerns.includes(option.value)}
                        onChange={() => handleCheckboxChange('concerns', option.value)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <Text>{option.label}</Text>
                    </label>
                  ))}
                </div>
                {getFieldErrors('concerns').map((error, errorIndex) => (
                  <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                    <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                    <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                  </span>
                ))}
              </Section>

              <Divider />

              {/* Financing Willingness Section */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  10.  Seriez-vous prêt(e) à financer une partie des coûts d&apos;une mobilité Erasmus ? *
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                  flexStyles.isGridCols1, flexStyles.isGridCols3Tablet,
                  flexStyles.isGridItemsCenter,
                )} style={{ marginTop: '1rem' }}>
                  {FINANCING_WILLINGNESS_OPTIONS.map((option) => (
                    <Radio
                      key={option.value}
                      name="financing-willingness"
                      id={`financing-${option.value.toLowerCase()}`}
                      value={option.value}
                      label={option.label}
                      checked={formData.financingWillingness === option.value}
                      onChange={() => handleInputChange('financingWillingness', option.value)}
                    />
                  ))}
                </div>
                {getFieldErrors('financingWillingness').map((error, errorIndex) => (
                  <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                    <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                    <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                  </span>
                ))}
              </Section>

              <Divider />

              {/* Ideal Duration Section - Question 11 */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  11.  Quelle serait la durée de séjour idéale pour un échange Erasmus ? *
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                  flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                  flexStyles.isGridItemsCenter,
                )} style={{ marginTop: '1rem' }}>
                  {IDEAL_DURATION_OPTIONS.map((option) => (
                    <Radio
                      key={option.value}
                      name="ideal-duration"
                      id={`ideal-duration-${option.value.toLowerCase()}`}
                      value={option.value}
                      label={option.label}
                      checked={formData.idealDuration === option.value}
                      onChange={() => handleInputChange('idealDuration', option.value)}
                    />
                  ))}
                </div>
                {getFieldErrors('idealDuration').map((error, errorIndex) => (
                  <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                    <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                    <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                  </span>
                ))}
              </Section>

              <Divider />

              {/* Previous Experience Section - Question 12 */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  12.  Si votre enfant a déjà participé à un programme Erasmus, pouvez-vous partager votre expérience ?
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridItemsStart,
                  flexStyles.isFullheight,
                )}>
                  <Textarea
                    id="previous-experience"
                    placeholder="Partagez votre expérience avec le programme Erasmus..."
                    defaultValue={formData.previousExperience}
                    onChange={(e) => handleInputChange('previousExperience', e.textareaValue)}
                  />
                  {getFieldErrors('previousExperience').map((error, errorIndex) => (
                    <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                      <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                      <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                    </span>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* Suggestions Section - Question 13 */}
              <Section>
                <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                  13.  Avez-vous des suggestions ou des commentaires à propos du programme Erasmus ?
                </Title>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridItemsStart,
                  flexStyles.isFullheight,
                )}>
                  <Textarea
                    id="suggestions"
                    placeholder="Vos suggestions ou commentaires concernant le programme Erasmus..."
                    defaultValue={formData.suggestions}
                    onChange={(e) => handleInputChange('suggestions', e.textareaValue)}
                  />
                  {getFieldErrors('suggestions').map((error, errorIndex) => (
                    <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                      <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                      <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                    </span>
                  ))}
                </div>
              </Section>

              <Divider />

              {/* Form Errors Section */}
              <Section>
                {validationErrors.length > 0 && (
                  <InfoBlock>
                    <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                      <Title level={TitleLevel.LEVEL3}>{`Erreur(s) dans le formulaire !!`}</Title>
                    </InfoBlockHeader>
                    <InfoBlockContent>
                      <Title level={TitleLevel.LEVEL4}>
                        Merci de corriger les erreurs ci-dessus pour pouvoir soumettre votre sondage
                      </Title>
                    </InfoBlockContent>
                  </InfoBlock>
                )}
                <div className={classNames(flexStyles.isFullwidth, flexStyles.isAlignItemsCenter, flexStyles.isMarginless)}>
                  <Button
                    id="erasmus-submit"
                    onClick={validateAndSubmit}
                    variant={VariantState.PRIMARY}
                    markup={ButtonMarkup.BUTTON}
                    disabled={isSubmitting}
                  >
                    <span style={{ marginBottom: '2rem' }}>
                      {isSubmitting ? 'Envoi en cours...' : 'Soumettre le sondage'}
                    </span>
                  </Button>
                </div>
              </Section>
            </div>
          )}

          {/* Display existing responses */}
          {responses.length > 0 && (
            <>
              <Section>
                <Title level={TitleLevel.LEVEL2} className={flexStyles.hasTextTeriary}>
                  Résultats du sondage Erasmus
                </Title>

                {/* Response Statistics */}
                <div style={{ marginTop: '2rem' }}>
                  <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                    Répartition des réponses ({responses.length} participant{responses.length > 1 ? 's' : ''})
                  </Title>

                  {/* Erasmus Awareness Results */}
                  <div style={{
                    border: '1px solid #e0e0e0',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <Text className={flexStyles.hasTextTeriary} style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      Connaissez-vous Erasmus ?
                    </Text>
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                      flexStyles.isGridCols3,
                      flexStyles.isGridItemsCenter,
                    )}>
                      {ERASMUS_AWARENESS_OPTIONS.map((option) => {
                        const count = responses.filter(r => r.erasmusAwareness === option.value).length;
                        const percentage = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0;
                        return (
                          <div key={option.value} style={{
                            backgroundColor: '#e8f5e8',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            textAlign: 'center'
                          }}>
                            <Text style={{ fontWeight: 'bold' }}>
                              {option.label}: {percentage}% ({count})
                            </Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interest Level Results */}
                  <div style={{
                    border: '1px solid #e0e0e0',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <Text className={flexStyles.hasTextTeriary} style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      Intérêt pour une mobilité Erasmus
                    </Text>
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                      flexStyles.isGridCols2, flexStyles.isGridCols4Tablet,
                      flexStyles.isGridItemsCenter,
                    )}>
                      {ERASMUS_INTEREST_OPTIONS.map((option) => {
                        const count = responses.filter(r => r.erasmusInterest === option.value).length;
                        const percentage = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0;
                        return (
                          <div key={option.value} style={{
                            backgroundColor: '#e8f5e8',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            textAlign: 'center'
                          }}>
                            <Text style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                              {option.label}: {percentage}% ({count})
                            </Text>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Motivations */}
                  <div style={{
                    border: '1px solid #e0e0e0',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '4px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <Text className={flexStyles.hasTextTeriary} style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      Principales motivations
                    </Text>
                    {MOTIVATION_OPTIONS.map((motivation) => {
                      const count = responses.filter(r => r.motivations && r.motivations.includes(motivation.value)).length;
                      const percentage = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0;
                      return (
                        <div key={motivation.value} style={{ marginBottom: '0.5rem' }}>
                          <Text>
                            {motivation.label}: {percentage}% ({count} réponses)
                          </Text>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Section>

              <Section>
                <Title level={TitleLevel.LEVEL3} className={flexStyles.hasTextTeriary}>
                  Participants au sondage
                </Title>
                {responses
                  .sort((a, b) => {
                    // Current session participant appears first
                    if (a.session === sessionId && b.session !== sessionId) return -1;
                    if (a.session !== sessionId && b.session === sessionId) return 1;
                    return 0;
                  })
                  .map((response) => (
                    <div key={response.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
                      <Text className={flexStyles.hasTextTeriary}>
                        {response.email} - {response.childDetails}
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
              </Section>
            </>
          )}

          {/* Navigation back to surveys */}
          <Section>
            <Link href="/sondage">
              ← Retour à la liste des sondages
            </Link>
          </Section>
        </div>
      </Box>
    </View>
  );
}
