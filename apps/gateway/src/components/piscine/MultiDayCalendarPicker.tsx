'use client';

import React, { useState } from 'react';
import classNames from 'classnames';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import type { Schema } from '@amplify/data/resource';
import { Box } from '@flex-design-system/react-ts/client-sync-styled-direct/box';
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import {
  Table,
  TableBody,
  TableTd,
  TableTh,
  TableHead,
  TableTr
} from '@flex-design-system/react-ts/client-sync-styled-direct/table';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import { formatDayOfWeek, matchesWeekday, isWorkingDay, sortDates, type DayTimeSlot } from '@src/lib/piscine-helpers';

// Import react-datepicker CSS
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('fr', fr);

interface MultiDayCalendarPickerProps {
  dayTimeSlots: DayTimeSlot[];
  selectedDatesPerDay: Record<string, Date[]>;
  onDatesChange: (datesPerDay: Record<string, Date[]>) => void;
  error?: string;
}

export default function MultiDayCalendarPicker({
  dayTimeSlots,
  selectedDatesPerDay,
  onDatesChange,
  error
}: MultiDayCalendarPickerProps) {
  const enabledDays = dayTimeSlots.filter(slot => slot.enabled);

  // State for mobile tab view
  const [activeTabDay, setActiveTabDay] = useState<Schema['EDayOfWeek']['type'] | null>(
    enabledDays.length > 0 ? enabledDays[0].dayOfWeek : null
  );

  if (enabledDays.length === 0) {
    return null;
  }

  const handleDateSelect = (dayOfWeek: Schema['EDayOfWeek']['type'], date: Date | null) => {
    if (!date) return;

    // Validate working day
    if (!isWorkingDay(date)) {
      alert('Seuls les jours ouvrables peuvent être sélectionnés (lundi-vendredi).');
      return;
    }

    // Validate matches weekday
    if (!matchesWeekday(date, dayOfWeek)) {
      alert('Cette date ne correspond pas au jour sélectionné.');
      return;
    }

    // Validate not in past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      alert('Impossible de sélectionner une date passée.');
      return;
    }

    // Check if already selected
    const currentDates = selectedDatesPerDay[dayOfWeek] || [];
    const isAlreadySelected = currentDates.some(
      d => d.toDateString() === date.toDateString()
    );

    if (isAlreadySelected) {
      alert('Cette date est déjà sélectionnée.');
      return;
    }

    // Add date
    const newDates = sortDates([...currentDates, date]);

    onDatesChange({
      ...selectedDatesPerDay,
      [dayOfWeek]: newDates
    });
  };

  const removeDateForDay = (dayOfWeek: Schema['EDayOfWeek']['type'], dateToRemove: Date) => {
    const currentDates = selectedDatesPerDay[dayOfWeek] || [];
    const newDates = currentDates.filter(
      d => d.toDateString() !== dateToRemove.toDateString()
    );

    onDatesChange({
      ...selectedDatesPerDay,
      [dayOfWeek]: newDates
    });
  };

  const isDateDisabled = (date: Date, targetDayOfWeek: Schema['EDayOfWeek']['type']): boolean => {
    // Disable if not matching weekday
    if (!matchesWeekday(date, targetDayOfWeek)) return true;

    // Disable weekends
    const day = date.getDay();
    if (day === 0 || day === 6) return true;

    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDaySlot = (dayOfWeek: Schema['EDayOfWeek']['type']): DayTimeSlot | undefined => {
    return enabledDays.find(slot => slot.dayOfWeek === dayOfWeek);
  };

  const renderCalendarForDay = (daySlot: DayTimeSlot) => (
    <Box key={daySlot.dayOfWeek}>
      <Title level={TitleLevel.LEVEL4}>
        {formatDayOfWeek(daySlot.dayOfWeek)}
        {daySlot.startTime && daySlot.endTime && (
          <span
            style={{
              fontSize: '0.875rem',
              color: '#666',
              fontWeight: 'normal',
              marginLeft: '0.5rem'
            }}
          >
            ({daySlot.startTime} - {daySlot.endTime})
          </span>
        )}
      </Title>

      <div style={{ marginBottom: '1.5rem' }}>
        <DatePicker
          selected={null}
          onChange={(date) => handleDateSelect(daySlot.dayOfWeek, date)}
          inline
          locale="fr"
          filterDate={(date) => !isDateDisabled(date, daySlot.dayOfWeek)}
          minDate={new Date()}
          highlightDates={selectedDatesPerDay[daySlot.dayOfWeek] || []}
        />
      </div>

      {/* Selected dates table */}
      {(selectedDatesPerDay[daySlot.dayOfWeek]?.length || 0) > 0 && (
        <div>
          <Title level={TitleLevel.LEVEL5}>
            Dates sélectionnées ({selectedDatesPerDay[daySlot.dayOfWeek].length})
          </Title>
          <Table className={classNames(flexStyles.isFullwidth)}>
            <TableHead>
              <TableTr>
                <TableTh className={flexStyles.isHiddenMobile}>
                  <div style={{ padding: '0 0.5rem' }}>Date</div>
                </TableTh>
                <TableTh className={flexStyles.isHiddenMobile}>
                  <div style={{ padding: '0 0.5rem' }}>Jour de la semaine</div>
                </TableTh>
                <TableTh className={flexStyles.isHiddenMobile}>
                  <div style={{ padding: '0 0.5rem' }}>Action</div>
                </TableTh>
              </TableTr>
            </TableHead>
            <TableBody>
              {sortDates([...selectedDatesPerDay[daySlot.dayOfWeek]]).map((date, idx) => (
                <TableTr key={idx}
                  className={classNames(
                    flexStyles.isFlexMobile,
                    flexStyles.isFlexDirectionColumn,
                    flexStyles.isFullwidthMobile,
                    flexStyles.isTableRowTablet,
                    flexStyles.isColumnSpanAllTablet
                  )}>
                  <TableTd className={classNames(
                    flexStyles.isFlexMobile,
                    flexStyles.isAlignItemsCenter,
                    flexStyles.isJustifyContentSpaceBetween,
                    flexStyles.isDataCellResponsiveHelper,
                  )}>
                    <div className={classNames(
                      flexStyles.isHiddenTablet,
                      flexStyles.isFullwidth,
                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Date</div>
                    <div className={classNames(
                      flexStyles.isFlexMobile,
                      flexStyles.isAlignItemsCenter,
                      flexStyles.isJustifyContentStart,
                      flexStyles.isFullwidth,
                    )} style={{ padding: '0 0.5rem' }}>{format(date, 'dd/MM/yyyy')}</div>
                  </TableTd>
                  <TableTd className={classNames(
                    flexStyles.isFlexMobile,
                    flexStyles.isAlignItemsCenter,
                    flexStyles.isJustifyContentSpaceBetween,
                    flexStyles.isDataCellResponsiveHelper,
                  )}>
                    <div className={classNames(
                      flexStyles.isHiddenTablet,
                      flexStyles.isFullwidth,
                    )} style={{ backgroundColor: 'var(--flex-table-head-fill)' }}>Jour de la semaine</div>
                    <div className={classNames(
                      flexStyles.isFlexMobile,
                      flexStyles.isAlignItemsCenter,
                      flexStyles.isJustifyContentStart,
                      flexStyles.isFullwidth,
                    )} style={{ padding: '0 0.5rem' }}>{format(date, 'EEEE dd MMMM yyyy', { locale: fr })}</div>
                  </TableTd>
                  <TableTd>
                    <Button
                      markup={ButtonMarkup.BUTTON}
                      variant={VariantState.DANGER}
                      onClick={() => removeDateForDay(daySlot.dayOfWeek, date)}
                      className="text-sm px-2 py-1"
                    >
                      Supprimer
                    </Button>
                  </TableTd>
                </TableTr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Box>
  );

  return (
    <div>
      <Title level={TitleLevel.LEVEL3}>
        Étape 3 : Sélectionner les dates
      </Title>

      <Text>
        Sélectionnez les dates pour chaque jour de votre planning. Seules les dates correspondant
        au bon jour de la semaine sont disponibles.
      </Text>

      {/* Mobile view: Tabs */}
      <div className={flexStyles.isHiddenTablet}>
        {/* Tabs */}
        <div
          className={classNames(
            flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
            flexStyles.isFlexDirectionRow
          )}
          style={{
            overflowX: 'auto',
            padding: '0.5rem 0'
          }}
        >
          {enabledDays.map((daySlot) => (
            <Button
              key={daySlot.dayOfWeek}
              markup={ButtonMarkup.BUTTON}
              variant={
                activeTabDay === daySlot.dayOfWeek
                  ? VariantState.PRIMARY
                  : VariantState.SECONDARY
              }
              className={classNames(activeTabDay === daySlot.dayOfWeek && flexStyles.isOutlined)}
              onClick={() => setActiveTabDay(daySlot.dayOfWeek)}
            >
              {formatDayOfWeek(daySlot.dayOfWeek)}
              {(selectedDatesPerDay[daySlot.dayOfWeek]?.length || 0) > 0 && (
                <span
                  style={{
                    marginLeft: '0.5rem',
                    backgroundColor: activeTabDay === daySlot.dayOfWeek ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem'
                  }}
                >
                  {selectedDatesPerDay[daySlot.dayOfWeek].length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Active tab calendar */}
        {activeTabDay && getDaySlot(activeTabDay) && renderCalendarForDay(getDaySlot(activeTabDay)!)}
      </div>

      {/* Desktop view: Multiple calendars */}
      <div className={flexStyles.isHiddenMobile}>
        {enabledDays.map((daySlot) => renderCalendarForDay(daySlot))}
      </div>

      {error && (
        <Text style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.5rem' }}>
          {error}
        </Text>
      )}
    </div>
  );
}
