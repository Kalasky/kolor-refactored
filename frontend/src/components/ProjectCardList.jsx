import React from 'react'
import ProjectCard from './ProjectCard'
import { projectCards } from '../data/data'

const ProjectCardList = () => {
  return (
    <div className="card-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projectCards.map((card) => (
        <ProjectCard
          key={card.id}
          title={card.title}
          description={card.description}
          technologies={card.technologies}
          labelIcon={card.labelIcon}
          labelIconColor={card.labelIconColor}
          viewLink={card.viewLink}
        />
      ))}
    </div>
  )
}

export default ProjectCardList
