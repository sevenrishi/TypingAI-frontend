export function calcWPM(characters: number, elapsedMs: number) {
  if (elapsedMs <= 0) return 0;
  const words = characters / 5;
  return (words / (elapsedMs / 1000)) * 60;
}

export function calcCPM(characters: number, elapsedMs: number) {
  if (elapsedMs <= 0) return 0;
  return (characters / (elapsedMs / 60000));
}

export function calcAccuracy(typed: number, errors: number) {
  if (typed <= 0) return 100;
  return ((typed - errors) / typed) * 100;
}
