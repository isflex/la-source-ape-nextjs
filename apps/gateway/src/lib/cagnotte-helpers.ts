import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Schema } from '@amplify/data/resource';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import { calculateChargeAmount, type FeeConfig } from './cagnotte-fees';

// Valid school levels (reusing existing enum)
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

// Valid jackpot status values
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VALID_JACKPOT_STATUS = [
  'DRAFT',
  'ACTIVE',
  'CLOSED',
  'PAID_OUT'
] as const;

// Valid payment status values
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VALID_PAYMENT_STATUS = [
  'PENDING',
  'SUCCEEDED',
  'FAILED',
  'REFUNDED',
  'CANCELED'
] as const;

// Amount constraints (in EUR)
export const MIN_CONTRIBUTION_AMOUNT = parseFloat(process.env.NEXT_PUBLIC_JACKPOT_MIN_CONTRIBUTION_AMOUNT || '5');
export const MAX_CONTRIBUTION_AMOUNT = parseFloat(process.env.NEXT_PUBLIC_JACKPOT_MAX_CONTRIBUTION_AMOUNT || '1000');

// ============================================================================
// SLUG GENERATION
// ============================================================================

/**
 * Generate URL-safe slug from title
 * Handles French accents and special characters
 *
 * @param title - The title to convert to slug
 * @param existingSlugs - Array of existing slugs to check for uniqueness
 * @returns URL-safe slug string
 */
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
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

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

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Validation schema for JackpotForm creation/editing
 */
export const JackpotFormSchema = z.object({
  title: z.string()
    .transform((val) => sanitizeHtml(val.trim(), { allowedTags: [], allowedAttributes: {} }))
    .pipe(z.string().min(1, 'Le titre est requis')),

  teacherName: z.string()
    .transform((val) => sanitizeHtml(val.trim(), { allowedTags: [], allowedAttributes: {} }))
    .pipe(z.string().min(1, 'Le nom de l\'enseignant est requis')),

  description: z.string()
    .transform((val) => sanitizeHtml(val, {
      allowedTags: ['b', 'i', 'u', 'br', 'p', 'strong', 'em'],
      allowedAttributes: {},
    }))
    .optional(),

  targetAmount: z.number()
    .min(1, 'Le montant cible doit être supérieur à 0')
    .optional(),

  deadline: z.date()
    .refine((date) => date > new Date(), {
      message: 'La date limite doit être dans le futur'
    }),

  schoolLevel: z.enum(VALID_SCHOOL_LEVELS).optional(),
});

/**
 * Validation schema for jackpot contributions
 */
export const ContributionSchema = z.object({
  contributorName: z.string()
    .transform((val) => sanitizeHtml(val.trim(), { allowedTags: [], allowedAttributes: {} }))
    .pipe(z.string().min(1, 'Le nom est requis')),

  contributorEmail: z.string()
    .min(1, 'L\'email est requis')
    .email('Format email invalide'),

  amount: z.coerce.number({
      error: 'Le montant doit être un nombre valide',
    })
    .min(MIN_CONTRIBUTION_AMOUNT, `Le montant minimum est de ${MIN_CONTRIBUTION_AMOUNT}€`)
    .max(MAX_CONTRIBUTION_AMOUNT, `Le montant maximum est de ${MAX_CONTRIBUTION_AMOUNT}€`),

  contributorMessage: z.string()
    .transform((val) => sanitizeHtml(val.trim(), { allowedTags: [], allowedAttributes: {} }))
    .optional(),

  isAnonymous: z.boolean().default(false),
  showAmount: z.boolean().default(true),
});

// Type exports
export type JackpotFormData = z.infer<typeof JackpotFormSchema>;
export type ContributionData = z.infer<typeof ContributionSchema>;

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Format amount as EUR currency
 *
 * @param amount - Amount in EUR
 * @returns Formatted string (e.g., "150,50 €")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// ============================================================================
// DATE FORMATTING
// ============================================================================

