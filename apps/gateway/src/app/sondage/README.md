1.  Using the files in /home/ischerer/workspaces/flex/la-source-ape/apps/gateway/src/app/todo/*.tsx as a template create new layout.tsx and page.tsx files in /home/ischerer/workspaces/flex/la-source-ape/apps/gateway/src/app/sondage/.

2.  Create the following models in /home/ischerer/workspaces/flex/la-source-ape/apps/gateway/amplify/data/resource.ts that uses "Todo" as a template.
  1. A model Sondage which includes the fields:
  firstname: String!, => (required to save form)
  surname: String!, => (required to save form)
  email: String,
  session: A session id which is unique
  students: A one to many relationship with model "Students" => (at least one entry required to save the form)
  questions: A one to many relationship with model "Questions" => (all questions must be answered to save the form)
  comment: String
  2. A Students model which include the fields:
  firstname: String, => (required to validate student entry)
  surname: String,
  level: Enum ESchoolLevel(
    COLLEGE_3EME
    COLLEGE_4EME
    COLLEGE_5EME
    COLLEGE_6EME
    LYCEE_PREMIERE
    LYCEE_SECONDE
    LYCEE_TERMINALE
    MATERNELLE_GS
    PRIMAIRE_CE1
    PRIMAIRE_CE2
    PRIMAIRE_CM1
    PRIMAIRE_CM2
    PRIMAIRE_CP
    ANCIEN_ELEVE
  ) => (at least one Enum selected to validate student entry)
  3. A Questions model which includes the fields:
  question: String!
  answer: Enum (
    Oui
    Non
  ) => (at least one Enum selected to validate question entry)
  4. The Questions model should be populated with the following question entries:
    - En tant que parent, souhaiteriez-vous pouvoir utiliser l'application web Source&Co proposée ici ?
    - Si vous avez des enfants scolarisés à La Source (actuels ou passés) qui pourraient proposer leurs services pour s'occuper d'autres enfants, acceptez-vous qu'ils utilisent l'application web Source&Co ?
    - Êtes-vous d'accord que les parents ont aussi la responsabilité d'accompagner leur enfant(s) dans l'utilisation de l'application web Source&Co ?
    - Trouvez-vous le communiqué de presse proposé ici adéquate pour une diffusion via École Directe à l'ensemble de la communauté scolaire de La Source ?
    - Sachant que l'application web Source&Co a été conçue pour protéger au maximum vos informations personnelles et la sécurité de vos données, qu'elle a été développée sur une base volontaire et en tant que service gratuit, vous comprenez que l'application ne peut être tenue responsable d'une quelconque utilisation abusive.
    - L'application web Source&Co est destinée à l'ensemble de la communauté scolaire de La Source (parents et enfants inclus), mais à ce jour, son accès reste ouvert à toute personne disposant d'un accès à l'URL. Vous comprenez qu'à long terme, nous pourrions décider de contrôler et de restreindre l'accès, mais cela nécessite une collaboration entre les différentes parties prenantes, qui se fera progressivement.
    - Vous comprenez que l'application web Source&Co a pour vocation de servir de forum d'annonces plus ou moins ouvert à tous. Son bon fonctionnement repose sur la bonne volonté et la supervision de tous.

3. Create a zod schema in /home/ischerer/workspaces/flex/la-source-ape/apps/gateway/src/app/sondage/page.tsx, that validates a form which uses the above models

4. Using the form prensent in /home/ischerer/workspaces/flex/la-source-ape/apps/gateway/src/app/todo/page.tsx as a template, create a form in /home/ischerer/workspaces/flex/la-source-ape/apps/gateway/src/app/sondage/page.tsx where saved entries cannot be deleted or modified if the session id in model Sondage differs.
