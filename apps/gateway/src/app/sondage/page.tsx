'use client';

import React from 'react';
import { useRouter } from 'next/navigation'
import { z } from 'zod';

import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@amplify/data/resource'
const client = generateClient<Schema>()

import classNames from 'classnames'
import {
  Button,
  ButtonMarkup,
  Link,
  Text,
  Title,
  TitleLevel,
  VariantState,
  IconName,
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus,
  Modal,
} from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'

// Zod validation schema
const StudentSchema = z.object({
  firstname: z.string().min(1, 'Prénom requis'),
  surname: z.string().optional(),
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
  ])
});

const QuestionSchema = z.object({
  question: z.string(),
  answer: z.enum(['Oui', 'Non'])
});

const SondageSchema = z.object({
  firstname: z.string().min(1, 'Prénom requis'),
  surname: z.string().min(1, 'Nom requis'),
  email: z.string().email().optional().or(z.literal('')),
  comment: z.string().optional(),
  students: z.array(StudentSchema).min(1, 'Au moins un élève requis'),
  questions: z.array(QuestionSchema).length(7, 'Toutes les questions doivent être répondues')
});

type SondageFormData = z.infer<typeof SondageSchema>;

const PREDEFINED_QUESTIONS = [
  "En tant que parent, souhaiteriez-vous pouvoir utiliser l'application web Source&Co proposée ici ?",
  "Si vous avez des enfants scolarisés à La Source (actuels ou passés) qui pourraient proposer leurs services pour s'occuper d'autres enfants, acceptez-vous qu'ils utilisent l'application web Source&Co ?",
  "Êtes-vous d'accord que les parents ont aussi la responsabilité d'accompagner leur enfant(s) dans l'utilisation de l'application web Source&Co ?",
  "Trouvez-vous le communiqué de presse proposé ici adéquate pour une diffusion via École Directe à l'ensemble de la communauté scolaire de La Source ?",
  "Sachant que l'application web Source&Co a été conçue pour protéger au maximum vos informations personnelles et la sécurité de vos données, qu'elle a été développée sur une base volontaire et en tant que service gratuit, vous comprenez que l'application ne peut être tenue responsable d'une quelconque utilisation abusive.",
  "L'application web Source&Co est destinée à l'ensemble de la communauté scolaire de La Source (parents et enfants inclus), mais à ce jour, son accès reste ouvert à toute personne disposant d'un accès à l'URL. Vous comprenez qu'à long terme, nous pourrions décider de contrôler et de restreindre l'accès, mais cela nécessite une collaboration entre les différentes parties prenantes, qui se fera progressivement.",
  "Vous comprenez que l'application web Source&Co a pour vocation de servir de forum d'annonces plus ou moins ouvert à tous. Son bon fonctionnement repose sur la bonne volonté et la supervision de tous."
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
    students: [{ firstname: '', surname: '', level: 'PRIMAIRE_CP' }],
    questions: PREDEFINED_QUESTIONS.map(q => ({ question: q, answer: 'Oui' as const }))
  });

  const [hasError, setHasError] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [sessionId] = React.useState<string>(() => crypto.randomUUID());
  const [sondages, setSondages] = React.useState<Array<Schema['Sondage']['type']>>([]);

  const router = useRouter();

  function listSondages() {
    client.models.Sondage.observeQuery().subscribe({
      next: (data) => setSondages([...data.items]),
    });
  }

  React.useEffect(() => {
    try {
      listSondages()
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
      students: [...prev.students, { firstname: '', surname: '', level: 'PRIMAIRE_CP' }]
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
            question: question.question,
            answer: question.answer,
            sondageId: sondageResponse.data.id,
          });
        }

        alert('Sondage soumis avec succès !');

        // Reset form
        setFormData({
          firstname: '',
          surname: '',
          email: '',
          comment: '',
          students: [{ firstname: '', surname: '', level: 'PRIMAIRE_CP' }],
          questions: PREDEFINED_QUESTIONS.map(q => ({ question: q, answer: 'Oui' as const }))
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors.map(e => e.message));
      } else {
        console.error('Erreur lors de la soumission:', error);
        setValidationErrors(['Erreur lors de la soumission du sondage']);
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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Text className={flexStyles.hasTextWhite}>
        Merci de remplir ce sondage concernant l&apos;application web Source&Co.
      </Text>

      {validationErrors.length > 0 && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {validationErrors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}

      <form style={{ marginTop: '2rem' }}>
        {/* Parent Information */}
        <section style={{ marginBottom: '2rem' }}>
          <Title level={TitleLevel.LEVEL3} className={flexStyles.hasTextWhite}>
            Informations Parent
          </Title>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
              Prénom * :
            </label>
            <input
              type="text"
              value={formData.firstname}
              onChange={(e) => handleInputChange('firstname', e.target.value)}
              style={{ padding: '0.5rem', width: '100%', borderRadius: '4px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
              Nom * :
            </label>
            <input
              type="text"
              value={formData.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              style={{ padding: '0.5rem', width: '100%', borderRadius: '4px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
              Email :
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{ padding: '0.5rem', width: '100%', borderRadius: '4px' }}
            />
          </div>
        </section>

        {/* Students Section */}
        <section style={{ marginBottom: '2rem' }}>
          <Title level={TitleLevel.LEVEL3} className={flexStyles.hasTextWhite}>
            Élèves (au moins un requis)
          </Title>

          {formData.students.map((student, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Prénom de l&apos;élève * :
                </label>
                <input
                  type="text"
                  value={student.firstname}
                  onChange={(e) => handleStudentChange(index, 'firstname', e.target.value)}
                  style={{ padding: '0.5rem', width: '100%', borderRadius: '4px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Nom de l&apos;élève :
                </label>
                <input
                  type="text"
                  value={student.surname}
                  onChange={(e) => handleStudentChange(index, 'surname', e.target.value)}
                  style={{ padding: '0.5rem', width: '100%', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Niveau * :
                </label>
                <select
                  value={student.level}
                  onChange={(e) => handleStudentChange(index, 'level', e.target.value)}
                  style={{ padding: '0.5rem', width: '100%', borderRadius: '4px' }}
                  required
                >
                  {SCHOOL_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.students.length > 1 && (
                <Button
                  onClick={() => removeStudent(index)}
                  variant={VariantState.DANGER}
                  markup={ButtonMarkup.BUTTON}
                >
                  Supprimer cet élève
                </Button>
              )}
            </div>
          ))}

          <Button
            onClick={addStudent}
            variant={VariantState.SECONDARY}
            markup={ButtonMarkup.BUTTON}
          >
            Ajouter un élève
          </Button>
        </section>

        {/* Questions Section */}
        <section style={{ marginBottom: '2rem' }}>
          <Title level={TitleLevel.LEVEL3} className={flexStyles.hasTextWhite}>
            Questions (toutes obligatoires)
          </Title>

          {formData.questions.map((question, index) => (
            <div key={index} style={{ marginBottom: '2rem' }}>
              <Text className={flexStyles.hasTextWhite} style={{ marginBottom: '1rem' }}>
                {index + 1}. {question.question}
              </Text>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value="Oui"
                    checked={question.answer === 'Oui'}
                    onChange={() => handleQuestionChange(index, 'Oui')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Oui
                </label>

                <label style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value="Non"
                    checked={question.answer === 'Non'}
                    onChange={() => handleQuestionChange(index, 'Non')}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Non
                </label>
              </div>
            </div>
          ))}
        </section>

        {/* Comment Section */}
        <section style={{ marginBottom: '2rem' }}>
          <Title level={TitleLevel.LEVEL3} className={flexStyles.hasTextWhite}>
            Commentaire (optionnel)
          </Title>

          <textarea
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            style={{ padding: '0.5rem', width: '100%', minHeight: '100px', borderRadius: '4px' }}
            placeholder="Vos commentaires..."
          />
        </section>

        <Button
          onClick={validateAndSubmit}
          variant={VariantState.PRIMARY}
          markup={ButtonMarkup.BUTTON}
          disabled={isSubmitting}
        >
          <span style={{ marginBottom: '2rem' }}>
            {isSubmitting ? 'Envoi en cours...' : 'Soumettre le sondage'}
          </span>
        </Button>
      </form>

      {/* Display existing sondages */}
      {sondages.length > 0 && (
        <section>
          <Title level={TitleLevel.LEVEL3} className={flexStyles.hasTextWhite}>
            Sondages soumis
          </Title>

          {sondages.map((sondage) => (
            <div key={sondage.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
              <Text className={flexStyles.hasTextWhite}>
                {sondage.firstname} {sondage.surname} - {sondage.email || 'Pas d&apos;email'}
              </Text>
              {sondage.session === sessionId && (
                <Button
                  onClick={() => deleteSondage(sondage.id, sondage.session || '')}
                  variant={VariantState.DANGER}
                  markup={ButtonMarkup.BUTTON}
                >
                  <span style={{ marginTop: '0.5rem' }}>Supprimer</span>
                </Button>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}