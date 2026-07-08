import { useEffect, useRef } from "react";

const titleWords = ["Designing", "at", "the", "pixel", "level"];

const navLinks = [
  { label: "Portfolio", href: "#work" },
  { label: "Process", href: "#process" },
];

const metrics = [
  { id: "metric-1", value: "100%", label: "precision" },
  { id: "metric-2", value: "60fps", label: "performance" },
  { id: "metric-3", value: "Zero", label: "compromise" },
];

const portfolioCards = [
  {
    icon: "solar:pallete-2-linear",
    title: "Identity Systems",
    copy: "Monochrome brand languages with exacting digital rules, motion tokens, and launch-ready art direction.",
    meta: "Visual / Brand",
  },
  {
    icon: "solar:smartphone-update-linear",
    title: "Mobile Surfaces",
    copy: "Interface rebuilds where dense product behavior becomes calm, tactile, and legible on touch screens.",
    meta: "Product / Mobile",
  },
  {
    icon: "solar:chart-square-linear",
    title: "Data Rooms",
    copy: "Operational dashboards shaped around signal priority, exception states, and scan-speed decisions.",
    meta: "Console / Data",
  },
  {
    icon: "solar:video-frame-linear",
    title: "Launch Films",
    copy: "WebGL-backed narrative pages for product reveals, editorial campaigns, and interactive investor rooms.",
    meta: "Motion / WebGL",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Map the signal",
    copy: "We isolate the object, action, and proof that must survive the first viewport.",
  },
  {
    number: "02",
    title: "Engineer the surface",
    copy: "Typography, shader depth, motion timing, and component states are built as one visual system.",
  },
  {
    number: "03",
    title: "Stress the release",
    copy: "Desktop, mobile, focus, reduced motion, and scroll behavior are verified before the handoff.",
  },
];

