import { selectForecastHours } from './forecastHours'

export function getChartHours(hours, currentTime) {
  return selectForecastHours(hours, 'next-24', currentTime)
}
