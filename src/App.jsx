import React, { useMemo, useState } from 'react';
import Ram3D from './components/Ram3DLazy.jsx';

const types={
 DDR5:{label:'DDR5',tag:'ALTO RENDIMIENTO',desc:'Memoria DRAM moderna para computadores y servidores, orientada a mayor ancho de banda y densidad.',speed:'Alta',power:'Mejorada',use:'PC / Workstation / Servidores'},
 LPDDR5X:{label:'LPDDR5X',tag:'BAJO CONSUMO',desc:'Familia de memoria de bajo consumo para equipos móviles y portátiles donde rendimiento y autonomía deben equilibrarse.',speed:'Muy alta',power:'Muy bajo',use:'Móviles / Portátiles'},
 SRAM:{label:'SRAM',tag:'ULTRA RÁPIDA',desc:'Memoria estática que no necesita refresco periódico. Su velocidad la hace ideal para la caché del procesador, aunque requiere más componentes por bit y suele tener mayor costo y menor densidad.',speed:'Extrema',power:'Variable',use:'Caché CPU'},
 DRAM:{label:'DRAM',tag:'MEMORIA PRINCIPAL',desc:'Almacena bits en celdas con transistores y capacitores. La carga se pierde con el tiempo y exige refresco periódico; a cambio, ofrece alta densidad y menor costo por bit.',speed:'Alta',power:'Media',use:'RAM principal'}
};

