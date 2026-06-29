import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Award, Crown, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Studio", href: "#studio" },
  { label: "Offerings", href: "#offerings" },
  { label: "Inquire", href: "#inquire" },
];

const videoUrl =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const showVideo = !prefersReducedMotion && !videoFailed;

  useEffect(() => {
    const menu = mobileMenuRef.current as (HTMLDivElement & { inert?: boolean }) | null;
    if (menu) menu.inert = !menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (prefersReducedMotion || videoFailed) {
      video.pause();
      return;
    }

    void video.play().catch(() => setVideoFailed(true));
  }, [prefersReducedMotion, videoFailed]);

  const closeMenu = () => setMenuOpen(false);
  const mobileTabIndex = menuOpen ? undefined : -1;

  return (
    <div className="site-shell">
      <section className="hero-section" id="top">
        {showVideo ? (
          <video
            aria-hidden="true"
            autoPlay
            className={`hero-video ${videoReady ? "is-ready" : ""}`}
            loop
            muted
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
            onLoadedData={(event) => {
              void event.currentTarget.play().catch(() => setVideoFailed(true));
            }}
            playsInline
            preload="auto"
            ref={videoRef}
            src={videoUrl}
          />
        ) : null}
        <div className={`hero-fallback ${!showVideo || !videoReady ? "is-visible" : ""}`} aria-hidden="true" />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-lines" aria-hidden="true" />

        <header className="site-header">
          <a className="brand-mark font-podium" href="#top" onClick={closeMenu}>
            VANGUARD
          </a>

          <nav aria-label="Primary navigation" className="desktop-nav">
            {navLinks.map((link) => (
              <a href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </nav>

          <a className="desktop-cta" href="#inquire">
            Get in touch
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>

          <button
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
          </button>
        </header>

        <div
          aria-hidden={!menuOpen}
          className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
          id="mobile-menu"
          ref={mobileMenuRef}
        >
          <div className="mobile-menu__bar">
            <span className="font-podium">VANGUARD</span>
            <button aria-label="Close navigation menu" onClick={closeMenu} tabIndex={mobileTabIndex} type="button">
              <X aria-hidden="true" size={24} />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {navLinks.map((link, index) => (
              <a
                href={link.href}
                key={link.label}
                onClick={closeMenu}
                style={{ transitionDelay: menuOpen ? `${index * 80 + 100}ms` : "0ms" }}
                tabIndex={mobileTabIndex}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a className="mobile-menu__cta" href="#inquire" onClick={closeMenu} tabIndex={mobileTabIndex}>
            Get in touch
          </a>
        </div>

        <main className="hero-content">
          <div className="hero-kicker">
            <Crown aria-hidden="true" size={16} />
            <span>World-Class Digital Collective</span>
          </div>

          <div className="hero-title-stack">
            <h1 className="hero-title font-podium">VANGUARD</h1>
            <div className="glitch-word font-podium" aria-hidden="true">
              <span>VANGUARD</span>
              <span>VANGUARD</span>
            </div>
          </div>

          <p className="hero-mantra font-podium" aria-label="Design. Disrupt. Conquer.">
            <span>Design.</span>
            <span>Disrupt.</span>
            <span>Conquer.</span>
          </p>

          <p className="hero-copy" id="studio">
            We build fierce brand identities that do not just turn heads -
            <strong> they lead.</strong>
          </p>

          <div className="hero-actions" id="inquire">
            <a className="primary-cta" href="#projects">
              See our work
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
            <a className="secondary-cta" href="#offerings">
              Start an inquiry
            </a>
            <div className="award-note" aria-label="Top-rated brand studio">
              <Award aria-hidden="true" size={34} />
              <span>
                Top-Rated
                <br />
                Brand Studio
              </span>
            </div>
          </div>

          <div className="hero-stats" id="projects" aria-label="VANGUARD studio statistics">
            <div>
              <strong>250+</strong>
              <span>Brands Transformed</span>
            </div>
            <div>
              <strong>95%</strong>
              <span>Client Retention</span>
            </div>
            <div id="offerings">
              <strong>10+</strong>
              <span>Years in the Game</span>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

export default App;
