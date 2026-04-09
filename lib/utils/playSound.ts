export function playHover() {
  try {
    const audio = new Audio('/sounds/hover.wav');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

export function playUnlock() {
  try {
    const audio = new Audio('/sounds/unlock.wav');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

export function playError() {
  try {
    const audio = new Audio('/sounds/error.wav');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}
