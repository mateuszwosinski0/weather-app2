
export function selectForecastHours(hours, selectedDate, currentTime) {
  const currentHour = currentTime?.slice(0, 13)
  if (selectedDate === 'next-24') {
    return hours
      .filter((hour) => !currentHour || hour.time.slice(0, 13) >= currentHour)
      .slice(0, 24)
  }
  return hours.filter((hour) => (
    hour.time.slice(0, 10) === selectedDate &&
    (!currentHour || hour.time.slice(0, 13) >= currentHour)
  ))
}