const quiz=[
 ['¿Qué memoria se usa principalmente en las cachés del procesador?',['SRAM','DRAM','SSD'],'SRAM'],
 ['¿Qué característica distingue a la DRAM?',['Necesita refresco','No es volátil','Es almacenamiento permanente'],'Necesita refresco'],
 ['¿Qué tecnología prioriza el bajo consumo en móviles?',['LPDDR5X','SRAM','HDD'],'LPDDR5X'],
 ['¿Por qué la DRAM necesita refresco periódico?',['La carga de sus capacitores se pierde','Sus datos pasan a la caché','El SSD se desconecta'],'La carga de sus capacitores se pierde'],
 ['¿Qué combinación es habitual en un computador de escritorio?',['Caché SRAM y RAM DDR5','Caché DRAM y RAM LPDDR5X','Caché SSD y RAM SRAM'],'Caché SRAM y RAM DDR5'],
 ['¿Qué tecnología ayuda a ampliar memoria en servidores compatibles?',['CXL','SATA','LPDDR'],'CXL']
];
const moduleParts=[
 {id:'pcb',name:'PCB',description:'La placa de circuito conecta eléctricamente los componentes.'},
 {id:'chips',name:'Chips de memoria',description:'Encapsulan las celdas donde se almacenan los datos.'},
 {id:'heatsinks',name:'Disipadores',description:'Las cubiertas metálicas ayudan a repartir el calor del módulo.'},
 {id:'contacts',name:'Contactos',description:'Conectan eléctricamente el módulo con la placa base.'}
];
const technologies=[
 {name:'React',detail:'UI · 19.3.0',mark:'R',href:'https://react.dev/'},
 {name:'React DOM',detail:'Render web · 19.3.0',mark:'DOM',href:'https://react.dev/reference/react-dom'},
 {name:'React Three Fiber',detail:'React renderer · 9.8.1',mark:'R3F',href:'https://r3f.docs.pmnd.rs/getting-started/introduction'},
 {name:'Drei',detail:'Helpers 3D · 10.7.9',mark:'D',href:'https://drei.docs.pmnd.rs/getting-started/introduction'},
 {name:'Three.js',detail:'Motor 3D · 0.180.0',mark:'3D',href:'https://threejs.org/docs/'},
 {name:'Vite',detail:'Build tool · 7.3.6',mark:'V',href:'https://vite.dev/guide/'},
 {name:'@vitejs/plugin-react',detail:'Plugin · 5.2.0',mark:'V+',href:'https://github.com/vitejs/vite-plugin-react'},
 {name:'JavaScript + JSX',detail:'ES Modules',mark:'JS',href:'https://developer.mozilla.org/en-US/docs/Web/JavaScript'},
 {name:'CSS',detail:'Estilos y animaciones',mark:'CSS',href:'https://developer.mozilla.org/en-US/docs/Web/CSS'},
 {name:'Node.js',detail:'Entorno de ejecución',mark:'Node',href:'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs'},
 {name:'npm',detail:'Paquetes y scripts',mark:'npm',href:'https://docs.npmjs.com/'},
 {name:'WebGL + Canvas',detail:'Renderizado 3D en navegador',mark:'GPU',href:'https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API'}
];
const references=[
 {name:'SRAM vs DRAM',description:'Refresco, velocidad, densidad y costo por bit.',href:'https://www.geeksforgeeks.org/computer-organization-architecture/difference-between-sram-and-dram/'},
 {name:'Jerarquía de memoria',description:'Caché, memoria principal y almacenamiento.',href:'https://www.geeksforgeeks.org/computer-organization-architecture/memory-hierarchy-design-and-its-characteristics/'},
 {name:'DDR5 overview',description:'Características y estructura de los módulos DDR5.',href:'https://www.kingston.com/en/blog/pc-performance/ddr5-overview'},
 {name:'LPDDR5X memory',description:'Memoria móvil de Micron y eficiencia energética.',href:'https://www.micron.com/products/memory/dram-components/lpddr5x'},
 {name:'About CXL',description:'Expansión e interconexión de memoria compatible.',href:'https://computeexpresslink.org/about-cxl/'},
 {name:'What is Persistent Memory?',description:'Conceptos de memoria persistente · SNIA.',href:'https://www.snia.org/education/what-is-persistent-memory'}
];
function App(){
 const [active,setActive]=useState('DDR5'); const [q,setQ]=useState(0); const [picked,setPicked]=useState(''); const [selectedPart,setSelectedPart]=useState('all'); const [technologyPage,setTechnologyPage]=useState(0);
 const data=types[active]; const question=quiz[q];
 const technologyPageCount=Math.ceil(technologies.length/3);
 const changeTechnologyPage=(direction)=>setTechnologyPage((current)=>(current+direction+technologyPageCount)%technologyPageCount);
 const next=()=>{setPicked('');setQ((q+1)%quiz.length)};
 return <div className="site">
    <nav className="nav"><div className="brand"><span className="brand-dot"/>MEMORY<span>LAB</span></div><div className="navlinks"><a href="#conceptos">Conceptos</a><a href="#tipos">Tipos</a><a href="#comparativa">SRAM / DRAM</a><a href="#jerarquia">Jerarquía</a><a href="#evolucion">Evolución</a><a href="#notas">Notas</a></div><a className="nav-cta" href="#demo">Explorar 3D</a></nav>
  <header className="hero">
    <div className="hero-copy"><div className="eyebrow"><i/> ARQUITECTURA DE COMPUTADORES · 2026</div><h1>La memoria que<br/><em>hace posible</em><br/>el rendimiento.</h1><p>Un laboratorio interactivo para entender RAM, DRAM, SRAM, DDR5 y LPDDR5X desde la arquitectura hasta el hardware.</p><div className="hero-actions"><a href="#demo" className="primary">Explorar modelo 3D <b>↗</b></a><a href="#tipos" className="secondary">Ver tecnologías</a></div><div className="hero-metrics"><div><strong>01</strong><span>Modelo 3D</span></div><div><strong>04</strong><span>Tecnologías</span></div><div><strong>10</strong><span>Secciones</span></div></div></div>
   <div className="hero-art"><div className="glow"/><Ram3D/><div className="floating-card card-a"><span>MEMORY BUS</span><b>64 BIT</b></div><div className="floating-card card-b"><span>TIPO</span><b>DDR5</b></div></div>
  </header>
  <main>
   <section id="conceptos" className="section intro"><div className="section-kicker">01 · FUNDAMENTOS</div><div className="two-col"><div><h2>¿Qué es la<br/><span>memoria interna?</span></h2></div><div><p className="lead">Es el espacio de trabajo donde el sistema mantiene temporalmente los datos e instrucciones que el procesador necesita.</p><p>La RAM es volátil: al apagar el equipo, su contenido desaparece. Para conseguir rendimiento, los computadores combinan diferentes niveles de memoria, equilibrando velocidad, capacidad, energía y costo.</p></div></div><div className="feature-grid"><article><b>01</b><h3>Velocidad</h3><p>La latencia determina cuánto tarda la memoria en responder.</p></article><article><b>02</b><h3>Ancho de banda</h3><p>Indica cuánto volumen de datos puede transferirse por unidad de tiempo.</p></article><article><b>03</b><h3>Capacidad</h3><p>Define cuántos datos pueden mantenerse disponibles para los procesos.</p></article></div></section>
  <section id="demo" className="section demo"><div className="section-kicker">02 · HARDWARE INTERACTIVO</div><div className="section-head"><h2>Desarma una RAM<br/><span>con la mirada.</span></h2><p>Selecciona una pieza para aislarla, ampliarla y examinarla en 3D.</p></div><div className="demo-layout"><div><Ram3D focus={selectedPart}/></div><div className="component-list">{moduleParts.map((part,index)=><button type="button" key={part.id} className={`component ${selectedPart===part.id?'active':''}`} aria-pressed={selectedPart===part.id} onClick={()=>setSelectedPart(selectedPart===part.id?'all':part.id)}><span>{String(index+1).padStart(2,'0')}</span><div><h3>{part.name}</h3><p>{part.description}</p></div></button>)}<button type="button" className="component-reset" onClick={()=>setSelectedPart('all')}>Mostrar RAM completa</button></div></div></section>
    <section id="tipos" className="section types"><div className="section-kicker">03 · TECNOLOGÍAS</div><div className="section-head"><h2>Cuatro memorias.<br/><span>Cuatro funciones.</span></h2><p>Selecciona una tecnología para cambiar la información del panel.</p></div><div className="type-tabs">{Object.keys(types).map(k=><button className={active===k?'on':''} onClick={()=>setActive(k)} key={k}>{k}</button>)}</div><div className="type-panel"><div><div className="pill">{data.tag}</div><h3>{data.label}</h3><p>{data.desc}</p></div><div className="specs"><div><small>VELOCIDAD</small><strong>{data.speed}</strong></div><div><small>ENERGÍA</small><strong>{data.power}</strong></div><div><small>USO</small><strong>{data.use}</strong></div></div></div></section>
    <section id="comparativa" className="section compare"><div className="section-kicker">03B · COMPARATIVA · DOCUMENTO DEL PROYECTO</div><div className="two-col"><div><h2>SRAM y DRAM,<br/><span>dos compromisos.</span></h2></div><div><p className="lead">La velocidad, la densidad y el costo determinan qué lugar ocupa cada tecnología.</p></div></div><div className="feature-grid"><article><b>SRAM · ESTÁTICA</b><h3>Rapidez cerca del CPU</h3><p>No necesita refresco periódico. Al requerir más componentes por bit, suele ser más costosa y menos densa; por eso se usa en la caché.</p></article><article><b>DRAM · DINÁMICA</b><h3>Capacidad para la RAM</h3><p>Sus celdas usan transistores y capacitores. Como la carga se pierde, requieren refresco; su menor costo por bit favorece una mayor capacidad.</p></article><article><b>CRITERIOS</b><h3>Una elección equilibrada</h3><p>La latencia mide el tiempo de respuesta, el ancho de banda el volumen transferido y la capacidad cuánto puede mantenerse disponible.</p></article></div><p className="source-note">Fuente: Tipos de memoria.docx, incluido en este proyecto.</p></section>
    <section id="jerarquia" className="section hierarchy"><div className="section-kicker">04 · SISTEMA</div><div className="section-head"><h2>La ruta de un dato.</h2><p>Cuanto más cerca está una memoria del CPU, normalmente menor es la latencia y menor la capacidad.</p></div><div className="memory-road"><div><small>01</small><strong>CPU</strong><span>Procesamiento</span></div><i>→</i><div><small>02</small><strong>SRAM</strong><span>Caché</span></div><i>→</i><div><small>03</small><strong>DRAM</strong><span>RAM</span></div><i>→</i><div><small>04</small><strong>SSD</strong><span>Almacenamiento</span></div></div></section>
    <section className="section examples"><div className="section-kicker">04B · EJEMPLOS DE USO</div><div className="section-head"><h2>La memoria cambia<br/><span>según el dispositivo.</span></h2><p>Un mismo sistema combina tecnologías distintas para atender sus necesidades.</p></div><div className="feature-grid"><article><b>COMPUTADOR</b><h3>SRAM + DDR5</h3><p>La caché del procesador usa SRAM; la memoria principal puede utilizar DDR5.</p></article><article><b>TELÉFONO</b><h3>LPDDR</h3><p>La memoria de bajo consumo ayuda a equilibrar rendimiento y autonomía.</p></article><article><b>SERVIDOR</b><h3>DRAM a escala</h3><p>Grandes cantidades de DRAM permiten atender múltiples procesos y usuarios.</p></article></div><p className="source-note">Ejemplos resumidos del documento Tipos de memoria.docx.</p></section>
    <section id="evolucion" className="section evolution"><div className="section-kicker">05 · EVOLUCIÓN</div><div className="section-head"><h2>Más ancho de banda.<br/><span>Más eficiencia.</span></h2></div><div className="timeline"><article><span>GENERACIÓN</span><b>DDR5</b><p>Mayor densidad y ancho de banda para sistemas modernos.</p></article><article><span>MÓVIL</span><b>LPDDR5X</b><p>Rendimiento orientado a eficiencia energética.</p></article><article><span>DATACENTER</span><b>CXL</b><p>Conecta y amplía recursos de memoria en sistemas compatibles, especialmente en servidores y centros de datos.</p></article><article><span>HISTÓRICO</span><b>OPTANE</b><p>Intel Optane Persistent Memory exploró cómo combinar memoria y almacenamiento; ya no se desarrolla comercialmente.</p></article></div><p className="source-note">Contenido ampliado a partir de Tipos de memoria.docx, incluido en el proyecto.</p></section>
    <section className="section quiz"><div className="section-kicker">06 · RETO</div><div className="quiz-box"><div><span className="pill">QUIZ {q+1}/{quiz.length}</span><h2>{question[0]}</h2></div><div className="answers">{question[1].map(a=><button key={a} onClick={()=>setPicked(a)} className={picked? (a===question[2]?'right':a===picked?'wrong':'') : ''}>{a}</button>)}</div>{picked&&<div className={picked===question[2]?'feedback right-t':'feedback wrong-t'}>{picked===question[2]?'✓ Respuesta correcta':'✕ Revisa el concepto'}<button onClick={next}>Siguiente →</button></div>}</div></section>
  <section className="section refs"><div className="section-kicker">07 · REFERENCIAS</div><div className="refs-grid">{references.map((reference)=><div key={reference.name}><a href={reference.href} target="_blank" rel="noreferrer"><b>{reference.name}</b><span>{reference.description}</span><span className="reference-link">Abrir fuente <span aria-hidden="true">↗</span></span></a></div>)}</div></section>
  <section id="notas" className="section notes"><div className="section-kicker">08 · NOTAS · PUEDE INTERESAR</div><div className="section-head"><h2>Otros conceptos<br/><span>de memoria.</span></h2><p>Almacenamiento en red, registros del procesador y memoria volátil: tres ideas que amplían la jerarquía.</p></div><div className="feature-grid"><article><b>01 · ALMACENAMIENTO EN RED</b><h3>NAS</h3><p><strong>Network Attached Storage</strong> es un dispositivo conectado a una red para guardar y compartir archivos entre computadores y otros dispositivos. A diferencia de la RAM, usa almacenamiento no volátil y conserva la información aunque se apague.</p></article><article><b>02 · DENTRO DEL PROCESADOR</b><h3>Registros y RAM</h3><p>Los registros son áreas pequeñas dentro de la CPU que guardan temporalmente los datos e instrucciones de uso inmediato. La RAM tiene mayor capacidad y mantiene los programas y datos activos del sistema; los registros son más rápidos y están más cerca de las unidades de procesamiento.</p></article><article><b>03 · PERSISTENCIA</b><h3>Memoria volátil</h3><p>Es la memoria que pierde la información cuando se corta la energía eléctrica. La RAM es volátil: tanto <strong>DRAM como SRAM</strong> pierden sus datos al apagar el equipo, aunque tienen características y usos distintos.</p></article></div></section>
  </main>
  <footer className="site-footer">
  <section className="footer-tech-carousel" aria-label="Tecnologías del proyecto">
   <div className="footer-tech-header">
    <div><div className="section-kicker">STACK · MEMORIA INTERNA</div><h2>Tecnologías del proyecto</h2></div>
    <div className="tech-controls"><button type="button" aria-label="Grupo anterior de tecnologías" onClick={()=>changeTechnologyPage(-1)}>‹</button><span className="tech-counter" aria-live="polite">{String(technologyPage+1).padStart(2,'0')} / {String(technologyPageCount).padStart(2,'0')}</span><button type="button" aria-label="Grupo siguiente de tecnologías" onClick={()=>changeTechnologyPage(1)}>›</button></div>
   </div>
   <div className="tech-viewport" role="region" aria-roledescription="carrusel" aria-label="Stack tecnológico">
    <div className="tech-page" key={technologyPage} role="group" aria-roledescription="diapositiva" aria-label={`Grupo ${technologyPage+1} de ${technologyPageCount}`}>
    {technologies.slice(technologyPage*3,technologyPage*3+3).map((technology)=><a className="tech-card" key={technology.name} href={technology.href} target="_blank" rel="noreferrer"><span className="tech-mark" aria-hidden="true">{technology.mark}</span><span className="tech-info"><strong>{technology.name}</strong><small>{technology.detail}</small></span><span className="tech-external" aria-hidden="true">↗</span></a>)}
    </div>
   </div>
  </section>
  <div className="footer-bottom"><div className="brand"><span className="brand-dot"/>MEMORY<span>LAB</span></div><p>Proyecto académico · Arquitectura de Computadores</p><small>RAM · DRAM · SRAM · DDR5 · LPDDR5X</small></div>
  </footer>
 </div>
}
export default App;
