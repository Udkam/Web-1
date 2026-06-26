import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ArrowUpRight, Award, Crown, Menu, X } from "lucide-react";

const navLinks = ["Lab", "Text", "Backgrounds", "Contact"];

const videoUrl =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260606_154941_df1a96e1-a06f-450c-bd02-d863414cc1a0.mp4";

const decryptCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&";

function GradientText({
  children,
  colors = ["#f7ff5a", "#50d5ff", "#ff6b4a", "#f8f5ed"],
  className = "",
}: {
  children: ReactNode;
  colors?: string[];
  className?: string;
}) {
  return (
    <span
      className={`rb-gradient-text ${className}`}
      style={{ "--gradient-colors": colors.join(", ") } as CSSProperties}
    >
      {children}
    </span>
  );
}

function ShinyText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return <span className={`rb-shiny-text ${className}`}>{text}</span>;
}

function GlitchText({
  children,
  className = "",
  enableOnHover = false,
}: {
  children: string;
  className?: string;
  enableOnHover?: boolean;
}) {
  return (
    <span
      className={`rb-glitch-text ${enableOnHover ? "is-hover" : ""} ${className}`}
      data-text={children}
    >
      {children}
    </span>
  );
}

function TextType({
  phrases,
  className = "",
}: {
  phrases: string[];
  className?: string;
}) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const phrase = phrases[phraseIndex % phrases.length];

  useEffect(() => {
    const atEnd = characterIndex === phrase.length;
    const atStart = characterIndex === 0;
    const delay = atEnd && !isDeleting ? 1200 : isDeleting ? 28 : 46;

    const timeout = window.setTimeout(() => {
      if (atEnd && !isDeleting) {
        setIsDeleting(true);
        return;
      }

      if (atStart && isDeleting) {
        setIsDeleting(false);
        setPhraseIndex((index) => (index + 1) % phrases.length);
        return;
      }

      setCharacterIndex((index) => index + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [characterIndex, isDeleting, phrase.length, phrases.length]);

  return (
    <span className={`rb-text-type ${className}`}>
      <span>{phrase.slice(0, characterIndex)}</span>
      <span className="rb-text-cursor" aria-hidden="true">
        |
      </span>
    </span>
  );
}

function DecryptedText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const randomCharacter = useCallback(() => {
    return decryptCharacters[Math.floor(Math.random() * decryptCharacters.length)];
  }, []);

  const run = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    let iteration = 0;
    intervalRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((character, index) => {
            if (character === " ") return " ";
            return index < iteration ? character : randomCharacter();
          })
          .join(""),
      );

      iteration += 0.45;

      if (iteration >= text.length) {
        setDisplayText(text);
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 34);
  }, [randomCharacter, text]);

  useEffect(() => {
    const timeout = window.setTimeout(run, 500);
    return () => {
      window.clearTimeout(timeout);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [run]);

  return (
    <span
      aria-label={text}
      className={`rb-decrypted-text ${className}`}
      onMouseEnter={run}
    >
      {displayText}
    </span>
  );
}

function RotatingText({
  texts,
  className = "",
}: {
  texts: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % texts.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [texts.length]);

  return (
    <span className={`rb-rotating-text ${className}`}>
      <span key={texts[index]}>{texts[index]}</span>
    </span>
  );
}

function CountUp({
  to,
  suffix = "",
  className = "",
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let frame = 0;
    const start = performance.now();
    const duration = 1500;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, to]);

  return (
    <span className={className} ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

function CircularText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const letters = Array.from(text);

  return (
    <div className={`rb-circular-text ${className}`} aria-label={text}>
      {letters.map((letter, index) => {
        const transform = `rotate(${(360 / letters.length) * index}deg) translateY(-4.7rem)`;
        return (
          <span aria-hidden="true" key={`${letter}-${index}`} style={{ transform }}>
            {letter}
          </span>
        );
      })}
    </div>
  );
}

function CurvedLoop({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const id = `curve-${useId().replace(/:/g, "")}`;
  const repeatedText = `${text}   ${text}   ${text}   `;

  return (
    <div className={`rb-curved-loop ${className}`}>
      <svg viewBox="0 0 1440 180" role="img" aria-label={text}>
        <defs>
          <path id={id} d="M -120 90 Q 360 10 720 90 T 1560 90" />
        </defs>
        <text>
          <textPath href={`#${id}`} startOffset="0%">
            <animate attributeName="startOffset" from="0%" to="-100%" dur="18s" repeatCount="indefinite" />
            {repeatedText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

function StarBorder({
  children,
  className = "",
  color = "#f7ff5a",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <button
      className={`rb-star-border ${className}`}
      style={{ "--star-color": color } as CSSProperties}
      type="button"
    >
      <span>{children}</span>
    </button>
  );
}

function ElectricBorder({
  children,
  className = "",
  color = "#50d5ff",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={`rb-electric-border ${className}`}
      style={{ "--electric-color": color } as CSSProperties}
    >
      <div className="rb-electric-border__content">{children}</div>
    </div>
  );
}

function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(80, 213, 255, 0.24)",
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    node.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <div className={`rb-spotlight-card ${className}`} onMouseMove={handleMouseMove} ref={ref}>
      {children}
    </div>
  );
}

function Waves({
  className = "",
  lineColor = "rgba(248, 245, 237, 0.2)",
}: {
  className?: string;
  lineColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.strokeStyle = lineColor;

      const pointer = pointerRef.current;
      const timeScale = time * 0.001;

      for (let y = -28; y < height + 28; y += 24) {
        context.beginPath();
        for (let x = -24; x < width + 24; x += 12) {
          const distance = Math.hypot(pointer.x - x, pointer.y - y);
          const influence = Math.max(0, 1 - distance / 260);
          const wave = Math.sin(x * 0.018 + timeScale * 1.8 + y * 0.012) * 10;
          const pull = influence * Math.sin(distance * 0.035 - timeScale * 6) * 24;
          const nextY = y + wave + pull;

          if (x === -24) {
            context.moveTo(x, nextY);
          } else {
            context.lineTo(x, nextY);
          }
        }
        context.stroke();
      }

      frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [lineColor]);

  return (
    <div className={`rb-waves ${className}`} ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}

function FourCSignature() {
  return (
    <div className="four-c-signature" aria-label="4c writing animation">
      <svg viewBox="0 0 980 560" role="img">
        <title>4c</title>
        <defs>
          <mask id="four-first-stroke-mask" maskUnits="userSpaceOnUse">
            <path
              className="four-c-reveal four-c-reveal--first"
              d="M 522 42 C 382 108 204 260 96 410 C 66 452 64 486 91 503 C 133 530 226 481 326 478 C 421 476 508 493 566 525"
              fill="none"
              pathLength="1"
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="178"
            />
          </mask>
          <mask id="four-second-stroke-mask" maskUnits="userSpaceOnUse">
            <path
              className="four-c-reveal four-c-reveal--second"
              d="M 502 188 C 438 273 344 408 236 538"
              fill="none"
              pathLength="1"
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="132"
            />
          </mask>
          <mask id="c-stroke-mask" maskUnits="userSpaceOnUse">
            <path
              className="four-c-reveal four-c-reveal--third"
              d="M 796 262 C 721 226 600 250 526 321 C 455 389 477 459 563 466 C 665 474 799 402 923 305"
              fill="none"
              pathLength="1"
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="154"
            />
          </mask>
        </defs>

        <g className="four-c-shapes">
          <path
            className="four-c-shape four-c-shape--four"
            d="M 506 21 C 376 82 196 244 91 391 C 59 435 54 480 82 509 C 116 544 187 511 273 496 C 373 478 480 486 542 520 C 566 533 586 500 567 480 C 526 436 428 418 319 420 C 245 421 181 438 132 460 C 176 346 349 166 526 67 C 552 52 536 7 506 21 Z"
            mask="url(#four-first-stroke-mask)"
          />
          <path
            className="four-c-shape four-c-shape--four"
            d="M 485 161 C 402 259 313 391 230 515 C 207 549 247 581 274 546 C 357 440 445 310 526 204 C 546 178 510 132 485 161 Z"
            mask="url(#four-second-stroke-mask)"
          />
          <path
            className="four-c-shape four-c-shape--c"
            d="M 761 220 C 685 198 562 237 502 320 C 444 402 489 482 589 480 C 685 478 795 414 924 312 C 951 291 930 251 901 269 C 795 339 708 396 626 422 C 563 442 523 421 540 374 C 562 315 644 269 725 261 C 776 256 801 273 799 296 C 797 324 748 354 683 366 C 650 371 628 368 611 362 C 632 388 681 394 735 376 C 808 352 848 301 825 260 C 813 239 793 227 761 220 Z M 753 278 C 720 275 660 289 637 318 C 659 323 700 318 734 305 C 761 294 774 282 753 278 Z"
            fillRule="evenodd"
            mask="url(#c-stroke-mask)"
          />
        </g>
      </svg>
    </div>
  );
}

const showcaseEffects = [
  {
    name: "GradientText",
    category: "Text",
    accent: "#f7ff5a",
    demo: <GradientText>Chromatic identities</GradientText>,
  },
  {
    name: "ShinyText",
    category: "Text",
    accent: "#f8f5ed",
    demo: <ShinyText text="Light sweeps through the mark" />,
  },
  {
    name: "GlitchText",
    category: "Text",
    accent: "#ff6b4a",
    demo: <GlitchText enableOnHover>DISRUPT</GlitchText>,
  },
  {
    name: "DecryptedText",
    category: "Text",
    accent: "#50d5ff",
    demo: <DecryptedText text="SIGNAL ACQUIRED" />,
  },
  {
    name: "TextType",
    category: "Text",
    accent: "#95f0c8",
    demo: <TextType phrases={["Brand engines", "Motion systems", "Launch pages"]} />,
  },
  {
    name: "RotatingText",
    category: "Text",
    accent: "#ffb85a",
    demo: <RotatingText texts={["Design", "Disrupt", "Conquer"]} />,
  },
  {
    name: "CountUp",
    category: "Data",
    accent: "#f7ff5a",
    demo: (
      <span className="count-demo">
        <CountUp to={250} suffix="+" />
      </span>
    ),
  },
  {
    name: "CircularText",
    category: "Text",
    accent: "#50d5ff",
    demo: <CircularText text="VANGUARD MOTION " />,
  },
  {
    name: "CurvedLoop",
    category: "Text",
    accent: "#ff6b4a",
    demo: <CurvedLoop text="CREATIVE SYSTEMS IN MOTION" />,
  },
  {
    name: "StarBorder",
    category: "Animation",
    accent: "#f7ff5a",
    demo: <StarBorder>Launch Signal</StarBorder>,
  },
  {
    name: "ElectricBorder",
    category: "Animation",
    accent: "#50d5ff",
    demo: (
      <ElectricBorder>
        <span>Electric frame</span>
      </ElectricBorder>
    ),
  },
  {
    name: "SpotlightCard",
    category: "Component",
    accent: "#95f0c8",
    demo: (
      <SpotlightCard>
        <span>Focused surface</span>
      </SpotlightCard>
    ),
  },
  {
    name: "Waves",
    category: "Background",
    accent: "#ffb85a",
    demo: (
      <div className="waves-demo">
        <Waves lineColor="rgba(255, 184, 90, 0.42)" />
      </div>
    ),
  },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    void videoRef.current?.play().catch(() => undefined);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <section className="hero-section" id="top">
        <video
          aria-hidden="true"
          autoPlay
          className="hero-video"
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
        <div className="hero-scrim" aria-hidden="true" />
        <Waves className="hero-waves" />
        <FourCSignature />

        <header className="site-header">
          <a className="brand-mark font-podium" href="#top" onClick={closeMenu}>
            VANGUARD
          </a>

          <nav aria-label="Primary navigation" className="desktop-nav">
            {navLinks.map((link) => (
              <a href={`#${link.toLowerCase()}`} key={link}>
                {link}
              </a>
            ))}
          </nav>

          <a className="desktop-cta" href="#contact">
            Get in touch
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>

          <button
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
          </button>
        </header>

        <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <div className="mobile-menu__bar">
            <span className="font-podium">VANGUARD</span>
            <button aria-label="Close navigation menu" onClick={closeMenu} type="button">
              <X aria-hidden="true" size={24} />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {navLinks.map((link, index) => (
              <a
                href={`#${link.toLowerCase()}`}
                key={link}
                onClick={closeMenu}
                style={{ transitionDelay: `${index * 80 + 100}ms` }}
              >
                {link}
              </a>
            ))}
          </nav>
          <a className="mobile-menu__cta" href="#contact" onClick={closeMenu}>
            Get in touch
          </a>
        </div>

        <main className="hero-content">
          <div className="hero-kicker">
            <Crown aria-hidden="true" size={16} />
            <ShinyText text="ReactBits motion collection" />
          </div>

          <h1 className="hero-title font-podium">
            <GlitchText>VANGUARD</GlitchText>
            <span>
              builds brand systems with <GradientText>living motion</GradientText>
            </span>
          </h1>

          <p className="hero-copy">
            <TextType
              phrases={[
                "Text effects, kinetic borders, responsive backgrounds.",
                "A launch page assembled from 13 ReactBits-style primitives.",
                "Built for visual testing across desktop and mobile.",
              ]}
            />
          </p>

          <div className="hero-actions">
            <StarBorder>
              Explore effects
              <ArrowUpRight aria-hidden="true" size={16} />
            </StarBorder>
            <div className="award-note">
              <Award aria-hidden="true" size={34} />
              <span>
                Curated
                <br />
                Motion Stack
              </span>
            </div>
          </div>

          <div className="hero-stats" aria-label="Vanguard studio statistics">
            <div>
              <CountUp to={13} suffix="+" />
              <span>ReactBits effects</span>
            </div>
            <div>
              <CountUp to={4} />
              <span>Effect families</span>
            </div>
            <div>
              <CountUp to={100} suffix="%" />
              <span>Responsive pass</span>
            </div>
          </div>
        </main>
      </section>

      <section className="showcase-section" id="lab">
        <div className="section-heading">
          <p>Motion lab</p>
          <h2>Thirteen selected ReactBits effects arranged as one website.</h2>
        </div>

        <div className="effects-grid" id="text">
          {showcaseEffects.map((effect) => (
            <article
              className="effect-card"
              data-reactbits-effect={effect.name}
              key={effect.name}
              style={{ "--accent": effect.accent } as CSSProperties}
            >
              <div className="effect-card__meta">
                <span>{effect.category}</span>
                <strong>{effect.name}</strong>
              </div>
              <div className="effect-card__stage">{effect.demo}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="background-section" id="backgrounds">
        <Waves className="background-section__waves" lineColor="rgba(80, 213, 255, 0.2)" />
        <CurvedLoop text="VANGUARD REACTBITS MOTION INDEX" />
        <div className="background-section__content">
          <ElectricBorder color="#ff6b4a">
            <div>
              <span>ElectricBorder</span>
              <strong>signal frame</strong>
            </div>
          </ElectricBorder>
          <SpotlightCard>
            <span>SpotlightCard</span>
            <strong>cursor-lit surface</strong>
          </SpotlightCard>
          <CircularText text="TEXT BACKGROUND MOTION " />
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p>VANGUARD</p>
          <h2>
            Ship motion systems that feel deliberate, not decorative.
          </h2>
        </div>
        <a href="mailto:hello@vanguard.example">
          hello@vanguard.example
          <ArrowUpRight aria-hidden="true" size={18} />
        </a>
      </section>
    </div>
  );
}

export default App;
