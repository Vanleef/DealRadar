"use client";

import { useEffect, useMemo, useState } from "react";

type Game = {
  id: number; title: string; year: number; genres: string[]; engine: string;
  platforms: string[]; price: number; original: number; historical: number;
  store: string; score: number; cover: string; accent: string; description: string;
  tags: string[]; verified: boolean;
};

const games: Game[] = [
  { id: 1245620, title: "ELDEN RING", year: 2022, genres: ["RPG", "Ação"], engine: "Proprietária", platforms: ["PC", "PlayStation", "Xbox"], price: 149.95, original: 249.90, historical: 124.95, store: "Nuuvem", score: 96, cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg", accent: "#d6bd7b", description: "Erga-se, Maculado, e seja guiado pela graça para brandir o poder do Anel Prístino. Um RPG de ação em mundo aberto repleto de mistérios, chefes monumentais e liberdade de exploração.", tags: ["soulslike", "mundo aberto", "difícil", "fantasia"], verified: true },
  { id: 1091500, title: "Cyberpunk 2077", year: 2020, genres: ["RPG", "Ação"], engine: "REDengine 4", platforms: ["PC", "PlayStation", "Xbox"], price: 99.96, original: 199.90, historical: 89.95, store: "GOG", score: 91, cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg", accent: "#f6e837", description: "Uma aventura de ação e RPG em mundo aberto ambientada em Night City, uma megalópole obcecada por poder, glamour e modificações corporais.", tags: ["futurista", "mundo aberto", "história", "ficção científica"], verified: true },
  { id: 2050650, title: "Resident Evil 4", year: 2023, genres: ["Terror", "Ação"], engine: "RE Engine", platforms: ["PC", "PlayStation", "Xbox"], price: 79.90, original: 169.00, historical: 67.60, store: "Green Man Gaming", score: 93, cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg", accent: "#aeb6a9", description: "Sobrevivência é apenas o começo. Seis anos após o desastre de Raccoon City, Leon S. Kennedy é enviado para resgatar a filha do presidente.", tags: ["terror", "sobrevivência", "zumbis", "single-player"], verified: true },
  { id: 1623730, title: "Palworld", year: 2024, genres: ["Sobrevivência", "Aventura"], engine: "Unreal Engine 5", platforms: ["PC", "Xbox"], price: 66.74, original: 88.99, historical: 60.00, store: "Steam", score: 87, cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1623730/header.jpg", accent: "#52bde3", description: "Capture criaturas misteriosas chamadas Pals, construa bases, explore um vasto mundo e sobreviva sozinho ou com amigos.", tags: ["cooperativo", "criaturas", "crafting", "mundo aberto"], verified: true },
  { id: 1086940, title: "Baldur's Gate 3", year: 2023, genres: ["RPG", "Estratégia"], engine: "Divinity 4.0", platforms: ["PC", "PlayStation", "Xbox"], price: 159.99, original: 199.99, historical: 139.99, store: "Steam", score: 97, cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg", accent: "#dc7b4d", description: "Reúna seu grupo e retorne aos Reinos Esquecidos em uma história de amizade, traição, sacrifício e tentação por poder absoluto.", tags: ["turnos", "D&D", "escolhas", "fantasia"], verified: true },
  { id: 2124490, title: "SILENT HILL 2", year: 2024, genres: ["Terror", "Aventura"], engine: "Unreal Engine 5", platforms: ["PC", "PlayStation"], price: 174.93, original: 349.90, historical: 157.45, store: "Humble Store", score: 89, cover: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2124490/header.jpg", accent: "#83908c", description: "Ao receber uma carta de sua falecida esposa, James retorna a Silent Hill, onde encontra uma cidade envolta em névoa e horrores psicológicos.", tags: ["terror psicológico", "atmosférico", "história", "single-player"], verified: true },
];

const icon = (name: string, size = 20) => {
  const paths: Record<string, React.ReactNode> = {
    radar: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v9l6-6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5a5.5 5.5 0 0 0 1.1-8.9z"/>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/></>,
    spark: <><path d="m12 3-1.4 4.1L6.5 8.5l4.1 1.4L12 14l1.4-4.1 4.1-1.4-4.1-1.4L12 3z"/><path d="m5 15-.8 2.2L2 18l2.2.8L5 21l.8-2.2L8 18l-2.2-.8L5 15z"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    sliders: <><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const money = (value: number, currency: string) => new Intl.NumberFormat(currency === "BRL" ? "pt-BR" : currency === "EUR" ? "de-DE" : "en-US", { style: "currency", currency }).format(value * (currency === "USD" ? .19 : currency === "EUR" ? .17 : 1));

export default function Home() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Todos");
  const [platform, setPlatform] = useState("Todas");
  const [engine, setEngine] = useState("Todas");
  const [maxPrice, setMaxPrice] = useState(350);
  const [sort, setSort] = useState("Relevância");
  const [favorites, setFavorites] = useState<number[]>([2050650]);
  const [interests, setInterests] = useState<number[]>([1245620, 2124490]);
  const [selected, setSelected] = useState<Game | null>(null);
  const [view, setView] = useState<"discover" | "profile" | "settings">("discover");
  const [showLogin, setShowLogin] = useState(false);
  const [currency, setCurrency] = useState("BRL");
  const [language, setLanguage] = useState("Português (Brasil)");
  const [alerts, setAlerts] = useState(true);
  const [dark, setDark] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2400); return () => clearTimeout(t); }, [toast]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    const semantic = q.includes("terror") ? "terror" : q.includes("rpg") || q.includes("fantasia") ? "rpg" : q.includes("mundo aberto") ? "mundo aberto" : q.includes("cooper") ? "cooperativo" : q;
    const list = games.filter(g => {
      const haystack = [g.title, ...g.genres, ...g.tags, g.engine, ...g.platforms, g.description].join(" ").toLowerCase();
      const textMatch = !semantic || haystack.includes(semantic) || semantic.split(" ").every(word => haystack.includes(word));
      return textMatch && (genre === "Todos" || g.genres.includes(genre)) && (platform === "Todas" || g.platforms.includes(platform)) && (engine === "Todas" || g.engine === engine) && g.price <= maxPrice;
    });
    if (sort === "Maior desconto") list.sort((a,b) => (b.original-b.price)/b.original - (a.original-a.price)/a.original);
    if (sort === "Menor preço") list.sort((a,b) => a.price-b.price);
    if (sort === "Melhor avaliação") list.sort((a,b) => b.score-a.score);
    return list;
  }, [query, genre, platform, engine, maxPrice, sort]);

  const toggleFav = (id: number) => { setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]); setToast(favorites.includes(id) ? "Removido dos favoritos" : "Salvo nos favoritos"); };
  const toggleInterest = (id: number) => { setInterests(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]); setToast(interests.includes(id) ? "Interesse removido" : "Radar ativado para este jogo"); };

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => setView("discover")}><span className="brand-mark">{icon("radar", 24)}</span><span>DEAL<span>RADAR</span></span></button>
      <nav className="main-nav" aria-label="Navegação principal">
        <button className={view === "discover" ? "active" : ""} onClick={() => setView("discover")}>Descobrir</button>
        <button onClick={() => { setView("profile"); }}>Minha lista <span className="nav-count">{favorites.length + interests.length}</span></button>
      </nav>
      <div className="top-actions">
        <button className="icon-btn" aria-label="Notificações">{icon("bell")}{alerts && <i />}</button>
        <button className="avatar-btn" onClick={() => setShowLogin(true)}><span className="avatar">ES</span><span>Entrar</span></button>
      </div>
    </header>

    {view === "discover" && <>
      <section className="hero">
        <div className="scanline" />
        <div className="eyebrow"><span /> MONITORANDO 32 LOJAS VERIFICADAS</div>
        <h1>Seu próximo jogo.<br/><em>Pelo melhor preço.</em></h1>
        <p>O radar inteligente que cruza preços, histórico e seus gostos para encontrar ofertas que realmente valem a pena.</p>
        <div className="search-box">
          <span>{icon("search", 23)}</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder='Busque por um jogo ou tente “jogos de terror cooperativos”' aria-label="Buscar jogos" />
          <kbd>⌘ K</kbd>
          <button onClick={() => document.getElementById("results")?.scrollIntoView({behavior:"smooth"})}>Rastrear</button>
        </div>
        <div className="quick-searches"><span>BUSCAS RÁPIDAS</span>{["Terror psicológico", "RPG mundo aberto", "Cooperativo", "Abaixo de R$ 50"].map(x => <button key={x} onClick={() => { setQuery(x === "Abaixo de R$ 50" ? "" : x); if(x.includes("50")) setMaxPrice(50); }}>{x}</button>)}</div>
      </section>

      <main className="content" id="results">
        <div className="section-head">
          <div><span className="mini-label">SINAL FORTE</span><h2>Ofertas detectadas</h2><p>Preços comparados com a média dos últimos 90 dias.</p></div>
          <button className="mobile-filter" onClick={() => setMobileFilters(!mobileFilters)}>{icon("sliders")} Filtros</button>
          <label className="sort">Ordenar por <select value={sort} onChange={e => setSort(e.target.value)}><option>Relevância</option><option>Maior desconto</option><option>Menor preço</option><option>Melhor avaliação</option></select></label>
        </div>
        <div className="catalog-layout">
          <aside className={`filters ${mobileFilters ? "open" : ""}`}>
            <div className="filter-title"><strong>Refinar radar</strong><button onClick={() => {setGenre("Todos");setPlatform("Todas");setEngine("Todas");setMaxPrice(350)}}>Limpar</button></div>
            <FilterSelect label="Gênero" value={genre} setter={setGenre} options={["Todos","Ação","RPG","Terror","Aventura","Estratégia","Sobrevivência"]}/>
            <FilterSelect label="Plataforma" value={platform} setter={setPlatform} options={["Todas","PC","PlayStation","Xbox"]}/>
            <FilterSelect label="Engine" value={engine} setter={setEngine} options={["Todas","Unreal Engine 5","RE Engine","REDengine 4","Divinity 4.0","Proprietária"]}/>
            <div className="range-filter"><label>Preço máximo <strong>{money(maxPrice,currency)}</strong></label><input type="range" min="25" max="350" step="25" value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}/><div><span>{money(25,currency)}</span><span>{money(350,currency)}+</span></div></div>
            <div className="trust-card"><span>{icon("radar")}</span><div><strong>Radar seguro</strong><p>Só exibimos lojas oficiais ou revendedores autorizados.</p></div></div>
          </aside>
          <section className="results-panel">
            <div className="result-meta"><strong>{results.length} jogos encontrados</strong>{query && <span>Intenção detectada: <b>“{query}”</b></span>}</div>
            <div className="game-grid">
              {results.map(game => <GameCard key={game.id} game={game} currency={currency} favorite={favorites.includes(game.id)} interested={interests.includes(game.id)} onFav={() => toggleFav(game.id)} onInterest={() => toggleInterest(game.id)} onOpen={() => setSelected(game)}/>) }
            </div>
            {!results.length && <div className="empty"><span>{icon("radar",42)}</span><h3>Nenhum sinal encontrado</h3><p>Tente remover algum filtro ou buscar por uma ideia mais ampla.</p></div>}
          </section>
        </div>
      </main>
    </>}

    {view === "profile" && <Profile games={games} favorites={favorites} interests={interests} currency={currency} open={setSelected} settings={() => setView("settings")}/>} 
    {view === "settings" && <Settings currency={currency} setCurrency={setCurrency} language={language} setLanguage={setLanguage} alerts={alerts} setAlerts={setAlerts} dark={dark} setDark={setDark} back={() => setView("profile")} toast={setToast}/>} 

    <footer><button className="brand foot-brand"><span className="brand-mark">{icon("radar", 20)}</span><span>DEAL<span>RADAR</span></span></button><p>Preços rastreados em parceiros oficiais. DealRadar não vende jogos.</p><div><a href="#">Fontes confiáveis</a><a href="#">Privacidade</a><a href="#">Termos</a></div></footer>
    {selected && <GameModal game={selected} currency={currency} favorite={favorites.includes(selected.id)} interested={interests.includes(selected.id)} close={() => setSelected(null)} fav={() => toggleFav(selected.id)} interest={() => toggleInterest(selected.id)}/>} 
    {showLogin && <LoginModal close={() => setShowLogin(false)} toast={setToast}/>} 
    {toast && <div className="toast"><span>✓</span>{toast}</div>}
  </div>;
}

