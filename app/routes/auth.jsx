import { createUserSession, clearCookie } from "~/utils/sessions.server"
import {createSupabaseClient} from '~/utils/db'

/** Takes in an AuthChangeEvent and a supabase user session,
 * If auth change event is `SIGNED_IN`, store the session's JWT in a cookie,
 * if it is `SIGNED_OUT`, destroy the session cookie.
 */
export const action = async ({ request, context }) => {
  const supabase = createSupabaseClient(context) 
  //console.log('supabase', supabase)
  const formData = await request.formData()
  const authEvent = formData.get("event")
  const formSession = formData.get("session")

  if (typeof formSession === "string") {
    const session = JSON.parse(formSession)
    if (authEvent === "SIGNED_IN") {
      // populate session cookie and send header-only response
      return createUserSession(session.access_token)
    }
    if (authEvent === "SIGNED_OUT") {
      // send header-only response to clear cookie
      return clearCookie(request)
    }
  }
}