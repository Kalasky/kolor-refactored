import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  return (
    <footer className="bg-slate-900 p-4 text-gray-400">
      <p className='m-auto text-center mb-5'>Designed and Built by Robert Kalasky</p>
      <div className="flex justify-center items-center space-x-4">
        <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="text-white hover:text-indigo-500">
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
        <a href="mailto:youremail@example.com" className="text-gray-400 hover:text-indigo-500">
          kalaskyr@gmail.com
        </a>
        <a
          href="https://linkedin.com/in/yourusername"
          target="_blank"
          rel="noreferrer"
          className="text-white hover:text-indigo-500"
        >
          <FontAwesomeIcon icon={faLinkedin} size="2x" />
        </a>
      </div>
    </footer>
  )
}

export default Footer
