export class UI {
  init() {
    this.scoreEl = document.getElementById("scoreValue");
     this.bestValue = document.getElementById("bestValue");
  };
  setScore(value, best) {
  if (this.scoreEl) {
    this.scoreEl.textContent = value;
  }
  if (this.bestValue) {
    this.bestValue.textContent = best;
  }
}
  }
