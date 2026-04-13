import { useState, useCallback, useRef, useEffect } from "react";

const T = {
  bg:"#080C14",bg1:"#0F1520",bg2:"#161D2E",bg3:"#1E2740",
  border:"#1C2538",borderL:"#2A3550",
  accent:"#6366F1",accentL:"#818CF8",accentBg:"#6366F115",
  green:"#10B981",greenBg:"#10B98112",red:"#EF4444",redBg:"#EF444412",
  amber:"#F59E0B",amberBg:"#F59E0B12",
  lilac:"#A78BFA",lilacBg:"#A78BFA12",
  t1:"#F1F5F9",t2:"#CBD5E1",t3:"#94A3B8",t4:"#64748B",
  MIN_PASS:80,
};

const STORAGE_KEY="qa-mastery-session";
function loadSession(){try{const d=localStorage.getItem(STORAGE_KEY);return Promise.resolve(d?JSON.parse(d):null);}catch{return Promise.resolve(null);}}
function saveSession(data){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}catch{}}

// Hints per module quiz (one hint per question, no answer revealed)
const QUIZ_HINTS={
  m1:["Piensa en órdenes de magnitud, no lineales.","Recuerda: la base ancha es lo más barato y rápido.","¿Qué necesita un charter para ser válido?","¿En qué fase del SDLC intervienes primero?","¿Qué haces cuando un requerimiento es vago?","¿Qué tipo de bug se introduce al modificar código existente?","¿Cuál es la primera ceremonia donde participas?"],
  m2:["El objetivo es REDUCIR la cantidad de tests, no aumentarla.","Los defectos se concentran donde los rangos cambian.","Cada condición binaria DUPLICA las combinaciones.","Piensa en lo que el sistema NO debería permitir.","¿Podría alguien externo ejecutar ese caso sin preguntarte nada?","Si no está mapeado, ¿cómo sabes que lo cubriste?"],
  m3:["¿La severidad y la prioridad miden lo mismo?","¿Quién decide cuándo se arregla vs qué tan grave es?","¿Qué tipo de vulnerabilidad es acceder a datos ajenos?","Un crash siempre tiene la misma severidad, sin importar cuántos afecte.","¿Qué acelera el fix más que solo describir el síntoma?"],
  m4:["Piensa en qué capa se encuentran la mayoría de bugs críticos.","¿Qué herramienta te permite filtrar tickets con lógica avanzada?","¿Qué encuentras en la DB que la UI no muestra?","Piensa en el módulo dedicado a QA dentro del ecosistema Microsoft.","¿Qué comando te dice exactamente qué archivos cambiaron?"],
  m5:["¿Qué pasa cuando automatizas sin criterio?","¿Qué efecto tiene en el equipo un test que falla aleatoriamente?","Recuerda la pirámide: ¿qué va en la base?","¿Qué pasa si cambias el CSS y usabas selectores CSS?","¿Qué patrón evita actualizar 47 archivos cuando cambia un selector?"],
  m6:["¿Qué percentil usan Google y Netflix para medir latencia?","¿Qué vulnerabilidad explota IDs secuenciales en URLs?","¿Qué se rompe ANTES del deploy si un servicio cambia su formato?","¿Qué práctica inyecta fallos deliberadamente?"],
  m7:["¿Qué incluye 'Done' además de código?","¿Dónde previenes más bugs: ejecutando o planificando?","¿Qué pasa si QA solo tiene 1 día al final?","¿Qué indica falta de criterio al bloquear releases?","¿Qué buscan los devs en un tester que realmente agrega valor?"],
  m8:["¿Cómo comunicas sin generar defensividad?","¿De qué eres responsable: tus tickets o el producto?","¿Qué demuestra honestidad intelectual en una entrevista?","¿Qué hace un gran tester que un buen tester no?","¿Qué haces cuando los datos contradicen la opinión de un senior?"],
};

