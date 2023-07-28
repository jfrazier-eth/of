export const flipCoin = (): boolean => {
  return Math.random() > 0.5;
};

export const selectRandom = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};
