import React from 'react';
import { motion } from 'framer-motion';
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import '../index.scss';

const ProjectCard = ({
  title,
  description,
  link,
  github,
  technologies,
  labelIcon,
  labelIconColor,
  viewLink,
}) => {
  const backgroundColor = 'rgb(17,34,64)';
  return (
    <motion.div
      className="p-6 rounded-lg shadow-lg m-4 flex flex-col" // Add flex and flex-col here
      style={{ backgroundColor: backgroundColor }}
      whileHover={{ scale: 1.04 }}
    >
      <div>
        <div className="flex justify-between mb-5">
          <div className="text-5xl">
            <a href={link} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={labelIcon} className={`${labelIconColor}`} />
            </a>
          </div>

          <div className="space-x-3 text-lg">
            <a href={github} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faGithubAlt} className="text-gray-400" />
            </a>
            <a href={link} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faExternalLink} className="text-gray-400" />
            </a>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-gray-300">{description}</p>

        <div className="mt-4 mb-5 text-gray-400 text-xs">
          <p>{technologies.join(', ')}</p>
        </div>
      </div>
      <div className="mt-auto"> {/* Add this wrapper div with mt-auto */}
        <Link to={viewLink}>
          <a className="effect effect-1" title="View">
            View Project
          </a>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
