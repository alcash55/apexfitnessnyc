'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ChartColumn, Dna, Shield, Zap } from 'lucide-react';

const CREDENTIALS = [
  {
    num: '01',
    title: 'Certified Strength & Conditioning Specialist (CSCS)',
    body: 'The gold standard in performance coaching. Earned through rigorous study of biomechanics, exercise physiology, and periodization science, and applied specifically to the hormonal and musculoskeletal realities of men 40+.',
  },
  {
    num: '02',
    title: 'Precision Nutrition Certified Coach',
    body: 'Trained in the science of hormone-optimized eating for the aging male. Carb timing, leucine thresholds, and anti-inflammatory protocols are core tools, not buzzwords.',
  },
  {
    num: '03',
    title: '5+ Years Coaching Men 40+ in NYC',
    body: 'Over five years spent exclusively coaching the demographic most underserved by the fitness industry.',
  },
  {
    num: '04',
    title: 'Applied Endocrinology & Longevity Research',
    body: 'Deep study of the clinical research on testosterone decline, sarcopenia, inflammaging, and metabolic shifts after 40. The APEX system is built on peer-reviewed science, not gym folklore.',
  },
];

const PHILOSOPHY = [
  {
    icon: Zap,
    title: 'Precision Over Volume',
    body: 'More is not better. The right stimulus, at the right time, with the right recovery: that is the equation. Every APEX session is engineered for maximum hormonal return with zero wasted effort.',
  },
  {
    icon: Dna,
    title: 'Biology-First Programming',
    body: 'Your physiology at 55 is not a limitation. It is a specification sheet. APEX is written to that spec. It is not adapted from a program designed for a 22-year-old who can recover overnight.',
  },
  {
    icon: ChartColumn,
    title: 'Data Drives Decisions',
    body: 'Subjective feel is not a protocol. APEX tracks body composition, strength output, and recovery markers. The Agentic Engine then synthesizes that data into your next optimized training block.',
  },
  {
    icon: Shield,
    title: 'Joint Longevity Is Non-Negotiable',
    body: 'You cannot build the body you want if your knees, shoulders, or lower back are always compromised. APEX uses trap bar variations, controlled eccentrics, and mandatory mobility work to make you bulletproof for the long game.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────── */}
      <section
        className="section"
        style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center' }}
      >
        <div
          className="section-inner"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div className="section-label">The Founder</div>
            <h1
              id="hero"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 6vw, 6rem)',
                lineHeight: 0.95,
                color: 'var(--cream)',
                letterSpacing: '0.02em',
                marginBottom: '2rem',
              }}
            >
              BUILT THIS
              <br />
              FOR YOU.
              <br />
              <span style={{ color: 'var(--gold)' }}>BECAUSE</span>
              <br />I LIVED IT.
            </h1>
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '1rem',
                lineHeight: 1.8,
                maxWidth: 480,
                marginBottom: '2.5rem',
              }}
            >
              I spent years watching the fitness industry ignore the men who needed it most: the
              50-year-old banker with bad knees, the 62-year-old executive who hadn&apos;t trained
              in a decade, the 48-year-old who kept getting hurt following programs designed for
              someone half his age. I built APEX to fix that. Real science, real precision, a system
              that actually respects your biology.
            </p>
            <Button asChild variant="unstyled">
              <a className="btn-gold" href="/pricing">
                Start Your Protocol{' '}
                <ArrowRight size={16} className="inline-block align-middle" aria-hidden="true" />
              </a>
            </Button>
          </div>

          {/* Stat card column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              {
                val: '10+',
                label: 'Years Coaching Men 40–70',
                sub: 'Exclusively NYC-based clientele',
              },
              { val: '22 lbs', label: 'Average Fat Loss', sub: 'Across 90-day program cohort' },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--charcoal)',
                  border: '1px solid var(--border)',
                  padding: '1.5rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    color: 'var(--gold)',
                    lineHeight: 1,
                    minWidth: '5rem',
                  }}
                >
                  {s.val}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--cream)',
                      fontSize: '0.88rem',
                    }}
                  >
                    {s.label}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                    {s.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credentials ────────────────────────────── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">Credentials</div>
          <h2 id="credentials" className="section-h2">
            The Expertise Behind
            <br />
            The System.
          </h2>
          <p className="section-sub" style={{ marginBottom: '4rem' }}>
            APEX is not built on gym hustle mythology. It&apos;s built on accredited science,
            clinical research, and over a decade of measured outcomes with real men.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {CREDENTIALS.map((c) => (
              <div
                key={c.num}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: '2rem',
                  padding: '2.5rem 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    color: 'var(--gold)',
                    opacity: 0.6,
                    lineHeight: 1,
                  }}
                >
                  {c.num}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--cream)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {c.title}
                  </h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy ─────────────────────────────── */}
      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="section-inner">
          <div className="section-label">The Method</div>
          <h2 id="philosophy" className="section-h2">
            The Four Pillars
            <br />
            of APEX.
          </h2>
          <p className="section-sub" style={{ marginBottom: '4rem' }}>
            Every decision in APEX training traces back to one of four core principles. No fluff. No
            filler. Just the mechanics of lasting physical transformation.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {PHILOSOPHY.map((p, i) => (
              <Card
                unstyled
                key={i}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  padding: '2.5rem 2rem',
                }}
              >
                <p.icon size={32} className="mb-5 text-gold" aria-hidden="true" />
                <h3
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--cream)',
                    marginBottom: '1rem',
                  }}
                >
                  {p.title}
                </h3>
                <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  {p.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agentic AI Training Dashboard ──────────── */}
      <section className="section">
        <div className="section-inner" style={{ paddingTop: '3rem' }}>
          {/* Dashboard toggle */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
            <Button
              variant="unstyled"
              style={{
                fontFamily: 'var(--font-condensed)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontSize: '0.82rem',
                padding: '0.65rem 1.75rem',
                border: '2px solid var(--gold)',
                background: 'var(--gold-dim)',
                color: 'var(--gold)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Curriculum View
            </Button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                phase: 'Month 1 — Foundation',
                focus: 'Joint Prep & Baseline Strength',
                detail:
                  'Machine-based compound lifts, controlled eccentrics, 3×10 rep ranges. Building the armor before loading the cannon.',
              },
              {
                phase: 'Month 2 — Accelerate',
                focus: 'MetCon & Hormonal Output',
                detail:
                  'Trap bar strength + sprint metabolic conditioning. Assault bike, sled, and rowing ergo work to spike testosterone naturally.',
              },
              {
                phase: 'Month 3 — Peak',
                focus: 'Max Output & Longevity',
                detail:
                  'Heavy tension loads, eccentric control techniques, and a Functional Output day that proves the system worked from Day 1.',
              },
            ].map((block, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--charcoal)',
                  border: '1px solid var(--border)',
                  padding: '2rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--gold)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {block.phase}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--cream)',
                    marginBottom: '1rem',
                    letterSpacing: '0.04em',
                    lineHeight: 1.3,
                  }}
                >
                  {block.focus}
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  {block.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div
          className="section-inner"
          style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>
            Ready to Start?
          </div>
          <h2 id="cta" className="section-h2" style={{ marginBottom: '1.5rem' }}>
            If Not Now, When?
          </h2>
          <p
            className="section-sub"
            style={{ margin: '0 auto 3rem', textAlign: 'center', maxWidth: 520 }}
          >
            You&apos;ve read the science. You&apos;ve seen the system. The only question is whether
            you&apos;re going to do something about it. The next 90 days are going to pass
            regardless.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button asChild variant="unstyled">
              <a className="btn-gold" href="/pricing">
                Choose Your Protocol{' '}
                <ArrowRight size={16} className="inline-block align-middle" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="unstyled">
              <a className="btn-outline" href="/">
                See The Method
              </a>
            </Button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 900px) {
          .about-hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .about-story-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
