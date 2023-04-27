import React from 'react'
import '../index.scss'

// components
import SkillCardList from './SkillCardList'

const Skills = () => {
  return (
    <div className="mt-80">
      <h2 className="mt-4 font-semibold text-gray-100 sm:text-2xl text-center" style={{ fontSize: '5rem', marginBottom: '2.5rem' }}>
        Skills
      </h2>
      <SkillCardList />
    </div>
  )
}

export default Skills
