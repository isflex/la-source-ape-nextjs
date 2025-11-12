'use client';

import React from 'react';
import classNames from 'classnames';
import {
  Box,
  Title,
  TitleLevel,
  Text,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import { getTimeSlotOptions, validateTimeInRange } from '@src/lib/piscine-helpers';

interface PiscineTimeSlotPickerProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  startTimeError?: string;
  endTimeError?: string;
}

export default function PiscineTimeSlotPicker({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  startTimeError,
  endTimeError
}: PiscineTimeSlotPickerProps) {
  const timeOptions = getTimeSlotOptions();

  // Filter end time options to be after start time
  const endTimeOptions = timeOptions.filter(option => {
    if (!startTime) return true;
    const startMinutes = timeToMinutes(startTime);
    const optionMinutes = timeToMinutes(option.value);
    return optionMinutes > startMinutes;
  });

  function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  return (
    <div>
      <Title level={TitleLevel.LEVEL3}>
        Définir un créneau horaire
      </Title>

      <div className={classNames(
        flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
        flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
        flexStyles.isGridItemsStart,
        flexStyles.isMarginBottom3
      )}>

        {/* Start Time */}
        <div>
          <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
            Heure de début <span className={flexStyles.hasTextDanger}>*</span>
          </Title>
          <div className={classNames(
            flexStyles.isGridDisplayGrid,
            flexStyles.isGridItemsStart,
            flexStyles.isFullheight,
          )} style={{ marginTop: '1rem' }}>
            <select
              id="start-time-select"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className={classNames(
                'border rounded px-3 py-2 w-full',
                startTimeError && 'border-red-500'
              )}
              style={{
                border: startTimeError ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '4px',
                padding: '0.5rem 0.75rem',
                width: '100%',
                fontSize: '1rem'
              }}
            >
              <option value="">Sélectionner une heure</option>
              {timeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {startTimeError && (
              <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
                {startTimeError}
              </div>
            )}
          </div>
        </div>

        {/* End Time */}
        <div>
          <Title level={TitleLevel.LEVEL5} className={flexStyles.hasTextTeriary}>
            Heure de fin <span className={flexStyles.hasTextDanger}>*</span>
          </Title>
          <div className={classNames(
            flexStyles.isGridDisplayGrid,
            flexStyles.isGridItemsStart,
            flexStyles.isFullheight,
          )} style={{ marginTop: '1rem' }}>
            <select
              id="end-time-select"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className={classNames(
                'border rounded px-3 py-2 w-full',
                endTimeError && 'border-red-500'
              )}
              style={{
                border: endTimeError ? '2px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '4px',
                padding: '0.5rem 0.75rem',
                width: '100%',
                fontSize: '1rem'
              }}
              disabled={!startTime}
            >
              <option value="">Sélectionner une heure de fin</option>
              {endTimeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {endTimeError && (
              <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
                {endTimeError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Duration Display */}
      {startTime && endTime && (
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '0.75rem',
          borderRadius: '4px',
          border: '1px solid #0ea5e9',
          marginTop: '1rem',
        }}>
          <Text style={{ fontWeight: 'bold', color: '#0369a1' }}>
            Durée: {calculateDuration(startTime, endTime)}
          </Text>
        </div>
      )}

      {/* Help text */}
      <div className={classNames(flexStyles.help, flexStyles.isInfo, flexStyles.isFullwidth, flexStyles.hasTextSmall, flexStyles.isMarginTop2)}>
        <Text style={{ fontSize: '0.875rem', color: '#666' }}>
          Créneaux disponibles entre 08h45 et 18h00. La durée recommandée est de 2 heures.
        </Text>
      </div>
    </div>
  );
}

function calculateDuration(startTime: string, endTime: string): string {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  const durationMinutes = endTotalMinutes - startTotalMinutes;

  if (durationMinutes <= 0) return 'Durée invalide';

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (minutes === 0) {
    return `${hours} heure${hours > 1 ? 's' : ''}`;
  } else {
    return `${hours}h ${minutes}min`;
  }
}
