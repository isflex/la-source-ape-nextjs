'use client';

import React from 'react';
import DatePicker from 'react-datepicker';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import classNames from 'classnames';
import {
  Box,
  Title,
  TitleLevel,
  Text,
  Button,
  ButtonMarkup,
  VariantState,
  Table,
  TableHead,
  TableBody,
  TableTr,
  TableTh,
  TableTd,
} from '@flex-design-system/react-ts/client-sync-styled-default';
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss';
import { isWorkingDay, sortDates } from '@src/lib/piscine-helpers';

// Import react-datepicker CSS
import 'react-datepicker/dist/react-datepicker.css';

interface PiscineDateCalendarProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  error?: string;
}

export default function PiscineDateCalendar({
  selectedDates,
  onDatesChange,
  error
}: PiscineDateCalendarProps) {
  const [tempSelectedDate, setTempSelectedDate] = React.useState<Date | null>(null);

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;

    // Check if it's a working day
    if (!isWorkingDay(date)) {
      alert('Vous ne pouvez sélectionner que des jours ouvrables (lundi à vendredi).');
      return;
    }

    // Check if date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      alert('Vous ne pouvez pas sélectionner une date passée.');
      return;
    }

    // Check if date is already selected
    const isAlreadySelected = selectedDates.some(
      existingDate => existingDate.toDateString() === date.toDateString()
    );

    if (isAlreadySelected) {
      alert('Cette date est déjà sélectionnée.');
      return;
    }

    // Add the date to selected dates
    const newDates = [...selectedDates, date];
    onDatesChange(sortDates(newDates));
    setTempSelectedDate(null);
  };

  const handleRemoveDate = (dateToRemove: Date) => {
    const newDates = selectedDates.filter(
      date => date.toDateString() !== dateToRemove.toDateString()
    );
    onDatesChange(newDates);
  };

  const isDateDisabled = (date: Date) => {
    // Disable weekends
    const day = date.getDay();
    if (day === 0 || day === 6) return true;

    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDisplayDate = (date: Date) => {
    return format(date, 'EEEE dd MMMM yyyy', { locale: fr });
  };

  return (
    <div>
      <Title level={TitleLevel.LEVEL3}>
        Sélectionner les dates
      </Title>

      {/* Calendar */}
      <div style={{ marginBottom: '1.5rem' }} >
        <div style={{
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          padding: '1rem'
        }}>
          <Title level={TitleLevel.LEVEL5}>
            Choisir une date à ajouter:
          </Title>

          <DatePicker
            selected={tempSelectedDate}
            onChange={handleDateSelect}
            inline
            locale={fr}
            filterDate={(date) => !isDateDisabled(date)}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            calendarClassName="piscine-calendar"
          />

          <div className={classNames(flexStyles.help, flexStyles.isInfo, flexStyles.isFullwidth, flexStyles.hasTextSmall, flexStyles.isMarginTop2)}>
            <Text style={{ fontSize: '0.875rem', color: '#666' }}>
              Seuls les jours ouvrables (lundi à vendredi) peuvent être sélectionnés. Cliquez sur une date pour l&apos;ajouter à votre planning.
            </Text>
          </div>
        </div>
      </div>

      {/* Selected Dates Table */}
      <div>
        <Title level={TitleLevel.LEVEL4}>
          Dates sélectionnées ({selectedDates.length})
        </Title>

        {selectedDates.length === 0 ? (
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            borderRadius: '4px',
            border: '1px solid #e0e0e0'
          }}>
            <Text style={{ fontStyle: 'italic', color: '#666' }}>
              Aucune date sélectionnée. Utilisez le calendrier ci-dessus pour ajouter des dates.
            </Text>
          </div>
        ) : (
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
              {selectedDates.map((date, index) => (
                <TableTr key={index}
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
                    )} style={{ padding: '0 0.5rem' }}>{formatDisplayDate(date)}</div>
                  </TableTd>
                  <TableTd>
                    <Button
                      markup={ButtonMarkup.BUTTON}
                      variant={VariantState.DANGER}
                      onClick={() => handleRemoveDate(date)}
                      className="text-sm px-2 py-1"
                    >
                      Supprimer
                    </Button>
                  </TableTd>
                </TableTr>
              ))}
            </TableBody>
          </Table>
        )}

        {error && (
          <div className={`${flexStyles.hasTextDanger} ${flexStyles.hasTextSmall} ${flexStyles.isMarginTop1}`}>
            {error}
          </div>
        )}
      </div>

      {/* Summary */}
      {selectedDates.length > 0 && (
        <div style={{
          backgroundColor: '#f0f9ff',
          padding: '0.75rem',
          borderRadius: '4px',
          border: '1px solid #0ea5e9',
          marginTop: '1rem'
        }}>
          <Text style={{ fontWeight: 'bold', color: '#0369a1' }}>
            {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} sélectionnée{selectedDates.length > 1 ? 's' : ''} pour votre planning piscine.
          </Text>
        </div>
      )}

      {/* Custom calendar styles */}
      <style jsx global>{`
        .piscine-calendar {
          font-family: inherit !important;
        }
        .piscine-calendar .react-datepicker__day--disabled {
          color: #ccc !important;
          cursor: not-allowed !important;
        }
        .piscine-calendar .react-datepicker__day:hover {
          background-color: #f0f9ff !important;
        }
        .piscine-calendar .react-datepicker__day--selected {
          background-color: #0ea5e9 !important;
        }
      `}</style>
    </div>
  );
}
