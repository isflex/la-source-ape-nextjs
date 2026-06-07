import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ESchoolLevel: a.enum([
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
  ]),

  EAnswer: a.enum([
    'Oui',
    'Non'
  ]),

  ESurveyType: a.enum([
    'WEB_APP',
    'ERASMUS',
    'CAREER_DISCOVERY'
  ]),

  // Erasmus-specific enums (no spaces allowed in GraphQL enum values)
  EErasmusAwareness: a.enum([
    'OUI',
    'NON',
    'PAS_VRAIMENT'
  ]),

  EErasmusInterest: a.enum([
    'OUI_BEAUCOUP',
    'OUI_UN_PEU',
    'PAS_VRAIMENT',
    'PAS_DU_TOUT'
  ]),

  EComfortLevel: a.enum([
    'TRES_A_LAISE',
    'ASSEZ_A_LAISE',
    'PARTAGE',
    'PAS_DU_TOUT_A_LAISE'
  ]),

  EErasmusMotivation: a.enum([
    'AMELIORER_COMPETENCES_LINGUISTIQUES',
    'DECOUVRIR_AUTRE_PAYS_CULTURE',
    'RENCONTRER_AUTRES_ELEVES_EUROPEENS',
    'VALORISER_DOSSIER_SCOLAIRE',
    'AUCUN'
  ]),

  EErasmusConcerns: a.enum([
    'COUT_FINANCIER',
    'HEBERGEMENT',
    'SECURITE',
    'DIFFERENCES_CULTURELLES',
    'BARRIERE_LINGUISTIQUE',
    'QUALITE_ENSEIGNEMENT',
    'AUTRE'
  ]),

  EFinancingWillingness: a.enum([
    'OUI_SANS_HESITATION',
    'OUI_SELON_COUT',
    'PEUT_ETRE',
    'PROBABLEMENT_PAS',
    'NON'
  ]),

  EIdealDuration: a.enum([
    'UNE_SEMAINE',
    'DEUX_SEMAINES',
    'UN_MOIS',
    'TROIS_MOIS_TRIMESTRE'
  ]),

  // Newsletter Content Block Types
  EContentBlockType: a.enum([
    'LEFT_ALIGNED_TEXT',
    'LEFT_ALIGNED_URL',
    'CENTRED_TEXT',
    'CENTERED_URL',
    'CENTRED_IMAGE',
  ]),

  // Piscine Planning specific enums
  EDayOfWeek: a.enum([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY'
  ]),

  // Jackpot (Cagnotte) specific enums
  EJackpotStatus: a.enum([
    'DRAFT',           // Created but not yet published
    'ACTIVE',          // Published and accepting contributions
    'CLOSED',          // Deadline reached, no more contributions
    'PAID_OUT'         // Money has been transferred to creator
  ]),

  EPaymentStatus: a.enum([
    'PENDING',         // Checkout session created but not completed
    'SUCCEEDED',       // Payment confirmed by Stripe webhook
    'FAILED',          // Payment failed
    'REFUNDED',        // Payment was refunded
    'CANCELED'         // Checkout session expired/canceled
  ]),

  // HelloAsso Membership Status
  EMembershipStatus: a.enum([
    'ACTIVE',          // Payment confirmed via webhook
    'EXPIRED',         // Validity period has passed
    'DELETED',         // Order removed in HelloAsso back-office; row kept for audit
  ]),

  // Stripe Connect Account Status
  EStripeAccountStatus: a.enum([
    'NOT_STARTED',        // User has not begun onboarding
    'ONBOARDING_STARTED', // Account link created, but not completed
    'ONBOARDING_COMPLETE',// Charges enabled, payouts may be pending
    'ACTIVE',            // Fully verified, charges and payouts enabled
    'RESTRICTED',        // Account restricted, may need reauth
    'DISABLED'           // Account disabled by platform or Stripe
  ]),

  // Payment Method Types
  EPaymentMethodType: a.enum([
    'CARD',              // Credit/debit card payment
    'SEPA'               // SEPA direct debit (EU bank transfer)
  ]),

  Questions: a
    .model({
      question: a.string().required(),
      answer: a.ref('EAnswer'),
      sondageId: a.id(),
      sondage: a.belongsTo('Sondage', 'sondageId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Students: a
    .model({
      firstname: a.string(),
      surname: a.string(),
      level: a.ref('ESchoolLevel'),
      sondageId: a.id(),
      sondage: a.belongsTo('Sondage', 'sondageId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Erasmus survey specific fields
  ErasmusResponse: a
    .model({
      email: a.string().required(),
      childDetails: a.string().required(), // "nom, prénom, classe"
      erasmusAwareness: a.ref('EErasmusAwareness').required(),
      erasmusDefinition: a.string(), // Optional text field
      erasmusInterest: a.ref('EErasmusInterest').required(),
      comfortLevel: a.ref('EComfortLevel').required(),
      motivations: a.string().array(), // Multiple selections as strings
      desiredInformation: a.string().required(),
      concerns: a.string().array(), // Multiple selections as strings
      financingWillingness: a.ref('EFinancingWillingness').required(),
      idealDuration: a.ref('EIdealDuration').required(), // Question 10
      previousExperience: a.string(), // Question 11 - Optional text field
      suggestions: a.string(), // Question 12 - Optional text field
      session: a.string(),
      surveyType: a.ref('ESurveyType'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Career Discovery Form Template Model
  CareerDiscoveryTemplate: a
    .model({
      year: a.string().required(), // e.g., "2025-2026"
      title: a.string().required(), // Customizable title
      subtitle: a.string().required(), // Required subtitle for additional context
      availabilityOptions: a.string().array().required(), // Admin configurable options
      isActive: a.boolean().default(false), // Whether this template is currently active
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Career Discovery Response Model
  CareerDiscoveryResponse: a
    .model({
      email: a.string().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      childrenClasses: a.string().required(),
      phone: a.string().required(),
      availability: a.string().array().required(), // Array of option text from template
      organization: a.string(),
      jobDescription: a.string().required(),
      companySector: a.string(),
      session: a.string(),
      surveyType: a.ref('ESurveyType'),
      templateYear: a.string().required(), // Links to which template year this response belongs to
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Newsletter Subscription Model
  NewsletterSubscription: a
    .model({
      email: a.string().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      subscribedAt: a.datetime(),
      isActive: a.boolean().default(true),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Newsletter Models
  Newsletter: a
    .model({
      eventDate: a.datetime().required(),
      subject: a.string().required(),
      slug: a.string().required(),
      publicationDate: a.datetime().required(),
      title: a.string(),
      greetings: a.string(),
      htmlContent: a.string(),
      emailParts: a.string().array(),
      isDeleted: a.boolean().default(false),
      contentBlocks: a.hasMany('ContentBlock', 'newsletterId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ContentBlock: a
    .model({
      newsletterId: a.id().required(),
      newsletter: a.belongsTo('Newsletter', 'newsletterId'),
      order: a.integer().required(),
      type: a.ref('EContentBlockType').required(),
      subtitle: a.string(),
      href: a.string(),
      content: a.string(),
      paragraph: a.string().array(),
      // S3 Storage fields for images
      s3Key: a.string(),           // S3 object key (e.g., "newsletter-images/image123.png")
      s3Bucket: a.string(),        // S3 bucket name
      originalFilename: a.string(), // Original filename for display
      mimeType: a.string(),        // MIME type (e.g., "image/png")
      fileSize: a.integer(),       // File size in bytes
      // Legacy fields - deprecated but kept for backward compatibility
      filename: a.string(),
      filetype: a.string(),
      encoding: a.string(),
      path: a.string(),
      contentType: a.string(),
      raw: a.string().array(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Sondage: a
    .model({
      firstname: a.string().required(),
      surname: a.string().required(),
      email: a.string(),
      session: a.string(),
      comment: a.string(),
      surveyType: a.ref('ESurveyType'),
      students: a.hasMany('Students', 'sondageId'),
      questions: a.hasMany('Questions', 'sondageId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Piscine Planning Models
  PiscineForm: a
    .model({
      title: a.string().required(),
      slug: a.string().required(),
      // isMultiDay only affects UI (radio vs checkbox), not data structure
      isMultiDay: a.boolean().default(false), // false = single day selection, true = multiple days
      schoolLevel: a.ref('ESchoolLevel').required(),
      teacherName: a.string().required(),
      owner: a.string().required(), // Cognito user ID
      timeSlots: a.hasMany('PiscineTimeSlot', 'piscineFormId'), // Always used (1 for single-day, N for multi-day)
      dateSlots: a.hasMany('PiscineDateSlot', 'piscineFormId'),
      candidats: a.hasMany('PiscineCandidat', 'piscineFormId'), // For direct access to all candidats
    })
    .authorization((allow) => [allow.publicApiKey()]),

  PiscineTimeSlot: a
    .model({
      dayOfWeek: a.ref('EDayOfWeek').required(), // MONDAY, TUESDAY, etc.
      startTime: a.string().required(), // Format: "HH:MM" (e.g., "10:30")
      endTime: a.string().required(),   // Format: "HH:MM" (e.g., "12:30")
      order: a.integer().default(0), // Display order (0-4 for Mon-Fri)
      piscineFormId: a.id().required(),
      piscineForm: a.belongsTo('PiscineForm', 'piscineFormId'),
      dateSlots: a.hasMany('PiscineDateSlot', 'piscineTimeSlotId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  PiscineDateSlot: a
    .model({
      selectedDate: a.date().required(),
      order: a.integer().default(0),
      dayOfWeek: a.ref('EDayOfWeek'), // Denormalized for quick filtering
      piscineTimeSlotId: a.id(), // Optional - null indicates orphaned/archived slot
      piscineFormId: a.id().required(),
      piscineForm: a.belongsTo('PiscineForm', 'piscineFormId'),
      piscineTimeSlot: a.belongsTo('PiscineTimeSlot', 'piscineTimeSlotId'),
      candidats: a.hasMany('PiscineCandidat', 'piscineDateSlotId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  PiscineCandidat: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      email: a.string().required(),
      phoneNumber: a.string().required(),
      nameOfChild: a.string().required(),
      order: a.integer().default(0), // For creator reordering within date slot
      owner: a.string(), // Cognito userId of participant creator (nullable for backward compatibility)
      piscineDateSlotId: a.id().required(),
      piscineDateSlot: a.belongsTo('PiscineDateSlot', 'piscineDateSlotId'),
      piscineFormId: a.id().required(),
      piscineForm: a.belongsTo('PiscineForm', 'piscineFormId'), // For easier queries
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Stripe Connect Account (for cagnotte creators)
  StripeConnectAccount: a
    .model({
      userId: a.string().required(),  // Cognito user ID (unique per user)
      stripeAccountId: a.string().required(),  // Stripe account ID (e.g., "acct_...")
      accountStatus: a.ref('EStripeAccountStatus'),
      onboardingComplete: a.boolean().default(false),
      chargesEnabled: a.boolean().default(false),
      payoutsEnabled: a.boolean().default(false),
      detailsSubmitted: a.boolean().default(false),

      // Account details (cached from Stripe for quick access)
      email: a.string(),
      displayName: a.string(),
      country: a.string(),
      currency: a.string(),

      // Onboarding tracking
      onboardingStartedAt: a.datetime(),
      onboardingCompletedAt: a.datetime(),
      lastOnboardingLinkCreatedAt: a.datetime(),

      // Requirements tracking (for restricted accounts)
      currentlyDue: a.string().array(),  // Array of requirement strings
      eventuallyDue: a.string().array(),
      pastDue: a.string().array(),
      disabledReason: a.string(),  // Reason if account is disabled

      // Metadata
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // Jackpot (Cagnotte) Models
  JackpotForm: a
    .model({
      title: a.string().required(),
      slug: a.string().required(),
      description: a.string(),
      targetAmount: a.float(),
      deadline: a.datetime().required(),
      teacherName: a.string().required(),
      schoolLevel: a.ref('ESchoolLevel'),
      status: a.ref('EJackpotStatus'), // Default 'DRAFT' set in application logic
      owner: a.string().required(),
      imageS3Key: a.string(),
      imageS3Bucket: a.string(),
      imageMimeType: a.string(),
      payoutRequested: a.boolean().default(false),
      payoutRequestedAt: a.datetime(),
      payoutCompletedAt: a.datetime(),
      payoutNotes: a.string(),
      payoutStripeId: a.string(),  // Stripe payout id (po_…) — used to reconcile webhook events

      // Stripe Connect fields
      stripeAccountId: a.string(),  // Connect account that will receive funds

      // Fee configuration (stored per cagnotte for historical accuracy)
      feePayInPayer: a.string().default('contributor'),  // 'platform' | 'contributor' | 'recipient'
      feePayoutPayer: a.string().default('recipient'),  // 'platform' | 'recipient'
      platformCommissionPercent: a.float().default(0),  // e.g., 5 for 5%

      // SEPA payment constraints
      sepaPaymentsCutoffAt: a.datetime(),  // Calculated: deadline minus SEPA days
      sepaPaymentsAllowed: a.boolean().default(false),

      // Public visibility (for discovery on landing page)
      isPubliclyVisible: a.boolean().default(false),

      contributions: a.hasMany('JackpotContribution', 'jackpotFormId'),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  // HelloAsso Membership (Adhésion)
  Membership: a
    .model({
      emailCognito: a.string().required(),        // The user's Cognito login email (our side of truth)
      emailPayerHelloAsso: a.string().required(), // The email used on HelloAsso checkout (may diverge)
      firstName: a.string().required(),
      lastName: a.string().required(),
      status: a.ref('EMembershipStatus'),
      helloassoOrderId: a.integer().required(),
      helloassoPaymentId: a.integer(),
      amountCents: a.integer().required(),
      paidAt: a.datetime().required(),
      validUntil: a.datetime().required(),
      helloassoFormSlug: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((index) => [
      index('emailCognito'),
      index('emailPayerHelloAsso'),
    ])
    .authorization((allow) => [allow.publicApiKey()]),

  JackpotContribution: a
    .model({
      jackpotFormId: a.id().required(),
      jackpotForm: a.belongsTo('JackpotForm', 'jackpotFormId'),
      contributorName: a.string().required(),
      contributorEmail: a.string().required(),
      contributorMessage: a.string(),
      amount: a.float().required(),
      stripeSessionId: a.string().required(),
      stripePaymentIntentId: a.string(),
      paymentStatus: a.ref('EPaymentStatus'), // Default 'PENDING' set in application logic
      isAnonymous: a.boolean().default(false),
      showAmount: a.boolean().default(true),
      owner: a.string(),

      // Payment method and fee breakdown
      paymentMethodType: a.ref('EPaymentMethodType'),  // Default 'CARD' set in application logic
      stripeChargeId: a.string(),

      // Fee breakdown (for transparency and reconciliation)
      chargeAmount: a.float(),  // What contributor was charged
      contributionAmount: a.float(),  // What goes to pot (after fees if recipient pays)
      stripeFeeAmount: a.float(),  // Stripe's processing fee
      platformFeeAmount: a.float(),  // Platform commission
      contributorPaidFees: a.float(),  // Extra contributor paid for fees
      recipientPaidFees: a.float(),  // Deducted from recipient's share
      feePayerType: a.string(),  // 'platform' | 'contributor' | 'recipient' (snapshot)
      contributorOptedToCoverFees: a.boolean().default(false),  // If contributor chose to cover

      createdAt: a.datetime(),
      paidAt: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
  // https://docs.amplify.aws/vue/build-a-backend/data/enable-logging/
  // logging: {
  //   excludeVerboseContent: true,
  //   fieldLogLevel: 'debug',
  //   retention: '1 day'
  // }
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