/**
 * Format deadline for display
 *
 * @param deadline - Deadline date
 * @returns Formatted date string (e.g., "15 décembre 2024")
 */
export const formatDeadline = (deadline: Date): string => {
  return format(deadline, 'dd MMMM yyyy', { locale: fr });
};

/**
 * Get relative deadline distance
 *
 * @param deadline - Deadline date
 * @returns Relative distance string (e.g., "dans 5 jours") or "Terminée"
 */
export const getDeadlineDistance = (deadline: Date): string => {
  if (isPast(deadline)) {
    return 'Terminée';
  }
  return formatDistanceToNow(deadline, { locale: fr, addSuffix: true });
};

// ============================================================================
// CONTRIBUTION AGGREGATION
// ============================================================================

/**
 * Contribution data type for statistics calculation
 */
export interface JackpotContributionData {
  id: string;
  amount: number;
  paymentStatus: Schema['EPaymentStatus']['type'];
  contributorName: string;
  contributorEmail: string;
  contributorMessage?: string | null;
  isAnonymous: boolean;
  showAmount: boolean;
  createdAt?: string | null;
  paidAt?: string | null;
}

/**
 * Calculate jackpot statistics from contributions
 *
 * @param contributions - Array of contributions
 * @returns Statistics object with total, count, and successful contributions
 */
export const calculateJackpotStats = (
  contributions: JackpotContributionData[]
) => {
  const successfulContributions = contributions.filter(
    c => c.paymentStatus === 'SUCCEEDED'
  );

  const totalAmount = successfulContributions.reduce(
    (sum, c) => sum + c.amount,
    0
  );

  const contributorCount = successfulContributions.length;

  const averageContribution = contributorCount > 0
    ? totalAmount / contributorCount
    : 0;

  return {
    totalAmount,
    contributorCount,
    averageContribution,
    successfulContributions,
  };
};

// ============================================================================
// PROGRESS CALCULATION
// ============================================================================

/**
 * Calculate progress towards target amount
 *
 * @param totalAmount - Current total amount raised
 * @param targetAmount - Target amount (optional)
 * @returns Progress percentage and completion status
 */
export const calculateProgress = (
  totalAmount: number,
  targetAmount?: number | null
): { percentage: number; isComplete: boolean } => {
  if (!targetAmount || targetAmount === 0) {
    return { percentage: 0, isComplete: false };
  }

  const percentage = Math.min((totalAmount / targetAmount) * 100, 100);
  const isComplete = totalAmount >= targetAmount;

  return { percentage, isComplete };
};

// ============================================================================
// STATUS HELPERS
// ============================================================================

/**
 * Get status badge configuration for display
 *
 * @param status - Jackpot status
 * @returns Badge variant and label for UI display
 */
export const getJackpotStatusBadge = (
  status: Schema['EJackpotStatus']['type']
): { variant: VariantState; label: string } => {
  const statusMap = {
    DRAFT: { variant: VariantState.SECONDARY, label: 'Brouillon' },
    ACTIVE: { variant: VariantState.SUCCESS, label: 'Active' },
    CLOSED: { variant: VariantState.WARNING, label: 'Terminée' },
    PAID_OUT: { variant: VariantState.INFO, label: 'Payée' },
  };

  return statusMap[status] || statusMap.DRAFT;
};

/**
 * Get payment status label for display
 *
 * @param status - Payment status
 * @returns French label for the status
 */
export const getPaymentStatusLabel = (
  status: Schema['EPaymentStatus']['type']
): string => {
  const statusMap = {
    PENDING: 'En attente',
    SUCCEEDED: 'Réussie',
    FAILED: 'Échouée',
    REFUNDED: 'Remboursée',
    CANCELED: 'Annulée',
  };

  return statusMap[status] || status;
};

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validation result interface
 */
export interface ValidationResult<T> {
  success: boolean;
  errors?: string[];
  data?: T;
}

/**
 * Validate jackpot form data with detailed error reporting
 *
 * @param data - The form data to validate
 * @returns Validation result with parsed data or errors
 */
