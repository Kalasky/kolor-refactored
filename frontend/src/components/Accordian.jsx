import React, { useState } from 'react'
import '../index.scss'

const Accordion = () => {
  const [activeAccordion, setActiveAccordion] = useState(null)

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id)
  }

  const features = [
    {
      id: 1,
      title: 'Integration with Twitch and Discord',
      content:
        'Kolor is a bot designed to seamlessly integrate with both Twitch and Discord, enhancing the experience for streamers and their viewers.',
    },
    {
      id: 2,
      title: 'Customizable Color Roles',
      content:
        'Admins can add their own color roles or choose to use the default color pack, offering more personalization for the streamer and their community.',
    },
    {
      id: 3,
      title: 'Tiered Color System',
      content:
        'The tiered color system consists of three levels: very slight colors, slight colors, and full colors. Viewers must collect all very slight colors before they can trade them in for a slight color. To obtain another slight color, they must trade in all their slight colors and repeat the process. Once a viewer has collected all slight colors, they can trade them in for a full color. This cycle continues, promoting engagement and rewarding viewer loyalty.',
    },
    {
      id: 4,
      title: 'Automatic Color Detection',
      content:
        'Kolor automatically detects when a user has collected all colors within a given category, making it easy for streamers and viewers to track progress.',
    },
    {
      id: 5,
      title: 'Engaging and Interactive',
      content:
        'The color tier system promotes interaction and adds an extra layer of fun for viewers, encouraging them to stay engaged with the streamer and their community.',
    },
  ]

  return (
    <div className="accordion">
      {features.map((feature) => (
        <div key={feature.id} className="accordion-item">
          <button
            id={`accordion-button-${feature.id}`}
            aria-expanded={activeAccordion === feature.id}
            onClick={() => toggleAccordion(feature.id)}
          >
            <span className="accordion-title">{feature.title}</span>
            <span className="icon" aria-hidden="true"></span>
          </button>
          {activeAccordion === feature.id && (
            <div className={`accordion-content${activeAccordion === feature.id ? ' open' : ''}`}>
              <p className="text-white text-sm">{feature.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Accordion
