import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the search doesn't exits</p>
      <Link to="/">Go Back to Home</Link>
    </div>
  )
}
