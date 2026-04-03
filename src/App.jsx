import { useState, useCallback, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════ */
const T = {
  bg: "#080C14", bg1: "#0F1520", bg2: "#161D2E", bg3: "#1E2740",
  border: "#1C2538", borderL: "#2A3550",
  accent: "#6366F1", accentL: "#818CF8", accentBg: "#6366F115",
  green: "#10B981", greenBg: "#10B98112", red: "#EF4444", redBg: "#EF444412",
  amber: "#F59E0B", amberBg: "#F59E0B12",
  t1: "#F1F5F9", t2: "#CBD5E1", t3: "#94A3B8", t4: "#64748B",
};

/* ═══════════════════════════════════════════
   BASE COMPONENTS
   ═══════════════════════════════════════════ */
const Section = ({ title, badge, badgeColor, children, style, border }) => (
  <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderLeft: border ? `3px solid ${border}` : undefined, borderRadius: 10, padding: "20px 22px", boxSizing: "border-box", ...style }}>
    {(badge || title) && (
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        {badge && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: `${badgeColor || T.accent}15`, color: badgeColor || T.accent, letterSpacing: 0.5, textTransform: "uppercase" }}>{badge}</span>}
        {title && <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.t1, textAlign: "left" }}>{title}</h3>}
      </div>
    )}
    {children}
  </div>
);

const P = ({ children, style }) => (
  <p style={{ fontSize: 14, lineHeight: 1.85, color: T.t2, margin: "0 0 12px", textAlign: "left", ...style }}>{children}</p>
);

const BulletList = ({ items }) => (
  <ul style={{ margin: "8px 0 14px", paddingLeft: 20, textAlign: "left" }}>
    {items.map((item, i) => (
      <li key={i} style={{ fontSize: 14, lineHeight: 1.85, color: T.t2, marginBottom: 6 }}>{item}</li>
    ))}
  </ul>
);

const Btn = ({ children, variant = "primary", size = "md", style, ...p }) => {
  const sz = size === "sm" ? { padding: "6px 14px", fontSize: 12 } : { padding: "10px 20px", fontSize: 13 };
  const v = variant === "primary" ? { background: T.accent, color: "#fff", border: "none" }
    : variant === "ghost" ? { background: "transparent", color: T.t3, border: "none" }
    : { background: "transparent", border: `1px solid ${T.borderL}`, color: T.t3 };
  return <button style={{ borderRadius: 7, cursor: "pointer", fontWeight: 600, fontFamily: "inherit", ...sz, ...v, ...style }} {...p}>{children}</button>;
};

const Pill = ({ children, active, done, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", whiteSpace: "nowrap",
    border: `1px solid ${active ? T.accent : done ? T.green : T.border}`,
    background: active ? T.accentBg : "transparent",
    color: active ? T.accentL : done ? T.green : T.t4,
  }}>{done && "✓ "}{children}</button>
);

