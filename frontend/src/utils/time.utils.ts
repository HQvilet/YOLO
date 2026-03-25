
export function getTimeDifference(startDate: Date, endDate: Date) {
  const diffMs: number = endDate.getTime() - startDate.getTime(); // Difference in milliseconds
  
  // Constants for conversion
  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;

  const days = Math.floor(diffMs / msInDay);
  const hours = Math.floor((diffMs % msInDay) / msInHour);
  const minutes = Math.floor(((diffMs % msInDay) % msInHour) / msInMinute);
  const seconds = Math.floor((((diffMs % msInDay) % msInHour) % msInMinute) / msInSecond);

  return { days, hours, minutes, seconds, totalMilliseconds: diffMs };
}