function usePrefersReducedMotion() {
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotionRef;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const reducedMotionRef = usePrefersReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncTicker = () => {
      const ticker = window.gsap?.ticker;
      if (!ticker) return;
      if (mediaQuery.matches) {
        ticker.sleep();
      } else {
        ticker.wake();
      }
    };

    syncTicker();
    mediaQuery.addEventListener("change", syncTicker);
    return () => mediaQuery.removeEventListener("change", syncTicker);
  }, []);

  useEffect(() => {
    const heading = titleRef.current;
    if (!heading) return undefined;

    heading.replaceChildren();

    titleWords.forEach((word) => {
      const mask = document.createElement("span");
      mask.className = "hero-word-mask overflow-hidden";

      const span = document.createElement("span");
      span.textContent = word;
      span.className = [
        "hero-word will-change-transform block",
        word.toLowerCase() === "pixel" || word.toLowerCase() === "level" ? "hero-word-gradient" : "",
      ]
        .filter(Boolean)
        .join(" ");

      mask.appendChild(span);
      heading.appendChild(mask);
    });

    const gsap = window.gsap;
    if (!gsap) {
      heading.querySelectorAll<HTMLElement>(".hero-word").forEach((word) => {
        word.style.transform = "translateY(0)";
      });
      return undefined;
    }

    if (reducedMotionRef.current) {
      gsap.set(".hero-word", { y: 0 });
      gsap.set(".gsap-entrance", { opacity: 1, y: 0 });
      gsap.ticker?.sleep();
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-word",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.08,
        },
      );

      gsap.fromTo(
        ".gsap-entrance",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.1,
          delay: 0.2,
        },
      );

      gsap.to("#pulse-dot", {
        opacity: 0.22,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    });

    return () => ctx.revert();
  }, [reducedMotionRef]);

  useEffect(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return undefined;

    gsap.registerPlugin(ScrollTrigger);

    if (reducedMotionRef.current) {
      gsap.set("#canvas-wrapper", { y: "-8vh", rotate: 0 });
      gsap.ticker?.sleep();
      return undefined;
    }

    const tween = gsap.fromTo(
      "#canvas-wrapper",
      { y: "-15vh", rotate: 0 },
      {
        y: "50vh",
        rotate: 360,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reducedMotionRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
    });

    if (!gl) return undefined;

    const vertexSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;

      float sphereSdf(vec3 p, float radius) {
        return length(p) - radius;
      }

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = mat2(1.6, 1.2, -1.2, 1.6) * p;
          a *= 0.5;
        }
        return v;
      }

      float liquidField(vec2 p, float t) {
        vec2 m = (u_mouse - 0.5) * vec2(0.22, -0.12);
        p -= vec2(0.86, 0.10) + m;
        p.x *= 0.9;
        p.y *= 1.18;
        float a = atan(p.y, p.x);
        float r = length(p);
        float folds = sin(a * 7.0 + t * 1.4 + r * 8.0) * 0.045;
        folds += sin(a * 13.0 - t * 0.9 + r * 15.0) * 0.025;
        float n = fbm(p * 2.2 + vec2(t * 0.12, -t * 0.08)) * 0.16;
        vec2 q = p + normalize(p + 0.0001) * (folds + n);

        float field = 0.0;
        field += 0.25 / length(q - vec2(-0.06, 0.02));
        field += 0.18 / length(q - vec2(0.08, 0.22 + sin(t * 0.7) * 0.05));
        field += 0.20 / length(q - vec2(0.18, -0.13));
        field += 0.13 / length(q - vec2(-0.18, -0.18 + cos(t * 0.8) * 0.04));
        field += 0.11 / length(q - vec2(0.32, 0.03));
        return field;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float t = u_time;

        float centerGlow = exp(-dot(uv - vec2(-0.18, -0.03), uv - vec2(-0.18, -0.03)) * 2.2) * 0.18;
        float lowerGlow = exp(-dot(uv - vec2(-0.08, -0.72), uv - vec2(-0.08, -0.72)) * 4.2) * 0.09;

        float field = liquidField(uv, t);
        float body = smoothstep(1.65, 2.28, field);
        float edge = smoothstep(1.28, 1.88, field) - smoothstep(2.2, 2.74, field);

        float eps = 0.006;
        vec2 grad = vec2(liquidField(uv + vec2(eps, 0.0), t) - liquidField(uv - vec2(eps, 0.0), t), liquidField(uv + vec2(0.0, eps), t) - liquidField(uv - vec2(0.0, eps), t));
        vec3 normal = normalize(vec3(grad * 0.9, 0.22));
        vec3 light = normalize(vec3(-0.5, 0.45, 0.7));
        float diffuse = clamp(dot(normal, light), 0.0, 1.0);
        float spec = pow(clamp(dot(reflect(-light, normal), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 18.0);
        float veins = smoothstep(0.47, 0.52, fbm(uv * 7.0 + vec2(t * 0.08, t * 0.05))) * body * 0.18;

        float liquid = body * (0.06 + diffuse * 0.3) + edge * 0.16 + spec * 0.42 + veins;
        float grain = (hash(gl_FragCoord.xy + t) - 0.5) * 0.025;
        float value = centerGlow + lowerGlow + liquid + grain;
        float alpha = clamp(centerGlow * 1.2 + lowerGlow + body * 0.9 + edge * 0.45, 0.0, 0.94);

        gl_FragColor = vec4(vec3(value), alpha);
      }
    `;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return undefined;

    const program = gl.createProgram();
    if (!program) return undefined;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "a_position");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const mouse = gl.getUniformLocation(program, "u_mouse");
    const time = gl.getUniformLocation(program, "u_time");
    const pointer = { x: 0.5, y: 0.5 };
    let frame = 0;
    let start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const draw = (now: number) => {
      gl.useProgram(program);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(mouse, pointer.x, pointer.y);
      gl.uniform1f(time, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    let lastDraw = 0;
    const tick = (now: number) => {
      if (now - lastDraw > 30) {
        draw(now);
        lastDraw = now;
      }
      if (!reducedMotionRef.current) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
    };

    const handleMotionChange = () => {
      if (reducedMotionRef.current) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        draw(start);
        return;
      }

      if (!frame) {
        start = performance.now();
        frame = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", resize);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", handleMotionChange);

    draw(start);
    if (!reducedMotionRef.current) {
      frame = window.requestAnimationFrame(tick);
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", resize);
      mediaQuery.removeEventListener("change", handleMotionChange);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, [reducedMotionRef]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-neutral-100 antialiased selection:bg-neutral-800">
      <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.02] noise-overlay" aria-hidden="true" />

      <div id="canvas-wrapper" className="pointer-events-none fixed inset-0 z-0 ambient-mask will-change-transform" aria-hidden="true">
        <canvas ref={canvasRef} id="ambient-canvas" className="h-full w-full" />
      </div>

      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle,transparent_0%,rgba(8,8,8,0.85)_100%)]" aria-hidden="true" />

      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-7 mix-blend-difference sm:px-6 md:px-8">
        <a href="#top" className="font-inter text-xl font-thin tracking-tighter text-neutral-100">
          DESIGN
        </a>
        <nav className="flex min-w-0 justify-end gap-3 font-mono text-[9px] font-normal uppercase tracking-tight text-neutral-500 sm:gap-8 sm:text-xs" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex transition-colors duration-500 hover:text-neutral-200 focus-visible:text-neutral-200"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="top" className="relative z-10">
        <section className="flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-32 text-center md:px-8">
          <div className="gsap-entrance mb-8 inline-flex items-center gap-3 rounded-full border border-neutral-800/60 bg-neutral-900/40 px-5 py-2.5 font-mono text-[11px] font-light uppercase tracking-[0.2em] text-neutral-400 backdrop-blur-md">
            <span id="pulse-dot" className="h-1.5 w-1.5 rounded-full bg-neutral-300" aria-hidden="true" />
            Available for projects
          </div>

          <h1
            ref={titleRef}
            aria-label="Pixel engineered at the level"
            className="hero-title-text flex w-full max-w-5xl flex-wrap justify-center gap-x-[0.25em] font-inter text-[clamp(2.2rem,9vw,8.75rem)] font-thin leading-[0.95] tracking-[-0.05em] text-neutral-100"
          />

          <p className="hero-copy-text gsap-entrance mt-8 w-full max-w-lg font-inter text-sm font-extralight leading-[1.8] text-neutral-400 md:text-base">
            Award-winning web design and frontend engineering. Creating meticulously crafted, performant interfaces that redefine digital presence.
          </p>

          <div className="gsap-entrance mt-10 flex flex-wrap items-center justify-center gap-5">
            <a
              href="#work"
              className="inline-flex min-h-11 items-center gap-3 rounded-full border border-neutral-800/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-8 py-3.5 font-mono text-xs font-normal tracking-tight text-neutral-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition duration-500 hover:border-neutral-600 active:scale-[0.98]"
            >
              View portfolio
              <iconify-icon icon="solar:arrow-right-linear" aria-hidden="true" />
            </a>
            <a href="#contact" className="inline-flex min-h-11 items-center px-4 py-3.5 font-mono text-xs font-normal text-neutral-500 transition duration-500 hover:text-neutral-200 active:scale-[0.98]">
              Get in touch
            </a>
          </div>

          <div className="gsap-entrance mt-14 grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">
            {metrics.map((metric, index) => (
              <div className="contents" key={metric.id}>
                <div className="text-center">
                  <p id={metric.id} className="metric-text font-inter text-5xl font-thin tracking-tighter md:text-6xl">
                    {metric.value}
                  </p>
                  <p className="mt-3 font-mono text-[11px] font-light uppercase tracking-[0.2em] text-neutral-500">{metric.label}</p>
                </div>
                {index < metrics.length - 1 ? <div className="hidden h-20 w-px bg-gradient-to-b from-transparent via-neutral-800 to-transparent md:block" aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        </section>

        <section id="work" className="px-6 py-32 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="gsap-entrance mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-mono text-xs font-light uppercase tracking-[0.2em] text-neutral-500">Selected systems</p>
                <h2 className="mt-3 max-w-2xl font-inter text-5xl font-thin tracking-tighter text-neutral-100 md:text-7xl">
                  Built for visual pressure and exact release states.
                </h2>
              </div>
              <p className="max-w-sm font-inter text-base font-extralight leading-[1.8] text-neutral-500">
                Each card keeps the glass surface, masked one-pixel border, and monochrome palette from the reference.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {portfolioCards.map((card) => (
                <article
                  key={card.title}
                  className="masked-card gsap-entrance group relative overflow-hidden rounded-[2rem] bg-neutral-900/40 p-6 backdrop-blur-md transition duration-500 hover:scale-[1.02]"
                >
                  <div className="mb-16 flex items-start justify-between gap-6">
                    <div className="grid h-16 w-16 place-items-center rounded-3xl border border-neutral-800/60 bg-[#080808]/70 transition duration-500 group-hover:scale-105">
                      <iconify-icon icon={card.icon} className="text-3xl text-neutral-200" aria-hidden="true" />
                    </div>
                    <p className="font-mono text-[11px] font-light uppercase tracking-[0.2em] text-neutral-600">{card.meta}</p>
                  </div>

                  <h3 className="font-inter text-3xl font-thin tracking-tighter text-neutral-100 md:text-4xl">{card.title}</h3>
                  <p className="mt-4 max-w-md font-inter text-base font-extralight leading-[1.8] text-neutral-400">{card.copy}</p>
                  <a href="#contact" className="mt-8 inline-flex items-center gap-2 font-mono text-xs font-normal uppercase tracking-tight text-neutral-300 transition duration-500 hover:text-neutral-100">
                    Open frame
                    <iconify-icon icon="solar:arrow-right-up-linear" aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="px-6 py-32 md:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="gsap-entrance font-mono text-xs font-light uppercase tracking-[0.2em] text-neutral-500">Process</p>
            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {processSteps.map((step) => (
                <article key={step.number} className="gsap-entrance border-t border-neutral-800/60 pt-8">
                  <p className="font-mono text-7xl font-light tracking-tighter text-neutral-600">{step.number}</p>
                  <h3 className="mt-8 font-inter text-3xl font-thin tracking-tighter text-neutral-100">{step.title}</h3>
                  <p className="mt-4 font-inter text-base font-extralight leading-[1.8] text-neutral-500">{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-6 pb-48 pt-20 md:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <p className="gsap-entrance font-mono text-xs font-light uppercase tracking-[0.2em] text-neutral-500">Pixel engineered</p>
            <h2 className="gsap-entrance mt-5 font-inter text-5xl font-thin tracking-tighter text-neutral-100 md:text-8xl">
              Build the next surface with intent.
            </h2>
            <a
              href="mailto:studio@designer.example"
              className="gsap-entrance mt-10 inline-flex min-h-11 items-center rounded-full border border-neutral-800/60 px-8 py-3.5 font-mono text-xs font-normal uppercase tracking-tight text-neutral-300 transition duration-500 hover:border-neutral-600 hover:text-neutral-100 active:scale-[0.98]"
            >
              studio@designer.example
            </a>
          </div>
        </section>
      </main>

      <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-end justify-between px-4 py-7 font-mono text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500 mix-blend-difference sm:px-6 md:px-8">
        <span>Designer Studio</span>
        <span>
          © {new Date().getFullYear()}
          <script
            // Deliberately mirrors the reference quirk: a date script in a pointer-events-none footer.
            dangerouslySetInnerHTML={{ __html: "document.write(new Date().getFullYear())" }}
          />
        </span>
      </footer>
    </div>
  );
}

export default App;
