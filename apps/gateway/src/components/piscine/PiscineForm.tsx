'use client';

import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { z } from 'zod';
import classNames from 'classnames';
import {
  Box,
  Button,
  ButtonMarkup,
  Divider,
  Input,
  type InputChangeEvent,
  Radio,
  Title,
  TitleLevel,
  Text,
  VariantState,
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader,
  Icon,
  IconSize,
  IconPosition,
  IconName,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';

import PiscineTimeSlotPicker from './PiscineTimeSlotPicker';
import PiscineDateCalendar from './PiscineDateCalendar';
import {
  PiscineFormSchema,
  type PiscineFormData,
  generateSlug,
  formatDayOfWeek,
  formatSchoolLevel,
  dateToISOString
} from '@src/lib/piscine-helpers';

const client = generateClient<Schema>();

interface PiscineFormProps {
  onSubmit: (success: boolean, message: string, slug?: string) => void;
  onCancel: () => void;
  existingSlugs?: string[];
}

interface FormErrors {
  general?: string;
  fields?: Record<string, string>;
}

const INITIAL_FORM_DATA = {
  title: '',
  dayOfWeek: undefined as Schema['EDayOfWeek']['type'] | undefined,
  startTime: '',
  endTime: '',
  schoolLevel: undefined as Schema['ESchoolLevel']['type'] | undefined,
  teacherName: '',
  selectedDates: [] as Date[]
};

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

const DAY_OPTIONS: { value: Schema['EDayOfWeek']['type']; label: string }[] = [
  { value: 'MONDAY', label: 'Lundi' },
  { value: 'TUESDAY', label: 'Mardi' },
  { value: 'WEDNESDAY', label: 'Mercredi' },
  { value: 'THURSDAY', label: 'Jeudi' },
  { value: 'FRIDAY', label: 'Vendredi' }
];

export default function PiscineForm({ onSubmit, onCancel, existingSlugs = [] }: PiscineFormProps) {
  const { user } = useAuthenticator();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 5;

  // Helper function to convert Zod errors to user-friendly format
  const handleZodErrors = (error: z.ZodError): FormErrors => {
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

  const validateCurrentStep = (): boolean => {
    setErrors({});

    try {
      switch (currentStep) {
        case 1: // Day selection
          if (!formData.dayOfWeek) {
            setErrors({ fields: { dayOfWeek: 'Veuillez sélectionner un jour de la semaine' } });
            return false;
          }
          break;

        case 2: // Time slot
          if (!formData.startTime || !formData.endTime) {
            const errorFields: Record<string, string> = {};
            if (!formData.startTime) errorFields.startTime = 'Heure de début requise';
            if (!formData.endTime) errorFields.endTime = 'Heure de fin requise';
            setErrors({ fields: errorFields });
            return false;
          }
          // Validate time format and range
          const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
          if (!timeRegex.test(formData.startTime) || !timeRegex.test(formData.endTime)) {
            const errorFields: Record<string, string> = {};
            if (!timeRegex.test(formData.startTime)) errorFields.startTime = 'Format d\'heure invalide';
            if (!timeRegex.test(formData.endTime)) errorFields.endTime = 'Format d\'heure invalide';
            setErrors({ fields: errorFields });
            return false;
          }
          break;

        case 3: // Dates
          if (formData.selectedDates.length === 0) {
            setErrors({ fields: { selectedDates: 'Au moins une date doit être sélectionnée' } });
            return false;
          }
          break;

        case 4: // School info
          if (!formData.schoolLevel || !formData.teacherName.trim()) {
            const errorFields: Record<string, string> = {};
            if (!formData.schoolLevel) errorFields.schoolLevel = 'Niveau scolaire requis';
            if (!formData.teacherName.trim()) errorFields.teacherName = 'Nom de l\'enseignant requis';
            setErrors({ fields: errorFields });
            return false;
          }
          break;

        case 5: // Title
          if (!formData.title.trim()) {
            setErrors({ fields: { title: 'Le titre est requis' } });
            return false;
          }
          break;
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(handleZodErrors(error));
      } else {
        setErrors({ general: 'Erreur de validation' });
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep() || !user?.userId) {
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});

      // Ensure all required fields are properly typed
      if (!formData.dayOfWeek || !formData.schoolLevel) {
        setErrors({ general: 'Tous les champs requis doivent être remplis' });
        return;
      }

      // Validate the complete form data
      const validatedData = PiscineFormSchema.parse({
        ...formData,
        dayOfWeek: formData.dayOfWeek,
        schoolLevel: formData.schoolLevel
      });

      // Generate unique slug
      const slug = generateSlug(validatedData.title, existingSlugs);

      // Create the piscine form
      const { data: piscineForm, errors: formErrors } = await client.models.PiscineForm.create({
        title: validatedData.title,
        slug: slug,
        dayOfWeek: validatedData.dayOfWeek as Schema['EDayOfWeek']['type'],
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        schoolLevel: validatedData.schoolLevel as Schema['ESchoolLevel']['type'],
        teacherName: validatedData.teacherName,
        owner: user.userId
      });

      if (formErrors || !piscineForm) {
        console.error('PiscineForm creation errors:', formErrors);
        setErrors({ general: 'Erreur lors de la création du planning' });
        return;
      }

      // Create date slots
      const dateSlotPromises = validatedData.selectedDates.map(async (date, index) => {
        const { data: dateSlot, errors } = await client.models.PiscineDateSlot.create({
          selectedDate: dateToISOString(date),
          order: index,
          piscineFormId: piscineForm.id
        });

        if (errors) {
          console.error('PiscineDateSlot creation error:', errors);
        }

        return dateSlot;
      });

      await Promise.all(dateSlotPromises);

      onSubmit(true, `Planning "${validatedData.title}" créé avec succès !`, slug);

      // Reset form
      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(1);

    } catch (error) {
      console.error('Error creating piscine form:', error);
      if (error instanceof z.ZodError) {
        setErrors(handleZodErrors(error));
      } else {
        setErrors({ general: 'Erreur lors de la création du planning' });
      }
      onSubmit(false, 'Erreur lors de la création du planning');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <Title level={TitleLevel.LEVEL3}>
              Étape 1: Choisir le jour de la semaine
            </Title>

            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap3,
            )}
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))',
              gridTemplateRows: 'auto 1fr'
            }}>
              {DAY_OPTIONS.map((day) => (
                <Radio
                  key={day.value}
                  name="dayOfWeek"
                  id={`day-${day.value}`}
                  value={day.value}
                  label={day.label}
                  checked={formData.dayOfWeek === day.value}
                  onChange={() => setFormData(prev => ({ ...prev, dayOfWeek: day.value }))}
                />
              ))}
            </div>

            {getFieldError('dayOfWeek') && (
              <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop2}`}>
                {getFieldError('dayOfWeek')}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div>
            <PiscineTimeSlotPicker
              startTime={formData.startTime}
              endTime={formData.endTime}
              onStartTimeChange={(time) => setFormData(prev => ({ ...prev, startTime: time }))}
              onEndTimeChange={(time) => setFormData(prev => ({ ...prev, endTime: time }))}
              startTimeError={getFieldError('startTime')}
              endTimeError={getFieldError('endTime')}
            />
          </div>
        );

      case 3:
        return (
          <div>
            <PiscineDateCalendar
              selectedDates={formData.selectedDates}
              onDatesChange={(dates) => setFormData(prev => ({ ...prev, selectedDates: dates }))}
              error={getFieldError('selectedDates')}
            />
          </div>
        );

      case 4:
        return (
          <div>
            <Title level={TitleLevel.LEVEL3}>
              Étape 4: Informations scolaires
            </Title>

            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols1,
              flexStyles.isGridItemsStart
            )}>

              {/* School Level */}
              <div>
                <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                  Niveau scolaire <span className={flexStyles.hasTextDanger}>*</span>
                </Title>
                <div style={{ marginTop: '1rem' }}>
                  <select
                    id="school-level-select"
                    value={formData.schoolLevel || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      schoolLevel: e.target.value as Schema['ESchoolLevel']['type'] || undefined
                    }))}
                    className="border rounded px-3 py-2 w-full"
                    style={{
                      border: getFieldError('schoolLevel') ? '2px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '4px',
                      padding: '0.5rem 0.75rem',
                      width: '100%',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Sélectionner un niveau</option>
                    {SCHOOL_LEVEL_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {getFieldError('schoolLevel') && (
                    <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
                      {getFieldError('schoolLevel')}
                    </div>
                  )}
                </div>
              </div>

              {/* Teacher Name */}
              <div>
                <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                  Nom de l&apos;enseignant <span className={flexStyles.hasTextDanger}>*</span>
                </Title>
                <div style={{ marginTop: '1rem' }}>
                  <Input
                    id="teacher-name"
                    type="text"
                    value={formData.teacherName}
                    onChange={(e: InputChangeEvent) => setFormData(prev => ({ ...prev, teacherName: e.inputValue }))}
                    placeholder="Nom de l'enseignant responsable"
                    className={getFieldError('teacherName') ? flexStyles.hasTextDanger : ''}
                  />
                  {getFieldError('teacherName') && (
                    <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
                      {getFieldError('teacherName')}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <Title level={TitleLevel.LEVEL3}>
              Étape 5: Finaliser et publier
            </Title>

            {/* Title Input */}
            <div>
              <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
                Titre du planning <span className={flexStyles.hasTextDanger}>*</span>
              </Title>
              <div style={{ marginTop: '1rem' }}>
                <Input
                  id="planning-title"
                  type="text"
                  value={formData.title}
                  onChange={(e: InputChangeEvent) => setFormData(prev => ({ ...prev, title: e.inputValue }))}
                  placeholder="ex: Planning Piscine CE2 - Mardi matin"
                  className={getFieldError('title') ? flexStyles.hasTextDanger : ''}
                />
                {getFieldError('title') && (
                  <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
                    {getFieldError('title')}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div style={{
              backgroundColor: '#f9f9f9',
              padding: '1rem',
              borderRadius: '4px',
              border: '1px solid #e0e0e0'
            }}>
              <Title level={TitleLevel.LEVEL4}>
                Résumé du planning
              </Title>

              <div className={classNames(flexStyles.isGridDisplayGrid, flexStyles.isGridGap2)}>
                <Text><strong>Jour:</strong> {formData.dayOfWeek ? formatDayOfWeek(formData.dayOfWeek) : ''}</Text>
                <Text><strong>Horaires:</strong> {formData.startTime} - {formData.endTime}</Text>
                <Text><strong>Niveau:</strong> {formData.schoolLevel ? formatSchoolLevel(formData.schoolLevel) : ''}</Text>
                <Text><strong>Enseignant:</strong> {formData.teacherName}</Text>
                <Text><strong>Nombre de dates:</strong> {formData.selectedDates.length}</Text>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <Box>
        <Title level={TitleLevel.LEVEL2}>
          Créer un nouveau planning piscine
        </Title>

        {/* Progress indicator */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className={classNames(
            flexStyles.isFlex,
            flexStyles.isFlexDirectionRow,
            flexStyles.isAlignItemsCenter,
            flexStyles.isJustifyContentCenter,
          )}>
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
                    transform: 'rotate(-90deg)',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {errors.general && (
          <InfoBlock>
            <InfoBlockHeader>
              <Title level={TitleLevel.LEVEL3}>Erreur</Title>
            </InfoBlockHeader>
            <InfoBlockContent>
              <Text>{errors.general}</Text>
            </InfoBlockContent>
          </InfoBlock>
        )}

        {/* Step content */}
        <div>
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className={classNames(
          flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
          flexStyles.isGridCols2, flexStyles.isGridCols3Tablet,
          flexStyles.isGridItemsCenter
        )}
        style={{ marginTop: '1.5rem' }}>
          <Button
            markup={ButtonMarkup.BUTTON}
            variant={VariantState.SECONDARY}
            onClick={currentStep === 1 ? onCancel : handlePrevious}
            disabled={submitting}
          >
            {currentStep === 1 ? 'Annuler' : 'Précédent'}
          </Button>

          <div style={{ justifySelf: 'center' }}>
            <Text style={{ fontSize: '0.875rem', color: '#666' }}>
              Étape {currentStep} sur {totalSteps}
            </Text>
          </div>

          {currentStep < totalSteps ? (
            <Button
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.PRIMARY}
              onClick={handleNext}
              disabled={submitting}
              className="justify-self-end"
            >
              Suivant
            </Button>
          ) : (
            <Button
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.PRIMARY}
              onClick={handleSubmit}
              disabled={submitting}
              className="justify-self-end"
            >
              {submitting ? 'Création...' : 'Créer le planning'}
            </Button>
          )}
        </div>
      </Box>
    </div>
  );
}