const Highlight = ({ children }) => (
  <div style={{ padding: "12px 16px", background: T.amberBg, borderLeft: `3px solid ${T.amber}`, borderRadius: 6, marginTop: 8 }}>
    <P style={{ margin: 0, color: T.t1, fontWeight: 500 }}>{children}</P>
  </div>
);

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const MODULES = [
  {
    id: "m1", title: "Fundamentos del Testing",
    desc: "Qué es el testing, por qué existe, tipos, STLC/SDLC y el rol real del tester en la industria.",
    lessons: [
      {
        id: "m1l1", title: "Qué es el Testing y por qué existe",
        intro: "El testing no es \"verificar que funcione\". Es una disciplina de ingeniería cuyo objetivo es reducir el riesgo de fallos en producción que impacten al negocio, a los usuarios o a la reputación de la empresa.",
        sections: [
          {
            title: "El costo exponencial de los bugs",
            paragraphs: ["Un bug encontrado en requisitos cuesta x1. En desarrollo cuesta x10. En QA cuesta x100. En producción cuesta x1000. Esta progresión no es teórica — está respaldada por décadas de datos de la industria."],
            bullets: ["Knight Capital perdió $440M en 45 minutos por un bug en su sistema de trading automatizado", "Facebook expuso 50 millones de tokens de acceso por un error de autenticación en 2018", "No son errores de \"malos desarrolladores\" — son fallos sistémicos donde el testing fue insuficiente"]
          },
          {
            title: "Por qué los humanos producen bugs",
            paragraphs: ["Los errores de software no son accidentes aleatorios. Son consecuencia de sesgos cognitivos predecibles:"],
            bullets: ["Sesgo de confirmación: el developer prueba que SU código funciona, no que falle", "Efecto de anclaje: si algo funcionó ayer, asumimos que funciona hoy", "Complejidad combinatoria: una app con 20 campos de 10 opciones tiene 10²⁰ combinaciones posibles", "Nadie puede probar todo — necesitas ESTRATEGIA, no fuerza bruta"]
          },
          {
            title: "Tu verdadero trabajo",
            paragraphs: ["No buscas bugs. Buscas RIESGO. Tu trabajo es responder una pregunta fundamental:"],
            highlight: "¿Qué tan confiados estamos en que este software hace lo que debe, no hace lo que no debe, y sobrevive condiciones adversas?"
          }
        ],
        senior: "En Big Tech, el QA no es un gate al final del proceso. Es un multiplicador de calidad que opera desde el diseño del requisito hasta el monitoreo en producción. Si esperas al código para empezar a testear, llegaste tarde.",
        exercise: {
          title: "Análisis de Riesgo Real",
          scenario: "Eres el QA Lead asignado al checkout de un e-commerce que procesa $2M diarios. El equipo quiere lanzar \"Compra con un click\" (similar a Amazon 1-Click).",
          task: "Identifica los 5 riesgos más críticos que testearías ANTES de producción. Para cada uno define: qué podría salir mal, impacto al negocio, y cómo lo testearías. NO pienses en \"casos de prueba\". Piensa en RIESGO.",
          solution: ["Doble cobro por click múltiple — Chargebacks masivos, pérdida de confianza. Test: simular clicks rápidos, verificar idempotencia del endpoint de pago.", "Race condition en inventario — Vender producto agotado. Test: 100 usuarios simultáneos comprando el último ítem, verificar que solo 1 transacción se complete.", "Método de pago expirado — Orden creada sin cobro. Test: tarjetas expiradas, fondos insuficientes, tarjetas bloqueadas.", "Dirección de envío incorrecta por defecto — Re-envíos costosos. Test: múltiples direcciones, dirección default eliminada, dirección incompleta.", "Fallo parcial en el flujo — Cobro sin orden o viceversa. Test: timeout del servicio de inventario post-cobro, verificar mecanismo de rollback."]
        }
      },
      {
        id: "m1l2", title: "Tipos de Testing — Taxonomía Real",
        intro: "Cada tipo de testing existe por una razón específica. Si no sabes cuándo usar cada uno, desperdicias tiempo y recursos — o peor, dejas huecos de cobertura.",
        sections: [
          { title: "Por nivel de ejecución", bullets: ["Unit Testing — Lo hace el developer. Verifica una función aislada. Si un tester escribe unit tests, algo está mal en el proceso.", "Integration Testing — Tu territorio. Verificas que componentes hablan correctamente entre sí. ¿Qué pasa si el campo \"email\" viene null?", "E2E (End-to-End) — Flujo completo como usuario real. El más costoso y frágil. Úsalo solo para happy paths críticos."] },
          { title: "Por propósito", bullets: ["Smoke Testing — \"¿La app enciende?\" Funcionalidades críticas en menos de 15 minutos. Si tu smoke tarda 2 horas, no es smoke.", "Regression Testing — Lo que funcionaba SIGUE funcionando. El 70% de bugs en producción son regresiones.", "Sanity Testing — Subset enfocado de regression. \"Cambiamos pagos, verificamos solo pagos a profundidad.\"", "Exploratory Testing — Testing CON charter, no clickear sin rumbo. \"En 30 min, exploro registro con datos extremos en campos opcionales.\""] },
          { title: "La pirámide de testing", paragraphs: ["La distribución ideal de tests automatizados:"], bullets: ["70% unit tests (rápidos, aislados, baratos)", "20% integration tests (verifican contratos entre componentes)", "10% E2E tests (solo happy paths críticos del negocio)"], highlight: "Si tu suite E2E tiene 500 tests y tu integration tiene 50, tu arquitectura de testing está invertida y vas a sufrir con tests lentos y frágiles." }
        ],
        senior: "Un tester que dice \"voy a hacer exploratory testing\" sin charter definido no está haciendo exploratory — está clickeando sin dirección. Siempre define: qué área, qué tipo de datos, cuánto tiempo, qué documentas.",
        exercise: { title: "Decide el Tipo de Testing", scenario: "Para cada escenario, decide qué tipo(s) de testing aplicarías y justifica tu decisión.", task: "1. Se cambió el color de un botón de \"Comprar\" de azul a verde.\n2. Se migró la DB de MySQL a PostgreSQL sin cambiar la API.\n3. Es viernes 4pm, hay un hotfix para un bug crítico en producción.\n4. El PM dice \"quiero asegurarme de que el checkout funciona bien en general\".", solution: ["Cambio de color — Visual regression test. Verificar que el click handler no se rompió.", "Migración de DB — Integration testing extenso. Cada query debe retornar los mismos resultados.", "Hotfix viernes — Smoke testing SOLAMENTE del fix y área afectada. Deploy con monitoreo.", "\"Funciona bien\" — NO es testeable. Preguntar: \"¿Qué significa bien? ¿Qué cambió?\""] }
      },
      {
        id: "m1l3", title: "STLC, SDLC y tu Rol Real",
        intro: "El error más común de un tester junior: esperar a que development termine para empezar a testear. En Big Tech, si esperas al código, llegaste tarde.",
        sections: [
          { title: "STLC — Las 6 fases", bullets: ["Análisis de Requisitos — Encontrar ambigüedades y gaps ANTES de que se escriba código.", "Planificación — Qué testeas, qué NO testeas, herramientas, tiempo, criterios.", "Diseño de Casos — Técnicas formales para derivar tests. No improvisación.", "Configuración del Ambiente — Datos de prueba, staging, mocks.", "Ejecución — Correr tests, documentar resultados, reportar bugs.", "Cierre — Métricas, lecciones aprendidas, qué se escapó y por qué."] },
          { title: "En la práctica Agile", paragraphs: ["Todo esto ocurre dentro de un sprint de 2 semanas. El tester participa en refinement, estima esfuerzo, hace shift-left y shift-right."], highlight: "No eres un paso en el proceso. Eres un participante continuo." },
          { title: "Tu influencia real", paragraphs: ["En Google, los SDET tienen la misma voz que los SWE. Pueden bloquear un release si la calidad no cumple el estándar. Esa autoridad se gana con CRITERIO, no con título."] }
        ],
        senior: "Shift-left significa que tus preguntas en el refinement evitan más bugs que tus tests en el sprint. Una sola pregunta sobre un edge case puede ahorrar 3 días de desarrollo.",
        exercise: { title: "Shift-Left en Acción", scenario: "User story: resetear contraseña. Criterios: email con link, expira en 24h, cumplir políticas de seguridad.", task: "ANTES de que se escriba código, identifica al menos 8 preguntas o ambigüedades que deberías escalar.", solution: ["¿Múltiples resets invalidan links anteriores?", "\"Políticas de seguridad\" — ¿cuáles exactamente?", "¿Rate limiting? ¿Cuántos intentos por hora?", "Si el email NO existe, ¿qué mensaje? (enumeración de usuarios)", "¿Link de un solo uso o múltiples dentro de 24h?", "¿Qué pasa si cambia su email después de solicitar reset?", "¿Se cierra sesión en todos los dispositivos?", "¿Notificación de cambio de contraseña?", "¿Proxies enterprise que hacen prefetch invalidan el token?", "¿Interacción con 2FA?"] }
      }
    ],
    quiz: [
      { q: "Un bug en requisitos cuesta x1. ¿En producción?", o: ["x10", "x100", "x1000", "x50"], a: 2 },
      { q: "Distribución correcta de la pirámide de testing:", o: ["70% E2E, 20% Integration, 10% Unit", "70% Unit, 20% Integration, 10% E2E", "33% cada uno", "50% Integration, 30% Unit, 20% E2E"], a: 1 },
      { q: "Exploratory testing sin charter es:", o: ["Testing creativo", "Clickear sin dirección", "Testing ágil válido", "Ad-hoc aceptable"], a: 1 },
      { q: "¿Qué es shift-left?", o: ["Testear más rápido", "Involucrar testing desde fases tempranas", "Mover tests a la izquierda del dashboard", "Automatizar antes de diseñar"], a: 1 },
      { q: "PM dice \"que funcione bien\". Tu respuesta:", o: ["Testear todo", "Preguntar qué significa \"bien\", qué preocupa", "No es tu responsabilidad", "Smoke test estándar"], a: 1 },
      { q: "70% de bugs en producción son:", o: ["Bugs nuevos", "Regresiones", "Performance", "UI"], a: 1 },
    ]
  },
  {
    id: "m2", title: "Diseño de Pruebas",
    desc: "Técnicas formales: partición de equivalencia, valores límite, tablas de decisión, state transition y RTM.",
    lessons: [
      {
        id: "m2l1", title: "Partición de Equivalencia y Valores Límite",
        intro: "Estas dos técnicas generan el mayor valor por esfuerzo invertido. Reducen miles de combinaciones a un conjunto manejable y efectivo.",
        sections: [
          { title: "Partición de Equivalencia (EP)", paragraphs: ["Divide el dominio de entrada en clases donde todos los valores se comportan igual. Testeas UN valor por clase."], bullets: ["Ejemplo — Campo \"edad\" para seguro:", "Inválida: < 18 | Válida 1: 18-25 | Válida 2: 26-65 | Válida 3: 66-99 | Inválida: > 99", "También inválido: no numérico, negativo, decimal", "Con 7 tests cubres un dominio de miles de valores"] },
          { title: "Análisis de Valores Límite (BVA)", paragraphs: ["Los bugs viven en los bordes. SIEMPRE. Si el rango es 18-65:"], bullets: ["Testeas: 17, 18, 19, 64, 65, 66", "Monto ($1 min, $10K max): $0.99, $1.00, $1.01, $9999.99, $10000.00, $10000.01"], highlight: "Testear $5,000 porque \"es intermedio\" no encuentra NADA que no encuentre $1.01." }
        ],
        senior: "Cuando un dev dice \"ya probé con datos normales\", tu pregunta: \"¿Probaste en los límites?\" El 80% de bugs de validación están en los bordes.",
        exercise: { title: "Diseña Tests con EP y BVA", scenario: "Formulario de registro de streaming.", task: "Campos: Username 3-20 chars alfanumérico, Contraseña 8-64 chars con mayúscula+número+especial, Fecha nacimiento > 13 años, Código postal 5 dígitos.\n\nPara CADA campo: clases de equivalencia, valores límite, mínimo 3 casos. Bonus: interacciones entre campos.", solution: ["Username — Válida: \"user123\". Inválidas: \"ab\", \"user name\", \"user@!\". BVA: 2(inv), 3(mín), 20(máx), 21(inv).", "Contraseña — Inválidas: sin mayúscula, sin número, sin especial, 7 chars. BVA: 7(inv), 8(mín), 64(máx), 65(inv).", "Fecha — BVA: exactamente 13 años hoy, 12 años 364 días. ¿Qué timezone?", "Interacciones: ¿username dentro de contraseña? ¿exactamente 13 años en qué timezone?"] }
      },
      {
        id: "m2l2", title: "Tablas de Decisión y State Transition",
        intro: "Cuando el comportamiento depende de combinaciones de condiciones o estados del sistema, necesitas técnicas sistemáticas.",
        sections: [
          { title: "Tablas de Decisión", paragraphs: ["Mapean todas las combinaciones y su resultado."], bullets: ["Ejemplo — Envío gratis: ¿Prime? ¿> $50? ¿Elegible?", "2³ = 8 combinaciones, cada una es un caso de prueba", "Sin la tabla, te pierdes combinaciones garantizado"] },
          { title: "State Transition Testing", paragraphs: ["Para sistemas con estados definidos."], bullets: ["Pedido: Pending → Paid → Processing → Shipped → Delivered", "También: Pending → Cancelled, Paid → Refunded", "Lo CRÍTICO: testear transiciones INVÁLIDAS. ¿Delivered → Pending?"], highlight: "Los state machines están en todas partes: usuarios, pagos, deployments, feature flags." }
        ],
        senior: "Tablas de decisión son tu arma en refinements. PM dice \"si es premium Y > $100, envío gratis\". Tú: \"¿Y las otras 6 combinaciones?\"",
        exercise: { title: "State Transition de Cuenta Financiera", scenario: "Plataforma tipo PayPal.", task: "Estados: Pending Verification, Active, Suspended, Locked, Closed, Banned.\n\nDefine: 1) Transiciones válidas 2) 5 inválidas que DEBES rechazar 3) Qué pasa con el saldo en cada transición.", solution: ["Válidas: Pending→Active (KYC), Active→Suspended, Active→Locked, Active→Closed, Suspended→Active, Suspended→Banned, Locked→Active.", "Inválidas: Banned→Active (NUNCA), Closed→Active (nuevo registro), Pending→Suspended, Banned→Closed.", "Saldo: Suspended=congelado, Closed=debe ser $0, Banned=retenido para legal."] }
      },
      {
        id: "m2l3", title: "Casos de Prueba Profesionales y RTM",
        intro: "Un caso de prueba mal escrito es un caso que no puede ejecutar nadie más que tú.",
        sections: [
          { title: "Anatomía de un caso profesional", bullets: ["ID y título: TC-LOGIN-001 — Login exitoso con credenciales válidas", "Precondiciones: usuario registrado con datos específicos", "Ambiente: Chrome 120+, staging", "Pasos: numerados, exactos, con datos concretos", "Resultado esperado: redirect a /dashboard en <3s", "Prioridad y trazabilidad: P0, REQ-AUTH-001"], highlight: "Cualquier persona debe poder ejecutarlo y obtener el MISMO resultado." },
          { title: "RTM", paragraphs: ["Tabla: Requisito → Caso(s) → Estado → Bugs."], bullets: ["Requisito sin casos = NO CUBIERTO", "Caso sin requisito = test huérfano", "Se mantiene viva cada sprint"] }
        ],
        senior: "En Amazon, cada test tiene un \"blast radius\": si falla, ¿cuántos usuarios y cuánto revenue afecta?",
        exercise: { title: "Escribe Casos Profesionales", scenario: "Carrito con código de descuento.", task: "Reglas: 1 código por orden, SAVE10=10%, FLAT20=$20 si >$100, códigos expiran, no aplica a Clearance, envío no se descuenta.\n\nEscribe 8 casos completos. Mínimo 2 negativos y 1 interacción.", solution: ["TC-001: SAVE10 en $200 regular → $180.", "TC-002: FLAT20 en $150 → $130.", "TC-003 (neg): FLAT20 en $80 → rechazado.", "TC-004 (neg): Código expirado → rechazado.", "TC-005: Dos códigos → segundo rechazado.", "TC-006 (interacción): SAVE10 en mixto (regular $100 + clearance $50) → descuento solo $100.", "TC-007: Envío $9.99 NO se descuenta.", "TC-008: SAVE10, eliminar items hasta $0 → recalcula."] }
      }
    ],
    quiz: [
      { q: "En EP, ¿cuántos valores por clase?", o: ["Todos", "Uno representativo", "Tres", "Depende"], a: 1 },
      { q: "¿Dónde están los bugs de validación?", o: ["Valores intermedios", "Bordes/límites", "Nulos", "Negativos"], a: 1 },
      { q: "4 condiciones binarias = ¿cuántas combinaciones?", o: ["4", "8", "16", "32"], a: 2 },
      { q: "En State Transition, lo MÁS importante:", o: ["Transiciones válidas", "Transiciones INVÁLIDAS", "Estado inicial/final", "Frecuentes"], a: 1 },
      { q: "\"Verificar que login funciona\" es:", o: ["Aceptable", "Insuficiente", "Válido", "Buen caso alto nivel"], a: 1 },
    ]
  },
  {
    id: "m3", title: "Bugs y Gestión de Calidad",
    desc: "Documentación profesional, severidad vs prioridad con criterio real, y priorización.",
    lessons: [
      {
        id: "m3l1", title: "Documentación de Bugs",
        intro: "Un bug mal documentado es un bug que no se arregla. Tu reporte es tu credibilidad profesional.",
        sections: [
          { title: "Estructura profesional", bullets: ["Título buscable: \"Login returns 500 when email contains + character\"", "Ambiente: OS, browser, API version, staging/prod", "Pasos exactos, numerados, con DATOS ESPECÍFICOS", "Resultado actual con evidencia (screenshot, logs, HTTP response)", "Resultado esperado según spec", "Frecuencia: siempre / intermitente / una vez", "Impacto: usuarios afectados, impacto al negocio"] },
          { title: "Severidad vs Prioridad", paragraphs: ["Son dimensiones DIFERENTES:"], bullets: ["Severidad = impacto TÉCNICO (Critical → High → Medium → Low)", "Prioridad = urgencia de NEGOCIO (P0 hotfix → P1 sprint → P2 → P3)", "Typo en nombre del CEO = sev LOW, prioridad P0", "Crash en 0.1% de usuarios = sev CRITICAL, puede ser P2"], highlight: "El tester asigna severidad. El PO/PM asigna prioridad." }
        ],
        senior: "Un bug report excelente incluye hipótesis: \"Posiblemente el endpoint no sanitiza el carácter +.\" Acelera el fix y demuestra comprensión.",
        exercise: { title: "Documenta Este Bug", scenario: "App de delivery: pedido $45.50, cupón WELCOME50 (50% off), cobro correcto $22.75, email correcto.", task: "PERO: historial de pedidos muestra $45.50 (sin descuento).\n\nEscribe bug report completo. Severidad y prioridad con justificación.", solution: ["Título: Order history displays pre-discount amount after WELCOME50 coupon", "Severidad: Medium — no hay pérdida financiera, genera confusión", "Prioridad: P1 — nuevos usuarios ven discrepancia, afecta retention", "Hipótesis: Order history lee subtotal pre-descuento de la tabla"] }
      },
      {
        id: "m3l2", title: "Criterio para Clasificar Bugs",
        intro: "La diferencia entre junior y senior no es encontrar más bugs — es clasificarlos correctamente.",
        sections: [
          { title: "Red flags: siempre P0", bullets: ["Bug que involucre dinero (doble cobro)", "Exposición de datos de otro usuario", "Bypass de autenticación/autorización", "Pérdida de datos irrecuperable", "Bloqueo del flujo principal para >5% de usuarios"], highlight: "Si encuentras alguno, no esperes al standup. Escala INMEDIATAMENTE." },
          { title: "Framework de priorización", paragraphs: ["Cruza severidad con factores de negocio:"], bullets: ["¿Cuántos usuarios afectados?", "¿Hay workaround?", "¿Es regresión?", "¿Puede empeorar?", "¿One-way door (irreversible) o two-way door?"] }
        ],
        senior: "Amazon: one-way door vs two-way door. Pérdida de datos = one-way, SIEMPRE P0.",
        exercise: { title: "Clasifica y Prioriza", scenario: "6 bugs, capacidad para 3.", task: "1. Crash en foto perfil (iPhone 12/iOS 17)\n2. Botón \"Cancelar suscripción\" no funciona\n3. Emails con 30 min de delay\n4. Dashboard admin muestra ayer\n5. Memory leak tras 4h\n6. Filtro precio en orden incorrecto\n\nElige 3 y justifica.", solution: ["#2 (P0 — posible violación legal UE/California)", "#1 (P1 — crash visible, dispositivo común)", "#3 (P1 — emails tardíos causan ansiedad y tickets)", "Próximo: #5, #4, #6"] }
      }
    ],
    quiz: [
      { q: "Typo en nombre del CEO en landing:", o: ["Sev HIGH, P0", "Sev LOW, P0", "Sev LOW, P3", "Sev MED, P1"], a: 1 },
      { q: "¿Quién asigna prioridad?", o: ["Tester", "Developer", "Product Owner/PM", "QA Lead"], a: 2 },
      { q: "Endpoint devuelve datos de OTRO usuario:", o: ["Sev Med, P2", "Sev Critical, P0", "Sev Low", "Sev High, P1"], a: 1 },
      { q: "Crash que afecta 0.1% de usuarios:", o: ["Sev Low", "Sev Critical", "Sev Medium", "No es bug"], a: 1 },
    ]
  },
  {
    id: "m4", title: "Herramientas del Tester",
    desc: "Jira avanzado, Postman para API testing, SQL para investigación, Git básico.",
    lessons: [
      {
        id: "m4l1", title: "Jira, Postman, SQL y Git",
        intro: "No basta con saber que existen. Necesitas dominar los patrones que te hacen productivo.",
        sections: [
          { title: "Jira avanzado", bullets: ["Dashboards: bugs por severidad, por módulo, velocity de fix", "JQL: project = CHECKOUT AND type = Bug AND severity = Critical AND created >= -30d", "Workflows: Open → In Progress → In Review → Verified → Closed", "Trazabilidad: bugs ↔ test cases ↔ stories"] },
          { title: "API Testing con Postman", paragraphs: ["El 80% del testing crítico es a nivel de API."], bullets: ["Requests GET/POST/PUT/DELETE con datos reales", "Variables de ambiente (staging vs prod)", "Tests automatizados en tab Tests", "Collections: register → login → create order → verify", "Pre-request scripts para datos dinámicos"] },
          { title: "SQL para investigación", bullets: ["SELECT * FROM orders WHERE user_id = 123 AND status = 'pending';", "SELECT o.id, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.total != o.subtotal - o.discount;", "La segunda query encuentra inconsistencias invisibles desde la UI"] },
          { title: "Git básico", paragraphs: ["Mínimo: clone, pull, branch, checkout, log, diff."], highlight: "git diff te muestra qué cambió para enfocar regression." }
        ],
        senior: "Un tester que solo usa la UI es un tester a medias. El 50% de bugs están en la capa de datos.",
        exercise: { title: "Investigación con SQL", scenario: "Tablas: users, orders, payments. Reportan: \"Premium sin descuento del 15%.\"", task: "Escribe queries para:\n1. Órdenes Premium sin descuento correcto\n2. Cobro vs final_amount\n3. Desde cuándo empezó", solution: ["SELECT o.id, u.email, o.total, o.discount, ROUND(o.total*0.15,2) AS expected FROM orders o JOIN users u ON o.user_id=u.id WHERE u.plan_type='premium' AND o.discount != ROUND(o.total*0.15,2);", "SELECT o.id, o.final_amount, p.amount FROM orders o JOIN payments p ON p.order_id=o.id WHERE o.final_amount != p.amount;", "SELECT MIN(o.created_at) FROM orders o JOIN users u ON o.user_id=u.id WHERE u.plan_type='premium' AND o.discount != ROUND(o.total*0.15,2);"] }
      }
    ],
    quiz: [
      { q: "¿% de testing crítico a nivel API?", o: ["30%", "50%", "80%", "95%"], a: 2 },
      { q: "JQL sirve para:", o: ["Tests automatizados", "Queries de tickets", "Conectar DB", "Reportes código"], a: 1 },
      { q: "¿SQL para tester?", o: ["Crear tablas", "Verificar datos invisibles en UI", "Optimizar queries", "Solo sin dev"], a: 1 },
    ]
  },
  {
    id: "m5", title: "Automatización",
    desc: "Estrategia, cuándo sí y cuándo no, Playwright, CI/CD.",
    lessons: [
      {
        id: "m5l1", title: "Estrategia de Automatización",
        intro: "La automatización no es un objetivo — es una herramienta. Automatizar todo sin estrategia es el anti-patrón más costoso.",
        sections: [
          { title: "Cuándo SÍ", bullets: ["Lo que ejecutas >3 veces y es estable", "Smoke en cada build", "Regression de flujos core", "Validaciones de API", "Data validation contra DB"] },
          { title: "Cuándo NO", bullets: ["Exploratory testing", "Tests que cambian cada sprint", "UX/usabilidad", "Features inestables", "Validaciones one-time"] },
          { title: "El anti-patrón", paragraphs: ["Equipos que automatizan todo:"], bullets: ["Suite de 4 horas", "30% tests flaky", "Más tiempo manteniendo que testeando"], highlight: "Distribución: 70% API/integration, 20% componente, 10% E2E." }
        ],
        senior: "En Meta, test flaky que falla 2 veces sin ser bug real se desactiva automáticamente. Un flaky es PEOR que no tener test.",
        exercise: { title: "Decide Qué Automatizar", scenario: "App de gestión de proyectos, 20 tests de capacidad.", task: "Candidatos: 1.Login 2.SSO 3.Crear proyecto 4.Drag&drop 5.Invitar 6.Filtrar 7.Archivos 8.Notificaciones RT 9.CSV 10.Theme 11.API CRUD 12.API Permisos 13.Rate limit 14.Flujo E2E\n\n¿Cuáles?", solution: ["Top: #1, #11, #12, #3, #14, #6, #13", "NO: #4 (frágil), #8 (flaky), #10 (bajo valor), #2 (mocks complejos)", "API tests > E2E por estabilidad"] }
      },
      {
        id: "m5l2", title: "Playwright y CI/CD",
        intro: "Playwright: múltiples browsers, auto-wait, network interception.",
        sections: [
          { title: "Estructura profesional", bullets: ["Usar data-testid, NUNCA selectores CSS frágiles", "Assertions explícitas: expect(page).toHaveURL('/dashboard')", "Datos independientes por test", "Tests paralelos sin dependencias"] },
          { title: "Buenas prácticas", bullets: ["Page Object Model: 1 archivo vs 47 tests", "Screenshots y traces en fallo", "Retry máximo 1", "Reportes claros"] },
          { title: "CI/CD", paragraphs: ["Tests en cada PR, merge bloqueado si falla."], highlight: "Test flaky que bloquea deploys = problema de TU equipo." }
        ],
        senior: "Page Object Model no es opcional. Sin él, cambias 47 tests. Con él, 1 archivo.",
        exercise: { title: "Escribe Tests", scenario: "E-commerce: buscar, agregar al carrito, verificar.", task: "Playwright para: buscar producto, cantidad 2, agregar al carrito, verificar total. Incluir caso negativo (agotado).", solution: ["test('add to cart', async({page})=> { page.goto('/products'); page.fill('[data-testid=\"search\"]','Mouse'); ... });", "selectOption qty='2', verificar precio * 2", "test('out of stock') => expect add-to-cart toBeDisabled()"] }
      }
    ],
    quiz: [
      { q: "Anti-patrón más costoso:", o: ["No automatizar", "Automatizar TODO", "Usar Selenium", "Sin CI/CD"], a: 1 },
      { q: "Test flaky es peor porque:", o: ["Lento", "Fatiga de alertas, nadie confía", "Consume recursos", "Difícil debug"], a: 1 },
      { q: "¿data-testid sobre CSS?", o: ["Más rápido", "Estable ante cambios de diseño", "Requerido", "Accesibilidad"], a: 1 },
      { q: "Page Object Model:", o: ["Performance", "Centralizar selectores", "Conectar DB", "Reportes"], a: 1 },
    ]
  },
  {
    id: "m6", title: "Testing Avanzado",
    desc: "Performance, seguridad, microservicios, contract testing, chaos engineering.",
    lessons: [
      {
        id: "m6l1", title: "Performance, Seguridad y Microservicios",
        intro: "Testing funcional es el punto de partida. Los fallos más costosos son de performance, seguridad e integración.",
        sections: [
          { title: "Performance Testing", bullets: ["Load: ¿soporta 1000 simultáneos?", "Stress: ¿cuándo se rompe?", "Soak: ¿se degrada en 24h?", "Spike: ¿sobrevive Black Friday?"], paragraphs: ["Herramientas: k6, JMeter, Gatling. Métricas: p50, p95, p99, RPS, error rate."], highlight: "Si p50=200ms pero p99=5s, con 10M usuarios = 100K con experiencia terrible." },
          { title: "Security básico (OWASP)", bullets: ["Injection: XSS en campos de texto", "Broken Auth: acceso sin login, tokens", "IDOR: cambiar ID en URL = datos de otro", "CSRF: acciones sin consentimiento"] },
          { title: "Microservicios", bullets: ["Contract Testing (Pact): si cambia el schema, se rompe ANTES del deploy", "Chaos Engineering: ¿qué pasa si pagos tiene 5s latencia?", "Distributed Tracing: Jaeger, Zipkin"] }
        ],
        senior: "Netflix Chaos Monkey apaga servidores en producción. La resiliencia no se asume — se prueba.",
        exercise: { title: "Plan para Microservicios", scenario: "Ride-sharing: User, Ride, Payment, Notification, Pricing. Pricing actualizado con surge.", task: "1) Tests por servicio 2) Contract tests 3) Chaos engineering 4) Consistencia de precio", solution: ["1. Pricing: unit tests lógica nueva. Ride: regression + nuevo schema. Payment: regression.", "2. Contracts: Pricing↔Ride, Pricing↔Payment, Ride↔Notification.", "3. Chaos: Pricing 10s latencia. ¿Timeout? ¿Fallback?", "4. Tracing: precio mostrado = cobrado = recibo."] }
      }
    ],
    quiz: [
      { q: "Métrica de latencia más importante:", o: ["p50", "p95", "p99", "Promedio"], a: 2 },
      { q: "IDOR permite:", o: ["SQL injection", "Datos de otro usuario", "XSS", "Suplantar sesión"], a: 1 },
      { q: "Contract Testing verifica:", o: ["Velocidad", "Formato de datos acordado", "Réplicas", "Deploy exitoso"], a: 1 },
    ]
  },
  {
    id: "m7", title: "Metodologías Ágiles para QA",
    desc: "Scrum aplicado, ceremonias, Definition of Done, anti-patrones.",
    lessons: [
      {
        id: "m7l1", title: "Scrum Aplicado",
        intro: "Scrum no es teoría. Es cómo trabajan los equipos que entregan cada 2 semanas. Tu participación define la calidad.",
        sections: [
          { title: "El sprint para un tester", paragraphs: ["Sprint = 2 semanas. NO esperas a que dev termine."], bullets: ["Mientras devs hacen Story A, testeas Story B", "Y preparas tests de Story C", "Velocidad = stories que pasan DONE (con testing)"] },
          { title: "Ceremonias", bullets: ["Planning: estimas testing, cuestionas stories", "Daily: bloqueos, avance, bugs — 15 segundos", "Review: calidad, no solo feature", "Retro: mejoras al proceso"] },
          { title: "Definition of Done", bullets: ["Code complete + reviewed", "Unit tests pasan", "Testing funcional completado", "Bugs críticos resueltos", "Regression ok", "Docs actualizados"], highlight: "Si marcan Done antes del testing, problema sistémico." }
        ],
        senior: "El tester que más valor agrega previene bugs en planning, no los que encuentra en ejecución.",
        exercise: { title: "Simulación de Sprint", scenario: "2 semanas, 3 devs, 1 tester, 5 stories.", task: "Día 3: Story 1 en review, Story 2 en dev.\nDía 5: Story 1 tiene 2 bugs. Story 2 a testing.\nDía 8: Bug High abierto. Stories 3-4 llegan.\nDía 9: PM: \"¿entregamos las 5?\"\n\nQué haces cada día.", solution: ["Día 3: Preparo tests Story 2, reviso specs 3-5.", "Día 5: Testeo Story 2, flag Bug-High.", "Día 8: Escalo Bug-High. Testeo 3-4 en critical paths.", "Día 9: \"Realísticamente 3-4. Story 5 al próximo sprint.\""] }
      },
      {
        id: "m7l2", title: "Anti-patrones QA en Agile",
        intro: "Estos errores destruyen la efectividad del tester en equipos ágiles.",
        sections: [
          { title: "QA Pasivo", paragraphs: ["Solo ejecuta lo asignado. No cuestiona, no propone."], highlight: "En Big Tech no sobrevive. Tu voz vale tanto como la del developer." },
          { title: "QA Tardío", paragraphs: ["Dev termina jueves, QA viernes. 1 día para 5 stories."], bullets: ["Solución: testing paralelo al desarrollo."] },
          { title: "QA Policía", paragraphs: ["Bloquea todo por bugs cosméticos."], bullets: ["Solución: criterio. No todo bloquea."] },
          { title: "QA Aislado", paragraphs: ["No hace pair testing, no comparte strategy."], bullets: ["Solución: pair testing, comunicar strategy en planning."] }
        ],
        senior: "Mejor indicador: los devs dicen \"Quiero que revises mi story ANTES de codear.\"",
        exercise: { title: "Identifica Anti-patrones", scenario: "5 situaciones.", task: "1. Tester mudo en planning, se queja después.\n2. Rechaza release por typo en tooltip.\n3. Último día: 4 stories a testing.\n4. Nunca habla con devs.\n5. \"No sé cuánto tarda el testing.\"", solution: ["1. QA Pasivo", "2. QA Policía", "3. QA Tardío (sistémico)", "4. QA Aislado", "5. QA Pasivo + inmadurez"] }
      }
    ],
    quiz: [
      { q: "Story está Done cuando:", o: ["Dev termina", "Code review", "Testing + bugs resueltos", "PM aprueba"], a: 2 },
      { q: "Tester agrega MÁS valor en:", o: ["Ejecución", "Refinement/planning", "Bug report", "Retro"], a: 1 },
      { q: "QA Tardío:", o: ["Llega tarde al daily", "Testing al final sin tiempo", "Nuevo en equipo", "Bugs post-release"], a: 1 },
      { q: "Bloquear release por cosmético:", o: ["Riguroso", "QA Policía", "Estándar Big Tech", "Correcto"], a: 1 },
    ]
  },
  {
    id: "m8", title: "Mentalidad y Soft Skills",
    desc: "Mentalidad de elite, comunicación, decisiones bajo incertidumbre, entrevistas Big Tech.",
    lessons: [
      {
        id: "m8l1", title: "Mentalidad de Elite",
        intro: "La diferencia no es técnica. Es mentalidad. Los mejores piensan diferente antes de abrir una herramienta.",
        sections: [
          { title: "Mentalidad destructiva constructiva", paragraphs: ["Encontrar cómo se rompe — para PROTEGER, no destruir."], bullets: ["¿Cómo lo usa un usuario distraído?", "¿Cómo lo abusa un malicioso?", "¿Qué pasa bajo presión?", "¿Qué asumió el dev que \"nunca pasaría\"?"] },
          { title: "Comunicación con developers", bullets: ["NUNCA: \"Tu código tiene un bug.\"", "SIEMPRE: \"Comportamiento inesperado en X. Al hacer Y, resultado Z, esperaba W. ¿Intencional?\"", "Respeto + datos + pregunta abierta"] },
          { title: "Ownership real", highlight: "Tu responsabilidad es la calidad del PRODUCTO, no tu bug count." }
        ],
        senior: "Los más respetados dicen \"no sé, voy a investigar\" en vez de pretender. Humildad + rigor = senior.",
        exercise: { title: "Escenarios de Criterio", scenario: "Tres situaciones reales.", task: "1. Jueves 6pm, release mañana. Bug: 2% tarda 15s. PM quiere lanzar.\n2. Dev senior rechaza tu bug. Contradice requisito. Él 10 años, tú 3 meses.\n3. Feature sin spec escrita.", solution: ["1. ¿El 2% es checkout? 15s puede causar doble click. Lanzar CON monitoring.", "2. Mostrar REQ-123. \"¿Cambió? Actualicemos docs.\" Datos, no emociones.", "3. \"Necesito criterios de aceptación. Sin eso, no garantizo cobertura.\""] }
      },
      {
        id: "m8l2", title: "Entrevistas Big Tech",
        intro: "No buscan ejecutores. Buscan ingenieros que piensen en sistemas y comuniquen con claridad.",
        sections: [
          { title: "Lo que evalúan", bullets: ["Pensamiento sistemático: CÓMO piensas", "Priorización basada en riesgo", "Conocimiento técnico: API, SQL, automatización", "Comunicación clara para PMs"] },
          { title: "Pregunta del elevador", bullets: ["Funcional: pisos, puertas, indicador", "Edge cases: todos los pisos, cancelar", "Concurrencia: llamadas simultáneas", "Seguridad: sensor, freno, teléfono", "Performance: tiempo, peso", "Resiliencia: corte energía", "Accesibilidad: braille, voz"] },
          { title: "Factor diferenciador", highlight: "No es lo que sabes. Es cómo PIENSAS EN VOZ ALTA." }
        ],
        senior: "\"No tengo experiencia directa, pero mi approach sería...\" Honestidad + problem solving.",
        exercise: { title: "Mock Interview", scenario: "Entrevista FAANG.", task: "1. ¿Cómo testearías búsqueda de Google?\n2. 15 bugs: 3 P0, 5 P1, 7 P2. Solo arreglar 8.\n3. ¿Diferencia buen vs gran tester?", solution: ["1. Funcional, autocompletado, resultados, i18n, performance (<200ms), seguridad, accesibilidad.", "2. 3 P0 obligatorios + 5 P1 por impacto/workaround/regresión.", "3. Buen tester encuentra. Gran tester previene y mejora procesos."] }
      }
    ],
    quiz: [
      { q: "Comunicar bug:", o: ["\"Tu código tiene bug\"", "\"Comportamiento inesperado: X→Y, esperaba Z. ¿Intencional?\"", "\"Arréglalo\"", "\"Ticket asignado\""], a: 1 },
      { q: "Ownership real:", o: ["Ejecutar tests", "Culpa del dev", "Calidad del PRODUCTO", "Arreglar bugs"], a: 2 },
      { q: "En entrevista sin saber:", o: ["Inventar", "\"No tengo experiencia, mi approach sería...\"", "Cambiar tema", "\"Nunca preguntan eso\""], a: 1 },
      { q: "Gran vs buen tester:", o: ["Más bugs", "Más automatización", "Previene y mejora procesos", "Certificaciones"], a: 2 },
    ]
  }
];

