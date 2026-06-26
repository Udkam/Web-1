import { useState } from "react";
import {
  ArrowRight,
  Boxes,
  Check,
  ChevronDown,
  CircleDot,
  ExternalLink,
  Grid3X3,
  Hand,
  Layers3,
  Menu,
  MousePointer2,
  PencilRuler,
  Send,
  Sparkles,
  Star,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import collageImage from "./assets/neo-brutal-collage.png";

type Principle = {
  icon: LucideIcon;
  title: string;
  body: string;
  color: "red" | "yellow" | "violet" | "white";
};

type KitItem = {
  label: string;
  title: string;
  body: string;
  marker: string;
  tilt: "left" | "right" | "none";
};

type FaqItem = {
  question: string;
  answer: string;
};

const navItems = ["Style", "System", "Kit", "Rules"];

const marqueeItems = [
  "BORDER-4",
  "HARD SHADOWS",
  "NO BLUR",
  "LOUD COLOR",
  "STICKER LAYERS",
  "PUSH BUTTONS",
  "HALFTONE DOTS",
  "RAW WEB",
];

const principles: Principle[] = [
  {
    icon: Boxes,
    title: "Border first",
    body: "Every visual object earns its place with a thick black stroke and a visible edge.",
    color: "yellow",
  },
  {
    icon: MousePointer2,
    title: "Mechanical clicks",
    body: "Buttons travel into their shadows instead of dissolving into soft hover states.",
    color: "red",
  },
  {
    icon: Layers3,
    title: "Sticker stack",
    body: "Rotated labels, badges, and cards overlap like a zine board that still obeys layout.",
    color: "violet",
  },
  {
    icon: Grid3X3,
    title: "Pattern noise",
    body: "Halftone, graph paper, and copy-shop texture replace polished gradients.",
    color: "white",
  },
];

const kitItems: KitItem[] = [
  {
    label: "01 / Tokens",
    title: "One palette, zero timidity",
    body: "Cream canvas, pure black structure, hot red action, vivid yellow signal, and violet depth.",
    marker: "#FFFDF5",
    tilt: "left",
  },
  {
    label: "02 / Type",
    title: "Heavy words behave like blocks",
    body: "Space Grotesk carries huge display headlines, stroked text, and compact uppercase labels.",
    marker: "900",
    tilt: "right",
  },
  {
    label: "03 / Components",
    title: "Cards lift, buttons press, forms snap",
    body: "Motion is physical and direct, with no blur, no glass, and no subtle gray states.",
    marker: "4PX",
    tilt: "none",
  },
];

const checklist = [
  "Thick black borders on containers",
  "Hard offset shadows with zero blur",
  "Text stroke display typography",
  "Rotated stickers and overlapping badges",
  "Marquee divider and halftone texture",
  "Accessible focus and touch targets",
];

const faqs: FaqItem[] = [
  {
    question: "Why no subtle gray?",
    answer:
      "Neo-brutalism uses black as structure and color as signal. A middle gray makes the interface feel polite, which is the wrong energy here.",
  },
  {
    question: "Can it still be usable?",
    answer:
      "Yes. The mess is planned: semantic HTML, high contrast, clear hit areas, and predictable stacked layouts keep the interface usable.",
  },
  {
    question: "What changes on mobile?",
    answer:
      "The same thick borders and shadows remain, but cards stack, shadows shrink, buttons stretch, and decorative chaos gets clipped.",
  },
];

function BrutalButton({
  children,
  variant = "primary",
  full = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "black";
  full?: boolean;
}) {
  return (
    <button
      className={`brutal-button brutal-button--${variant} ${full ? "brutal-button--full" : ""}`}
      type="button"
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={22} strokeWidth={3.2} />
    </button>
  );
}

function Sticker({
  children,
  color = "yellow",
  tilt = "right",
}: {
  children: React.ReactNode;
  color?: "red" | "yellow" | "violet" | "black" | "white";
  tilt?: "left" | "right" | "none";
}) {
  return <span className={`sticker sticker--${color} sticker--${tilt}`}>{children}</span>;
}

function PrincipleCard({ item, index }: { item: Principle; index: number }) {
  const Icon = item.icon;

  return (
    <article className={`principle-card principle-card--${item.color} tilt-${index % 2 === 0 ? "left" : "right"}`}>
      <div className="icon-block" aria-hidden="true">
        <Icon size={34} strokeWidth={3.2} />
      </div>
      <p className="label">Rule 0{index + 1}</p>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </article>
  );
}

function KitCard({ item }: { item: KitItem }) {
  return (
    <article className={`kit-card tilt-${item.tilt}`}>
      <div className="kit-card__marker">{item.marker}</div>
      <p className="label">{item.label}</p>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </article>
  );
}

function FaqRow({
  item,
  open,
  onToggle,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="faq-row">
      <button className="faq-row__trigger" type="button" onClick={onToggle} aria-expanded={open}>
        <span>{item.question}</span>
        <ChevronDown aria-hidden="true" className={open ? "is-open" : ""} strokeWidth={3.2} />
      </button>
      {open ? <p>{item.answer}</p> : null}
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="logo" href="#top" aria-label="LOUDLAB home">
          <Sparkles aria-hidden="true" size={24} strokeWidth={3.4} fill="currentColor" />
          <span>LOUDLAB</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>

        <BrutalButton variant="secondary">Remix it</BrutalButton>

        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X aria-hidden="true" strokeWidth={3.4} /> : <Menu aria-hidden="true" strokeWidth={3.4} />}
        </button>
      </header>

      {menuOpen ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>
              {item}
              <ExternalLink aria-hidden="true" size={18} strokeWidth={3} />
            </a>
          ))}
        </nav>
      ) : null}

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <Sticker color="yellow" tilt="left">
              Anti-smooth interface kit
            </Sticker>
            <h1>
              <span>MAKE</span>
              <span className="stroke-text">NOISE</span>
              <span>VISIBLE</span>
            </h1>
            <p>
              A full Neo-brutalist rebuild: thick borders, hard shadows, sticker layering,
              loud color blocks, and tactile interactions that refuse to disappear.
            </p>
            <div className="hero-actions">
              <BrutalButton variant="primary">Start loud</BrutalButton>
              <BrutalButton variant="outline">Inspect tokens</BrutalButton>
            </div>
          </div>

          <aside className="hero-board" aria-label="Neo-brutalist visual collage">
            <img src={collageImage} alt="Neo-brutalist collage of bordered web windows, arrows, halftone dots, stars, and color blocks" />
            <div className="floating-badge floating-badge--top">
              <Star aria-hidden="true" size={24} strokeWidth={3.5} fill="currentColor" />
              RAW WEB
            </div>
            <div className="floating-badge floating-badge--bottom">4PX OR BUST</div>
          </aside>

          <div className="shape shape--red" aria-hidden="true" />
          <div className="shape shape--violet" aria-hidden="true" />
        </section>

        <section className="marquee-section" aria-label="Neo-brutalist style signatures">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`}>
                <Zap aria-hidden="true" size={24} strokeWidth={3.2} fill="currentColor" />
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="section manifesto-section" id="style">
          <div className="section-heading">
            <p className="label">Style manifesto</p>
            <h2>Anti-corporate, high contrast, physically clickable.</h2>
          </div>
          <div className="manifesto-grid">
            {principles.map((item, index) => (
              <PrincipleCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </section>

        <section className="section split-section" id="system">
          <div className="poster-stack" aria-hidden="true">
            <div className="poster poster--yellow">
              <span>01</span>
              <strong>BLACK LINES</strong>
            </div>
            <div className="poster poster--red">
              <span>02</span>
              <strong>HARD SHADOW</strong>
            </div>
            <div className="poster poster--violet">
              <span>03</span>
              <strong>LOUD TYPE</strong>
            </div>
          </div>

          <div className="system-copy">
            <Sticker color="red" tilt="right">
              Token system
            </Sticker>
            <h2>
              Design tokens that hit the table with a <span>thud.</span>
            </h2>
            <p>
              The system is intentionally small and definitive: black for structure,
              cream for paper, three saturated paints for rhythm, and sharp rectangles
              for almost everything.
            </p>
            <div className="swatch-grid" aria-label="Neo-brutalist color palette">
              <span className="swatch swatch--cream">Cream</span>
              <span className="swatch swatch--red">Red</span>
              <span className="swatch swatch--yellow">Yellow</span>
              <span className="swatch swatch--violet">Violet</span>
              <span className="swatch swatch--black">Black</span>
            </div>
          </div>
        </section>

        <section className="section kit-section" id="kit">
          <div className="section-heading">
            <p className="label">Component kit</p>
            <h2>Reusable parts, deliberately unsubtle.</h2>
          </div>
          <div className="kit-grid">
            {kitItems.map((item) => (
              <KitCard key={item.title} item={item} />
            ))}
          </div>
        </section>

        <section className="interaction-lab">
          <div className="lab-panel">
            <div>
              <p className="label">Interaction lab</p>
              <h2>Push the block. Watch it answer.</h2>
              <p>
                Focus changes are visible, buttons press into the page, and controls keep
                generous touch targets without becoming generic mobile UI.
              </p>
            </div>
            <form className="signup-form" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="email">Drop your loudest interface note</label>
              <div className="input-row">
                <input id="email" type="email" placeholder="designer@example.com" />
                <button type="submit" aria-label="Send note">
                  <Send aria-hidden="true" size={24} strokeWidth={3.2} />
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="section rules-section" id="rules">
          <div className="rules-card">
            <div className="rules-card__header">
              <Hand aria-hidden="true" size={42} strokeWidth={3.2} />
              <h2>Completion rules</h2>
            </div>
            <div className="check-grid">
              {checklist.map((item) => (
                <div key={item}>
                  <Check aria-hidden="true" size={22} strokeWidth={3.4} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="faq-card">
            <p className="label">Questions</p>
            {faqs.map((item, index) => (
              <FaqRow
                key={item.question}
                item={item}
                open={openFaq === index}
                onToggle={() => setOpenFaq((value) => (value === index ? -1 : index))}
              />
            ))}
          </div>
        </section>

        <section className="closing-banner">
          <div>
            <CircleDot aria-hidden="true" size={46} strokeWidth={3.2} />
            <span>NO BLUR</span>
          </div>
          <div>
            <PencilRuler aria-hidden="true" size={46} strokeWidth={3.2} />
            <span>NO GRAY</span>
          </div>
          <div>
            <Star aria-hidden="true" size={46} strokeWidth={3.2} fill="currentColor" />
            <span>NO WHISPER</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <strong>LOUDLAB</strong>
        <span>Neo-brutalist design system rebuilt from DESIGN.md</span>
      </footer>
    </div>
  );
}
