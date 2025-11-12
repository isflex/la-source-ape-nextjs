import { z } from 'zod'
import DOMPurify from 'dompurify'
import { format, parseISO } from 'date-fns'
import type { Schema } from '@amplify/data/resource'

// Content block type validation based on Schema
const VALID_CONTENT_BLOCK_TYPES: Schema['EContentBlockType']['type'][] = [
  'LEFT_ALIGNED_TEXT',
  'LEFT_ALIGNED_URL',
  'CENTRED_TEXT',
  'CENTERED_URL',
  'CENTRED_IMAGE',
] as const;

// Generate URL-safe slug from subject
export const generateSlug = (subject: string, existingSlugs: string[] = []): string => {
  // Convert to lowercase and handle French accents
  let slug = subject
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
    let counter = 2
    let newSlug = `${slug}-${counter}`
    while (existingSlugs.includes(newSlug)) {
      counter++
      newSlug = `${slug}-${counter}`
    }
    slug = newSlug
  }

  return slug
}

// Generate incremental subject for duplicates
export const generateUniqueSubject = (subject: string, existingSubjects: string[]): string => {
  if (!existingSubjects.includes(subject)) {
    return subject
  }

  let counter = 2
  let newSubject = `${subject} (${counter})`
  while (existingSubjects.includes(newSubject)) {
    counter++
    newSubject = `${subject} (${counter})`
  }

  return newSubject
}

// Zod schemas for validation
// Base schema for content blocks that allows empty type for initial state
const BaseContentBlockSchema = z.object({
  type: z.string(), // Allow any string initially
  order: z.number().min(0),
  subtitle: z.string().optional(),
  content: z.string().optional(),
  href: z.string().optional(), // Remove .url() validation for now
  paragraph: z.array(z.string()).optional(),
  // S3 Storage fields for images
  s3Key: z.string().optional(),
  s3Bucket: z.string().optional(),
  originalFilename: z.string().optional(),
  mimeType: z.string().optional(),
  fileSize: z.number().optional(),
  // Legacy fields - deprecated but kept for backward compatibility
  filename: z.string().optional(),
  filetype: z.string().optional(),
  encoding: z.string().optional(),
  path: z.string().optional(),
  contentType: z.string().optional(),
});

// Full validation schema for form submission
export const ContentBlockSchema = BaseContentBlockSchema
  .refine((data) => {
    // Require type to be selected
    return data.type !== '';
  }, {
    message: 'Le type de bloc est requis',
    path: ['type']
  })
  .refine((data) => {
    // Validate type is valid enum
    return data.type === '' || VALID_CONTENT_BLOCK_TYPES.includes(data.type as Schema['EContentBlockType']['type']);
  }, {
    message: 'Type de bloc invalide',
    path: ['type']
  })
  .refine((data) => {
    // URL types require href
    if (['LEFT_ALIGNED_URL', 'CENTERED_URL'].includes(data.type)) {
      return !!data.href;
    }
    return true;
  }, {
    message: 'URL requise pour ce type de bloc',
    path: ['href']
  })
  .refine((data) => {
    // Validate URL format for URL types
    if (['LEFT_ALIGNED_URL', 'CENTERED_URL'].includes(data.type) && data.href) {
      try {
        new URL(data.href);
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }, {
    message: 'URL invalide',
    path: ['href']
  })
  .refine((data) => {
    // Image type requires either S3 fields or legacy base64 fields
    if (data.type === 'CENTRED_IMAGE') {
      const hasS3Fields = !!(data.s3Key && data.originalFilename && data.mimeType);
      const hasLegacyFields = !!(data.filename && data.filetype && data.encoding && data.content);
      return hasS3Fields || hasLegacyFields;
    }
    return true;
  }, {
    message: 'Fichier image requis pour ce type de bloc',
    path: ['content']
  })
  .refine((data) => {
    // Text types require content
    if (['LEFT_ALIGNED_TEXT', 'CENTRED_TEXT'].includes(data.type)) {
      return !!data.content;
    }
    return true;
  }, {
    message: 'Contenu requis pour ce type de bloc',
    path: ['content']
  });

// Simplified schema for real-time validation (allows empty type)
export const ContentBlockSchemaLenient = BaseContentBlockSchema.refine((data) => {
  // Only validate if type is selected
  if (!data.type || data.type === '') {
    return true; // Allow empty type for initial state
  }

  return VALID_CONTENT_BLOCK_TYPES.includes(data.type as Schema['EContentBlockType']['type']);
}, {
  message: "Type de bloc invalide"
});

export const NewsletterSchema = z.object({
  subject: z.string().min(1, 'Le sujet est requis'),
  eventDate: z.coerce.date({
    errorMap: (issue) => ({
      message: 'Date d\'événement invalide'
    })
  }),
  publicationDate: z.coerce.date({
    errorMap: (issue) => ({
      message: 'Date de publication invalide'
    })
  }),
  title: z.string().optional(),
  greetings: z.string().optional(),
  contentBlocks: z.array(ContentBlockSchema).min(1, 'Au moins un bloc de contenu est requis'),
}).refine((data) => {
  // La date de publication ne peut pas être postérieure à la date de l'événement.
  return data.publicationDate <= data.eventDate
}, {
  message: "La date de publication ne peut pas être postérieure à la date de l\'événement",
  path: ["publicationDate"]
})

export type NewsletterFormData = z.infer<typeof NewsletterSchema>
export type ContentBlockData = z.infer<typeof ContentBlockSchema>

// Helper function to convert date string (YYYY-MM-DD) to ISO datetime string
export const dateStringToISODateTime = (dateString: string): string => {
  // Convert YYYY-MM-DD to YYYY-MM-DDTHH:mm:ss+02:00 (France timezone)
  return dateString + 'T00:00:00+02:00'
}

// Helper function to convert newsletter form data to API format
export const prepareNewsletterDataForAPI = (formData: NewsletterFormData) => {
  return {
    ...formData,
    eventDate: formData.eventDate.toISOString(),
    publicationDate: formData.publicationDate.toISOString()
  }
}

export interface ValidationResult {
  success: boolean
  errors?: string[]
  data?: NewsletterFormData
}

export const validateNewsletterData = (data: unknown): ValidationResult => {
  try {
    const validData = NewsletterSchema.parse(data)
    return { success: true, data: validData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      }
    }
    return {
      success: false,
      errors: ['Invalid data format']
    }
  }
}

// HTML Content Generation
export const sanitizeContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'a'],
    ALLOWED_ATTR: ['href', 'target']
  })
}

