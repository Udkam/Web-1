import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const navLinks = ["Home", "Projects", "Studio", "Reach Us"];

const videoUrl =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    void videoRef.current?.play().catch(() => undefined);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-geist">
      <video
        aria-hidden="true"
        autoPlay
        className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        loop
        muted
        onLoadedData={(event) => {
          void event.currentTarget.play().catch(() => undefined);
        }}
        playsInline
        preload="auto"
        ref={videoRef}
        src={videoUrl}
      />

      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-12 lg:px-16">
        <div className="flex items-center gap-8">
          <a
            className="inline-flex min-h-10 items-center text-lg font-semibold tracking-normal text-white sm:text-xl"
            href="#home"
            onClick={closeMobileMenu}
          >
            Foldcraft
          </a>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <a
                className="inline-flex min-h-10 min-w-10 items-center justify-center text-sm text-white/80 transition-colors hover:text-white"
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                key={link}
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <button
          className="hidden min-h-10 rounded-lg bg-white px-5 py-2 text-sm font-medium text-black transition-transform hover:scale-105 md:inline-flex md:items-center"
          type="button"
        >
          Let's Talk
        </button>

        <button
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="relative z-50 grid h-10 w-10 place-items-center text-white transition-transform active:scale-90 md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          type="button"
        >
          <Menu
            aria-hidden="true"
            className={`absolute h-6 w-6 transition-all duration-300 ${
              mobileMenuOpen
                ? "rotate-90 scale-75 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <X
            aria-hidden="true"
            className={`absolute h-6 w-6 transition-all duration-300 ${
              mobileMenuOpen
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-75 opacity-0"
            }`}
          />
        </button>
      </header>

      <div
        className={`absolute inset-x-0 top-0 z-20 overflow-hidden bg-black/98 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          mobileMenuOpen ? "h-screen opacity-100" : "pointer-events-none h-0 opacity-0"
        }`}
      >
        <div
          className={`flex h-full flex-col justify-center px-8 transition-all delay-100 duration-500 ${
            mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-6" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                className="inline-flex min-h-12 items-center text-3xl font-medium text-white/90 transition-colors hover:text-white"
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                key={link}
                onClick={closeMobileMenu}
              >
                {link}
              </a>
            ))}
          </nav>
          <button
            className="mt-6 min-h-12 w-fit rounded-full bg-white px-8 py-3.5 text-base font-medium text-black transition-transform hover:scale-105"
            onClick={closeMobileMenu}
            type="button"
          >
            Let's Talk
          </button>
        </div>
      </div>

      <main className="relative z-10 flex h-[calc(100vh-80px)] flex-col justify-between px-6 pb-10 pt-12 sm:pb-12 sm:pt-16 md:px-12 md:pb-16 md:pt-20 lg:px-16">
        <section className="max-w-3xl" id="home">
          <p className="mb-4 animate-[fadeSlideUp_0.8s_ease_0.2s_both] text-xs text-white/90 sm:mb-6 sm:text-sm">
            Brand &amp; Visual Storytelling
          </p>
          <h1 className="animate-[fadeSlideUp_0.8s_ease_0.4s_both] text-3xl font-medium leading-[1.1] tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Shaping visual
            <br />
            narratives,
            <br />
            one pixel at a time.
          </h1>
        </section>

        <section>
          <p className="mb-5 max-w-sm animate-[fadeSlideUp_0.8s_ease_0.7s_both] text-sm leading-relaxed text-white/60 sm:mb-6 sm:max-w-lg sm:text-base md:text-lg">
            Turning vision into reality through craft, motion, and an endless pursuit of beauty.
          </p>
          <button
            className="inline-flex min-h-10 animate-[fadeSlideUp_0.8s_ease_0.9s_both] items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105 sm:px-6 sm:py-3"
            type="button"
          >
            Explore Work
            <ArrowRight aria-hidden="true" size={16} />
          </button>
        </section>
      </main>
    </div>
  );
}
