'use client';

import React from 'react';
import { useRouter } from 'next/navigation'
import { z } from 'zod';
import DOMPurify from 'dompurify'

import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@amplify/data/resource'
const client = generateClient<Schema>()

import classNames from 'classnames'
import {
  Box,
  Button,
  ButtonMarkup,
  Columns,
  ColumnsItem,
  Container,
  Divider,
  Link,
  List,
  ListItem,
  ListItemDescription,
  Text,
  Title,
  TitleLevel,
  VariantState,
  IconName,
  IconSize,
  IconPosition,
  IconStatus,
  StatusIcon,
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
  Input,
  Radio,
  Section,
  Select,
  SelectOption,
  Textarea,
  Modal,
  View,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'

// Zod validation schema
const StudentSchema = z.object({
  firstname: z.string()
    .min(1, 'Prénom élève requis')
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] })),
  surname: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .optional(),
  level: z.enum([
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
  ], { required_error: 'Niveau scolaire requis', invalid_type_error: 'Niveau scolaire requis' })
});

const QuestionSchema = z.object({
  question: z.any(), // Changed from z.string() to z.any() to handle JSX elements
  answer: z.enum(['Oui', 'Non'])
});

const SondageSchema = z.object({
  firstname: z.string()
    .min(1, 'Prénom requis')
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] })),
  surname: z.string()
    .min(1, 'Nom requis')
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] })),
  email: z.string().min(1, 'Email requis').email('Format email invalide'),
  comment: z.string()
    .transform((val) => DOMPurify.sanitize(val.trim(), { ALLOWED_TAGS: [] }))
    .optional(),
  students: z.array(StudentSchema).min(1, 'Au moins un élève requis'),
  questions: z.array(QuestionSchema).length(7, 'Toutes les questions doivent être répondues')
});

type SondageFormData = z.infer<typeof SondageSchema>;

// Helper function to convert JSX questions to plain text for database storage
const getQuestionText = (question: React.ReactNode): string => {
  if (typeof question === 'string') {
    return question;
  }
  if (React.isValidElement(question)) {
    // Extract text content from JSX element recursively
    const extractText = (element: React.ReactNode): string => {
      if (typeof element === 'string') return element;
      if (typeof element === 'number') return String(element);
      if (React.isValidElement(element)) {
        const props = element.props as { children?: React.ReactNode };
        if (props.children) {
          if (Array.isArray(props.children)) {
            return props.children.map(extractText).join('');
          }
          return extractText(props.children);
        }
      }
      return '';
    };
    return extractText(question);
  }
  return String(question);
};

const PREDEFINED_QUESTIONS = [
  <>En tant que parent, souhaiteriez-vous pouvoir utiliser l&apos;application {process.env.NEXT_PUBLIC_APP_TITLE} proposée <Link href={`/web-app`} target="_blank" rel={`${process.env.NEXT_PUBLIC_APP_TITLE}`}>ici</Link> ?</>,
  `Si vous avez des enfants scolarisés à l'École nouvelle La Source (actuels ou passés) qui pourraient proposer leurs services pour s'occuper d'autres enfants, acceptez-vous qu'ils utilisent l'application ${process.env.NEXT_PUBLIC_APP_TITLE} ?`,
  `Êtes-vous d'accord que les parents ont aussi la responsabilité d'accompagner leur enfant(s) dans l'utilisation de l'application ${process.env.NEXT_PUBLIC_APP_TITLE} ?`,
  <>Trouvez-vous le communiqué de presse proposé <Link href={`/newsletter`} target="_blank" rel="newsletter">ici</Link> adéquate pour une diffusion via École Directe à l&apos;ensemble de la communauté scolaire de École nouvelle La Source ?</>,
  `Sachant que l'application ${process.env.NEXT_PUBLIC_APP_TITLE} a été conçue pour protéger au maximum vos informations personnelles et la sécurité de vos données, qu'elle a été développée sur une base volontaire et en tant que service gratuit, vous comprenez que l'application ne peut être tenue responsable d'une quelconque utilisation abusive.`,
  `L'application ${process.env.NEXT_PUBLIC_APP_TITLE} est destinée à l'ensemble de la communauté scolaire de l'École nouvelle La Source (parents et enfants inclus), mais à ce jour, son accès reste ouvert à toute personne disposant d'un accès à l'URL. Vous comprenez qu'à terme, nous pourrions décider de contrôler et de restreindre l'accès, mais cela nécessite une collaboration entre les différentes parties prenantes, qui se fera progressivement.`,
  `Vous comprenez que l'application ${process.env.NEXT_PUBLIC_APP_TITLE} a pour vocation de servir de forum d'annonces plus ou moins ouvert à tous. Son bon fonctionnement repose sur la bonne volonté et la supervision de tous.`
];

