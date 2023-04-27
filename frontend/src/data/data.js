import { faSpotify, faReact } from '@fortawesome/free-brands-svg-icons'
import { faPaintBrush, faCode, faWandMagicSparkles, faGear } from '@fortawesome/free-solid-svg-icons'

const skillCards = [
  {
    id: 1,
    title: 'Languages & Technologies',
    description: 'Experienced with JavaScript, Express, Node.js, MongoDB, Git, and Heroku.',
    labelIcon: faCode,
    labelIconColor: 'text-red-600',
  },
  {
    id: 2,
    title: 'Frontend Development',
    description: 'Over 4 years of development experience in React, HTML, CSS, Tailwindcss, and Bootstrap.',
    labelIcon: faWandMagicSparkles,
    labelIconColor: 'text-pink-500',
  },
  {
    id: 3,
    title: 'API Development',
    description:
      'Passionate about creating interactive and creative applications. Extensive experience in building and maintaining RESTful APIs: Twitch, Spotify, Discord, Square, and more.',
    labelIcon: faGear,
    labelIconColor: 'text-orange-500',
  },
]

const projectCards = [
  {
    id: 1,
    title: 'Spotifly',
    description: 'A clone of the Twitch.tv website. Built with React, Tailwindcss, and Twitch API.',
    link: 'https://github.com/Kalasky/spotifly#readme',
    github: 'link',
    technologies: ['MongoDB', 'Express.js', 'Twitch API', 'Spotify API', 'Discord API'],
    labelIcon: faSpotify,
    labelIconColor: 'text-lime-400',
    viewLink: '/spotifly',
  },
  {
    id: 2,
    title: 'Pogo Guide',
    description: 'A clone of the Twitch.tv website. Built with React, Tailwindcss, and Twitch API.',
    link: 'https://twitch-clone-psi.vercel.app/',
    github: 'link',
    technologies: ['React', 'MongoDB', 'Tailwindcss', 'Express.js', 'JWT'],
    labelIcon: faReact,
    labelIconColor: 'text-violet-500',
    viewLink: '/pogo',
  },
  {
    id: 3,
    title: 'Kolor',
    description: 'A clone of the Twitch.tv website. Built with React, Tailwindcss, and Twitch API.',
    link: 'https://twitch-clone-psi.vercel.app/',
    github: 'link',
    technologies: ['MongoDB', 'Node.js', 'Twitch API', 'Discord API'],
    labelIcon: faPaintBrush,
    labelIconColor: 'text-yellow-400',
    viewLink: '/kolor',
  },
]

export { skillCards, projectCards }