const Section=({title,badge,badgeColor,children,style,border})=>(
  <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderLeft:border?`3px solid ${border}`:undefined,borderRadius:10,padding:"20px 22px",boxSizing:"border-box",...style}}>
    {(badge||title)&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
      {badge&&<span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,background:`${badgeColor||T.accent}15`,color:badgeColor||T.accent,letterSpacing:.5,textTransform:"uppercase"}}>{badge}</span>}
      {title&&<h3 style={{margin:0,fontSize:16,fontWeight:700,color:T.lilac,textAlign:"left"}}>{title}</h3>}
    </div>}
    {children}
  </div>
);
const P=({children,style})=><p style={{fontSize:14,lineHeight:1.85,color:T.t2,margin:"0 0 12px",textAlign:"left",...style}}>{children}</p>;
const BL=({items})=><ul style={{margin:"8px 0 14px",paddingLeft:20,textAlign:"left"}}>{items.map((x,i)=><li key={i} style={{fontSize:14,lineHeight:1.85,color:T.t2,marginBottom:6}}>{x}</li>)}</ul>;
const HL=({children})=><div style={{padding:"12px 16px",background:T.amberBg,borderLeft:`3px solid ${T.amber}`,borderRadius:6,marginTop:8}}><P style={{margin:0,color:T.t1,fontWeight:500}}>{children}</P></div>;
const Btn=({children,variant="primary",size="md",style,...p})=>{
  const sz=size==="sm"?{padding:"6px 14px",fontSize:12}:{padding:"10px 20px",fontSize:13};
  const v=variant==="primary"?{background:T.accent,color:"#fff",border:"none"}:variant==="ghost"?{background:"transparent",color:T.t3,border:"none"}:{background:"transparent",border:`1px solid ${T.borderL}`,color:T.t3};
  return <button style={{borderRadius:7,cursor:"pointer",fontWeight:600,fontFamily:"inherit",...sz,...v,...style}} {...p}>{children}</button>;
};
const Pill=({children,active,done,onClick})=>(
  <button onClick={onClick} style={{padding:"5px 12px",borderRadius:6,fontSize:12,fontWeight:600,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap",border:`1px solid ${active?T.accent:done?T.green:T.border}`,background:active?T.accentBg:"transparent",color:active?T.accentL:done?T.green:T.t4}}>{done&&"✓ "}{children}</button>
);

const M=[
{id:"m1",title:"Fundamentos del Testing",desc:"Qué es el testing, por qué existe, tipos de testing, STLC/SDLC y el rol real del tester en la industria.",
lessons:[
{id:"m1l1",title:"Qué es el Testing y por qué existe",
intro:"El testing no es \"verificar que funcione\". Es una disciplina de ingeniería cuyo objetivo es reducir el riesgo de fallos en producción que impacten al negocio, a los usuarios o a la reputación de la empresa.",
sections:[
{title:"El costo exponencial de los bugs",paragraphs:["Un bug encontrado en requisitos cuesta x1. En desarrollo cuesta x10. En QA cuesta x100. En producción cuesta x1000. Esta progresión no es teórica — está respaldada por décadas de datos de la industria."],bullets:["Knight Capital perdió $440M en 45 minutos por un bug en su sistema de trading automatizado","Facebook expuso 50 millones de tokens de acceso por un error de autenticación en 2018","Therac-25: errores de software en máquinas de radioterapia causaron muertes por sobredosis de radiación"],paragraphs2:["No son errores de \"malos desarrolladores\" — son fallos sistémicos donde el testing fue insuficiente o inexistente."]},
{title:"Por qué los humanos producen bugs",paragraphs:["Los errores de software no son accidentes aleatorios. Son consecuencia de sesgos cognitivos predecibles que afectan a TODOS los desarrolladores:"],bullets:["Sesgo de confirmación: el developer prueba que SU código funciona, no que falle","Efecto de anclaje: si algo funcionó ayer, asumimos que funciona hoy","Ceguera por familiaridad: después de ver el mismo código 100 veces, ya no ves los errores","Complejidad combinatoria: una app con 20 campos de 10 opciones tiene 10²⁰ combinaciones posibles"]},
{title:"Tu verdadero trabajo como tester",paragraphs:["No buscas bugs. Buscas RIESGO. Tu trabajo es responder:"],highlight:"¿Qué tan confiados estamos en que este software hace lo que debe, no hace lo que no debe, y sobrevive condiciones adversas?",paragraphs2:["Esa confianza se construye con evidencia: tests ejecutados, bugs encontrados, áreas cubiertas, riesgos mitigados."]}
],
senior:"En Big Tech, el QA no es un gate al final del proceso. Es un multiplicador de calidad que opera desde el diseño del requisito hasta el monitoreo en producción. Si esperas al código para empezar a testear, llegaste tarde.",
exercise:{title:"Análisis de Riesgo Real",scenario:"Eres QA Lead del checkout de un e-commerce ($2M/día). Lanzan \"Compra con un click\".",task:"Identifica 5 riesgos críticos ANTES de producción. Para cada uno:\n• Qué podría salir mal\n• Impacto al negocio\n• Cómo lo testearías\n\nPiensa en RIESGO, no en casos de prueba.",solution:["Doble cobro por click múltiple — chargebacks masivos. Test: clicks rápidos, idempotencia.","Race condition inventario — vender agotado. Test: 100 simultáneos, último ítem.","Pago expirado — orden sin cobro. Test: tarjetas expiradas, fondos insuficientes.","Dirección incorrecta por defecto — re-envíos. Test: múltiples direcciones, default eliminada.","Fallo parcial (cobro sin orden) — pérdida directa. Test: timeout post-cobro, rollback."]}},
{id:"m1l2",title:"Tipos de Testing — Taxonomía Real",
intro:"Cada tipo de testing existe por una razón específica. Si no sabes cuándo usar cada uno, desperdicias recursos o dejas huecos de cobertura.",
sections:[
{title:"Por nivel de ejecución",paragraphs:["Cada nivel verifica una capa diferente:"],bullets:["Unit Testing — Developer. Función aislada. Si un tester escribe units, algo está mal.","Integration Testing — Tu territorio. ¿Qué pasa si \"email\" viene null entre servicios?","E2E — Flujo completo como usuario. Costoso y frágil. Solo happy paths críticos."]},
{title:"Por propósito",bullets:["Smoke — \"¿La app enciende?\" <15 min. Si tarda 2h, no es smoke.","Regression — Lo que funcionaba SIGUE funcionando. 70% de bugs en prod son regresiones.","Sanity — Subset enfocado. \"Cambiamos pagos, verificamos pagos a profundidad.\"","Exploratory — Con charter: \"30 min, registro, datos extremos.\" NO es clickear sin rumbo."]},
{title:"La pirámide de testing",bullets:["70% unit — rápidos, aislados, baratos","20% integration — contratos entre componentes","10% E2E — solo happy paths críticos"],highlight:"Si tu E2E tiene 500 tests y tu integration 50, tu arquitectura está invertida."}
],
senior:"Exploratory sin charter = clickear sin dirección. Siempre define: área, datos, tiempo, qué documentas.",
exercise:{title:"Decide el Tipo de Testing",scenario:"Para cada escenario, decide tipo(s) y justifica.",task:"1. Cambio color botón Comprar de azul a verde.\n2. Migración MySQL→PostgreSQL sin cambiar API.\n3. Nuevo endpoint /api/v2/users coexiste con v1.\n4. Viernes 4pm, hotfix bug crítico en prod.\n5. PM dice \"que el checkout funcione bien en general\".",solution:["1. Visual regression. Verificar click handler.","2. Integration EXTENSO + performance comparison.","3. Integration v2 + regression v1 + contract testing.","4. Smoke SOLO del fix. Deploy con monitoreo.","5. NO es testeable. Preguntar: \"¿Qué significa bien? ¿Qué cambió?\""]}},
{id:"m1l3",title:"STLC, SDLC y tu Rol Real",
intro:"El error más común: esperar a que dev termine. En Big Tech, si esperas al código, llegaste tarde.",
sections:[
{title:"STLC — Las 6 fases",bullets:["1. Análisis de Requisitos — Ambigüedades ANTES del código.","2. Planificación — Qué SÍ, qué NO, herramientas, tiempo.","3. Diseño de Casos — Técnicas formales. NO improvises.","4. Configuración Ambiente — Datos, staging, mocks.","5. Ejecución — Tests, resultados, bugs precisos.","6. Cierre — Métricas, lecciones, qué se escapó."]},
{title:"Práctica Agile",paragraphs:["Sprint de 2 semanas. Refinement, estimación, shift-left, shift-right."],highlight:"No eres un paso. Eres un participante continuo."},
{title:"Tu influencia en Big Tech",paragraphs:["SDET en Google = misma voz que SWE. Bloquean releases si la calidad no cumple. Se gana con CRITERIO."]}
],
senior:"Tus preguntas en refinement evitan más bugs que tus tests. Una pregunta sobre un edge case ahorra 3 días de dev.",
exercise:{title:"Shift-Left en Acción",scenario:"User story: resetear contraseña. Link por email, expira 24h, políticas de seguridad.",task:"ANTES del código, identifica 8+ preguntas/ambigüedades.",solution:["¿Múltiples resets invalidan anteriores?","\"Políticas\" — ¿cuáles exactamente?","¿Rate limiting?","Email inexistente — ¿qué mensaje? (enumeración)","¿Link de un solo uso?","¿Cambia email post-reset?","¿Cerrar sesiones?","¿Notificación de cambio?","¿Prefetch de proxies invalida token?","¿Interacción con 2FA?"]}}
],
quiz:[
{q:"Bug en requisitos cuesta x1. ¿En producción?",o:["x10","x100","x1000","x50"],a:2},
{q:"Distribución correcta pirámide testing:",o:["70% E2E, 20% Int, 10% Unit","70% Unit, 20% Int, 10% E2E","33% cada uno","50% Int, 30% Unit, 20% E2E"],a:1},
{q:"Exploratory sin charter es:",o:["Testing creativo","Clickear sin dirección","Ágil válido","Ad-hoc aceptable"],a:1},
{q:"¿Qué es shift-left?",o:["Testear más rápido","Testing desde fases tempranas","Mover tests a la izquierda","Automatizar antes de diseñar"],a:1},
{q:"PM dice \"que funcione bien\". Respuesta:",o:["Testear todo","Preguntar qué significa, qué preocupa, qué cambió","No es tu responsabilidad","Smoke estándar"],a:1},
{q:"70% de bugs en prod son:",o:["Nuevos","Regresiones","Performance","UI"],a:1},
{q:"Tester en Agile empieza en:",o:["Cuando dev termina","Refinement","PM asigna","Día del deploy"],a:1}
]},
{id:"m2",title:"Diseño de Pruebas",desc:"EP, BVA, tablas de decisión, state transition, RTM.",
lessons:[
{id:"m2l1",title:"Partición de Equivalencia y Valores Límite",intro:"Mayor valor por esfuerzo. Reducen miles de combinaciones a un conjunto efectivo.",
sections:[
{title:"Partición de Equivalencia (EP)",paragraphs:["Divide dominio en clases equivalentes. UN valor por clase."],bullets:["Edad seguro: <18 inv | 18-25 joven | 26-65 std | 66-99 senior | >99 inv","+ no numérico, negativo, decimal, vacío","7-8 tests cubren miles de valores"]},
{title:"Valores Límite (BVA)",paragraphs:["Bugs viven en bordes. Rango 18-65: testeas 17,18,19,64,65,66."],bullets:["Monto $1-$10K: $0.99, $1.00, $1.01, $9999.99, $10000.00, $10000.01"],highlight:"$5,000 \"intermedio\" no encuentra nada extra. BVA aplica a TODO: strings, arrays, timestamps."}],
senior:"\"¿Probaste en los límites?\" — 80% de bugs de validación están en bordes.",
exercise:{title:"Diseña Tests EP y BVA",scenario:"Registro streaming.",task:"Username 3-20 alfanum, Password 8-64 may+num+esp, Fecha >13, ZIP 5 dígitos.\nPor campo: EP, BVA, 3 casos. Bonus: interacciones.",solution:["Username: válida \"user123\", inv \"ab\",\"user name\". BVA: 2,3,20,21.","Password: inv sin may/num/esp, 7chars. BVA: 7,8,64,65.","Fecha: 13 años hoy, 12a364d. ¿Timezone?","Interacciones: username en password, 13 años qué timezone."]}},
{id:"m2l2",title:"Tablas de Decisión y State Transition",intro:"Combinaciones y estados requieren técnicas sistemáticas.",
sections:[
{title:"Tablas de Decisión",bullets:["Envío gratis: ¿Prime? ¿>$50? ¿Elegible?","2³ = 8 combinaciones = 8 casos","Sin tabla PIERDES combinaciones."]},
{title:"State Transition",bullets:["Pedido: Pending→Paid→Processing→Shipped→Delivered","+ Cancelled, Refunded, Returned","CRÍTICO: transiciones INVÁLIDAS. ¿Delivered→Pending?"],highlight:"State machines son ubicuos en Big Tech."}],
senior:"PM dice \"premium + >$100 = gratis\". Tú: \"¿Y las otras 6 combinaciones?\"",
exercise:{title:"State Transition Cuenta Financiera",scenario:"PayPal: Pending, Active, Suspended, Locked, Closed, Banned.",task:"1) Transiciones válidas 2) 5 inválidas 3) Saldo por transición.",solution:["Válidas: Pending→Active, Active→Suspended/Locked/Closed, Suspended→Active/Banned, Locked→Active.","Inválidas: Banned→Active, Closed→Active, Pending→Suspended, Locked→Closed, Banned→Closed.","Saldo: Suspended=congelado, Closed=$0, Banned=retenido."]}},
{id:"m2l3",title:"Casos Profesionales y RTM",intro:"Caso mal escrito = nadie más lo ejecuta.",
sections:[
{title:"Anatomía caso profesional",bullets:["TC-LOGIN-001 — Login exitoso","Precondiciones, ambiente, pasos con datos exactos","Resultado MEDIBLE: redirect <3s, cookie creada","P0 smoke | Trazabilidad: REQ-AUTH-001"],highlight:"Cualquier persona = mismo resultado."},
{title:"RTM",paragraphs:["Requisito → Casos → Estado → Bugs."],bullets:["Sin casos = no cubierto","Sin requisito = huérfano","Viva cada sprint"]}],
senior:"Amazon: cada test tiene \"blast radius\" — usuarios y revenue afectados si falla.",
exercise:{title:"Escribe Casos Profesionales",scenario:"Carrito con descuento.",task:"SAVE10=10%, FLAT20=$20 si >$100, expiran, no Clearance, envío no descuenta.\n8 casos. 2 negativos, 1 interacción.",solution:["TC-001: SAVE10 $200→$180.","TC-002: FLAT20 $150→$130.","TC-003 neg: FLAT20 $80→rechazado.","TC-004 neg: expirado→rechazado.","TC-005: dos códigos→segundo rechazado.","TC-006: SAVE10 mixto (regular $100 + clearance $50)→solo $100.","TC-007: envío NO se descuenta.","TC-008: eliminar items→recalcula."]}}],
quiz:[
{q:"EP: ¿cuántos valores por clase?",o:["Todos","Uno representativo","Tres","Depende"],a:1},
{q:"Bugs de validación están en:",o:["Intermedios","Bordes/límites","Nulos","Negativos"],a:1},
{q:"4 condiciones binarias =",o:["4","8","16","32"],a:2},
{q:"State Transition, MÁS importante:",o:["Válidas","INVÁLIDAS","Inicial/final","Frecuentes"],a:1},
{q:"\"Verificar que login funciona\" es:",o:["Aceptable","Insuficiente","Válido","Buen caso"],a:1},
{q:"Requisito sin casos en RTM:",o:["Normal","No cubierto","Exploratory","Dev lo cubrió"],a:1}
]},
{id:"m3",title:"Bugs y Gestión de Calidad",desc:"Documentación, severidad vs prioridad, red flags, priorización.",
lessons:[
{id:"m3l1",title:"Documentación de Bugs",intro:"Bug mal documentado = bug que no se arregla.",
sections:[
{title:"Estructura profesional",bullets:["Título buscable: \"Login 500 when email has +\"","Ambiente, pasos EXACTOS, datos ESPECÍFICOS","Resultado actual con evidencia","Resultado esperado según spec","Frecuencia e impacto"]},
{title:"Severidad vs Prioridad",paragraphs:["Dimensiones DIFERENTES:"],bullets:["SEVERIDAD = técnico: Critical>High>Medium>Low","PRIORIDAD = negocio: P0>P1>P2>P3","Typo CEO = sev LOW, P0","Crash 0.1% = sev CRITICAL, puede ser P2"],highlight:"Tester asigna severidad. PO/PM asigna prioridad."}],
senior:"Bug report con hipótesis: \"Posiblemente no sanitiza el +.\" Acelera fix, demuestra comprensión.",
exercise:{title:"Documenta Este Bug",scenario:"Delivery: $45.50, cupón 50% off, cobro $22.75 correcto, email correcto.",task:"Historial muestra $45.50. Bug report completo.",solution:["Título: Order history shows pre-discount after WELCOME50","Sev Medium — no pérdida financiera, genera confusión","P1 — nuevos usuarios ven discrepancia","Hipótesis: lee subtotal pre-descuento"]}},
{id:"m3l2",title:"Criterio para Clasificar",intro:"Senior = clasificar correctamente, no encontrar más.",
sections:[
{title:"Red flags: escalación inmediata",bullets:["Dinero (doble cobro)","Datos de otro usuario","Bypass auth","Pérdida datos irrecuperable","Bloqueo >5% usuarios"],highlight:"No esperes al standup. Escala YA."},
{title:"Framework senior",paragraphs:["Cruza severidad con:"],bullets:["¿Cuántos afectados?","¿Workaround?","¿Regresión?","¿Empeora?","¿One-way o two-way door?"]}],
senior:"One-way door (pérdida datos) = SIEMPRE P0. Two-way (visual) = puede esperar.",
exercise:{title:"Clasifica y Prioriza",scenario:"6 bugs, arreglar 3.",task:"1.Crash foto iPhone 2.Cancelar suscripción roto 3.Emails 30min delay 4.Admin ayer 5.Memory leak 4h 6.Filtro precio\n\nElige 3.",solution:["#2 P0 — violación legal UE/CA","#1 P1 — crash, dispositivo común","#3 P1 — ansiedad post-compra","Próximo: #5, #4, #6"]}}],
quiz:[
{q:"Typo CEO landing:",o:["Sev HIGH P0","Sev LOW P0","Sev LOW P3","Sev MED P1"],a:1},
{q:"¿Quién asigna prioridad?",o:["Tester","Developer","PO/PM","QA Lead"],a:2},
{q:"Endpoint datos de OTRO usuario:",o:["Med P2","Critical P0","Low","High P1"],a:1},
{q:"Crash 0.1%:",o:["Sev Low","Sev Critical","Sev Medium","No es bug"],a:1},
{q:"Hipótesis en bug report:",o:["Demostrar que programas","Acelerar fix, mostrar comprensión","Asignar dev","Cubrir legal"],a:1}
]},
{id:"m4",title:"Herramientas del Tester",desc:"Jira, Azure DevOps, Postman, SQL, Git.",
lessons:[
{id:"m4l1",title:"Jira, Azure y otras herramientas",intro:"Dominar patrones que te hacen productivo.",
sections:[
{title:"Jira avanzado",paragraphs:["Centro de inteligencia de calidad:"],bullets:["Dashboards: bugs por severidad, módulo, velocity","JQL: project=CHECKOUT AND type=Bug AND severity=Critical","Workflows: Open→In Progress→Verified→Closed","Trazabilidad: bugs↔cases↔stories"]},
{title:"Azure DevOps",paragraphs:["Ecosistema Microsoft para enterprise:"],bullets:["Azure Boards: work items con estados personalizables","Azure Test Plans: test suites, ejecución manual, tracking","Queries (equiv JQL): Severity=1 AND State<>Closed AND AreaPath=Checkout","Azure Pipelines: CI/CD, tests en cada PR","Dashboards: widgets de bugs, results, coverage"],highlight:"Dominar Test Plans y Queries = tan importante como JQL."},
{title:"Postman — API Testing",paragraphs:["80% del testing crítico es API:"],bullets:["GET/POST/PUT/DELETE con auth","Variables ambiente (staging/prod)","Tests: pm.test(\"Status 200\")","Collections: register→login→order→verify","Newman para CI/CD"]},
{title:"SQL para investigación",bullets:["SELECT * FROM orders WHERE status='pending';","JOIN orders↔users WHERE total != subtotal-discount;","INNER JOIN vs LEFT JOIN para órdenes sin pago"]},
{title:"Git básico",bullets:["clone, pull, log, diff, branch/checkout"],highlight:"git diff = enfocar regression en lo que cambió."}],
senior:"Solo UI = tester a medias. 50% de bugs están en datos. SQL = superpoder.",
exercise:{title:"Investigación SQL",scenario:"Premium sin descuento 15%.",task:"1. Órdenes sin descuento correcto\n2. Cobro vs final_amount\n3. Desde cuándo\nBonus: ¿Qué JOIN?",solution:["1. JOIN orders↔users WHERE plan='premium' AND discount!=ROUND(total*0.15,2)","2. JOIN orders↔payments WHERE final_amount!=amount","3. MIN(created_at) del subset","INNER JOIN, LEFT JOIN para sin pago"]}}],
quiz:[
{q:"% testing crítico API:",o:["30%","50%","80%","95%"],a:2},
{q:"JQL/Azure Queries:",o:["Automatización","Queries avanzadas tickets","DB","Código"],a:1},
{q:"SQL para tester:",o:["Crear tablas","Datos invisibles en UI","Optimizar","Solo sin dev"],a:1},
{q:"Azure Test Plans:",o:["Solo automation","Test suites, ejecución manual, tracking","Solo dashboards","Reemplaza Postman"],a:1},
{q:"Git diff:",o:["Escribir código","Ver cambios para regression","Requerido Jira","Merge"],a:1}
]},
{id:"m5",title:"Automatización",desc:"Estrategia, cuándo sí/no, Playwright, CI/CD.",
lessons:[
{id:"m5l1",title:"Estrategia de Automatización",intro:"Automatizar todo sin estrategia = anti-patrón más costoso.",
sections:[
{title:"Cuándo SÍ",bullets:[">3 veces y estable","Smoke cada build","Regression core","API validations","Data validation DB"]},
{title:"Cuándo NO",bullets:["Exploratory","Cambia cada sprint","UX/usabilidad","Features inestables","One-time"]},
{title:"Anti-patrón 2000 E2E",bullets:["Suite 4h","30% flaky","Más manteniendo que testeando"],highlight:"70% API, 20% componente, 10% E2E."}],
senior:"Meta: flaky 2 veces = desactivado automáticamente. Flaky PEOR que no tener test.",
exercise:{title:"Decide Qué Automatizar",scenario:"App Asana, 20 tests.",task:"1.Login 2.SSO 3.Proyecto 4.Drag 5.Invitar 6.Filtrar 7.Archivos 8.Notif 9.CSV 10.Theme 11.API CRUD 12.Permisos 13.Rate limit 14.E2E\n¿Cuáles?",solution:["Top: #1,#11,#12,#3,#14,#6,#13","NO: #4(frágil),#8(flaky),#10(bajo valor),#2(mocks)","API > E2E"]}},
{id:"m5l2",title:"Playwright y CI/CD",intro:"Multi-browser, auto-wait, network interception.",
sections:[
{title:"Estructura profesional",bullets:["data-testid SIEMPRE","Assertions explícitas","Datos independientes","Paralelo e independiente"]},
{title:"Buenas prácticas",bullets:["Page Object Model","Screenshots solo fallo","Retry max 1","Reportes claros"]},
{title:"CI/CD",paragraphs:["Tests cada PR, merge bloqueado."],highlight:"Flaky que bloquea deploys = TU problema."}],
senior:"POM no es opcional. Sin él, 47 archivos. Con él, 1.",
exercise:{title:"Escribe Tests",scenario:"E-commerce: buscar, carrito, checkout.",task:"Playwright: buscar, qty 2, carrito, total. Negativo: agotado.",solution:["test add to cart: goto, fill search, click, selectOption qty=2, verify price*2","test out of stock: expect add-to-cart disabled"]}}],
quiz:[
{q:"Anti-patrón más costoso:",o:["No automatizar","Automatizar TODO","Selenium","Sin CI/CD"],a:1},
{q:"Flaky peor porque:",o:["Lento","Fatiga alertas","Recursos","Debug"],a:1},
{q:"Distribución ideal:",o:["70% E2E","70% API, 20% Comp, 10% E2E","50/50","No hay regla"],a:1},
{q:"data-testid sobre CSS:",o:["Rápido","Estable ante cambios","Requerido","Accesibilidad"],a:1},
{q:"Page Object Model:",o:["Performance","Centralizar selectores","DB","Reportes"],a:1}
]},
{id:"m6",title:"Testing Avanzado",desc:"Performance, seguridad, microservicios, chaos engineering.",
lessons:[
{id:"m6l1",title:"Performance, Seguridad y Microservicios",intro:"Fallos más costosos: performance, seguridad, integración.",
sections:[
{title:"Performance Testing",bullets:["Load: 1000 simultáneos","Stress: encontrar límite","Soak: degradación 24h","Spike: Black Friday"],paragraphs2:["k6, JMeter, Gatling. p50, p95, p99, RPS."],highlight:"p99 importa. p50=200ms p99=5s → 100K usuarios sufriendo."},
{title:"Security (OWASP)",bullets:["Injection: XSS en campos","Broken Auth: sin token, no expiran","IDOR: /users/123→124 = datos ajenos","CSRF: acciones sin consentimiento"]},
{title:"Microservicios",bullets:["Contract Testing (Pact): rompe ANTES del deploy","Chaos Engineering: pagos 5s latencia","Distributed Tracing: Jaeger, Zipkin"]}],
senior:"Netflix Chaos Monkey apaga servidores en prod. Resiliencia se PRUEBA.",
exercise:{title:"Plan Microservicios",scenario:"Uber: User,Ride,Payment,Notif,Pricing. Surge pricing.",task:"1)Tests por servicio 2)Contracts 3)Chaos 4)Consistencia precio",solution:["1. Pricing unit, Ride regression, Payment regression","2. Pricing↔Ride, Pricing↔Payment, Ride↔Notif","3. Pricing 10s latencia → ¿timeout? ¿fallback?","4. Tracing: mostrado=cobrado=recibo"]}}],
quiz:[
{q:"Métrica latencia Big Tech:",o:["p50","p95","p99","Promedio"],a:2},
{q:"IDOR permite:",o:["SQL injection","Datos otro usuario","XSS","Suplantar sesión"],a:1},
{q:"Contract Testing:",o:["Velocidad","Formato datos acordado","Réplicas","Deploy"],a:1},
{q:"Chaos Engineering:",o:["Sin plan","Fallos deliberados resiliencia","Random","Usuarios encuentran"],a:1}
]},
{id:"m7",title:"Ágiles para QA",desc:"Scrum, ceremonias, DoD, anti-patrones.",
lessons:[
{id:"m7l1",title:"Scrum Aplicado",intro:"Tu participación define si calidad es parte del proceso o afterthought.",
sections:[
{title:"Sprint para tester",paragraphs:["NO esperas a dev:"],bullets:["Testeas Story B mientras devs hacen A","Preparas tests de C","Velocidad = stories DONE (con testing)"]},
{title:"Ceremonias",bullets:["Planning: estimas, cuestionas","Daily: 15 segundos, bloqueos","Review: calidad, no solo feature","Retro: mejoras concretas"]},
{title:"Definition of Done",bullets:["Code + review","Unit tests","Testing QA","Bugs Crit/High resueltos","Regression ok","Docs"],highlight:"Done sin testing = deployed sin confianza."}],
senior:"Prevenir bugs en planning > encontrarlos en ejecución.",
exercise:{title:"Simulación Sprint",scenario:"2 semanas, 3 devs, 1 tester, 5 stories.",task:"Día 3: S1 review, S2 dev.\nDía 5: S1 2 bugs. S2 a testing.\nDía 8: Bug High abierto. S3-4 llegan.\nDía 9: PM \"¿las 5?\"",solution:["D3: Preparo S2, reviso specs 3-5.","D5: Testeo S2, flag Bug-High.","D8: Escalo. Testeo 3-4 critical.","D9: \"3-4 realista. S5 próximo sprint.\""]}},
{id:"m7l2",title:"Anti-patrones QA",intro:"Errores que destruyen efectividad.",
sections:[
{title:"QA Pasivo",paragraphs:["Solo ejecuta. No cuestiona."],highlight:"En Big Tech no sobrevive."},
{title:"QA Tardío",paragraphs:["Dev jueves, QA viernes."],bullets:["Solución: testing paralelo."]},
{title:"QA Policía",paragraphs:["Bloquea por cosméticos."],bullets:["Solución: criterio."]},
{title:"QA Aislado",paragraphs:["No pair testing."],bullets:["Solución: comunicar strategy."]}],
senior:"Devs dicen \"revisa mi story ANTES de codear\" = estás haciendo bien tu trabajo.",
exercise:{title:"Identifica Anti-patrones",scenario:"5 situaciones.",task:"1.Mudo en planning. 2.Rechaza por typo. 3.Último día 4 stories. 4.No habla con devs. 5.\"No sé cuánto.\"",solution:["1.Pasivo 2.Policía 3.Tardío 4.Aislado 5.Pasivo+inmadurez"]}}],
quiz:[
{q:"Done cuando:",o:["Dev termina","Code review","Testing+bugs resueltos","PM aprueba"],a:2},
{q:"Más valor en:",o:["Ejecución","Refinement/planning","Bug report","Retro"],a:1},
{q:"QA Tardío:",o:["Llega tarde","Testing final sin tiempo","Nuevo","Post-release"],a:1},
{q:"Bloquear por cosmético:",o:["Riguroso","QA Policía","Estándar","Correcto"],a:1},
{q:"Mejor indicador:",o:["Bug count","Coverage","Devs lo buscan","PM satisfecho"],a:2}
]},
{id:"m8",title:"Mentalidad y Soft Skills",desc:"Mentalidad elite, comunicación, decisiones, entrevistas.",
lessons:[
{id:"m8l1",title:"Mentalidad de Elite",intro:"La diferencia no es técnica. Es mentalidad.",
sections:[
{title:"Destructiva constructiva",paragraphs:["Romper para PROTEGER:"],bullets:["¿Usuario distraído?","¿Malicioso?","¿Bajo presión?","¿Dev asumió que nunca pasa?","¿Dos simultáneos?"]},
{title:"Comunicación con devs",bullets:["NUNCA: \"Tu código tiene bug\"","SIEMPRE: \"Comportamiento inesperado en X. Y→Z, esperaba W según REQ-123. ¿Intencional?\"","Respeto + datos + pregunta abierta"]},
{title:"Ownership",highlight:"Tu responsabilidad = calidad del PRODUCTO, no tu bug count."}],
senior:"\"No sé, voy a investigar\" > pretender saber todo. Humildad + rigor = senior.",
exercise:{title:"Criterio Real",scenario:"Tres situaciones.",task:"1.Jueves 6pm, release mañana. 2% tarda 15s. PM quiere lanzar.\n2.Dev senior rechaza bug, contradice req. Él 10 años, tú 3 meses.\n3.Feature sin spec.",solution:["1. ¿Checkout? 15s=doble click. Lanzar CON monitoring.","2. REQ-123: \"¿Cambió? Actualicemos docs.\" Datos, no emociones.","3. \"Necesito criterios. Sin eso no garantizo cobertura.\""]}},
{id:"m8l2",title:"Entrevistas Big Tech",intro:"Buscan ingenieros que piensen en sistemas.",
sections:[
{title:"Lo que evalúan",bullets:["Pensamiento sistemático: CÓMO piensas","Priorización por riesgo","Técnico: API, SQL, automatización","Comunicación clara"]},
{title:"Pregunta elevador",bullets:["Funcional: pisos, puertas, indicador","Edge: todos pisos, cancelar","Concurrencia: simultáneas","Seguridad: sensor, freno, teléfono","Performance: tiempo, peso","Resiliencia: corte energía","Accesibilidad: braille, voz"]},
{title:"Factor diferenciador",highlight:"Cómo PIENSAS EN VOZ ALTA."}],
senior:"\"No tengo experiencia directa, pero mi approach sería...\" = honestidad + problem solving.",
exercise:{title:"Mock Interview",scenario:"FAANG.",task:"1.¿Búsqueda de Google? 2.15 bugs: 3 P0, 5 P1, 7 P2. Solo 8. 3.¿Buen vs gran tester?",solution:["1. Funcional, autocompletado, resultados, i18n, perf<200ms, seguridad, a11y.","2. 3 P0 obligatorios + 5 P1 por impacto.","3. Buen=encuentra. Gran=previene y mejora procesos."]}}],
quiz:[
{q:"Comunicar bug:",o:["\"Tu código tiene bug\"","\"Inesperado: X→Y, esperaba Z. ¿Intencional?\"","\"Arréglalo\"","\"Ticket asignado\""],a:1},
{q:"Ownership:",o:["Ejecutar tests","Culpa dev","Calidad PRODUCTO","Arreglar bugs"],a:2},
{q:"Entrevista sin saber:",o:["Inventar","\"No experiencia, mi approach sería...\"","Cambiar tema","Nunca preguntan"],a:1},
{q:"Gran vs buen:",o:["Más bugs","Más automation","Previene, mejora procesos","Certificaciones"],a:2},
{q:"Dev rechaza con evidencia:",o:["Cerrar","Escalar gritando","Mostrar req, preguntar si cambió","Otro bug igual"],a:2}
]}];

const FE={title:"Evaluación Final — QA Engineer",
scenario:"QA Lead en \"QuickPay\", fintech pagos móviles.\n\nFeature: Pagos Programados — recurrentes automáticos.\n\nReglas:\n\u2022 $1.00 mín, $10,000.00 máx\n\u2022 Semanal, quincenal, mensual\n\u2022 Cancelar/modificar hasta 24h antes\n\u2022 Sin fondos: reintento 4h y 8h\n\u2022 3 fallos: desactiva\n\u2022 Notif: 24h antes, al ejecutar, si falla\n\u2022 Historial: 2 años",
parts:[
{id:"p1",title:"Parte 1 — Análisis de Riesgo",prompt:"5 riesgos. Cada uno: riesgo, impacto, cómo testear.",rubric:"Financieros (doble cobro), seguridad (mod no autorizada), temporales (timezone), reintentos, compliance."},
{id:"p2",title:"Parte 2 — Casos de Prueba",prompt:"6 casos: 2 happy, 2 edge, 1 seguridad, 1 integración.",rubric:"Datos específicos, reproducibles, edge no obvios, seguridad relevante, integración con fallo."},
{id:"p3",title:"Parte 3 — Detección de Bugs",prompt:"¿Bug o esperado?\n1.Pago 31 feb→3 mar. 2.Modificar 23h antes: no aplica. 3.Suspended ejecuta. 4.Email 24h llega 26h. 5.Elimina tarjeta: falla sin aviso.",rubric:"1:Bug. 2:Bug(23<24). 3:CRITICAL. 4:Debatible. 5:HIGH."},
{id:"p4",title:"Parte 4 — Priorización",prompt:"6 bugs, 3:\n1.Doble cobro reintento+manual 2.Historial 6m 3.Notif inglés 4.Suspended ejecuta 5.Cancelar iOS16 roto 6.$10000.01",rubric:"#1(P0 doble cobro), #4(P0 security), #5(P1 bloqueante)."}
]};

// ── VIEWS ──
const LessonView=({lesson,onComplete,isComplete})=>{
  const[tab,setTab]=useState(0);const[showSol,setShowSol]=useState(false);const[answer,setAnswer]=useState("");
  const[visited,setVisited]=useState({0:true});
  useEffect(()=>{setTab(0);setShowSol(false);setAnswer("");setVisited({0:true});},[lesson.id]);
  const markV=(i)=>{setTab(i);setVisited(v=>({...v,[i]:true}));};
  const allV=visited[0]&&visited[1]&&visited[2];
  return(
    <div style={{textAlign:"left"}}>
      <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
        {["Contenido","Insight Senior","Ejercicio"].map((t,i)=>{const s=visited[i];return <button key={i} onClick={()=>markV(i)} style={{padding:"7px 16px",borderRadius:7,fontSize:13,fontWeight:600,fontFamily:"inherit",cursor:"pointer",border:`1px solid ${i===tab?T.accent:s?T.green:T.border}`,background:i===tab?T.accentBg:"transparent",color:i===tab?T.accentL:s?T.green:T.t4}}>{s&&i!==tab?"✓ ":""}{t}</button>;})}
      </div>
      {tab===0&&<div style={{display:"flex",flexDirection:"column",gap:18}}>
        <Section badge="Introducción" border={T.accent}><P>{lesson.intro}</P></Section>
        {lesson.sections.map((s,i)=><Section key={i} badge={s.title} badgeColor={T.lilac} border={T.lilac}>
          {s.paragraphs?.map((p,j)=><P key={j}>{p}</P>)}{s.bullets&&<BL items={s.bullets}/>}{s.highlight&&<HL>{s.highlight}</HL>}{s.paragraphs2?.map((p,j)=><P key={"p2"+j}>{p}</P>)}
        </Section>)}
      </div>}
      {tab===1&&<Section badge="Perspectiva Senior" badgeColor={T.accent} border={T.accent}><P style={{fontStyle:"italic",color:T.t1,fontSize:15,lineHeight:1.9}}>{lesson.senior}</P></Section>}
      {tab===2&&lesson.exercise&&<div style={{display:"flex",flexDirection:"column",gap:18}}>
        <Section badge="Ejercicio" badgeColor={T.amber} border={T.amber}><P style={{fontWeight:600,color:T.t1}}>{lesson.exercise.title}</P>{lesson.exercise.scenario&&<P>{lesson.exercise.scenario}</P>}<div style={{whiteSpace:"pre-wrap",fontSize:14,lineHeight:1.85,color:T.t2}}>{lesson.exercise.task}</div></Section>
        <Section title="Tu respuesta"><textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Escribe aquí antes de ver la solución..." style={{width:"100%",minHeight:140,padding:14,borderRadius:8,border:`1px solid ${T.border}`,background:T.bg,color:T.t1,fontSize:14,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",lineHeight:1.7}}/>
          <div style={{marginTop:12}}><Btn variant="outline" onClick={()=>setShowSol(!showSol)}>{showSol?"Ocultar":"Ver"} Respuesta Modelo</Btn></div>
          {showSol&&<div style={{marginTop:14,padding:16,background:T.greenBg,borderRadius:8,borderLeft:`3px solid ${T.green}`}}><div style={{fontSize:10,fontWeight:700,color:T.green,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>Referencia</div><ul style={{margin:0,paddingLeft:18}}>{lesson.exercise.solution.map((s,i)=><li key={i} style={{fontSize:13,lineHeight:1.85,color:T.t2,marginBottom:8}}>{s}</li>)}</ul></div>}
        </Section>
      </div>}
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:24,alignItems:"center"}}>
        {!allV&&!isComplete&&<P style={{margin:"0 12px 0 0",fontSize:12,color:T.t4}}>Visita las 3 secciones para completar</P>}
        <Btn onClick={onComplete} disabled={!allV&&!isComplete} style={{background:isComplete?T.green:allV?T.accent:T.bg3,opacity:allV||isComplete?1:.5,cursor:allV||isComplete?"pointer":"default"}}>{isComplete?"Completada ✓":"Marcar como completada"}</Btn>
      </div>
    </div>);
};