const FINAL_EXAM = {
  title: "Evaluación Final — QA Engineer",
  scenario: "Eres QA Lead en \"QuickPay\", fintech de pagos móviles. Nueva feature: \"Pagos Programados\" — pagos recurrentes automáticos.\n\nReglas de negocio:\n\u2022 Monto: $1.00 mín, $10,000.00 máx\n\u2022 Frecuencias: semanal, quincenal, mensual\n\u2022 Cancelar/modificar hasta 24h antes\n\u2022 Sin fondos: reintento a 4h y 8h\n\u2022 3 fallos consecutivos: se desactiva\n\u2022 Notificaciones: 24h antes, al ejecutar, si falla\n\u2022 Historial: 2 años",
  parts: [
    { id: "p1", title: "Parte 1 — Análisis de Riesgo", prompt: "Identifica 5 riesgos críticos. Para cada uno: riesgo, impacto concreto, cómo testear.", rubric: "Debe incluir: financieros (doble cobro), seguridad (mod no autorizada), temporales (timezone), reintentos, compliance." },
    { id: "p2", title: "Parte 2 — Casos de Prueba", prompt: "6 casos profesionales: 2 happy, 2 edge, 1 seguridad, 1 integración.", rubric: "Datos específicos, reproducibles, edge cases no obvios, seguridad relevante." },
    { id: "p3", title: "Parte 3 — Detección de Bugs", prompt: "¿Bug o esperado?\n\n1. Pago para 31 feb se ejecuta 3 mar.\n2. Modificar monto 23h antes: no aplica.\n3. Cuenta Suspended ejecuta pagos.\n4. Email \"24h antes\" llega 26h antes.\n5. Elimina tarjeta: pago activo pero falla.", rubric: "#1: Bug. #2: Bug (23h < 24h, debería permitir). #3: CRITICAL. #4: Debatible. #5: HIGH." },
    { id: "p4", title: "Parte 4 — Priorización", prompt: "6 bugs, arreglar 3:\n\n1. Doble cobro en reintento + pago manual\n2. Historial solo 6 meses\n3. Notificación en inglés (config español)\n4. Suspended ejecuta pagos\n5. Cancelar no responde iOS 16\n6. Acepta $10,000.01", rubric: "#1 (doble cobro P0), #4 (security P0), #5 (bloqueante P1)." }
  ]
};

