// Victor Hugo — Boudoir
// Mobile-first com header em 1 linha + brilho sutil, fundo preto-seda vinho,
// Portfólio em “Tipos | Galeria”, lightbox e CTA fixo.

import { useEffect, useMemo, useState } from "react";
import { PORTFOLIO } from "./portfolio.data";

// ==========================
// Config
// ==========================
const SITE = {
  title: "Victor Hugo — Boudoir",
  city: "Florianópolis e Região",
  instagram: "https://instagram.com/focosutil",
  whatsappNumber: "5548996430566",
  whatsappMessage: "Oi Victor! Quero saber mais sobre ensaios boudoir.",
  email: "vhffotografias@gmail.com",
  description:
    "Boudoir minimalista com direção gentil. Experiência confidencial e leve — feita pra você.",
};

const PRICES = [
  { title: "Essencial", price: "R$ 550", features: ["1h30 de sessão", "1 look", "15 fotos tratadas", "Foto Extra: R$20"], highlight: false },
  { title: "Clássico", price: "R$ 750", features: ["2h30 de sessão", "2 looks", "28 fotos tratadas", "Foto Extra: R$20"], highlight: true },
  { title: "Luxo", price: "R$ 1.490", features: ["4h30 de sessão", "4 looks", "35 fotos tratadas", "Foto Extra: R$20", "Locação Inclusa"], highlight: false },
];

const TESTIMONIALS = [
  { name: "Agatah", text: "Experiência acolhedora do início ao fim. Me senti linda e segura." },
  { name: "Camila", text: "Direção cuidadosa e olhar sofisticado. As fotos ficaram incríveis." },
  { name: "Luiza", text: "Elegante e verdadeiro. Um presente pra mim mesma." },
];

const FAQ = [
  { q: "Nunca posei antes. Você ajuda com poses?", a: "Sim. Direção completa e gentil, com referências e orientações em cada etapa." },
  { q: "Preciso mostrar o rosto?", a: "Apenas se quiser. Podemos focar em silhuetas, sombras e detalhes." },
  { q: "Onde acontecem as sessões?", a: "Estúdio parceiro, Airbnb selecionado, Céu aberto ou na sua casa — conforme sua preferência." },
  { q: "Como recebo as fotos?", a: "Galeria online em até 10 dias úteis." },
];

