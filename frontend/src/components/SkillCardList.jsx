import React from 'react'
import SkillCard from './SkillCard'
import { skillCards } from '../data/data'

const SkillCardList = () => {
  return (
    <div className="card-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skillCards.map((card) => (
        <SkillCard
          key={card.id}
          title={card.title}
          description={card.description}
          labelIcon={card.labelIcon}
          labelIconColor={card.labelIconColor}
        />
      ))}
    </div>
  )
}

export default SkillCardList