/* ═══════════════════════════════════════════
   LESSON VIEW
   ═══════════════════════════════════════════ */
const LessonView = ({ lesson, onComplete, isComplete }) => {
  const [tab, setTab] = useState(0);
  const [showSol, setShowSol] = useState(false);
  const [answer, setAnswer] = useState("");

  useEffect(() => { setTab(0); setShowSol(false); setAnswer(""); }, [lesson.id]);

  const tabs = ["Contenido", "Insight Senior", "Ejercicio"];

  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            padding: "7px 16px", borderRadius: 7, fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
            border: `1px solid ${i === tab ? T.accent : T.border}`,
            background: i === tab ? T.accentBg : "transparent",
            color: i === tab ? T.accentL : T.t4,
          }}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Section badge="Introducción" border={T.accent}>
            <P>{lesson.intro}</P>
          </Section>
          {lesson.sections.map((s, i) => (
            <Section key={i} title={s.title}>
              {s.paragraphs?.map((p, j) => <P key={j}>{p}</P>)}
              {s.bullets && <BulletList items={s.bullets} />}
              {s.highlight && <Highlight>{s.highlight}</Highlight>}
            </Section>
          ))}
        </div>
      )}

      {tab === 1 && (
        <Section badge="Perspectiva Senior" badgeColor={T.accent} border={T.accent}>
          <P style={{ fontStyle: "italic", color: T.t1, fontSize: 15, lineHeight: 1.9 }}>{lesson.senior}</P>
        </Section>
      )}

      {tab === 2 && lesson.exercise && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Section badge="Ejercicio" badgeColor={T.amber} border={T.amber}>
            <P style={{ fontWeight: 600, color: T.t1 }}>{lesson.exercise.title}</P>
            {lesson.exercise.scenario && <P>{lesson.exercise.scenario}</P>}
            <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.85, color: T.t2 }}>{lesson.exercise.task}</div>
          </Section>
          <Section title="Tu respuesta">
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Escribe aquí antes de ver la solución..."
              style={{ width: "100%", minHeight: 140, padding: 14, borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.t1, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.7 }} />
            <div style={{ marginTop: 12 }}>
              <Btn variant="outline" onClick={() => setShowSol(!showSol)}>{showSol ? "Ocultar" : "Ver"} Respuesta Modelo</Btn>
            </div>
            {showSol && (
              <div style={{ marginTop: 14, padding: 16, background: T.greenBg, borderRadius: 8, borderLeft: `3px solid ${T.green}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.green, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Referencia</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {lesson.exercise.solution.map((s, i) => (
                    <li key={i} style={{ fontSize: 13, lineHeight: 1.85, color: T.t2, marginBottom: 6 }}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <Btn onClick={onComplete} style={{ background: isComplete ? T.green : T.accent }}>
          {isComplete ? "Completada ✓" : "Marcar como completada"}
        </Btn>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   QUIZ VIEW
   ═══════════════════════════════════════════ */
const QuizView = ({ quiz, onComplete, onExit, existingScore }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(existingScore !== undefined);
  const [score, setScore] = useState(existingScore || 0);
  const total = quiz.length;
  const answered = Object.keys(answers).length;

  const submit = () => {
    let c = 0;
    quiz.forEach((q, i) => { if (answers[i] === q.a) c++; });
    const s = Math.round((c / total) * 100);
    setScore(s); setSubmitted(true);
    if (s >= 70) onComplete(s);
  };

  if (submitted) {
    const passed = score >= 70;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18, textAlign: "left" }}>
        <Section border={passed ? T.green : T.red}>
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: passed ? T.green : T.red }}>{score}%</div>
            <P style={{ textAlign: "center", margin: "6px 0 0" }}>{passed ? "Aprobado" : "No aprobado — mínimo 70%"}</P>
          </div>
        </Section>
        {quiz.map((q, i) => {
          const ok = answers[i] === q.a;
          return (
            <div key={i} style={{ padding: "12px 16px", borderRadius: 8, background: ok ? T.greenBg : T.redBg, borderLeft: `3px solid ${ok ? T.green : T.red}` }}>
              <P style={{ fontWeight: 600, color: T.t1, marginBottom: 4 }}>{i + 1}. {q.q}</P>
              <P style={{ margin: 0, fontSize: 13, color: ok ? T.green : T.red }}>{ok ? "Correcto" : `Incorrecto — ${q.o[q.a]}`}</P>
            </div>
          );
        })}
        <div style={{ display: "flex", gap: 10 }}>
          {!passed && <Btn onClick={() => { setSubmitted(false); setAnswers({}); }}>Reintentar</Btn>}
          <Btn variant="outline" onClick={onExit}>Volver al módulo</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, textAlign: "left" }}>
      <Section badge="Evaluación" badgeColor={T.amber}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <P style={{ margin: 0 }}>Mínimo 70% para aprobar.</P>
          <span style={{ fontSize: 12, color: T.t4, fontWeight: 600 }}>{answered}/{total}</span>
        </div>
        <div style={{ height: 3, background: T.bg3, borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
          <div style={{ width: `${(answered / total) * 100}%`, height: "100%", background: T.accent }} />
        </div>
      </Section>
      {quiz.map((q, i) => (
        <Section key={i}>
          <P style={{ fontWeight: 600, color: T.t1 }}>{i + 1}. {q.q}</P>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {q.o.map((opt, oi) => (
              <button key={oi} onClick={() => setAnswers({ ...answers, [i]: oi })}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, textAlign: "left", fontFamily: "inherit", border: `1px solid ${answers[i] === oi ? T.accent : T.border}`, background: answers[i] === oi ? T.accentBg : "transparent", color: answers[i] === oi ? T.accentL : T.t3, cursor: "pointer", fontSize: 13 }}>
                <span style={{ width: 16, height: 16, borderRadius: 99, border: `2px solid ${answers[i] === oi ? T.accent : T.borderL}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {answers[i] === oi && <span style={{ width: 7, height: 7, borderRadius: 99, background: T.accent }} />}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </Section>
      ))}
      <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
        <Btn variant="ghost" onClick={onExit}>Salir del quiz</Btn>
        <Btn onClick={submit} disabled={answered < total} style={{ opacity: answered < total ? 0.4 : 1 }}>Enviar ({answered}/{total})</Btn>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   FINAL EXAM VIEW
   ═══════════════════════════════════════════ */
const FinalExamView = ({ exam, onBack }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, textAlign: "left" }}>
      <Section badge="Evaluación Final" badgeColor={T.accent} border={T.accent}>
        <h3 style={{ margin: "8px 0 12px", fontSize: 18, fontWeight: 700, color: T.t1, textAlign: "left" }}>Caso: QuickPay</h3>
        <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.85, color: T.t2 }}>{exam.scenario}</div>
      </Section>
      {exam.parts.map((p) => (
        <Section key={p.id} title={p.title}>
          <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.85, color: T.t2, marginBottom: 12 }}>{p.prompt}</div>
          <textarea value={answers[p.id] || ""} onChange={e => setAnswers({ ...answers, [p.id]: e.target.value })} placeholder="Tu respuesta..." disabled={submitted}
            style={{ width: "100%", minHeight: 140, padding: 14, borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.t1, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.7 }} />
          {submitted && (
            <div style={{ marginTop: 12, padding: 14, background: T.greenBg, borderRadius: 8, borderLeft: `3px solid ${T.green}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.green, marginBottom: 6, textTransform: "uppercase" }}>Rúbrica</div>
              <P style={{ margin: 0, fontSize: 13 }}>{p.rubric}</P>
            </div>
          )}
        </Section>
      ))}
      <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
        <Btn variant="ghost" onClick={onBack}>Volver</Btn>
        {!submitted && <Btn onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < exam.parts.length} style={{ opacity: Object.keys(answers).length < exam.parts.length ? 0.4 : 1 }}>Enviar Evaluación</Btn>}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   HOME VIEW
   ═══════════════════════════════════════════ */
const HomeView = ({ modules, progress, quizScores, onMod, onFinal, finalUnlocked }) => {
  const totalItems = modules.reduce((a, m) => a + m.lessons.length, 0) + modules.length;
  const done = Object.values(progress).filter(Boolean).length;
  const pct = Math.round((done / totalItems) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, textAlign: "left" }}>
      <div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: T.t1, textAlign: "left" }}>QA Engineering Mastery</h2>
        <P style={{ margin: 0 }}>Programa profesional — de cero a nivel Big Tech.</P>
      </div>
      <Section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <P style={{ margin: 0, fontWeight: 600, color: T.t1 }}>Progreso general</P>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>{pct}%</span>
        </div>
        <div style={{ height: 5, background: T.bg3, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: T.accent, borderRadius: 3 }} />
        </div>
      </Section>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {modules.map((m, i) => {
          const ld = m.lessons.filter((_, li) => progress[`${m.id}-${li}`]).length;
          const qd = quizScores[m.id] !== undefined;
          const ad = ld === m.lessons.length && qd;
          return (
            <button key={m.id} onClick={() => onMod(i)}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10, cursor: "pointer", textAlign: "left", fontFamily: "inherit", width: "100%", boxSizing: "border-box" }}>
              <span style={{ width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: ad ? T.greenBg : T.accentBg, color: ad ? T.green : T.accentL, flexShrink: 0 }}>{ad ? "✓" : i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: T.t4, marginTop: 2 }}>{ld}/{m.lessons.length} lecciones{qd ? ` · Quiz ${quizScores[m.id]}%` : ""}</div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ height: 1, background: T.border }} />
      <button onClick={onFinal} disabled={!finalUnlocked}
        style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: T.bg2, border: `1px solid ${finalUnlocked ? T.accent : T.border}`, borderRadius: 10, cursor: finalUnlocked ? "pointer" : "default", textAlign: "left", fontFamily: "inherit", opacity: finalUnlocked ? 1 : 0.5, width: "100%", boxSizing: "border-box" }}>
        <span style={{ width: 30, height: 30, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, background: T.accentBg, color: T.accentL }}>{finalUnlocked ? "F" : "🔒"}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>Evaluación Final</div>
          <div style={{ fontSize: 12, color: T.t4, marginTop: 2 }}>{finalUnlocked ? "Caso real fintech" : "Completa todos los quizzes"}</div>
        </div>
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN APP — ROOT WRAPPER FIXED
   ═══════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState({ page: "home" });
  const [modIdx, setModIdx] = useState(0);
  const [lesIdx, setLesIdx] = useState(0);
  const [progress, setProgress] = useState({});
  const [quizScores, setQuizScores] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  const scrollTop = () => { if (mainRef.current) mainRef.current.scrollTop = 0; };
  const goHome = () => { setView({ page: "home" }); setSidebarOpen(false); scrollTop(); };
  const goMod = (mi, li = 0) => { setModIdx(mi); setLesIdx(li); setView({ page: "module" }); setSidebarOpen(false); scrollTop(); };
  const goQuiz = () => { setView({ page: "quiz" }); scrollTop(); };
  const goFinal = () => { setView({ page: "final" }); setSidebarOpen(false); scrollTop(); };

  const mod = MODULES[modIdx];
  const les = mod?.lessons[lesIdx];
  const finalUnlocked = MODULES.every(m => quizScores[m.id] >= 70);

  const completeLes = useCallback(() => {
    setProgress(p => ({ ...p, [`${mod.id}-${lesIdx}`]: true }));
    if (lesIdx < mod.lessons.length - 1) { setLesIdx(lesIdx + 1); scrollTop(); }
  }, [mod, lesIdx]);

  const completeQuiz = useCallback((s) => {
    setQuizScores(sc => ({ ...sc, [mod.id]: s }));
    setProgress(p => ({ ...p, [`${mod.id}-quiz`]: true }));
  }, [mod]);

  // Breadcrumb
  const crumbs = [{ label: "Inicio", action: goHome }];
  if (view.page === "module" || view.page === "quiz") {
    crumbs.push({ label: mod.title, action: () => goMod(modIdx) });
    if (view.page === "quiz") crumbs.push({ label: "Quiz" });
    else if (les) crumbs.push({ label: les.title });
  }
  if (view.page === "final") crumbs.push({ label: "Evaluación Final" });

  // Sidebar progress
  const totalItems = MODULES.reduce((a, m) => a + m.lessons.length, 0) + MODULES.length;
  const doneItems = Object.values(progress).filter(Boolean).length;
  const globalPct = Math.round((doneItems / totalItems) * 100);

  return (
    <div style={{
      width: "100%",
      maxWidth: "100vw",
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      background: T.bg,
      color: T.t1,
      overflowX: "hidden",
      boxSizing: "border-box",
      position: "relative",
    }}>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }} />}

      {/* SIDEBAR */}
      <aside style={{
        width: 250, minWidth: 250, maxWidth: 250,
        background: T.bg1, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column",
        height: "100vh", position: "sticky", top: 0,
        overflowY: "auto", overflowX: "hidden",
        boxSizing: "border-box", flexShrink: 0,
        zIndex: sidebarOpen ? 50 : 1,
      }}>
        <div style={{ padding: "16px 14px", borderBottom: `1px solid ${T.border}` }}>
          <button onClick={goHome} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.t1 }}>QA Mastery</div>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1, height: 3, background: T.bg3, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${globalPct}%`, height: "100%", background: T.accent }} />
            </div>
            <span style={{ fontSize: 10, color: T.t4, fontWeight: 600 }}>{globalPct}%</span>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "6px 0" }}>
          {MODULES.map((m, mi) => {
            const ld = m.lessons.filter((_, li) => progress[`${m.id}-${li}`]).length;
            const qd = quizScores[m.id] >= 70;
            const ad = ld === m.lessons.length && qd;
            const active = (view.page === "module" || view.page === "quiz") && modIdx === mi;
            return (
              <button key={m.id} onClick={() => goMod(mi)}
                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", background: active ? T.accentBg : "transparent", border: "none", borderLeft: active ? `3px solid ${T.accent}` : "3px solid transparent", color: active ? T.accentL : T.t3, cursor: "pointer", textAlign: "left", fontFamily: "inherit", boxSizing: "border-box" }}>
                <span style={{ width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, background: ad ? T.greenBg : T.bg3, color: ad ? T.green : T.t4, flexShrink: 0 }}>{ad ? "✓" : mi + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</span>
              </button>
            );
          })}
          <div style={{ height: 1, background: T.border, margin: "6px 14px" }} />
          <button onClick={goFinal} disabled={!finalUnlocked}
            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px", background: view.page === "final" ? T.accentBg : "transparent", border: "none", borderLeft: view.page === "final" ? `3px solid ${T.accent}` : "3px solid transparent", color: finalUnlocked ? T.t3 : T.t4, cursor: finalUnlocked ? "pointer" : "default", textAlign: "left", fontFamily: "inherit", opacity: finalUnlocked ? 1 : 0.45, boxSizing: "border-box" }}>
            <span style={{ width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, background: T.bg3, color: T.t4 }}>{finalUnlocked ? "F" : "🔒"}</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Evaluación Final</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div ref={mainRef} style={{
        flex: 1,
        minWidth: 0,
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* HEADER */}
        <header style={{
          padding: "10px 24px", borderBottom: `1px solid ${T.border}`, background: T.bg1,
          position: "sticky", top: 0, zIndex: 10,
          display: "flex", alignItems: "center", gap: 10,
          boxSizing: "border-box", width: "100%",
        }}>
          {view.page !== "home" && (
            <Btn variant="ghost" size="sm" onClick={view.page === "quiz" ? () => goMod(modIdx) : goHome} style={{ padding: "4px 8px", fontSize: 14 }}>←</Btn>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            {crumbs.map((c, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && <span style={{ color: T.t4, fontSize: 11 }}>›</span>}
                {c.action ? (
                  <button onClick={c.action} style={{ background: "none", border: "none", color: i === crumbs.length - 1 ? T.t1 : T.t4, cursor: "pointer", fontSize: 12, fontFamily: "inherit", padding: 0, fontWeight: i === crumbs.length - 1 ? 600 : 400 }}>{c.label}</button>
                ) : (
                  <span style={{ fontSize: 12, color: T.t1, fontWeight: 600 }}>{c.label}</span>
                )}
              </span>
            ))}
          </div>
        </header>

        {/* PAGE CONTENT — LEFT ALIGNED, CONTROLLED WIDTH */}
        <div style={{
          width: "100%",
          maxWidth: 900,
          padding: "28px 32px",
          boxSizing: "border-box",
          textAlign: "left",
        }}>
          {view.page === "home" && (
            <HomeView modules={MODULES} progress={progress} quizScores={quizScores} onMod={goMod} onFinal={goFinal} finalUnlocked={finalUnlocked} />
          )}

          {view.page === "module" && les && (
            <>
              <div style={{ marginBottom: 20 }}>
                <P>{mod.desc}</P>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
                {mod.lessons.map((l, i) => (
                  <Pill key={i} active={lesIdx === i} done={progress[`${mod.id}-${i}`]} onClick={() => { setLesIdx(i); scrollTop(); }}>
                    {i + 1}. {l.title.length > 24 ? l.title.slice(0, 24) + "…" : l.title}
                  </Pill>
                ))}
                <Pill active={false} done={quizScores[mod.id] >= 70} onClick={goQuiz}>Quiz</Pill>
              </div>
              <LessonView lesson={les} onComplete={completeLes} isComplete={progress[`${mod.id}-${lesIdx}`]} />
            </>
          )}

          {view.page === "quiz" && (
            <QuizView quiz={mod.quiz} onComplete={completeQuiz} onExit={() => goMod(modIdx)} existingScore={quizScores[mod.id]} />
          )}

          {view.page === "final" && (
            finalUnlocked
              ? <FinalExamView exam={FINAL_EXAM} onBack={goHome} />
              : <Section><P style={{ textAlign: "center", color: T.t4, padding: 30 }}>Completa todos los quizzes para desbloquear.</P></Section>
          )}
        </div>
      </div>
    </div>
  );
}
