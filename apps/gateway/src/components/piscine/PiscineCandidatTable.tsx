'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import classNames from 'classnames';
import {
  Box,
  Button,
  ButtonMarkup,
  Title,
  TitleLevel,
  Text,
  VariantState,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import PiscineCandidatRow from './PiscineCandidatRow';

const client = generateClient<Schema>();

type PiscineDateSlotWithCandidats = {
  id: string;
  selectedDate: string;
  order: number;
  candidats: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    nameOfChild: string;
    order: number;
  }>;
};

interface PiscineCandidatTableProps {
  piscineFormId: string;
  isCreatorMode?: boolean;
  isAuthenticated?: boolean;
  onMessage?: (message: string, isError: boolean) => void;
  onAuthRequired?: () => void;
  piscineFormData?: {
    title: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    schoolLevel: string;
    teacherName: string;
  };
}

export default function PiscineCandidatTable({
  piscineFormId,
  isCreatorMode = false,
  isAuthenticated = false,
  onMessage,
  onAuthRequired,
  piscineFormData
}: PiscineCandidatTableProps) {
  const [dateSlots, setDateSlots] = useState<PiscineDateSlotWithCandidats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewCandidatForms, setShowNewCandidatForms] = useState<Record<string, boolean>>({});

  const loadDateSlotsWithCandidats = async () => {
    try {
      setLoading(true);

      // Load date slots for this form
      const { data: slots } = await client.models.PiscineDateSlot.list({
        filter: { piscineFormId: { eq: piscineFormId } }
      });

      if (!slots) {
        setDateSlots([]);
        return;
      }

      // Load candidats for each date slot
      const dateSlotsWithCandidats = await Promise.all(
        slots.map(async (slot) => {
          const { data: candidats } = await client.models.PiscineCandidat.list({
            filter: { piscineDateSlotId: { eq: slot.id } }
          });

          return {
            id: slot.id,
            selectedDate: slot.selectedDate,
            order: slot.order || 0,
            candidats: (candidats || []).sort((a, b) => (a.order || 0) - (b.order || 0)).map(c => ({
              id: c.id,
              firstName: c.firstName,
              lastName: c.lastName,
              email: c.email,
              phoneNumber: c.phoneNumber,
              nameOfChild: c.nameOfChild,
              order: c.order || 0
            }))
          };
        })
      );

      // Sort date slots by order
      const sortedDateSlots = dateSlotsWithCandidats.sort((a, b) => (a.order || 0) - (b.order || 0));
      setDateSlots(sortedDateSlots);

    } catch (error) {
      console.error('Error loading date slots with candidats:', error);
      setError('Erreur lors du chargement des inscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (piscineFormId) {
      loadDateSlotsWithCandidats();
    }
  }, [piscineFormId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCandidatChange = () => {
    // Reload data when candidats change
    loadDateSlotsWithCandidats();
  };

  const toggleNewCandidatForm = (dateSlotId: string) => {
    // Check authentication first
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }

    setShowNewCandidatForms(prev => ({
      ...prev,
      [dateSlotId]: !prev[dateSlotId]
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    onMessage?.('URL copiée dans le presse-papier !', false);
  };

  const onExportCSV = () => {
    try {
      // Check if there's data to export
      const totalCandidats = dateSlots.reduce((total, slot) => total + slot.candidats.length, 0);
      if (totalCandidats === 0) {
        onMessage?.('Aucune inscription à exporter', true);
        return;
      }

      // CSV Headers and metadata
      const currentDate = new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      let csvContent = '\uFEFF'; // UTF-8 BOM for proper encoding

      // Add form metadata as header
      if (piscineFormData) {
        csvContent += `Planning Piscine: ${piscineFormData.title}\n`;
        csvContent += `Jour: ${piscineFormData.dayOfWeek} | Horaires: ${piscineFormData.startTime} - ${piscineFormData.endTime} | Niveau: ${piscineFormData.schoolLevel} | Enseignant: ${piscineFormData.teacherName}\n`;
        csvContent += `Export généré le: ${currentDate}\n`;
        csvContent += '\n';
      }

      // CSV column headers
      csvContent += 'Date,Jour,Prénom,Nom,Email,Téléphone,Nom de l\'enfant,Ordre d\'inscription\n';

      // Sort date slots by date and export each candidat
      const sortedDateSlots = [...dateSlots].sort((a, b) =>
        new Date(a.selectedDate).getTime() - new Date(b.selectedDate).getTime()
      );

      sortedDateSlots.forEach(dateSlot => {
        const date = new Date(dateSlot.selectedDate);
        const formattedDate = format(date, 'dd/MM/yyyy');
        const dayName = format(date, 'EEEE', { locale: fr });

        // Sort candidats by order
        const sortedCandidats = [...dateSlot.candidats].sort((a, b) => (a.order || 0) - (b.order || 0));

        sortedCandidats.forEach(candidat => {
          // Escape commas and quotes in CSV data
          const escapeCSV = (str: string) => {
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          };

          csvContent += [
            formattedDate,
            dayName,
            escapeCSV(candidat.firstName),
            escapeCSV(candidat.lastName),
            escapeCSV(candidat.email),
            escapeCSV(candidat.phoneNumber),
            escapeCSV(candidat.nameOfChild),
            candidat.order || 0
          ].join(',') + '\n';
        });
      });

      // Add summary at the end
      csvContent += '\n';
      csvContent += `Total des inscriptions: ${totalCandidats}\n`;
      csvContent += `Nombre de dates: ${dateSlots.length}\n`;

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');

      // Generate filename with form title and current date
      const safeTitle = piscineFormData?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'planning_piscine';
      const dateString = new Date().toISOString().split('T')[0];
      const filename = `${safeTitle}_inscriptions_${dateString}.csv`;

      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(link.href);

      onMessage?.(`Export CSV réussi ! ${totalCandidats} inscription(s) exportée(s).`, false);

    } catch (error) {
      console.error('Error exporting CSV:', error);
      onMessage?.('Erreur lors de l\'export CSV', true);
    }
  };

  if (loading) {
    return (
      <div>
        <Text className={classNames(flexStyles.isFullwidth, flexStyles.hasTextCentered)}>Chargement des inscriptions...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fef2f2',
        padding: '1rem',
        borderRadius: '4px',
        border: '1px solid #fecaca'
      }}>
        <Text style={{ color: '#dc2626' }}>{error}</Text>
      </div>
    );
  }

  if (dateSlots.length === 0) {
    return (
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '1rem',
        borderRadius: '4px',
        border: '1px solid #e0e0e0'
      }}>
        <Text style={{ fontStyle: 'italic', color: '#666' }}>
          Aucune date disponible pour ce planning.
        </Text>
      </div>
    );
  }

  return (
    <div>
      <div className={classNames(
        flexStyles.isFlexDirectionRow,
        flexStyles.isJustifyContentBetween,
        flexStyles.isAlignItemsCenter,

      )}>
        <Title level={TitleLevel.LEVEL2}>
          Dates et inscriptions
        </Title>

        <div className={classNames(
          flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
          flexStyles.isGridCols2,
          flexStyles.isAlignItemsCenter,
          flexStyles.isJustifyContentCenter,
          flexStyles.isJustifiedCenter,
          flexStyles.isFullheight,
          flexStyles.isFullwidth,
        )} style={{ marginBottom: '1.5rem' }}>
          <div style={{ maxWidth: '200px' }}>
            <Button
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.TERTIARY}
              onClick={copyUrl}
              className="text-sm"
            >
              📋 Copier le lien
            </Button>
          </div>
          {isCreatorMode && (
            <div style={{ maxWidth: '200px' }}>
              <Button
                markup={ButtonMarkup.BUTTON}
                variant={VariantState.TERTIARY}
                onClick={onExportCSV}
                className="text-sm"
              >
                Exporter CSV
              </Button>
            </div>
          )}
        </div>
      </div>

      {dateSlots.map((dateSlot) => (
        <div key={dateSlot.id} className={classNames(
          flexStyles.isMarginBottom4
        )} style={{
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>

          {/* Date Header */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <div className={classNames(
              flexStyles.isFlexDirectionRow,
              flexStyles.isJustifyContentBetween,
              flexStyles.isAlignItemsCenter
            )}>
              <div>
                <Title level={TitleLevel.LEVEL3} className={flexStyles.isMarginless}>
                  {formatDate(dateSlot.selectedDate)}
                </Title>
                <Text style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                  {formatShortDate(dateSlot.selectedDate)} • {dateSlot.candidats.length} inscription{dateSlot.candidats.length > 1 ? 's' : ''}
                </Text>
              </div>

              <Button
                markup={ButtonMarkup.BUTTON}
                variant={isAuthenticated ? VariantState.PRIMARY : VariantState.TERTIARY}
                onClick={() => toggleNewCandidatForm(dateSlot.id)}
                className="text-sm"
              >
                {isAuthenticated
                  ? (showNewCandidatForms[dateSlot.id] ? 'Annuler' : '+ S\'inscrire')
                  : '🔒 Se connecter pour s\'inscrire'
                }
              </Button>
            </div>
          </div>

          {/* Candidats Content */}
          <div style={{ padding: '1rem' }}>

            {/* Authentication info for unauthenticated users */}
            {!isAuthenticated && (
              <div style={{
                backgroundColor: '#f0f9ff',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #0ea5e9',
                marginBottom: '1rem'
              }}>
                <Text style={{ fontSize: '0.875rem', color: '#0369a1' }}>
                  ℹ️ Vous devez être connecté pour vous inscrire à cette session piscine.
                </Text>
              </div>
            )}

            {/* New candidat form */}
            {showNewCandidatForms[dateSlot.id] && (
              <div>
                <Text style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1rem', color: '#0369a1' }}>
                  Nouvelle inscription pour cette date:
                </Text>
                <PiscineCandidatRow
                  piscineDateSlotId={dateSlot.id}
                  piscineFormId={piscineFormId}
                  onSuccess={(message) => {
                    onMessage?.(message, false);
                    setShowNewCandidatForms(prev => ({ ...prev, [dateSlot.id]: false }));
                    handleCandidatChange();
                  }}
                  onError={(message) => onMessage?.(message, true)}
                  onCandidatChange={handleCandidatChange}
                />
              </div>
            )}

            {/* Existing candidats */}
            {dateSlot.candidats.length === 0 ? (
              <div style={{
                backgroundColor: '#f9f9f9',
                padding: '1rem',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <Text style={{ fontStyle: 'italic', color: '#666' }}>
                  Aucune inscription pour cette date. Soyez le premier à vous inscrire !
                </Text>
              </div>
            ) : (
              <div>
                <Text style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '1rem', color: '#059669' }}>
                  Inscriptions confirmées:
                </Text>
                {dateSlot.candidats.map((candidat) => (
                  <PiscineCandidatRow
                    key={candidat.id}
                    piscineDateSlotId={dateSlot.id}
                    piscineFormId={piscineFormId}
                    existingCandidat={candidat}
                    onSuccess={(message) => onMessage?.(message, false)}
                    onError={(message) => onMessage?.(message, true)}
                    isCreatorMode={isCreatorMode}
                    onCandidatChange={handleCandidatChange}
                  />
                ))}
              </div>
            )}

            {/* Add another candidat button for existing date */}
            {dateSlot.candidats.length > 0 && !showNewCandidatForms[dateSlot.id] && (
              <div style={{ marginTop: '1rem' }}>
                <Button
                  markup={ButtonMarkup.BUTTON}
                  variant={isAuthenticated ? VariantState.SECONDARY : VariantState.TERTIARY}
                  onClick={() => toggleNewCandidatForm(dateSlot.id)}
                  className="text-sm"
                >
                  {isAuthenticated
                    ? '+ Ajouter une inscription'
                    : '🔒 Se connecter pour s\'inscrire'
                  }
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Summary */}
      <div style={{
        backgroundColor: '#f0f9ff',
        padding: '1rem',
        borderRadius: '4px',
        border: '1px solid #0ea5e9'
      }}>
        <Text style={{ fontWeight: 'bold', color: '#0369a1' }}>
          Résumé: {dateSlots.reduce((total, slot) => total + slot.candidats.length, 0)} inscription{dateSlots.reduce((total, slot) => total + slot.candidats.length, 0) > 1 ? 's' : ''} au total sur {dateSlots.length} date{dateSlots.length > 1 ? 's' : ''} disponible{dateSlots.length > 1 ? 's' : ''}
        </Text>
      </div>
    </div>
  );
}
