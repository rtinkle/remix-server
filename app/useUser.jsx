import {
  createContext,
  useContext,
  useEffect,
  useState,
  //useRef,
  useMemo,
} from "react"

import { useFetcher,
} from "@remix-run/react"

import { fetchSessionCookie } from "~/utils/fetchSessionCookie"
import { createSupabaseClient } from '~/utils/db' // rtt

const UserContext = createContext()

/**
 * This context provides user/session details.
 * It handles auth state changes and sets a cookie for server-side rendering (SSR) when session changes.
 */
export const UserContextProvider = (props) => {
  //const missingUserIdMsg = useRef('User Id not found on client')
  const [session, setSession] = useState()
  const [user, setUser] = useState()
  const fetcher = useFetcher()
  const supabase = useMemo(() => createSupabaseClient(props.cloudfareContext), [props.cloudfareContext])
//const supabase = createSupabaseClient(cloudfareContext)

  const supaSignIn = async () => {
    const { user, session, error } = await supabase.auth.signIn({
      provider: 'google',
    },
    //{
    ///  //redirectTo: 'http://localhost:8788/'
    //  redirectTo: './'
    ///}
    )
  }

  const supaSignOut = async () => {
    console.log('in supaSignOut - start')
    const session = supabase.auth.session()
    fetchSessionCookie(fetcher, "SIGNED_OUT", session)

    const  { error } = await supabase.auth.signOut()
    // explicitly setting user to null because onAuthStateChange not firing 
    // for correctly for SIGNED_OUT event.
    setUser(null)
    console.log('supabase.auth.signOut - error', error)
    console.log('in supaSignOut - finish')
    // calling reload because supabase onauthchange is not firing on
    // .signOut which means user from UserContext is not cleared. 
    //window.location.reload()
    //navigate("/")
    //navigate(".", { replace: true })

  }


/*
  const fetchSessionCookie = (
    event,
    session
  ) => {
    //We only want to create or destroy cookie when session exists and sign in/sign out occurs
    if (event === "SIGNED_IN" || event === "SIGNED_OUT")
      fetcher.submit(
        { event, session: JSON.stringify(session) },
        { action: "/auth", method: "post" }
      )
  }
*/

  useEffect(() => {

    // mount auth state listner changes to update session/auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('in useUser onAuthStateChange - event', event)
        let evt
        setSession(session)
        setUser(session?.user ?? null)
        if (!session.user) {
          evt = "SIGNED_OUT"
        } else {
          evt = event
        }
        fetchSessionCookie(fetcher, evt, session)
      }
    )

    return () => {
      console.log('in useUser useEffect onAuthStateChange.unsubscribe')
      authListener?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // On initial load, recover session from local storage and store in state
    const session = supabase.auth.session()
    console.log('in useUser initialization useEffect - supabase.auth.session().user', session?.user)

    setSession(session)
    setUser(session?.user ?? null)

    // If session exists by now, set a cookie when app is reloaded, in case session was expired while app wasn't open
    // because session recovering/refreshing now happens on supabase constructor, before any onAuthStateChange events are emitted.
    if (session && session.user) fetchSessionCookie(fetcher, "SIGNED_IN", session)
  }, [])
  
  const value = { user, serverUser: props.serverUser, session, supabase, supaSignIn, supaSignOut }
  return <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
}

/**
 * Gets user/session details stored in UserContext
 */
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`)
  }
  return context
}