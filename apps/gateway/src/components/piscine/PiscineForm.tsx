'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { z } from 'zod';
import classNames from 'classnames';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Divider } from '@flex-design-system/react-ts/client-sync-styled-direct/divider';
import { Input, type InputChangeEvent } from '@flex-design-system/react-ts/client-sync-styled-direct/input';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  InfoBlock,
  InfoBlockContent,
  InfoBlockHeader
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';

import MultiDaySelector from './MultiDaySelector';
import MultiDayTimeSlotPicker from './MultiDayTimeSlotPicker';
import MultiDayCalendarPicker from './MultiDayCalendarPicker';
import {
  PiscineFormSchema,
  type PiscineFormData,
  type DayTimeSlot,
  generateSlug,
  formatDayOfWeek,
  formatSchoolLevel,
  dateToISOString,
  getDayNumber
} from '@src/lib/piscine-helpers';

const client = generateClient<Schema>();

interface PiscineFormProps {
  onSubmit: (success: boolean, message: string, slug?: string) => void;
  onCancel: () => void;
  existingSlugs?: string[];
  editingFormId?: string; // Optional: if provided, load and edit existing form
}

interface FormErrors {
  general?: string;
  fields?: Record<string, string>;
}

const INITIAL_FORM_DATA = {
  title: '',
  schoolLevel: undefined as Schema['ESchoolLevel']['type'] | undefined,
  teacherName: ''
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

export default function PiscineForm({ onSubmit, onCancel, existingSlugs = [], editingFormId }: PiscineFormProps) {
  const { user } = useAuthenticator();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(!!editingFormId);
  const [loadingExistingData, setLoadingExistingData] = useState(!!editingFormId);
  const [existingDateSlotIds, setExistingDateSlotIds] = useState<string[]>([]);
  const [orphanedDateSlots, setOrphanedDateSlots] = useState<Array<{id: string; date: string; participantCount: number}>>([]);

  // Multi-day mode state (always in multi-day mode)
  const [dayTimeSlots, setDayTimeSlots] = useState<DayTimeSlot[]>([
    { dayOfWeek: 'MONDAY', startTime: '', endTime: '', enabled: false },
    { dayOfWeek: 'TUESDAY', startTime: '', endTime: '', enabled: false },
    { dayOfWeek: 'WEDNESDAY', startTime: '', endTime: '', enabled: false },
    { dayOfWeek: 'THURSDAY', startTime: '', endTime: '', enabled: false },
    { dayOfWeek: 'FRIDAY', startTime: '', endTime: '', enabled: false },
  ]);
  const [selectedDatesPerDay, setSelectedDatesPerDay] = useState<Record<string, Date[]>>({});

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

  // Load existing form data when in edit mode
  useEffect(() => {
    const loadExistingForm = async () => {
      if (!editingFormId) return;

      try {
        setLoadingExistingData(true);

        // Load the piscine form
        const { data: form, errors: formErrors } = await client.models.PiscineForm.get({ id: editingFormId });

        if (formErrors || !form) {
          console.error('Error loading form:', formErrors);
          setErrors({ general: 'Erreur lors du chargement du planning' });
          setLoadingExistingData(false);
          return;
        }

        // ===== MULTI-DAY MODE (only mode) =====

        // Load time slots
        const { data: timeSlots } = await client.models.PiscineTimeSlot.list({
          filter: { piscineFormId: { eq: editingFormId } }
        });

        if (timeSlots && timeSlots.length > 0) {
          // Sort time slots by order
          const sortedTimeSlots = [...timeSlots].sort((a, b) => (a.order || 0) - (b.order || 0));

          // Update dayTimeSlots state
          const updatedDayTimeSlots = dayTimeSlots.map(slot => {
            const existingSlot = sortedTimeSlots.find(ts => ts.dayOfWeek === slot.dayOfWeek);
            if (existingSlot) {
              return {
                dayOfWeek: slot.dayOfWeek,
                startTime: existingSlot.startTime || '',
                endTime: existingSlot.endTime || '',
                enabled: true
              };
            }
            return slot;
          });
          setDayTimeSlots(updatedDayTimeSlots);

          // Load date slots for each time slot
          const allDateSlots: string[] = [];
          const datesByDay: Record<string, Date[]> = {};

          for (const timeSlot of sortedTimeSlots) {
            const { data: dateSlots } = await client.models.PiscineDateSlot.list({
              filter: { piscineTimeSlotId: { eq: timeSlot.id } }
            });

            if (dateSlots && dateSlots.length > 0) {
              const dates = dateSlots.map(ds => {
                allDateSlots.push(ds.id);
                return new Date(ds.selectedDate);
              });
              datesByDay[timeSlot.dayOfWeek] = dates;
            }
          }

          setSelectedDatesPerDay(datesByDay);
          setExistingDateSlotIds(allDateSlots);
        }

        // Load basic form data
        setFormData(prev => ({
          ...prev,
          title: form.title || '',
          schoolLevel: form.schoolLevel as Schema['ESchoolLevel']['type'],
          teacherName: form.teacherName || ''
        }));

      } catch (error) {
        console.error('Error loading existing form:', error);
        setErrors({ general: 'Erreur lors du chargement du planning' });
      } finally {
        setLoadingExistingData(false);
      }
    };

    loadExistingForm();
  }, [editingFormId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Multi-day mode handlers
  const handleDayToggle = (dayOfWeek: Schema['EDayOfWeek']['type'], enabled: boolean) => {
    setDayTimeSlots(prev =>
      prev.map(slot =>
        slot.dayOfWeek === dayOfWeek ? { ...slot, enabled } : slot
      )
    );
  };

  const handleTimeSlotChange = (
    dayOfWeek: Schema['EDayOfWeek']['type'],
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setDayTimeSlots(prev =>
      prev.map(slot =>
        slot.dayOfWeek === dayOfWeek ? { ...slot, [field]: value } : slot
      )
    );
  };

  const validateCurrentStep = (): boolean => {
    setErrors({});

    try {
      switch (currentStep) {
        case 1: // Day selection
          // Multi-day: At least one day must be enabled
          const enabledDays = dayTimeSlots.filter(slot => slot.enabled);
          if (enabledDays.length === 0) {
            setErrors({ fields: { days: 'Sélectionnez au moins un jour' } });
            return false;
          }
          break;

        case 2: // Time slot
          // Multi-day: All enabled days must have valid time slots
          const enabledDaysStep2 = dayTimeSlots.filter(slot => slot.enabled);
          const invalidDays = enabledDaysStep2.filter(
            slot => !slot.startTime || !slot.endTime
          );
          if (invalidDays.length > 0) {
            setErrors({
              fields: {
                timeSlots: `Définissez les horaires pour tous les jours sélectionnés`
              }
            });
            return false;
          }
          break;

        case 3: // Dates
          // Multi-day: Each enabled day must have at least one date
          const enabledDaysStep3 = dayTimeSlots.filter(slot => slot.enabled);
          const daysWithoutDates = enabledDaysStep3.filter(
            slot => !selectedDatesPerDay[slot.dayOfWeek]?.length
          );
          if (daysWithoutDates.length > 0) {
            setErrors({
              fields: {
                dates: 'Sélectionnez au moins une date pour chaque jour actif'
              }
            });
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

      // ===== EDIT MODE: UPDATE EXISTING FORM =====
      if (isEditMode && editingFormId) {
        // Multi-day update (only mode)
        if (!formData.schoolLevel || !formData.title.trim()) {
          setErrors({ general: 'Tous les champs requis doivent être remplis' });
          return;
        }

        // Update the piscine form
        const { data: updatedForm, errors: updateErrors } = await client.models.PiscineForm.update({
          id: editingFormId,
          title: formData.title.trim(),
          schoolLevel: formData.schoolLevel as Schema['ESchoolLevel']['type'],
          teacherName: formData.teacherName.trim()
        });

        if (updateErrors || !updatedForm) {
          console.error('PiscineForm update errors:', updateErrors);
          setErrors({ general: 'Erreur lors de la mise à jour du planning' });
          return;
        }

        // Delete all existing time slots (cascades to date slots)
        const { data: existingTimeSlots } = await client.models.PiscineTimeSlot.list({
          filter: { piscineFormId: { eq: editingFormId } }
        });

        if (existingTimeSlots) {
          await Promise.all(
            existingTimeSlots.map(ts => client.models.PiscineTimeSlot.delete({ id: ts.id }))
          );
        }

        // Delete orphaned date slots that aren't linked to time slots
        const { data: allDateSlots } = await client.models.PiscineDateSlot.list({
          filter: { piscineFormId: { eq: editingFormId } }
        });

        if (allDateSlots) {
          const orphanedDateSlots = allDateSlots.filter(ds => !ds.piscineTimeSlotId);
          await Promise.all(
            orphanedDateSlots.map(ds => client.models.PiscineDateSlot.delete({ id: ds.id }))
          );
        }

        // Create new time slots
        const enabledDays = dayTimeSlots.filter(slot => slot.enabled);
        const timeSlotPromises = enabledDays.map(async (daySlot, index) => {
          const { data: timeSlot } = await client.models.PiscineTimeSlot.create({
            dayOfWeek: daySlot.dayOfWeek as Schema['EDayOfWeek']['type'],
            startTime: daySlot.startTime,
            endTime: daySlot.endTime,
            order: index,
            piscineFormId: editingFormId
          });
          return timeSlot;
        });

        const createdTimeSlots = await Promise.all(timeSlotPromises);

        // Create new date slots
        const dateSlotPromises = [];
        let globalOrder = 0;

        for (const timeSlot of createdTimeSlots) {
          if (!timeSlot) continue;

          const datesForDay = selectedDatesPerDay[timeSlot.dayOfWeek] || [];

          for (const date of datesForDay) {
            dateSlotPromises.push(
              client.models.PiscineDateSlot.create({
                selectedDate: dateToISOString(date),
                dayOfWeek: timeSlot.dayOfWeek,
                order: globalOrder++,
                piscineFormId: editingFormId,
                piscineTimeSlotId: timeSlot.id
              })
            );
          }
        }

        await Promise.all(dateSlotPromises);

        onSubmit(true, `Planning "${formData.title}" mis à jour avec succès !`, updatedForm.slug);
        return;
      }

      // ===== CREATE MODE: NEW FORM =====
      // Multi-day mode (only mode)

      // Validate form data
      if (!formData.schoolLevel || !formData.title.trim()) {
        setErrors({ general: 'Tous les champs requis doivent être remplis' });
        return;
      }

      // Generate unique slug
      const slug = generateSlug(formData.title, existingSlugs);

      // Create the piscine form (always multi-day mode)
      const { data: piscineForm, errors: formErrors } = await client.models.PiscineForm.create({
        title: formData.title.trim(),
        slug: slug,
        isMultiDay: true,
        schoolLevel: formData.schoolLevel as Schema['ESchoolLevel']['type'],
        teacherName: formData.teacherName.trim(),
        owner: user.userId
      });

      if (formErrors || !piscineForm) {
        console.error('PiscineForm creation errors:', formErrors);
        setErrors({ general: 'Erreur lors de la création du planning' });
        return;
      }

      // Create PiscineTimeSlot records for each enabled day
      const enabledDays = dayTimeSlots.filter(slot => slot.enabled);
      const timeSlotPromises = enabledDays.map(async (daySlot, index) => {
        const { data: timeSlot, errors } = await client.models.PiscineTimeSlot.create({
          dayOfWeek: daySlot.dayOfWeek as Schema['EDayOfWeek']['type'],
          startTime: daySlot.startTime,
          endTime: daySlot.endTime,
          order: index,
          piscineFormId: piscineForm.id
        });

        if (errors) {
          console.error('PiscineTimeSlot creation error:', errors);
        }

        return timeSlot;
      });

      const createdTimeSlots = await Promise.all(timeSlotPromises);

      // Create PiscineDateSlot records linked to time slots
      const dateSlotPromises = [];
      let globalOrder = 0;

      for (const timeSlot of createdTimeSlots) {
        if (!timeSlot) continue;

        const datesForDay = selectedDatesPerDay[timeSlot.dayOfWeek] || [];

        for (const date of datesForDay) {
          dateSlotPromises.push(
            client.models.PiscineDateSlot.create({
              selectedDate: dateToISOString(date),
              dayOfWeek: timeSlot.dayOfWeek,
              order: globalOrder++,
              piscineFormId: piscineForm.id,
              piscineTimeSlotId: timeSlot.id
            })
          );
        }
      }

      await Promise.all(dateSlotPromises);

      onSubmit(true, `Planning "${formData.title}" créé avec succès !`, slug);

      // Reset form
      setFormData(INITIAL_FORM_DATA);
      setDayTimeSlots([
        { dayOfWeek: 'MONDAY', startTime: '', endTime: '', enabled: false },
        { dayOfWeek: 'TUESDAY', startTime: '', endTime: '', enabled: false },
        { dayOfWeek: 'WEDNESDAY', startTime: '', endTime: '', enabled: false },
        { dayOfWeek: 'THURSDAY', startTime: '', endTime: '', enabled: false },
        { dayOfWeek: 'FRIDAY', startTime: '', endTime: '', enabled: false },
      ]);
      setSelectedDatesPerDay({});
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
            <MultiDaySelector
              dayTimeSlots={dayTimeSlots}
              onDayToggle={handleDayToggle}
              error={getFieldError('days')}
            />
          </div>
        );

      case 2:
        return (
          <div>
            <MultiDayTimeSlotPicker
              dayTimeSlots={dayTimeSlots}
              onTimeSlotChange={handleTimeSlotChange}
              errors={errors.fields}
            />
          </div>
        );

      case 3:
        return (
          <div>
            <MultiDayCalendarPicker
              dayTimeSlots={dayTimeSlots}
              selectedDatesPerDay={selectedDatesPerDay}
              onDatesChange={setSelectedDatesPerDay}
              error={getFieldError('dates')}
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
              border: '1px solid #e0e0e0',
              marginTop: '1rem'
            }}>
              <Title level={TitleLevel.LEVEL4}>
                Résumé du planning
              </Title>

              <div className={classNames(flexStyles.isGridDisplayGrid, flexStyles.isGridGap2)}>
                {/* <Text><strong>Mode:</strong> Multi-jours</Text> */}
                {dayTimeSlots.filter(s => s.enabled).map((daySlot) => {
                  const datesCount = selectedDatesPerDay[daySlot.dayOfWeek]?.length || 0;
                  return (
                    <div key={daySlot.dayOfWeek} style={{ marginBottom: '0.5rem' }}>
                      <Text><strong>{formatDayOfWeek(daySlot.dayOfWeek)}:</strong></Text>
                      <Text style={{ marginLeft: '1rem' }}>
                        • Horaires: {daySlot.startTime} - {daySlot.endTime}
                      </Text>
                      <Text style={{ marginLeft: '1rem' }}>
                        • Dates: {datesCount} date{datesCount > 1 ? 's' : ''}
                      </Text>
                    </div>
                  );
                })}
                <Divider />
                <Text><strong>Niveau:</strong> {formData.schoolLevel ? formatSchoolLevel(formData.schoolLevel) : ''}</Text>
                <Text><strong>Enseignant:</strong> {formData.teacherName}</Text>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show loading indicator while loading existing data
  if (loadingExistingData) {
    return (
      <div>
        <Box>
          <Title level={TitleLevel.LEVEL2}>Chargement...</Title>
          <Text className={classNames(flexStyles.hasTextCentered, flexStyles.isMarginTop4)}>
            Chargement des données du planning...
          </Text>
        </Box>
      </div>
    );
  }

  return (
    <div>
      <Box>
        <Title level={TitleLevel.LEVEL2}>
          {isEditMode ? 'Modifier le planning piscine' : 'Créer un nouveau planning piscine'}
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
              {submitting
                ? (isEditMode ? 'Mise à jour...' : 'Création...')
                : (isEditMode ? 'Mettre à jour le planning' : 'Créer le planning')
              }
            </Button>
          )}
        </div>
      </Box>
    </div>
  );
}
