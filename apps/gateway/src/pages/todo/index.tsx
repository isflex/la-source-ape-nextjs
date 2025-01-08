import React from 'react'
import type { NextPage, GetServerSideProps } from 'next'
import { PageAppProps, PageStaticData } from '@root/types/additional'
// import dynamic from 'next/dynamic'
import { observer } from 'mobx-react-lite'

import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@amplify/data/resource'
import styles from '@src/styles/scss/todo.module.scss'

const client = generateClient<Schema>()

import { Text, Title, View } from '@flex-design-system/react-ts/client-sync-styled-default'
import { default as stylesFlex, type Styles } from '@flex-design-system/framework'

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
    <div className={styles.todoApp}>
      {/* <FlexComponents /> */}
      <main>
        {/* <h1>My todos</h1> */}
        <Title>My todos</Title>
        <button onClick={createTodo}>+ new</button>
        <ul>
          {todos.map((todo) => (
            <li onClick={() => deleteTodo(todo.id)}
              key={todo.id}>
              {todo.content}
            </li>
          ))}
        </ul>
        <div>
          🥳 App successfully hosted. Try creating a new todo.
          <br />
          <a href='https://docs.amplify.aws/gen2/start/quickstart/nextjs-pages-router/'>
            Review next steps of this tutorial.
          </a>
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
