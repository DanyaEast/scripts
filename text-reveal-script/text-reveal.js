  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll("[text-reveal-start]").forEach(el => {
      const start = parseInt(el.getAttribute("text-reveal-start")) || 0;
      const end = parseInt(el.getAttribute("text-reveal-end")) || 100;
      const triggerAttr = el.getAttribute("text-reveal-trigger") || "itself";

      const triggerEl = triggerAttr === "itself" ? el : document.querySelector(`.${triggerAttr}`);
      if (!triggerEl) return;

      // Разбивка текста на символы (авто-адаптивная)
      const split = new SplitType(el, { types: "chars" });

      // Начальные стили
      gsap.set(split.chars, {
        opacity: start / 100,
      });

      // Анимация с scrub (плавная прокрутка)
      gsap.to(split.chars, {
        opacity: end / 100,
        y: 0,
        stagger: 0.07,
        ease: "none", // чтобы scrub выглядел правильно
        scrollTrigger: {
          trigger: triggerEl,
          start: "top 70%",
          end: "center center",
          scrub: 0.5,
        },
      });
    });
  });