// ==========================
// Utils
// ==========================
function waLink(number: string, message: string) {
  const text = encodeURIComponent(message);
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${text}`;
}
function cx(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}

// ==========================
// Component
// ==========================
export default function VictorHugoBoudoir() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState<string>("Todos");
  const [portfolioView, setPortfolioView] = useState<"Tipos" | "Galeria">("Tipos");

  // categorias vindas do arquivo gerado
  const categories = useMemo(
    () => Array.from(new Set(PORTFOLIO.map(i => i.category))),
    []
  );

  // capa + contagem por categoria
  const categoryMeta = useMemo(() => {
    const map = new Map<string, { cover: string; alt: string; count: number }>();
    for (const img of PORTFOLIO) {
      if (!map.has(img.category)) map.set(img.category, { cover: img.src, alt: img.alt, count: 1 });
      else map.set(img.category, { ...map.get(img.category)!, count: map.get(img.category)!.count + 1 });
    }
    return map;
  }, []);

  const images = useMemo(
    () => (activeCat === "Todos" ? PORTFOLIO : PORTFOLIO.filter(i => i.category === activeCat)),
    [activeCat]
  );

  useEffect(() => { document.title = SITE.title; }, []);

  // fecha o lightbox ao trocar de categoria (evita índice fora do array)
  useEffect(() => { setLightbox(null); }, [activeCat]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (lightbox !== null && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        setLightbox(v => {
          if (v === null) return v;
          const dir = e.key === "ArrowRight" ? 1 : -1;
          return (v + dir + images.length) % images.length;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  const hero = PORTFOLIO[0];

  return (
    <div className="min-h-screen text-zinc-100 antialiased bg-silk-wine overflow-x-hidden relative pb-appbar">
      <MetaHead />
      <StyleTag />

      {/* BG vinhoso sutil adicional */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-rose-500/18 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-rose-400/12 blur-2xl" />
      </div>

      {/* NAV — uma linha + brilho elegante */}
      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/30">
        <div className="mx-auto max-w-[680px] px-4 py-3 flex items-center justify-between gap-3">
          <a href="#home" className="min-w-0 flex-1 truncate font-serif tracking-wide whitespace-nowrap">
            <span className="brand-shine">Victor Hugo - Fotografias</span>
          </a>
          <a
            href={waLink(SITE.whatsappNumber, SITE.whatsappMessage)}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs bg-white text-black hover:bg-zinc-200"
          >
            Agendar
          </a>
        </div>
      </header>

      {/* HERO — mobile first */}
      <section id="home" className="mx-auto max-w-[680px] px-4 pt-8 pb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">{SITE.city}</p>
        <h1 className="mt-2 font-serif text-[28px] leading-[1.2] sm:text-[34px]">
          Elegância que revela — boudoir e nu artístico com direção acolhedora.
        </h1>
        <p className="mt-3 text-[15px] text-zinc-300">{SITE.description}</p>
        <div className="mt-5 flex gap-2">
          <a href="#portfolio" className="flex-1 rounded-full px-4 py-3 text-sm text-center border border-white/15 hover:bg-white/10">Ver portfólio</a>
          <a href={waLink(SITE.whatsappNumber, SITE.whatsappMessage)} className="flex-1 rounded-full px-4 py-3 text-sm text-center bg-white text-black hover:bg-zinc-200">WhatsApp</a>
        </div>
        <div className="mt-6 aspect-[4/5] w-full rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
          {hero ? <img src={hero.src} alt={hero.alt} className="h-full w-full object-cover" loading="eager" /> : <div className="h-full w-full bg-white/5" />}
        </div>
      </section>

      {/* USP bar */}
      <section className="mx-auto max-w-[680px] px-4 pb-8">
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px] text-zinc-300">
          <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Privacidade & confidencialidade</li>
          <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Direção gentil para iniciantes</li>
          <li className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">Curadoria editorial e fine art</li>
        </ul>
      </section>

      {/* PORTFÓLIO — Tipos de Ensaio + Galeria */}
      <section id="portfolio" className="mx-auto max-w-[680px] px-0 pb-12">
        <div className="px-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[22px]">Portfólio</h2>
            {/* Abas: Tipos | Galeria */}
            <div className="bg-white/10 rounded-full p-1 flex gap-1">
              {(["Tipos", "Galeria"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setPortfolioView(tab)}
                  className={cx(
                    "px-3 py-1.5 text-[12px] rounded-full transition",
                    portfolioView === tab ? "bg-white text-black" : "text-zinc-200 hover:bg-white/10"
                  )}
                  aria-pressed={portfolioView === tab}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* TIPOS — cartões grandes e clicáveis */}
          {portfolioView === "Tipos" && (
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => {
                const meta = categoryMeta.get(cat)!;
                return (
                  <button
                    key={cat}
                    className="group relative aspect-[7/8] rounded-3xl overflow-hidden ring-1 ring-white/10 focus:outline-none"
                    onClick={() => {
                      setActiveCat(cat);
                      setPortfolioView("Galeria");
                      setTimeout(() => {
                        document.getElementById("portfolio-gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 0);
                    }}
                    aria-label={`Abrir galeria de ${cat}`}
                  >
                    <img src={meta.cover} alt={meta.alt} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" decoding="async" />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className="absolute inset-x-2 bottom-2 rounded-2xl bg-black/40 backdrop-blur px-3 py-2 ring-1 ring-white/10">
                      <p className="text-[14px] font-medium">{cat}</p>
                      <p className="text-[11px] text-zinc-300">{meta.count} fotos</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* GALERIA — chips + grade responsiva (MOBILE-FIRST) */}
          {portfolioView === "Galeria" && (
            <>
              <div className="flex flex-wrap gap-2">
                {["Todos", ...categories].map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={cx(
                      "px-3 py-1 text-[12px] rounded-full border transition",
                      activeCat === c ? "bg-white text-black border-white" : "border-white/15 text-zinc-300 hover:bg-white/10"
                    )}
                    aria-pressed={activeCat === c}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* grade -> 2 colunas no mobile, 3 no >=sm; cartões com proporção fixa */}
              <div id="portfolio-gallery" className="mt-4 px-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.length === 0 ? (
                    <div className="col-span-2 sm:col-span-3 text-center text-[13px] text-zinc-400 py-8">
                      Sem fotos nesta categoria (ainda).
                    </div>
                  ) : (
                    images.map((img, i) => (
                      <button
                        key={img.src + i}
                        onClick={() => setLightbox(i)}
                        className="group relative aspect-[3/4] rounded-2xl overflow-hidden ring-1 ring-white/10 focus:outline-none"
                        aria-label={`Abrir imagem ${i + 1}`}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </button>
                    ))
                  )}
                </div>
              </div>
              <p className="text-[12px] text-zinc-400 px-4 mt-2">Dica: toque para ampliar.</p>
            </>
          )}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="mx-auto max-w-[680px] px-4 pb-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-serif text-[22px]">Sobre Victor</h2>
          <p className="mt-2 text-[15px] text-zinc-300">
            Especializado em boudoir e nu artístico, conduzo sessões com respeito, escuta e direção descontraída.
            A proposta é uma experiência elegante, segura e discreta, visando exatamente o que você procura.
          </p>
          <ul className="mt-4 grid gap-2 text-[14px] text-zinc-300">
            <li>• Atendimento privado e confidencial</li>
            <li>• Direção para quem nunca posou</li>
            <li>• Leve um(a) acompanhante caso se sinta mais à vontade</li>
          </ul>
          <div className="mt-4 flex gap-2">
            <a href={SITE.instagram} target="_blank" className="flex-1 rounded-full px-4 py-3 text-sm text-center border border-white/15 hover:bg-white/10">Instagram</a>
            <a href={waLink(SITE.whatsappNumber, SITE.whatsappMessage)} className="flex-1 rounded-full px-4 py-3 text-sm text-center bg-white text-black hover:bg-zinc-200">Conversa rápida</a>
          </div>
        </div>
      </section>

      {/* PACOTES */}
      <section id="precos" className="mx-auto max-w-[680px] px-4 pb-12">
        <h2 className="font-serif text-[22px]">Pacotes & Preços</h2>
        <p className="text-[13px] text-zinc-400 mt-1">Valores base. Personalizo conforme sua ideia e locação.</p>
        <div className="mt-4 grid gap-3">
          {PRICES.map((p) => (<PriceCard key={p.title} {...p} />))}
        </div>
        <p className="text-[11px] text-zinc-500 mt-3">* Maquiagem, locação e impressão fine art opcionais.</p>
      </section>

      {/* DEPOIMENTOS */}
      <section className="mx-auto max-w-[680px] px-0 pb-12">
        <div className="px-4 flex items-center justify-between">
          <h2 className="font-serif text-[22px]">Depoimentos</h2>
        </div>
        <div className="mt-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4">
          <div className="flex gap-3">
            {TESTIMONIALS.map((d, i) => (
              <div key={i} className="snap-start shrink-0 min-w-[85%] rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-[15px]">“{d.text}”</p>
                <p className="mt-3 text-[12px] text-zinc-400">— {d.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-[680px] px-4 pb-20">
        <h2 className="font-serif text-[22px]">Perguntas frequentes</h2>
        <div className="mt-3 grid gap-3">
          {FAQ.map((f, i) => (<Faq key={i} q={f.q} a={f.a} />))}
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="mx-auto max-w-[680px] px-4 pb-28">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-serif text-[22px]">Vamos conversar</h2>
          <p className="text-[14px] text-zinc-300 mt-1">Envie uma mensagem. Respondo em horário comercial.</p>
          <div className="mt-4 grid gap-2">
            <a href={waLink(SITE.whatsappNumber, SITE.whatsappMessage)} className="rounded-xl px-4 py-3 text-sm text-center bg-white text-black">Falar no WhatsApp</a>
            <a href={`mailto:${SITE.email}`} className="rounded-xl px-4 py-3 text-sm text-center border border-white/15">Enviar e-mail</a>
          </div>
          <form onSubmit={onSubmit} className="mt-4 grid gap-3">
            <input name="nome" required placeholder="Seu nome" className="rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-[15px]" />
            <input type="email" name="email" required placeholder="E-mail" className="rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-[15px]" />
            <textarea name="mensagem" required rows={4} placeholder="Mensagem" className="rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-[15px]" />
            <button className="rounded-xl px-4 py-3 bg-white text-black text-sm">Enviar</button>
          </form>
        </div>
      </section>

      {/* CTA fixo inferior */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40">
        <div className="mx-auto max-w-[680px] px-4 py-3 flex gap-2 safe-bottom">
          <a href="#precos" className="flex-1 rounded-full border border-white/15 py-3 text-center text-sm">Ver pacotes</a>
          <a href={waLink(SITE.whatsappNumber, SITE.whatsappMessage)} className="flex-1 rounded-full bg-white text-black py-3 text-center text-sm">Agendar agora</a>
        </div>
      </div>

      {/* Lightbox fullscreen */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-3"
          onClick={() => setLightbox(null)}
        >
          <div className="relative w-full max-w-[680px]" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightbox].src} alt={images[lightbox].alt} className="w-full h-auto rounded-xl ring-1 ring-white/10" />
            <button onClick={() => setLightbox(null)} aria-label="Fechar" className="absolute -top-12 right-0 text-zinc-300">✕</button>
            <div className="absolute -top-12 left-0 flex gap-6 text-zinc-300">
              <button onClick={() => setLightbox((v) => (v! - 1 + images.length) % images.length)}>←</button>
              <button onClick={() => setLightbox((v) => (v! + 1) % images.length)}>→</button>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <footer className="mx-auto max-w-[680px] px-4 pt-8 pb-24 text-center text-[12px] text-zinc-400">
        © {new Date().getFullYear()} {SITE.title} • <a href={SITE.instagram} target="_blank" className="underline">Instagram</a>
      </footer>
    </div>
  );
}

// ==========================
// Subcomponentes
// ==========================
function MetaHead() {
  return (
    <>
      <meta name="description" content={SITE.description} />
      <meta property="og:title" content={SITE.title} />
      <meta property="og:description" content={SITE.description} />
      <meta property="og:type" content="website" />
      {/* Fonte display sensual (Didone) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,600;6..96,700;6..96,900&display=swap" rel="stylesheet" />
    </>
  );
}

function PriceCard({ title, price, features, highlight }:{ title:string; price:string; features:string[]; highlight?:boolean }){
  return (
    <div className={cx("rounded-2xl p-5 ring-1", highlight ? "bg-white text-black ring-white" : "bg-white/5 text-zinc-100 ring-white/10")}>
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-[20px]">{title}</h3>
        {highlight && <span className="text-[11px] px-2 py-1 rounded-full bg-black text-white">Popular</span>}
      </div>
      <p className={cx("mt-1 text-[26px] font-semibold", highlight ? "text-black" : "text-white")}>{price}</p>
      <ul className={cx("mt-3 space-y-1.5 text-[14px]", highlight ? "text-zinc-700" : "text-zinc-300")}>
        {features.map((f, i) => (<li key={i}>• {f}</li>))}
      </ul>
      <a
        href={waLink(SITE.whatsappNumber, SITE.whatsappMessage)}
        className={cx(
          "mt-4 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm",
          highlight ? "bg-black text-white hover:bg-zinc-800" : "border border-white/15 hover:bg-white/10"
        )}
      >
        Reservar pelo WhatsApp
      </a>
    </div>
  );
}

function Faq({ q, a }:{ q:string; a:string }){
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5">
      <button onClick={() => setOpen(v => !v)} className="w-full px-4 py-3 flex items-center justify-between text-left">
        <span className="text-[15px]">{q}</span>
        <span className="text-[18px] text-zinc-300">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-4 pb-3 text-[14px] text-zinc-300">{a}</div>}
    </div>
  );
}

function onSubmit(e: React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const payload = Object.fromEntries(data.entries());
  const subject = encodeURIComponent("Contato — Portfólio Boudoir");
  const body = encodeURIComponent(`Nome: ${payload.nome}\nEmail: ${payload.email}\nMensagem: ${payload.mensagem}`);
  window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  (e.target as HTMLFormElement).reset();
}

// ==========================
// Estilos utilitários (bg seda vinho + brilho do nome)
// ==========================
function StyleTag(){
  return (
    <style
      // @ts-ignore
      dangerouslySetInnerHTML={{__html: `
      /* Fonte do logo — Bodoni Moda (alto contraste, elegante) */
      @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400..900&display=swap');
      .font-logo{
        font-family: "Bodoni Moda", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
        font-weight: 700;            /* presença mais marcante */
        letter-spacing: 0.01em;      /* leve respiro */
      }

      .bg-silk-wine{
        background:
          radial-gradient(1200px 600px at 50% -10%, rgba(122,32,57,0.18), transparent 70%),
          radial-gradient(900px 400px at 100% 10%, rgba(163,44,77,0.12), transparent 70%),
          radial-gradient(900px 600px at -10% 80%, rgba(110,28,52,0.14), transparent 70%),
          linear-gradient(180deg,#15161b 0%, #101116 40%, #0c0d12 100%);
      }

      /* Brilho do nome (mantido) */
      .brand-shine{
        background: linear-gradient(90deg,#ffffff 0%,#fff5f7 25%,#ffffff 50%,#e7b9c9 75%,#ffffff 100%);
        -webkit-background-clip:text; background-clip:text; color:transparent;
        background-size:200% 100%; animation: brandShine 6s linear infinite;
        text-shadow: 0 0 18px rgba(244,114,182,0.08);
      }
      @keyframes brandShine{ from{background-position:0% 50%} to{background-position:200% 50%} }

      .no-scrollbar::-webkit-scrollbar{ display:none }
      .no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none }
      .safe-bottom{ padding-bottom: calc(env(safe-area-inset-bottom) + 0px); }
      .pb-appbar{ padding-bottom: calc(88px + env(safe-area-inset-bottom)); }
    `}}
    />
  );
}

