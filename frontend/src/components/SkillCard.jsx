import React from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SkillCard = ({ title, description, labelIcon, labelIconColor }) => {
  const backgroundColor = 'rgb(17,34,64)'
  return (
    <motion.div
      className="p-6 rounded-lg shadow-lg m-4"
      style={{ backgroundColor: backgroundColor }}
      whileHover={{ scale: 1.04 }}
    >
      <div className="text-left text-4xl mb-5">
        <FontAwesomeIcon icon={labelIcon} className={`${labelIconColor}`} />
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )
}

export default SkillCard
