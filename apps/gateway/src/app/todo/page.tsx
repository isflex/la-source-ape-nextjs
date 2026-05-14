/* eslint-disable no-alert */

'use client';

import React from 'react';
import { debug } from '@flexiness/domain-utils';
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@amplify/data/resource'
const client = generateClient<Schema>()

import classNames from 'classnames'
import { Button, ButtonMarkup } from '@flex-design-system/react-ts/client-sync-styled-direct/button';
import { Link } from '@flex-design-system/react-ts/client-sync-styled-direct/link';
import { Text } from '@flex-design-system/react-ts/client-sync-styled-direct/text';
import { Title, TitleLevel } from '@flex-design-system/react-ts/client-sync-styled-direct/title';
import { VariantState } from '@flex-design-system/react-ts/client-sync-styled-direct/objects';
import { IconName } from '@flex-design-system/react-ts/client-sync-styled-direct/icon';
import {
  InfoBlock,
  InfoBlockAction,
  InfoBlockContent,
  InfoBlockHeader,
  InfoBlockStatus
} from '@flex-design-system/react-ts/client-sync-styled-direct/info-block';
import { Modal } from '@flex-design-system/react-ts/client-sync-styled-direct/modal';
import { default as flexStyles } from '@flex-design-system/framework'

export default function ToDoApp() {

  const [todos, setTodos] = React.useState<Array<Schema['Todo']['type']>>([])
  const [hasError, setHasError] = React.useState<boolean>(false)
  const router = useRouter()

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  React.useEffect(() => {
     try {
       listTodos()
     } catch(err) {
       debug.error(err)
       // eslint-disable-next-line react-hooks/set-state-in-effect -- set error state on subscription init failure
       setHasError(true)
     }
   }, [])

  function createTodo() {
    const task = window.prompt('Nouvelle tâche')
    if (task === null) return
    if (task.toLowerCase() === '') {
      client.models.Todo.create({
        content: 'Ne soyez pas timide, suggérer quelque chose !!',
      });
    } else {
      client.models.Todo.create({
        content: task,
      });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  if (!hasError) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 0 8rem'
      }}>
        <Text className={flexStyles.hasTextWhite}>
          {`Voici un mini exemple d'application 'My Todos' que les élèves de la source pourront facilement créer eux-mêmes.`}
        </Text>
        <Text className={classNames(flexStyles.hasTextWhite, flexStyles.isItalic )}>
          {`L'idée est que ce site puisse être alimenter en contenu par qui que ce soit : élèves, parents et enseignants...`}
        </Text>
        <br/>
        <Button onClick={createTodo}
          id={'createTodo'}
          variant={VariantState.PRIMARY}
          markup={ButtonMarkup.BUTTON}>
            <span style={{ margin: '0 auto', padding: '0 1rem'}}>
              Créer une nouvelle tâche
            </span>
        </Button>
        <br/>
        <ul>
          {todos.map((todo) => (
            <li onClick={() => deleteTodo(todo.id)}
              key={todo.id}>
              {todo.content}
            </li>
          ))}
        </ul>
        <Text>🚀 Application hébergée avec succès.</Text>
        <Text>🥳 Essayez de créer une nouvelle tâche.</Text>
        <Link href='https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/' target='_blank'>
          Suivez les prochains étapes de cet tutoriel
        </Link>
      </div>
  )}

  return (
    <Modal active={true} onClose={() => {
      router.push('/home')
    }}>
      <InfoBlock>
        <InfoBlockHeader status={InfoBlockStatus.WARNING} customIcon={IconName.UI_EXCLAMATION_CIRCLE}>
          <Title level={TitleLevel.LEVEL3}>{`AWS Amplify n'est pas configurer`}</Title>
        </InfoBlockHeader>
        <InfoBlockContent>
          <Title level={TitleLevel.LEVEL4}>
            Pensez à créer vos identifiants de connexion à AWS Amplify pour utiliser cette page.
          </Title>
          <Title level={TitleLevel.LEVEL5}>
            Rejoignez le groupe chat <Link href='https://chat.whatsapp.com/HqVx1dpEQM8Bk3XrDDaXtI' target='_blank'>Whatsapp</Link> pour plus
            d&apos;aide.
          </Title>
          <Image
            src='/assets/img/qr-code-whatsapp.jpg'
            width={100}
            height={100}
            alt='WhatsApp QR Code'
          />
        </InfoBlockContent>
        <InfoBlockAction>
          <Link href='https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/' target='_blank'>
            Suivez les étapes de cet tutoriel
          </Link>
        </InfoBlockAction>
      </InfoBlock>
    </Modal>
  )
}
