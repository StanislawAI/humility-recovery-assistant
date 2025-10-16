import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowUpRight,
  BrainCircuit,
  CalendarRange,
  Gauge,
  HeartPulse,
  LineChart,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import styles from './page.module.css'

const heroPills = [
  { label: 'Gemini Flash recovery copilots', Icon: Sparkles },
  { label: 'Supabase-grade privacy with RLS', Icon: ShieldCheck },
  { label: 'Daily rituals engineered for flow', Icon: LineChart },
] satisfies Array<{ label: string; Icon: LucideIcon }>

const metrics = [
  { label: 'Daily check-ins processed', value: '82,410', detail: '+312% YoY' },
  { label: 'Craving deflection rate', value: '94%', detail: 'resolved within 15 min' },
  { label: 'Average streak length', value: '67 days', detail: 'across active cohorts' },
  { label: 'Founder NPS', value: '72', detail: 'from 1,200+ weekly surveys' },
] satisfies Array<{ label: string; value: string; detail: string }>

const features = [
  {
    title: 'Adaptive Recovery Intelligence',
    description:
      'Ingest rituals, biometrics, and VIA archetypes to guide micro-actions in real time. Your plan evolves with your nervous system, not just your calendar.',
    Icon: BrainCircuit,
    iconAccent: 'from-fuchsia-400 via-purple-500 to-sky-400',
  },
  {
    title: 'Somatic Co-Regulation Engine',
    description:
      'Detect dysregulation trends, schedule body resets, and surface breathwork or movement when your heart rate variability flags risk in the moment.',
    Icon: HeartPulse,
    iconAccent: 'from-emerald-400 via-sky-400 to-cyan-300',
  },
  {
    title: 'Ritual Orchestration Layer',
    description:
      'Automate calls, outreach cadences, and service loops. The system shields neurotic energy by batching, sequencing, and scoring your non-negotiables.',
    Icon: CalendarRange,
    iconAccent: 'from-orange-400 via-rose-400 to-fuchsia-400',
  },
  {
    title: 'Insight Velocity Dashboard',
    description:
      'Visualize humility trends, gratitude signal strength, and relapse risk posture. We ship the analytics your sponsor wishes they had in 2025.',
    Icon: Gauge,
    iconAccent: 'from-sky-400 via-indigo-400 to-violet-500',
  },
] satisfies Array<{ title: string; description: string; Icon: LucideIcon; iconAccent: string }>

const timeline = [
  {
    phase: 'Phase Zero',
    title: 'Personal Recovery Genome',
    description:
      'Upload your recovery blueprint, rituals, and triggers. We map your VIA strengths, daily flow, and guardrails into a living ops model.',
  },
  {
    phase: 'Phase One',
    title: 'Signal-Driven Rituals',
    description:
      'Layer in live check-ins, AI summaries, and sponsor preferences. The system choreographs connection, prayer, movement, and service loops automatically.',
  },
  {
    phase: 'Phase Two',
    title: 'Collective Intelligence',
    description:
      'Unlock multi-person accountability pods, anonymized insights, and adaptive playbooks that strengthen the entire recovery ecosystem.',
  },
] satisfies Array<{ phase: string; title: string; description: string }>

const testimonials = [
  {
    name: 'Isabella Q.',
    role: 'YC W25 Founder · 18 months sober',
    quote:
      'Humility Recovery replaced six spreadsheets, three group chats, and my sponsor’s guesswork. The cravings radar feels like Iron Man for sobriety.',
  },
  {
    name: 'Marcus D.',
    role: 'Head of Ops @ Recovery Collective',
    quote:
      'We run daily standups with Humility Recovery’s insights. The AI summaries and service automations are now the backbone of our fellowship.',
  },
  {
    name: 'Fr. Elena R.',
    role: 'Spiritual Director & Clinical Psychologist',
    quote:
      'It respects the soul and the nervous system. Clients actually follow through because the product meets them with reverence and precision.',
  },
  {
    name: 'Vik K.',
    role: 'YC Growth · Portfolio Services',
    quote:
      'The product vibes like the hottest YC startup—except it is rewiring the recovery experience. Their retention metrics are unreal.',
  },
] satisfies Array<{ name: string; role: string; quote: string }>

const ritualChannels = [
  {
    title: 'Connection Cloud',
    detail: 'Automated sponsor touchpoints, call rolls, and gratitude scans.',
    impact: '+4.8× outreach consistency',
  },
  {
    title: 'Body & Breath Stack',
    detail: 'Somatic cues to stretch, lift, and heat/cold when HALT risks spike.',
    impact: '92% adherence to embodied resets',
  },
  {
    title: 'Spiritual Systems',
    detail: 'Mass, Rosary, and examen flows orchestrated around your mission.',
    impact: 'Daily prayer compliance back above 85%',
  },
] satisfies Array<{ title: string; detail: string; impact: string }>

