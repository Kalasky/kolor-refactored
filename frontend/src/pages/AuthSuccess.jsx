import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TwitchCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (code) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/api/twitch/callback?code=${code}`)
        .then((response) => {
          if (response.ok) {
            navigate('/auth/success')
          } else {
            return response.json().then((data) => {
              throw new Error(data.error)
            })
          }
        })
        .catch((err) => {
          console.error(err)
          navigate('/auth-error')
        })
    }
  }, [navigate])

  return <div>Logging in...</div>
}

export default TwitchCallback
