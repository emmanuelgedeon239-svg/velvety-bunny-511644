export function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const active = value === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={
              'rounded-xl border px-4 py-3 text-left text-sm font-medium transition ' +
              (active
                ? 'border-blue-700 bg-blue-50 text-blue-900 ring-1 ring-blue-700'
                : 'border-slate-200 bg-white text-slate-700 active:bg-slate-50')
            }
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

export function CheckboxGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[]
  value: string[]
  onChange: (v: string[]) => void
}) {
  function toggle(option: string) {
    if (value.includes(option)) onChange(value.filter((v) => v !== option))
    else onChange([...value, option])
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => {
        const active = value.includes(option)
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={
              'flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ' +
              (active
                ? 'border-blue-700 bg-blue-50 text-blue-900 ring-1 ring-blue-700'
                : 'border-slate-200 bg-white text-slate-700 active:bg-slate-50')
            }
          >
            <span
              className={
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ' +
                (active ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 text-transparent')
              }
            >
              ✓
            </span>
            {option}
          </button>
        )
      })}
    </div>
  )
}

export function ScaleButtons({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const active = value === n
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={
                'aspect-square rounded-lg text-sm font-bold transition ' +
                (active ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 active:bg-slate-200')
              }
            >
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>1 = Très faible</span>
        <span>10 = Très élevé</span>
      </div>
    </div>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
    />
  )
}

export function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
    />
  )
}

export function QuestionLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <p className="mb-3 text-base font-semibold text-blue-950">
      {children}
      {optional ? <span className="ml-2 text-xs font-normal text-slate-400">(facultatif)</span> : null}
    </p>
  )
}