// Quiz: NO reveals answers, gives hints, forces retry
const QuizView=({quiz,moduleId,onComplete,onExit,existingScore,attempts,onAttempt})=>{
  const[answers,setAnswers]=useState({});const[submitted,setSubmitted]=useState(false);const[score,setScore]=useState(0);
  const[wrongIdxs,setWrongIdxs]=useState([]);const[showHints,setShowHints]=useState(false);
  const total=quiz.length,answered=Object.keys(answers).length;
  const hints=QUIZ_HINTS[moduleId]||[];

  // If already passed, show passed state
  if(existingScore!==undefined&&existingScore>=T.MIN_PASS){
    return(<div style={{display:"flex",flexDirection:"column",gap:18,textAlign:"left"}}>
      <Section border={T.green}><div style={{textAlign:"center",padding:"16px 0"}}><div style={{fontSize:44,fontWeight:800,color:T.green}}>{existingScore}%</div><P style={{textAlign:"center",margin:"6px 0 0"}}>Aprobado</P>{attempts>1&&<P style={{textAlign:"center",margin:"4px 0 0",fontSize:12,color:T.t4}}>Lo lograste en {attempts} intento{attempts>1?"s":""}</P>}</div></Section>
      <Btn variant="outline" onClick={onExit}>Volver al módulo</Btn>
    </div>);
  }

  const submit=()=>{
    let c=0;const wrong=[];
    quiz.forEach((q,i)=>{if(answers[i]===q.a)c++;else wrong.push(i);});
    const s=Math.round((c/total)*100);
    setScore(s);setWrongIdxs(wrong);setSubmitted(true);setShowHints(false);
    const att=(attempts||0)+1;
    onAttempt(att);
    if(s>=T.MIN_PASS)onComplete(s);
  };

  if(submitted){
    const passed=score>=T.MIN_PASS;
    return(
      <div style={{display:"flex",flexDirection:"column",gap:18,textAlign:"left"}}>
        <Section border={passed?T.green:T.red}>
          <div style={{textAlign:"center",padding:"16px 0"}}>
            <div style={{fontSize:44,fontWeight:800,color:passed?T.green:T.red}}>{score}%</div>
            <P style={{textAlign:"center",margin:"6px 0 0"}}>{passed?"Aprobado":`No aprobado — mínimo ${T.MIN_PASS}%`}</P>
            <P style={{textAlign:"center",margin:"4px 0 0",fontSize:12,color:T.t4}}>Intento #{(attempts||1)}</P>
          </div>
        </Section>
        {!passed&&<>
          <Section badge={`${wrongIdxs.length} pregunta${wrongIdxs.length>1?"s":""} incorrecta${wrongIdxs.length>1?"s":""}`} badgeColor={T.red} border={T.red}>
            <P>No te mostramos las respuestas correctas. Revisa el contenido del módulo y vuelve a intentarlo. Las preguntas incorrectas son:</P>
            <BL items={wrongIdxs.map(i=>`Pregunta ${i+1}: ${quiz[i].q}`)}/>
            {!showHints&&<Btn variant="outline" size="sm" onClick={()=>setShowHints(true)}>Mostrar pistas</Btn>}
            {showHints&&<div style={{marginTop:12,padding:14,background:T.amberBg,borderRadius:8,borderLeft:`3px solid ${T.amber}`}}>
              <div style={{fontSize:10,fontWeight:700,color:T.amber,marginBottom:8,textTransform:"uppercase"}}>Pistas</div>
              <BL items={wrongIdxs.map(i=>hints[i]||"Revisa el contenido de esta sección con atención.")}/>
            </div>}
          </Section>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={()=>{setSubmitted(false);setAnswers({});setWrongIdxs([]);}}>Reintentar</Btn>
            <Btn variant="outline" onClick={onExit}>Volver al módulo</Btn>
          </div>
        </>}
        {passed&&<Btn variant="outline" onClick={onExit}>Volver al módulo</Btn>}
      </div>);
  }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:18,textAlign:"left"}}>
      <Section badge="Evaluación" badgeColor={T.amber}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><P style={{margin:0}}>Mínimo {T.MIN_PASS}% para aprobar. No se revelan respuestas.</P><span style={{fontSize:12,color:T.t4,fontWeight:600}}>{answered}/{total}</span></div><div style={{height:3,background:T.bg3,borderRadius:2,marginTop:10,overflow:"hidden"}}><div style={{width:`${(answered/total)*100}%`,height:"100%",background:T.accent}}/></div></Section>
      {quiz.map((q,i)=><Section key={i}><P style={{fontWeight:600,color:T.t1}}>{i+1}. {q.q}</P><div style={{display:"flex",flexDirection:"column",gap:6}}>
        {q.o.map((opt,oi)=><button key={oi} onClick={()=>setAnswers({...answers,[i]:oi})} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,textAlign:"left",fontFamily:"inherit",border:`1px solid ${answers[i]===oi?T.accent:T.border}`,background:answers[i]===oi?T.accentBg:"transparent",color:answers[i]===oi?T.accentL:T.t3,cursor:"pointer",fontSize:13}}>
          <span style={{width:16,height:16,borderRadius:99,border:`2px solid ${answers[i]===oi?T.accent:T.borderL}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{answers[i]===oi&&<span style={{width:7,height:7,borderRadius:99,background:T.accent}}/>}</span>{opt}
        </button>)}</div></Section>)}
      <div style={{display:"flex",gap:10,justifyContent:"space-between"}}><Btn variant="ghost" onClick={onExit}>Salir del quiz</Btn><Btn onClick={submit} disabled={answered<total} style={{opacity:answered<total?.4:1}}>Enviar ({answered}/{total})</Btn></div>
    </div>);
};

const FinalView=({exam,onBack,onSubmitFinal})=>{
  const[answers,setAnswers]=useState({});const[submitted,setSubmitted]=useState(false);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20,textAlign:"left"}}>
      <Section badge="Evaluación Final" badgeColor={T.accent} border={T.accent}><h3 style={{margin:"8px 0 12px",fontSize:18,fontWeight:700,color:T.lilac,textAlign:"left"}}>Caso: QuickPay — Pagos Programados</h3><div style={{whiteSpace:"pre-wrap",fontSize:14,lineHeight:1.85,color:T.t2}}>{exam.scenario}</div></Section>
      {exam.parts.map(p=><Section key={p.id} title={p.title}><div style={{whiteSpace:"pre-wrap",fontSize:14,lineHeight:1.85,color:T.t2,marginBottom:12}}>{p.prompt}</div><textarea value={answers[p.id]||""} onChange={e=>setAnswers({...answers,[p.id]:e.target.value})} placeholder="Tu respuesta..." disabled={submitted} style={{width:"100%",minHeight:140,padding:14,borderRadius:8,border:`1px solid ${T.border}`,background:T.bg,color:T.t1,fontSize:14,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",lineHeight:1.7}}/>
        {submitted&&<div style={{marginTop:12,padding:14,background:T.greenBg,borderRadius:8,borderLeft:`3px solid ${T.green}`}}><div style={{fontSize:10,fontWeight:700,color:T.green,marginBottom:6,textTransform:"uppercase"}}>Rúbrica</div><P style={{margin:0,fontSize:13}}>{p.rubric}</P></div>}
      </Section>)}
      <div style={{display:"flex",gap:10,justifyContent:"space-between"}}><Btn variant="ghost" onClick={onBack}>Volver</Btn>{!submitted&&<Btn onClick={()=>{setSubmitted(true);onSubmitFinal();}} disabled={Object.keys(answers).length<exam.parts.length} style={{opacity:Object.keys(answers).length<exam.parts.length?.4:1}}>Enviar Evaluación</Btn>}</div>
    </div>);
};

const SummaryView=({modules,quizScores,quizAttempts,onBack,onSenior})=>{
  const scores=modules.map(m=>({id:m.id,title:m.title,score:quizScores[m.id]||0,attempts:quizAttempts[m.id]||1}));
  const avg=Math.round(scores.reduce((a,s)=>a+s.score,0)/scores.length);
  const totalAttempts=scores.reduce((a,s)=>a+s.attempts,0);
  const weak=scores.filter(s=>s.score<90).sort((a,b)=>a.score-b.score);
  const perfect=scores.filter(s=>s.attempts===1&&s.score>=90);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20,textAlign:"left"}}>
      <Section border={T.accent}><div style={{textAlign:"center",padding:"16px 0"}}>
        <div style={{fontSize:52,fontWeight:800,color:avg>=90?T.green:avg>=T.MIN_PASS?T.amber:T.red}}>{avg}%</div>
        <P style={{textAlign:"center",fontSize:16,fontWeight:600,color:T.t1,margin:"8px 0 0"}}>Promedio Global</P>
        <P style={{textAlign:"center",margin:"4px 0 0",fontSize:12,color:T.t4}}>{totalAttempts} intentos totales en {scores.length} módulos</P>
        <P style={{textAlign:"center",margin:"4px 0 0"}}>{avg>=90?"Excelente — nivel Big Tech":avg>=T.MIN_PASS?"Aprobado — sigue reforzando":"Necesitas repasar"}</P>
      </div></Section>

      <Section title="Resultados por Módulo">{scores.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<scores.length-1?`1px solid ${T.border}`:undefined}}>
        <span style={{width:36,textAlign:"right",fontSize:14,fontWeight:700,color:s.score>=90?T.green:s.score>=T.MIN_PASS?T.amber:T.red}}>{s.score}%</span>
        <div style={{flex:1,height:4,background:T.bg3,borderRadius:2,overflow:"hidden"}}><div style={{width:`${s.score}%`,height:"100%",background:s.score>=90?T.green:s.score>=T.MIN_PASS?T.amber:T.red,borderRadius:2}}/></div>
        <span style={{fontSize:12,color:T.t2,minWidth:140}}>{s.title}</span>
        <span style={{fontSize:11,color:T.t4,minWidth:50}}>{s.attempts} int.</span>
      </div>)}</Section>

      {weak.length>0&&<Section title="Temas a Reforzar" border={T.amber}>
        <BL items={weak.map(w=>`${w.title} (${w.score}%, ${w.attempts} intentos) — Repasa contenido y repite quiz hasta 90%+`)}/>
      </Section>}

      {perfect.length>0&&<Section title="Dominados al Primer Intento" border={T.green}>
        <BL items={perfect.map(p=>`${p.title} — ${p.score}% en 1 intento`)}/>
      </Section>}

      <Section badge="Análisis" badgeColor={T.lilac} border={T.lilac}>
        <P style={{fontWeight:600,color:T.t1}}>Recomendaciones basadas en tu desempeño:</P>
        <BL items={[
          totalAttempts<=scores.length+2?"Excelente eficiencia — pocos reintentos necesarios.":"Los reintentos son parte del aprendizaje. Cada error te enseña algo que un acierto no.",
          weak.length===0?"Todos los módulos por encima de 90%. Estás listo para entrevistas Big Tech.":weak.length<=2?`Refuerza ${weak.map(w=>w.title).join(" y ")} antes de postularte.`:"Dedica tiempo a repasar los módulos débiles. La base es lo que sostiene todo lo demás.",
          "Practica los ejercicios escribiendo respuestas COMPLETAS antes de ver la solución.",
          "Haz mock interviews en voz alta — verbalizar tu proceso es clave en Big Tech."
        ]}/>
      </Section>

      <div style={{display:"flex",gap:10}}>
        <Btn onClick={onBack}>Volver al inicio</Btn>
        <Btn variant="outline" onClick={onSenior}>Mensaje Senior</Btn>
      </div>
    </div>);
};

// Senior Wisdom Page
const SeniorWisdomView=({onBack})=>(
  <div style={{display:"flex",flexDirection:"column",gap:24,textAlign:"left"}}>
    <Section badge="Reflexión Final" badgeColor={T.lilac} border={T.lilac}>
      <h3 style={{margin:"0 0 16px",fontSize:20,fontWeight:800,color:T.t1,textAlign:"left",lineHeight:1.4}}>
        "El senior que no comete errores es un junior disfrazado de senior"
      </h3>
      <P>El error es parte del proceso, no una señal de incompetencia. Un senior que nunca se equivoca probablemente está evitando problemas difíciles, trabajando en zonas de confort, o simplemente mintiendo sobre su historial.</P>
      <P>Lo que distingue a un senior de verdad no es el título ni los años — es cómo responde al caos. Cuando todo falla en producción a las 2am, el valor está en quien mantiene la cabeza fría, sabe por dónde empezar a buscar, y toma decisiones con información incompleta.</P>
      <P>Los errores hacen eso posible porque te enseñan lo que ningún tutorial cubre: qué pasa cuando las cosas fallan de verdad, cómo se siente el impacto, y cómo salir. Eso no se aprende haciendo lo mismo 10 años seguidos.</P>
      <HL>Lo más peligroso no es el que comete errores. Es el que lleva años sin cometerlos porque nunca se metió en nada que valiera la pena.</HL>
    </Section>

    <Section badge="Para tu carrera" badgeColor={T.accent} border={T.accent}>
      <BL items={[
        "Cada quiz que repetiste te enseñó más que el que aprobaste al primer intento.",
        "Cada ejercicio donde tu respuesta fue diferente a la modelo te obligó a pensar más profundo.",
        "El conocimiento técnico se olvida. El criterio se queda.",
        "No compitas por el título. Compite por la confianza de tu equipo.",
        "El día que un developer diga \"quiero que revises esto antes de empezar a codear\" — ese día sabrás que llegaste."
      ]}/>
    </Section>
    <Btn onClick={onBack}>Volver al inicio</Btn>
  </div>
);

const HomeView=({modules,progress,quizScores,onMod,onFinal,onSummary,finalUnlocked,finalDone})=>{
  const ti=modules.reduce((a,m)=>a+m.lessons.length,0)+modules.length;
  const d=Object.values(progress).filter(Boolean).length;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20,textAlign:"left"}}>
      <div><h2 style={{margin:"0 0 6px",fontSize:22,fontWeight:800,color:T.t1,textAlign:"left"}}>QA Engineering Mastery</h2><P style={{margin:0}}>Programa profesional — de cero a nivel Big Tech.</P></div>
      <Section><div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><P style={{margin:0,fontWeight:600,color:T.t1}}>Progreso general</P><span style={{fontSize:13,fontWeight:700,color:T.accent}}>{Math.round((d/ti)*100)}%</span></div><div style={{height:5,background:T.bg3,borderRadius:3,overflow:"hidden"}}><div style={{width:`${(d/ti)*100}%`,height:"100%",background:T.accent,borderRadius:3}}/></div></Section>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {modules.map((m,i)=>{const ld=m.lessons.filter((_,li)=>progress[`${m.id}-${li}`]).length;const qd=quizScores[m.id]!==undefined;const ad=ld===m.lessons.length&&qd;
        return <button key={m.id} onClick={()=>onMod(i)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:T.bg2,border:`1px solid ${T.border}`,borderRadius:10,cursor:"pointer",textAlign:"left",fontFamily:"inherit",width:"100%",boxSizing:"border-box"}}>
          <span style={{width:30,height:30,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,background:ad?T.greenBg:T.accentBg,color:ad?T.green:T.accentL,flexShrink:0}}>{ad?"✓":i+1}</span>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:T.t1}}>{m.title}</div><div style={{fontSize:12,color:T.t4,marginTop:2}}>{ld}/{m.lessons.length} lecciones{qd?` · Quiz ${quizScores[m.id]}%`:""}</div></div>
        </button>;})}
      </div>
      <div style={{height:1,background:T.border}}/>
      <button onClick={onFinal} disabled={!finalUnlocked} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:T.bg2,border:`1px solid ${finalUnlocked?T.accent:T.border}`,borderRadius:10,cursor:finalUnlocked?"pointer":"default",textAlign:"left",fontFamily:"inherit",opacity:finalUnlocked?1:.5,width:"100%",boxSizing:"border-box"}}>
        <span style={{width:30,height:30,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,background:T.accentBg,color:T.accentL}}>{finalUnlocked?"F":"🔒"}</span>
        <div><div style={{fontSize:14,fontWeight:700,color:T.t1}}>Evaluación Final</div><div style={{fontSize:12,color:T.t4,marginTop:2}}>{finalDone?"Completada":finalUnlocked?"Caso real fintech":"Completa todos los quizzes"}</div></div>
      </button>
      {finalDone&&<Btn variant="outline" onClick={onSummary} style={{width:"100%",textAlign:"center"}}>Ver Resumen de Resultados</Btn>}
    </div>);
};

// ── MAIN ──
export default function App(){
  const[view,setView]=useState({page:"home"});
  const[mi,setMi]=useState(0);const[li,setLi]=useState(0);
  const[progress,setProgress]=useState({});const[qs,setQs]=useState({});
  const[qa,setQa]=useState({});// quiz attempts per module
  const[finalDone,setFinalDone]=useState(false);const[loaded,setLoaded]=useState(false);
  const mainRef=useRef(null);

  useEffect(()=>{loadSession().then(d=>{if(d){d.progress&&setProgress(d.progress);d.qs&&setQs(d.qs);d.qa&&setQa(d.qa);d.finalDone&&setFinalDone(true);}setLoaded(true);});},[]);
  useEffect(()=>{if(loaded)saveSession({progress,qs,qa,finalDone});},[progress,qs,qa,finalDone,loaded]);

  const scroll=()=>{if(mainRef.current)mainRef.current.scrollTop=0;};
  const goHome=()=>{setView({page:"home"});scroll();};
  const goMod=(i,l=0)=>{setMi(i);setLi(l);setView({page:"module"});scroll();};
  const goQuiz=()=>{setView({page:"quiz"});scroll();};
  const goFinal=()=>{setView({page:"final"});scroll();};
  const goSummary=()=>{setView({page:"summary"});scroll();};
  const goSenior=()=>{setView({page:"senior"});scroll();};

  const mod=M[mi],les=mod?.lessons[li];
  const finalOk=M.every(m=>qs[m.id]>=T.MIN_PASS);

  const compLes=useCallback(()=>{setProgress(p=>({...p,[`${mod.id}-${li}`]:true}));if(li<mod.lessons.length-1){setLi(li+1);scroll();}},[mod,li]);
  const compQuiz=useCallback(s=>{setQs(q=>({...q,[mod.id]:s}));setProgress(p=>({...p,[`${mod.id}-quiz`]:true}));},[mod]);
  const compFinal=useCallback(()=>{setFinalDone(true);},[]);
  const setAttempt=useCallback(n=>{setQa(a=>({...a,[mod.id]:n}));},[mod]);

  const crumbs=[{label:"Inicio",action:goHome}];
  if(view.page==="module"||view.page==="quiz"){crumbs.push({label:mod.title,action:()=>goMod(mi)});view.page==="quiz"?crumbs.push({label:"Quiz"}):les&&crumbs.push({label:les.title});}
  if(view.page==="final")crumbs.push({label:"Evaluación Final"});
  if(view.page==="summary")crumbs.push({label:"Resumen"});
  if(view.page==="senior")crumbs.push({label:"Mensaje Senior"});

  const ti=M.reduce((a,m)=>a+m.lessons.length,0)+M.length;
  const di=Object.values(progress).filter(Boolean).length;
  const gp=Math.round((di/ti)*100);

  if(!loaded)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:T.bg,color:T.t3,fontFamily:"sans-serif"}}>Cargando...</div>;

  return(
    <div style={{width:"100%",maxWidth:"100vw",minHeight:"100vh",display:"flex",fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",background:T.bg,color:T.t1,overflowX:"hidden",boxSizing:"border-box"}}>
      <aside style={{width:250,minWidth:250,maxWidth:250,background:T.bg1,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,overflowY:"auto",overflowX:"hidden",boxSizing:"border-box",flexShrink:0}}>
        <div style={{padding:"16px 14px",borderBottom:`1px solid ${T.border}`}}>
          <button onClick={goHome} style={{background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"inherit",textAlign:"left"}}><div style={{fontSize:14,fontWeight:800,color:T.t1}}>QA Mastery</div></button>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}><div style={{flex:1,height:3,background:T.bg3,borderRadius:2,overflow:"hidden"}}><div style={{width:`${gp}%`,height:"100%",background:T.accent}}/></div><span style={{fontSize:10,color:T.t4,fontWeight:600}}>{gp}%</span></div>
        </div>
        <nav style={{flex:1,padding:"6px 0"}}>
          {M.map((m,i)=>{const ld=m.lessons.filter((_,j)=>progress[`${m.id}-${j}`]).length;const qd=qs[m.id]>=T.MIN_PASS;const ad=ld===m.lessons.length&&qd;const ac=(view.page==="module"||view.page==="quiz")&&mi===i;
          return <button key={m.id} onClick={()=>goMod(i)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 14px",background:ac?T.accentBg:"transparent",border:"none",borderLeft:ac?`3px solid ${T.accent}`:"3px solid transparent",color:ac?T.accentL:T.t3,cursor:"pointer",textAlign:"left",fontFamily:"inherit",boxSizing:"border-box"}}>
            <span style={{width:20,height:20,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,background:ad?T.greenBg:T.bg3,color:ad?T.green:T.t4,flexShrink:0}}>{ad?"✓":i+1}</span>
            <span style={{fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.title}</span>
          </button>;})}
          <div style={{height:1,background:T.border,margin:"6px 14px"}}/>
          <button onClick={goFinal} disabled={!finalOk} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 14px",background:view.page==="final"?T.accentBg:"transparent",border:"none",borderLeft:view.page==="final"?`3px solid ${T.accent}`:"3px solid transparent",color:finalOk?T.t3:T.t4,cursor:finalOk?"pointer":"default",textAlign:"left",fontFamily:"inherit",opacity:finalOk?1:.45,boxSizing:"border-box"}}>
            <span style={{width:20,height:20,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,background:T.bg3,color:T.t4}}>{finalOk?"F":"🔒"}</span>
            <span style={{fontSize:12,fontWeight:600}}>Evaluación Final</span>
          </button>
          {finalDone&&<><button onClick={goSummary} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 14px",background:view.page==="summary"?T.accentBg:"transparent",border:"none",borderLeft:view.page==="summary"?`3px solid ${T.lilac}`:"3px solid transparent",color:T.lilac,cursor:"pointer",textAlign:"left",fontFamily:"inherit",boxSizing:"border-box"}}>
            <span style={{width:20,height:20,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,background:T.lilacBg,color:T.lilac,flexShrink:0}}>R</span>
            <span style={{fontSize:12,fontWeight:600}}>Resumen</span>
          </button>
          <button onClick={goSenior} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 14px",background:view.page==="senior"?T.accentBg:"transparent",border:"none",borderLeft:view.page==="senior"?`3px solid ${T.amber}`:"3px solid transparent",color:T.amber,cursor:"pointer",textAlign:"left",fontFamily:"inherit",boxSizing:"border-box"}}>
            <span style={{width:20,height:20,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,background:T.amberBg,color:T.amber,flexShrink:0}}>S</span>
            <span style={{fontSize:12,fontWeight:600}}>Mensaje Senior</span>
          </button></>}
        </nav>
      </aside>
      <div ref={mainRef} style={{flex:1,minWidth:0,height:"100vh",overflowY:"auto",overflowX:"hidden",display:"flex",flexDirection:"column"}}>
        <header style={{padding:"10px 24px",borderBottom:`1px solid ${T.border}`,background:T.bg1,position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:10,boxSizing:"border-box",width:"100%"}}>
          {view.page!=="home"&&<Btn variant="ghost" size="sm" onClick={view.page==="quiz"?()=>goMod(mi):goHome} style={{padding:"4px 8px",fontSize:14}}>←</Btn>}
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            {crumbs.map((c,i)=><span key={i} style={{display:"flex",alignItems:"center",gap:6}}>{i>0&&<span style={{color:T.t4,fontSize:11}}>›</span>}{c.action?<button onClick={c.action} style={{background:"none",border:"none",color:i===crumbs.length-1?T.t1:T.t4,cursor:"pointer",fontSize:12,fontFamily:"inherit",padding:0,fontWeight:i===crumbs.length-1?600:400}}>{c.label}</button>:<span style={{fontSize:12,color:T.t1,fontWeight:600}}>{c.label}</span>}</span>)}
          </div>
        </header>
        <div style={{width:"100%",maxWidth:900,padding:"28px 32px",boxSizing:"border-box",textAlign:"left"}}>
          {view.page==="home"&&<HomeView modules={M} progress={progress} quizScores={qs} onMod={goMod} onFinal={goFinal} onSummary={goSummary} finalUnlocked={finalOk} finalDone={finalDone}/>}
          {view.page==="module"&&les&&<><div style={{marginBottom:20}}><P>{mod.desc}</P></div><div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:22}}>{mod.lessons.map((l,i)=><Pill key={i} active={li===i} done={progress[`${mod.id}-${i}`]} onClick={()=>{setLi(i);scroll();}}>{i+1}. {l.title.length>24?l.title.slice(0,24)+"…":l.title}</Pill>)}<Pill active={false} done={qs[mod.id]>=T.MIN_PASS} onClick={goQuiz}>Quiz</Pill></div><LessonView lesson={les} onComplete={compLes} isComplete={progress[`${mod.id}-${li}`]}/></>}
          {view.page==="quiz"&&<QuizView quiz={mod.quiz} moduleId={mod.id} onComplete={compQuiz} onExit={()=>goMod(mi)} existingScore={qs[mod.id]} attempts={qa[mod.id]||0} onAttempt={setAttempt}/>}
          {view.page==="final"&&(finalOk?<FinalView exam={FE} onBack={goHome} onSubmitFinal={compFinal}/>:<Section><P style={{textAlign:"center",color:T.t4,padding:30}}>Completa todos los quizzes.</P></Section>)}
          {view.page==="summary"&&<SummaryView modules={M} quizScores={qs} quizAttempts={qa} onBack={goHome} onSenior={goSenior}/>}
          {view.page==="senior"&&<SeniorWisdomView onBack={goHome}/>}
        </div>
      </div>
    </div>);
}
