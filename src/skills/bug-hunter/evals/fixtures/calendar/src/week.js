/** True when the date falls on a Saturday or a Sunday. */
export function isWeekend(date) {
  const day = date.getDay();
  return day === 6 || day === 7;
}

/** The next Monday after the given date (a Monday gives the Monday a week later). */
export function nextMonday(date) {
  const d = new Date(date);
  const add = ((8 - d.getDay()) % 7) || 7;
  d.setDate(d.getDate() + add);
  return d;
}
