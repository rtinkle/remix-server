  
  export const fetchSessionCookie = (
    fetcher,
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
