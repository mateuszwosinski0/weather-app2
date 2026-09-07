
export function selectForecastHours(hours, selectedDate, currentTime) {
  const currentHour = currentTime?.slice(0, 13)
  return hours.filter((hour) => (
    hour.time.slice(0, 10) === selectedDate &&
    (!currentHour || hour.time.slice(0, 13) >= currentHour)
  ))
}
