'use client';

import React from 'react';
import classNames from 'classnames';
import type { Schema } from '@amplify/data/resource';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { Select, type SelectChangeEvent } from '@flex-design-system/react-ts/client-sync-styled-direct/select';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import type { DayTimeSlot } from '@src/lib/piscine-helpers';
import {
  formatDayOfWeek,
  getTimeSlotOptions,
  calculateDuration
} from '@src/lib/piscine-helpers';

interface MultiDayTimeSlotPickerProps {
  dayTimeSlots: DayTimeSlot[];
  onTimeSlotChange: (dayOfWeek: Schema['EDayOfWeek']['type'], field: 'startTime' | 'endTime', value: string) => void;
  errors?: Record<string, string>;
}

export default function MultiDayTimeSlotPicker({
  dayTimeSlots,
  onTimeSlotChange,
  errors = {}
}: MultiDayTimeSlotPickerProps) {
  const enabledDays = dayTimeSlots.filter(slot => slot.enabled);

  if (enabledDays.length === 0) {
    return null;
  }

  const timeOptions = getTimeSlotOptions();

  const getEndTimeOptions = (startTime: string) => {
    if (!startTime) return timeOptions;

    const startMinutes = timeToMinutes(startTime);
    return timeOptions.filter(option => {
      const optionMinutes = timeToMinutes(option.value);
      return optionMinutes > startMinutes;
    });
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div>
      <Title level={TitleLevel.LEVEL3} className={flexStyles.isMarginBottom3}>
        Étape 2 : Définir les créneaux horaires
      </Title>

      <Text className={flexStyles.isMarginBottom4}>
        Définissez les horaires pour chaque jour sélectionné. Les horaires peuvent être différents pour chaque jour.
      </Text>

      {enabledDays.map((daySlot) => (
        <Box
          key={daySlot.dayOfWeek}
          className={classNames(flexStyles.isMarginBottom4, flexStyles.isPadding4)}
        >
          <Title level={TitleLevel.LEVEL4} className={flexStyles.isMarginBottom3}>
            {formatDayOfWeek(daySlot.dayOfWeek)}
          </Title>

          <div
            className={classNames(
              flexStyles.isGridDisplayGrid,
              flexStyles.isGridGap4,
              flexStyles.isGridCols2,
              flexStyles.isMarginBottom3
            )}
          >
            {/* Start Time */}
            <div>
              <Title
                level={TitleLevel.LEVEL5}
                className={flexStyles.isMarginBottom2}
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                Heure de début
              </Title>
              <Select
                id={`start-time-${daySlot.dayOfWeek}`}
                value={daySlot.startTime}
                onChange={(e: SelectChangeEvent) => onTimeSlotChange(daySlot.dayOfWeek, 'startTime', e.selectValue as Schema['EDayOfWeek']['type'])}
                className={flexStyles.isFullwith}
              >
                <option value="">Sélectionner</option>
                {timeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              {errors[`${daySlot.dayOfWeek}-startTime`] && (
                <Text style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>
                  {errors[`${daySlot.dayOfWeek}-startTime`]}
                </Text>
              )}
            </div>

            {/* End Time */}
            <div>
              <Title
                level={TitleLevel.LEVEL5}
                className={flexStyles.isMarginBottom2}
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                Heure de fin
              </Title>
              <Select
                id={`end-time-${daySlot.dayOfWeek}`}
                value={daySlot.endTime}
                onChange={(e: SelectChangeEvent) => onTimeSlotChange(daySlot.dayOfWeek, 'endTime', e.selectValue as Schema['EDayOfWeek']['type'])}
                disabled={!daySlot.startTime}
                className={flexStyles.isFullwidth}
              >
                <option value="">Sélectionner</option>
                {getEndTimeOptions(daySlot.startTime).map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              {errors[`${daySlot.dayOfWeek}-endTime`] && (
                <Text style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.25rem' }}>
                  {errors[`${daySlot.dayOfWeek}-endTime`]}
                </Text>
              )}
            </div>
          </div>

          {/* Duration Display */}
          {daySlot.startTime && daySlot.endTime && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#e0f2fe',
                borderRadius: '6px',
                border: '1px solid #0ea5e9',
                marginTop: '1rem',
              }}
            >
              <Text style={{ fontSize: '0.875rem', color: '#075985', fontWeight: 500 }}>
                Durée : {calculateDuration(daySlot.startTime, daySlot.endTime)}
              </Text>
              <Text style={{ fontSize: '0.75rem', color: '#0c4a6e', marginTop: '0.25rem' }}>
                Recommandation : entre 1 et 4 heures
              </Text>
            </div>
          )}
        </Box>
      ))}

      {errors.general && (
        <Text style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.5rem' }}>
          {errors.general}
        </Text>
      )}
    </div>
  );
}
