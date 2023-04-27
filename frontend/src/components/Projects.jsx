import React from 'react'
import '../index.scss'

// components
import ProjectCardList from './ProjectCardList'

const Projects = () => {
  return (
    <div className="mt-48">
      <h2 className="mt-4 font-semibold text-gray-100 sm:text-2xl text-center" style={{ fontSize: '5rem', marginBottom: '2.5rem' }}>
        Projects
      </h2>
      <ProjectCardList />
    </div>
  )
}

export default Projects
