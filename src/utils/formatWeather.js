export function formatTemperature(value, units = 'metric') {
  if (!Number.isFinite(value)) return '—'
  const temperature = units === 'imperial' ? value * 9 / 5 + 32 : value
  return `${Math.round(temperature)}°${units === 'imperial' ? 'F' : 'C'}`
}

export function formatWind(value, units = 'metric') {
  if (!Number.isFinite(value)) return '—'
  return units === 'imperial'
    ? `${Number((value / 1.609344).toFixed(1))} mph`
    : `${Number(value.toFixed(1))} km/h`
}

export function formatPrecipitation(value, units = 'metric') {
  if (!Number.isFinite(value)) return '—'
  return units === 'imperial'
    ? `${(value / 25.4).toFixed(2)} in`
    : `${Number(value.toFixed(1))} mm`
}