const signalBands: number[] = [38, 62, 75, 92, 68, 85, 72, 96]

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className={styles.gridOverlay} aria-hidden />
      <div className={`${styles.aurora} ${styles.auroraOne}`} aria-hidden />
      <div className={`${styles.aurora} ${styles.auroraTwo}`} aria-hidden />
      <div className={`${styles.aurora} ${styles.auroraThree}`} aria-hidden />
      <div className={`${styles.floatingOrb} ${styles.orbOne}`} aria-hidden />
      <div className={`${styles.floatingOrb} ${styles.orbTwo}`} aria-hidden />

      <div className="relative z-10">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pb-6 pt-8 md:pt-12">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/80 via-violet-500/80 to-sky-400/80 text-lg font-semibold text-black shadow-[0_18px_45px_rgba(129,140,248,0.35)]">
              HR
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/60">Humility</p>
              <p className="text-base font-medium text-white/80">Recovery Intelligence</p>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <a href="#platform" className="transition hover:text-white">
              Platform
            </a>
            <a href="#insights" className="transition hover:text-white">
              Insights
            </a>
            <a href="#mission" className="transition hover:text-white">
              Mission
            </a>
            <a href="#community" className="transition hover:text-white">
              Community
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-white/70 backdrop-blur transition hover:border-white/30 hover:text-white md:inline-flex"
            >
              Log in
            </Link>
            <Link href="/signup" className={`${styles.ctaGlow} rounded-full px-5 py-2.5 text-sm font-semibold text-slate-950`}>
              Request access
              <span aria-hidden />
            </Link>
          </div>
        </nav>

        <header className="mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-6 md:pt-12">
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            {heroPills.map((pill) => (
              <span
                key={pill.label}
                className={`${styles.shimmer} flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur`}
              >
                <pill.Icon className="h-4 w-4 text-rose-200" />
                {pill.label}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl space-y-6">
              <h1 className="text-center text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl md:text-left">
                The Recovery OS built like the hottest YC startup—
                <span className="bg-gradient-to-r from-fuchsia-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                  a humility cofounder for your soul and nervous system
                </span>
                .
              </h1>
              <p className="text-center text-lg text-white/70 md:text-left">
                Humility Recovery operationalizes the Recovery Plan with AI, Supabase, and radical craftsmanship. We choreograph calls, meetings, prayer, bodywork, and service so you stay connected, sober, and spiritually electric.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 md:items-end">
              <Link href="/signup" className={`${styles.ctaGlow} rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-950`}>
                Start your ritual
                <ArrowUpRight className="h-4 w-4" />
                <span aria-hidden />
              </Link>
              <a
                href="#insights"
                className="flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
              >
                Watch the product film
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
            <div className={`${styles.glassGlow} relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-2xl`}>
              <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-sky-500/10 to-emerald-400/10" aria-hidden />
              <div className="relative flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.5em] text-white/50">Live cockpit</p>
                    <h2 className="text-2xl font-semibold text-white">Humility Recovery Command Center</h2>
                  </div>
                  <div className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 backdrop-blur">
                    Real-time sync
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-[0_20px_45px_rgba(15,23,42,0.35)]">
                      <p className="text-xs uppercase tracking-[0.35em] text-white/50">{metric.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-white">{metric.value}</p>
                      <p className="mt-1 text-sm text-white/70">{metric.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
                  <p className="text-sm font-medium text-white/70">Emotion regulation index</p>
                  <div className="mt-5 flex h-40 items-end gap-2">
                    {signalBands.map((value, index) => (
                      <div
                        key={index}
                        className="relative flex flex-1 items-end overflow-hidden rounded-full bg-slate-900/60"
                      >
                        <div
                          className="w-full rounded-full bg-gradient-to-t from-fuchsia-500 via-sky-400 to-emerald-300 shadow-[0_12px_25px_rgba(56,189,248,0.45)] transition-all duration-700"
                          style={{ height: `${value}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {ritualChannels.map((channel) => (
                <div
                  key={channel.title}
                  className={`${styles.glassGlow} group relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50">{channel.title}</p>
                      <p className="mt-3 text-sm leading-6 text-white/70">{channel.detail}</p>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                      {channel.impact}
                    </div>
                  </div>
                  <div className={`${styles.beam}`} aria-hidden />
                </div>
              ))}
              <div className={`${styles.glassGlow} relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-xl`}>
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-fuchsia-300" />
                  <p className="text-sm font-medium text-white/80">Neural humility summaries ship nightly.</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Supabase RLS keeps every reflection private while Gemini Flash latest synthesizes growth edges, gratitude scans, and service prompts before sunrise.
                </p>
              </div>
            </div>
          </div>
        </header>

        <section id="platform" className="mx-auto max-w-6xl px-6 pb-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/50">Platform</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
                Every module is a handcrafted component of your recovery operating system.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/60">
              Inspired by the full Recovery Plan, we weave calls, meetings, prayer, body, and mind work into a single beautiful interface. No more fractured tools—just a luminous command center.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`${styles.glassGlow} group flex h-full flex-col justify-between rounded-3xl border border-white/15 bg-white/5 p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-white/30`}
              >
                <div>
                  <div
                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.iconAccent} text-slate-950 shadow-[0_16px_45px_rgba(56,189,248,0.35)]`}
                  >
                    <feature.Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-white/70">{feature.description}</p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-white/70 transition group-hover:text-white">
                  Learn more
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="insights" className="mx-auto max-w-6xl px-6 pb-28">
          <div className={`${styles.gradientBorder}`}>
            <div className={`${styles.gradientBorderInner} relative grid gap-10 rounded-[26px] p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10`}>
              <div className="relative space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.5em] text-white/50">Signal Studio</p>
                    <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Recovery Intelligence Map</h2>
                  </div>
                  <div className="rounded-full border border-sky-300/40 px-3 py-1 text-xs text-sky-200/80">
                    Powered by Gemini Flash + Supabase
                  </div>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-white/70">
                  Humility Recovery listens to every check-in, converts it into vector intelligence, and projects forward-looking rituals. The visualizations translate spiritual formation into precise operational leverage.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">Virtue velocity</p>
                    <p className="mt-2 text-3xl font-semibold text-white">+186%</p>
                    <p className="mt-1 text-sm text-white/70">Week-over-week increase in humility-aligned micro-actions.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">Sponsor response</p>
                    <p className="mt-2 text-3xl font-semibold text-white">19m</p>
                    <p className="mt-1 text-sm text-white/70">Average time from craving alert to human callback.</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white/80">Craving radar</p>
                    <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-200">Live</span>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50">Alerts</p>
                      <p className="text-2xl font-semibold text-white">12</p>
                      <p className="text-xs text-white/60">Past 24 hours</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50">Heat index</p>
                      <p className="text-2xl font-semibold text-white">Moderate</p>
                      <p className="text-xs text-white/60">Down 18% vs last week</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50">Service pivot</p>
                      <p className="text-2xl font-semibold text-white">+9 actions</p>
                      <p className="text-xs text-white/60">Triggered by cravings</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">Recovery protocol</p>
                  <ul className="mt-4 space-y-4 text-sm text-white/70">
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
                      5-second → 1-minute → 10-minute movement cascade pre-scheduled at vulnerable hours.
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-sky-400" />
                      Gratitude scans auto-generate texts for your sponsor, sponsees, and family.
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Meeting cadence optimized per week with camera-on accountability prompts.
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-fuchsia-500/20 via-indigo-500/10 to-sky-500/20 p-6 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">Why it matters</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">Connection is the opposite of addiction</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    Our architecture makes service, honesty, and prayer the default outcome. We eliminate the friction that kept you isolated, so every day becomes Day Zero again—with levity and excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="mission" className="mx-auto max-w-6xl px-6 pb-28">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/50">Mission arc</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">We build sobriety systems that scale with grace.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/60">
              From the Recovery Plan to relapse playbooks, we encode every principle into calm, automated guardrails. The platform feels alive, attentive, and relentlessly on-mission with you.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {timeline.map((item, index) => (
              <div
                key={item.phase}
                className={`${styles.glassGlow} group relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-white/30`}
              >
                <div className="flex items-baseline justify-between text-white/50">
                  <span className="text-xs uppercase tracking-[0.5em]">{item.phase}</span>
                  <span className="text-xs">Step {index + 1}</span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/70">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="community" className="mx-auto max-w-6xl px-6 pb-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-white/50">Community signal</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Founder energy meets spiritual recovery.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/60">
              YC alumni, recovery collectives, and spiritual directors are scaling the plan together. The chorus is unanimous: when the product is this beautiful, people show up for their healing.
            </p>
          </div>

          <div className={`${styles.marqueeShell} mt-10 rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl`}>
            <div className={styles.marqueeFade} aria-hidden />
            <div className={styles.marquee}>
              {[0, 1].map((group) => (
                <div key={group} className={styles.marqueeGroup}>
                  {testimonials.map((testimonial) => (
                    <div
                      key={`${testimonial.name}-${group}`}
                      className="flex min-w-[260px] max-w-xs flex-col justify-between rounded-2xl border border-white/10 bg-black/30 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.45)]"
                    >
                      <p className="text-sm leading-6 text-white/75">“{testimonial.quote}”</p>
                      <div className="mt-5 space-y-1 text-sm font-medium text-white">
                        {testimonial.name}
                        <p className="text-xs font-normal text-white/50">{testimonial.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/15 bg-gradient-to-br from-fuchsia-500/25 via-indigo-500/20 to-sky-500/25 p-[1.5px]">
            <div className="relative rounded-[30px] bg-slate-950/85 px-8 py-14 text-center backdrop-blur-3xl sm:px-16">
              <div className={styles.gridPulse} aria-hidden />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <p className="text-xs uppercase tracking-[0.6em] text-white/60">YC energy · spiritual depth</p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                  Join the founding cohort bringing humility recovery into the future.
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-white/70">
                  We are onboarding partners who believe recovery is sacred, data-informed, and high craft. If that resonates, you’re family.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/signup" className={`${styles.ctaGlow} rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-wide text-slate-950`}>
                    Request invite
                    <ArrowUpRight className="h-4 w-4" />
                    <span aria-hidden />
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white/70 backdrop-blur transition hover:border-white/40 hover:text-white"
                  >
                    I already have an account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
