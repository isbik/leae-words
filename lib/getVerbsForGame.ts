import { Mode, Verb } from "../types";
import { words } from "./words";

function shuffle(a: unknown[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const getVerbsForGame = (mode: Mode): Verb[] => {
  if (mode === Mode.infinite) {
    return shuffle(words);
  }

  return shuffle(words).slice(0, mode) as Verb[];
};