export const validateJackpotFormData = (data: unknown): ValidationResult<JackpotFormData> => {
  try {
    const validData = JackpotFormSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Format de données invalide']
    };
  }
};

/**
 * Validate contribution data with detailed error reporting
 *
 * @param data - The contribution data to validate
 * @returns Validation result with parsed data or errors
 */
export const validateContributionData = (data: unknown): ValidationResult<ContributionData> => {
  try {
    const validData = ContributionSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Format de données invalide']
    };
  }
};

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

/**
 * Format contributor name for display
 * Respects anonymity settings
 *
 * @param contribution - Contribution data
 * @returns Display name or "Anonyme"
 */
export const getContributorDisplayName = (
  contribution: Pick<JackpotContributionData, 'contributorName' | 'isAnonymous'>
): string => {
  return contribution.isAnonymous ? 'Anonyme' : contribution.contributorName;
};

/**
 * Format contribution amount for display
 * Respects amount visibility settings
 *
 * @param contribution - Contribution data
 * @returns Formatted amount or "Montant masqué"
 */
export const getContributionDisplayAmount = (
  contribution: Pick<JackpotContributionData, 'amount' | 'showAmount'>
): string => {
  return contribution.showAmount ? formatCurrency(contribution.amount) : 'Montant masqué';
};

// ============================================================================
// SEPA CONFIGURATION HELPERS
// ============================================================================

/**
 * Get SEPA payments configuration from environment
 */
export const getSepaConfig = () => ({
  enabled: process.env.NEXT_PUBLIC_STRIPE_SEPA_PAYMENTS_ALLOWED === 'true',
  cutoffDays: parseInt(process.env.NEXT_PUBLIC_STRIPE_SEPA_CUTOFF_DAYS || '8', 10),
});

/**
 * Calculate SEPA cutoff date based on deadline
 * SEPA payments must be made X days before the deadline to ensure funds clear
 */
export const calculateSepaCutoffDate = (deadline: Date): Date => {
  const config = getSepaConfig();
  const cutoffDate = new Date(deadline);
  cutoffDate.setDate(cutoffDate.getDate() - config.cutoffDays);
  return cutoffDate;
};

/**
 * Check if SEPA payments are still allowed for a given deadline
 */
export const isSepaAllowed = (deadline: Date): boolean => {
  const config = getSepaConfig();
  if (!config.enabled) return false;

  const cutoffDate = calculateSepaCutoffDate(deadline);
  return new Date() <= cutoffDate;
};

// ============================================================================
// FEE PREVIEW FOR UI
// ============================================================================

/**
 * Preview fee breakdown for UI display
 *
 * @param amountEuros - Desired contribution amount in euros
 * @param feeConfig - Fee configuration (who pays what)
 * @returns Formatted fee breakdown for display
 */
export const previewContributionFees = (
  amountEuros: number,
  feeConfig: FeeConfig
): {
  contribution: string;
  stripeFee: string;
  platformFee: string;
  totalCharge: string;
  recipientReceives: string;
  feeNote: string;
} => {
  const amountCentimes = Math.round(amountEuros * 100);
  const calc = calculateChargeAmount(amountCentimes, feeConfig);

  // Build descriptive note about fees
  let feeNote = 'Non applicable';
  if (feeConfig.payInFeePayer === 'platform') {
    feeNote = 'La plateforme couvre les frais de traitement';
  } else if (feeConfig.payInFeePayer === 'contributor') {
    feeNote = 'Vous couvrez les frais pour que 100% aille au destinataire';
  } else {
    feeNote = 'Les frais sont déduits du montant reçu par le destinataire';
  }

  return {
    contribution: formatCurrency(calc.contributionAmount / 100),
    stripeFee: formatCurrency(calc.stripeFee / 100),
    platformFee: formatCurrency(calc.platformFee / 100),
    totalCharge: formatCurrency(calc.chargeAmount / 100),
    recipientReceives: formatCurrency(calc.contributionAmount / 100),
    feeNote,
  };
};
