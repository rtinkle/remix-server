import * as React from 'react'
import {
  Link, 
  useLoaderData,
  useCatch,
  useTransition
} from '@remix-run/react'
//import { json } from '@remix-run/cloudflare-pages'
// for some reason, helper not found in cloudflare-pages service adapter, so created
// project version in /utils/httpJsonHelper.js
/// see https://remix.run/docs/en/v1.4.0-pre.0/other-api/adapter
//import { json } from '~/utils/httpJsonHelper'
// update: resolved missing import issue based on this github issue comment https://github.com/remix-run/remix/issues/2503#issuecomment-1080208290

import { json } from "@remix-run/cloudflare"

// createSupabaseClient is wrapper for createClient from @supabase/supabase-js
// that allows database related environment variables to be passed in via context object
import { createSupabaseClient } from '~/utils/db'

export const meta = () => {
  return {
    title: 'Blog',
    description:
      'blog, blog, bloggity, blog',
  }
}

export async function loader({ request, context }) {
  console.log('context', context)

  try {
    const supabase = createSupabaseClient(context) 
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .limit(5)

    if (error) {
      console.log('Supabase Posts error', error)
      throw new Response('Database Error: ' + error.message, { status: 500 })
    }

    console.log('Posts data', data)
    
    //throw new Error('loader badness happened'); // handled by ErrorBoundary
    //throw new Response("Not Found", {status: 404}); /// handled by CatchBoundary

    //const res = await fetch('https://jsonplaceholder.typicode.com/posts')
    //return json(await res.json())
    const reqHeaders = new Headers()
    reqHeaders.append('Cache-Control', 'private, max-age=0, must-revalidate')

    const req = new Request('https://jsonplaceholder.typicode.com/posts', {
      method: 'GET',
      headers: reqHeaders,
    })
    console.log('Request Header Cache-Control', reqHeaders.get('Cache-Control'))
    let result = {}
    const res = await fetch(req)
    result.jsonPosts = await res.json()
    result.supabasePosts = data
    //return json(await res.json())
    return json(result)

  } catch (err) {
    console.error(err)
    throw err
  }
}
export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Error Boundary</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  )
}

export function CatchBoundary() {
  let caught = useCatch()
  console.log('in CatchBoundary - caught', caught)
  console.log('in CatchBoundary - caught.data.message', caught.data)
  let message
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      )
      break
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break
    case 500:
      message = (
        <>
          <p>Internal Server Error</p>
          <p>{caught.data}</p>
        </>
      )
      break
  
    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <>
      <h1>Response Catch Boundary</h1>
      {message}
      Status: {caught.status}
    </>
  )
}

export default function Index() {
  const genRenderError = false
  const posts = useLoaderData().jsonPosts
  const supabasePosts = useLoaderData().supabasePosts

  const [pageErrors, setPageErrors] = React.useState([]);
  const triggerError = () =>
    setPageErrors((prev) => [...prev, 'Page badness occurred'])

  if (genRenderError) {
    throw new Error('Rendering badness')
  }
  const transition = useTransition()

  return (
    <>
      <h1>My Blog</h1>
      <h6>Transition State: {transition.state}</h6>
      <h6>Transition Type: {transition.state}</h6>
      <h6>Supabase Data: {JSON.stringify(supabasePosts)}</h6>
      <br />
      <div><Link to="..">BACK</Link></div>
      <button type="button" onClick={triggerError}>
        Trigger Error
      </button>
      {pageErrors.length > 0 &&
        pageErrors.map((err, i) => <li key={i}>{err}</li>)}
      {pageErrors.length === 0 && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <div>
                <Link to={`./${post.id}`}>
                  {post.id} - {post.title}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
