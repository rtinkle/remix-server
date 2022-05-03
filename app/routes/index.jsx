import { useUser } from "~/useUser"
//import { createSupabaseClient } from '~/utils/db'
//import { getLoggedInUser } from "~/utils/sessions.server"
//import { useFetcher,
//} from "@remix-run/react"
//import { fetchSessionCookie } from "~/utils/fetchSessionCookie"

import {
  Link,
//  useTransition,
  useLoaderData,
  useNavigate,
} from "@remix-run/react"

export const meta = () => {
  return {
    title: 'Remix',
    description:
      'Home route',
  }
}
/*
export const loader = async ({ request, context }) => {
  const user = await getLoggedInUser(request, context)
  let result = {}
  result.serverUser = user
  //result.context = context
  return result
}
*/
export default function Index() {
  //const navigate = useNavigate()
  //const transition = useTransition()
  const { user, serverUser, supabase, supaSignIn, supaSignOut } = useUser()
  //console.log('in index.jsx - supabase from useUser', supabase)
  console.log('in top level index.jsx - user', user)

  //const { serverUser } = useLoaderData()
  const serverUserId = serverUser?.id
  // check for inconsistent auth state
  // if (serverUserId !== user?.id) supaSignOut()
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <h6>{/* Transition State: {transition.state} */}</h6>
      <h6>{/* Transition Type: {transition.state} */}</h6>
      <div>

        <p>Your user id from client is: {user?.id}</p>

        {/*userId && <p>Your user from server is: {userId}</p>*/}
        <p>Your user from server is: {serverUserId}</p>

        {user && <button onClick={supaSignOut}>Sign Out</button>}

        {!user && (
          <p>
            You're not signed in yet, go <Link to="signup">sign up</Link> or{" "}
            {/*<Link to="login">log in</Link>*/}
            <button type="button" onClick={supaSignIn}>Sign In</button>
          </p>
        )}
      </div>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
        <li>
          <Link to="./blog">Blog</Link>
        </li>
        <li>
          <Link to="./user-dashboard">User Dashboard</Link>
        </li>

      </ul>
    </div>
  )
}
