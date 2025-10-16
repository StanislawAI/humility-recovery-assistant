import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  LineChart,
  Quote,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

const features = [
  {
    title: 'Precision prompts',
    description:
      'Generative AI keeps every reflection relevant to your season, capturing gratitude, humility wins, and tough lessons in under a minute.',
    icon: Sparkles,
  },
  {
    title: 'Momentum analytics',
    description:
      'Streaks, trendlines, and accountability scorecards built for founders and coaches who want to see measurable change.',
    icon: LineChart,
  },
  {
    title: 'Private by design',
    description:
      'Role-based sharing, end-to-end encryption, and audit-ready controls ensure the most personal work stays protected.',
    icon: ShieldCheck,
  },
]

const journey = [
  {
    title: 'Capture the moment',
    description:
      'Voice notes, quick prompts, or free-form text — designed for sub-60 second check-ins between investor calls and product sprints.',
  },
  {
    title: 'Reflect with intelligence',
    description:
      'Our assistant surfaces patterns, celebrates humility wins, and flags blind spots so you can lead with clarity.',
  },
  {
    title: 'Share accountability',
    description:
      'Push curated weekly digests to mentors, sponsors, or your exec coach with one tap — no copy/paste required.',
  },
]

const testimonials = [
  {
    quote:
      'This product gave our founding team a daily rhythm of grounded leadership. Investor updates now include how we are growing, not just ARR.',
    name: 'Amina K.',
    role: 'Founder, Lighthouse Recovery Labs',
  },
  {
    quote:
      'Humility Recovery Assistant is the only tool our clinicians recommend. It blends evidence-based practice with design our clients actually love.',
    name: 'Dr. Evan Miller',
    role: 'Medical Director, Pathway Collective',
  },
  {
    quote:
      'In two weeks our accelerator cohort had 88% daily completion. The insights feature is like having a leadership coach on demand.',
    name: 'Jared S.',
    role: 'Partner, Summit Ventures',
  },
]

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const primaryCta = {
    href: user ? '/dashboard' : '/signup',
    label: user ? 'Open your dashboard' : 'Request access',
  }

  const secondaryCta = {
    href: user ? '/dashboard/insights' : '/login',
    label: user ? 'View insights' : 'Sign in',
  }

  const welcomeMessage = user?.email
    ? `Welcome back, ${user.email.split('@')[0]}`
    : null

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 top-[-12rem] -z-10 h-[28rem] bg-gradient-to-b from-sky-500/20 via-slate-950 to-slate-950 blur-3xl" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.28),transparent_55%)]" />

        <header className="relative z-20 border-b border-white/10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
            <Link href="/" className="text-lg font-semibold tracking-tight text-white">
              Humility Recovery Assistant
            </Link>
            <nav className="hidden items-center gap-8 text-sm font-medium text-white/70 md:flex">
              <a href="#product" className="transition hover:text-white">
                Product
              </a>
              <a href="#features" className="transition hover:text-white">
                Why founders choose us
              </a>
              <a href="#testimonials" className="transition hover:text-white">
                Proof
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href={secondaryCta.href}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'hidden border border-white/10 bg-white/5 text-white hover:bg-white/10 md:inline-flex'
                )}
              >
                {secondaryCta.label}
              </Link>
              <Link
                href={primaryCta.href}
                className={cn(
                  buttonVariants({ size: 'sm' }),
                  'rounded-full bg-sky-400 px-5 py-2 text-slate-950 shadow-lg shadow-sky-500/25 transition hover:bg-sky-300'
                )}
              >
                {primaryCta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        <main>
          <section className="relative z-20 px-6 pb-24 pt-24 sm:pt-28" id="hero">
            <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
              <div className="space-y-9">
                <span className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-200">
                  YC-ready discipline
                  <span className="flex items-center gap-1 text-white">
                    <Sparkles className="h-4 w-4" />
                    Private beta
                  </span>
                </span>

                <div className="space-y-5">
                  <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Lead with humility.<br />
                    Scale with conviction.
                  </h1>
                  <p className="max-w-xl text-lg text-slate-300 sm:text-xl">
                    A daily operating system that keeps founders, clinicians, and recovery leaders grounded in the habits that unlock unstoppable teams.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={primaryCta.href}
                    className={cn(
                      buttonVariants({ size: 'lg' }),
                      'rounded-full bg-sky-400 px-8 py-6 text-base font-semibold text-slate-950 shadow-xl shadow-sky-500/35 transition hover:bg-sky-300'
                    )}
                  >
                    {primaryCta.label}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    href={secondaryCta.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'lg' }),
                      'rounded-full border border-white/15 bg-white/5 px-8 py-6 text-base text-white transition hover:border-white/25 hover:bg-white/10'
                    )}
                  >
                    {secondaryCta.label}
                  </Link>
                </div>

                <ul className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  {["Daily check-ins in under 60 seconds", "AI-powered summaries & insights", "Secure sharing with mentors", "Built with clinicians & YC founders"].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
                    >
                      <CheckCircle2 className="h-4 w-4 text-sky-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {welcomeMessage && (
                  <p className="text-sm text-sky-200/80">
                    {welcomeMessage}! Jump back into your momentum inside the dashboard.
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute -top-10 -right-10 hidden h-48 w-48 rounded-full bg-sky-500/30 blur-3xl lg:block" aria-hidden="true" />
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/20 p-8 shadow-2xl shadow-slate-900/70 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
                      Today
                    </span>
                    <span className="text-xs text-white/60">January 16 • 3 wins logged</span>
                  </div>
                  <div className="mt-6 space-y-5">
                    {[
                      {
                        title: 'Gratitude forward',
                        description: 'Shared the launch roadmap with humility. Invited feedback from the newest engineer first.',
                        tone: 'Momentum +12% week-over-week',
                      },
                      {
                        title: 'Trigger noted',
                        description: 'Realized I interrupted a teammate. Paused the meeting and reset expectations in real time.',
                        tone: 'Opportunity: practice active listening tomorrow',
                      },
                      {
                        title: 'Accountability partner',
                        description: 'Sent summary to coach. Asked for a call to plan conflict resolution playbook.',
                        tone: 'Shared snapshot delivered • 2 observers',
                      },
                    ].map((card) => (
                      <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-inner shadow-slate-900/20">
                        <div className="flex items-center justify-between text-xs text-white/60">
                          <span>{card.title}</span>
                          <Activity className="h-4 w-4 text-sky-300" />
                        </div>
                        <p className="mt-3 text-sm text-slate-100">
                          {card.description}
                        </p>
                        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-sky-200">
                          {card.tone}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-20 grid max-w-6xl gap-6 text-left sm:grid-cols-3">
              {[
                {
                  stat: '92% daily adherence',
                  detail: 'Founders maintain consistent check-ins after 30 days of use.',
                },
                {
                  stat: '5x faster reporting',
                  detail: 'Weekly accountability updates compile automatically in your tone.',
                },
                {
                  stat: 'Backed by clinicians',
                  detail: 'Built with board-certified partners and YC alum advisors.',
                },
              ].map((item) => (
                <div key={item.stat} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <p className="text-xl font-semibold text-white sm:text-2xl">{item.stat}</p>
                  <p className="mt-3 text-sm text-slate-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="features" className="relative border-y border-white/5 bg-slate-900/60 py-24">
            <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-sky-400/10 to-transparent blur-3xl" />
            <div className="mx-auto max-w-6xl px-6">
              <div className="max-w-3xl space-y-5 text-center">
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                  Crafted for leaders who build in the light
                </h2>
                <p className="text-lg text-slate-300">
                  We obsess over every touchpoint so your humility practice fits the pace of the Valley. No friction. No fluff.
                </p>
              </div>

              <div className="mt-16 grid gap-8 md:grid-cols-3">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 shadow-xl shadow-slate-950/40 transition hover:border-sky-400/40 hover:bg-slate-900/80"
                  >
                    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-400/20 text-sky-200">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="product" className="border-b border-white/5 bg-slate-950 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    An operating cadence for sustained humility
                  </h2>
                  <p className="text-lg text-slate-300">
                    Designed with YC founders, clinical directors, and executive coaches to reinforce the human side of high performance.
                  </p>
                  <div className="space-y-5">
                    {journey.map((step, index) => (
                      <div key={step.title} className="flex gap-4">
                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-semibold text-white/90">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                          <p className="mt-2 text-sm text-slate-300">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-8 hidden h-32 w-32 rounded-full bg-sky-500/20 blur-3xl lg:block" aria-hidden="true" />
                  <div className="relative grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-900/70">
                    <div className="rounded-2xl bg-slate-900/70 p-6 text-sm text-slate-200 shadow-inner shadow-sky-500/10">
                      “Morning standup prompt: Where will you create space for someone else&apos;s idea today?”
                    </div>
                    <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-6 text-sm text-slate-100">
                      <p className="font-medium text-sky-200">AI summary preview</p>
                      <p className="mt-3 text-sm text-slate-100">
                        Your humility streak is at <span className="font-semibold text-white">7 days</span>. You&apos;ve improved collaborative language by 18% this week. Celebrate by inviting a teammate to lead tomorrow&apos;s sync.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
                      <p className="font-medium text-white">Weekly digest</p>
                      <p className="mt-2 text-slate-300">
                        Forwarded to <span className="text-white">Coach Maya</span>, <span className="text-white">Sponsor Lee</span>
                      </p>
                      <p className="mt-4 text-xs uppercase tracking-[0.3em] text-sky-200">Auto-sent • Friday 4:00pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-white/5 bg-slate-900/50 py-24" id="testimonials">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                  Trusted by leaders who build with humility
                </h2>
                <p className="mt-4 text-lg text-slate-300">
                  From recovery clinics to venture-backed startups, Humility Recovery Assistant powers the inner work behind world-class execution.
                </p>
              </div>

              <div className="mt-16 grid gap-8 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.name}
                    className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-7 shadow-xl shadow-slate-950/50"
                  >
                    <Quote className="h-8 w-8 text-sky-300" />
                    <p className="mt-6 text-sm text-slate-200">“{testimonial.quote}”</p>
                    <div className="mt-8">
                      <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="relative py-24">
            <div className="absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-t from-sky-500/10 to-transparent blur-3xl" />
            <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-900/80 px-8 py-16 text-center shadow-2xl shadow-slate-950/60">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Ready to build a culture of humility?
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                Join a private cohort of founders and clinicians practicing the kind of leadership the Valley needs next.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href={primaryCta.href}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'rounded-full bg-sky-400 px-8 py-6 text-base font-semibold text-slate-950 shadow-xl shadow-sky-500/40 transition hover:bg-sky-300'
                  )}
                >
                  {primaryCta.label}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="mailto:hello@humilityrecovery.com"
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'lg' }),
                    'rounded-full border border-white/15 bg-white/5 px-8 py-6 text-base text-white transition hover:border-white/25 hover:bg-white/10'
                  )}
                >
                  Talk to a specialist
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-slate-950/90 py-10 text-sm text-white/60">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Humility Recovery Labs. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="mailto:hello@humilityrecovery.com" className="transition hover:text-white">
                Contact
              </Link>
              <Link href="/login" className="transition hover:text-white">
                Sign in
              </Link>
              <Link href="/signup" className="transition hover:text-white">
                Create account
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
