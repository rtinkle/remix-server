export const json = (obj) => new Response(JSON.stringify(obj), {
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
})