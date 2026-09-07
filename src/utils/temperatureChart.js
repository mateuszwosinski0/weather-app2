export function getChartHours(hours, currentTime) {
  const currentHour = currentTime?.slice(0, 13)
  return hours.filter((hour) => !currentHour || hour.time.slice(0, 13) >= currentHour).slice(0, 24)
}

export function getChartGeometry(hours, units) {
  const values = hours.map((hour) => Number.isFinite(hour.temperature)
    ? (units === 'imperial' ? hour.temperature * 9 / 5 + 32 : hour.temperature)
    : null)
  const valid = values.filter((value) => value !== null)
  if (!valid.length) return null
  const low = Math.floor(Math.min(...valid) - 2)
  const high = Math.ceil(Math.max(...valid) + 2)
  const points = values.map((value, index) => ({
    x: 56 + index / Math.max(hours.length - 1, 1) * 656,
    y: value === null ? null : 30 + (high - value) / (high - low) * 210,
  }))
  let previousValid = false
  const path = points.map(({ x, y }) => {
    if (y === null) { previousValid = false; return '' }
    const segment = `${previousValid ? 'L' : 'M'} ${x} ${y}`
    previousValid = true
    return segment
  }).join(' ')
  return { points, path, low, high }
}
