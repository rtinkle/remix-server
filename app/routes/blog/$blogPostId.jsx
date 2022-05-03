import * as React from 'react'

import {
  useLoaderData,
  useCatch,
} from '@remix-run/react'


import { useNavigate } from 'react-router-dom'
import { json } from "@remix-run/cloudflare"

export const meta = () => {
  return {
    title: 'Blog Post',
    description:
      'Blog Post',
  }
}

export async function loader({ request, params }) {
  try {

    //throw new Error('loader badness happened'); // handled by ErrorBoundary
    //throw new Response("Not Found", {status: 404}); /// handled by CatchBoundary
    //const {blogPostId} = useParams()
    console.log('in $blogPostId - params.blogPostId', params.blogPostId);
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${params.blogPostId}`
    );
    return json(await res.json())
  } catch (err) {
    console.error(err)
    throw err
  }
}
/*
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
*/
/*
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
*/
export default function Index() {
  const genRenderError = false;
  const blogPost = useLoaderData();
  const [pageErrors, setPageErrors] = React.useState([])
  const triggerError = () =>
    setPageErrors((prev) => [...prev, 'Page badness occurred'])
  const navigate = useNavigate()

  if (genRenderError) {
    throw new Error('Rendering badness')
  }
  return (
    <>
      <h1>My Blog Post</h1>
      <br />
      {/*<input
        type="button"
        onClick={(e)=>{history.back()}}
        value="Back"
      />*/}
      {<input
        type="button"
        onClick={()=>navigate(-1)}
        value="Back"
      />}

      <br />
      <div>
        <button type="button" onClick={triggerError}>
          Trigger Error
        </button>
      </div>
      {pageErrors.length > 0 &&
        pageErrors.map((err, i) => <li key={i}>{err}</li>)}

      {pageErrors.length === 0 && (
        <p>
          {blogPost.id} - {blogPost.title}
        </p>
      )}
    </>
  )
}