const SCHOOL_LEVELS = [
  { value: 'MATERNELLE_GS', label: 'Maternelle GS' },
  { value: 'PRIMAIRE_CP', label: 'Primaire CP' },
  { value: 'PRIMAIRE_CE1', label: 'Primaire CE1' },
  { value: 'PRIMAIRE_CE2', label: 'Primaire CE2' },
  { value: 'PRIMAIRE_CM1', label: 'Primaire CM1' },
  { value: 'PRIMAIRE_CM2', label: 'Primaire CM2' },
  { value: 'COLLEGE_6EME', label: 'Collège 6ème' },
  { value: 'COLLEGE_5EME', label: 'Collège 5ème' },
  { value: 'COLLEGE_4EME', label: 'Collège 4ème' },
  { value: 'COLLEGE_3EME', label: 'Collège 3ème' },
  { value: 'LYCEE_SECONDE', label: 'Lycée Seconde' },
  { value: 'LYCEE_PREMIERE', label: 'Lycée Première' },
  { value: 'LYCEE_TERMINALE', label: 'Lycée Terminale' },
  { value: 'ANCIEN_ELEVE', label: 'Ancien élève' }
];

export default function SondageApp() {
  const [formData, setFormData] = React.useState<SondageFormData>({
    firstname: '',
    surname: '',
    email: '',
    comment: '',
    students: [{ firstname: '', surname: '', level: '' as any }],
    questions: PREDEFINED_QUESTIONS.map(q => ({ question: q, answer: 'Oui' as const }))
  });

  const [hasError, setHasError] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [sessionId] = React.useState<string>(() => crypto.randomUUID());
  const [sondages, setSondages] = React.useState<Array<Schema['Sondage']['type']>>([]);
  const [questions, setQuestions] = React.useState<Array<Schema['Questions']['type']>>([]);
  const [showSondageForm, setShowSondageForm] = React.useState<boolean>(false);

  const router = useRouter();

  const toggleSondageForm = () => {
    setShowSondageForm(prev => !prev);
  };

  // Store field-specific errors using Zod error paths
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  // Helper function to get field-specific errors by path
  const getFieldErrors = (fieldPath: string) => {
    return fieldErrors[fieldPath] || [];
  };

  function listSondages() {
    client.models.Sondage.observeQuery().subscribe({
      next: (data) => setSondages([...data.items]),
    });
  }

  function listQuestions() {
    client.models.Questions.observeQuery().subscribe({
      next: (data) => setQuestions([...data.items]),
    });
  }

  React.useEffect(() => {
    try {
      listSondages()
      listQuestions()
    } catch(err) {
      console.error(err)
      setHasError(true)
    }
  }, []);

  const handleInputChange = (field: keyof SondageFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStudentChange = (index: number, field: keyof typeof formData.students[0], value: string) => {
    const updatedStudents = [...formData.students];
    updatedStudents[index] = { ...updatedStudents[index], [field]: value };
    setFormData(prev => ({ ...prev, students: updatedStudents }));
  };

  const handleQuestionChange = (index: number, answer: 'Oui' | 'Non') => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], answer };
    setFormData(prev => ({ ...prev, questions: updatedQuestions }));
  };

  const addStudent = () => {
    setFormData(prev => ({
      ...prev,
      students: [...prev.students, { firstname: '', surname: '', level: '' as any }]
    }));
  };

  const removeStudent = (index: number) => {
    if (formData.students.length > 1) {
      const updatedStudents = formData.students.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, students: updatedStudents }));
    }
  };

  const validateAndSubmit = async () => {
    try {
      setValidationErrors([]);
      setIsSubmitting(true);

      const validatedData = SondageSchema.parse(formData);

      // Create Sondage
      const sondageResponse = await client.models.Sondage.create({
        firstname: validatedData.firstname,
        surname: validatedData.surname,
        email: validatedData.email || null,
        session: sessionId,
        comment: validatedData.comment || null,
        surveyType: 'WEB_APP',
      });

      if (sondageResponse.data) {
        // Create Students
        for (const student of validatedData.students) {
          await client.models.Students.create({
            firstname: student.firstname,
            surname: student.surname || null,
            level: student.level,
            sondageId: sondageResponse.data.id,
          });
        }

        // Create Questions with answers
        for (const question of validatedData.questions) {
          await client.models.Questions.create({
            question: getQuestionText(question.question),
            answer: question.answer,
            sondageId: sondageResponse.data.id,
          });
        }

        alert('Sondage soumis avec succès !');

        // Reset form and hide it
        setFormData({
          firstname: '',
          surname: '',
          email: '',
          comment: '',
          students: [{ firstname: '', surname: '', level: '' as any }],
          questions: PREDEFINED_QUESTIONS.map(q => ({ question: q, answer: 'Oui' as const }))
        });
        setFieldErrors({});
        setValidationErrors([]);
        setShowSondageForm(false);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // console.log(error)
        // console.log(error.errors)

        // Create field-specific error mapping using Zod paths
        const newFieldErrors: Record<string, string[]> = {};

        error.errors.forEach(err => {
          const path = err.path.join('.');
          if (!newFieldErrors[path]) {
            newFieldErrors[path] = [];
          }
          newFieldErrors[path].push(err.message);
        });

        setFieldErrors(newFieldErrors);
        setValidationErrors(error.errors.map(e => e.message));
      } else {
        console.error('Erreur lors de la soumission:', error);
        setValidationErrors(['Erreur lors de la soumission du sondage']);
        setFieldErrors({});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSondage = async (id: string, sondageSession: string) => {
    if (sondageSession !== sessionId) {
      alert('Vous ne pouvez supprimer que vos propres sondages.');
      return;
    }

    try {
      await client.models.Sondage.delete({ id });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (hasError) {
    return (
      <Modal active={true} onClose={() => router.push('/home')}>
        <InfoBlock>
          <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
            <Title level={TitleLevel.LEVEL3}>{`AWS Amplify n'est pas configuré`}</Title>
          </InfoBlockHeader>
          <InfoBlockContent>
            <Title level={TitleLevel.LEVEL4}>
              Pensez à créer vos identifiants de connexion à AWS Amplify pour utiliser cette page.
            </Title>
          </InfoBlockContent>
        </InfoBlock>
      </Modal>
    );
  }

  return (
    <View>
      <Box className={classNames(flexStyles.hasTextTeriary)}>
        <div style={{ maxWidth: '920px' }}>
          <Section>
            <Title level={TitleLevel.LEVEL2} className={flexStyles.hasTextTeriary}>
              {showSondageForm
                ? `Merci de remplir ce sondage concernant l'accès à l'application ${`\u00AB`} ${process.env.NEXT_PUBLIC_APP_TITLE} ${`\u00BB`}.`
                : `Participer au sondage concernant l'accès à l'application ${`\u00AB`} ${process.env.NEXT_PUBLIC_APP_TITLE} ${`\u00BB`}.`
              }
            </Title>
            <div style={{ marginTop: '1rem' }}>
              <Button
                id="toggle-sondage-form"
                onClick={toggleSondageForm}
                variant={VariantState.SECONDARY}
                markup={ButtonMarkup.BUTTON}
              >
                {showSondageForm ? 'Masquer le formulaire' : 'Participer'}
              </Button>
            </div>
          </Section>
          {showSondageForm && (
            <div id="sondage-form">
            {/* Questions Section */}
            <Section>
              <Title level={TitleLevel.LEVEL3} className={flexStyles.hasTextTeriary}>
                Questions (toutes obligatoires)
              </Title>
              {formData.questions.map((question, index) => (
                <React.Fragment key={index}>
                  <div className={classNames(
                    flexStyles.isGridDisplayGrid,
                    flexStyles.isGridCols12,
                  )} style={{ margin: '2rem 0 1rem' }}>
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid,
                      flexStyles.isGridColSpan12,
                    )} style={{ marginBottom: '1rem' }}>
                      <div className={classNames(
                        flexStyles.hasTextTeriary,
                        flexStyles.isFlex, flexStyles.isFlexDirectionRow, flexStyles.isFlexWrapNowrap,
                        flexStyles.isAlignItemsBaseline,
                      )}>
                        <Title level={TitleLevel.LEVEL7} style={{ width: '30px' }}>
                          <span>{index + 1}.</span>
                        </Title>
                        <Text className={classNames(
                          flexStyles.isMarginless,
                        )} style={{ width: 'calc(100% - 30px)' }}>
                          {question.question}
                        </Text>
                      </div>
                    </div>
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                      flexStyles.isGridCols2,
                      flexStyles.isGridColSpan12, flexStyles.isGridColSpan8Tablet,
                      flexStyles.isGridColStart1, flexStyles.isGridColStart3Tablet,
                      flexStyles.isGridItemsCenter,
                      flexStyles.isGridJustifyItemsCenter,
                    )} style={{ marginBottom: '1rem' }}>
                      <Radio
                        name={`question-${index}`}
                        id={`question-sourceandco-oui-${index}`}
                        value="Oui"
                        label="Oui"
                        checked={question.answer === 'Oui'}
                        onChange={() => handleQuestionChange(index, 'Oui')}
                      />
                      <Radio
                        name={`question-${index}`}
                        id={`question-sourceandco-non-${index}`}
                        value="Non"
                        label="Non"
                        checked={question.answer === 'Non'}
                        onChange={() => handleQuestionChange(index, 'Non')}
                      />
                    </div>
                  </div>
                  {index < (formData.questions.length - 1) && (
                    <Divider />
                  )}
                </React.Fragment >
              ))}
            </Section>

            {/* Parent Information */}
            <Section>
              <Title level={TitleLevel.LEVEL3} className={flexStyles.hasTextTeriary}>
                Informations Parent
              </Title>

              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                flexStyles.isGridItemsCenter,
              )} style={{ marginBottom: '1rem' }}>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridItemsStart,
                  flexStyles.isFullheight,
                )}>
                  <Input
                    id={`parent-info-sourceandco-firstname`}
                    placeholder="Prénom *"
                    value={formData.firstname}
                    onChange={(e) => handleInputChange('firstname', e.inputValue)}
                  />
                  {getFieldErrors('firstname').map((error, errorIndex) => (
                    <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                      <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                      <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                    </span>
                  ))}
                </div>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridItemsStart,
                  flexStyles.isFullheight,
                )}>
                  <Input
                    id={`parent-info-sourceandco-surname`}
                    placeholder="Nom *"
                    value={formData.surname}
                    onChange={(e) => handleInputChange('surname', e.inputValue)}
                  />
                  {getFieldErrors('surname').map((error, errorIndex) => (
                    <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                      <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                      <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                    </span>
                  ))}
                </div>
              </div>

              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                flexStyles.isGridCols1,
                flexStyles.isGridItemsCenter,
              )}>
                <div className={classNames(
                  flexStyles.isGridDisplayGrid,
                  flexStyles.isGridItemsStart,
                  flexStyles.isFullheight,
                )}>
                  <Input
                    id={`parent-info-sourceandco-email`}
                    placeholder="Email *"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.inputValue)}
                  />
                  {getFieldErrors('email').map((error, errorIndex) => (
                    <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                      <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                      <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                    </span>
                  ))}
                </div>
              </div>
            </Section>

            {/* Students Section */}
            <Section>
              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                flexStyles.isGridItemsCenter,
              )} style={{ marginBottom: '1rem' }}>
                <Title level={TitleLevel.LEVEL3} className={classNames(flexStyles.hasTextTeriary, flexStyles.isMarginless)}>
                  Élèves (au moins un requis)
                </Title>
                <div>
                  <Button
                    id={`students-sourceandco-add`}
                    onClick={addStudent}
                    variant={VariantState.SECONDARY}
                    markup={ButtonMarkup.BUTTON}
                  >
                    Ajouter un élève
                  </Button>
                </div>
              </div>

              {formData.students.map((student, index) => (
                <Box key={index} className={classNames(flexStyles.hasBorderInfo)}>
                  <div className={classNames(
                    flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                    flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                    flexStyles.isGridItemsCenter,
                  )} style={{ marginBottom: '1rem' }}>
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid,
                      flexStyles.isGridItemsStart,
                      flexStyles.isFullheight,
                    )}>
                      <Input
                        id={`student-info-sourceandco-firstname-${index}`}
                        placeholder="Prénom de l&apos;élève *"
                        value={student.firstname}
                        onChange={(e) => handleStudentChange(index, 'firstname', e.inputValue)}
                      />
                      {getFieldErrors(`students.${index}.firstname`).map((error, errorIndex) => (
                        <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                          <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                          <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                        </span>
                      ))}
                    </div>
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid,
                      flexStyles.isGridItemsStart,
                      flexStyles.isFullheight,
                    )}>
                      <Input
                        id={`student-info-sourceandco-surname-${index}`}
                        placeholder="Nom de l&apos;élève"
                        value={student.surname}
                        onChange={(e) => handleStudentChange(index, 'surname', e.inputValue)}
                      />
                    </div>
                  </div>

                  <div className={classNames(
                    flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                    flexStyles.isGridCols1,
                    flexStyles.isGridItemsCenter,
                  )}>
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid,
                      flexStyles.isGridItemsStart,
                      flexStyles.isFullheight,
                    )}>
                      <Select name='SCHOOL_LEVELS' dynamicPlaceholder
                        placeholder={'Niveau scolaire *'}
                        placeholderId={`student-info-sourceandco-school-level-placeholder-${index}`}
                        id={`student-info-sourceandco-school-level-${index}`}
                        value={student.level || ''}
                        onChange={(e) => handleStudentChange(index, 'level', e.selectValue!)}>
                        <option value="" disabled>
                          Sélectionnez un niveau scolaire
                        </option>
                        {SCHOOL_LEVELS.map(level => (
                          <option key={level.value} value={level.value}
                            id={`student-info-sourceandco-school-levels-option-${level.value}-${index}`}>
                            {level.label}
                          </option>
                        ))}
                      </Select>
                      {getFieldErrors(`students.${index}.level`).map((error, errorIndex) => {
                        const regexZodErrorEnumSchoolLevel = /^Invalid enum value/g
                        const hasZodErrorEnumSchoolLevel = regexZodErrorEnumSchoolLevel.test(error)
                        if (!hasZodErrorEnumSchoolLevel) return null
                        return (
                          <span key={errorIndex} style={{ color: 'red', fontSize: '0.875rem', display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                            <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                            <div style={{ marginBottom: '0.5rem' }}>Veuillez sélectionner un niveau scolaire pour votre enfant</div>
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {formData.students.length > 1 && (
                    <div className={classNames(
                      flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                      flexStyles.isGridCols1,
                      flexStyles.isGridItemsCenter,
                    )} style={{ marginTop: '1rem' }}>
                      <Button
                        id={`students-sourceandco-remove`}
                        onClick={() => removeStudent(index)}
                        variant={VariantState.WARNING}
                        markup={ButtonMarkup.BUTTON}
                      >
                        Supprimer cet élève
                      </Button>
                    </div>
                  )}
                </Box>
              ))}
            </Section>

            {/* Comment Section */}
            <Section>
              <Title level={TitleLevel.LEVEL3} className={flexStyles.hasTextTeriary}>
                Commentaire (optionnel)
              </Title>

              <div className={classNames(
                flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                flexStyles.isGridCols1,
                flexStyles.isGridItemsCenter,
              )}>
                <Textarea
                  id={`comments-sourceandco`}
                  placeholder="Vos commentaires..."
                  defaultValue={formData.comment}
                  onChange={(e) => handleInputChange('comment', e.textareaValue)}
                />
              </div>
            </Section>

            {/* Form Errors Section */}
            <Section>
              {validationErrors.length > 0 && (
                // <div className={classNames(
                //   flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                //   flexStyles.isGridCols1, flexStyles.isGridCols2Tablet,
                //   flexStyles.isGridItemsCenter,
                // )} style={{ marginBottom: '1rem' }}>
                //   {validationErrors.map((error, index) => (
                //     <span key={index}>
                //       <StatusIcon size={IconSize.SMALL} position={IconPosition.LEFT} status={IconStatus.WARNING} />
                //       <div style={{ marginBottom: '0.5rem' }}>{error}</div>
                //     </span>
                //   ))}
                // </div>
                <InfoBlock>
                  <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
                    <Title level={TitleLevel.LEVEL3}>{`Erreur(s) dans le formulaire !!`}</Title>
                  </InfoBlockHeader>
                  <InfoBlockContent>
                    <Title level={TitleLevel.LEVEL4}>
                      Merci de corriger les erreurs ci-dessus pour pouvoir soumettre votre sondage
                    </Title>
                  </InfoBlockContent>
                </InfoBlock>
              )}
              <div className={classNames(flexStyles.isFullwidth, flexStyles.isAlignItemsCenter, flexStyles.isMarginless)}>
                <Button
                  id={`students-sourceandco-submit`}
                  onClick={validateAndSubmit}
                  variant={VariantState.PRIMARY}
                  markup={ButtonMarkup.BUTTON}
                  disabled={isSubmitting}
                >
                  <span style={{ marginBottom: '2rem' }}>
                    {isSubmitting ? 'Envoi en cours...' : 'Soumettre le sondage'}
                  </span>
                </Button>
              </div>
            </Section>
            </div>
          )}

          {/* Display existing sondages */}
          {sondages.length > 0 && (
            <>
              <Section>
                <Title level={TitleLevel.LEVEL2} className={flexStyles.hasTextTeriary}>
                  Résultat des sondages soumis
                </Title>

                {/* Results Tally */}
                <div style={{ marginTop: '2rem' }}>
                  <Title level={TitleLevel.LEVEL4} className={flexStyles.hasTextTeriary}>
                    Répartition des réponses par question
                  </Title>
                  {PREDEFINED_QUESTIONS.map((questionElement, questionIndex) => {
                    // Get all answers for this specific question text from all submitted surveys
                    const questionText = getQuestionText(questionElement);

                    // Simple exact matching since questions now use consistent environment variable
                    const allAnswersForQuestion = questions.filter(q => q.question === questionText);

                    const totalAnswers = allAnswersForQuestion.length;
                    const ouiCount = allAnswersForQuestion.filter(q => q.answer === 'Oui').length;
                    const nonCount = allAnswersForQuestion.filter(q => q.answer === 'Non').length;

                    const ouiPercentage = totalAnswers > 0 ? Math.round((ouiCount / totalAnswers) * 100) : 0;
                    const nonPercentage = totalAnswers > 0 ? Math.round((nonCount / totalAnswers) * 100) : 0;

                    return (
                      <div key={questionIndex} style={{
                        border: '1px solid #e0e0e0',
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9'
                      }}>
                        <Text className={flexStyles.hasTextTeriary} style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                          Question {questionIndex + 1}: {questionElement}
                        </Text>

                        <div className={classNames(
                          flexStyles.isGridDisplayGrid, flexStyles.isGridGap4,
                          flexStyles.isGridCols2,
                          flexStyles.isGridItemsCenter,
                        )} style={{ marginTop: '1rem' }}>
                          <div style={{
                            backgroundColor: '#e8f5e8',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            textAlign: 'center'
                          }}>
                            <Text style={{ fontWeight: 'bold', color: '#2d5016' }}>
                              Oui: {ouiPercentage}% ({ouiCount} réponses)
                            </Text>
                          </div>

                          <div style={{
                            backgroundColor: '#ffe8e8',
                            padding: '0.75rem',
                            borderRadius: '4px',
                            textAlign: 'center'
                          }}>
                            <Text style={{ fontWeight: 'bold', color: '#8b1538' }}>
                              Non: {nonPercentage}% ({nonCount} réponses)
                            </Text>
                          </div>
                        </div>

                        {totalAnswers === 0 && (
                          <Text style={{
                            fontStyle: 'italic',
                            color: '#666',
                            textAlign: 'center',
                            marginTop: '0.5rem'
                          }}>
                            Aucune réponse encore reçue
                          </Text>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
              <Section>
                <Title level={TitleLevel.LEVEL3} className={flexStyles.hasTextTeriary}>
                  Participants au sondage
                </Title>
                {sondages
                  .sort((a, b) => {
                    // Current session participant appears first
                    if (a.session === sessionId && b.session !== sessionId) return -1;
                    if (a.session !== sessionId && b.session === sessionId) return 1;
                    return 0; // Keep original order for other participants
                  })
                  .map((sondage) => (
                    <div key={sondage.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
                    <Text className={flexStyles.hasTextTeriary}>
                      {sondage.firstname} {sondage.surname} - {sondage.email || "Pas d'email"}
                    </Text>
                      {sondage.session === sessionId && (
                        <Button
                          onClick={() => deleteSondage(sondage.id, sondage.session || '')}
                          variant={VariantState.PRIMARY}
                          markup={ButtonMarkup.BUTTON}
                        >
                          <span style={{ marginTop: '0.5rem' }}>Supprimer</span>
                        </Button>
                      )}
                    </div>
                  ))}
              </Section>
            </>
          )}
        </div>
      </Box>
    </View>
  );
}
