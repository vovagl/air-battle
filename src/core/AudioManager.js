export class AudioManager {
  constructor() {
    this.sounds = {};
  }

  load(name, path, volume = 1) {
    const audio = new Audio(path);

    audio.preload = "auto";
    audio.volume = volume;

    this.sounds[name] = audio;
  }

  play(name) {
    const original = this.sounds[name];

    if (!original) return;

    const sound = original.cloneNode();

    sound.volume = original.volume;

    sound.play().catch(err => {
      console.log("AUDIO ERROR:", err);
    });

    return sound;
  }

  loop(name) {
    const sound = this.sounds[name];

    if (!sound) return;

    sound.loop = true;

    sound.play().catch(err => {
      console.log("LOOP ERROR:", err);
    });

    return sound;
  }
}