'use client';

import React from 'react';
import classNames from 'classnames';
import type { Schema } from '@amplify/data/resource';
import { Checkbox } from '@flex-design-system/react-ts/client-sync-styled-direct/checkbox';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import type { DayTimeSlot } from '@src/lib/piscine-helpers';
import { formatDayOfWeek } from '@src/lib/piscine-helpers';

interface MultiDaySelectorProps {
  dayTimeSlots: DayTimeSlot[];
  onDayToggle: (dayOfWeek: Schema['EDayOfWeek']['type'], enabled: boolean) => void;
  error?: string;
}

const DAY_OPTIONS: { value: Schema['EDayOfWeek']['type']; label: string }[] = [
  { value: 'MONDAY', label: 'Lundi' },
  { value: 'TUESDAY', label: 'Mardi' },
  { value: 'WEDNESDAY', label: 'Mercredi' },
  { value: 'THURSDAY', label: 'Jeudi' },
  { value: 'FRIDAY', label: 'Vendredi' }
];

export default function MultiDaySelector({
  dayTimeSlots,
  onDayToggle,
  error
}: MultiDaySelectorProps) {
  const getDaySlot = (dayOfWeek: Schema['EDayOfWeek']['type']): DayTimeSlot | undefined => {
    return dayTimeSlots.find(slot => slot.dayOfWeek === dayOfWeek);
  };

  const isChecked = (dayOfWeek: Schema['EDayOfWeek']['type']): boolean => {
    const slot = getDaySlot(dayOfWeek);
    return slot?.enabled || false;
  };

  const handleToggle = (dayOfWeek: Schema['EDayOfWeek']['type']) => {
    const currentState = isChecked(dayOfWeek);
    onDayToggle(dayOfWeek, !currentState);
  };

  const selectedCount = dayTimeSlots.filter(slot => slot.enabled).length;

  return (
    <div>
      <Title level={TitleLevel.LEVEL3} className={flexStyles.isMarginBottom3}>
        Étape 1 : Sélectionner les jours de la semaine
      </Title>

      <Text className={flexStyles.isMarginBottom3}>
        Sélectionnez un ou plusieurs jours de la semaine pour votre planning. Vous pourrez définir
        des horaires différents pour chaque jour à l&apos;étape suivante.
      </Text>

      <div className={classNames(
        flexStyles.isGridDisplayGrid, flexStyles.isGridGap3,
      )}
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))',
        gridTemplateRows: 'auto 1fr'
      }}>
        {DAY_OPTIONS.map((day) => (
          <Checkbox
            key={day.value}
            id={`day-${day.value}`}
            label={day.label}
            checked={isChecked(day.value)}
            onChange={() => handleToggle(day.value)}
          />
        ))}
      </div>

      {selectedCount > 0 && (
        <Text
          style={{
            fontSize: '0.875rem',
            color: '#059669',
            marginBottom: '1rem'
          }}
        >
          {selectedCount} jour{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
        </Text>
      )}

      {error && (
        <Text
          style={{
            fontSize: '0.875rem',
            color: '#dc2626',
            marginTop: '0.5rem'
          }}
        >
          {error}
        </Text>
      )}
    </div>
  );
}
