import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PageAppProps, PageStaticData } from '@root/types/additional'
import dynamic from 'next/dynamic'
import { observer } from 'mobx-react-lite'

import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@amplify/data/resource'
const client = generateClient<Schema>()

import classNames from 'classnames'
import {
  Button,
  ButtonMarkup,
  Link,
  Text,
  // TextLevel,
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
  // flexStyles
} from '@flex-design-system/react-ts/client-sync-styled-default'
// import { default as flexStyles } from '@flex-design-system/framework'
import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/todo.module.scss'

const LogoAPE = dynamic(() => import('@src/components/logo-ape'), { ssr: true })

const TodoPage: NextPage<PageAppProps> = observer((
  props
) => {
  const [todos, setTodos] = React.useState<Array<Schema['Todo']['type']>>([])
  const [hasError, setHasError] = React.useState<boolean>(false)
  const router = useRouter()

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    })
  }

 React.useEffect(() => {
    try {
      listTodos()
    } catch(err) {
      console.error(err)
      setHasError(true)
    }
  }, [])

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt('Todo content'),
    })
  }

  return (
    <div className={classNames(flexStyles.genericLayout1, stylesPage.todoApp)}>
      <div style={{
        height: 'auto',
        padding: '2rem 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          width: '100%',
        }}>
          <LogoAPE />
        </div>
      </div>
      <main className={stylesPage.hasCenteredContent}>
        {!hasError ? (
          <>
            <Title level={TitleLevel.LEVEL1} className={classNames(flexStyles.isCentered)} style={{ marginTop: '-1rem' }}>
              {`La liste à faire de l'APE`}
            </Title>
            <Text className={flexStyles.hasTextWhite}>
              {`Voici un mini exemple d'application "My Todos" que les élèves de la source pourront facilement créer eux-mêmes.`}
            </Text>
            <Text className={classNames(flexStyles.hasTextWhite, flexStyles.isItalic )}>
              {`L'idée est que ce site puisse être alimenter en contenu par qui que ce soit : élèves, parents et enseignants...`}
            </Text>
            <br/>
            <Button onClick={createTodo}
              id={'createTodo'}
              variant={VariantState.PRIMARY}
              markup={ButtonMarkup.BUTTON}>
                <span style={{ margin: '0 1rem'}}>
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
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text>🚀 Application hébergée avec succès.</Text>
              <Text>🥳 Essayez de créer une nouvelle tâche.</Text>
              <Link href='https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/' target='_blank'>
                Suivez les prochains étapes de cet tutoriel
              </Link>
            </div>
          </>
        ) : (
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
                  d'aide.
                </Title>
                <Image
                  src="/assets/img/qr-code-whatsapp.jpg"
                  width={100}
                  height={100}
                  alt="WhatsApp QR Code"
                />
              </InfoBlockContent>
              <InfoBlockAction>
                <Link href='https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/' target='_blank'>
                  Suivez les étapes de cet tutoriel
                </Link>
              </InfoBlockAction>
            </InfoBlock>
          </Modal>
        )}
      </main>
    </div>
  )
})

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  // console.log('Page Portfolio | getServerSideProps | context : ', context)
  const {
    params, // present for pages that use a dynamic route,
    req,
    res,
    query,
    preview,
    previewData,
    resolvedUrl,
    locales,
    locale,
    defaultLocale
  } = context

  const pageStaticData: PageStaticData = {
    pageName: `todo`,
  }

  const _nonce = req.headers?.['x-nonce'] || '---CSP-nonce---'

  return {
    props: {
      ...pageStaticData,
      _nonce: _nonce,
    }
  }
}

export default TodoPage
