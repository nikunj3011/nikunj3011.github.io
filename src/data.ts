export interface Experience {
  company: string;
  period: string;
  location: string;
  highlights: string[];
  technologies: string[];
}
export const experience: Experience[] = [
  {
    company: 'Vinvox',
    period: 'Jan 2025 — Present',
    location: 'Canada',
    highlights: [
      'Designed .NET Core microservices to aggregate vehicle data across automotive manufacturers for fraud detection and diagnostics.',
      'Upgraded a Kotlin Android application for odometer tampering and vehicle fraud detection, launched across local dealerships.',
      'Engineered a Python / PyQt Windows application to interface with Maxisys diagnostic hardware and enable direct-to-vehicle communication.',
      'Integrated third-party APIs into a Flask backend, delivering real-time vehicle insights, scan histories, and diagnostic reports in Vue.js.',
      'Built CI/CD pipelines with Docker and Azure DevOps to streamline deployments and reduce release cycles.',
    ],
    technologies: ['C#', '.NET Core', 'Kotlin', 'Python', 'Vue.js', 'SQL', 'Azure DevOps'],
  },
  {
    company: 'Ditech Testing',
    period: 'Mar 2021 — Jan 2025',
    location: 'Canada',
    highlights: [
      'Led ERP and data integrations across production, finance, sales, and logistics using microservices.',
      'Integrated Jira, Fuel, and Samsara Logistics APIs to surface operational information on the web.',
      'Created service brokers for real-time broadcast messages and emails on database updates.',
      'Developed test plans and test cases, collaborating with developers to debug issues and improve software quality.',
      'Deployed cloud applications with CI/CD, Docker, and Kubernetes, and integrated Galiso hardware and VTScada production data.',
    ],
    technologies: ['C#', 'Python', 'SQL', 'JavaScript', 'React', 'Docker', 'Kubernetes'],
  },
];
interface Project {
  name: string;
  category: string;
  description: string;
  tags: string[];
  source: string;
  live: string | null;
  liveLabel?: string;
}
export const projects: Project[] = [
  {
    name: 'Clash Royale Stickers',
    category: 'Android · Google Play',
    description:
      'An Android sticker app for sharing Clash Royale sticker packs in WhatsApp. Explore the source code or get the app on Google Play.',
    tags: ['Java', 'Android', 'WhatsApp', 'Stickers'],
    source: 'https://github.com/nikunj3011/CR-Stickers',
    live: 'https://play.google.com/store/apps/details?id=com.nikunj.ClashRoyaleStickers',
    liveLabel: 'Google Play',
  },
  {
    name: 'GameLibrary',
    category: 'APIs & cloud infrastructure',
    description:
      'A .NET application with separate API, data access, entity, and SignalR projects. Includes automated tests, load-testing assets, Docker packaging, Kubernetes manifests, and Terraform infrastructure.',
    tags: ['.NET', 'Entity Framework', 'SignalR', 'Docker', 'Kubernetes', 'Terraform'],
    source: 'https://github.com/nikunj3011/GameLibrary-netCore',
    live: null,
  },
  {
    name: 'Wuthering Waves Guide',
    category: 'Web development',
    description:
      'A professional game guide built with React and JSON data storage. Published on GitHub Pages with Cloudflare for security, monitoring, and caching optimization.',
    tags: ['React', 'JSON', 'GitHub Pages', 'Cloudflare'],
    source: 'https://github.com/nikunj3011/Wuthering.Waves.React',
    live: null,
  },
  {
    name: 'ZZZ Guide',
    category: 'Native Android development',
    description:
      'An Android game guide published on Google Play. Built with clean MVVM architecture, API-to-Room data synchronization, and native Android animations.',
    tags: ['Kotlin', 'Android', 'MVVM', 'Room'],
    source: 'https://github.com/nikunj3011/ZZZ-Guide-Android',
    live: null,
  },
  {
    name: 'Physics Playground',
    category: 'Interactive TypeScript',
    description:
      'A canvas-based game prototype with keyboard movement, jumping, enemy collisions, goal detection, and a restart loop. Organized into reusable player, actor, enemy, and level classes.',
    tags: ['TypeScript', 'Canvas', 'Game loop', 'Collision detection'],
    source: 'https://github.com/nikunj3011/Physics-Engine-TS',
    live: null,
  },
  {
    name: 'Evolved DNA Privacy Center',
    category: 'React & TypeScript',
    description:
      'A shared privacy-policy website for a collection of Android apps. Uses app-driven route configuration, reusable policy pages, and automated GitHub Pages deployment.',
    tags: ['React', 'TypeScript', 'Vite', 'React Router', 'GitHub Actions'],
    source: 'https://github.com/nikunj3011/Google-Play-Policy',
    live: null,
  },
];
export const skills: Record<string, string[]> = {
  'Languages & platforms': [
    'C#',
    'Python',
    'Kotlin',
    'JavaScript',
    'Java',
    'C++',
    'VB.NET',
    'Linux',
  ],
  'Application development': [
    'ASP.NET Core',
    'React',
    'Vue.js',
    'Blazor',
    'Flask',
    'Android',
    'Entity Framework',
    'SignalR',
    'REST',
    'SOAP',
    'SQL Server',
    'MySQL',
  ],
  'Cloud & delivery': [
    'Azure',
    'Docker',
    'Kubernetes',
    'Terraform',
    'Ansible',
    'Azure DevOps',
    'GitHub',
    'Git',
    'RabbitMQ',
    'gRPC',
  ],
  'Quality & observability': [
    'xUnit',
    'k6',
    'Selenium',
    'Postman',
    'TDD',
    'OpenTelemetry',
    'Grafana',
    'Zipkin',
    'Seq',
    'Agile / Scrum',
  ],
};
export const education = [
  {
    title: 'IT: Software Development',
    school: 'New Brunswick Community College',
    period: 'Sep 2019 — Jun 2021',
    location: 'Canada',
  },
  {
    title: 'B.Tech in Information Technology',
    school: 'Charotar University of Science and Technology',
    period: 'Sep 2015 — Apr 2019',
    location: 'Changa, Gujarat, India',
  },
];
export const certifications = [
  'Clean Architecture',
  'Certified Kubernetes Administrator (CKA)',
  'Certified Kubernetes Application Developer (CKAD)',
  'Azure DevOps',
  'IBM Data Science Specialization',
  'Machine Learning — Andrew Ng',
];

export const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/nikunj3011' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/nikunj3011/' },
  { name: 'Behance', url: 'https://www.behance.net/nikunj3011' },
];

export const earlierProjects = [
  {
    name: 'REST API with ASP.NET MVC',
    type: 'API development',
    url: 'https://github.com/nikunj3011/REST-API-asp.Net-MVC',
  },
  {
    name: 'Rick and Morty Quiz',
    type: 'Android',
    url: 'https://github.com/nikunj3011/RickAndMortyQuiz-Android',
  },
  {
    name: 'Qt Projects',
    type: 'Desktop applications',
    url: 'https://github.com/nikunj3011/Qt-projects',
  },
  { name: 'Java EE Project', type: 'Java', url: 'https://github.com/nikunj3011/JavaEEProject' },
  { name: 'Education Game', type: 'Web game', url: 'https://nikunj3011.github.io/EducationGame/' },
  {
    name: 'Responsive Website',
    type: 'Web design',
    url: 'https://nikunj3011.github.io/responsiveproject/',
  },
];
