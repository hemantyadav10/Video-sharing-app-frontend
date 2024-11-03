export function timeAgo(dateString) {
  const now = new Date();
  const timestamp = new Date(dateString);
  const secondsAgo = Math.floor((now - timestamp) / 1000);

  const minutesAgo = Math.floor(secondsAgo / 60);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const daysAgo = Math.floor(hoursAgo / 24);
  const weeksAgo = Math.floor(daysAgo / 7);
  const monthsAgo = Math.floor(daysAgo / 30);
  const yearsAgo = Math.floor(daysAgo / 365);

  const formatTime = (value, unit) => `${value} ${unit}${value !== 1 ? 's' : ''} ago`;

  if (secondsAgo < 60) {
    return formatTime(secondsAgo, 'second');
  } else if (minutesAgo < 60) {
    return formatTime(minutesAgo, 'minute');
  } else if (hoursAgo < 24) {
    return formatTime(hoursAgo, 'hour');
  } else if (daysAgo < 7) {
    return formatTime(daysAgo, 'day');
  } else if (weeksAgo < 4) {
    return formatTime(weeksAgo, 'week');
  } else if (daysAgo < 60) { // Adjust for 1 month as 30 to 59 days
    return formatTime(1, 'month');
  } else if (monthsAgo < 12) {
    return formatTime(monthsAgo, 'month');
  } else {
    return formatTime(yearsAgo, 'year');
  }
}

