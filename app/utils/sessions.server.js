//import { createCookieSessionStorage, json } from "remix" //rtt
import { createCookieSessionStorage } from "@remix-run/cloudflare" // rtt
import { json } from "@remix-run/cloudflare" // rtt

//import { json } from "~/utils/httpJsonHelper" // rtt

import { createSupabaseClient } from '~/utils/db' // rtt

//import { supabase } from "./supabase"; //rtt

///let sessionSecret = process.env.SESSION_SECRET; //rtt
const sessionSecret = "technicaldebt" // rtt
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

//TODO: Get these options from env
let storage = createCookieSessionStorage({
  cookie: {
    name: "APP_SESSION",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 1,
    httpOnly: true,
  },
});

/**
 * Create a cookie with that stores the provided `accessToken`
 * @param accessToken The user's JWT, stored in the user's session
 * @returns Response that sets cookie
 */
export async function createUserSession(accessToken) {
  // Get/create a cookie from the cookie store
  let session = await storage.getSession()

  //Set the accessToken property in the cookie
  session.set("accessToken", accessToken)

  // Return the response that sets the cookie in the client
  return json(null, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  })
}

/**
 * Gets a session cookie from the passed in request
 */
export function getUserSession(request) {
  return storage.getSession(request.headers.get("Cookie"))
}

/**
 * Takes the JWT stored in the passed in session cookie and then fetches and returns the
 * appropriate user details via the supabase api if token is valid, or null otherwise.
 * @returns User for which accessToken is provided
 */
export async function getLoggedInUser(request, context) { //rtt
  let session = await getUserSession(request)
  let supabase = createSupabaseClient(context) //rtt

  let accessToken = session.get("accessToken")
  if (!accessToken || typeof accessToken !== "string") return null
  const { user } = await supabase.auth.api.getUser(accessToken)
  return user
}

/** Destroy the session cookie  */
export async function clearCookie(request) {
  let session = await storage.getSession(request.headers.get("Cookie"));
  return json("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}