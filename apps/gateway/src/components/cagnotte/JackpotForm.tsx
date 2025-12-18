'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import classNames from 'classnames';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Divider } from '@flex-design-system/react-ts/client-sync-styled-direct/divider';
import { Input, type InputChangeEvent } from '@flex-design-system/react-ts/client-sync-styled-direct/input';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { Textarea, type TextareaChangeEvent } from '@flex-design-system/react-ts/client-sync-styled-direct/textarea';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import { IconName } from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import { default as flexStyles } from '@flex-design-system/framework';
import {
  // JackpotFormSchema,
  generateSlug,
  formatCurrency,
  getSepaConfig,
  calculateSepaCutoffDate
} from '@src/lib/cagnotte-helpers';
import DOMPurify from 'isomorphic-dompurify';
import NewsletterDatePicker from '@src/components/newsletter/NewsletterDatePicker';
import { debug } from '@flexiness/domain-utils';

const client = generateClient<Schema>();

interface JackpotFormProps {
  onSubmit: (success: boolean, message: string, slug?: string) => void;
  onCancel: () => void;
  existingSlugs?: string[];
  editingFormId?: string;
  stripeAccountId?: string; // Creator's Stripe Connect account ID
}

const SCHOOL_LEVEL_OPTIONS: { value: Schema['ESchoolLevel']['type']; label: string }[] = [
  { value: 'MATERNELLE_GS', label: 'Grande Section' },
  { value: 'PRIMAIRE_CP', label: 'CP' },
  { value: 'PRIMAIRE_CE1', label: 'CE1' },
  { value: 'PRIMAIRE_CE2', label: 'CE2' },
  { value: 'PRIMAIRE_CM1', label: 'CM1' },
  { value: 'PRIMAIRE_CM2', label: 'CM2' },
  { value: 'COLLEGE_6EME', label: '6ème' },
  { value: 'COLLEGE_5EME', label: '5ème' },
  { value: 'COLLEGE_4EME', label: '4ème' },
  { value: 'COLLEGE_3EME', label: '3ème' },
  { value: 'LYCEE_SECONDE', label: 'Seconde' },
  { value: 'LYCEE_PREMIERE', label: 'Première' },
  { value: 'LYCEE_TERMINALE', label: 'Terminale' },
  { value: 'ANCIEN_ELEVE', label: 'Ancien élève' }
];

