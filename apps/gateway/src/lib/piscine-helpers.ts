import { z } from 'zod';
import DOMPurify from 'dompurify';
import parsePhoneNumberFromString from 'libphonenumber-js';
import type { Schema } from '@amplify/data/resource';

// Valid day of week options
const VALID_DAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY'
] as const;

// Valid school levels (using existing enum)
const VALID_SCHOOL_LEVELS = [
  'COLLEGE_3EME',
  'COLLEGE_4EME',
  'COLLEGE_5EME',
  'COLLEGE_6EME',
  'LYCEE_PREMIERE',
  'LYCEE_SECONDE',
  'LYCEE_TERMINALE',
  'MATERNELLE_GS',
  'PRIMAIRE_CE1',
  'PRIMAIRE_CE2',
  'PRIMAIRE_CM1',
  'PRIMAIRE_CM2',
  'PRIMAIRE_CP',
  'ANCIEN_ELEVE'
] as const;

// Time validation helpers
const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
const MIN_TIME = '08:45';
const MAX_TIME = '18:00';

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const minMinutes = timeToMinutes(MIN_TIME);
  const maxMinutes = timeToMinutes(MAX_TIME);

  return startMinutes >= minMinutes &&
         endMinutes <= maxMinutes &&
         startMinutes < endMinutes;
};

const isValidDuration = (startTime: string, endTime: string, minHours: number = 1, maxHours: number = 4): boolean => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const durationMinutes = endMinutes - startMinutes;

  return durationMinutes >= (minHours * 60) && durationMinutes <= (maxHours * 60);
};

// Generate URL-safe slug from title
export const generateSlug = (title: string, existingSlugs: string[] = []): string => {
  // Convert to lowercase and handle French accents
  let slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens

  // Handle duplicates
  if (existingSlugs.includes(slug)) {
    let counter = 2;
    let newSlug = `${slug}-${counter}`;
    while (existingSlugs.includes(newSlug)) {
      counter++;
      newSlug = `${slug}-${counter}`;
    }
    slug = newSlug;
  }

  return slug;
};

// Zod schemas for validation

// PiscineForm validation schema
export const PiscineFormSchema = z.object({
  title: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Le titre est requis')),

  dayOfWeek: z.enum(VALID_DAYS, {
    required_error: 'Veuillez sélectionner un jour de la semaine'
  }),

  startTime: z.string()
    .regex(TIME_REGEX, 'Format d\'heure invalide (HH:MM)')
    .refine((time) => timeToMinutes(time) >= timeToMinutes(MIN_TIME),
      `L'heure de début doit être après ${MIN_TIME}`)
    .refine((time) => timeToMinutes(time) < timeToMinutes(MAX_TIME),
      `L'heure de début doit être avant ${MAX_TIME}`),

  endTime: z.string()
    .regex(TIME_REGEX, 'Format d\'heure invalide (HH:MM)')
    .refine((time) => timeToMinutes(time) <= timeToMinutes(MAX_TIME),
      `L'heure de fin doit être avant ${MAX_TIME}`)
    .refine((time) => timeToMinutes(time) > timeToMinutes(MIN_TIME),
      `L'heure de fin doit être après ${MIN_TIME}`),

  schoolLevel: z.enum(VALID_SCHOOL_LEVELS, {
    required_error: 'Veuillez sélectionner un niveau scolaire'
  }),

  teacherName: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Le nom de l\'enseignant est requis')),

  selectedDates: z.array(z.date())
    .min(1, 'Au moins une date doit être sélectionnée')
    .refine((dates) => {
      // Check that all dates are working days (Monday-Friday)
      return dates.every(date => {
        const day = date.getDay();
        return day >= 1 && day <= 5; // 1 = Monday, 5 = Friday
      });
    }, 'Toutes les dates doivent être des jours ouvrables (lundi-vendredi)')
}).refine((data) => {
  // Cross-field validation for time range
  return isValidTimeRange(data.startTime, data.endTime);
}, {
  message: 'L\'heure de fin doit être postérieure à l\'heure de début et dans la plage 08:45-18:00',
  path: ['endTime']
}).refine((data) => {
  // Validation for reasonable duration
  return isValidDuration(data.startTime, data.endTime);
}, {
  message: 'La durée doit être entre 1 et 4 heures',
  path: ['endTime']
});

// PiscineDateSlot validation schema
export const PiscineDateSlotSchema = z.object({
  selectedDate: z.date().refine((date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday to Friday
  }, 'La date doit être un jour ouvrable (lundi-vendredi)').refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, 'La date ne peut pas être dans le passé'),

  order: z.number().min(0).optional().default(0),
  piscineFormId: z.string().min(1, 'ID du formulaire requis')
});

