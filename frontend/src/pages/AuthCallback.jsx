import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    console.log('code', code)

    if (code) {
      fetch(`https://www.frosky.org/api/twitch/callback?code=${code}`)
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

export default AuthCallback
