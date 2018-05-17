export const numDaysBetween = (d1, d2) =>
    Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24);
