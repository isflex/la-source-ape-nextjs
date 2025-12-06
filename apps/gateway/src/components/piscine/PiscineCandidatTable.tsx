'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@amplify/data/resource';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { parseISODate } from '@src/lib/piscine-helpers';
import classNames from 'classnames';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import { default as flexStyles } from '@flex-design-system/framework';
import PiscineCandidatRow from './PiscineCandidatRow';
import DroppableDateSlot from './DroppableDateSlot';
import DraggableCandidatRow from './DraggableCandidatRow';

const client = generateClient<Schema>();

type PiscineDateSlotWithCandidats = {
  id: string;
  selectedDate: string;
  order: number;
  piscineTimeSlotId: string | null; // Nullable for orphaned slots
  candidats: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    nameOfChild: string;
    order: number;
    owner?: string | null; // Cognito userId of participant creator
  }>;
};

type PiscineTimeSlotData = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

interface PiscineCandidatTableProps {
  piscineFormId: string;
  isCreatorMode?: boolean;
  isAuthenticated?: boolean;
  onMessage?: (message: string, isError: boolean) => void;
  onAuthRequired?: () => void;
  piscineFormData?: {
    title: string;
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
  const { user } = useAuthenticator();
  const [dateSlots, setDateSlots] = useState<PiscineDateSlotWithCandidats[]>([]);
  const [timeSlots, setTimeSlots] = useState<Record<string, PiscineTimeSlotData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewCandidatForms, setShowNewCandidatForms] = useState<Record<string, boolean>>({});
  const [activeDragCandidat, setActiveDragCandidat] = useState<any | null>(null);

  // Helper to check if a date slot is orphaned (time slot was deleted)
  const isOrphanedSlot = (dateSlot: PiscineDateSlotWithCandidats): boolean => {
    return !dateSlot.piscineTimeSlotId || !timeSlots[dateSlot.piscineTimeSlotId];
  };

  // Helper to check if current user can modify a participant
  const canModifyCandidat = (candidat: { owner?: string | null }): boolean => {
    if (isCreatorMode) return true; // Form creator can modify all
    if (!user?.userId) return false; // Must be authenticated
    return candidat.owner === user.userId; // Can modify own participants
  };

