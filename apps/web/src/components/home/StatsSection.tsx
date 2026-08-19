'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Clock, FolderOpen, Route, Users } from 'lucide-react'

const STATS = [
  { labelKey: 'stats_years', value: 30, suffix: '+', Icon: Clock },
  { labelKey: 'stats_projects', value: 500, suffix: '+', Icon: FolderOpen },
  { labelKey: 'stats_km', value: 170, suffix: '', Icon: Route },
  { labelKey: 'stats_employees', value: 200, suffix: '+', Icon: Users },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let start = 0
          const step = target / 60
          const timer = setInterval(() => {
            start = Math.min(start + step, target)
            setCount(Math.floor(start))
            if (start >= target) clearInterval(timer)
          }, 16)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function StatsSection() {
  const t = useTranslations('home')
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-dark)] to-[var(--primary)]" />
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.labelKey} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
                <stat.Icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-blue-200 text-sm font-medium uppercase tracking-[0.12em]">
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