function FilterSelect({label,value,setter,options}:{label:string,value:string,setter:(v:string)=>void,options:string[]}) { return <label className="filter-select"><span>{label}</span><select value={value} onChange={e => setter(e.target.value)}>{options.map(x => <option key={x}>{x}</option>)}</select></label> }

function GameCard({game,currency,favorite,interested,onFav,onInterest,onOpen}:{game:Game,currency:string,favorite:boolean,interested:boolean,onFav:()=>void,onInterest:()=>void,onOpen:()=>void}) {
  const discount = Math.round((1-game.price/game.original)*100);
  return <article className={`game-card ${favorite ? "is-favorite" : ""}`}>
    <div className="cover" onClick={onOpen} role="button" tabIndex={0} style={{backgroundColor:game.accent}}><img src={game.cover} alt={`Capa de ${game.title}`}/><div className="deal-badge">−{discount}%</div>{favorite && <div className="favorite-badge">♥ FAVORITO</div>}<button className={`heart-btn ${favorite ? "active" : ""}`} onClick={e => {e.stopPropagation();onFav()}} aria-label="Favoritar">{icon("heart",19)}</button></div>
    <div className="card-body"><div className="card-tags"><span>{game.genres[0]}</span><span>{game.platforms[0]}</span><i>{game.score}</i></div><h3 onClick={onOpen}>{game.title}</h3><p className="store-line"><span className="verified">✓</span>{game.store}<small>Loja verificada</small></p><div className="price-row"><div><del>{money(game.original,currency)}</del><strong>{money(game.price,currency)}</strong></div><div className="history"><span>Menor histórico</span><b>{money(game.historical,currency)}</b></div></div><div className="card-actions"><button className={interested ? "watching" : ""} onClick={onInterest}>{interested ? "Radar ativo" : "Tenho interesse"}</button><button className="arrow" onClick={onOpen}>{icon("chevron")}</button></div></div>
  </article>
}