  // Configure sensors (press and hold for 250ms)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250, // Press and hold for 250ms
        tolerance: 5, // 5px movement tolerance
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Press and hold for 250ms
        tolerance: 5, // 5px movement tolerance
      },
    })
  );

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

      // Load time slots for this form
      const { data: timeSlotsData } = await client.models.PiscineTimeSlot.list({
        filter: { piscineFormId: { eq: piscineFormId } }
      });

      // Create a map of time slots by ID
      const timeSlotsMap: Record<string, PiscineTimeSlotData> = {};
      if (timeSlotsData) {
        timeSlotsData.forEach(ts => {
          timeSlotsMap[ts.id] = {
            id: ts.id,
            dayOfWeek: ts.dayOfWeek,
            startTime: ts.startTime,
            endTime: ts.endTime
          };
        });
      }
      setTimeSlots(timeSlotsMap);

      // Load candidats for each date slot (filter out null slots)
      const dateSlotsWithCandidats = await Promise.all(
        slots.filter(slot => slot !== null).map(async (slot) => {
          const { data: candidats } = await client.models.PiscineCandidat.list({
            filter: { piscineDateSlotId: { eq: slot.id } }
          });

          return {
            id: slot.id,
            selectedDate: slot.selectedDate,
            order: slot.order || 0,
            piscineTimeSlotId: slot.piscineTimeSlotId,
            candidats: (candidats || []).sort((a, b) => (a.order || 0) - (b.order || 0)).map(c => ({
              id: c.id,
              firstName: c.firstName,
              lastName: c.lastName,
              email: c.email,
              phoneNumber: c.phoneNumber,
              nameOfChild: c.nameOfChild,
              order: c.order || 0,
              owner: c.owner || null
            }))
          };
        })
      );

      // Filter date slots: keep valid ones OR orphaned ones with participants (to preserve data)
      const validDateSlots = dateSlotsWithCandidats.filter(slot => {
        const hasValidTimeSlot = slot.piscineTimeSlotId && timeSlotsMap[slot.piscineTimeSlotId];
        const hasParticipants = slot.candidats.length > 0;

        // Keep if: has valid time slot OR has participants (preserve participant data)
        // Remove if: orphaned AND empty (no participants)
        return hasValidTimeSlot || hasParticipants;
      });

      // Sort date slots chronologically by selectedDate
      const sortedDateSlots = validDateSlots.sort((a, b) =>
        new Date(a.selectedDate).getTime() - new Date(b.selectedDate).getTime()
      );
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Find the candidat being dragged
    for (const dateSlot of dateSlots) {
      const candidat = dateSlot.candidats.find(c => `candidat-${c.id}` === active.id);
      if (candidat) {
        // Check if current user has permission to drag this participant
        if (canModifyCandidat(candidat)) {
          setActiveDragCandidat(candidat);
        }
        break;
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragCandidat(null);

    if (!over || !active) {
      return;
    }

    // Extract IDs
    const candidatId = active.id.toString().replace('candidat-', '');
    const newDateSlotId = over.id.toString().replace('dateslot-', '');

    // Find the candidat and its current date slot
    let currentDateSlotId: string | null = null;
    let candidat: typeof dateSlots[0]['candidats'][0] | undefined;
    for (const dateSlot of dateSlots) {
      candidat = dateSlot.candidats.find(c => c.id === candidatId);
      if (candidat) {
        currentDateSlotId = dateSlot.id;
        break;
      }
    }

    // Check if current user has permission to move this participant
    if (!candidat || !canModifyCandidat(candidat)) {
      return;
    }

    // If dropped on the same slot, do nothing
    if (currentDateSlotId === newDateSlotId) {
      return;
    }

    // Optimistic UI update
    setDateSlots(prevDateSlots => {
      const updatedDateSlots = prevDateSlots.map(dateSlot => {
        // Remove from old slot
        if (dateSlot.id === currentDateSlotId) {
          return {
            ...dateSlot,
            candidats: dateSlot.candidats.filter(c => c.id !== candidatId)
          };
        }
        // Add to new slot
        if (dateSlot.id === newDateSlotId) {
          const movedCandidat = prevDateSlots
            .find(ds => ds.id === currentDateSlotId)
            ?.candidats.find(c => c.id === candidatId);

          if (movedCandidat) {
            return {
              ...dateSlot,
              candidats: [...dateSlot.candidats, movedCandidat]
            };
          }
        }
        return dateSlot;
      });
      return updatedDateSlots;
    });

    // Perform API update
    try {
      await client.models.PiscineCandidat.update({
        id: candidatId,
        piscineDateSlotId: newDateSlotId
      });

      onMessage?.('Participant déplacé avec succès', false);

      // Reload to get accurate data
      loadDateSlotsWithCandidats();
    } catch (error) {
      console.error('Error moving candidat:', error);
      onMessage?.('Erreur lors du déplacement du participant', true);

      // Revert optimistic update
      loadDateSlotsWithCandidats();
    }
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
    const date = parseISODate(dateString);
    return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
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
        csvContent += `Niveau: ${piscineFormData.schoolLevel} | Enseignant: ${piscineFormData.teacherName}\n`;
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

          csvContent += `${[
            formattedDate,
            dayName,
            escapeCSV(candidat.firstName),
            escapeCSV(candidat.lastName),
            escapeCSV(candidat.email),
            escapeCSV(candidat.phoneNumber),
            escapeCSV(candidat.nameOfChild),
            candidat.order || 0
          ].join(',')  }\n`;
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>

      <div style={{ marginTop: '1.5rem' }}>
        <div className={classNames(
          flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
          flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
          flexStyles.isAlignItemsCenter,
          flexStyles.isJustifyContentSpaceBetween,
          flexStyles.isFullwidth,
          )} style={{ margin: '0 0 1.5rem'}}>

          <Title level={TitleLevel.LEVEL2}
            className={classNames(
              flexStyles.isMarginless,
            )}>
            Dates et inscriptions
          </Title>

          <div className={classNames(
            flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
            flexStyles.isGridCols1, flexStyles.isGridCols2MobileMax,
            flexStyles.isAlignItemsCenter,
            flexStyles.isJustifyContentCenter,
            flexStyles.isJustifiedCenter,
            flexStyles.isFullheight,
            flexStyles.isFullwidth,
            )}>
            <Button
              markup={ButtonMarkup.BUTTON}
              variant={VariantState.TERTIARY}
              onClick={copyUrl}
              className="text-sm"
            >
              📋 Copier le lien
            </Button>
            {isCreatorMode && (
              <Button
                markup={ButtonMarkup.BUTTON}
                variant={VariantState.TERTIARY}
                onClick={onExportCSV}
                className="text-sm"
              >
                Exporter CSV
              </Button>
            )}
          </div>
        </div>

        {dateSlots.map((dateSlot) => (
          <div key={dateSlot.id} style={{
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>

            {/* Date Header */}
            <div style={{
              backgroundColor: isOrphanedSlot(dateSlot) ? '#fff3cd' : '#f8f9fa',
              padding: '1rem',
              borderBottom: '1px solid #e0e0e0'
              }}>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                // flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                flexStyles.isGridCols12,
                flexStyles.isAlignItemsCenter,
                flexStyles.isJustifyContentSpaceBetween,
                flexStyles.isFullheight,
                flexStyles.isFullwidth,
                )}>
                <div className={classNames(
                  flexStyles.isGridColSpanFull,
                  flexStyles.isGridColSpan7Tablet,
                  flexStyles.isGridColSpan8Desktop,
                  )} style={{ padding: '0 0 1rem' }}>
                  <Title level={TitleLevel.LEVEL3} className={flexStyles.isMarginless}>
                    {formatDate(dateSlot.selectedDate).replace(/^./, str => str.toUpperCase())}
                    {isOrphanedSlot(dateSlot) ? (
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#856404',
                        marginLeft: '0.5rem',
                        fontWeight: 'normal'
                      }}>
                        • ⚠️ Créneau archivé
                      </span>
                    ) : dateSlot.piscineTimeSlotId && timeSlots[dateSlot.piscineTimeSlotId] ? (
                      <> • {timeSlots[dateSlot.piscineTimeSlotId].startTime} - {timeSlots[dateSlot.piscineTimeSlotId].endTime}</>
                    ) : null}
                  </Title>
                  <Title level={TitleLevel.LEVEL7}>
                    {dateSlot.candidats.length} inscription{dateSlot.candidats.length > 1 ? 's' : ''}
                  </Title>
                </div>

                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridColSpanFull,
                  flexStyles.isGridColSpan5Tablet,
                  flexStyles.isGridColSpan4Desktop,
                  flexStyles.isAlignSelfCenter,
                  // flexStyles.isJustifyContentEnd,
                  flexStyles.isGridJustifyStretch,
                  flexStyles.isFullwidth,
                  )}>
                  <Button
                    markup={ButtonMarkup.BUTTON}
                    variant={isAuthenticated && !isOrphanedSlot(dateSlot) ? VariantState.PRIMARY : VariantState.TERTIARY}
                    onClick={() => toggleNewCandidatForm(dateSlot.id)}
                    disabled={isOrphanedSlot(dateSlot)}
                    className={flexStyles.isFullwidth}>
                    {isOrphanedSlot(dateSlot)
                      ? '🚫 Créneau archivé'
                      : isAuthenticated
                        ? (showNewCandidatForms[dateSlot.id] ? 'Annuler' : '+ S\'inscrire')
                        : '🔒 Se connecter pour s\'inscrire'
                    }
                  </Button>
                </div>
              </div>
            </div>

            {/* Candidats Content - Wrapped with DroppableDateSlot */}
            <DroppableDateSlot
              id={`dateslot-${dateSlot.id}`}
              selectedDate={dateSlot.selectedDate}
              isCreatorMode={isCreatorMode}>

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

                {/* Orphaned date warning */}
                {isOrphanedSlot(dateSlot) && dateSlot.candidats.length > 0 && (
                  <div style={{
                    backgroundColor: '#fff3cd',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #ffc107',
                    marginBottom: '1rem'
                  }}>
                    <Text style={{ fontSize: '0.875rem', color: '#856404' }}>
                      ℹ️ <strong>Date archivée</strong> : Ce créneau horaire n&apos;est plus disponible,
                      mais les inscriptions existantes sont conservées.
                      {isCreatorMode && ' Les participants peuvent être déplacés vers un autre créneau.'}
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
                      onCancel={() => setShowNewCandidatForms(prev => ({ ...prev, [dateSlot.id]: false }))}
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
                    {dateSlot.candidats.map((candidat) => {
                      const canModify = canModifyCandidat(candidat);

                      return (
                        <DraggableCandidatRow
                          key={candidat.id}
                          id={`candidat-${candidat.id}`}
                          isCreatorMode={isCreatorMode}
                          canDrag={canModify}
                        >
                          <PiscineCandidatRow
                            piscineDateSlotId={dateSlot.id}
                            piscineFormId={piscineFormId}
                            existingCandidat={candidat}
                            onSuccess={(message) => onMessage?.(message, false)}
                            onError={(message) => onMessage?.(message, true)}
                            isCreatorMode={isCreatorMode}
                            canModify={canModify}
                            onCandidatChange={handleCandidatChange}
                          />
                        </DraggableCandidatRow>
                      );
                    })}
                  </div>
                )}

                {/* Add another candidat button for existing date */}
                {dateSlot.candidats.length > 0 && !showNewCandidatForms[dateSlot.id] && !isOrphanedSlot(dateSlot) && (
                  <div style={{ marginTop: '1rem' }}>
                    <Button
                      markup={ButtonMarkup.BUTTON}
                      variant={isAuthenticated ? VariantState.SECONDARY : VariantState.TERTIARY}
                      onClick={() => toggleNewCandidatForm(dateSlot.id)}
                      className="text-sm">
                      {isAuthenticated
                        ? '+ Ajouter une inscription'
                        : '🔒 Se connecter pour s\'inscrire'
                      }
                    </Button>
                  </div>
                )}
              </div>
            </DroppableDateSlot>
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

      {/* Drag Overlay - Shows the candidat being dragged */}
      <DragOverlay>
        {activeDragCandidat ? (
          <div style={{
            backgroundColor: 'white',
            padding: '0.75rem',
            borderRadius: '4px',
            border: '2px solid #0ea5e9',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            opacity: 0.9
          }}>
            <Text style={{ fontWeight: 'bold' }}>
              {activeDragCandidat.firstName} {activeDragCandidat.lastName}
            </Text>
            <Text style={{ fontSize: '0.875rem', color: '#666' }}>
              {activeDragCandidat.nameOfChild}
            </Text>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
