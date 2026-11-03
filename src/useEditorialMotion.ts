import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useEditorialMotion(root: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    if (!root.current) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const intro = gsap.timeline();
        intro
          .to('.intro-mark', { opacity: 0, y: -20, duration: 0.35, delay: 0.2 })
          .to('.intro-curtain-top', { yPercent: -101, duration: 0.9, ease: 'power4.inOut' }, 0.35)
          .to('.intro-curtain-bottom', { yPercent: 101, duration: 0.9, ease: 'power4.inOut' }, 0.35)
          .set('.intro-curtain', { display: 'none' })
          .from('.hero-title', { y: 18, opacity: 0, duration: 0.75, ease: 'power3.out' }, 0.65);

        gsap.fromTo(
          '.about-panel',
          { clipPath: 'inset(0 3% round 24px)' },
          {
            clipPath: 'inset(0 0% round 0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: '.about-panel',
              start: 'top 95%',
              end: 'top 15%',
              scrub: 0.6,
            },
          },
        );
        gsap.from('.statement-word', {
          opacity: 0.17,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: '.statement', start: 'top 70%', end: 'bottom 55%', scrub: 0.5 },
        });
        gsap.to('.statement-orbit', {
          rotation: 120,
          ease: 'none',
          scrollTrigger: {
            trigger: '.statement',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        const items = gsap.utils.toArray<HTMLElement>(
          '.section-heading, .project-card, .experience-row, .skill-group, .credentials-grid > div, .calendar-panel, .earlier-projects',
        );
        items.forEach((item) =>
          gsap.from(item, {
            y: 25,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 92%', once: true },
          }),
        );
        gsap.from('.contact-title > span', {
          yPercent: 80,
          rotate: 3,
          opacity: 0,
          stagger: 0.13,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: '#contact', start: 'top 75%', once: true },
        });
      });
    }, root);
    let alive = true;
    document.fonts.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });
    return () => {
      alive = false;
      media.revert();
      context.revert();
    };
  }, [root]);
}
