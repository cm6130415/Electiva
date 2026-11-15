const $=s=>document.querySelector(s),st={
  get:k=>{
    try{
      return localStorage.getItem(k)
    }catch(e){
      return null
    }
  },
  set:(k,v)=>{
    try{
      localStorage.setItem(k,v)
    }catch(e){}
  }
};
const D={
  es:{
    tabs:["Inicio","Datos","BI","Dashboards","IA","Preguntas"],
    prog:"Progreso",
    start:"Comenzar módulo 1",
    next:"Pasar al siguiente módulo",
    fin:"Finalizar",
    done:"¡Completaste todos los módulos!",
    hero:"Aprende a gestionar, analizar y visualizar datos, y a usar la inteligencia artificial para decidir mejor. Avanza módulo por módulo y completa las actividades.",
    type:["GESTIÓN DE DATOS","ANALÍTICA DE DATOS","BUSINESS INTELLIGENCE","DASHBOARDS","INTELIGENCIA ARTIFICIAL"],
    mod:"Módulo",
    ws:"Sopa de letras",
    wsh:"Haz clic en la primera y en la última letra de cada palabra.",
    qz:"Quiz",
    sc:"Puntaje",
    fac:"Facultad de Ingeniería",
    doc:"Docente",
    dev:"Desarrollado por",
    words:["DATOS","TABLERO","MODELO","KPI","ETL","ANALISIS"],
    mods:[],
    quiz:[["¿Qué analítica responde «qué pasará»?",["Descriptiva","Diagnóstica","Predictiva","Prescriptiva"],2],["¿Qué significa ETL?",["Extraer, transformar y cargar","Evaluar, testear y lanzar","Escribir, traducir y listar"],0],["¿Qué es un KPI?",["Un tipo de base de datos","Un indicador clave de desempeño","Un lenguaje de programación"],1],["¿Cuál es un riesgo de la IA?",["Sesgos en los datos","Exceso de memoria","Pantallas pequeñas"],0]]
  },
  en:{
    tabs:["Home","Data","BI","Dashboards","AI","Questions"],
    prog:"Progress",
    start:"Start module 1",
    next:"Go to the next module",
    fin:"Finish",
    done:"You completed all the modules!",
    hero:"Learn to manage, analyze and visualize data, and to use artificial intelligence to decide better. Move through the modules and complete the activities.",
    type:["DATA MANAGEMENT","DATA ANALYTICS","BUSINESS INTELLIGENCE","DASHBOARDS","ARTIFICIAL INTELLIGENCE"],
    mod:"Module",
    ws:"Word search",
    wsh:"Click the first and the last letter of each word.",
    qz:"Quiz",
    sc:"Score",
    fac:"Faculty of Engineering",
    doc:"Instructor",
    dev:"Developed by",
    words:["DATA","DASHBOARD","MODEL","KPI","ETL","INSIGHT"],
    mods:[],
    quiz:[["Which analytics answers “what will happen”?",["Descriptive","Diagnostic","Predictive","Prescriptive"],2],["What does ETL stand for?",["Extract, transform, load","Evaluate, test, launch","Write, translate, list"],0],["What is a KPI?",["A type of database","A key performance indicator","A programming language"],1],["Which is a risk of AI?",["Bias in the data","Too much memory","Small screens"],0]]
  }
};
const SVG_='<svg viewBox="0 0 360 260" role="img" aria-label="Dashboard"><rect x="20" y="24" width="90" height="46" rx="8" style="fill:var(--g)"/><rect x="135" y="24" width="90" height="46" rx="8" style="fill:var(--t)"/><rect x="250" y="24" width="90" height="46" rx="8" style="fill:var(--y)"/><g style="fill:var(--b)"><rect x="30" y="170" width="28" height="60" rx="4"/><rect x="68" y="140" width="28" height="90" rx="4"/><rect x="106" y="110" width="28" height="120" rx="4"/><rect x="144" y="150" width="28" height="80" rx="4"/></g><polyline points="30,120 80,95 130,100 180,70" fill="none" style="stroke:var(--y)" stroke-width="4"/><circle cx="270" cy="170" r="48" fill="none" style="stroke:var(--ln)" stroke-width="22"/><circle cx="270" cy="170" r="48" fill="none" style="stroke:var(--g)" stroke-width="22" stroke-dasharray="190 302" transform="rotate(-90 270 170)"/></svg>';
let tm,sel,quizS;
function grid(w,sd){
  const n=12,
  g=Array.from({
    length:n
  },()=>Array(n).fill(""));
  let s=sd||7;
  const r=()=>(s=s*16807%2147483647)/2147483647;
  for(const x of w)for(let t=0;t<300;t++){
    const h=r()<.5,
    X=Math.floor(r()*(n-(h?x.length:0))),
    Y=Math.floor(r()*(n-(h?0:x.length)));
    let ok=1;
    for(let i=0;i<x.length;i++){
      const c=g[Y+(h?0:i)][X+(h?i:0)];
      if(c&&c!==x[i])ok=0
    }
    if(ok){
      for(let i=0;i<x.length;i++)g[Y+(h?0:i)][X+(h?i:0)]=x[i];
      break
    }
  }
  return g.map(a=>a.map(c=>c||"ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(r()*26)]))
}
function games(d,rnd){
  const g=grid(d.words,rnd?1+Math.floor(Math.random()*2e9):7);
  sel=null;
  const ws=$("#ws");
  ws.innerHTML=g.map((r,y)=>r.map((c,x)=>`<b data-x="${x}" data-y="${y}">${c}</b>`).join("")).join("");
  $("#wl").innerHTML=d.words.map(w=>`<span id="w_${w}">${w}</span>`).join("");
  ws.onclick=e=>{
    const b=e.target.closest("b");
    if(!b)return;
    const x=+b.dataset.x,
    y=+b.dataset.y;
    if(!sel){
      sel=[x,y];
      b.classList.add("s");
      return
    }
    const[a,c]=sel;
    sel=null;
    ws.querySelectorAll(".s").forEach(k=>k.classList.remove("s"));
    if(a!=x&&c!=y)return;
    const n=Math.max(Math.abs(x-a),Math.abs(y-c)),
    dx=Math.sign(x-a),
    dy=Math.sign(y-c),
    cs=[];
    for(let i=0;i<=n;i++)cs.push(ws.children[(c+dy*i)*12+a+dx*i]);
    const s=cs.map(k=>k.textContent).join(""),
    w=d.words.find(v=>v==s||v==[...s].reverse().join(""));
    if(w){
      cs.forEach(k=>k.classList.add("f"));
      $("#w_"+w).classList.add("f")
    }
  };
  quizS=0;
  const q=$("#qz");
  d.quiz.forEach((it,i)=>{
    const e=document.createElement("div");
    e.innerHTML=`<p><b>${i+1}. ${it[0]}</b></p>`+it[1].map((o,j)=>`<button data-j="${j}">${o}</button>`).join("");
    e.onclick=ev=>{
      const b=ev.target.closest("button");
      if(!b||e.dataset.a)return;
      e.dataset.a=1;
      const ok=+b.dataset.j==it[2];
      b.classList.add(ok?"good":"bad");
      if(ok)quizS++;
      else e.children[it[2]+1].classList.add("good");
      if(q.querySelectorAll("[data-a]").length==d.quiz.length){
        const p=document.createElement("p");
        p.innerHTML=`<b>${d.sc}: ${quizS}/${d.quiz.length}</b>`;
        q.append(p)
      }
    };
    q.append(e)
  })
}
function typing(d){
  clearInterval(tm);
  const el=$("#ty");
  if(!el)return;
  let w=0,
  i=0,
  del=0;
  tm=setInterval(()=>{
    const t=d.type[w];
    if(!del){
      el.textContent=t.slice(0,++i);
      if(i==t.length)del=1
    }else{
      el.textContent=t.slice(0,--i);
      if(!i){
        del=0;
        w=(w+1)%d.type.length
      }
    }
  },90)
}
const DRIVE_ID="10Kpo9BRE5x8Z7TqGLkEEM5c82DsUM6je";
const VIDEO_URL="https://drive.google.com/file/d/"+DRIVE_ID+"/preview";
const CONFIG={
  video:VIDEO_URL,
  hero:"images/hero-bg.jpg"
},N=7;
D.es.tabs=["Inicio","Datos","BI","Dashboards","IA","Video","Juegos"];
D.en.tabs=["Home","Data","BI","Dashboards","AI","Video","Games"];
Object.assign(D.es,{
  vt:"Video de Notebook",
  vp:"Mira el video para repasar los temas de la electiva.",
  gt:"Juegos",
  gp:"Pon a prueba lo aprendido con estos juegos."
});
Object.assign(D.en,{
  vt:"Notebook video",
  vp:"Watch the video to review the topics of the elective.",
  gt:"Games",
  gp:"Test what you learned with these games."
});
D.es.rg="Reiniciar juegos";
D.en.rg="Restart games";
D.en.next="Next module";
D.es.next="Pasar al siguiente módulo";
D.es.qh="Preguntas de repaso";
D.es.qp="Responde con lo que aprendiste en todos los módulos.";
D.en.qh="Review questions";
D.en.qp="Answer using what you learned in all the modules.";
const S={
  lang:st.get("lg")||"es",
  theme:st.get("th")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),
  cur:0,
  fin:0,
  done:new Set()
};
function vid(){
  return `<iframe src="${VIDEO_URL}" width="100%" height="100%" allow="autoplay; fullscreen" allowfullscreen referrerpolicy="no-referrer-when-downgrade" style="border:0;"></iframe>`
}
/* ===== Contenido alineado con el video de NotebookLM (ES / EN) ===== */
const C = {
  es: {
    hero: "Toma de decisiones basada en datos: aprende el camino que va de los datos crudos a las decisiones estratégicas, pasando por la gestión, el almacenamiento, la visualización y la inteligencia artificial.",
    dikw: { h: "De los datos a la sabiduría", p: "Decidir con datos significa apoyar cada decisión en evidencia y no solo en la intuición. El camino se explica con la pirámide DIKW: cada nivel agrega contexto y valor al anterior hasta llegar a decisiones estratégicas.",
      lv: [["Datos", "Hechos crudos y sin contexto: cifras, registros, lecturas de sensores."], ["Información", "Datos organizados y con contexto que responden qué, quién, dónde y cuándo."], ["Conocimiento", "Información interpretada con patrones y reglas que explican cómo y por qué ocurre algo."], ["Sabiduría", "Aplicar el conocimiento para tomar la mejor decisión estratégica."]] },
    m1: { t: "Gestión y analítica de datos", d: "Pilar 1: la infraestructura que recolecta, gobierna y prepara los datos. Sin esta base, ni la inteligencia de negocios ni la inteligencia artificial pueden dar resultados confiables.",
      steps: [["Recolección y gobernanza", "Los datos llegan de sistemas, formularios, sensores y la web. La gobernanza define responsables, políticas de acceso y reglas de uso para protegerlos y usarlos de forma consistente."],
        ["Calidad y limpieza", "La calidad se mide en exactitud, completitud, consistencia y actualidad. La limpieza elimina duplicados, corrige errores y estandariza formatos antes de analizar."],
        ["Procesos ETL", "Extracción: se leen los datos de las fuentes. Transformación: se limpian, unen y convierten. Carga: se guardan en el destino analítico. Es la base técnica que alimenta todo el sistema."],
        ["Los 4 niveles de analítica", "Se avanza de describir a prescribir, con más valor y complejidad en cada nivel."]],
      etl: ["Extracción", "Transformación", "Carga"], lv: [["Descriptiva", "¿Qué pasó?"], ["Diagnóstica", "¿Por qué pasó?"], ["Predictiva", "¿Qué pasará?"], ["Prescriptiva", "¿Qué debo hacer?"]] },
    m2: { t: "Almacenamiento y Business Intelligence", d: "Pilar 2: la información se consolida en un almacén confiable para que el negocio consulte datos estructurados, históricos y consistentes.",
      bi: "La inteligencia de negocios tradicional toma los datos ya procesados por el ETL y los organiza para reportes y análisis históricos. Su rol crítico es ofrecer una versión única y confiable de la verdad.",
      etl: [["Extracción", "Se obtienen los datos de ERP, CRM, archivos y otras fuentes."], ["Transformación", "Se limpian, validan, unifican y se aplican reglas de negocio."], ["Carga", "Los datos listos se guardan en el almacén para su consulta."]],
      dw: ["Data Warehouse", ["Datos estructurados y depurados", "Histórico organizado por temas del negocio", "Ideal para reportes y BI confiables"]],
      dl: ["Data Lake", ["Datos en bruto: tablas, textos, imágenes, logs", "Estructura definida al momento de leer", "Ideal para exploración y ciencia de datos"]],
      note: "Impacto empresarial: el Data Warehouse da consistencia a los reportes; el Data Lake da flexibilidad para explorar. Muchas empresas combinan ambos." },
    m3: { t: "Dashboards y visualización de datos", d: "Pilar 3: la interfaz de control que convierte métricas complejas y KPIs en gráficos claros para la supervisión técnica y ejecutiva.",
      big: ["Tablero de control ejecutivo", "Un dashboard reúne en una sola vista los indicadores clave (KPI) de un proceso o de la empresa, actualizados y listos para actuar. Cada KPI debe ser específico, medible, relevante y tener una meta visible."],
      kpis: ["Ventas del mes", "Margen", "Tiempo de atención", "Satisfacción"],
      r1: ["Reglas de diseño visual", ["Una pregunta de negocio por tablero", "Pocos KPI y bien jerarquizados", "Colores con sentido y buen contraste"]],
      r2: ["Supervisión técnica y ejecutiva", ["Nivel ejecutivo: KPI y tendencias", "Nivel técnico: detalle y alertas", "Datos actualizados y fuente clara"]],
      tt: "¿Qué gráfico usar?", th: ["Objetivo del negocio", "Gráfico recomendado"],
      rows: [["Comparar categorías", "Barras"], ["Ver una tendencia en el tiempo", "Líneas"], ["Mostrar partes de un total (pocas)", "Anillo o torta"], ["Relacionar dos variables", "Dispersión"], ["Consultar valores exactos", "Tabla"], ["Vigilar una meta", "Indicador o velocímetro"]],
      toolh: "Herramientas líderes", tools: [["Power BI", "Integración con Excel y Microsoft."], ["Tableau", "Visualización avanzada e interactiva."], ["Looker Studio", "Gratuito y fácil de compartir."]] },
    m4: { t: "IA generativa y agentes", d: "Pilar 4: la capa de automatización avanzada. Con LLMs, agentes y sistemas compuestos se acelera el análisis y se alcanza la sabiduría operativa, siempre con ética y supervisión humana.",
      items: [["Modelos de lenguaje (LLMs)", "Se entrenan con enormes volúmenes de texto para predecir la siguiente palabra. Así redactan, resumen, traducen, analizan datos y generan código a partir de instrucciones (prompts)."],
        ["Agentes de IA", "Un agente usa un LLM para razonar, planificar y ejecutar acciones con herramientas (consultar bases de datos, enviar correos, ejecutar código) hasta cumplir un objetivo."],
        ["Sistemas Compound AI", "Combinan varios componentes: modelos, recuperación de información (RAG), herramientas y controles. Son más precisos y confiables que depender de un solo modelo."],
        ["Ética y supervisión humana", "Los modelos pueden tener sesgos, filtrar datos sensibles o inventar información (alucinaciones). Hay que validar resultados, proteger la privacidad y mantener a una persona responsable de la decisión."]],
      bph: "Buenas prácticas", bp: ["Define rol, contexto, tarea y formato en cada prompt", "Verifica las respuestas con fuentes confiables", "No compartas datos sensibles con modelos externos", "Revisa y prueba el código generado antes de usarlo"] },
    words: ["DATOS", "SABIDURIA", "WAREHOUSE", "TABLERO", "AGENTES", "ETL"],
    quiz: [["¿Cuál es el orden de la pirámide DIKW?", ["Información, Datos, Sabiduría, Conocimiento", "Datos, Información, Conocimiento, Sabiduría", "Conocimiento, Datos, Información, Sabiduría"], 1],
      ["¿Qué significa ETL?", ["Extracción, Transformación y Carga", "Evaluación, Test y Lanzamiento", "Escritura, Traducción y Lista"], 0],
      ["¿Qué nivel de analítica responde «¿qué debo hacer?»", ["Descriptiva", "Diagnóstica", "Predictiva", "Prescriptiva"], 3],
      ["¿Qué diferencia a un Data Warehouse de un Data Lake?", ["El Warehouse guarda datos estructurados y depurados; el Lake, datos en bruto", "El Lake solo guarda reportes", "No hay ninguna diferencia"], 0],
      ["¿Qué gráfico conviene para una tendencia en el tiempo?", ["Torta", "Líneas", "Tabla"], 1],
      ["¿Qué es un agente de IA?", ["Un tipo de base de datos", "Un LLM que planifica y ejecuta acciones con herramientas", "Una hoja de cálculo"], 1],
      ["¿Qué es un sistema Compound AI?", ["Un solo modelo gigante", "Varios componentes (modelos, recuperación, herramientas) trabajando juntos", "Un monitor de alta resolución"], 1],
      ["¿Qué se requiere siempre al usar IA generativa?", ["Supervisión humana", "Ningún control", "Compartir datos sensibles"], 0]]
  },
  en: {
    hero: "Data-driven decision making: learn the path from raw data to strategic decisions, through data management, storage, visualization and artificial intelligence.",
    dikw: { h: "From data to wisdom", p: "Deciding with data means backing each decision with evidence, not only intuition. The path is explained by the DIKW pyramid: each level adds context and value to the previous one until strategic decisions are reached.",
      lv: [["Data", "Raw facts without context: figures, records, sensor readings."], ["Information", "Organized data with context that answers what, who, where and when."], ["Knowledge", "Information interpreted with patterns and rules that explain how and why something happens."], ["Wisdom", "Applying knowledge to make the best strategic decision."]] },
    m1: { t: "Data management and analytics", d: "Pillar 1: the infrastructure that collects, governs and prepares data. Without this base, neither business intelligence nor artificial intelligence can deliver reliable results.",
      steps: [["Collection and governance", "Data arrives from systems, forms, sensors and the web. Governance defines owners, access policies and usage rules to protect it and use it consistently."],
        ["Quality and cleaning", "Quality is measured by accuracy, completeness, consistency and timeliness. Cleaning removes duplicates, fixes errors and standardizes formats before analysis."],
        ["ETL processes", "Extraction: data is read from the sources. Transformation: it is cleaned, joined and converted. Load: it is stored in the analytical target. It is the technical base that feeds the whole system."],
        ["The 4 levels of analytics", "Progress goes from describing to prescribing, with more value and complexity at each level."]],
      etl: ["Extraction", "Transformation", "Load"], lv: [["Descriptive", "What happened?"], ["Diagnostic", "Why did it happen?"], ["Predictive", "What will happen?"], ["Prescriptive", "What should I do?"]] },
    m2: { t: "Storage and Business Intelligence", d: "Pillar 2: information is consolidated in a reliable store so the business can query structured, historical and consistent data.",
      bi: "Traditional business intelligence takes data already processed by ETL and organizes it for reports and historical analysis. Its critical role is to provide a single, reliable version of the truth.",
      etl: [["Extraction", "Data is obtained from ERP, CRM, files and other sources."], ["Transformation", "Data is cleaned, validated, unified and business rules are applied."], ["Load", "Ready data is stored in the warehouse for querying."]],
      dw: ["Data Warehouse", ["Structured, cleaned data", "History organized by business subject", "Ideal for reliable reports and BI"]],
      dl: ["Data Lake", ["Raw data: tables, text, images, logs", "Structure defined when reading", "Ideal for exploration and data science"]],
      note: "Business impact: the Data Warehouse gives consistency to reports; the Data Lake gives flexibility to explore. Many companies combine both." },
    m3: { t: "Dashboards and data visualization", d: "Pillar 3: the control interface that turns complex metrics and KPIs into clear charts for technical and executive supervision.",
      big: ["Executive dashboard", "A dashboard brings together, in a single view, the key indicators (KPIs) of a process or the whole company, up to date and ready for action. Each KPI must be specific, measurable, relevant and have a visible target."],
      kpis: ["Monthly sales", "Margin", "Service time", "Satisfaction"],
      r1: ["Visual design rules", ["One business question per dashboard", "Few, well-prioritized KPIs", "Meaningful colors and good contrast"]],
      r2: ["Technical and executive oversight", ["Executive level: KPIs and trends", "Technical level: detail and alerts", "Up-to-date data and clear source"]],
      tt: "Which chart should I use?", th: ["Business goal", "Recommended chart"],
      rows: [["Compare categories", "Bars"], ["See a trend over time", "Lines"], ["Show parts of a whole (few)", "Donut or pie"], ["Relate two variables", "Scatter plot"], ["Look up exact values", "Table"], ["Track a target", "Indicator or gauge"]],
      toolh: "Leading tools", tools: [["Power BI", "Integrates with Excel and Microsoft."], ["Tableau", "Advanced, interactive visualization."], ["Looker Studio", "Free and easy to share."]] },
    m4: { t: "Generative AI and agents", d: "Pillar 4: the advanced automation layer. With LLMs, agents and compound systems, analysis is accelerated and operational wisdom is reached, always with ethics and human oversight.",
      items: [["Language models (LLMs)", "They are trained on huge volumes of text to predict the next word. This lets them write, summarize, translate, analyze data and generate code from instructions (prompts)."],
        ["AI agents", "An agent uses an LLM to reason, plan and carry out actions with tools (querying databases, sending emails, running code) until a goal is met."],
        ["Compound AI systems", "They combine several components: models, information retrieval (RAG), tools and safeguards. They are more accurate and reliable than depending on a single model."],
        ["Ethics and human oversight", "Models can be biased, leak sensitive data or invent information (hallucinations). Results must be validated, privacy protected and a person kept accountable for the decision."]],
      bph: "Best practices", bp: ["Define role, context, task and format in each prompt", "Verify answers with trusted sources", "Do not share sensitive data with external models", "Review and test generated code before using it"] },
    words: ["DATA", "WISDOM", "WAREHOUSE", "DASHBOARD", "AGENTS", "ETL"],
    quiz: [["What is the order of the DIKW pyramid?", ["Information, Data, Wisdom, Knowledge", "Data, Information, Knowledge, Wisdom", "Knowledge, Data, Information, Wisdom"], 1],
      ["What does ETL stand for?", ["Extraction, Transformation and Load", "Evaluation, Test and Launch", "Write, Translate and List"], 0],
      ["Which analytics level answers “what should I do?”", ["Descriptive", "Diagnostic", "Predictive", "Prescriptive"], 3],
      ["How does a Data Warehouse differ from a Data Lake?", ["The Warehouse stores structured, cleaned data; the Lake stores raw data", "The Lake only stores reports", "There is no difference"], 0],
      ["Which chart suits a trend over time?", ["Pie", "Lines", "Table"], 1],
      ["What is an AI agent?", ["A type of database", "An LLM that plans and carries out actions with tools", "A spreadsheet"], 1],
      ["What is a Compound AI system?", ["A single giant model", "Several components (models, retrieval, tools) working together", "A high-resolution monitor"], 1],
      ["What is always required when using generative AI?", ["Human oversight", "No controls", "Sharing sensitive data"], 0]]
  }
};
for (const l of ["es", "en"]) {
  D[l].hero = C[l].hero;
  D[l].words = C[l].words;
  D[l].quiz = C[l].quiz;
}

/* ===== Vistas: una diagramación distinta por módulo ===== */
const li = (a) => a.map((x) => `<li>${x}</li>`).join("");

function bodyM1(m) {
  const chips = (a) => `<div class="chips">${a}</div>`;
  const extra = [
    "",
    "",
    chips(m.etl.map((x) => `<span><b>→</b>${x}</span>`).join("")),
    chips(m.lv.map((x) => `<span><b>${x[0]}</b>${x[1]}</span>`).join("")),
  ];
  return `<ol class="steps">${m.steps.map((s, i) =>
    `<li class="step"><span class="num">${i + 1}</span><div><h3>${s[0]}</h3><p>${s[1]}</p>${extra[i]}</div></li>`
  ).join("")}</ol>`;
}

function bodyM2(m) {
  const flow = m.etl.map((e, i) =>
    `<div class="etl-b"><b>${e[0]}</b><p>${e[1]}</p></div>${i < 2 ? '<span class="arr">→</span>' : ""}`
  ).join("");
  return `<p class="lead">${m.bi}</p>
    <div class="etl">${flow}</div>
    <div class="split">
      <div class="sl"><h3>${m.dw[0]}</h3><ul>${li(m.dw[1])}</ul></div>
      <div class="sr"><h3>${m.dl[0]}</h3><ul>${li(m.dl[1])}</ul></div>
    </div>
    <p class="note">${m.note}</p>`;
}

function bodyM3(m) {
  const rows = m.rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("");
  const tools = m.tools.map((t) => `<span><b>${t[0]}</b>${t[1]}</span>`).join("");
  return `<div class="bento">
    <div class="bc big"><h3>${m.big[0]}</h3><p>${m.big[1]}</p>
      <div class="chips">${m.kpis.map((k) => `<span>${k}</span>`).join("")}</div></div>
    <div class="bc"><h3>${m.r1[0]}</h3><ul>${li(m.r1[1])}</ul></div>
    <div class="bc"><h3>${m.r2[0]}</h3><ul>${li(m.r2[1])}</ul></div>
    <div class="bc wide"><h3>${m.tt}</h3><div class="tw"><table>
      <tr><th>${m.th[0]}</th><th>${m.th[1]}</th></tr>${rows}</table></div></div>
    <div class="bc wide"><h3>${m.toolh}</h3><div class="chips tools">${tools}</div></div>
  </div>`;
}

function bodyM4(m) {
  const items = m.items.map((x, i) =>
    `<details name="acc"${i === 0 ? " open" : ""}><summary>${x[0]}</summary><p>${x[1]}</p></details>`
  ).join("");
  return `<div class="accw"><div class="acc">${items}</div>
    <aside class="bp"><h3>${m.bph}</h3><ul>${li(m.bp)}</ul></aside></div>`;
}

const BODIES = [null, bodyM1, bodyM2, bodyM3, bodyM4];

function view(d) {
  const c = S.cur, k = C[S.lang];
  if (S.fin) return `<section class="mod"><div class="container"><div class="ban">${d.done}</div></div></section>`;
  const nx = `<div class="next"><button class="nxb">${c < N - 1 ? d.next : d.fin}</button></div>`;
  if (c === 0) {
    const pyr = k.dikw.lv.slice().reverse().map((x) => `<b>${x[0]}</b>`).join("");
    return `<section class="hero" id="inicio"><div class="hero-bg"></div><div class="hero-triangle"></div>
      <div class="hero-container"><div class="hero-content">
        <h1>ELECTIVA PROFESIONAL I<span class="typing-text" id="ty"></span></h1>
        <p class="hero-subtitle">${d.hero}</p>
        <div class="hero-buttons"><button class="nxb">${d.start}</button></div></div>
        ${CONFIG.hero ? `<img class="hero-img" src="${CONFIG.hero}" alt="">` : SVG_}</div></section>
      <section class="mod nopad"><div class="container">
        <div class="section-header hiw-header"><h2>${k.dikw.h}</h2><p>${k.dikw.p}</p></div>
        <div class="dikw"><div class="pyr">${pyr}</div>
          <ul>${k.dikw.lv.map((x) => `<li><b>${x[0]}:</b> ${x[1]}</li>`).join("")}</ul></div>
        ${nx}</div></section>`;
  }
  const head = (t, p) => `<div class="section-header hiw-header"><span class="svc-eyebrow">${d.mod} ${c}</span><h2>${t}</h2><p>${p}</p></div>`;
  let h = "";
  if (c < 5) h = head(k["m" + c].t, k["m" + c].d) + BODIES[c](k["m" + c]);
  else if (c === 5) h = head(d.vt, d.vp) + `<div class="vid" id="vid">${vid()}</div>`;
  else h = head(d.gt, d.gp) + `<div class="card q" id="qz"><h3>${d.qz}</h3></div>
    <div class="card"><h3>${d.ws}</h3><p>${d.wsh}</p><button class="nxb" id="rg" style="padding:.6rem 1.4rem;margin-bottom:1rem">${d.rg}</button>
    <div class="ws" id="ws"></div><div class="wl" id="wl"></div></div>`;
  return `<section class="mod"><div class="container">${h}${nx}</div></section>`;
}

function go(i){S.cur=i;S.fin=0;S.done.add(i);$("#mmenu").classList.remove("open");render();scrollTo({top:0,behavior:"smooth"})}
function finish(){S.done.add(S.cur);S.fin=1;render();scrollTo({top:0,behavior:"smooth"})}
function render(){S.done.add(S.cur);const d=D[S.lang],H=document.documentElement;H.lang=S.lang;H.dataset.theme=S.theme;
$("#lang").textContent=S.lang=="es"?"EN":"ES";
const p=Math.round(S.done.size/N*100);$("#bar").style.width=p+"%";$("#pct").textContent=p+"%";$("#pl").textContent=`${
    d.tabs[Math.min(S.cur,N-1)]
  }
   · ${
    Math.min(S.cur+1,N)
  }
  /${N}`;
$("#app").innerHTML=view(d);document.querySelectorAll(".hero-buttons .nxb, .next .nxb").forEach(n=>n.onclick=()=>S.cur<N-1?go(S.cur+1):finish());
const tb=d.tabs.map((t,i)=>`<button data-i="${i}" class="${i==S.cur?"active":""} ">${t}</button>`).join("");$("#tabs").innerHTML=tb;$("#mmenu").innerHTML=tb;
if(!S.fin&&S.cur==6){games(d);$("#rg").onclick=()=>{$("#qz").innerHTML=`<h3>${
    d.qz
  }
  </h3>`;games(d,1)}}document.documentElement.style.setProperty("--navh",$("#mainNav").offsetHeight+"px");typing(d);
$("#foot").innerHTML=`<img src="images/programa-white.png" alt="Logo del programa"><div><b>${
    d.fac
  }
  </b><br>${
    d.doc
  }
  : Alvaro Salamanca Landinez<br>Electiva Profesional I<br>${
    d.dev
  }
  :<br>Camila Molina Guerrero<br>Jhoan David Perez Blanco<br>Elkin Alonso Torres Sandoval</div>`}
$("#lang").onclick=()=>{S.lang=S.lang=="es"?"en":"es";st.set("lg",S.lang);render()};
$("#theme").onclick=()=>{S.theme=S.theme=="dark"?"light":"dark";st.set("th",S.theme);document.documentElement.dataset.theme=S.theme};
render();
addEventListener("resize",()=>document.documentElement.style.setProperty("--navh",$("#mainNav").offsetHeight+"px"));
$("#tabs").onclick=$("#mmenu").onclick=e=>{const b=e.target.closest("button");if(b)go(+b.dataset.i)};
$("#burger").onclick=()=>$("#mmenu").classList.toggle("open");
addEventListener("load", () => document.documentElement.style.setProperty("--navh", $("#mainNav").offsetHeight + "px"));
