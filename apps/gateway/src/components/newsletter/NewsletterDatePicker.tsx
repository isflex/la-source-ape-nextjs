'use client'

import React, { forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import { Input, IconName } from '@flex-design-system/react-ts/client-sync-styled-default'
import { fr } from 'date-fns/locale'
import { format, parseISO } from 'date-fns'
import classNames from 'classnames'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'

// Import react-datepicker CSS
import 'react-datepicker/dist/react-datepicker.css'

interface NewsletterDatePickerInputProps {
  value?: string
  onClick?: () => void
  placeholder: string
  hasError?: boolean
  id?: string
}

// Custom Input component that uses the design system
const NewsletterDatePickerInput = forwardRef<HTMLInputElement, NewsletterDatePickerInputProps>(
  ({ value, onClick, placeholder, hasError = false, id }, ref) => {
    return (
      <Input
        id={id}
        ref={ref}
        onClick={onClick}
        hasIcon
        customIcon={IconName.CALENDAR_INFO_CIRCLE}
        value={value || ''}
        placeholder={placeholder}
        className={classNames(hasError && flexStyles.hasTextDanger)}
        disabled={false}
      />
    )
  }
)
NewsletterDatePickerInput.displayName = 'NewsletterDatePickerInput'

interface NewsletterDatePickerProps {
  id?: string
  value: string // ISO date string
  onChange: (isoDateString: string) => void
  placeholder: string
  hasError?: boolean
  minDate?: Date
  maxDate?: Date
}

export const NewsletterDatePicker: React.FC<NewsletterDatePickerProps> = ({
  id,
  value,
  onChange,
  placeholder,
  hasError = false,
  minDate,
  maxDate
}) => {
  // Convert ISO string to Date object for DatePicker
  const selectedDate = value ? parseISO(value) : null

  const handleDateChange = (date: Date | null) => {
    if (date) {
      // Format as ISO date string (YYYY-MM-DD)
      const isoString = format(date, 'yyyy-MM-dd')
      onChange(isoString)
    } else {
      onChange('')
    }
  }

  // Format display value for input
  const displayValue = selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="dd/MM/yyyy"
      locale={fr}
      placeholderText={placeholder}
      customInput={
        <NewsletterDatePickerInput
          id={id}
          placeholder={placeholder}
          hasError={hasError}
        />
      }
      minDate={minDate}
      maxDate={maxDate}
      // Additional props for better UX
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      todayButton="Aujourd'hui"
    />
  )
}

export default NewsletterDatePicker