export const contentBlockGeneratorHTML = (
  type: string,
  greetings?: string,
  subtitle?: string,
  content?: string,
  href?: string,
  filename?: string,
  filetype?: string,
  encoding?: string
): string => {
  const sanitizedContent = content ? sanitizeContent(content) : ''

  switch (type) {
    case 'LEFT_ALIGNED_TEXT':
      return `
        <div class="content-block">
          ${greetings ? `<h2>${sanitizeContent(greetings)}</h2>` : ''}
          ${subtitle && !greetings ? `<h3>${sanitizeContent(subtitle)}</h3>` : ''}
          ${sanitizedContent}
        </div>
      `

    case 'CENTRED_TEXT':
      return `
        <div class="content-block">
          ${greetings ? `<h2>${sanitizeContent(greetings)}</h2>` : ''}
          ${subtitle && !greetings ? `<h3>${sanitizeContent(subtitle)}</h3>` : ''}
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
              <tr>
                <td align="center">
                  <div class="text-centered">${sanitizedContent}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `

    case 'LEFT_ALIGNED_URL':
      return `
        <div class="content-block">
          ${greetings ? `<h2>${sanitizeContent(greetings)}</h2>` : ''}
          ${subtitle && !greetings ? `<h3>${sanitizeContent(subtitle)}</h3>` : ''}
          <p><strong>
            <span class="link-holder">
              <a href="${href}" target="_blank">${sanitizedContent || href}</a>
            </span>
          </strong></p>
        </div>
      `

    case 'CENTERED_URL':
      return `
        <div class="content-block">
          ${greetings ? `<h2>${sanitizeContent(greetings)}</h2>` : ''}
          ${subtitle && !greetings ? `<h3>${sanitizeContent(subtitle)}</h3>` : ''}
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
              <tr>
                <td align="center">
                  <p><strong>
                    <span class="link-holder">
                      <a href="${href}" target="_blank">${sanitizedContent || href}</a>
                    </span>
                  </strong></p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      `

    case 'CENTRED_IMAGE':
      return `
        <div class="image-container">
          <img src="data:image/${filetype};${encoding},${content}"
               alt="Newsletter Image"
               width="400"
               height="200"
               class="centered-image" />
        </div>
      `

    default:
      return ''
  }
}

export const newsletterContentGeneratorHTML = async (
  title?: string,
  greetings?: string,
  contentBlocks: ContentBlockData[] = []
): Promise<string> => {
  const sortedBlocks = [...contentBlocks].sort((a, b) => a.order - b.order)

  const contentBlocksHTML = sortedBlocks.map((block, index) => {
    const blockGreetings = greetings && index === 0 ? greetings : undefined

    return contentBlockGeneratorHTML(
      block.type,
      blockGreetings,
      block.subtitle,
      block.content,
      block.href,
      block.filename,
      block.filetype,
      block.encoding
    )
  }).join('')

  // Get the shared newsletter logo base64
  let logoSrc = '/assets/img/newsletter/presentation/logo_ape_900x175.png' // fallback
  try {
    const response = await fetch('/api/newsletter?logo=base64')
    if (response.ok) {
      const { base64, mimeType } = await response.json()
      logoSrc = `data:${mimeType};base64,${base64}`
    }
  } catch (error) {
    console.warn('Failed to get newsletter logo base64, using fallback:', error)
  }

  return `
    <div class="newsletter-content">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tbody>
          <tr>
            <td>
              <div class="email-container">
                <div class="image-container">
                  <img src="${logoSrc}"
                       alt="Logo de l'APE La Source"
                       width="400"
                       height="200"
                       class="centered-image" />
                </div>
                ${title ? `
                  <div class="content-block">
                    <h1>${sanitizeContent(title)}</h1>
                  </div>
                ` : ''}
                ${contentBlocksHTML}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}

// ==============================================================================
// SERVER-SIDE ADMIN AUTHENTICATION (Coming Soon)
// ==============================================================================

// The previous admin user creation functions have been removed.
// New server-side admin authentication system will be implemented here.
