import * as React from 'react';
import { Link, useLoaderData, useCatch } from '@remix-run/react'
//import { json } from '@remix-run/cloudflare-pages'
// for some reason, helper not found in cloudflare-pages service adapter, so created
// project version in /utils/httpJsonHelper.js
/// see https://remix.run/docs/en/v1.4.0-pre.0/other-api/adapter
import { json } from '../../utils/httpJsonHelper'


export const meta = () => {
  return {
    title: 'Blog',
    description:
      'blog, blog, bloggity, blog',
  }
}
/*
function json (obj) {
   // Instead of this:
   return new Response(JSON.stringify(obj), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  })
}
*/
export async function loader({ request }) {
  try {

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
    const res = await fetch(req)
    return json(await res.json())

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
  );
}
export function CatchBoundary() {
  let caught = useCatch();
  console.log('in CatchBoundary - caught', caught);
  let message;
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
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <>
      <h1>Response Catch Boundary</h1>
      {message}
      {caught.status}
    </>
  );
}

export default function Index() {
  const genRenderError = false;
  const posts = useLoaderData();
  const [pageErrors, setPageErrors] = React.useState([]);
  const triggerError = () =>
    setPageErrors((prev) => [...prev, 'Page badness occurred']);

  if (genRenderError) {
    ///throw new Error('Rendering badness')
  }
  return (
    <>
      <h1>My Blog</h1>
      <br />
      <div><Link to="..">BACK</Link></div>
      <button type="button" onClick={triggerError}>
        Trigger Error
      </button>
      {pageErrors.length > 0 &&
        pageErrors.map((err, i) => <li key={i}>{err}</li>)}
      {pageErrors.length === 0 && (
        <ul>
          {/* 
              <li key={post.id}>
                <Link to={"./" + post.id}>{post.id} - {post.title}</Link>
              </li>
              */}

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