function GameModal({game,currency,favorite,interested,close,fav,interest}:{game:Game,currency:string,favorite:boolean,interested:boolean,close:()=>void,fav:()=>void,interest:()=>void}) {
 const discount=Math.round((1-game.price/game.original)*100);
 return <div className="modal-layer" onMouseDown={close}><div className="game-modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={close}>{icon("close")}</button><div className="modal-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(10,12,12,.96),rgba(10,12,12,.2)),url(${game.cover})`}}><div className="modal-copy"><span className="signal">● OFERTA VERIFICADA</span><h2>{game.title}</h2><div className="modal-meta">{game.year} · {game.genres.join(" / ")} · {game.engine}</div><div className="modal-price"><span>−{discount}%</span><del>{money(game.original,currency)}</del><strong>{money(game.price,currency)}</strong></div></div></div><div className="modal-body"><div><h3>Sobre o jogo</h3><p>{game.description}</p><div className="tag-list">{game.tags.map(t=><span key={t}>{t}</span>)}</div><h3>Disponível em</h3><p>{game.platforms.join(" · ")}</p></div><aside><div className="seller"><small>MELHOR OFERTA AGORA</small><strong>{game.store} <span>✓</span></strong><p>Revendedor autorizado · ativação segura</p><a href={`https://isthereanydeal.com/search/?q=${encodeURIComponent(game.title)}`} target="_blank" rel="noreferrer">Ver oferta por {money(game.price,currency)} ↗</a></div><button className="modal-secondary" onClick={fav}>{favorite ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos"}</button><button className="modal-secondary" onClick={interest}>{interested ? "◉ Radar de preço ativo" : "◎ Avisar quando baixar"}</button></aside></div></div></div>
}