// PiscineCandidat validation schema
export const PiscineCandidatSchema = z.object({
  firstName: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Le prénom est requis')),

  lastName: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Le nom de famille est requis')),

  email: z.string()
    .min(1, 'L\'email est requis')
    .email('Format email invalide'),

  phoneNumber: z.string()
    .transform((arg, ctx) => {
      if (!arg || arg.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Numéro de téléphone requis',
        });
        return z.NEVER;
      }

      const phone = parsePhoneNumberFromString(arg, {
        defaultCountry: 'FR',
        extract: false,
      });

      if (phone && phone.isValid()) {
        return phone.number as string;
      }

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Numéro de téléphone invalide (format français attendu)',
      });
      return z.NEVER;
    }),

  nameOfChild: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .pipe(z.string().min(1, 'Le nom de l\'enfant est requis')),

  piscineDateSlotId: z.string().min(1, 'ID de la date requis'),
  piscineFormId: z.string().min(1, 'ID du formulaire requis'),
  order: z.number().min(0).optional().default(0)
});

// Type exports
export type PiscineFormData = z.infer<typeof PiscineFormSchema>;
export type PiscineDateSlotData = z.infer<typeof PiscineDateSlotSchema>;
export type PiscineCandidatData = z.infer<typeof PiscineCandidatSchema>;

// Utility functions

// Format day of week for display
export const formatDayOfWeek = (day: Schema['EDayOfWeek']['type']): string => {
  const dayMap: Record<Schema['EDayOfWeek']['type'], string> = {
    'MONDAY': 'Lundi',
    'TUESDAY': 'Mardi',
    'WEDNESDAY': 'Mercredi',
    'THURSDAY': 'Jeudi',
    'FRIDAY': 'Vendredi'
  };
  return dayMap[day] || day;
};

// Format school level for display
export const formatSchoolLevel = (level: Schema['ESchoolLevel']['type']): string => {
  const levelMap: Record<Schema['ESchoolLevel']['type'], string> = {
    'COLLEGE_3EME': '3ème',
    'COLLEGE_4EME': '4ème',
    'COLLEGE_5EME': '5ème',
    'COLLEGE_6EME': '6ème',
    'LYCEE_PREMIERE': 'Première',
    'LYCEE_SECONDE': 'Seconde',
    'LYCEE_TERMINALE': 'Terminale',
    'MATERNELLE_GS': 'Grande Section',
    'PRIMAIRE_CE1': 'CE1',
    'PRIMAIRE_CE2': 'CE2',
    'PRIMAIRE_CM1': 'CM1',
    'PRIMAIRE_CM2': 'CM2',
    'PRIMAIRE_CP': 'CP',
    'ANCIEN_ELEVE': 'Ancien élève'
  };
  return levelMap[level] || level;
};

// Validate time format and range
export const validateTimeFormat = (time: string): boolean => {
  return TIME_REGEX.test(time);
};

export const validateTimeInRange = (time: string): boolean => {
  if (!validateTimeFormat(time)) return false;

  const minutes = timeToMinutes(time);
  const minMinutes = timeToMinutes(MIN_TIME);
  const maxMinutes = timeToMinutes(MAX_TIME);

  return minutes >= minMinutes && minutes <= maxMinutes;
};

// Convert date to ISO string for database storage
export const dateToISOString = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

// Parse ISO date string to Date object
export const parseISODate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00.000Z');
};

// Sort dates chronologically
export const sortDates = (dates: Date[]): Date[] => {
  return dates.sort((a, b) => a.getTime() - b.getTime());
};

// Check if a date is a working day (Monday-Friday)
export const isWorkingDay = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5;
};

// Get available time slots (example helper for UI)
export const getTimeSlotOptions = (): { value: string; label: string }[] => {
  const options = [];

  for (let hour = 8; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      if (hour === 8 && minute < 45) continue; // Start from 08:45
      if (hour === 18 && minute > 0) break;    // End at 18:00

      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push({
        value: timeString,
        label: timeString
      });
    }
  }

  return options;
};

// Validation result interface
export interface ValidationResult<T> {
  success: boolean;
  errors?: string[];
  data?: T;
}

// Validate form data with detailed error reporting
export const validatePiscineFormData = (data: unknown): ValidationResult<PiscineFormData> => {
  try {
    const validData = PiscineFormSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Format de données invalide']
    };
  }
};

export const validatePiscineCandidatData = (data: unknown): ValidationResult<PiscineCandidatData> => {
  try {
    const validData = PiscineCandidatSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Format de données invalide']
    };
  }
};