export default function JackpotForm({ onSubmit, onCancel, existingSlugs = [], editingFormId, stripeAccountId }: JackpotFormProps) {
  const { user } = useAuthenticator();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [title, setTitle] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [schoolLevel, setSchoolLevel] = useState<Schema['ESchoolLevel']['type'] | ''>('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isPubliclyVisible, setIsPubliclyVisible] = useState(false);

  const totalSteps = 4; // Simplified: Basic Info, Description, Target/Deadline, Review

  // Load existing form in edit mode
  useEffect(() => {
    const loadExisting = async () => {
      if (!editingFormId) return;

      try {
        const { data: form } = await client.models.JackpotForm.get({ id: editingFormId });
        if (form) {
          setTitle(form.title);
          setTeacherName(form.teacherName);
          setSchoolLevel(form.schoolLevel || '');
          setDescription(form.description || '');
          setTargetAmount(form.targetAmount?.toString() || '');
          setDeadline(form.deadline.split('T')[0]); // Extract date part
          setIsPubliclyVisible(form.isPubliclyVisible || false);
        }
      } catch (error) {
        debug.error('Error loading jackpot:', error);
      }
    };
    loadExisting();
  }, [editingFormId]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!title.trim()) newErrors.title = 'Le titre est requis';
      if (!teacherName.trim()) newErrors.teacherName = "Le nom de l'enseignant est requis";
    }

    if (step === 3) {
      if (!deadline) newErrors.deadline = 'La date limite est requise';
      const deadlineDate = new Date(deadline);
      if (deadlineDate <= new Date()) {
        newErrors.deadline = 'La date limite doit être dans le futur';
      }
      if (targetAmount && parseFloat(targetAmount) <= 0) {
        newErrors.targetAmount = 'Le montant doit être positif';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setSubmitting(true);

      const slug = generateSlug(title, existingSlugs);
      const deadlineDate = new Date(deadline);
      deadlineDate.setHours(23, 59, 59, 999); // End of day

      // Get SEPA configuration from environment
      const sepaConfig = getSepaConfig();
      const sepaCutoffDate = sepaConfig.enabled ? calculateSepaCutoffDate(deadlineDate) : null;

      const formData = {
        title: DOMPurify.sanitize(title.trim(), { ALLOWED_TAGS: [] }),
        slug,
        teacherName: DOMPurify.sanitize(teacherName.trim(), { ALLOWED_TAGS: [] }),
        schoolLevel: schoolLevel || undefined,
        description: description ? DOMPurify.sanitize(description, {
          ALLOWED_TAGS: ['b', 'i', 'u', 'br', 'p', 'strong', 'em'],
          ALLOWED_ATTR: []
        }) : undefined,
        targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
        deadline: deadlineDate.toISOString(),
        status: 'DRAFT' as Schema['EJackpotStatus']['type'],
        owner: user?.userId || '',
        payoutRequested: false,
        stripeAccountId: stripeAccountId || undefined,
        // SEPA configuration from environment
        sepaPaymentsAllowed: sepaConfig.enabled,
        sepaPaymentsCutoffAt: sepaCutoffDate ? sepaCutoffDate.toISOString() : undefined,
        // Public visibility
        isPubliclyVisible,
      };

      if (editingFormId) {
        // Update existing
        const { errors: updateErrors } = await client.models.JackpotForm.update({
          id: editingFormId,
          ...formData
        });

        if (updateErrors) {
          onSubmit(false, 'Erreur lors de la modification de la cagnotte');
        } else {
          onSubmit(true, 'Cagnotte modifiée avec succès', slug);
        }
      } else {
        // Create new
        const { errors: createErrors } = await client.models.JackpotForm.create(formData);

        if (createErrors) {
          onSubmit(false, 'Erreur lors de la création de la cagnotte');
        } else {
          onSubmit(true, 'Cagnotte créée avec succès', slug);
        }
      }
    } catch (error) {
      debug.error('Error submitting jackpot:', error);
      onSubmit(false, 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Title level={TitleLevel.LEVEL2}>
        {editingFormId ? 'Modifier la cagnotte' : 'Créer une nouvelle cagnotte'}
      </Title>

      {/* Progress Indicator */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Box className={classNames(
          flexStyles.isHiddenTablet,
          flexStyles.hasTextCentered,
          flexStyles.isFlat,
        )}>
          <Title level={TitleLevel.LEVEL7}>
            Étape <span className={flexStyles.hasTextInfo}>{currentStep}</span> sur {totalSteps}
          </Title>
        </Box>
      </div>

      <div className={classNames(
        flexStyles.isHiddenMobile,
        flexStyles.isFlex,
        flexStyles.isFlexDirectionRow,
        flexStyles.isAlignItemsCenter,
        flexStyles.isJustifyContentCenter,
      )} style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className={classNames(
            flexStyles.isFlex,
            flexStyles.isFlexDirectionRow,
            flexStyles.isAlignItemsCenter,
          )}
          style={{ width: 'max-content' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              backgroundColor: i + 1 <= currentStep ? '#0ea5e9' : '#e5e7eb',
              color: i + 1 <= currentStep ? 'white' : '#6b7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              {i + 1}
            </div>
            {i < totalSteps - 1 && (
              <div style={{
                width: '3rem',
                height: '2px',
                backgroundColor: i + 1 < currentStep ? '#0ea5e9' : '#e5e7eb',
                marginLeft: '0.5rem',
                marginRight: '0.5rem',
              }} />
            )}
          </div>
        ))}
      </div>

      {errors.general && (
        <InfoBlock>
          <InfoBlockHeader status={InfoBlockStatus.DANGER} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
            <Title level={TitleLevel.LEVEL3}>Erreur</Title>
          </InfoBlockHeader>
          <InfoBlockContent>
            <Text>{errors.general}</Text>
          </InfoBlockContent>
        </InfoBlock>
      )}

      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <div>
          <Title level={TitleLevel.LEVEL3}>Informations de base</Title>

          <div className={classNames(
            flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
            flexStyles.isGridCols1,
            flexStyles.isGridItemsStart,
            flexStyles.isFullheight,
            flexStyles.isFullwidth,
          )}>
            <div style={{ marginTop: '1rem' }}>
              <label>
                <Text><strong>Titre de la cagnotte *</strong></Text>
                <Input
                  type="text"
                  value={title}
                  onChange={(e: InputChangeEvent) => setTitle(e.inputValue)}
                  placeholder="Ex: Cadeau pour Mme Dupont ou Fonds pour le projet de classe..."
                  className={classNames(flexStyles.isFullwidth)}
                />
                {errors.title && <Text className={flexStyles.hasTextDanger}>{errors.title}</Text>}
              </label>
            </div>
          </div>

          <div className={classNames(
            flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
            flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
            flexStyles.isGridItemsStart,
            flexStyles.isFullheight,
            flexStyles.isFullwidth,
          )}>
            <div style={{ marginTop: '1rem' }}>
              <label>
                <Text><strong>Nom de l&apos;enseignant *</strong></Text>
                <Input
                  type="text"
                  value={teacherName}
                  onChange={(e: InputChangeEvent) => setTeacherName(e.inputValue)}
                  placeholder="Ex: Mme Dupont"
                  className={classNames(flexStyles.isFullwidth)}
                />
                {errors.teacherName && <Text className={flexStyles.hasTextDanger}>{errors.teacherName}</Text>}
              </label>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label>
                <Text><strong>Niveau scolaire (optionnel)</strong></Text>
                <div className={classNames(flexStyles.field)}>
                <div className={classNames(flexStyles.control)}>
                <div className={classNames(flexStyles.select)}>
                  <select
                    value={schoolLevel}
                    onChange={(e) => setSchoolLevel(e.target.value as Schema['ESchoolLevel']['type'])}
                    className={classNames(flexStyles.isFullwidth)}
                  >
                    <option value="">Sélectionnez un niveau</option>
                    {SCHOOL_LEVEL_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Description */}
      {currentStep === 2 && (
        <div>
          <Title level={TitleLevel.LEVEL3}>Description</Title>
          <Text>Décrivez le but de cette cagnotte (optionnel)</Text>

          <div style={{ marginTop: '1rem' }}>
            <Textarea
              defaultValue={description}
              onChange={(e: TextareaChangeEvent) => setDescription(e.textareaValue)}
              placeholder="Ex: Collecte pour offrir un cadeau de départ à Mme Dupont..."
              className={classNames(flexStyles.isFullwidth)}
            />
            <Text style={{ fontSize: '0.875rem', opacity: 0.7 }}>
              Vous pouvez utiliser du texte simple. Les balises HTML de base (gras, italique) seront conservées.
            </Text>
          </div>
        </div>
      )}

      {/* Step 3: Target & Deadline */}
      {currentStep === 3 && (
        <div>
          <Title level={TitleLevel.LEVEL3}>Objectif et échéance</Title>

          <div className={classNames(
            flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
            flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
            flexStyles.isGridItemsStart,
            flexStyles.isFullheight,
            flexStyles.isFullwidth,
          )}>
            <div style={{ marginTop: '1rem' }}>
              <label>
                <Text><strong>Montant cible (optionnel)</strong></Text>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  value={targetAmount}
                  onChange={(e: InputChangeEvent) => setTargetAmount(e.inputValue)}
                  placeholder="Ex: 150"
                  className={classNames(flexStyles.isFullwidth)}
                />
                <Text style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                  Laissez vide si vous n&apos;avez pas de montant cible spécifique
                </Text>
                {errors.targetAmount && <Text className={flexStyles.hasTextDanger}>{errors.targetAmount}</Text>}
              </label>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label>
                <Text><strong>Date limite *</strong></Text>
                <NewsletterDatePicker
                  value={deadline}
                  onChange={(isoDateString) => setDeadline(isoDateString)}
                  placeholder="Sélectionnez une date"
                  hasError={!!errors.deadline}
                  minDate={new Date()}
                />
                <Text style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                  La cagnotte se fermera automatiquement à cette date
                </Text>
                {errors.deadline && <Text className={flexStyles.hasTextDanger}>{errors.deadline}</Text>}
              </label>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPubliclyVisible}
                onChange={(e) => setIsPubliclyVisible(e.target.checked)}
                style={{ marginTop: '0.25rem' }}
              />
              <div>
                <Text><strong>Rendre cette cagnotte publique</strong></Text>
                <Text style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                  Si cochée, la cagnotte apparaîtra dans la liste publique et sera plus facilement
                  découvrable par d&apos;autres parents (idéal pour les enseignants intervenant dans plusieurs classes).
                </Text>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <div>
          <Title level={TitleLevel.LEVEL3}>Récapitulatif</Title>

          <InfoBlock>
            <InfoBlockContent>
              <div style={{ marginBottom: '1rem' }}>
                <Text><strong>Titre :</strong> {title}</Text>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <Text><strong>Enseignant :</strong> {teacherName}</Text>
              </div>
              {schoolLevel && (
                <div style={{ marginBottom: '1rem' }}>
                  <Text><strong>Niveau :</strong> {SCHOOL_LEVEL_OPTIONS.find(o => o.value === schoolLevel)?.label}</Text>
                </div>
              )}
              {description && (
                <div style={{ marginBottom: '1rem' }}>
                  <Text><strong>Description :</strong></Text>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description, {
                    ALLOWED_TAGS: ['b', 'i', 'u', 'br', 'p', 'strong', 'em'],
                    ALLOWED_ATTR: []
                  }) }} />
                </div>
              )}
              {targetAmount && (
                <div style={{ marginBottom: '1rem' }}>
                  <Text><strong>Objectif :</strong> {formatCurrency(parseFloat(targetAmount))}</Text>
                </div>
              )}
              <div style={{ marginBottom: '1rem' }}>
                <Text><strong>Date limite :</strong> {new Date(deadline).toLocaleDateString('fr-FR', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}</Text>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <Text><strong>Visibilité :</strong> {isPubliclyVisible ? 'Publique (visible sur la page d\'accueil)' : 'Privée (URL à partager)'}</Text>
              </div>
            </InfoBlockContent>
          </InfoBlock>
        </div>
      )}

      <Divider />

      {/* Navigation Buttons */}
      <div className={classNames(
        flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
        flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
        flexStyles.isGridItemsCenter,
        flexStyles.isFullwidth,
      )}>
        {currentStep > 1 && (
          <Button
            markup={ButtonMarkup.BUTTON}
            variant={VariantState.SECONDARY}
            onClick={handlePrevious}
            disabled={submitting}
          >
            Précédent
          </Button>
        )}

        {currentStep < totalSteps ? (
          <Button
            markup={ButtonMarkup.BUTTON}
            variant={VariantState.PRIMARY}
            onClick={handleNext}
          >
            Suivant
          </Button>
        ) : (
          <Button
            markup={ButtonMarkup.BUTTON}
            variant={VariantState.SUCCESS}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Enregistrement...' : (editingFormId ? 'Modifier' : 'Créer la cagnotte')}
          </Button>
        )}

        <Button
          markup={ButtonMarkup.BUTTON}
          variant={VariantState.TERTIARY}
          onClick={onCancel}
          disabled={submitting}
        >
          Annuler
        </Button>
      </div>
    </Box>
  );
}
