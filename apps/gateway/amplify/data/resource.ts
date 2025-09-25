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
    'ERASMUS'
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
