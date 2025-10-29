export function entersViewport(node, { onVisible, onHidden } = {}) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
        // Element is visible or scrolled past (above)
        onVisible?.();
      } else if (entry.boundingClientRect.top > 0) {
        // Element is below viewport → not yet reached
        onHidden?.();
      }
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}