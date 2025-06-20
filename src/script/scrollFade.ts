
export function initScrollFadeIn() {
    const elements = document.querySelectorAll<HTMLElement>('.fade-in');
  
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );
  
    elements.forEach(el => observer.observe(el));
  }
  