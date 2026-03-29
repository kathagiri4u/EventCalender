import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { SPORT_SLUGS, SPORT_DISPLAY_NAMES } from '@/lib/constants'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-heading font-bold text-text-primary mb-3 text-lg">SportsCal</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Your game-day guide at the bar. All sports schedules in one place, updated twice
              daily.
            </p>
            <p className="text-sm text-text-muted mt-2">Austin, TX</p>
          </div>

          {/* Sports */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Sports</h4>
            <ul className="space-y-2">
              {SPORT_SLUGS.slice(0, 6).map((sport) => (
                <li key={sport}>
                  <Link
                    href={`/sport/${sport}`}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {SPORT_DISPLAY_NAMES[sport]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  Full Schedule
                </Link>
              </li>
              {SPORT_SLUGS.slice(6).map((sport) => (
                <li key={sport}>
                  <Link
                    href={`/sport/${sport}`}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {SPORT_DISPLAY_NAMES[sport]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-medium text-text-primary mb-3">Follow Us</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors"
              >
                <ExternalLink size={16} />
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-text-muted">
            © {year} SportsCal. Schedule data from ESPN, updated twice daily.
          </p>
          <p className="text-xs text-text-muted">All times Central Time (CT)</p>
        </div>
      </div>
    </footer>
  )
}
