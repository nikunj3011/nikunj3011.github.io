import { useEffect, useRef, useState } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { certifications, earlierProjects, education, experience, projects, skills, socialLinks } from './data';

const links = ['About', 'Experience', 'Projects', 'Skills', 'GitHub', 'Contact'];
const resume = '/Nikunj-Rathod-Resume.pdf';
function Tags({ items }: { items: string[] }) {
 return <ul className="tags" aria-label="Technologies">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}
export default function App() {
 const [menuOpen, setMenuOpen] = useState(false);
 const mainRef = useRef<HTMLElement>(null);

 useEffect(() => {
  if (!mainRef.current || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if (entry.isIntersecting) {
     entry.target.classList.add('revealed');
     observer.unobserve(entry.target);
    }
   });
  }, { threshold: 0.08 });
  const elements = mainRef.current.querySelectorAll('.section-heading, .about-layout > div, .experience-row, .project-card, .skill-group, .credentials-grid > div, .calendar-panel, .earlier-projects');
  elements.forEach(element => {
   element.classList.add('reveal');
   observer.observe(element);
  });
  return () => {
   observer.disconnect();
   elements.forEach(element => element.classList.remove('reveal', 'revealed'));
  };
 }, []);
 return <>
  <a className="skip-link" href="#main">Skip to content</a>
  <header className="site-header"><div className="nav-inner">
   <a className="wordmark" href="#home" aria-label="Nikunj Rathod home">nr<span>.</span></a>
   <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close ×' : 'Menu ☰'}</button>
   <nav id="navigation" className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Main navigation">
    {links.map(link => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{link}</a>)}
    <a className="nav-resume" href={resume} download>Resume ↗</a>
   </nav>
  </div></header>
  <main id="main" ref={mainRef}>
   <section id="home" className="hero"><div className="container hero-layout"><div>
    <p className="eyebrow"><span className="status-dot" /> SOFTWARE DEVELOPER · CANADA</p>
    <h1>Hi, I’m Nikunj.<br />I build software<br /><em>that connects.</em></h1>
    <p className="hero-description">From APIs and cloud infrastructure to web and mobile apps. I turn complex integrations into useful, reliable software.</p>
    <div className="actions"><a className="button primary" href="#projects">Explore my work ↗</a><a className="button subtle" href={resume} download>Download resume ↓</a></div>
    <div className="hero-links" aria-label="Social profiles">{socialLinks.map(link => <a key={link.name} href={link.url}>{link.name} ↗</a>)}</div>
   </div><div className="portrait-frame"><img src="/profile-pic.jpg" alt="Nikunj Rathod" width="104" height="104" /><div className="portrait-caption"><span>CURRENTLY BUILDING AT</span><strong>Vinvox <span aria-hidden="true">↗</span></strong></div></div></div>
   <div className="container hero-bottom"><span>.NET / REACT / PYTHON / ANDROID / AZURE</span><a href="#about">A little more about me ↓</a></div></section>
   <section id="about" className="section container about-layout"><div><p className="eyebrow section-label">01 / ABOUT</p><h2>Curiosity drives me.<br />Craft keeps me going.</h2></div><div className="about-copy"><p>I’m a software developer based in Canada, with 5 years of experience specializing in API frameworks, web technologies, and complex integrations.</p><p>At Vinvox, I work across .NET microservices, vehicle diagnostics, Android applications, and Python tools. Previously at Ditech Testing, I connected enterprise systems, production hardware, and cloud services to help teams work better.</p><p>I enjoy solving challenging problems, collaborating across disciplines, and learning the tools that a project needs.</p></div></section>
   <section id="experience" className="section section-tinted"><div className="container"><div className="section-heading"><div><p className="eyebrow section-label">02 / EXPERIENCE</p><h2>Where I’ve made an impact.</h2></div><span className="small-label">BUILDING SINCE 2021</span></div>
    {experience.map(job => <article className="experience-row" key={job.company}><div className="experience-meta"><p className="period">{job.period}</p><h3>{job.company}</h3><p>{job.location}</p></div><div><h4>Software Developer</h4><ul className="highlights">{job.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul><Tags items={job.technologies} /></div></article>)}
   </div></section>
   <section id="projects" className="section container"><div className="section-heading"><div><p className="eyebrow section-label">03 / SELECTED PROJECTS</p><h2>Ideas, put into practice.</h2></div><a className="text-link" href="https://github.com/nikunj3011">More on GitHub ↗</a></div>
    <div className="projects-grid">{projects.map((project, index) => <article className="project-card" key={project.name}><div className="project-top"><span>{project.category}</span><span>0{index + 1}</span></div><h3>{project.name}</h3><p>{project.description}</p><Tags items={project.tags} /><div className="project-links"><a href={project.source}>View source ↗</a>{project.live && <a href={project.live}>{project.liveLabel ?? 'Visit site'} ↗</a>}</div></article>)}</div>
    <div className="earlier-projects"><h3>More from the archive.</h3><p>A few more things I’ve built, explored, and shared.</p><div className="archive-grid">{earlierProjects.map(project => <a className="archive-link" key={project.name} href={project.url}><span><small>{project.type}</small><strong>{project.name}</strong></span><span aria-hidden="true">↗</span></a>)}</div></div>
   </section>
   <section id="skills" className="section section-tinted"><div className="container"><p className="eyebrow section-label">04 / TOOLKIT</p><h2>The tools behind the work.</h2><div className="skills-grid">{Object.entries(skills).map(([category, items]) => <div className="skill-group" key={category}><h3>{category}</h3><Tags items={items} /></div>)}</div>
    <div className="credentials-grid"><div><h3 className="credential-title">Education</h3>{education.map(item => <article className="education-item" key={item.title}><p className="period">{item.period}</p><h4>{item.title}</h4><p>{item.school}</p><p className="education-location">{item.location}</p></article>)}</div><div><h3 className="credential-title">Certifications & learning</h3><ul className="certifications">{certifications.map(item => <li key={item}><span aria-hidden="true">↗</span>{item}</li>)}</ul><a className="text-link" href="https://www.linkedin.com/in/nikunj3011/">Find out more on LinkedIn ↗</a></div></div>
   </div></section>
   <section id="github" className="section container"><div className="section-heading"><div><p className="eyebrow section-label">05 / OPEN SOURCE</p><h2>A little progress, every day.</h2><p className="calendar-description">My GitHub contribution calendar. Explore the code behind the commits.</p></div><a className="text-link" href="https://github.com/nikunj3011">Visit my GitHub ↗</a></div><div className="calendar-panel"><GitHubCalendar username="nikunj3011" colorScheme="light" blockSize={13} blockMargin={4} fontSize={12} theme={{ light: ['#ebebeb', '#ffc2df', '#ff80bb', '#ff0077', '#a3004c'] }} errorMessage="The contribution calendar is temporarily unavailable. You can still view all my activity on GitHub." /><a className="calendar-profile" href="https://github.com/nikunj3011?tab=overview">View contributions on GitHub ↗</a></div></section>
   <section id="contact" className="section contact"><div className="container"><p className="eyebrow">06 / GET IN TOUCH</p><h2>Have something in mind?<br /><em>Let’s build it.</em></h2><a className="contact-email" href="mailto:nikunjrathod3011@gmail.com">nikunjrathod3011@gmail.com <span aria-hidden="true">↗</span></a><div className="contact-details"><span>Canada</span></div><div className="contact-socials" aria-label="Social profiles">{socialLinks.map(link => <a key={link.name} href={link.url}>{link.name} ↗</a>)}</div></div></section>
  </main>
  <footer className="container footer"><p>© {new Date().getFullYear()} Nikunj Rathod</p><div><a href="https://github.com/nikunj3011">GitHub ↗</a><a href="https://www.linkedin.com/in/nikunj3011/">LinkedIn ↗</a><a href="#home">Back to top ↑</a></div></footer>
 </>;
}
