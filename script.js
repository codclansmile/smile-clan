(() => {
  let animationFrame = 0;

  const animateScroll = (destination) => {
    cancelAnimationFrame(animationFrame);
    const start = window.scrollY;
    const distance = destination - start;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const distanceRatio = Math.min(Math.abs(distance) / window.innerHeight, 2.5);
    const duration = reduceMotion ? 420 : 1050 + distanceRatio * 180;
    const startedAt = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
      window.scrollTo(0, start + distance * eased);
      if (progress < 1) animationFrame = requestAnimationFrame(step);
    };
    animationFrame = requestAnimationFrame(step);
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const targetId = link.getAttribute("href");
    const target = targetId === "#top" ? document.documentElement : document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    const top = targetId === "#top" ? 0 : target.getBoundingClientRect().top + window.scrollY - 16;
    animateScroll(top);
    history.replaceState(null, "", targetId);
  }, { capture: true });

  const items = document.querySelectorAll("[data-reveal]");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("show"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  items.forEach((item) => observer.observe(item));
})();
