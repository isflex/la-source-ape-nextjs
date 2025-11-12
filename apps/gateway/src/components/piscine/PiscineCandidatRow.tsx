'use client';

import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { z } from 'zod';
import classNames from 'classnames';
import {
  Box,
  Button,
  ButtonMarkup,
  Input,
  type InputChangeEvent,
  Text,
  VariantState,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import { PiscineCandidatSchema, type PiscineCandidatData } from '@src/lib/piscine-helpers';

const client = generateClient<Schema>();

interface PiscineCandidatRowProps {
  piscineDateSlotId: string;
  piscineFormId: string;
  existingCandidat?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    nameOfChild: string;
    order: number;
  };
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  isCreatorMode?: boolean;
  onCandidatChange?: () => void;
}

const INITIAL_CANDIDAT_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  nameOfChild: '',
  piscineDateSlotId: '',
  piscineFormId: '',
  order: 0
};

export default function PiscineCandidatRow({
  piscineDateSlotId,
  piscineFormId,
  existingCandidat,
  onSuccess,
  onError,
  isCreatorMode = false,
  onCandidatChange
}: PiscineCandidatRowProps) {
  const [candidatData, setCandidatData] = useState<Partial<PiscineCandidatData>>(() => {
    if (existingCandidat) {
      return {
        firstName: existingCandidat.firstName,
        lastName: existingCandidat.lastName,
        email: existingCandidat.email,
        phoneNumber: existingCandidat.phoneNumber,
        nameOfChild: existingCandidat.nameOfChild,
        piscineDateSlotId,
        piscineFormId,
        order: existingCandidat.order
      };
    }
    return {
      ...INITIAL_CANDIDAT_DATA,
      piscineDateSlotId,
      piscineFormId
    };
  });

  const [isEditing, setIsEditing] = useState(!existingCandidat);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof PiscineCandidatData, value: string) => {
    setCandidatData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateAndSubmit = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});

      // Validate with Zod schema
      const validatedData = PiscineCandidatSchema.parse(candidatData);

      if (existingCandidat) {
        // Update existing candidat
        const { data, errors: updateErrors } = await client.models.PiscineCandidat.update({
          id: existingCandidat.id,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phoneNumber: validatedData.phoneNumber,
          nameOfChild: validatedData.nameOfChild
        });

        if (updateErrors || !data) {
          console.error('Update candidat errors:', updateErrors);
          onError?.('Erreur lors de la mise à jour de l\'inscription');
          return;
        }

        onSuccess?.('Inscription mise à jour avec succès !');
        setIsEditing(false);
      } else {
        // Create new candidat
        const { data, errors: createErrors } = await client.models.PiscineCandidat.create({
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phoneNumber: validatedData.phoneNumber,
          nameOfChild: validatedData.nameOfChild,
          piscineDateSlotId: validatedData.piscineDateSlotId,
          piscineFormId: validatedData.piscineFormId,
          order: 0 // Will be assigned by database
        });

        if (createErrors || !data) {
          console.error('Create candidat errors:', createErrors);
          onError?.('Erreur lors de l\'inscription');
          return;
        }

        onSuccess?.('Inscription ajoutée avec succès !');
        // Reset form for new candidat
        setCandidatData({
          ...INITIAL_CANDIDAT_DATA,
          piscineDateSlotId,
          piscineFormId
        });
      }

      onCandidatChange?.(); // Refresh parent component

    } catch (error) {
      console.error('Validation error:', error);
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        onError?.('Erreur lors de la validation des données');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingCandidat) return;

    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer l'inscription de ${existingCandidat.firstName} ${existingCandidat.lastName} ?`);
    if (!confirmed) return;

    try {
      setIsSubmitting(true);

      const { errors } = await client.models.PiscineCandidat.delete({
        id: existingCandidat.id
      });

      if (errors) {
        console.error('Delete candidat errors:', errors);
        onError?.('Erreur lors de la suppression');
        return;
      }

      onSuccess?.('Inscription supprimée avec succès');
      onCandidatChange?.(); // Refresh parent component

    } catch (error) {
      console.error('Delete error:', error);
      onError?.('Erreur lors de la suppression');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (existingCandidat) {
      // Reset to original data
      setCandidatData({
        firstName: existingCandidat.firstName,
        lastName: existingCandidat.lastName,
        email: existingCandidat.email,
        phoneNumber: existingCandidat.phoneNumber,
        nameOfChild: existingCandidat.nameOfChild,
        piscineDateSlotId,
        piscineFormId,
        order: existingCandidat.order
      });
      setIsEditing(false);
    } else {
      // Reset to empty
      setCandidatData({
        ...INITIAL_CANDIDAT_DATA,
        piscineDateSlotId,
        piscineFormId
      });
    }
    setErrors({});
  };

  if (!isEditing && existingCandidat) {
    // Display mode
    return (
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '1rem',
        borderRadius: '4px',
        border: '1px solid #e0e0e0',
        marginBottom: '0.5rem'
      }}>
        <div className={classNames(
          flexStyles.isGridDisplayGrid, flexStyles.isGridGap3,
          flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
          flexStyles.isItemsCenter
        )}>
          <div>
            <Text style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
              {existingCandidat.firstName} {existingCandidat.lastName}
            </Text>
            <Text style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
              Enfant: {existingCandidat.nameOfChild}
            </Text>
            <Text style={{ fontSize: '0.875rem', color: '#666' }}>
              {existingCandidat.email} • {existingCandidat.phoneNumber}
            </Text>
          </div>

          {isCreatorMode && (
            <div className={classNames(
              flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
              flexStyles.isGridCols2,
              flexStyles.isAlignItemsCenter,
              flexStyles.isJustifyContentCenter,
              flexStyles.isJustifiedCenter,
              flexStyles.isFullheight,
              flexStyles.isFullwidth,
            )}>
              <div style={{ maxWidth: '200px' }}>
                <Button
                  markup={ButtonMarkup.BUTTON}
                  variant={VariantState.SECONDARY}
                  onClick={() => setIsEditing(true)}
                  disabled={isSubmitting}
                  className="text-sm px-2 py-1"
                >
                  Modifier
                </Button>
              </div>
              <div style={{ maxWidth: '200px' }}>
                <Button
                  markup={ButtonMarkup.BUTTON}
                  variant={VariantState.DANGER}
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="text-sm px-2 py-1"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Edit/Create mode
  return (
    <div style={{
      backgroundColor: existingCandidat ? '#fff5f5' : '#f0f9ff',
      padding: '1rem',
      borderRadius: '4px',
      border: existingCandidat ? '1px solid #fecaca' : '1px solid #bfdbfe',
      marginBottom: '0.5rem'
    }}>
      <div className={classNames(
        flexStyles.isGridDisplayGrid, flexStyles.isGridGap3,
        flexStyles.isGridCols1, flexStyles.isGridCols2Tablet
      )}>

        {/* First row: First name and Last name */}
        <div>
          <Text style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Prénom *
          </Text>
          <Input
            type="text"
            value={candidatData.firstName || ''}
            onChange={(e: InputChangeEvent) => handleInputChange('firstName', e.inputValue)}
            placeholder="Prénom"
            className={errors.firstName ? flexStyles.hasTextDanger : ''}
          />
          {errors.firstName && (
            <Text style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              {errors.firstName}
            </Text>
          )}
        </div>

        <div>
          <Text style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Nom de famille *
          </Text>
          <Input
            type="text"
            value={candidatData.lastName || ''}
            onChange={(e: InputChangeEvent) => handleInputChange('lastName', e.inputValue)}
            placeholder="Nom de famille"
            className={errors.lastName ? flexStyles.hasTextDanger : ''}
          />
          {errors.lastName && (
            <Text style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              {errors.lastName}
            </Text>
          )}
        </div>

        {/* Second row: Email and Phone */}
        <div>
          <Text style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Email *
          </Text>
          <Input
            type="email"
            value={candidatData.email || ''}
            onChange={(e: InputChangeEvent) => handleInputChange('email', e.inputValue)}
            placeholder="adresse@email.com"
            className={errors.email ? flexStyles.hasTextDanger : ''}
          />
          {errors.email && (
            <Text style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              {errors.email}
            </Text>
          )}
        </div>

        <div>
          <Text style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Téléphone *
          </Text>
          <Input
            type="tel"
            value={candidatData.phoneNumber || ''}
            onChange={(e: InputChangeEvent) => handleInputChange('phoneNumber', e.inputValue)}
            placeholder="06 12 34 56 78"
            className={errors.phoneNumber ? flexStyles.hasTextDanger : ''}
          />
          {errors.phoneNumber && (
            <Text style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              {errors.phoneNumber}
            </Text>
          )}
        </div>

        {/* Third row: Child name (full width) */}
        <div className={classNames(
          flexStyles.isGridColSpan1, flexStyles.isGridColSpan2Tablet
        )}>
          <Text style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Nom de l&apos;enfant *
          </Text>
          <Input
            type="text"
            value={candidatData.nameOfChild || ''}
            onChange={(e: InputChangeEvent) => handleInputChange('nameOfChild', e.inputValue)}
            placeholder="Nom et prénom de l'enfant"
            className={errors.nameOfChild ? flexStyles.hasTextDanger : ''}
          />
          {errors.nameOfChild && (
            <Text style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              {errors.nameOfChild}
            </Text>
          )}
        </div>

        {/* Buttons row */}
        <div className={classNames(
          flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
          flexStyles.isGridCols2,
          flexStyles.isAlignItemsCenter,
          flexStyles.isJustifyContentCenter,
          flexStyles.isJustifiedCenter,
          flexStyles.isFullheight,
          flexStyles.isFullwidth,
        )} style={{ margin: '0.5rem 0 0', alignSelf: 'center' }}>
          <div style={{ maxWidth: '200px' }}>
            <Button
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.SECONDARY}
              onClick={handleCancel}
              disabled={isSubmitting}
              className="text-sm px-4 py-2"
            >
              Annuler
            </Button>
          </div>
          <div style={{ maxWidth: '200px' }}>
            <Button
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.PRIMARY}
              onClick={validateAndSubmit}
              disabled={isSubmitting}
              className="text-sm px-4 py-2"
            >
              {isSubmitting ? 'Enregistrement...' : existingCandidat ? 'Mettre à jour' : 'S\'inscrire'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