function LoginModal({close,toast}:{close:()=>void,toast:(v:string)=>void}) { const action=(name:string)=>{toast(`${name}: integração preparada para receber as credenciais oficiais`);close()}; return <div className="modal-layer" onMouseDown={close}><div className="login-modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={close}>{icon("close")}</button><span className="login-logo">{icon("radar",30)}</span><h2>Entre no seu radar</h2><p>Sincronize listas, receba alertas e leve suas preferências para qualquer dispositivo.</p><div className="provider-list"><button onClick={()=>action("Google")}><b className="google">G</b>Continuar com Google</button><button onClick={()=>action("Steam")}><b>◉</b>Continuar com Steam</button><button onClick={()=>action("Xbox")}><b className="xbox">X</b>Continuar com Xbox</button></div><div className="divider"><span>ou com e-mail</span></div><input placeholder="seu@email.com" type="email"/><input placeholder="Sua senha" type="password"/><button className="login-primary" onClick={()=>action("Conta DealRadar")}>Entrar</button><p className="login-foot">Ainda não tem conta? <button onClick={()=>toast("Cadastro aberto")}>Criar conta grátis</button></p></div></div> }

function Profile({games,favorites,interests,currency,open,settings}:{games:Game[],favorites:number[],interests:number[],currency:string,open:(g:Game)=>void,settings:()=>void}) { const list=games.filter(g=>favorites.includes(g.id)||interests.includes(g.id)); return <main className="account-page"><div className="profile-hero"><div className="profile-avatar">ES</div><div><span>CAÇADOR DE OFERTAS</span><h1>Eduardo Santos</h1><p>Membro desde agosto de 2026 · Recife, Brasil</p></div><button onClick={settings}>{icon("settings")} Configurações</button></div><div className="stats"><div><strong>{favorites.length}</strong><span>Favoritos</span></div><div><strong>{interests.length}</strong><span>Radares ativos</span></div><div><strong>R$ 184</strong><span>Economia estimada</span></div></div><section className="library"><div className="library-head"><div><span className="mini-label">SUA COLEÇÃO</span><h2>Minha lista</h2></div><div className="tabs"><button className="active">Todos ({list.length})</button><button>Favoritos</button><button>Interesses</button></div></div><div className="profile-list">{list.map(g=><button key={g.id} onClick={()=>open(g)}><img src={g.cover} alt=""/><div><h3>{g.title}</h3><p>{g.genres.join(" · ")} · {g.year}</p></div><span className={favorites.includes(g.id)?"fav-pill":"radar-pill"}>{favorites.includes(g.id)?"♥ Favorito":"◉ Radar ativo"}</span><strong>{money(g.price,currency)}</strong>{icon("chevron")}</button>)}</div></section><section className="connected"><div><span>◉</span><h3>Steam conectada</h3><p>128 jogos · 2.430 horas registradas</p></div><div className="played"><small>MAIS JOGADOS</small><b>Baldur&apos;s Gate 3</b><span>312 h</span><b>ELDEN RING</b><span>248 h</span></div><button>Sincronizar biblioteca</button></section></main> }

function Settings({currency,setCurrency,language,setLanguage,alerts,setAlerts,dark,setDark,back,toast}:{currency:string,setCurrency:(v:string)=>void,language:string,setLanguage:(v:string)=>void,alerts:boolean,setAlerts:(v:boolean)=>void,dark:boolean,setDark:(v:boolean)=>void,back:()=>void,toast:(v:string)=>void}) { return <main className="settings-page"><button className="back" onClick={back}>← Voltar ao perfil</button><div className="settings-head"><span className="mini-label">PREFERÊNCIAS</span><h1>Configurações</h1><p>Controle sua conta, integrações e como o DealRadar funciona para você.</p></div><div className="settings-grid"><nav><button className="active">{icon("user")} Conta</button><button>{icon("bell")} Notificações</button><button>{icon("radar")} Contas conectadas</button><button>{icon("settings")} Segurança</button></nav><section className="settings-card"><h2>Preferências regionais</h2><p>Os preços e conteúdos serão adaptados automaticamente.</p><div className="field-row"><label>Moeda<select value={currency} onChange={e=>setCurrency(e.target.value)}><option value="BRL">Real brasileiro (BRL)</option><option value="USD">Dólar americano (USD)</option><option value="EUR">Euro (EUR)</option></select></label><label>Idioma<select value={language} onChange={e=>setLanguage(e.target.value)}><option>Português (Brasil)</option><option>English</option><option>Español</option></select></label></div><h2>Alertas e aparência</h2><Toggle title="Alertas de preço" description="Avise quando um favorito ou interesse entrar em promoção." value={alerts} setter={setAlerts}/><Toggle title="Tema escuro" description="Use a interface otimizada para ambientes com pouca luz." value={dark} setter={setDark}/><div className="account-data"><h2>Dados da conta</h2><label>Nome de usuário<input defaultValue="Eduardo Santos"/></label><label>E-mail<input defaultValue="eduardo@example.com"/></label><button className="save" onClick={()=>toast("Configurações salvas")}>Salvar alterações</button></div><div className="security-box"><div><strong>Autenticação em duas etapas</strong><p>Adicione uma camada extra de segurança à sua conta.</p></div><button onClick={()=>toast("Configuração de 2FA iniciada")}>Configurar 2FA</button></div><div className="danger"><div><strong>Excluir conta</strong><p>Remove permanentemente seus dados, listas e alertas.</p></div><button>Excluir minha conta</button></div></section></div></main> }
function Toggle({title,description,value,setter}:{title:string,description:string,value:boolean,setter:(v:boolean)=>void}) { return <div className="toggle-row"><div><strong>{title}</strong><p>{description}</p></div><button className={value?"on":""} onClick={()=>setter(!value)}><span/></button></div> }
