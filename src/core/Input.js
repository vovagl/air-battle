export class Input {
  constructor() {
    this.left = false;
    this.right = false;
    this.fireHeld = false;

    this.pointerX = 0;
    this.canvasRect = null;

    this.mode = "mouse";
  }

  init(canvas, mode) {
    this.mode = mode;
    this.canvasRect = canvas.getBoundingClientRect();

    window.addEventListener("resize", () => {
      this.canvasRect = canvas.getBoundingClientRect();
    });

    if (mode === "touch") this.initTouch();
    else this.initMouse();
  }

  initMouse() {
    const ui = document.getElementById("ui");

    ui.addEventListener("pointermove", (e) => {
      this.pointerX = e.clientX - this.canvasRect.left;
    });

    ui.addEventListener("pointerdown", () => {
      this.fireHeld = true;
    });

    ui.addEventListener("pointerup", () => {
      this.fireHeld = false;
    });
  }

  initTouch() {
    const left = document.getElementById("left");
    const right = document.getElementById("right");
    const fire = document.getElementById("fire");

    left.addEventListener("pointerdown", () => this.left = true);
    left.addEventListener("pointerup", () => this.left = false);

    right.addEventListener("pointerdown", () => this.right = true);
    right.addEventListener("pointerup", () => this.right = false);

    fire.addEventListener("pointerdown", () => this.fireHeld = true);
    fire.addEventListener("pointerup", () => this.fireHeld = false);
  }
}