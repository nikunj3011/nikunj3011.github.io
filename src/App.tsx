import Icon from './Icon';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useEditorialMotion } from './useEditorialMotion';
import ProjectArt from './ProjectArt';
import QuantumLab from './QuantumLab';
import type { QuantumMode } from './QuantumWorld';
import { GitHubCalendar } from 'react-github-calendar';
import {
  certifications,
  earlierProjects,
  education,
  experience,
  projects,
  skills,
  socialLinks,
} from './data';
import { randomSeed } from './theme';
import './themes.css';
import './editorial.css';
import './quantum.css';
import './ambient.css';
import './sections.css';

const ThemeScene = lazy(() => import('./ThemeScene'));

const links = ['About', 'Experience', 'Projects', 'Skills', 'GitHub', 'Contact'];
const resume = '/Nikunj-Rathod-Resume.pdf';
function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags" aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [seed, setSeed] = useState(randomSeed);
  const [theme, setTheme] = useState<'quantum' | 'space'>('quantum');
  const [quantumMode, setQuantumMode] = useState<QuantumMode>('electron');
  const [phase, setPhase] = useState(Math.PI / 2);
  const [measurement, setMeasurement] = useState(0);
  const [stats, setStats] = useState<{
    counts: [number, number];
    shots: number;
    outcome: number | null;
  }>({ counts: [0, 0], shots: 0, outcome: null });
  const resetStats = () => setStats({ counts: [0, 0], shots: 0, outcome: null });
  function measure() {
    const probability = quantumMode === 'entangled' ? 0.5 : Math.cos(phase / 2) ** 2;
    const outcome = randomSeed() / 4294967296 < probability ? 0 : 1;
    setStats((current) => ({
      counts: [
        current.counts[0] + (outcome === 0 ? 1 : 0),
        current.counts[1] + (outcome === 1 ? 1 : 0),
      ],
      shots: current.shots + 1,
      outcome,
    }));
    setMeasurement((current) => current + 1);
  }
  const rootRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<ViewTransition | null>(null);
  useEditorialMotion(rootRef);

  function selectTheme(next: 'quantum' | 'space', button: HTMLButtonElement) {
    if (next === theme) return;
    const update = () => {
      setTheme(next);
      setSeed(randomSeed());
    };
    if (
      !document.startViewTransition ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      update();
      return;
    }
    transitionRef.current?.skipTransition();
    const rect = button.getBoundingClientRect();
    document.documentElement.style.setProperty('--switch-x', `${rect.left + rect.width / 2}px`);
    document.documentElement.style.setProperty('--switch-y', `${rect.top + rect.height / 2}px`);
    const transition = document.startViewTransition(() => flushSync(update));
    transitionRef.current = transition;
    transition.ready.catch(() => {});
    transition.finished
      .catch(() => {})
      .finally(() => {
        if (transitionRef.current === transition) transitionRef.current = null;
      });
  }

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const mobile = window.matchMedia('(max-width: 600px)').matches;
      const heroBottom =
        rootRef.current?.querySelector('#home')?.getBoundingClientRect().bottom ?? 0;
      const progress = mobile
        ? (window.innerHeight * 0.4 - heroBottom) / (window.innerHeight * 0.4)
        : (window.scrollY - 80) / (window.innerHeight * 0.65);
      rootRef.current?.style.setProperty(
        '--scene-scroll',
        String(Math.min(1, Math.max(0, progress))),
      );
      const sections = rootRef.current?.querySelectorAll<HTMLElement>('main section[id]');
      let current = 'home';
      sections?.forEach((section) => {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = section.id;
      });
      setActiveSection(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', theme === 'quantum' ? '#efefed' : '#080d20');
  }, [theme]);

  return (
    <div className={`portfolio-theme theme-${theme}`} data-theme={theme} ref={rootRef}>
      <div className="intro-curtain" aria-hidden="true">
        <div className="intro-curtain-top" />
        <div className="intro-curtain-bottom" />
        <span className="intro-mark">
          NIKUNJ RATHOD<small>CODE / CURIOSITY / CREATION</small>
        </span>
      </div>
      <div className="ambient-layer" aria-hidden="true">
        <Suspense fallback={null}>
          <ThemeScene
            theme={theme}
            seed={seed}
            enabled={true}
            quantumMode={quantumMode}
            phase={phase}
            measurement={measurement}
            outcome={stats.outcome ?? 0}
          />
        </Suspense>
      </div>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-inner">
          <a className="wordmark" href="#home" aria-label="Nikunj Rathod home">
            nr<span>.</span>
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'Close ×' : 'Menu ☰'}
          </button>
          <nav
            id="navigation"
            className={menuOpen ? 'navigation open' : 'navigation'}
            aria-label="Main navigation"
          >
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                aria-current={activeSection === link.toLowerCase() ? 'location' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <a className="nav-resume" href={resume} download>
              Resume <Icon />
            </a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section id="home" className="hero">
          <div className="hero-shade" aria-hidden="true" />
          <div className="container hero-layout">
            <div>
              <p className="eyebrow">
                <span className="status-dot" /> BASED IN CANADA
              </p>
              <h1 className="hero-title">
                Hi, I’m Nikunj.<span className="hero-role">Software Developer</span>
              </h1>
              <p className="hero-description">
                From APIs and cloud infrastructure to web and mobile apps. I turn complex
                integrations into useful, reliable software.
              </p>
              <div className="actions">
                <a className="button primary" href="#projects">
                  Explore my work <Icon />
                </a>
                <a className="button subtle" href={resume} download>
                  Download resume <Icon name="down" />
                </a>
              </div>
              <div className="hero-links" aria-label="Social profiles">
                {socialLinks.map((link) => (
                  <a key={link.name} href={link.url}>
                    {link.name} <Icon />
                  </a>
                ))}
              </div>
              <div className="building-caption">
                <span>CURRENTLY BUILDING AT</span>
                <strong>
                  Vinvox{' '}
                  <span aria-hidden="true">
                    <Icon />
                  </span>
                </strong>
              </div>
            </div>
            <aside className="hero-side" aria-label="Scene controls and profile">
              {' '}
              <div className="theme-controls" aria-label="Appearance controls">
                <div className="theme-switch" role="group" aria-label="Choose a theme">
                  {(['quantum', 'space'] as const).map((option) => (
                    <button
                      type="button"
                      key={option}
                      aria-pressed={theme === option}
                      onClick={(event) => selectTheme(option, event.currentTarget)}
                    >
                      {option === 'quantum' ? 'Quantum' : 'Space'}
                    </button>
                  ))}
                </div>
                <button
                  className="scene-button"
                  type="button"
                  onClick={() => setSeed(randomSeed())}
                >
                  <Icon name="refresh" /> New scene
                </button>
              </div>
              <div className="mobile-scene-window" aria-hidden="true" />
              {theme === 'quantum' && (
                <QuantumLab
                  compact
                  mode={quantumMode}
                  onMode={(mode) => {
                    setQuantumMode(mode);
                    resetStats();
                  }}
                  phase={phase}
                  onPhase={(value) => {
                    setPhase(value);
                    resetStats();
                  }}
                  onMeasure={measure}
                  counts={stats.counts}
                  shots={stats.shots}
                  outcome={stats.outcome}
                />
              )}
              <div className="portrait-frame">
                <img src="/profile-pic.jpg" alt="Nikunj Rathod" width="72" height="72" />
              </div>
            </aside>
          </div>

          <div className="container hero-bottom">
            <span>.NET / REACT / PYTHON / ANDROID / AZURE</span>
            <a href="#about">
              A little more about me <Icon name="down" />
            </a>
          </div>
          <div className="scene-caption" aria-live="polite">
            {' '}
          </div>
        </section>
        <section id="about" className="section about-panel">
          <div className="panel-corner corner-left" aria-hidden="true">
            ✦
          </div>
          <div className="panel-corner corner-right" aria-hidden="true">
            ✦
          </div>
          <div className="container about-layout">
            <div>
              <p className="eyebrow section-label">01 / THE DEVELOPER</p>
              <h2>About me.</h2>
            </div>
            <div className="about-copy">
              <p>
                I’m a software developer based in Canada, with 5 years of experience specializing in
                API frameworks, web technologies, and complex integrations.
              </p>
              <p>
                At Vinvox, I work across .NET microservices, vehicle diagnostics, Android
                applications, and Python tools. Previously at Ditech Testing, I connected enterprise
                systems, production hardware, and cloud services to help teams work better.
              </p>
              <p>
                I enjoy solving challenging problems, collaborating across disciplines, and learning
                the tools that a project needs.
              </p>
              <a className="text-link" href={resume} download>
                The story so far — download resume <Icon />
              </a>
            </div>
          </div>
        </section>
        <section className="statement" aria-label="My approach">
          <div className="statement-orbit" aria-hidden="true">
            ✳
          </div>
          <p className="eyebrow">A LITTLE CURIOSITY CAN CHANGE EVERYTHING</p>
          <h2 aria-label="Complex ideas. Human solutions.">
            {'Complex ideas. Human solutions.'.split(' ').map((word, index) => (
              <span className="statement-word" aria-hidden="true" key={index}>
                {word}{' '}
              </span>
            ))}
          </h2>
          <p className="statement-note">
            From the first question to the final release.
            <br />
            Thoughtful software, built for the real world.
          </p>
        </section>
        <section id="experience" className="section section-tinted">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow section-label">02 / EXPERIENCE</p>
                <h2>Work experience.</h2>
              </div>
              <span className="small-label">BUILDING SINCE 2021</span>
            </div>
            {experience.map((job) => (
              <article className="experience-row" key={job.company}>
                <div className="experience-meta">
                  <p className="period">{job.period}</p>
                  <h3>{job.company}</h3>
                  <p>{job.location}</p>
                </div>
                <div>
                  <h4>Software Developer</h4>
                  <ul className="highlights">
                    {job.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <Tags items={job.technologies} />
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="projects" className="section projects-section">
          <div className="project-runway">
            <div className="container section-heading">
              <div>
                <p className="eyebrow section-label">03 / SELECTED PROJECTS</p>
                <h2>
                  Selected <em>work.</em>
                </h2>
              </div>
              <a className="text-link" href="https://github.com/nikunj3011">
                More on GitHub <Icon />
              </a>
            </div>
            <div className="project-window">
              <div className="project-track">
                {projects.map((project, index) => (
                  <article className="project-card" key={project.name}>
                    <ProjectArt index={index} name={project.name} />
                    <div className="project-body">
                      <div className="project-top">
                        <span>{project.category}</span>
                        <span>0{index + 1}</span>
                      </div>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                      <Tags items={project.tags} />
                      <div className="project-links">
                        <a href={project.source}>
                          View source <Icon />
                        </a>
                        {project.live && (
                          <a href={project.live}>
                            {project.liveLabel ?? 'Visit site'} <Icon />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="container gallery-footer">
              <span>06 PUBLIC PROJECTS / BUILT & SHARED</span>
              <div className="gallery-progress" aria-hidden="true">
                <span />
              </div>
              <span>IDEAS → REALITY</span>
            </div>
          </div>
          <div className="container earlier-projects">
            <h3>More from the archive.</h3>
            <p>A few more things I’ve built, explored, and shared.</p>
            <div className="archive-grid">
              {earlierProjects.map((project) => (
                <a className="archive-link" key={project.name} href={project.url}>
                  <span>
                    <small>{project.type}</small>
                    <strong>{project.name}</strong>
                  </span>
                  <span aria-hidden="true">
                    <Icon />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section id="skills" className="section section-tinted">
          <div className="container">
            <p className="eyebrow section-label">04 / TOOLKIT</p>
            <h2>
              The tools.
              <br />
              <em>The possibilities.</em>
            </h2>
            <div className="skills-grid">
              {Object.entries(skills).map(([category, items]) => (
                <div className="skill-group" key={category}>
                  <h3>{category}</h3>
                  <Tags items={items} />
                </div>
              ))}
            </div>
            <div className="credentials-grid">
              <div>
                <h3 className="credential-title">Education</h3>
                {education.map((item) => (
                  <article className="education-item" key={item.title}>
                    <p className="period">{item.period}</p>
                    <h4>{item.title}</h4>
                    <p>{item.school}</p>
                    <p className="education-location">{item.location}</p>
                  </article>
                ))}
              </div>
              <div>
                <h3 className="credential-title">Certifications & learning</h3>
                <ul className="certifications">
                  {certifications.map((item) => (
                    <li key={item}>
                      <span aria-hidden="true">
                        <Icon />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a className="text-link" href="https://www.linkedin.com/in/nikunj3011/">
                  Find out more on LinkedIn <Icon />
                </a>
              </div>
            </div>
          </div>
        </section>
        <section id="github" className="section container">
          <div className="section-heading">
            <div>
              <p className="eyebrow section-label">05 / OPEN SOURCE</p>
              <h2>
                A little progress.
                <br />
                <em>Every single day.</em>
              </h2>
              <p className="calendar-description">
                My GitHub contribution calendar. Explore the code behind the commits.
              </p>
            </div>
            <a className="text-link" href="https://github.com/nikunj3011">
              Visit my GitHub <Icon />
            </a>
          </div>
          <div className="calendar-panel">
            <GitHubCalendar
              username="nikunj3011"
              colorScheme="light"
              blockSize={13}
              blockMargin={4}
              fontSize={12}
              theme={{ light: ['#edf0ed', '#c3d8d4', '#84b5ae', '#3c807a', '#21534f'] }}
              errorMessage="The contribution calendar is temporarily unavailable. You can still view all my activity on GitHub."
            />
            <a className="calendar-profile" href="https://github.com/nikunj3011?tab=overview">
              View contributions on GitHub <Icon />
            </a>
          </div>
        </section>
        <section id="contact" className="section contact">
          <div className="container">
            <p className="eyebrow">06 / GET IN TOUCH</p>
            <h2 className="contact-title">
              <span>YOUR NEXT</span>
              <span>
                <em>great idea.</em>
              </span>
            </h2>
            <p className="contact-intro">
              Starts with a conversation. Let’s make something that matters.
            </p>
            <a className="contact-email" href="mailto:nikunjrathod3011@gmail.com">
              nikunjrathod3011@gmail.com{' '}
              <span aria-hidden="true">
                <Icon />
              </span>
            </a>
            <div className="contact-details">
              <span>Canada</span>
            </div>
            <div className="contact-socials" aria-label="Social profiles">
              {socialLinks.map((link) => (
                <a key={link.name} href={link.url}>
                  {link.name} <Icon />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="container footer">
        <p>© {new Date().getFullYear()} Nikunj Rathod</p>
        <div>
          <a href="https://github.com/nikunj3011">
            GitHub <Icon />
          </a>
          <a href="https://www.linkedin.com/in/nikunj3011/">
            LinkedIn <Icon />
          </a>
          <a href="#home">
            Back to top <Icon name="up" />
          </a>
        </div>
      </footer>
    </div>
  );
}
