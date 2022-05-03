import * as React from 'react'
import {
  Link, 
  useLoaderData,
  useCatch,
  useTransition
} from '@remix-run/react'
import { json } from '~/utils/httpJsonHelper'

// createSupabaseClient is wrapper for createClient from @supabase/supabase-js
// that allows database related environment variables to be passed in via context object
import { createSupabaseClient } from '~/utils/db'

export const meta = () => {
  return {
    title: 'Dashboard',
    description:
      'User Dashboard',
  }
}

export async function loader({ request, context }) {
  console.log('context', context)

  try {
    const result = {}
    result.SUPABASE_URL = context.SUPABASE_URL
    result.SUPABASE_ANON_KEY = context.SUPABASE_ANON_KEY
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
  // get environment variables
  const context = useLoaderData()
  console.log('user-dashboard loader - context', context)
  // context is environment variables returned from loader

  const supabase = createSupabaseClient(context)

  const [pageErrors, setPageErrors] = React.useState([])

  const transition = useTransition()

  const [user, setUser] = React.useState()

  return (
    <>
      <h1>My Dashboard</h1>
      <h6>Transition State: {transition.state}</h6>
      <h6>Transition Type: {transition.state}</h6>
      <h6>Supabase User: {JSON.stringify(user)}</h6>
      <br />
      <div><Link to="..">BACK</Link></div>
    </>
  )
}
