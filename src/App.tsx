import { useState } from "react";
import {
  Activity,
  ArrowRight,
  ChevronDown,
  Command,
  Cpu,
  Database,
  Eye,
  Gauge,
  Layers,
  Lock,
  Menu,
  Radio,
  Server,
  Shield,
  Terminal,
  Wifi,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import heroImage from "./assets/cyber-terminal-hero.png";

type CardItem = {
  icon: LucideIcon;
  title: string;
  body: string;
  signal: string;
};

type Tier = {
  name: string;
  price: string;
  label: string;
  items: string[];
  featured?: boolean;
};

const navItems = ["Grid", "Signals", "Tiers", "Trace"];

const metrics = [
  { value: "93.7%", label: "Signal integrity" },
  { value: "18 ms", label: "Trace latency" },
  { value: "404", label: "Open ports" },
  { value: "07", label: "Ghost relays" },
];

const protocolCards: CardItem[] = [
  {
    icon: Shield,
    title: "Blackwall Sentinel",
    body: "Volatile perimeter mapping with live breach heat and decoy injection.",
    signal: "DEFCON 03",
  },
  {
    icon: Cpu,
    title: "Neural Packet Forge",
    body: "Packet mutation pipelines built for hostile routes and dirty spectrum.",
    signal: "CPU 81%",
  },
  {
    icon: Radio,
    title: "Rogue Relay Mesh",
    body: "Encrypted repeaters hop across abandoned civic infrastructure.",
    signal: "12 NODES",
  },
  {
    icon: Eye,
    title: "Optic Noise Field",
    body: "Signal masks scatter identity vectors before the trace can anchor.",
    signal: "MASKED",
  },
  {
    icon: Database,
    title: "Cold Vault Index",
    body: "Fragmented data stores rebuild only under rotating session keys.",
    signal: "LOCKED",
  },
  {
    icon: Zap,
    title: "Surge Cutover",
    body: "Mechanical failover swaps routes in a four-step impulse cycle.",
    signal: "ARMED",
  },
];

const tiers: Tier[] = [
  {
    name: "Street",
    price: "09",
    label: "Low-light reconnaissance",
    items: ["2 ghost relays", "Manual trace scrub", "Terminal dispatch"],
  },
  {
    name: "Sprawl",
    price: "27",
    label: "Live breach orchestration",
    items: ["12 ghost relays", "Automated decoys", "Priority signal vault"],
    featured: true,
  },
  {
    name: "Void",
    price: "64",
    label: "Unregistered deep-grid access",
    items: ["Unlimited relays", "Zero-noise masking", "Blackwall override"],
  },
];

const faqs = [
  {
    question: "Can the relay mesh run cold?",
    answer:
      "Yes. Cold routes degrade visual telemetry but preserve identity shielding and packet mutation.",
  },
  {
    question: "What happens during a trace spike?",
    answer:
      "The grid drops into step-based cutover, forks decoys, and isolates the hottest relay cluster.",
  },
  {
    question: "Is operator motion reduced?",
    answer:
      "The interface follows system reduced-motion preferences and freezes nonessential glitch cycles.",
  },
];

const terminalLines = [
  "> boot blackice-grid --mode volatile",
  "> handshake relay.12 / spectral port 404",
  "> inject decoy packet: magenta-cyan-green",
  "> route established: rainline-bunker-07",
];

function CyberButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "glitch";
}) {
  return (
    <button className={`cyber-button cyber-button--${variant}`} type="button">
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
    </button>
  );
}

function ProtocolCard({ item, index }: { item: CardItem; index: number }) {
  const Icon = item.icon;

  return (
    <article className={`cyber-card protocol-card protocol-card--${index % 3}`}>
      <div className="icon-cell" aria-hidden="true">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <p className="micro-label">{item.signal}</p>
      <h3>{item.title}</h3>
      <p>{item.body}</p>
    </article>
  );
}

function AccessTier({ tier }: { tier: Tier }) {
  return (
    <article
      className={`cyber-card tier-card ${tier.featured ? "tier-card--featured" : ""}`}
    >
      <p className="micro-label">{tier.label}</p>
      <h3>{tier.name}</h3>
      <div className="tier-price">
        <span>{tier.price}</span>
        <small>/cycle</small>
      </div>
      <ul>
        {tier.items.map((item) => (
          <li key={item}>
            <Lock aria-hidden="true" size={16} strokeWidth={1.5} />
            {item}
          </li>
        ))}
      </ul>
      <CyberButton variant={tier.featured ? "glitch" : "secondary"}>
        Open route
      </CyberButton>
    </article>
  );
}

function FaqItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof faqs)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="faq-item">
      <button
        className="faq-trigger"
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>{item.question}</span>
        <ChevronDown aria-hidden="true" className={isOpen ? "rotate" : ""} />
      </button>
      {isOpen ? <p>{item.answer}</p> : null}
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand-mark" href="#top" aria-label="BLACKICE GRID home">
          <Command aria-hidden="true" size={22} strokeWidth={1.5} />
          <span>BLACKICE GRID</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
        <button className="header-cta" type="button">
          <Activity aria-hidden="true" size={18} strokeWidth={1.5} />
          <span>Live feed</span>
        </button>
        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      {menuOpen ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </nav>
      ) : null}

      <main id="top">
        <section
          className="hero-section"
          style={{ "--hero-image": `url(${heroImage})` } as React.CSSProperties}
        >
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="micro-label">Encrypted civic mesh / 2097.06</p>
            <h1 className="glitch-title" data-text="BLACKICE GRID">
              BLACKICE GRID
            </h1>
            <p className="type-line">
              Hostile signal command for operators inside the neon sprawl
              <span aria-hidden="true" />
            </p>
            <div className="hero-actions" aria-label="Primary actions">
              <CyberButton variant="glitch">Start trace</CyberButton>
              <CyberButton variant="primary">Inspect grid</CyberButton>
            </div>
          </div>

          <aside className="hero-hud" aria-label="Live grid readout">
            <div className="hud-header">
              <Terminal aria-hidden="true" size={18} strokeWidth={1.5} />
              <span>relay.terminal</span>
            </div>
            <div className="hud-grid">
              <span>Noise</span>
              <strong>11.4 db</strong>
              <span>Route</span>
              <strong>Tokyo-07</strong>
              <span>Pulse</span>
              <strong>88 hz</strong>
            </div>
            <div className="signal-bars" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </aside>
        </section>

        <section className="stats-strip" aria-label="Grid metrics">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </section>

        <section className="section terminal-section" id="grid">
          <div className="section-heading">
            <p className="micro-label">Operator console</p>
            <h2>Dirty routes, clean decisions.</h2>
          </div>
          <div className="terminal-panel">
            <div className="terminal-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="terminal-body">
              {terminalLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p>
                &gt; awaiting operator input
                <span className="cursor" aria-hidden="true" />
              </p>
            </div>
          </div>
        </section>

        <section className="section protocol-section" id="signals">
          <div className="section-heading section-heading--wide">
            <p className="micro-label">Protocol matrix</p>
            <h2>Signal architecture for unstable streets.</h2>
          </div>
          <div className="protocol-grid">
            {protocolCards.map((item, index) => (
              <ProtocolCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </section>

        <section className="section split-section">
          <div className="visual-stack" aria-hidden="true">
            <div className="radar-dial">
              <Gauge size={42} strokeWidth={1.5} />
              <span />
            </div>
            <div className="route-map">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="split-copy">
            <p className="micro-label">Asymmetric cutover</p>
            <h2>Every route can lie. The grid still has to answer.</h2>
            <p>
              BLACKICE GRID treats interference as terrain. Trace heat, relay
              decay, and identity drift collapse into one operator surface built
              for rapid, mechanical choices.
            </p>
            <div className="chip-row" aria-label="Active modules">
              <span>
                <Server aria-hidden="true" size={16} strokeWidth={1.5} />
                relay farm
              </span>
              <span>
                <Layers aria-hidden="true" size={16} strokeWidth={1.5} />
                packet strata
              </span>
              <span>
                <Wifi aria-hidden="true" size={16} strokeWidth={1.5} />
                ghost band
              </span>
            </div>
          </div>
        </section>

        <section className="section tiers-section" id="tiers">
          <div className="section-heading">
            <p className="micro-label">Access tiers</p>
            <h2>Choose the depth of the breach.</h2>
          </div>
          <div className="tiers-grid">
            {tiers.map((tier) => (
              <AccessTier key={tier.name} tier={tier} />
            ))}
          </div>
        </section>

        <section className="section trace-section" id="trace">
          <div className="section-heading">
            <p className="micro-label">Trace log</p>
            <h2>Noise remembers the operator.</h2>
          </div>
          <div className="faq-list">
            {faqs.map((item, index) => (
              <FaqItem
                key={item.question}
                item={item}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq((value) => (value === index ? -1 : index))}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <span>BLACKICE GRID</span>
        <span>signal::2097 / relay::tokyo-07 / status::volatile</span>
      </footer>
    </div>
  );
}
