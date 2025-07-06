class cursorBlock {
  constructor(sectionSelector, options = {}) {
    this.section = document.querySelector(sectionSelector);
    this.cursorObject = this.section.querySelector('[data-cursor="object"]');
    this.textReplaceEl = this.cursorObject.querySelector('[data-cursor="replace"]');
    this.triggers = [...this.section.querySelectorAll('[data-cursor-text]')];

    // Значения по умолчанию
    const defaultOptions = {
      appearEasing: "true",
      appearOpacity: "true",
      appearSize: "true",
      followEasing: "true",
      disappear: "true",
      position: "center"
    };

    this.options = {
      ...defaultOptions,
      ...options
    };

    this.mouse = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };
    this.active = false;

    this.init();
  }

  init() {
    this.cursorObject.style.position = "fixed";
    this.cursorObject.style.pointerEvents = "none";
    this.cursorObject.style.transition = this.options.appearEasing === "true"
      ? "opacity 0.3s ease, transform 0.3s ease"
      : "none";
    this.cursorObject.style.opacity = 0;
    this.cursorObject.style.transform = this.options.appearSize === "true" ? "scale(0.7)" : "scale(1)";

    this.triggers.forEach(trigger => {
      trigger.addEventListener("mouseenter", () => {
        const text = trigger.getAttribute("data-cursor-text");
        if (text && this.textReplaceEl) {
          this.textReplaceEl.textContent = text;
        }
        this.active = true;
        this.showCursor();
      });

      trigger.addEventListener("mouseleave", () => {
        this.active = false;
        if (this.options.disappear === "true") this.hideCursor();
      });
    });

    window.addEventListener("mousemove", e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (this.options.followEasing !== "true") {
        const offset = this.getOffset();
        this.cursorObject.style.left = `${e.clientX + offset.x}px`;
        this.cursorObject.style.top = `${e.clientY + offset.y}px`;
      }
    });

    if (this.options.followEasing === "true") {
      const animate = () => {
        this.position.x += (this.mouse.x - this.position.x) * 0.15;
        this.position.y += (this.mouse.y - this.position.y) * 0.15;
        const offset = this.getOffset();
        this.cursorObject.style.left = `${this.position.x + offset.x}px`;
        this.cursorObject.style.top = `${this.position.y + offset.y}px`;
        requestAnimationFrame(animate);
      };
      animate();
    }
  }

  getOffset() {
    const rect = this.cursorObject.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const pos = this.options.position.toLowerCase();

    const offsetMap = {
      "left top": { x: 0, y: 0 },
      "center": { x: -w / 2, y: -h / 2 },
      "right bottom": { x: -w, y: -h },
      "right top": { x: -w, y: 0 },
      "left bottom": { x: 0, y: -h },
      "right center": { x: -w, y: -h / 2 },
      "left center": { x: 0, y: -h / 2 },
      "center top": { x: -w / 2, y: 0 },
      "center bottom": { x: -w / 2, y: -h },
    };

    return offsetMap[pos] || offsetMap["center"];
  }

  showCursor() {
    if (this.options.appearOpacity === "true") {
      this.cursorObject.style.opacity = 1;
    }
    if (this.options.appearSize === "true") {
      this.cursorObject.style.transform = "scale(1)";
    }
  }

  hideCursor() {
    if (this.options.appearOpacity === "true") {
      this.cursorObject.style.opacity = 0;
    }
    if (this.options.appearSize === "true") {
      this.cursorObject.style.transform = "scale(0.7)";
    }
  }
}
