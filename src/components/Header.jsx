import Dropdown from '@/components/Dropdown'

const unitOptions = [
  { value: 'metric', label: 'Metric · °C, km/h, mm' },
  { value: 'imperial', label: 'Imperial · °F, mph, in' },
]

function Header({ units, onUnitsChange }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 py-5">
      <a href="/" className="rounded-md text-xl font-bold tracking-tight text-white transition-colors hover:text-sky-200">
        Weather<span className="text-sky-400">App</span>
      </a>
      <div className="w-full sm:w-64">
        <Dropdown label="Weather units" value={units} options={unitOptions} onChange={onUnitsChange} />
      </div>
    </header>
  )
}

export default Header
