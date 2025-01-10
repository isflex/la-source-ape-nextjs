import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { PageAppProps, PageStaticData } from '@root/types/additional'
import dynamic from 'next/dynamic'
import { observer } from 'mobx-react-lite'

import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@amplify/data/resource'
import classNames from 'classnames'
// import { default as flexStyles } from '@src/styles/scss/global/flex.module.scss'
import { default as stylesPage } from '@src/styles/scss/pages/todo.module.scss'

const client = generateClient<Schema>()

import {
  Button,
  ButtonMarkup,
  Link,
  Text,
  Title,
  TitleLevel,
  VariantState,
  flexStyles
} from '@flex-design-system/react-ts/client-sync-styled-default'
// import { default as flexStyles } from '@flex-design-system/framework'
// import { default as flexStyles } from '@src/styles/scss/flex/all.module.scss'

const LogoAPE = dynamic(() => import('@src/components/logo-ape-la-source'), { ssr: true })

const TodoPage: NextPage<PageAppProps> = observer((
  props
) => {
  const [todos, setTodos] = React.useState<Array<Schema['Todo']['type']>>([])

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    })
  }

 React.useEffect(() => {
    listTodos()
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
    <div className={stylesPage.todoApp}>
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
      <main>
        <Title level={TitleLevel.LEVEL2} className={flexStyles.hasTextWhite}>
          My Todos
        </Title>
        <Button onClick={createTodo}
          id={'createTodo'}
          variant={VariantState.PRIMARY}
          markup={ButtonMarkup.BUTTON}>Créer une nouvelle tâche</Button>
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
          <Link href='https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/'>
            Suivez les prochains étapes de cet tutoriel
          </Link>
        </div>
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
