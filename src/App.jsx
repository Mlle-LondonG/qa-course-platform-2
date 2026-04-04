import { useState, useCallback, useRef, useEffect } from "react";

const T = {
  bg:"#080C14",bg1:"#0F1520",bg2:"#161D2E",bg3:"#1E2740",
  border:"#1C2538",borderL:"#2A3550",
  accent:"#6366F1",accentL:"#818CF8",accentBg:"#6366F115",
  green:"#10B981",greenBg:"#10B98112",red:"#EF4444",redBg:"#EF444412",
  amber:"#F59E0B",amberBg:"#F59E0B12",
  lilac:"#A78BFA",lilacBg:"#A78BFA12",
  t1:"#F1F5F9",t2:"#CBD5E1",t3:"#94A3B8",t4:"#64748B",
  MIN_PASS: 80,
};

// ── Storage helpers ──
const STORAGE_KEY = "qa-mastery-session";
async function loadSession() {
  try {
    const r = await window.storage.get(STORAGE_KEY);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}
async function saveSession(data) {
  try { await window.storage.set(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// ── Base Components ──
const Section=({title,badge,badgeColor,children,style,border})=>(
  <div style={{background:T.bg2,border:`1px solid ${T.border}`,borderLeft:border?`3px solid ${border}`:undefined,borderRadius:10,padding:"20px 22px",boxSizing:"border-box",...style}}>
    {(badge||title)&&<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
      {badge&&<span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,background:`${badgeColor||T.accent}15`,color:badgeColor||T.accent,letterSpacing:.5,textTransform:"uppercase"}}>{badge}</span>}
      {title&&<h3 style={{margin:0,fontSize:16,fontWeight:700,color:T.teal,textAlign:"left"}}>{title}</h3>}
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

// ── DATA ──
const M=[
{id:"m1",title:"Fundamentos del Testing",desc:"Qué es el testing, por qué existe, tipos de testing, STLC/SDLC y el rol real del tester en la industria.",
lessons:[
{id:"m1l1",title:"Qué es el Testing y por qué existe",
intro:"El testing no es \"verificar que funcione\". Es una disciplina de ingeniería cuyo objetivo es reducir el riesgo de fallos en producción que impacten al negocio, a los usuarios o a la reputación de la empresa.",
sections:[
{title:"El costo exponencial de los bugs",paragraphs:["Un bug encontrado en requisitos cuesta x1. En desarrollo cuesta x10. En QA cuesta x100. En producción cuesta x1000. Esta progresión no es teórica — está respaldada por décadas de datos de la industria."],bullets:["Knight Capital perdió $440M en 45 minutos por un bug en su sistema de trading automatizado","Facebook expuso 50 millones de tokens de acceso por un error de autenticación en 2018","Therac-25: errores de software en máquinas de radioterapia causaron muertes por sobredosis de radiación"],paragraphs2:["No son errores de \"malos desarrolladores\" — son fallos sistémicos donde el testing fue insuficiente o inexistente."]},
{title:"Por qué los humanos producen bugs",paragraphs:["Los errores de software no son accidentes aleatorios. Son consecuencia de sesgos cognitivos predecibles que afectan a TODOS los desarrolladores:"],bullets:["Sesgo de confirmación: el developer prueba que SU código funciona, no que falle. Testea el happy path y asume que los edge cases \"no van a pasar\"","Efecto de anclaje: si algo funcionó ayer, asumimos que funciona hoy — sin verificar que un cambio en otro módulo no rompió la integración","Ceguera por familiaridad: después de ver el mismo código 100 veces, ya no ves los errores. Necesitas ojos frescos","Complejidad combinatoria: una app con 20 campos de 10 opciones tiene 10²⁰ combinaciones posibles. Nadie puede probar todo — necesitas ESTRATEGIA, no fuerza bruta."]},
{title:"Tu verdadero trabajo como tester",paragraphs:["No buscas bugs. Buscas RIESGO. Tu trabajo es responder una pregunta fundamental:"],highlight:"¿Qué tan confiados estamos en que este software hace lo que debe, no hace lo que no debe, y sobrevive condiciones adversas?",paragraphs2:["Esa confianza se construye con evidencia: tests ejecutados, bugs encontrados, áreas cubiertas, riesgos mitigados. Tu entregable no es un reporte — es información para tomar decisiones."]}
],
senior:"En Big Tech, el QA no es un gate al final del proceso. Es un multiplicador de calidad que opera desde el diseño del requisito hasta el monitoreo en producción. Si esperas al código para empezar a testear, llegaste tarde. Los mejores testers encuentran el 30% de los defectos antes de que se escriba una sola línea de código.",
exercise:{title:"Análisis de Riesgo Real",scenario:"Eres el QA Lead asignado al checkout de un e-commerce que procesa $2M diarios. El equipo quiere lanzar \"Compra con un click\" (similar a Amazon 1-Click).",task:"Identifica los 5 riesgos más críticos que testearías ANTES de producción. Para cada uno define:\n\n• Qué podría salir mal (el riesgo concreto)\n• Impacto al negocio (en dinero, usuarios o reputación)\n• Cómo lo testearías (approach técnico)\n\nNO pienses en \"casos de prueba\". Piensa en RIESGO.",solution:["Doble cobro por click múltiple — Impacto: chargebacks masivos, pérdida de confianza del usuario. Test: simular clicks rápidos (debounce), verificar idempotencia del endpoint de pago con requests concurrentes.","Race condition en inventario — Impacto: vender producto agotado, costo de compensación al cliente. Test: 100 usuarios simultáneos comprando el último ítem, verificar que solo 1 transacción se complete.","Método de pago expirado/inválido — Impacto: orden creada sin cobro real. Test: tarjetas expiradas, fondos insuficientes, tarjetas bloqueadas. Verificar que la orden NO se cree si el pago falla.","Dirección de envío incorrecta por defecto — Impacto: envíos a dirección equivocada, costo de re-envío ~$15-30 por paquete. Test: usuario con múltiples direcciones, dirección default eliminada, dirección incompleta.","Fallo parcial en el flujo (cobro sin orden o viceversa) — Impacto: pérdida financiera directa o producto enviado sin cobro. Test: simular timeout del servicio de inventario DESPUÉS del cobro, verificar mecanismo de compensación/rollback."]}},
{id:"m1l2",title:"Tipos de Testing — Taxonomía Real",
intro:"Cada tipo de testing existe por una razón específica. Si no sabes cuándo usar cada uno, desperdicias tiempo y recursos — o peor, dejas huecos de cobertura que los usuarios van a encontrar en producción.",
sections:[
{title:"Por nivel de ejecución",paragraphs:["Cada nivel verifica una capa diferente del sistema:"],bullets:["Unit Testing — Lo hace el developer. Verifica una función aislada. Si un tester está escribiendo unit tests, algo está mal en el proceso del equipo.","Integration Testing — Aquí empieza tu territorio. Verificas que los componentes hablan correctamente entre sí. Ejemplo real: el servicio de usuarios devuelve un JSON, el servicio de pedidos lo consume. ¿Qué pasa si el campo \"email\" viene null?","E2E (End-to-End) Testing — El flujo completo como lo haría un usuario real. Desde login hasta checkout completado. Es el más costoso y frágil. Úsalo solo para happy paths críticos del negocio."]},
{title:"Por propósito",paragraphs:["Diferentes momentos del ciclo requieren diferentes tipos:"],bullets:["Smoke Testing — \"¿La app enciende?\" Funcionalidades críticas en menos de 15 minutos. Si tu smoke tarda 2 horas, no es smoke — es regression mal etiquetado.","Regression Testing — Verificas que lo que ya funcionaba SIGUE funcionando. El 70% de bugs en producción son regresiones.","Sanity Testing — Subset enfocado de regression. \"Cambiamos pagos, verificamos solo pagos a profundidad.\"","Exploratory Testing — NO es \"clickear sin plan\". Es testing con charter: \"En 30 minutos, exploro registro con datos extremos en campos opcionales.\""]},
{title:"La pirámide de testing",paragraphs:["La distribución ideal en Big Tech:"],bullets:["70% unit tests — rápidos, aislados, baratos de mantener","20% integration tests — verifican contratos entre componentes","10% E2E tests — solo happy paths críticos del negocio"],highlight:"Si tu suite E2E tiene 500 tests y tu integration tiene 50, tu arquitectura está invertida. Invierte la pirámide."}
],
senior:"Un tester que dice \"voy a hacer exploratory testing\" sin charter definido no está haciendo exploratory — está clickeando sin dirección. Siempre define: qué área, qué datos, cuánto tiempo, qué documentas.",
exercise:{title:"Decide el Tipo de Testing",scenario:"Para cada escenario, decide qué tipo(s) de testing aplicarías y justifica.",task:"1. Se cambió el color de un botón de \"Comprar\" de azul a verde.\n2. Se migró la base de datos de MySQL a PostgreSQL sin cambiar la API.\n3. Se agregó un nuevo endpoint /api/v2/users que coexiste con /api/v1/users.\n4. Es viernes 4pm, hay un hotfix que corrige un bug crítico en producción.\n5. El PM dice \"quiero asegurarme de que el checkout funciona bien en general\".",solution:["Cambio de color — Visual regression test. Verificar que el click handler no se rompió.","Migración de DB — Integration testing EXTENSO. Cada query debe retornar los mismos resultados. Performance comparison.","Nuevo endpoint v2 — Integration del v2 + regression del v1 + contract testing entre versiones.","Hotfix viernes — Smoke testing SOLAMENTE del fix y área afectada. Deploy con monitoreo activo.","\"Funciona bien\" — NO es testeable. Preguntar: \"¿Qué significa 'bien'? ¿Qué cambió?\" Cuestionar requerimientos ambiguos es tu TRABAJO."]}},
{id:"m1l3",title:"STLC, SDLC y tu Rol Real",
intro:"El error más común de un tester junior: esperar a que development termine para empezar a testear. En Big Tech, si esperas al código, llegaste tarde.",
sections:[
{title:"STLC — Las 6 fases del testing",paragraphs:["El Software Testing Lifecycle:"],bullets:["1. Análisis de Requisitos — Encontrar ambigüedades y gaps ANTES del código. Tu mayor multiplicador de valor.","2. Planificación — Qué testeas, qué NO, herramientas, tiempo, criterios de entrada/salida.","3. Diseño de Casos — Técnicas formales (EP, BVA, tablas de decisión). NO improvises.","4. Configuración del Ambiente — Datos, staging, mocks. Sin ambiente = tester bloqueado.","5. Ejecución — Tests, resultados, bugs con precisión de cirujano.","6. Cierre — Métricas, lecciones, qué se escapó y por qué."]},
{title:"En la práctica Agile",paragraphs:["Todo ocurre en un sprint de 2 semanas. Participas en refinement, estimas esfuerzo, shift-left y shift-right."],highlight:"No eres un paso en el proceso. Eres un participante continuo."},
{title:"Tu influencia real en Big Tech",paragraphs:["En Google, los SDET tienen la misma voz que los SWE. Pueden bloquear un release si la calidad no cumple. Esa autoridad se gana con CRITERIO."]}
],
senior:"Shift-left significa que tus preguntas en refinement evitan más bugs que tus tests. Una pregunta sobre un edge case ahorra 3 días de desarrollo y 2 bugs en producción.",
exercise:{title:"Shift-Left en Acción",scenario:"User story: resetear contraseña. Criterios: email con link, expira 24h, cumplir políticas de seguridad.",task:"ANTES del código, identifica al menos 8 preguntas o ambigüedades que escalarías.",solution:["¿Múltiples resets invalidan links anteriores?","\"Políticas de seguridad\" — ¿cuáles exactamente?","¿Rate limiting? ¿Cuántos intentos por hora?","Si el email NO existe, ¿qué mensaje? (enumeración de usuarios)","¿Link de un solo uso o múltiples en 24h?","¿Qué pasa si cambia su email después del reset?","¿Cerrar sesión en todos los dispositivos?","¿Notificación de cambio de contraseña?","¿Proxies enterprise que hacen prefetch invalidan el token?","¿Interacción con 2FA?"]}}
],
quiz:[
{q:"Un bug en requisitos cuesta x1. ¿En producción?",o:["x10","x100","x1000","x50"],a:2},
{q:"Distribución correcta de la pirámide de testing:",o:["70% E2E, 20% Integration, 10% Unit","70% Unit, 20% Integration, 10% E2E","33% cada uno","50% Integration, 30% Unit, 20% E2E"],a:1},
{q:"Exploratory testing sin charter es:",o:["Testing creativo","Clickear sin dirección","Testing ágil válido","Ad-hoc aceptable"],a:1},
{q:"¿Qué es shift-left?",o:["Testear más rápido","Involucrar testing desde fases tempranas","Mover tests a la izquierda","Automatizar antes de diseñar"],a:1},
{q:"PM dice \"que funcione bien\". Tu respuesta:",o:["Testear todo","Preguntar qué significa \"bien\", qué preocupa, qué cambió","No es tu responsabilidad","Smoke test estándar"],a:1},
{q:"El 70% de bugs en producción son:",o:["Bugs nuevos","Regresiones","Performance","UI/UX"],a:1},
{q:"¿Cuándo empieza el trabajo del tester en Agile?",o:["Cuando dev termina","En el refinement","Cuando PM asigna","Día del deploy"],a:1}
]},
{id:"m2",title:"Diseño de Pruebas",desc:"Técnicas formales: partición de equivalencia, valores límite, tablas de decisión, state transition y RTM.",
lessons:[
{id:"m2l1",title:"Partición de Equivalencia y Valores Límite",
intro:"Estas dos técnicas generan el mayor valor por esfuerzo invertido. Reducen miles de combinaciones a un conjunto manejable y efectivo.",
sections:[
{title:"Partición de Equivalencia (EP)",paragraphs:["Divide el dominio en clases donde todos los valores se comportan igual. Testeas UN valor por clase."],bullets:["Ejemplo — Campo \"edad\" para seguro:","Inválida: < 18 | Válida 1: 18-25 | Válida 2: 26-65 | Válida 3: 66-99 | Inválida: > 99","Inválidas: no numérico, negativo, decimal, vacío","Con 7-8 tests cubres miles de valores"]},
{title:"Análisis de Valores Límite (BVA)",paragraphs:["Los bugs viven en los bordes. SIEMPRE. Rango 18-65: testeas 17, 18, 19, 64, 65, 66."],bullets:["Monto ($1 min, $10K max): $0.99, $1.00, $1.01, $9999.99, $10000.00, $10000.01","También: $0.00, $0.01, -$0.01"],highlight:"Testear $5,000 porque \"es intermedio\" no encuentra NADA extra. En Big Tech, BVA aplica a TODO: strings, arrays, timestamps."}
],
senior:"Cuando un dev dice \"ya probé con datos normales\", pregunta: \"¿Probaste en los límites?\" El 80% de bugs de validación están en los bordes.",
exercise:{title:"Diseña Tests con EP y BVA",scenario:"Formulario de registro de streaming.",task:"Campos: Username 3-20 alfanumérico, Contraseña 8-64 con mayúscula+número+especial, Fecha > 13 años, ZIP 5 dígitos.\n\nPara CADA campo: clases EP, valores BVA, mín 3 casos. Bonus: interacciones.",solution:["Username — Válida: \"user123\". Inválidas: \"ab\", \"user name\", \"user@!\". BVA: 2(inv), 3(mín), 20(máx), 21(inv).","Contraseña — Inválidas: sin mayúscula, sin número, sin especial, 7 chars. BVA: 7, 8, 64, 65.","Fecha — BVA: exactamente 13 años hoy, 12 años 364 días. ¿Qué timezone?","Interacciones: ¿username en contraseña? ¿13 años en qué timezone?"]}},
{id:"m2l2",title:"Tablas de Decisión y State Transition",
intro:"Cuando el comportamiento depende de combinaciones de condiciones o estados, necesitas técnicas sistemáticas.",
sections:[
{title:"Tablas de Decisión",paragraphs:["Mapean todas las combinaciones y resultados."],bullets:["Ejemplo — Envío gratis: ¿Prime? ¿> $50? ¿Elegible?","2³ = 8 combinaciones, cada una un caso de prueba","Sin la tabla, PIERDES combinaciones."]},
{title:"State Transition Testing",paragraphs:["Para sistemas con estados definidos."],bullets:["Pedido: Pending → Paid → Processing → Shipped → Delivered","También: Pending → Cancelled, Paid → Refunded","CRÍTICO: testear transiciones INVÁLIDAS. ¿Delivered → Pending?"],highlight:"State machines son ubicuos: usuarios, pagos, deployments, feature flags."}
],
senior:"Tablas de decisión son tu arma en refinements. PM dice \"premium + >$100 = envío gratis\". Tú: \"¿Y las otras 6 combinaciones?\"",
exercise:{title:"State Transition de Cuenta Financiera",scenario:"Plataforma tipo PayPal.",task:"Estados: Pending, Active, Suspended, Locked, Closed, Banned.\nReglas: KYC activa, sospecha suspende, 5 intentos bloquea, cierre voluntario, ban por fraude.\n\n1) Transiciones válidas 2) 5 inválidas 3) Saldo en cada transición.",solution:["Válidas: Pending→Active, Pending→Closed, Active→Suspended, Active→Locked, Active→Closed, Suspended→Active, Suspended→Banned, Locked→Active.","Inválidas: Banned→Active (NUNCA), Closed→Active, Pending→Suspended, Locked→Closed, Banned→Closed.","Saldo: Suspended=congelado, Closed=debe ser $0, Banned=retenido para legal."]}},
{id:"m2l3",title:"Casos de Prueba Profesionales y RTM",
intro:"Un caso mal escrito es un caso que nadie más puede ejecutar. Tus casos deben ser autónomos, reproducibles y trazables.",
sections:[
{title:"Anatomía de un caso profesional",bullets:["ID: TC-LOGIN-001 — Login exitoso con credenciales válidas","Precondiciones: usuario registrado con datos específicos","Ambiente: Chrome 120+, staging, API v2.3","Pasos numerados con datos exactos","Resultado esperado MEDIBLE: redirect en <3s, cookie creada","Prioridad: P0 (smoke) | Trazabilidad: REQ-AUTH-001"],highlight:"CUALQUIER persona debe ejecutarlo y obtener el MISMO resultado."},
{title:"Requirements Traceability Matrix (RTM)",paragraphs:["Mapea: Requisito → Casos → Estado → Bugs."],bullets:["Requisito sin casos = NO CUBIERTO","Caso sin requisito = test huérfano","Se mantiene viva cada sprint"]}
],
senior:"En Amazon, cada test tiene un \"blast radius\": si falla, ¿cuántos usuarios y cuánto revenue afecta?",
exercise:{title:"Escribe Casos Profesionales",scenario:"Carrito con código de descuento.",task:"Reglas: 1 código, SAVE10=10%, FLAT20=$20 si >$100, expiran, no Clearance, envío no se descuenta.\n\n8 casos completos. Mín 2 negativos, 1 interacción.",solution:["TC-001: SAVE10 en $200 regular → $180.","TC-002: FLAT20 en $150 → $130.","TC-003 (neg): FLAT20 en $80 → rechazado.","TC-004 (neg): Código expirado → rechazado.","TC-005: Dos códigos → segundo rechazado.","TC-006 (interacción): SAVE10 en mixto (regular $100 + clearance $50) → descuento solo $100.","TC-007: Envío $9.99 NO se descuenta.","TC-008: SAVE10, eliminar items → recalcula."]}}
],
quiz:[
{q:"En EP, ¿cuántos valores por clase?",o:["Todos","Uno representativo","Tres","Depende"],a:1},
{q:"¿Dónde están los bugs de validación?",o:["Intermedios","Bordes/límites","Nulos","Negativos"],a:1},
{q:"4 condiciones binarias = combinaciones:",o:["4","8","16","32"],a:2},
{q:"En State Transition, lo MÁS importante:",o:["Transiciones válidas","Transiciones INVÁLIDAS","Estado inicial/final","Frecuentes"],a:1},
{q:"\"Verificar que login funciona\" es:",o:["Aceptable","Insuficiente","Válido si conocen el sistema","Buen caso alto nivel"],a:1},
{q:"Requisito sin casos en RTM:",o:["Normal en Agile","No cubierto","Se cubre exploratory","Dev lo cubrió"],a:1}
]},
{id:"m3",title:"Bugs y Gestión de Calidad",desc:"Documentación profesional, severidad vs prioridad con criterio real, red flags y priorización.",
lessons:[
{id:"m3l1",title:"Documentación de Bugs",
intro:"Un bug mal documentado es un bug que no se arregla. Tu reporte es tu credibilidad profesional.",
sections:[
{title:"Estructura profesional",bullets:["Título buscable: \"Login returns 500 when email contains + character\"","Ambiente: OS, browser, API version, staging/prod, fecha","Pasos EXACTOS, numerados, con DATOS ESPECÍFICOS","Resultado actual con evidencia (screenshot, logs, HTTP response)","Resultado esperado según spec","Frecuencia: siempre / intermitente / una vez","Impacto: usuarios afectados, impacto monetario"]},
{title:"Severidad vs Prioridad",paragraphs:["Dos dimensiones DIFERENTES:"],bullets:["SEVERIDAD = impacto TÉCNICO: Critical > High > Medium > Low","PRIORIDAD = urgencia NEGOCIO: P0 hotfix > P1 sprint > P2 > P3","Typo nombre CEO = sev LOW, prioridad P0","Crash en 0.1% = sev CRITICAL, puede ser P2"],highlight:"Tester asigna severidad. PO/PM asigna prioridad."}
],
senior:"Un bug report excelente incluye hipótesis: \"Posiblemente el endpoint no sanitiza el +.\" Acelera el fix y demuestra comprensión.",
exercise:{title:"Documenta Este Bug",scenario:"App delivery: pedido $45.50, cupón WELCOME50 (50% off), cobro correcto $22.75, email correcto.",task:"PERO: historial muestra $45.50. Escribe bug report completo. Severidad y prioridad justificadas.",solution:["Título: Order history displays pre-discount amount after WELCOME50 coupon","Severidad: Medium — no hay pérdida financiera, genera confusión","Prioridad: P1 — nuevos usuarios ven discrepancia, afecta retention","Hipótesis: order history lee subtotal pre-descuento"]}},
{id:"m3l2",title:"Criterio para Clasificar Bugs",
intro:"La diferencia entre junior y senior no es encontrar más bugs — es clasificarlos correctamente.",
sections:[
{title:"Red flags: siempre escalación inmediata",bullets:["Bug que involucre dinero","Exposición de datos de otro usuario","Bypass de autenticación","Pérdida de datos irrecuperable","Bloqueo del flujo principal >5%"],highlight:"Si encuentras alguno, no esperes al standup. Escala INMEDIATAMENTE."},
{title:"Framework de priorización senior",paragraphs:["Cruza severidad con:"],bullets:["¿Cuántos usuarios afectados?","¿Hay workaround?","¿Es regresión?","¿Puede empeorar?","¿One-way door o two-way door?"]}
],
senior:"Amazon: one-way door (pérdida datos) = SIEMPRE P0. Two-way door (visual hotfixeable) = puede esperar.",
exercise:{title:"Clasifica y Prioriza",scenario:"6 bugs, capacidad para 3.",task:"1. Crash foto perfil iPhone 12\n2. Botón Cancelar suscripción no funciona\n3. Emails con 30 min delay\n4. Dashboard admin muestra ayer\n5. Memory leak tras 4h\n6. Filtro precio en orden incorrecto\n\nElige 3 y justifica.",solution:["#2 (P0 — posible violación legal UE/California)","#1 (P1 — crash visible, dispositivo común)","#3 (P1 — emails tardíos causan ansiedad)","Próximo: #5, #4, #6"]}}
],
quiz:[
{q:"Typo nombre CEO en landing:",o:["Sev HIGH P0","Sev LOW P0","Sev LOW P3","Sev MED P1"],a:1},
{q:"¿Quién asigna prioridad?",o:["Tester","Developer","Product Owner/PM","QA Lead"],a:2},
{q:"Endpoint devuelve datos de OTRO usuario:",o:["Sev Med P2","Sev Critical P0","Sev Low","Sev High P1"],a:1},
{q:"Crash en 0.1% de usuarios:",o:["Sev Low","Sev Critical","Sev Medium","No es bug"],a:1},
{q:"Hipótesis en bug report:",o:["Demostrar que programas","Acelerar fix y mostrar comprensión","Asignar al dev correcto","Cubrir responsabilidad"],a:1}
]},
{id:"m4",title:"Herramientas del Tester",desc:"Jira, Azure DevOps, Postman para API testing, SQL para investigación y Git básico.",
lessons:[
{id:"m4l1",title:"Jira y Azure DevOps",
intro:"No basta con saber que existen. Necesitas dominar los patrones que te hacen productivo como tester profesional.",
sections:[
{title:"Jira avanzado para QA",paragraphs:["Un tester senior usa Jira como centro de inteligencia de calidad:"],bullets:["Dashboards: bugs por severidad, por módulo, velocity de fix, aging de bugs críticos","JQL: project = CHECKOUT AND type = Bug AND severity = Critical AND status != Closed AND created >= -30d","Workflows: Open → In Progress → In Review → Verified → Closed (tester valida antes de cerrar)","Trazabilidad: linkear bugs ↔ test cases ↔ stories","Filtros guardados: \"Mis bugs\", \"Críticos sin asignar\", \"En verificación\""]},
{title:"Azure DevOps para QA",paragraphs:["Azure DevOps es el ecosistema de Microsoft para gestión de proyectos, repos, pipelines y testing. En muchas empresas enterprise es la herramienta principal:"],bullets:["Azure Boards: work items, bugs, user stories con estados personalizables. Similar a Jira pero integrado con el ecosistema Microsoft.","Azure Test Plans: módulo dedicado a QA. Creas test suites, test cases con pasos y expected results. Puedes ejecutar manualmente y trackear resultados directamente.","Queries avanzadas (equivalente a JQL): filtrar bugs por área path, iteration, severity, assigned to, state. Ejemplo: Severity = 1 AND State <> Closed AND Area Path = Checkout","Azure Pipelines: CI/CD integrado. Configuras tu suite de tests automatizados para correr en cada PR, exactamente como GitHub Actions pero dentro del ecosistema Azure.","Dashboards y Widgets: creas dashboards de calidad con widgets de bugs, test results, code coverage. Visibilidad para todo el equipo.","Integración con VS Code, Visual Studio, y extensiones para Selenium/Playwright que reportan resultados directamente a Azure Test Plans."],highlight:"Si tu empresa usa Azure DevOps, dominar Test Plans y Queries es tan importante como dominar JQL en Jira. El concepto es el mismo — la interfaz cambia."},
{title:"Postman — API Testing",paragraphs:["El 80% del testing crítico moderno es a nivel de API:"],bullets:["Requests GET/POST/PUT/DELETE con headers, body, autenticación","Variables de ambiente (staging vs prod)","Tests automatizados: pm.test(\"Status 200\", () => pm.response.to.have.status(200));","Collections: register → login → create order → verify → cancel","Pre-request scripts: timestamps, UUIDs, tokens dinámicos","Newman para correr collections en CI/CD"]},
{title:"SQL para investigación",paragraphs:["Queries que la UI NUNCA te mostraría:"],bullets:["SELECT * FROM orders WHERE user_id = 123 AND status = 'pending';","SELECT o.id, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.total != o.subtotal - o.discount;","INNER JOIN para datos en ambas tablas, LEFT JOIN para encontrar órdenes sin pago"]},
{title:"Git básico para testers",paragraphs:["Mínimo viable:"],bullets:["clone, pull, log, diff, branch/checkout"],highlight:"git diff te muestra qué cambió para enfocar regression."}
],
senior:"Un tester que solo usa la UI es un tester a medias. El 50% de bugs costosos están en la capa de datos. SQL es tu superpoder silencioso.",
exercise:{title:"Investigación con SQL",scenario:"Tablas: users, orders, payments. Reportan: \"Premium sin descuento 15%.\"",task:"Queries para:\n1. Órdenes Premium sin descuento correcto\n2. Cobro vs final_amount\n3. Desde cuándo empezó\nBonus: ¿Qué JOIN y por qué?",solution:["1. SELECT o.id, u.email, o.total, o.discount, ROUND(o.total*0.15,2) AS expected FROM orders o JOIN users u ON o.user_id=u.id WHERE u.plan_type='premium' AND o.discount != ROUND(o.total*0.15,2);","2. SELECT o.id, o.final_amount, p.amount, (o.final_amount-p.amount) AS diff FROM orders o JOIN payments p ON p.order_id=o.id WHERE o.final_amount != p.amount;","3. SELECT MIN(o.created_at) FROM orders o JOIN users u ON o.user_id=u.id WHERE u.plan_type='premium' AND o.discount != ROUND(o.total*0.15,2);","Bonus: INNER JOIN para datos en ambas tablas. LEFT JOIN + WHERE p.id IS NULL para órdenes sin pago."]}}
],
quiz:[
{q:"¿% testing crítico a nivel API?",o:["30%","50%","80%","95%"],a:2},
{q:"JQL / Azure Queries sirven para:",o:["Tests automatizados","Queries avanzadas de tickets/work items","Conectar DB","Reportes código"],a:1},
{q:"¿SQL para tester?",o:["Crear tablas","Verificar datos invisibles en UI","Optimizar queries","Solo sin dev"],a:1},
{q:"Azure Test Plans permite:",o:["Solo automatización","Crear test suites, ejecutar manualmente y trackear resultados","Solo dashboards","Reemplazar Postman"],a:1},
{q:"Git diff para tester:",o:["Escribir código","Ver qué cambió para enfocar regression","Requerido por Jira","Merge branches"],a:1}
]},
{id:"m5",title:"Automatización",desc:"Estrategia, cuándo sí/no, Playwright, CI/CD.",
lessons:[
{id:"m5l1",title:"Estrategia de Automatización",
intro:"La automatización no es un objetivo — es una herramienta. Automatizar todo sin estrategia es el anti-patrón más costoso.",
sections:[
{title:"Cuándo SÍ",bullets:["Lo que ejecutas >3 veces y es estable","Smoke en cada build","Regression de flujos core","Validaciones de API (contratos, schemas, status codes)","Data validation contra DB"]},
{title:"Cuándo NO",bullets:["Exploratory testing","Tests que cambian cada sprint","UX/usabilidad","Features inestables","Validaciones one-time"]},
{title:"El anti-patrón de los 2000 E2E",paragraphs:["Equipos que automatizan TODO:"],bullets:["Suite de 4 horas","30% flaky","Más manteniendo que testeando","Fatiga de alertas"],highlight:"Distribución: 70% API/integration, 20% componente, 10% E2E."}
],
senior:"En Meta, test flaky que falla 2 veces sin ser bug real se desactiva automáticamente. Un flaky es PEOR que no tener test.",
exercise:{title:"Decide Qué Automatizar",scenario:"App tipo Asana, 20 tests de capacidad.",task:"1.Login 2.SSO 3.Crear proyecto 4.Drag&drop 5.Invitar 6.Filtrar 7.Archivos 8.Notif RT 9.CSV 10.Theme 11.API CRUD 12.API Permisos 13.Rate limit 14.E2E completo\n\n¿Cuáles?",solution:["Top: #1, #11, #12, #3, #14, #6, #13","NO: #4 (frágil), #8 (flaky), #10 (bajo valor), #2 (mocks complejos)","API > E2E por estabilidad"]}},
{id:"m5l2",title:"Playwright y CI/CD",
intro:"Playwright: múltiples browsers, auto-wait, network interception.",
sections:[
{title:"Estructura profesional",bullets:["data-testid SIEMPRE, NUNCA CSS frágiles","Assertions explícitas","Datos independientes por test","Tests paralelos e independientes"]},
{title:"Buenas prácticas",bullets:["Page Object Model: 1 archivo vs 47 tests","Screenshots/traces solo en fallo","Retry máximo 1","Reportes claros"]},
{title:"CI/CD",paragraphs:["Tests en cada PR, merge bloqueado si falla."],highlight:"Test flaky que bloquea deploys = problema de TU equipo."}
],
senior:"Page Object Model no es opcional. Sin él, 47 archivos. Con él, 1.",
exercise:{title:"Escribe Tests",scenario:"E-commerce: buscar, carrito, checkout.",task:"Playwright para: buscar, cantidad 2, carrito, verificar total. Caso negativo: agotado.",solution:["test('add to cart', async({page})=> { page.goto('/products'); page.fill('[data-testid=\"search\"]','Mouse'); ... selectOption qty='2'; verificar precio*2 });","test('out of stock') => expect add-to-cart toBeDisabled();"]}}
],
quiz:[
{q:"Anti-patrón más costoso:",o:["No automatizar","Automatizar TODO","Usar Selenium","Sin CI/CD"],a:1},
{q:"Test flaky peor porque:",o:["Lento","Fatiga alertas, nadie confía","Recursos","Debug difícil"],a:1},
{q:"Distribución ideal:",o:["70% E2E","70% API/Integration, 20% Componente, 10% E2E","50/50","No hay regla"],a:1},
{q:"data-testid sobre CSS:",o:["Rápido","Estable ante cambios diseño","Requerido","Accesibilidad"],a:1},
{q:"Page Object Model:",o:["Performance","Centralizar selectores","DB","Reportes"],a:1}
]},
{id:"m6",title:"Testing Avanzado",desc:"Performance (p99), seguridad (OWASP), microservicios, contract testing, chaos engineering.",
lessons:[
{id:"m6l1",title:"Performance, Seguridad y Microservicios",
intro:"Testing funcional es el punto de partida. Los fallos más costosos son de performance, seguridad e integración.",
sections:[
{title:"Performance Testing",bullets:["Load: ¿soporta 1000 simultáneos?","Stress: ¿cuándo se rompe?","Soak: ¿se degrada en 24h?","Spike: ¿sobrevive Black Friday?"],paragraphs2:["Herramientas: k6, JMeter, Gatling. Métricas: p50, p95, p99, RPS, error rate."],highlight:"Si p50=200ms pero p99=5s, con 10M usuarios = 100K con experiencia terrible."},
{title:"Security básico (OWASP)",paragraphs:["4 vulnerabilidades que TODO QA debe verificar:"],bullets:["Injection (SQL, XSS): <script>alert('xss')</script> en campos","Broken Auth: acceso sin token, tokens que no expiran","IDOR: /api/users/123 → /124 muestra datos de otro","CSRF: acciones sin consentimiento"]},
{title:"Microservicios",paragraphs:["Un bug puede ser la interacción entre 3 servicios."],bullets:["Contract Testing (Pact): contrato se rompe ANTES del deploy","Chaos Engineering: ¿qué pasa si pagos tiene 5s latencia?","Distributed Tracing: Jaeger, Zipkin"]}
],
senior:"Netflix Chaos Monkey apaga servidores en producción. La resiliencia no se asume — se prueba.",
exercise:{title:"Plan para Microservicios",scenario:"Ride-sharing: User, Ride, Payment, Notification, Pricing. Pricing actualizado con surge.",task:"1) Tests por servicio 2) Contract tests 3) Chaos engineering 4) Consistencia de precio",solution:["1. Pricing: unit nueva lógica. Ride: regression + nuevo schema. Payment: regression cobros.","2. Contracts: Pricing↔Ride, Pricing↔Payment, Ride↔Notification.","3. Chaos: Pricing 10s latencia. ¿Timeout? ¿Fallback? ¿Cobra sin precio?","4. Tracing: precio mostrado = cobrado = recibo. Con surge y sin surge."]}}
],
quiz:[
{q:"Métrica latencia más importante:",o:["p50","p95","p99","Promedio"],a:2},
{q:"IDOR permite:",o:["SQL injection","Datos de otro usuario","XSS","Suplantar sesión"],a:1},
{q:"Contract Testing verifica:",o:["Velocidad","Formato datos acordado","Réplicas","Deploy"],a:1},
{q:"Chaos Engineering:",o:["Sin plan","Fallos deliberados para resiliencia","Tests random","Usuarios encuentran bugs"],a:1}
]},
{id:"m7",title:"Metodologías Ágiles para QA",desc:"Scrum aplicado, ceremonias, Definition of Done, anti-patrones.",
lessons:[
{id:"m7l1",title:"Scrum Aplicado",
intro:"Scrum no es teoría. Es cómo entregan cada 2 semanas. Tu participación define la calidad.",
sections:[
{title:"El sprint para un tester",paragraphs:["NO esperas a que dev termine:"],bullets:["Mientras devs hacen Story A, testeas Story B","Preparas tests de Story C","Velocidad = stories DONE (con testing)"]},
{title:"Ceremonias",bullets:["Planning: estimas testing, cuestionas stories","Daily: bloqueos, avance, bugs — 15 segundos","Review: calidad, no solo feature","Retro: mejoras concretas al proceso"]},
{title:"Definition of Done",bullets:["Code + review aprobado","Unit tests pasan","Testing funcional QA","Bugs Critical/High resueltos","Regression ok","Docs actualizados"],highlight:"\"Done\" sin testing = \"Deployed sin confianza\"."}
],
senior:"El tester que más valor agrega previene bugs en planning, no en ejecución.",
exercise:{title:"Simulación de Sprint",scenario:"2 semanas, 3 devs, 1 tester, 5 stories.",task:"Día 3: Story 1 review, Story 2 dev.\nDía 5: Story 1 tiene 2 bugs. Story 2 a testing.\nDía 8: Bug High abierto. Stories 3-4 llegan.\nDía 9: PM: \"¿las 5?\"\n\nQué haces cada día.",solution:["Día 3: Preparo tests Story 2, reviso specs 3-5.","Día 5: Testeo Story 2, flag Bug-High.","Día 8: Escalo Bug-High. Testeo 3-4 critical paths.","Día 9: \"Realísticamente 3-4. Story 5 al próximo sprint.\""]}},
{id:"m7l2",title:"Anti-patrones QA en Agile",
intro:"Estos errores destruyen la efectividad del tester.",
sections:[
{title:"QA Pasivo",paragraphs:["Solo ejecuta lo asignado. No cuestiona, no propone."],highlight:"En Big Tech no sobrevive. Tu voz vale tanto como la del developer."},
{title:"QA Tardío",paragraphs:["Dev jueves, QA viernes. 1 día, 5 stories."],bullets:["Solución: testing paralelo al desarrollo."]},
{title:"QA Policía",paragraphs:["Bloquea todo por cosméticos."],bullets:["Solución: criterio. No todo bloquea."]},
{title:"QA Aislado",paragraphs:["No pair testing, no comparte strategy."],bullets:["Solución: pair testing, comunicar strategy."]}
],
senior:"Mejor indicador: devs dicen \"Quiero que revises mi story ANTES de codear.\"",
exercise:{title:"Identifica Anti-patrones",scenario:"5 situaciones.",task:"1. Mudo en planning, se queja después.\n2. Rechaza release por typo tooltip.\n3. Último día: 4 stories a testing.\n4. Nunca habla con devs.\n5. \"No sé cuánto tarda testing.\"",solution:["1. QA Pasivo","2. QA Policía","3. QA Tardío","4. QA Aislado","5. QA Pasivo + inmadurez"]}}
],
quiz:[
{q:"Story Done cuando:",o:["Dev termina","Code review","Testing + bugs resueltos","PM aprueba"],a:2},
{q:"Tester agrega MÁS valor en:",o:["Ejecución","Refinement/planning","Bug report","Retro"],a:1},
{q:"QA Tardío:",o:["Llega tarde","Testing al final sin tiempo","Nuevo","Bugs post-release"],a:1},
{q:"Bloquear release por cosmético:",o:["Riguroso","QA Policía","Estándar","Correcto"],a:1},
{q:"Mejor indicador buen tester:",o:["Bug count","Coverage 100%","Devs lo buscan proactivamente","PM satisfecho"],a:2}
]},
{id:"m8",title:"Mentalidad y Soft Skills",desc:"Mentalidad de elite, comunicación, decisiones bajo incertidumbre, entrevistas Big Tech.",
lessons:[
{id:"m8l1",title:"Mentalidad de Elite",
intro:"La diferencia no es técnica. Es mentalidad.",
sections:[
{title:"Mentalidad destructiva constructiva",paragraphs:["Encontrar cómo se rompe — para PROTEGER."],bullets:["¿Cómo lo usa un usuario distraído?","¿Cómo lo abusa un malicioso?","¿Qué pasa bajo presión?","¿Qué asumió el dev que \"nunca pasa\"?","¿Dos usuarios simultáneos?"]},
{title:"Comunicación con developers",bullets:["NUNCA: \"Tu código tiene un bug\"","SIEMPRE: \"Comportamiento inesperado en X. Al hacer Y→Z, esperaba W según REQ-123. ¿Intencional?\"","Respeto + datos + pregunta abierta"]},
{title:"Ownership real",highlight:"Tu responsabilidad es la calidad del PRODUCTO, no tu bug count."}
],
senior:"Los más respetados dicen \"no sé, voy a investigar\". Humildad + rigor = senior.",
exercise:{title:"Escenarios de Criterio",scenario:"Tres situaciones reales.",task:"1. Jueves 6pm, release mañana. Bug: 2% tarda 15s. PM quiere lanzar.\n2. Dev senior rechaza tu bug. Contradice requisito. Él 10 años, tú 3 meses.\n3. Feature sin spec escrita.",solution:["1. ¿El 2% es checkout? 15s causa doble click. Lanzar CON monitoring.","2. Mostrar REQ-123. \"¿Cambió? Actualicemos docs.\"","3. \"Necesito criterios de aceptación. Sin eso no garantizo cobertura.\""]}},
{id:"m8l2",title:"Entrevistas Big Tech",
intro:"Buscan ingenieros que piensen en sistemas y comuniquen con claridad.",
sections:[
{title:"Lo que evalúan",bullets:["Pensamiento sistemático: CÓMO piensas","Priorización basada en riesgo","Técnico: API, SQL, automatización","Comunicación clara para PMs"]},
{title:"Pregunta del elevador",bullets:["Funcional: pisos, puertas, indicador","Edge: todos los pisos, cancelar","Concurrencia: llamadas simultáneas","Seguridad: sensor, freno, teléfono","Performance: tiempo, peso","Resiliencia: corte energía","Accesibilidad: braille, voz"]},
{title:"Factor diferenciador",highlight:"No es lo que sabes. Es cómo PIENSAS EN VOZ ALTA."}
],
senior:"\"No tengo experiencia directa, pero mi approach sería...\" Honestidad + problem solving.",
exercise:{title:"Mock Interview",scenario:"Entrevista FAANG.",task:"1. ¿Cómo testearías búsqueda de Google?\n2. 15 bugs: 3 P0, 5 P1, 7 P2. Solo 8.\n3. ¿Buen vs gran tester?",solution:["1. Funcional, autocompletado, resultados, i18n, performance <200ms, seguridad, accesibilidad.","2. 3 P0 obligatorios + 5 P1 por impacto.","3. Buen tester encuentra. Gran tester previene y mejora procesos."]}}
],
quiz:[
{q:"Comunicar bug:",o:["\"Tu código tiene bug\"","\"Comportamiento inesperado: X→Y, esperaba Z. ¿Intencional?\"","\"Arréglalo\"","\"Ticket asignado\""],a:1},
{q:"Ownership real:",o:["Ejecutar tests","Culpa del dev","Calidad del PRODUCTO","Arreglar bugs"],a:2},
{q:"En entrevista sin saber:",o:["Inventar","\"No tengo experiencia, mi approach sería...\"","Cambiar tema","\"Nunca preguntan eso\""],a:1},
{q:"Gran vs buen tester:",o:["Más bugs","Más automation","Previene y mejora procesos","Certificaciones"],a:2},
{q:"Dev rechaza bug con evidencia. Tu acción:",o:["Cerrar bug","Escalar gritando","Mostrar requisito, preguntar si cambió","Abrir otro igual"],a:2}
]}
];

const FE={title:"Evaluación Final — QA Engineer",
scenario:"Eres QA Lead en \"QuickPay\", fintech de pagos móviles.\n\nNueva feature: \"Pagos Programados\" — pagos recurrentes automáticos.\n\nReglas:\n\u2022 Monto: $1.00 mín, $10,000.00 máx\n\u2022 Frecuencias: semanal, quincenal, mensual\n\u2022 Cancelar/modificar hasta 24h antes\n\u2022 Sin fondos: reintento a 4h y 8h\n\u2022 3 fallos: se desactiva\n\u2022 Notificaciones: 24h antes, al ejecutar, si falla\n\u2022 Historial: 2 años",
parts:[
{id:"p1",title:"Parte 1 — Análisis de Riesgo",prompt:"5 riesgos críticos. Para cada uno: riesgo, impacto, cómo testear.",rubric:"Incluir: financieros (doble cobro), seguridad (mod no autorizada), temporales (timezone), reintentos, compliance."},
{id:"p2",title:"Parte 2 — Casos de Prueba",prompt:"6 casos: 2 happy, 2 edge, 1 seguridad, 1 integración. Formato completo.",rubric:"Datos específicos, reproducibles, edge no obvios, seguridad relevante, integración con fallo."},
{id:"p3",title:"Parte 3 — Detección de Bugs",prompt:"¿Bug o esperado?\n\n1. Pago 31 feb → ejecuta 3 mar.\n2. Modificar 23h antes: no aplica.\n3. Cuenta Suspended ejecuta pagos.\n4. Email 24h llega 26h antes.\n5. Elimina tarjeta: pago falla sin aviso.",rubric:"1: Bug. 2: Bug (23h < 24h). 3: CRITICAL. 4: Debatible. 5: HIGH."},
{id:"p4",title:"Parte 4 — Priorización",prompt:"6 bugs, arreglar 3:\n1. Doble cobro reintento+manual\n2. Historial 6 meses\n3. Notif en inglés\n4. Suspended ejecuta\n5. Cancelar no responde iOS 16\n6. Acepta $10,000.01",rubric:"#1 (doble cobro P0), #4 (security P0), #5 (bloqueante P1)."}
]};

// ── VIEWS ──
const LessonView=({lesson,onComplete,isComplete})=>{
  const[tab,setTab]=useState(0);const[showSol,setShowSol]=useState(false);const[answer,setAnswer]=useState("");
  useEffect(()=>{setTab(0);setShowSol(false);setAnswer("");},[lesson.id]);
  return(
    <div style={{textAlign:"left"}}>
      <div style={{display:"flex",gap:6,marginBottom:24,flexWrap:"wrap"}}>
        {["Contenido","Insight Senior","Ejercicio"].map((t,i)=><button key={i} onClick={()=>setTab(i)} style={{padding:"7px 16px",borderRadius:7,fontSize:13,fontWeight:600,fontFamily:"inherit",cursor:"pointer",border:`1px solid ${i===tab?T.accent:T.border}`,background:i===tab?T.accentBg:"transparent",color:i===tab?T.accentL:T.t4}}>{t}</button>)}
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
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:24}}><Btn onClick={onComplete} style={{background:isComplete?T.green:T.accent}}>{isComplete?"Completada ✓":"Marcar como completada"}</Btn></div>
    </div>);
};

const QuizView=({quiz,onComplete,onExit,existingScore})=>{
  const[answers,setAnswers]=useState({});const[submitted,setSubmitted]=useState(existingScore!==undefined);const[score,setScore]=useState(existingScore||0);
  const total=quiz.length,answered=Object.keys(answers).length;
  const submit=()=>{let c=0;quiz.forEach((q,i)=>{if(answers[i]===q.a)c++;});const s=Math.round((c/total)*100);setScore(s);setSubmitted(true);if(s>=T.MIN_PASS)onComplete(s);};
  if(submitted){const passed=score>=T.MIN_PASS;return(
    <div style={{display:"flex",flexDirection:"column",gap:18,textAlign:"left"}}>
      <Section border={passed?T.green:T.red}><div style={{textAlign:"center",padding:"12px 0"}}><div style={{fontSize:44,fontWeight:800,color:passed?T.green:T.red}}>{score}%</div><P style={{textAlign:"center",margin:"6px 0 0"}}>{passed?"Aprobado":`No aprobado — mínimo ${T.MIN_PASS}%`}</P></div></Section>
      {quiz.map((q,i)=>{const ok=answers[i]===q.a;return <div key={i} style={{padding:"12px 16px",borderRadius:8,background:ok?T.greenBg:T.redBg,borderLeft:`3px solid ${ok?T.green:T.red}`}}><P style={{fontWeight:600,color:T.t1,marginBottom:4}}>{i+1}. {q.q}</P><P style={{margin:0,fontSize:13,color:ok?T.green:T.red}}>{ok?"Correcto":`Incorrecto — ${q.o[q.a]}`}</P></div>;})}
      <div style={{display:"flex",gap:10}}>{!passed&&<Btn onClick={()=>{setSubmitted(false);setAnswers({});}}>Reintentar</Btn>}<Btn variant="outline" onClick={onExit}>Volver al módulo</Btn></div>
    </div>);}
  return(
    <div style={{display:"flex",flexDirection:"column",gap:18,textAlign:"left"}}>
      <Section badge="Evaluación" badgeColor={T.amber}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><P style={{margin:0}}>Mínimo {T.MIN_PASS}% para aprobar.</P><span style={{fontSize:12,color:T.t4,fontWeight:600}}>{answered}/{total}</span></div><div style={{height:3,background:T.bg3,borderRadius:2,marginTop:10,overflow:"hidden"}}><div style={{width:`${(answered/total)*100}%`,height:"100%",background:T.accent}}/></div></Section>
      {quiz.map((q,i)=><Section key={i}><P style={{fontWeight:600,color:T.t1}}>{i+1}. {q.q}</P><div style={{display:"flex",flexDirection:"column",gap:6}}>
        {q.o.map((opt,oi)=><button key={oi} onClick={()=>setAnswers({...answers,[i]:oi})} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,textAlign:"left",fontFamily:"inherit",border:`1px solid ${answers[i]===oi?T.accent:T.border}`,background:answers[i]===oi?T.accentBg:"transparent",color:answers[i]===oi?T.accentL:T.t3,cursor:"pointer",fontSize:13}}>
          <span style={{width:16,height:16,borderRadius:99,border:`2px solid ${answers[i]===oi?T.accent:T.borderL}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{answers[i]===oi&&<span style={{width:7,height:7,borderRadius:99,background:T.accent}}/>}</span>{opt}
        </button>)}</div></Section>)}
      <div style={{display:"flex",gap:10,justifyContent:"space-between"}}><Btn variant="ghost" onClick={onExit}>Salir del quiz</Btn><Btn onClick={submit} disabled={answered<total} style={{opacity:answered<total?.4:1}}>Enviar ({answered}/{total})</Btn></div>
    </div>);
};

const FinalView=({exam,onBack,onSubmitFinal})=>{
  const[answers,setAnswers]=useState({});const[submitted,setSubmitted]=useState(false);
  const doSubmit=()=>{setSubmitted(true);onSubmitFinal();};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20,textAlign:"left"}}>
      <Section badge="Evaluación Final" badgeColor={T.accent} border={T.accent}><h3 style={{margin:"8px 0 12px",fontSize:18,fontWeight:700,color:T.teal,textAlign:"left"}}>Caso: QuickPay — Pagos Programados</h3><div style={{whiteSpace:"pre-wrap",fontSize:14,lineHeight:1.85,color:T.t2}}>{exam.scenario}</div></Section>
      {exam.parts.map(p=><Section key={p.id} title={p.title}><div style={{whiteSpace:"pre-wrap",fontSize:14,lineHeight:1.85,color:T.t2,marginBottom:12}}>{p.prompt}</div><textarea value={answers[p.id]||""} onChange={e=>setAnswers({...answers,[p.id]:e.target.value})} placeholder="Tu respuesta..." disabled={submitted} style={{width:"100%",minHeight:140,padding:14,borderRadius:8,border:`1px solid ${T.border}`,background:T.bg,color:T.t1,fontSize:14,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box",lineHeight:1.7}}/>
        {submitted&&<div style={{marginTop:12,padding:14,background:T.greenBg,borderRadius:8,borderLeft:`3px solid ${T.green}`}}><div style={{fontSize:10,fontWeight:700,color:T.green,marginBottom:6,textTransform:"uppercase"}}>Rúbrica</div><P style={{margin:0,fontSize:13}}>{p.rubric}</P></div>}
      </Section>)}
      <div style={{display:"flex",gap:10,justifyContent:"space-between"}}><Btn variant="ghost" onClick={onBack}>Volver</Btn>{!submitted&&<Btn onClick={doSubmit} disabled={Object.keys(answers).length<exam.parts.length} style={{opacity:Object.keys(answers).length<exam.parts.length?.4:1}}>Enviar Evaluación</Btn>}</div>
    </div>);
};

// ── Summary View ──
const SummaryView=({modules,quizScores,onBack})=>{
  const scores=modules.map(m=>({title:m.title,score:quizScores[m.id]||0}));
  const avg=Math.round(scores.reduce((a,s)=>a+s.score,0)/scores.length);
  const weak=scores.filter(s=>s.score<90).sort((a,b)=>a.score-b.score);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20,textAlign:"left"}}>
      <Section border={T.accent}><div style={{textAlign:"center",padding:"16px 0"}}><div style={{fontSize:52,fontWeight:800,color:avg>=T.MIN_PASS?T.green:T.red}}>{avg}%</div><P style={{textAlign:"center",fontSize:16,fontWeight:600,color:T.t1,margin:"8px 0 0"}}>Promedio Global</P><P style={{textAlign:"center",margin:"4px 0 0"}}>{avg>=90?"Excelente — nivel Big Tech":avg>=T.MIN_PASS?"Aprobado — sigue reforzando":"Necesitas repasar módulos"}</P></div></Section>
      <Section title="Resultados por Módulo">{scores.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<scores.length-1?`1px solid ${T.border}`:undefined}}>
        <span style={{width:32,textAlign:"right",fontSize:14,fontWeight:700,color:s.score>=90?T.green:s.score>=T.MIN_PASS?T.amber:T.red}}>{s.score}%</span>
        <div style={{flex:1,height:4,background:T.bg3,borderRadius:2,overflow:"hidden"}}><div style={{width:`${s.score}%`,height:"100%",background:s.score>=90?T.green:s.score>=T.MIN_PASS?T.amber:T.red,borderRadius:2}}/></div>
        <span style={{fontSize:13,color:T.t2,minWidth:160}}>{s.title}</span>
      </div>)}</Section>
      {weak.length>0&&<Section title="Temas a Reforzar" border={T.amber}><BL items={weak.map(w=>`${w.title} (${w.score}%) — Repasa el contenido y repite el quiz hasta alcanzar 90%+`)}/></Section>}
      <Btn onClick={onBack}>Volver al inicio</Btn>
    </div>);
};

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
        <div><div style={{fontSize:14,fontWeight:700,color:T.t1}}>Evaluación Final</div><div style={{fontSize:12,color:T.t4,marginTop:2}}>{finalDone?"Completada — ver resumen":finalUnlocked?"Caso real fintech":"Completa todos los quizzes"}</div></div>
      </button>
      {finalDone&&<Btn variant="outline" onClick={onSummary} style={{width:"100%",textAlign:"center"}}>Ver Resumen de Resultados</Btn>}
    </div>);
};

// ── MAIN APP ──
export default function App(){
  const[view,setView]=useState({page:"home"});
  const[mi,setMi]=useState(0);const[li,setLi]=useState(0);
  const[progress,setProgress]=useState({});const[qs,setQs]=useState({});
  const[finalDone,setFinalDone]=useState(false);const[loaded,setLoaded]=useState(false);
  const mainRef=useRef(null);

  // Load session on mount
  useEffect(()=>{
    loadSession().then(data=>{
      if(data){
        if(data.progress)setProgress(data.progress);
        if(data.qs)setQs(data.qs);
        if(data.finalDone)setFinalDone(true);
      }
      setLoaded(true);
    });
  },[]);

  // Save on every change
  useEffect(()=>{
    if(loaded)saveSession({progress,qs,finalDone});
  },[progress,qs,finalDone,loaded]);

  const scroll=()=>{if(mainRef.current)mainRef.current.scrollTop=0;};
  const goHome=()=>{setView({page:"home"});scroll();};
  const goMod=(i,l=0)=>{setMi(i);setLi(l);setView({page:"module"});scroll();};
  const goQuiz=()=>{setView({page:"quiz"});scroll();};
  const goFinal=()=>{setView({page:"final"});scroll();};
  const goSummary=()=>{setView({page:"summary"});scroll();};

  const mod=M[mi],les=mod?.lessons[li];
  const finalOk=M.every(m=>qs[m.id]>=T.MIN_PASS);

  const compLes=useCallback(()=>{
    setProgress(p=>({...p,[`${mod.id}-${li}`]:true}));
    if(li<mod.lessons.length-1){setLi(li+1);scroll();}
  },[mod,li]);
  const compQuiz=useCallback(s=>{setQs(q=>({...q,[mod.id]:s}));setProgress(p=>({...p,[`${mod.id}-quiz`]:true}));},[mod]);
  const compFinal=useCallback(()=>{setFinalDone(true);},[]);

  const crumbs=[{label:"Inicio",action:goHome}];
  if(view.page==="module"||view.page==="quiz"){crumbs.push({label:mod.title,action:()=>goMod(mi)});if(view.page==="quiz")crumbs.push({label:"Quiz"});else if(les)crumbs.push({label:les.title});}
  if(view.page==="final")crumbs.push({label:"Evaluación Final"});
  if(view.page==="summary")crumbs.push({label:"Resumen"});

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
          {finalDone&&<button onClick={goSummary} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 14px",background:view.page==="summary"?T.accentBg:"transparent",border:"none",borderLeft:view.page==="summary"?`3px solid ${T.lilac}`:"3px solid transparent",color:T.lilac,cursor:"pointer",textAlign:"left",fontFamily:"inherit",boxSizing:"border-box"}}>
            <span style={{width:20,height:20,borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,background:T.lilacBg,color:T.lilac,flexShrink:0}}>R</span>
            <span style={{fontSize:12,fontWeight:600}}>Resumen</span>
          </button>}
        </nav>
      </aside>

      <div ref={mainRef} style={{flex:1,minWidth:0,height:"100vh",overflowY:"auto",overflowX:"hidden",display:"flex",flexDirection:"column"}}>
        <header style={{padding:"10px 24px",borderBottom:`1px solid ${T.border}`,background:T.bg1,position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:10,boxSizing:"border-box",width:"100%"}}>
          {view.page!=="home"&&<Btn variant="ghost" size="sm" onClick={view.page==="quiz"?()=>goMod(mi):goHome} style={{padding:"4px 8px",fontSize:14}}>←</Btn>}
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            {crumbs.map((c,i)=><span key={i} style={{display:"flex",alignItems:"center",gap:6}}>
              {i>0&&<span style={{color:T.t4,fontSize:11}}>›</span>}
              {c.action?<button onClick={c.action} style={{background:"none",border:"none",color:i===crumbs.length-1?T.t1:T.t4,cursor:"pointer",fontSize:12,fontFamily:"inherit",padding:0,fontWeight:i===crumbs.length-1?600:400}}>{c.label}</button>:<span style={{fontSize:12,color:T.t1,fontWeight:600}}>{c.label}</span>}
            </span>)}
          </div>
        </header>
        <div style={{width:"100%",maxWidth:900,padding:"28px 32px",boxSizing:"border-box",textAlign:"left"}}>
          {view.page==="home"&&<HomeView modules={M} progress={progress} quizScores={qs} onMod={goMod} onFinal={goFinal} onSummary={goSummary} finalUnlocked={finalOk} finalDone={finalDone}/>}
          {view.page==="module"&&les&&<><div style={{marginBottom:20}}><P>{mod.desc}</P></div><div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:22}}>{mod.lessons.map((l,i)=><Pill key={i} active={li===i} done={progress[`${mod.id}-${i}`]} onClick={()=>{setLi(i);scroll();}}>{i+1}. {l.title.length>24?l.title.slice(0,24)+"…":l.title}</Pill>)}<Pill active={false} done={qs[mod.id]>=T.MIN_PASS} onClick={goQuiz}>Quiz</Pill></div><LessonView lesson={les} onComplete={compLes} isComplete={progress[`${mod.id}-${li}`]}/></>}
          {view.page==="quiz"&&<QuizView quiz={mod.quiz} onComplete={compQuiz} onExit={()=>goMod(mi)} existingScore={qs[mod.id]}/>}
          {view.page==="final"&&(finalOk?<FinalView exam={FE} onBack={goHome} onSubmitFinal={compFinal}/>:<Section><P style={{textAlign:"center",color:T.t4,padding:30}}>Completa todos los quizzes para desbloquear.</P></Section>)}
          {view.page==="summary"&&<SummaryView modules={M} quizScores={qs} onBack={goHome}/>}
        </div>
      </div>
    </div>);
}
