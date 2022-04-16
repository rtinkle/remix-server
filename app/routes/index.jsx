import {
  Link,
  useTransition
} from "@remix-run/react"

export const meta = () => {
  return {
    title: 'Remix',
    description:
      'Home route',
  }
}

export default function Index() {
  const transition = useTransition()
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <h6>Transition State: {transition.state}</h6>
      <h6>Transition Type: {transition.state}</h6>

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
      </ul>
    </div>
  )
}
