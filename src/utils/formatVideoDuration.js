export function formatVideoDuration(seconds) {
  // Convert seconds to an integer
  const totalSeconds = Math.floor(seconds);

  // Calculate hours, minutes, and remaining seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  // Ensure the seconds and minutes are always displayed as two digits
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  // Return formatted string as "h:mm:ss" or "mm:ss"
  return hours > 0 ? `${hours}:${formattedMinutes}:${formattedSeconds}` : `${minutes}:${formattedSeconds}`;
}
