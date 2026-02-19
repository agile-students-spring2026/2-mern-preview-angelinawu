import React, { useEffect, useState } from 'react'
import './About.css'

const About = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const base = process.env.REACT_APP_SERVER_HOSTNAME || ''
    fetch(`${base}/api/about`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="About-loading">Loading...</div>
  if (error) return <div className="About-error">Error: {error}</div>

  return (
    <div className="About-container">
      <h1>{data.title}</h1>
      <div className="About-content">
        <img
          className="About-photo"
          src={data.imageUrl && data.imageUrl.startsWith('http') ? data.imageUrl : `${process.env.REACT_APP_SERVER_HOSTNAME}${data.imageUrl}`}
          alt="About"
        />
        <div className="About-text">
          {data.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default About
