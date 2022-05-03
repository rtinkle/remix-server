import { UserContextProvider } from "~/useUser";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useCatch
} from "@remix-run/react";

import { getLoggedInUser } from "~/utils/sessions.server"
import { json } from "@remix-run/cloudflare"

export const meta = () => ({
  charset: "utf-8",
  title: "Remix App",
  viewport: "width=device-width,initial-scale=1",
})

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
  let message
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      )
      break

    default:
      throw new Error(caught.data || caught.statusText)
  }
  return (
    <>
      <h1>Response Catch Boundary</h1>
      {message}
      {caught.status}
    </>
  )
}

export async function loader({ request, context }) {
  console.log('root - context', context)

  try {
    const serverUser = await getLoggedInUser(request, context)
    return json({serverUser, cloudfareContext: context})
  } catch (err) {
    console.error(err)
    throw err
  }
}

export default function App() {
  // cloudfareContext contains cloudflare pages context which includes supabase related environment
  // variables returned from root.tsx loader
  const { serverUser, cloudfareContext } = useLoaderData()

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <UserContextProvider cloudfareContext={cloudfareContext} serverUser={serverUser}>
          <Outlet />
        </UserContextProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
