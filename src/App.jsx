import { useState, useCallback, useRef, useEffect, createContext, useContext } from "react";

/* ═══════════════════════════════════════════
   THEME & SHARED STYLES
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
const Container = ({ children, style }) => (
  <div style={{ maxWidth: 860, padding: "32px 28px", ...style }}>{children}</div>
);

const Section = ({ title, badge, badgeColor, children, style, border }) => (
  <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderLeft: border ? `3px solid ${border}` : undefined, borderRadius: 10, padding: "22px 24px", ...style }}>
    {(badge || title) && (
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        {badge && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: `${badgeColor || T.accent}15`, color: badgeColor || T.accent, letterSpacing: 0.5, textTransform: "uppercase" }}>{badge}</span>}
        {title && <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.t1 }}>{title}</h3>}
      </div>
    )}
    {children}
  </div>
);

const P = ({ children, style }) => <p style={{ fontSize: 14, lineHeight: 1.85, color: T.t2, margin: "0 0 12px", ...style }}>{children}</p>;

const BulletList = ({ items, style }) => (
  <ul style={{ margin: "8px 0 14px", paddingLeft: 20, ...style }}>
    {items.map((item, i) => (
      <li key={i} style={{ fontSize: 14, lineHeight: 1.85, color: T.t2, marginBottom: 6 }}>{item}</li>
    ))}
  </ul>
);

const Btn = ({ children, variant = "primary", size = "md", style, ...p }) => {
  const s = size === "sm" ? { padding: "6px 14px", fontSize: 12 } : { padding: "10px 20px", fontSize: 13 };
  const v = variant === "primary" ? { background: T.accent, color: "#fff", border: "none" }
    : variant === "ghost" ? { background: "transparent", color: T.t3, border: "none" }
    : { background: "transparent", border: `1px solid ${T.borderL}`, color: T.t3 };
  return <button style={{ borderRadius: 7, cursor: "pointer", fontWeight: 600, fontFamily: "inherit", transition: "all .15s", ...s, ...v, ...style }} {...p}>{children}</button>;
};

const Divider = () => <div style={{ height: 1, background: T.border, margin: "24px 0" }} />;

const Pill = ({ children, active, done, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", transition: "all .12s", whiteSpace: "nowrap",
    border: `1px solid ${active ? T.accent : done ? T.green : T.border}`,
    background: active ? T.accentBg : "transparent",
    color: active ? T.accentL : done ? T.green : T.t4,
  }}>{done && "✓ "}{children}</button>
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
            paragraphs: [
              "Un bug encontrado en requisitos cuesta x1. En desarrollo cuesta x10. En QA cuesta x100. En producción cuesta x1000. Esta progresión no es teórica — está respaldada por décadas de datos de la industria."
            ],
            bullets: [
              "Knight Capital perdió $440M en 45 minutos por un bug en su sistema de trading automatizado",
              "Facebook expuso 50 millones de tokens de acceso por un error de autenticación en 2018",
              "No son errores de \"malos desarrolladores\" — son fallos sistémicos donde el testing fue insuficiente"
            ]
          },
          {
            title: "Por qué los humanos producen bugs",
            paragraphs: [
              "Los errores de software no son accidentes aleatorios. Son consecuencia de sesgos cognitivos predecibles:"
            ],
            bullets: [
              "Sesgo de confirmación: el developer prueba que SU código funciona, no que falle",
              "Efecto de anclaje: si algo funcionó ayer, asumimos que funciona hoy",
              "Complejidad combinatoria: una app con 20 campos de 10 opciones tiene 10²⁰ combinaciones posibles",
              "Nadie puede probar todo — necesitas ESTRATEGIA, no fuerza bruta"
            ]
          },
          {
            title: "Tu verdadero trabajo",
            paragraphs: [
              "No buscas bugs. Buscas RIESGO. Tu trabajo es responder una pregunta fundamental:"
            ],
            highlight: "¿Qué tan confiados estamos en que este software hace lo que debe, no hace lo que no debe, y sobrevive condiciones adversas?"
          }
        ],
        senior: "En Big Tech, el QA no es un gate al final del proceso. Es un multiplicador de calidad que opera desde el diseño del requisito hasta el monitoreo en producción. Si esperas al código para empezar a testear, llegaste tarde.",
        exercise: {
          title: "Análisis de Riesgo Real",
          scenario: "Eres el QA Lead asignado al checkout de un e-commerce que procesa $2M diarios. El equipo quiere lanzar \"Compra con un click\" (similar a Amazon 1-Click).",
          task: "Identifica los 5 riesgos más críticos que testearías ANTES de producción. Para cada uno define: qué podría salir mal, impacto al negocio, y cómo lo testearías. NO pienses en \"casos de prueba\". Piensa en RIESGO.",
          solution: [
            "Doble cobro por click múltiple — Chargebacks masivos, pérdida de confianza. Test: simular clicks rápidos, verificar idempotencia del endpoint de pago.",
            "Race condition en inventario — Vender producto agotado. Test: 100 usuarios simultáneos comprando el último ítem, verificar que solo 1 transacción se complete.",
            "Método de pago expirado — Orden creada sin cobro. Test: tarjetas expiradas, fondos insuficientes, tarjetas bloqueadas.",
            "Dirección de envío incorrecta por defecto — Re-envíos costosos. Test: múltiples direcciones, dirección default eliminada, dirección incompleta.",
            "Fallo parcial en el flujo — Cobro sin orden o viceversa. Test: timeout del servicio de inventario post-cobro, verificar mecanismo de rollback."
          ]
        }
      },
      {
        id: "m1l2", title: "Tipos de Testing — Taxonomía Real",
        intro: "Cada tipo de testing existe por una razón específica. Si no sabes cuándo usar cada uno, desperdicias tiempo y recursos — o peor, dejas huecos de cobertura.",
        sections: [
          {
            title: "Por nivel de ejecución",
            bullets: [
              "Unit Testing — Lo hace el developer. Verifica una función aislada. Si un tester escribe unit tests, algo está mal en el proceso.",
              "Integration Testing — Tu territorio. Verificas que componentes hablan correctamente entre sí. ¿Qué pasa si el campo \"email\" viene null?",
              "E2E (End-to-End) — Flujo completo como usuario real. El más costoso y frágil. Úsalo solo para happy paths críticos."
            ]
          },
          {
            title: "Por propósito",
            bullets: [
              "Smoke Testing — \"¿La app enciende?\" Funcionalidades críticas en menos de 15 minutos. Si tu smoke tarda 2 horas, no es smoke.",
              "Regression Testing — Lo que funcionaba SIGUE funcionando. El 70% de bugs en producción son regresiones.",
              "Sanity Testing — Subset enfocado de regression. \"Cambiamos pagos, verificamos solo pagos a profundidad.\"",
              "Exploratory Testing — Testing CON charter, no clickear sin rumbo. \"En 30 min, exploro registro con datos extremos en campos opcionales.\""
            ]
          },
          {
            title: "La pirámide de testing",
            paragraphs: [
              "La distribución ideal de tests automatizados que usan los equipos de alto rendimiento:"
            ],
            bullets: [
              "70% unit tests (rápidos, aislados, baratos)",
              "20% integration tests (verifican contratos entre componentes)",
              "10% E2E tests (solo happy paths críticos del negocio)"
            ],
            highlight: "Si tu suite E2E tiene 500 tests y tu integration tiene 50, tu arquitectura de testing está invertida y vas a sufrir con tests lentos y frágiles."
          }
        ],
        senior: "Un tester que dice \"voy a hacer exploratory testing\" sin charter definido no está haciendo exploratory — está clickeando sin dirección. Siempre define: qué área, qué tipo de datos, cuánto tiempo, qué documentas.",
        exercise: {
          title: "Decide el Tipo de Testing",
          scenario: "Para cada escenario, decide qué tipo(s) de testing aplicarías y justifica tu decisión.",
          task: "1. Se cambió el color de un botón de \"Comprar\" de azul a verde.\n2. Se migró la DB de MySQL a PostgreSQL sin cambiar la API.\n3. Es viernes 4pm, hay un hotfix para un bug crítico en producción.\n4. El PM dice \"quiero asegurarme de que el checkout funciona bien en general\".",
          solution: [
            "Cambio de color — Visual regression test (screenshot comparison). Verificar que el click handler no se rompió. NO necesitas regression funcional completo.",
            "Migración de DB — Integration testing extenso. Cada query debe retornar los mismos resultados. Performance comparison entre engines.",
            "Hotfix viernes — Smoke testing SOLAMENTE del fix y área afectada. NO regression completo. Deploy con monitoreo activo.",
            "\"Funciona bien en general\" — Esto NO es testeable. Tu respuesta: \"¿Qué significa bien? ¿Qué escenarios te preocupan? ¿Cambió algo reciente?\" Cuestionar requerimientos ambiguos es tu TRABAJO."
          ]
        }
      },
      {
        id: "m1l3", title: "STLC, SDLC y tu Rol Real",
        intro: "El error más común de un tester junior: esperar a que development termine para empezar a testear. En Big Tech, si esperas al código, llegaste tarde.",
        sections: [
          {
            title: "STLC — Las 6 fases",
            bullets: [
              "Análisis de Requisitos — Encontrar ambigüedades y gaps ANTES de que se escriba código. Tu mayor multiplicador de valor.",
              "Planificación — Qué testeas, qué NO testeas (igualmente importante), herramientas, tiempo, criterios de entrada y salida.",
              "Diseño de Casos — Técnicas formales para derivar tests. No improvisación.",
              "Configuración del Ambiente — Datos de prueba, staging, mocks de servicios externos.",
              "Ejecución — Correr tests, documentar resultados, reportar bugs.",
              "Cierre — Métricas, lecciones aprendidas, qué se escapó y por qué."
            ]
          },
          {
            title: "En la práctica Agile",
            paragraphs: [
              "Todo esto ocurre dentro de un sprint de 2 semanas. El tester participa en refinement, estima esfuerzo de testing, hace shift-left (testing temprano) y shift-right (monitoreo en producción)."
            ],
            highlight: "No eres un paso en el proceso. Eres un participante continuo."
          },
          {
            title: "Tu influencia real",
            paragraphs: [
              "En Google, los SDET tienen la misma voz que los SWE. Pueden bloquear un release si la calidad no cumple el estándar. Esa autoridad se gana con CRITERIO, no con título."
            ]
          }
        ],
        senior: "Shift-left significa que tus preguntas en el refinement de una story evitan más bugs que tus tests en el sprint. Una sola pregunta sobre un edge case puede ahorrar 3 días de desarrollo y 2 bugs en producción.",
        exercise: {
          title: "Shift-Left en Acción",
          scenario: "Te entregan esta user story:\n\n\"Como usuario, quiero poder resetear mi contraseña para acceder a mi cuenta cuando la olvide.\"\n\nCriterios de aceptación: email con link de reset, link expira en 24h, contraseña debe cumplir políticas de seguridad.",
          task: "ANTES de que se escriba código, identifica al menos 8 preguntas o ambigüedades que deberías escalar al PM o equipo de desarrollo.",
          solution: [
            "¿Múltiples resets invalidan links anteriores?",
            "\"Políticas de seguridad\" — ¿cuáles exactamente? ¿Longitud? ¿Caracteres? ¿No repetir últimas N?",
            "¿Rate limiting? ¿Cuántos intentos por hora?",
            "Si el email NO existe, ¿qué mensaje? (\"No encontrado\" permite enumeración de usuarios)",
            "¿Link de un solo uso o múltiples dentro de 24h?",
            "¿Qué pasa si el usuario cambia su email después de solicitar reset?",
            "¿Se cierra sesión en todos los dispositivos después del cambio?",
            "¿Notificación de que la contraseña fue cambiada? (detección de compromiso)",
            "¿Proxies enterprise que hacen prefetch de links invalidan el token?",
            "¿Interacción con 2FA?"
          ]
        }
      }
    ],
    quiz: [
      { q: "Un bug encontrado en requisitos cuesta x1. ¿Cuánto cuesta en producción?", o: ["x10", "x100", "x1000", "x50"], a: 2 },
      { q: "¿Cuál es la distribución correcta de la pirámide de testing?", o: ["70% E2E, 20% Integration, 10% Unit", "70% Unit, 20% Integration, 10% E2E", "33% cada uno", "50% Integration, 30% Unit, 20% E2E"], a: 1 },
      { q: "Exploratory testing sin charter definido es:", o: ["Testing creativo", "Clickear sin dirección", "Testing ágil válido", "Ad-hoc testing aceptable"], a: 1 },
      { q: "¿Qué es shift-left testing?", o: ["Testear más rápido", "Involucrar testing desde fases tempranas", "Mover tests a la izquierda del dashboard", "Automatizar antes de diseñar"], a: 1 },
      { q: "El PM dice \"quiero que el checkout funcione bien\". Tu respuesta:", o: ["Testear todo exhaustivamente", "Preguntar qué significa \"bien\", qué preocupa, si hubo cambios", "Decir que no es tu responsabilidad", "Ejecutar el smoke test estándar"], a: 1 },
      { q: "El 70% de bugs en producción son:", o: ["Bugs nuevos de features", "Regresiones", "Problemas de performance", "Errores de UI"], a: 1 },
    ]
  },
  {
    id: "m2", title: "Diseño de Pruebas",
    desc: "Técnicas formales para derivar casos de prueba: partición de equivalencia, valores límite, tablas de decisión, state transition y RTM.",
    lessons: [
      {
        id: "m2l1", title: "Partición de Equivalencia y Valores Límite",
        intro: "Estas dos técnicas generan el mayor valor por esfuerzo invertido. Reducen miles de combinaciones a un conjunto manejable y efectivo.",
        sections: [
          {
            title: "Partición de Equivalencia (EP)",
            paragraphs: ["Divide el dominio de entrada en clases donde todos los valores se comportan igual. Testeas UN valor representativo por clase."],
            bullets: [
              "Ejemplo — Campo \"edad\" para seguro de auto:",
              "Inválida: < 18 (no puede contratar)",
              "Válida 1: 18-25 (tarifa joven) | Válida 2: 26-65 (estándar) | Válida 3: 66-99 (senior)",
              "Inválida: > 99, no numérico, negativo, decimal",
              "Con 7 tests cubres un dominio de miles de valores"
            ]
          },
          {
            title: "Análisis de Valores Límite (BVA)",
            paragraphs: ["Los bugs viven en los bordes. SIEMPRE. Si el rango válido es 18-65:"],
            bullets: [
              "Testeas: 17 (inválido), 18 (mínimo), 19 (mínimo+1), 64 (máximo-1), 65 (máximo), 66 (inválido)",
              "Monto de transferencia ($1 min, $10K max): $0.99, $1.00, $1.01, $9,999.99, $10,000.00, $10,000.01",
              "También incluir: $0.00, $0.01, -$0.01"
            ],
            highlight: "Testear $5,000 porque \"es un valor intermedio\" no encuentra NADA que no encuentre $1.01. Desperdicias ejecución."
          }
        ],
        senior: "Cuando un developer dice \"ya probé con datos normales y funciona\", tu pregunta es: \"¿Probaste en los límites?\" El 80% de los bugs de validación están en los bordes, no en el medio del rango.",
        exercise: {
          title: "Diseña Tests con EP y BVA",
          scenario: "Formulario de registro de servicio de streaming.",
          task: "Campos:\n- Username: 3-20 chars, alfanumérico, sin espacios\n- Contraseña: 8-64 chars, mín 1 mayúscula, 1 número, 1 especial\n- Fecha de nacimiento: mayor de 13 años\n- Código postal: 5 dígitos (US)\n\nPara CADA campo define: clases de equivalencia, valores límite, mínimo 3 casos. Bonus: interacciones entre campos.",
          solution: [
            "Username — EP válida: \"user123\". Inválidas: \"ab\" (corto), \"user name\" (espacio), \"user@!\" (especiales). BVA: 2 chars (inv), 3 (mín), 20 (máx), 21 (inv).",
            "Contraseña — Inválidas: sin mayúscula, sin número, sin especial, 7 chars. BVA: 7 (inv), 8 (mín), 64 (máx), 65 (inv).",
            "Fecha — BVA: exactamente 13 años hoy (límite), 12 años 364 días (inv). ¿Qué zona horaria para calcular?",
            "Interacciones: ¿username = email prefix? ¿Username dentro de contraseña (debería rechazarse)? ¿Exactamente 13 años HOY en qué timezone?"
          ]
        }
      },
      {
        id: "m2l2", title: "Tablas de Decisión y State Transition",
        intro: "Cuando el comportamiento depende de combinaciones de condiciones o de estados del sistema, necesitas técnicas que mapeen la complejidad de forma sistemática.",
        sections: [
          {
            title: "Tablas de Decisión",
            paragraphs: ["Mapean todas las combinaciones de condiciones y su resultado esperado. Ejemplo — envío gratis en e-commerce:"],
            bullets: [
              "Condiciones: ¿Es Prime? ¿Monto > $50? ¿Producto elegible?",
              "2³ = 8 combinaciones posibles, cada una es un caso de prueba",
              "Sin la tabla, te pierdes combinaciones garantizado",
              "Es matemática, no intuición"
            ]
          },
          {
            title: "State Transition Testing",
            paragraphs: ["Para sistemas con estados definidos. Mapeas estados, transiciones válidas, transiciones INVÁLIDAS y guardas (condiciones)."],
            bullets: [
              "Ejemplo — Pedido: Pending → Paid → Processing → Shipped → Delivered",
              "También: Pending → Cancelled, Paid → Refunded",
              "Lo CRÍTICO: testear transiciones INVÁLIDAS. ¿Puedes pasar de Delivered a Pending?",
              "Si el sistema lo permite, tienes un bug de integridad de estado"
            ],
            highlight: "En Big Tech, los state machines están en todas partes: estados de usuario, pagos, deployments, feature flags. Si no mapeas estados, no puedes testear transiciones inválidas."
          }
        ],
        senior: "Las tablas de decisión son tu arma más poderosa en refinements. Cuando el PM dice \"si es premium Y tiene más de $100, envío gratis\", tú preguntas: \"¿Y las otras 6 combinaciones?\"",
        exercise: {
          title: "State Transition de Cuenta Financiera",
          scenario: "Plataforma financiera tipo PayPal.",
          task: "Estados: Pending Verification, Active, Suspended, Locked, Closed, Banned.\n\nReglas: nueva cuenta en Pending, se activa con KYC, se suspende por actividad sospechosa, se bloquea tras 5 intentos fallidos, cierre voluntario, ban permanente por fraude.\n\nDefine: 1) Transiciones válidas 2) 5 transiciones inválidas que DEBES verificar que se rechacen 3) Qué pasa con el saldo en cada transición.",
          solution: [
            "Válidas: Pending→Active (KYC), Active→Suspended, Active→Locked (5 intentos), Active→Closed, Suspended→Active, Suspended→Banned, Locked→Active (reset).",
            "Inválidas: Banned→Active (NUNCA, ban permanente), Closed→Active (requiere nuevo registro), Pending→Suspended (no puedes suspender lo no activado), Banned→Closed (ban overrides), Delivered→Pending.",
            "Saldo: Suspended = congelado. Closed = debe ser $0 antes. Banned = retenido para investigación legal."
          ]
        }
      },
      {
        id: "m2l3", title: "Casos de Prueba Profesionales y RTM",
        intro: "Un caso de prueba mal escrito es un caso que no puede ejecutar nadie más que tú. Tus casos deben ser autónomos, reproducibles y trazables.",
        sections: [
          {
            title: "Anatomía de un caso profesional",
            bullets: [
              "ID y título descriptivo: TC-LOGIN-001 — Login exitoso con credenciales válidas",
              "Precondiciones: usuario registrado con email y password específicos",
              "Ambiente: Chrome 120+, staging environment",
              "Pasos: numerados, exactos, con datos concretos",
              "Resultado esperado: redirect a /dashboard en <3s, cookie de sesión creada",
              "Prioridad: P0 (smoke test)",
              "Trazabilidad: REQ-AUTH-001"
            ],
            highlight: "Regla: cualquier persona del equipo debe poder ejecutar tu caso y obtener el MISMO resultado. Si necesitan preguntarte algo, el caso está mal escrito."
          },
          {
            title: "Requirements Traceability Matrix (RTM)",
            paragraphs: ["Tabla que mapea: Requisito → Caso(s) de prueba → Estado → Bugs encontrados."],
            bullets: [
              "Si un requisito no tiene casos mapeados = NO ESTÁ CUBIERTO",
              "Si un caso no mapea a ningún requisito = test huérfano, probablemente innecesario",
              "La RTM se mantiene viva cada sprint, no es un documento que creas y olvidas"
            ]
          }
        ],
        senior: "En Amazon, cada test case tiene un \"blast radius\" asociado: si este test falla, ¿a cuántos usuarios y cuánto revenue afecta? Eso determina su prioridad y si bloquea el release.",
        exercise: {
          title: "Escribe Casos de Prueba Profesionales",
          scenario: "Feature: Carrito de compras con código de descuento.",
          task: "Reglas: solo UN código por orden, \"SAVE10\" = 10%, \"FLAT20\" = $20 si total > $100, códigos expiran, no aplica a Clearance, envío NO se descuenta.\n\nEscribe 8 casos profesionales (formato completo). Incluye mínimo 2 negativos y 1 de interacción entre reglas.",
          solution: [
            "TC-001: SAVE10 en orden $200 (regular) → descuento $20, total $180",
            "TC-002: FLAT20 en orden $150 → descuento $20, total $130",
            "TC-003 (neg): FLAT20 en orden $80 → rechazado, mensaje \"Mínimo $100\"",
            "TC-004 (neg): Código expirado → rechazado con mensaje claro",
            "TC-005: Dos códigos → segundo rechazado",
            "TC-006 (interacción): SAVE10 en carrito mixto (regular $100 + clearance $50) → descuento solo sobre $100 = $10",
            "TC-007: Envío $9.99 NO se descuenta con SAVE10",
            "TC-008: Aplicar SAVE10, eliminar items hasta $0 → descuento recalculado"
          ]
        }
      }
    ],
    quiz: [
      { q: "En EP, ¿cuántos valores se testean por clase?", o: ["Todos", "Uno representativo", "Tres", "Depende"], a: 1 },
      { q: "¿Dónde están la mayoría de bugs de validación?", o: ["Valores intermedios", "Bordes/límites del rango", "Valores nulos", "Valores negativos"], a: 1 },
      { q: "Tabla de decisión con 4 condiciones binarias genera:", o: ["4 combinaciones", "8", "16", "32"], a: 2 },
      { q: "En State Transition, ¿qué es MÁS importante testear?", o: ["Transiciones válidas", "Transiciones INVÁLIDAS", "Estado inicial/final", "Transiciones frecuentes"], a: 1 },
      { q: "\"Verificar que el login funciona\" como caso de prueba es:", o: ["Aceptable", "Insuficiente — falta datos, pasos y resultado esperado", "Válido si el equipo conoce el sistema", "Buen caso de alto nivel"], a: 1 },
    ]
  },
  {
    id: "m3", title: "Bugs y Gestión de Calidad",
    desc: "Documentación profesional, severidad vs prioridad con criterio real, y decisiones de priorización.",
    lessons: [
      {
        id: "m3l1", title: "Documentación de Bugs",
        intro: "Un bug mal documentado es un bug que no se arregla. En Big Tech, tu reporte es tu credibilidad profesional.",
        sections: [
          {
            title: "Estructura de un bug report profesional",
            bullets: [
              "Título descriptivo y buscable. NO: \"Login no funciona\". SÍ: \"Login returns 500 when email contains + character\"",
              "Ambiente: OS, browser/version, API version, staging/prod, fecha/hora",
              "Pasos exactos, numerados, con DATOS ESPECÍFICOS. Reproducible en <5 min",
              "Resultado actual con evidencia (screenshot, video, logs, HTTP response)",
              "Resultado esperado según spec o sentido común",
              "Frecuencia: siempre / intermitente (3 de 10) / una vez",
              "Impacto: quién se afecta, cuántos usuarios, impacto al negocio"
            ]
          },
          {
            title: "Severidad vs Prioridad",
            paragraphs: ["Esta es la confusión más común en QA. Son dimensiones DIFERENTES:"],
            bullets: [
              "Severidad = impacto TÉCNICO. Critical → High → Medium → Low",
              "Prioridad = urgencia de NEGOCIO. P0 (hotfix now) → P1 (este sprint) → P2 → P3 (backlog)",
              "Un typo en el nombre del CEO en landing = severidad LOW, prioridad P0",
              "Un crash en flujo del 0.1% de usuarios = severidad CRITICAL, puede ser P2"
            ],
            highlight: "El tester asigna severidad. El PO/PM asigna prioridad. Si mezclas ambos, pierdes poder de comunicación."
          }
        ],
        senior: "Un bug report excelente incluye una hipótesis: \"Posiblemente el endpoint no sanitiza el carácter + antes de la query SQL.\" Esto acelera el fix y demuestra que entiendes el sistema, no solo la superficie.",
        exercise: {
          title: "Documenta Este Bug",
          scenario: "Testeando app de delivery. Pedido $45.50, cupón WELCOME50 (50% off). Descuento aplicado ($22.75). Tarjeta cobrada $22.75 (correcto). Email de confirmación: $22.75 (correcto).",
          task: "PERO: en historial de pedidos muestra $45.50 (sin descuento).\n\nEscribe el bug report completo. Define severidad y prioridad con justificación.",
          solution: [
            "Título: Order history displays pre-discount amount ($45.50) instead of charged amount ($22.75) after WELCOME50 coupon",
            "Severidad: Medium — No hay pérdida financiera, pero genera confusión y tickets de soporte",
            "Prioridad: P1 — Nuevos usuarios (target del cupón) verán discrepancia, genera desconfianza y afecta retention",
            "Hipótesis: Order history lee subtotal pre-descuento en lugar del total post-descuento de la tabla de transacciones"
          ]
        }
      },
      {
        id: "m3l2", title: "Criterio Real para Clasificar Bugs",
        intro: "La diferencia entre un junior y un senior no es encontrar más bugs — es saber clasificarlos y comunicar su impacto real al equipo.",
        sections: [
          {
            title: "Red flags: bugs que siempre son P0",
            bullets: [
              "Cualquier bug que involucre dinero (cobro incorrecto, doble cobro)",
              "Exposición de datos de otro usuario (IDOR, data leak)",
              "Bypass de autenticación o autorización",
              "Pérdida de datos irrecuperable",
              "Bloqueo del flujo principal para más del 5% de usuarios"
            ],
            highlight: "Si encuentras alguno de estos, no esperes al próximo standup. Escala INMEDIATAMENTE."
          },
          {
            title: "El framework de priorización",
            paragraphs: ["Un tester senior cruza severidad técnica con múltiples factores de negocio:"],
            bullets: [
              "¿Cuántos usuarios están afectados?",
              "¿Hay workaround disponible?",
              "¿Es regresión? (antes funcionaba)",
              "¿Puede empeorar con el tiempo?",
              "¿Es one-way door (irreversible) o two-way door (se puede revertir)?"
            ]
          }
        ],
        senior: "En Amazon: \"one-way door\" vs \"two-way door\". Pérdida de datos = one-way (irreversible), SIEMPRE P0. Bug visual que se puede hotfixear = two-way, puede esperar.",
        exercise: {
          title: "Clasifica y Prioriza",
          scenario: "6 bugs reportados, capacidad para arreglar solo 3 este sprint.",
          task: "1. App crashea en foto de perfil (iPhone 12 / iOS 17)\n2. Botón \"Cancelar suscripción\" no funciona (debe llamar a soporte)\n3. Emails transaccionales con 30 min de delay\n4. Dashboard admin muestra métricas del día anterior\n5. Memory leak: app lenta después de 4h de uso\n6. Búsqueda con filtro de precio en orden incorrecto\n\nClasifica cada uno y elige los 3 que arreglas ESTE sprint.",
          solution: [
            "Priorizo: #2 (P0 — posible violación legal en UE/California, usuarios atrapados en suscripción)",
            "#1 (P1 — crash visible, iPhone 12 es dispositivo común, afecta experiencia directa)",
            "#3 (P1 — emails de transacción tardíos causan ansiedad post-compra y tickets de soporte)",
            "Próximo sprint: #5 (afecta uso prolongado, minoría), #4 (admin-only), #6 (molesto pero no bloquea compra)"
          ]
        }
      }
    ],
    quiz: [
      { q: "Un typo en el nombre del CEO en la landing page:", o: ["Sev HIGH, P0", "Sev LOW, P0", "Sev LOW, P3", "Sev MED, P1"], a: 1 },
      { q: "¿Quién asigna prioridad?", o: ["El tester", "El developer", "El Product Owner / PM", "El QA Lead"], a: 2 },
      { q: "Un endpoint que devuelve datos de OTRO usuario:", o: ["Sev Medium, P2", "Sev Critical, P0", "Sev Low si nadie reportó", "Sev High, P1"], a: 1 },
      { q: "Un crash que afecta al 0.1% de usuarios:", o: ["Sev Low (pocos usuarios)", "Sev Critical (crash siempre es critical)", "Sev Medium", "No es bug"], a: 1 },
    ]
  },
  {
    id: "m4", title: "Herramientas del Tester",
    desc: "Jira avanzado, Postman para API testing, SQL para investigación de datos, y Git básico.",
    lessons: [
      {
        id: "m4l1", title: "Jira, Postman, SQL y Git",
        intro: "No basta con saber que existen. Necesitas dominar los patrones que te hacen productivo todos los días.",
        sections: [
          {
            title: "Jira avanzado para QA",
            bullets: [
              "Dashboards de calidad: bugs abiertos por severidad, por módulo, velocity de fix",
              "JQL: project = CHECKOUT AND type = Bug AND severity = Critical AND created >= -30d",
              "Workflows: Open → In Progress → In Review → Verified → Closed",
              "Trazabilidad: linkear bugs a test cases y stories"
            ]
          },
          {
            title: "API Testing con Postman",
            paragraphs: ["El 80% del testing crítico moderno es a nivel de API. La UI es solo la punta del iceberg."],
            bullets: [
              "Construir requests GET/POST/PUT/DELETE con datos reales",
              "Variables de ambiente (staging vs prod) para cambiar rápido",
              "Tests automatizados en la tab Tests de Postman",
              "Collections con flujos completos: register → login → create order → verify",
              "Pre-request scripts para datos dinámicos"
            ]
          },
          {
            title: "SQL para investigación",
            paragraphs: ["Queries que encuentran lo que la UI nunca te mostraría:"],
            bullets: [
              "SELECT * FROM orders WHERE user_id = 123 AND status = 'pending';",
              "SELECT o.id, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.total != o.subtotal - o.discount;",
              "La segunda query encuentra inconsistencias de datos invisibles desde la UI"
            ]
          },
          {
            title: "Git básico",
            paragraphs: ["No necesitas ser experto. Necesitas: clone, pull, branch, checkout, log, diff."],
            highlight: "Con git diff ves qué cambió en el último commit y enfocas tu regression testing en lo que realmente se modificó."
          }
        ],
        senior: "Un tester que solo usa la UI para verificar bugs es un tester a medias. El 50% de los bugs están en la capa de datos y solo los encuentras consultando la base de datos directamente.",
        exercise: {
          title: "Investigación con SQL",
          scenario: "Tablas: users (id, email, plan_type, created_at), orders (id, user_id, total, discount, final_amount, status), payments (id, order_id, amount, status).",
          task: "Reportan: \"Algunos usuarios Premium no recibieron su descuento del 15%.\"\n\nEscribe queries para:\n1. Encontrar órdenes Premium sin descuento correcto\n2. Verificar si el cobro coincide con final_amount\n3. Desde cuándo empezó el problema",
          solution: [
            "1. SELECT o.id, u.email, o.total, o.discount, ROUND(o.total*0.15, 2) AS expected FROM orders o JOIN users u ON o.user_id=u.id WHERE u.plan_type='premium' AND o.discount != ROUND(o.total*0.15, 2);",
            "2. SELECT o.id, o.final_amount, p.amount, (o.final_amount - p.amount) AS diff FROM orders o JOIN payments p ON p.order_id=o.id WHERE o.final_amount != p.amount AND p.status='completed';",
            "3. SELECT MIN(o.created_at) FROM orders o JOIN users u ON o.user_id=u.id WHERE u.plan_type='premium' AND o.discount != ROUND(o.total*0.15, 2);"
          ]
        }
      }
    ],
    quiz: [
      { q: "¿Qué % del testing crítico es a nivel de API?", o: ["30%", "50%", "80%", "95%"], a: 2 },
      { q: "JQL sirve para:", o: ["Tests automatizados", "Queries avanzadas de tickets", "Conectar con DB", "Reportes de código"], a: 1 },
      { q: "¿Por qué SQL para un tester?", o: ["Crear tablas", "Verificar datos que la UI no muestra", "Optimizar queries", "Solo si no hay dev"], a: 1 },
    ]
  },
  {
    id: "m5", title: "Automatización de Testing",
    desc: "Estrategia de automatización, cuándo sí y cuándo no, Playwright, y CI/CD para testers.",
    lessons: [
      {
        id: "m5l1", title: "Estrategia de Automatización",
        intro: "La automatización no es un objetivo — es una herramienta. El anti-patrón más costoso es automatizar todo sin estrategia.",
        sections: [
          {
            title: "Cuándo SÍ automatizar",
            bullets: [
              "Lo que ejecutas más de 3 veces y es estable",
              "Smoke tests en cada build",
              "Regression de flujos core (login, checkout, CRUD principal)",
              "Validaciones de API (contratos, schemas, status codes)",
              "Data validation automatizada contra DB"
            ]
          },
          {
            title: "Cuándo NO automatizar",
            bullets: [
              "Exploratory testing (no es automatizable por definición)",
              "Tests que cambian cada sprint (alto costo de mantenimiento)",
              "UX/usabilidad (requiere juicio humano)",
              "Features inestables en desarrollo activo",
              "Validaciones one-time"
            ]
          },
          {
            title: "El anti-patrón de los 2000 E2E tests",
            paragraphs: ["Equipos que automatizan todo terminan con:"],
            bullets: [
              "Suite de 4 horas de duración",
              "30% de tests flaky que nadie confía",
              "Más tiempo manteniendo tests que testeando",
              "Fatiga de alertas → se ignoran los fallos reales"
            ],
            highlight: "Distribución correcta: 70% API/integration (rápidos, estables), 20% componente, 10% E2E (solo happy paths críticos)."
          }
        ],
        senior: "En Meta, si un test falla más de 2 veces sin ser bug real (flaky), se desactiva automáticamente y se crea ticket para arreglarlo. Un test flaky es PEOR que no tener test.",
        exercise: {
          title: "Decide Qué Automatizar",
          scenario: "App de gestión de proyectos. Capacidad: 20 tests esta semana.",
          task: "Candidatos:\n1. Login email/password\n2. Login Google SSO\n3. Crear proyecto\n4. Drag & drop de tareas\n5. Invitar usuario\n6. Filtrar tareas\n7. Subir archivos\n8. Notificaciones real-time\n9. Exportar a CSV\n10. Theme light/dark\n11. API: CRUD tareas\n12. API: Permisos\n13. API: Rate limiting\n14. Flujo completo E2E\n\n¿Cuáles priorizas y por qué?",
          solution: [
            "Top: #1 (smoke), #11 (API CRUD, alto ROI), #12 (seguridad), #3 (flujo core), #14 (E2E principal), #6 (regression frecuente), #13 (previene abuso)",
            "NO automatizar: #4 (drag&drop frágil), #8 (real-time complejo/flaky), #10 (bajo valor), #2 (SSO requiere mocks complejos)",
            "Criterio: API tests > E2E por estabilidad y velocidad"
          ]
        }
      },
      {
        id: "m5l2", title: "Playwright y CI/CD",
        intro: "Playwright es la herramienta moderna de referencia. Soporta múltiples browsers, auto-wait inteligente y network interception.",
        sections: [
          {
            title: "Estructura profesional de tests",
            paragraphs: ["Un test automatizado profesional se ve así:"],
            bullets: [
              "Usa data-testid como selector, NUNCA selectores CSS frágiles",
              "Assertions explícitas: expect(page).toHaveURL('/dashboard')",
              "Datos de prueba independientes — cada test crea su propia data",
              "Tests paralelos e independientes — sin dependencias entre tests"
            ]
          },
          {
            title: "Buenas prácticas obligatorias",
            bullets: [
              "Page Object Model: cuando cambia un selector, actualizas 1 archivo, no 47 tests",
              "Screenshots y traces automáticos en fallo",
              "Retry configurado (máximo 1) para manejar flakiness",
              "Reportes claros: qué pasó, dónde, con qué datos"
            ]
          },
          {
            title: "CI/CD Integration",
            paragraphs: ["En Big Tech, los tests corren en cada Pull Request. Si falla, el merge se bloquea automáticamente."],
            highlight: "El tester es responsable de que la suite sea confiable. Un test flaky que bloquea deploys es un problema de TU equipo, no del CI."
          }
        ],
        senior: "Page Object Model no es opcional. Sin él, cuando cambia un selector actualizas 47 tests. Con él, actualizas 1 archivo. Es la diferencia entre un framework mantenible y uno que abandonas en 3 meses.",
        exercise: {
          title: "Escribe Tests Automatizados",
          scenario: "Flujo de e-commerce: buscar producto, agregar al carrito, verificar total.",
          task: "Escribe código Playwright para:\n1. Buscar producto por nombre\n2. Seleccionar primer resultado, elegir cantidad 2\n3. Agregar al carrito\n4. Verificar item con cantidad 2 y total correcto\n5. Incluir un caso negativo (producto agotado)",
          solution: [
            "test('add to cart', async({page})=> { await page.goto('/products'); await page.fill('[data-testid=\"search\"]', 'Mouse'); await page.click('[data-testid=\"product-card\"]:first-child'); ...",
            "await page.selectOption('[data-testid=\"qty\"]', '2'); const price = await page.textContent('[data-testid=\"price\"]');",
            "await page.click('[data-testid=\"add-to-cart\"]'); await page.goto('/cart');",
            "await expect(page.locator('[data-testid=\"qty\"]')).toHaveText('2');",
            "test('out of stock', async({page})=> { await page.goto('/products/oos-123'); await expect(page.locator('[data-testid=\"add-to-cart\"]')).toBeDisabled(); });"
          ]
        }
      }
    ],
    quiz: [
      { q: "El anti-patrón más costoso en automatización:", o: ["No automatizar nada", "Automatizar TODO sin estrategia", "Usar Selenium", "No usar CI/CD"], a: 1 },
      { q: "Un test flaky es peor que no tener test porque:", o: ["Es más lento", "Genera fatiga de alertas y nadie confía en resultados", "Consume recursos", "Es difícil de debuggear"], a: 1 },
      { q: "¿Por qué data-testid sobre selectores CSS?", o: ["Más rápidos", "Estables ante cambios de diseño", "Requeridos por Playwright", "Mejoran accesibilidad"], a: 1 },
      { q: "Page Object Model se usa para:", o: ["Mejorar performance", "Centralizar selectores y reducir mantenimiento", "Conectar con DB", "Generar reportes"], a: 1 },
    ]
  },
  {
    id: "m6", title: "Testing Avanzado",
    desc: "Performance, seguridad básica, microservicios, contract testing y chaos engineering.",
    lessons: [
      {
        id: "m6l1", title: "Performance, Seguridad y Microservicios",
        intro: "En sistemas distribuidos modernos, el testing funcional es solo el punto de partida. Los fallos más costosos son de performance, seguridad e integración entre servicios.",
        sections: [
          {
            title: "Performance Testing",
            bullets: [
              "Load: ¿soporta 1000 usuarios simultáneos en hora pico?",
              "Stress: ¿cuándo se rompe? Incrementar hasta el fallo.",
              "Soak: ¿se degrada en 24h de carga constante? (memory leaks)",
              "Spike: ¿sobrevive de 100 a 10,000 usuarios en 2 min? (Black Friday)"
            ],
            paragraphs: ["Herramientas: k6, JMeter, Gatling, Locust. Métricas clave: response time (p50, p95, p99), throughput (RPS), error rate."],
            highlight: "El p99 es lo que importa. Si p50=200ms pero p99=5s, con 10M usuarios son 100K personas con experiencia terrible."
          },
          {
            title: "Security Testing básico (OWASP)",
            paragraphs: ["No necesitas ser pentester, pero TODO QA debe cubrir:"],
            bullets: [
              "Injection: ¿qué pasa con <script>alert('xss')</script> en un campo?",
              "Broken Auth: ¿acceso sin login? ¿Tokens expiran?",
              "IDOR: cambiar /api/users/123 a /124 ¿muestra datos de otro?",
              "CSRF: ¿puedo forzar acciones sin consentimiento del usuario?"
            ]
          },
          {
            title: "Microservicios y Contract Testing",
            paragraphs: ["En microservicios, un bug puede ser la interacción entre 3 servicios, no un error en uno solo."],
            bullets: [
              "Contract Testing (Pact): cada servicio define qué produce y consume. Si cambia, el contrato se rompe ANTES del deploy.",
              "Chaos Engineering: inyectar fallos deliberados. ¿Qué pasa si pagos tiene 5s de latencia?",
              "Distributed Tracing (Jaeger, Zipkin): seguir un request a través de múltiples servicios."
            ]
          }
        ],
        senior: "En Netflix, Chaos Monkey apaga servidores aleatoriamente en producción. No por irresponsabilidad — porque la resiliencia no se asume, se prueba.",
        exercise: {
          title: "Plan de Testing para Microservicios",
          scenario: "Plataforma ride-sharing (tipo Uber). Servicios: User, Ride, Payment, Notification, Pricing. Pricing Service actualizado con surge pricing.",
          task: "El cambio solo fue en Pricing pero afecta Ride y Payment.\n\n1. Tests por servicio\n2. Contract tests entre servicios\n3. Escenario de chaos engineering\n4. Cómo verificar consistencia de precio entre UI, cobro y recibo",
          solution: [
            "1. Pricing: unit tests de lógica nueva. Ride: regression de matching + nuevo schema de precios. Payment: regression de cobros.",
            "2. Contracts: Pricing↔Ride (schema tarifa), Pricing↔Payment (monto), Ride↔Notification (datos viaje).",
            "3. Chaos: Pricing con 10s de latencia. ¿Ride muestra precio? ¿Timeout? ¿Fallback a tarifa base?",
            "4. Tracing E2E: precio mostrado = precio cobrado = precio en recibo. Con surge activo e inactivo."
          ]
        }
      }
    ],
    quiz: [
      { q: "¿Qué métrica de latencia importa más?", o: ["p50", "p95", "p99", "Promedio"], a: 2 },
      { q: "IDOR permite:", o: ["Inyectar SQL", "Acceder a datos de otro usuario cambiando ID", "Ejecutar XSS", "Suplantar sesiones"], a: 1 },
      { q: "Contract Testing verifica:", o: ["Que cada servicio es rápido", "Que respetan el formato de datos acordado", "Que hay réplicas suficientes", "Que el deploy fue exitoso"], a: 1 },
    ]
  },
  {
    id: "m7", title: "Metodologías Ágiles para QA",
    desc: "Scrum aplicado al testing, ceremonias, Definition of Done, y anti-patrones que destruyen la calidad.",
    lessons: [
      {
        id: "m7l1", title: "Scrum Aplicado al Testing",
        intro: "Scrum no es teoría. Es cómo trabajan los equipos que entregan software cada 2 semanas. Tu participación define si la calidad es parte del proceso o un afterthought.",
        sections: [
          {
            title: "El sprint para un tester",
            paragraphs: ["Sprint = 2 semanas. El tester NO espera a que development termine."],
            bullets: [
              "Mientras devs implementan Story A, tú testeas Story B (ya completada)",
              "Y preparas los test cases de Story C (siguiente en la cola)",
              "Velocidad del equipo = stories que pasan DONE (incluido testing), no stories \"completadas\" por devs"
            ]
          },
          {
            title: "Ceremonias y tu rol real",
            bullets: [
              "Planning: estimas esfuerzo de testing, cuestionas stories ambiguas",
              "Daily: reportas bloqueos, avance, bugs encontrados — en 15 segundos, no 5 minutos",
              "Review: demuestras la calidad, no solo el feature. \"Testeamos X escenarios, encontramos Y bugs, Z resueltos\"",
              "Retro: propones mejoras al proceso de calidad, no solo quejas"
            ]
          },
          {
            title: "Definition of Done",
            paragraphs: ["Una story NO está Done hasta que:"],
            bullets: [
              "Code complete + code reviewed",
              "Tests unitarios pasan",
              "Testing funcional completado",
              "Bugs críticos y altos resueltos",
              "Regression no roto",
              "Documentación actualizada"
            ],
            highlight: "Si tu equipo marca stories como Done antes del testing, tienen un problema sistémico que debes escalar."
          }
        ],
        senior: "El tester que más valor agrega en Agile no es el que encuentra más bugs — es el que previene más bugs en planning. Una pregunta en refinement ahorra días de desarrollo.",
        exercise: {
          title: "Simulación de Sprint",
          scenario: "Sprint 2 semanas. 3 devs, 1 tester (tú), 5 stories comprometidas.",
          task: "Día 3: Story 1 en code review, Story 2 en desarrollo.\nDía 5: Story 1 tiene 2 bugs (1 High, 1 Med). Story 2 llega a testing.\nDía 8: Bug High sigue abierto. Stories 3-4 llegan simultáneamente. Story 5 atrasada.\nDía 9: PM pregunta \"¿entregamos las 5?\"\n\nPara cada día: qué haces y qué comunicas.",
          solution: [
            "Día 3: Preparo tests de Story 2. Reviso specs de Stories 3-5 (shift-left). Daily: \"Story 1 pendiente, preparando Stories 2-5.\"",
            "Día 5: Testeo Story 2, documento bugs Story 1. Daily: \"Story 1 bloqueada por Bug-High. Risk flag: si no se arregla mañana, no sale.\"",
            "Día 8: Escalo Bug-High al Scrum Master. Testeo Stories 3-4 en happy paths críticos. Flag Story 5 como riesgo.",
            "Día 9: \"Realísticamente 3-4 stories. Story 5 no completará testing. Recomiendo moverla al próximo sprint.\""
          ]
        }
      },
      {
        id: "m7l2", title: "Anti-patrones del QA en Agile",
        intro: "Conocer los anti-patrones es tan importante como las buenas prácticas. Estos errores destruyen la efectividad del tester.",
        sections: [
          {
            title: "QA Pasivo",
            paragraphs: ["Solo ejecuta tests asignados. No cuestiona requisitos, no participa en planning, no propone mejoras. Es ejecutor, no ingeniero."],
            highlight: "En Big Tech, este perfil no sobrevive. Tu voz en refinement vale tanto como la del developer."
          },
          {
            title: "QA Tardío",
            paragraphs: ["El equipo termina el jueves y \"pasa a QA\" el viernes. 1 día para 5 stories = testing superficial = bugs en producción."],
            bullets: ["Solución: testing paralelo al desarrollo. Mientras Story A se desarrolla, preparas tests. Cuando llega, ejecutas de inmediato."]
          },
          {
            title: "QA Policía",
            paragraphs: ["Bloquea todo, rechaza stories por bugs cosméticos, crea fricción constante. El equipo lo ve como obstáculo."],
            bullets: ["Solución: criterio. No todo bug bloquea. Clasifica por severidad, negocia, acepta riesgos calculados."]
          },
          {
            title: "QA Aislado",
            paragraphs: ["Trabaja solo, no hace pair testing, no comparte strategy. Resultado: duplicación de esfuerzo, gaps de cobertura."],
            bullets: ["Solución: pair testing, compartir test strategy en planning, feedback loops cortos con developers."]
          }
        ],
        senior: "El mejor indicador de un buen tester: los developers dicen \"Quiero que revises mi story antes de codear.\" Cuando te buscan proactivamente, estás haciendo tu trabajo bien.",
        exercise: {
          title: "Identifica los Anti-patrones",
          scenario: "Lee estas situaciones y determina el anti-patrón + corrección.",
          task: "1. En planning, el tester no dice nada. Después se queja de stories mal definidas.\n2. Rechaza release por typo en tooltip.\n3. Último día: 4 stories llegan a testing simultáneamente.\n4. Nunca habla con devs sobre su approach de testing.\n5. Le piden estimar testing y dice \"no sé, depende\".",
          solution: [
            "1. QA Pasivo — Debería cuestionar en planning, no después.",
            "2. QA Policía — Typo en tooltip = Low/P3, no bloquea release.",
            "3. QA Tardío (sistémico) — Testing debe ser paralelo, no secuencial.",
            "4. QA Aislado — Pair testing evitaría gaps.",
            "5. QA Pasivo — Debería estimar basándose en complejidad y riesgo."
          ]
        }
      }
    ],
    quiz: [
      { q: "Una story está \"Done\" cuando:", o: ["Dev termina de codear", "Code review pasa", "Testing completado y bugs críticos resueltos", "PM aprueba"], a: 2 },
      { q: "El tester agrega MÁS valor en:", o: ["Ejecución de tests", "Refinement y planning (shift-left)", "Reporte de bugs", "Retrospectiva"], a: 1 },
      { q: "QA Tardío significa:", o: ["Tester llega tarde al daily", "Testing al final del sprint sin tiempo", "Tester nuevo", "Bugs post-release"], a: 1 },
      { q: "Bloquear release por bug cosmético es:", o: ["Tester riguroso", "QA Policía — falta criterio", "Estándar Big Tech", "Correcto en empresas exigentes"], a: 1 },
    ]
  },
  {
    id: "m8", title: "Mentalidad y Soft Skills",
    desc: "Cómo piensa un tester de elite, comunicación efectiva, decisiones bajo incertidumbre, y entrevistas Big Tech.",
    lessons: [
      {
        id: "m8l1", title: "Mentalidad de un Tester de Elite",
        intro: "La diferencia entre un tester y un gran tester no es técnica. Es mentalidad. Los mejores piensan diferente antes de abrir una sola herramienta.",
        sections: [
          {
            title: "Mentalidad destructiva constructiva",
            paragraphs: ["Tu trabajo no es confirmar que funciona. Es encontrar cómo se rompe — para PROTEGER, no para destruir. Antes de testear:"],
            bullets: [
              "¿Cómo usaría esto un usuario distraído?",
              "¿Cómo abusaría esto un usuario malicioso?",
              "¿Qué pasa cuando el sistema está bajo presión?",
              "¿Qué asumió el developer que \"nunca pasaría\"?"
            ]
          },
          {
            title: "Comunicación con developers",
            paragraphs: ["La forma en que reportas un bug determina si se arregla rápido o genera conflicto."],
            bullets: [
              "NUNCA: \"Tu código tiene un bug.\"",
              "SIEMPRE: \"Encontré comportamiento inesperado en flujo X. Al hacer Y, resultado es Z, pero según requisito debería ser W. ¿Puede ser intencional?\"",
              "La diferencia: respeto + datos + pregunta abierta"
            ]
          },
          {
            title: "Ownership real",
            highlight: "No digas \"yo reporté el bug, no es mi problema si no lo arreglan.\" Tu responsabilidad es la calidad del PRODUCTO, no tu bug count."
          }
        ],
        senior: "En Google, los ingenieros de testing más respetados dicen \"no sé, pero voy a investigar\" en vez de pretender que saben todo. Humildad intelectual + rigor técnico = marca de un senior.",
        exercise: {
          title: "Escenarios de Criterio",
          scenario: "Tres situaciones reales que enfrentarás en tu carrera.",
          task: "1. Jueves 6pm, release mañana. Bug: 2% de confirmaciones tardan 15s (no error funcional). PM quiere lanzar. Dev dice \"lo arreglo la semana que viene.\" ¿Qué haces?\n\n2. Dev senior rechaza tu bug: \"no es bug, es comportamiento esperado.\" Tú tienes evidencia de que contradice el requisito. Dev tiene 10 años, tú 3 meses.\n\n3. Te piden testear feature sin spec escrita. PM: \"ya lo discutimos verbalmente.\"",
          solution: [
            "1. Pido datos del 2%. Si son checkout (dinero), 15s puede causar doble click/cobro. Recomiendo: lanzar CON monitoring y alertas si latencia >10s. Documentar riesgo aceptado.",
            "2. Voy al requisito escrito. \"Según REQ-123, el comportamiento esperado es X. ¿Cambió? Si sí, actualicemos documentación.\" Datos, no emociones.",
            "3. \"Necesito criterios de aceptación escritos. Sin eso, no puedo garantizar cobertura.\" Si insisten, YO escribo los criterios y pido validación."
          ]
        }
      },
      {
        id: "m8l2", title: "Entrevistas QA en Big Tech",
        intro: "Las Big Tech no buscan ejecutores. Buscan ingenieros que piensen en sistemas, prioricen por riesgo y comuniquen con claridad.",
        sections: [
          {
            title: "Lo que evalúan",
            bullets: [
              "Pensamiento sistemático: CÓMO piensas, no cuántos tests listas. Estructura: funcional → edge cases → integración → performance → seguridad → accesibilidad.",
              "Priorización: \"Todos los tests posibles son X, los 5 críticos son estos PORQUE...\"",
              "Conocimiento técnico: lees código, entiendes APIs, sabes SQL, puedes automatizar.",
              "Comunicación clara: explicas problemas técnicos para que un PM entienda."
            ]
          },
          {
            title: "La pregunta del elevador",
            paragraphs: ["\"¿Cómo testearías un elevador?\" — Categoriza:"],
            bullets: [
              "Funcional: cada piso accesible, puertas, indicador correcto",
              "Edge cases: todos los pisos a la vez, cancelar, piso inválido",
              "Concurrencia: llamadas simultáneas, algoritmo de scheduling",
              "Seguridad: sensor obstrucción, freno emergencia, teléfono",
              "Performance: tiempo espera, capacidad peso, carga máxima",
              "Resiliencia: corte de energía, fallo de sensor",
              "Accesibilidad: braille, voz, tiempo puerta suficiente"
            ]
          },
          {
            title: "El factor diferenciador",
            highlight: "No es lo que sabes. Es cómo PIENSAS EN VOZ ALTA. Practica verbalizar tu proceso de razonamiento."
          }
        ],
        senior: "Cuando no sepas algo en la entrevista: \"No tengo experiencia directa, pero mi approach sería...\" Demuestra honestidad + capacidad de resolver problemas nuevos.",
        exercise: {
          title: "Mock Interview",
          scenario: "Responde como si estuvieras en entrevista FAANG.",
          task: "1. \"¿Cómo testearías la barra de búsqueda de Google?\" (Organiza por categorías.)\n\n2. \"15 bugs: 3 P0, 5 P1, 7 P2. Solo pueden arreglar 8. ¿Cuáles?\"\n\n3. \"¿Diferencia entre buen tester y gran tester?\"",
          solution: [
            "1. Funcional: normal, vacía, especiales, muy larga. Autocompletado: velocidad, relevancia. Resultados: orden, paginación. i18n: RTL. Performance: <200ms. Seguridad: XSS. Accesibilidad: screen reader.",
            "2. Los 3 P0 no negociables. De los 5 P1: evalúo usuarios afectados, workaround, regresión. Top 5 por impacto. 7 restantes al backlog priorizado.",
            "3. Buen tester encuentra bugs. Gran tester los previene. Buen tester ejecuta tests. Gran tester diseña estrategias. Buen tester reporta. Gran tester mejora el proceso."
          ]
        }
      }
    ],
    quiz: [
      { q: "La mejor forma de comunicar un bug:", o: ["\"Tu código tiene un bug\"", "\"Comportamiento inesperado: al hacer X, ocurre Y en vez de Z. ¿Intencional?\"", "\"Login roto, arréglalo\"", "\"Te asigné el ticket\""], a: 1 },
      { q: "Ownership real en QA:", o: ["Ejecutar todos los tests", "Si bug llega a prod es culpa del dev", "Tu responsabilidad es la calidad del PRODUCTO", "Arreglar bugs tú mismo"], a: 2 },
      { q: "En entrevista cuando no sabes:", o: ["Inventar respuesta", "\"No tengo experiencia directa, pero mi approach sería...\"", "Cambiar el tema", "Decir que nunca preguntaron eso"], a: 1 },
      { q: "Gran tester vs buen tester:", o: ["Más bugs", "Más automatización", "Previene bugs y mejora procesos", "Más certificaciones"], a: 2 },
    ]
  }
];

const FINAL_EXAM = {
  title: "Evaluación Final — QA Engineer",
  scenario: `Eres contratado como QA Lead para "QuickPay", una fintech de pagos móviles. La app permite: registro con KYC, agregar tarjetas, enviar dinero entre usuarios, pagar con QR, y solicitar créditos.

Nueva feature: "Pagos Programados" — pagos recurrentes automáticos (renta, suscripciones).

Reglas de negocio:
• Monto: $1.00 mínimo, $10,000.00 máximo por transacción
• Frecuencias: semanal, quincenal, mensual
• Cancelar/modificar hasta 24h antes de ejecución
• Sin fondos: reintento a las 4h y 8h
• 3 fallos consecutivos: pago se desactiva
• Notificaciones: 24h antes, al ejecutar, y si falla
• Historial disponible por 2 años`,
  parts: [
    {
      id: "p1", title: "Parte 1 — Análisis de Riesgo",
      prompt: "Identifica los 5 riesgos más críticos. Para cada uno: riesgo, impacto concreto (dinero, usuarios, regulación), y cómo lo testearías.",
      rubric: "Debe incluir: riesgos financieros (doble cobro), seguridad (modificación no autorizada), temporales (timezone, horario verano), reintentos (cobro parcial), compliance/regulación."
    },
    {
      id: "p2", title: "Parte 2 — Casos de Prueba",
      prompt: "Escribe 6 casos profesionales: 2 happy paths, 2 edge cases, 1 seguridad, 1 integración. Formato completo.",
      rubric: "Datos específicos, reproducibles, edge cases no obvios, caso de seguridad relevante (e.g., modificar pago de otro usuario), integración que considere fallo entre servicios."
    },
    {
      id: "p3", title: "Parte 3 — Detección de Bugs",
      prompt: "¿Bug o comportamiento esperado? Clasifica:\n\n1. Pago programado para 31 de febrero se ejecuta el 3 de marzo.\n2. Modificar monto 23h antes: cambio no se aplica.\n3. Cuenta Suspended sigue ejecutando pagos programados.\n4. Email \"24h antes\" llega 26 horas antes.\n5. Usuario elimina tarjeta asociada: pago sigue activo pero falla.",
      rubric: "#1: Bug (31 feb no existe). #2: Bug (límite es 24h, 23h debería permitir). #3: CRITICAL (suspended no debe transaccionar). #4: Debatible (2h margen aceptable). #5: HIGH (debería validar tarjeta o notificar)."
    },
    {
      id: "p4", title: "Parte 4 — Priorización",
      prompt: "6 bugs, arreglar solo 3:\n\n1. Doble cobro cuando reintento coincide con pago manual\n2. Historial solo muestra 6 meses (no 2 años)\n3. Notificación de fallo en inglés para usuarios en español\n4. Cuenta Suspended ejecuta pagos programados\n5. Botón Cancelar no responde en iOS 16\n6. Acepta $10,000.01 (off by one)\n\nSelecciona, ordena y justifica.",
      rubric: "#1 (doble cobro, P0), #4 (breach seguridad, P0), #5 (funcionalidad bloqueada, P1). Los otros pueden esperar."
    }
  ]
};


/* ═══════════════════════════════════════════
   VIEW: LESSON
   ═══════════════════════════════════════════ */
const LessonView = ({ lesson, onComplete, isComplete }) => {
  const [tab, setTab] = useState(0);
  const [showSol, setShowSol] = useState(false);
  const [answer, setAnswer] = useState("");

  useEffect(() => { setTab(0); setShowSol(false); setAnswer(""); }, [lesson.id]);

  const tabs = ["Contenido", "Insight Senior", "Ejercicio"];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            padding: "7px 16px", borderRadius: 7, border: `1px solid ${i === tab ? T.accent : T.border}`,
            background: i === tab ? T.accentBg : "transparent", color: i === tab ? T.accentL : T.t4,
            cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit"
          }}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Intro */}
          <Section badge="Introducción" border={T.accent}>
            <P>{lesson.intro}</P>
          </Section>

          {/* Content sections */}
          {lesson.sections.map((s, i) => (
            <Section key={i} title={s.title}>
              {s.paragraphs?.map((p, j) => <P key={j}>{p}</P>)}
              {s.bullets && <BulletList items={s.bullets} />}
              {s.highlight && (
                <div style={{ padding: "12px 16px", background: T.amberBg, borderLeft: `3px solid ${T.amber}`, borderRadius: 6, marginTop: 8 }}>
                  <P style={{ margin: 0, color: T.t1, fontWeight: 500 }}>{s.highlight}</P>
                </div>
              )}
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
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Section badge="Ejercicio Práctico" badgeColor={T.amber} border={T.amber}>
            <P style={{ fontWeight: 600, color: T.t1 }}>{lesson.exercise.title}</P>
            {lesson.exercise.scenario && <P>{lesson.exercise.scenario}</P>}
            <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.85, color: T.t2 }}>{lesson.exercise.task}</div>
          </Section>

          <Section title="Tu respuesta">
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Escribe tu respuesta aquí antes de ver la solución..."
              style={{ width: "100%", minHeight: 150, padding: 14, borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.t1, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.7 }} />
            <div style={{ marginTop: 14 }}>
              <Btn variant="outline" onClick={() => setShowSol(!showSol)}>{showSol ? "Ocultar" : "Ver"} Respuesta Modelo</Btn>
            </div>
            {showSol && (
              <div style={{ marginTop: 16, padding: 16, background: T.greenBg, borderRadius: 8, borderLeft: `3px solid ${T.green}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.green, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Respuesta de referencia</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {lesson.exercise.solution.map((s, i) => (
                    <li key={i} style={{ fontSize: 13, lineHeight: 1.85, color: T.t2, marginBottom: 8 }}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
        <Btn onClick={onComplete} style={{ background: isComplete ? T.green : T.accent }}>
          {isComplete ? "Completada ✓" : "Marcar como completada"}
        </Btn>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════
   VIEW: QUIZ
   ═══════════════════════════════════════════ */
const QuizView = ({ quiz, moduleId, onComplete, onExit, existingScore }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(existingScore !== undefined);
  const [score, setScore] = useState(existingScore || 0);

  const total = quiz.length;
  const answered = Object.keys(answers).length;

  const submit = () => {
    let c = 0;
    quiz.forEach((q, i) => { if (answers[i] === q.a) c++; });
    const s = Math.round((c / total) * 100);
    setScore(s);
    setSubmitted(true);
    if (s >= 70) onComplete(s);
  };

  if (submitted) {
    const passed = score >= 70;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Section border={passed ? T.green : T.red}>
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: passed ? T.green : T.red }}>{score}%</div>
            <P style={{ textAlign: "center", margin: "8px 0 0" }}>{passed ? "Aprobado — módulo completado" : "No aprobado — mínimo 70% requerido"}</P>
          </div>
        </Section>
        {quiz.map((q, i) => {
          const ok = answers[i] === q.a;
          return (
            <div key={i} style={{ padding: "14px 16px", borderRadius: 8, background: ok ? T.greenBg : T.redBg, borderLeft: `3px solid ${ok ? T.green : T.red}` }}>
              <P style={{ fontWeight: 600, color: T.t1, marginBottom: 4 }}>{i + 1}. {q.q}</P>
              <P style={{ margin: 0, fontSize: 13, color: ok ? T.green : T.red }}>
                {ok ? "Correcto" : `Incorrecto — Respuesta: ${q.o[q.a]}`}
              </P>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Section badge="Evaluación" badgeColor={T.amber}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <P style={{ margin: 0 }}>Responde al menos el 70% correctamente para aprobar.</P>
          <span style={{ fontSize: 12, color: T.t4, fontWeight: 600 }}>{answered}/{total}</span>
        </div>
        <div style={{ height: 3, background: T.bg3, borderRadius: 2, marginTop: 10, overflow: "hidden" }}>
          <div style={{ width: `${(answered / total) * 100}%`, height: "100%", background: T.accent, transition: "width .3s" }} />
        </div>
      </Section>

      {quiz.map((q, i) => (
        <Section key={i}>
          <P style={{ fontWeight: 600, color: T.t1 }}>{i + 1}. {q.q}</P>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
            {q.o.map((opt, oi) => (
              <button key={oi} onClick={() => setAnswers({ ...answers, [i]: oi })}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, textAlign: "left", fontFamily: "inherit",
                  border: `1px solid ${answers[i] === oi ? T.accent : T.border}`,
                  background: answers[i] === oi ? T.accentBg : "transparent",
                  color: answers[i] === oi ? T.accentL : T.t3, cursor: "pointer", fontSize: 13, transition: "all .12s"
                }}>
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
        <Btn onClick={submit} disabled={answered < total} style={{ opacity: answered < total ? 0.4 : 1 }}>
          Enviar ({answered}/{total})
        </Btn>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════
   VIEW: FINAL EXAM
   ═══════════════════════════════════════════ */
const FinalExamView = ({ exam, onBack }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Section badge="Evaluación Final" badgeColor={T.accent} border={T.accent}>
        <h3 style={{ margin: "8px 0 12px", fontSize: 18, fontWeight: 700, color: T.t1 }}>Caso: QuickPay — Pagos Programados</h3>
        <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.85, color: T.t2 }}>{exam.scenario}</div>
      </Section>

      {exam.parts.map((part, i) => (
        <Section key={part.id} title={part.title}>
          <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.85, color: T.t2, marginBottom: 14 }}>{part.prompt}</div>
          <textarea value={answers[part.id] || ""} onChange={e => setAnswers({ ...answers, [part.id]: e.target.value })}
            placeholder="Tu respuesta..." disabled={submitted}
            style={{ width: "100%", minHeight: 160, padding: 14, borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.t1, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.7 }} />
          {submitted && (
            <div style={{ marginTop: 14, padding: 14, background: T.greenBg, borderRadius: 8, borderLeft: `3px solid ${T.green}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.green, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Rúbrica de evaluación</div>
              <P style={{ margin: 0, fontSize: 13 }}>{part.rubric}</P>
            </div>
          )}
        </Section>
      ))}

      <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
        <Btn variant="ghost" onClick={onBack}>Volver al inicio</Btn>
        {!submitted ? (
          <Btn onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < exam.parts.length}
            style={{ opacity: Object.keys(answers).length < exam.parts.length ? 0.4 : 1 }}>
            Enviar Evaluación Final
          </Btn>
        ) : (
          <Badge color={T.green}>Evaluación completada</Badge>
        )}
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════
   VIEW: HOME
   ═══════════════════════════════════════════ */
const HomeView = ({ modules, progress, quizScores, onSelectModule, onSelectFinal, finalUnlocked }) => {
  const totalItems = modules.reduce((a, m) => a + m.lessons.length, 0) + modules.length;
  const doneItems = Object.values(progress).filter(Boolean).length;
  const pct = Math.round((doneItems / totalItems) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: T.t1 }}>QA Engineering Mastery</h2>
        <P style={{ margin: 0 }}>Programa profesional de Quality Assurance — de cero a nivel Big Tech.</P>
      </div>

      <Section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <P style={{ margin: 0, fontWeight: 600, color: T.t1 }}>Progreso general</P>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: T.bg3, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: T.accent, borderRadius: 3, transition: "width .4s" }} />
        </div>
      </Section>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {modules.map((m, i) => {
          const lessonsDone = m.lessons.filter((_, li) => progress[`${m.id}-${li}`]).length;
          const qDone = quizScores[m.id] !== undefined;
          const allDone = lessonsDone === m.lessons.length && qDone;
          return (
            <button key={m.id} onClick={() => onSelectModule(i)}
              style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "border-color .15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
              <span style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, background: allDone ? T.greenBg : T.accentBg, color: allDone ? T.green : T.accentL, flexShrink: 0 }}>
                {allDone ? "✓" : i + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: T.t4, marginTop: 2 }}>{m.desc.length > 80 ? m.desc.slice(0, 80) + "…" : m.desc}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: T.t4 }}>{lessonsDone}/{m.lessons.length} lecciones</div>
                {qDone && <div style={{ fontSize: 11, color: T.green, marginTop: 2 }}>Quiz: {quizScores[m.id]}%</div>}
              </div>
            </button>
          );
        })}
      </div>

      <Divider />

      <button onClick={onSelectFinal} disabled={!finalUnlocked}
        style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: T.bg2, border: `1px solid ${finalUnlocked ? T.accent : T.border}`, borderRadius: 10, cursor: finalUnlocked ? "pointer" : "default", textAlign: "left", fontFamily: "inherit", opacity: finalUnlocked ? 1 : 0.5 }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, background: T.accentBg, color: T.accentL }}>{finalUnlocked ? "F" : "🔒"}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.t1 }}>Evaluación Final — QA Engineer</div>
          <div style={{ fontSize: 12, color: T.t4, marginTop: 2 }}>{finalUnlocked ? "Caso real completo de una fintech" : "Completa todos los quizzes para desbloquear"}</div>
        </div>
      </button>
    </div>
  );
};


/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState({ page: "home" }); // home | module | quiz | final
  const [activeModIdx, setActiveModIdx] = useState(0);
  const [activeLesIdx, setActiveLesIdx] = useState(0);
  const [progress, setProgress] = useState({});
  const [quizScores, setQuizScores] = useState({});
  const mainRef = useRef(null);

  const scrollTop = () => { if (mainRef.current) mainRef.current.scrollTop = 0; };

  const goHome = () => { setView({ page: "home" }); scrollTop(); };
  const goModule = (mi, li = 0) => { setActiveModIdx(mi); setActiveLesIdx(li); setView({ page: "module" }); scrollTop(); };
  const goQuiz = () => { setView({ page: "quiz" }); scrollTop(); };
  const goFinal = () => { setView({ page: "final" }); scrollTop(); };

  const mod = MODULES[activeModIdx];
  const lesson = mod?.lessons[activeLesIdx];
  const finalUnlocked = MODULES.every(m => quizScores[m.id] >= 70);

  const completeLesson = useCallback(() => {
    setProgress(p => ({ ...p, [`${mod.id}-${activeLesIdx}`]: true }));
    if (activeLesIdx < mod.lessons.length - 1) {
      setActiveLesIdx(activeLesIdx + 1);
      scrollTop();
    }
  }, [mod, activeLesIdx]);

  const completeQuiz = useCallback((score) => {
    setQuizScores(s => ({ ...s, [mod.id]: score }));
    setProgress(p => ({ ...p, [`${mod.id}-quiz`]: true }));
  }, [mod]);

  // Breadcrumb
  const Breadcrumb = () => {
    const crumbs = [{ label: "Inicio", action: goHome }];
    if (view.page === "module" || view.page === "quiz") {
      crumbs.push({ label: `Módulo ${activeModIdx + 1}: ${mod.title}`, action: () => goModule(activeModIdx) });
      if (view.page === "quiz") crumbs.push({ label: "Quiz" });
      else crumbs.push({ label: lesson.title });
    }
    if (view.page === "final") crumbs.push({ label: "Evaluación Final" });

    return (
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
    );
  };

  // Sidebar
  const SidebarContent = () => {
    const totalItems = MODULES.reduce((a, m) => a + m.lessons.length, 0) + MODULES.length;
    const doneItems = Object.values(progress).filter(Boolean).length;

    return (
      <aside style={{ width: 260, minWidth: 260, background: T.bg1, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <div style={{ padding: "18px 16px", borderBottom: `1px solid ${T.border}` }}>
          <button onClick={goHome} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", textAlign: "left", width: "100%" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: T.t1 }}>QA Mastery</div>
            <div style={{ fontSize: 10, color: T.t4, marginTop: 2 }}>Programa Profesional</div>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <div style={{ flex: 1, height: 3, background: T.bg3, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${(doneItems / totalItems) * 100}%`, height: "100%", background: T.accent, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 10, color: T.t4, fontWeight: 600 }}>{Math.round((doneItems / totalItems) * 100)}%</span>
          </div>
        </div>

        <nav style={{ flex: 1, overflow: "auto", padding: "6px 0" }}>
          {MODULES.map((m, mi) => {
            const lDone = m.lessons.filter((_, li) => progress[`${m.id}-${li}`]).length;
            const qDone = quizScores[m.id] >= 70;
            const allDone = lDone === m.lessons.length && qDone;
            const isActive = (view.page === "module" || view.page === "quiz") && activeModIdx === mi;

            return (
              <div key={m.id}>
                <button onClick={() => goModule(mi)}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 14px", background: isActive ? T.accentBg : "transparent", border: "none", borderLeft: isActive ? `3px solid ${T.accent}` : "3px solid transparent", color: isActive ? T.accentL : T.t3, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all .1s" }}>
                  <span style={{ width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, background: allDone ? T.greenBg : T.bg3, color: allDone ? T.green : T.t4, flexShrink: 0 }}>
                    {allDone ? "✓" : mi + 1}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</span>
                </button>
              </div>
            );
          })}

          <div style={{ height: 1, background: T.border, margin: "6px 14px" }} />

          <button onClick={goFinal} disabled={!finalUnlocked}
            style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 14px", background: view.page === "final" ? T.accentBg : "transparent", border: "none", borderLeft: view.page === "final" ? `3px solid ${T.accent}` : "3px solid transparent", color: finalUnlocked ? (view.page === "final" ? T.accentL : T.t3) : T.t4, cursor: finalUnlocked ? "pointer" : "default", textAlign: "left", fontFamily: "inherit", opacity: finalUnlocked ? 1 : 0.45 }}>
            <span style={{ width: 20, height: 20, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, background: T.bg3, color: T.t4 }}>{finalUnlocked ? "F" : "🔒"}</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Evaluación Final</span>
          </button>
        </nav>
      </aside>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background: T.bg, color: T.t1, overflow: "hidden" }}>
      <SidebarContent />

      <main ref={mainRef} style={{ flex: 1, overflow: "auto" }}>
        {/* Global header */}
        <header style={{ padding: "12px 28px", borderBottom: `1px solid ${T.border}`, background: T.bg1, position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", gap: 12 }}>
          {view.page !== "home" && (
            <Btn variant="ghost" size="sm" onClick={view.page === "quiz" ? () => goModule(activeModIdx) : goHome} style={{ padding: "4px 8px", fontSize: 14 }}>←</Btn>
          )}
          <Breadcrumb />
        </header>

        {/* Content container */}
        <Container>
          {view.page === "home" && (
            <HomeView modules={MODULES} progress={progress} quizScores={quizScores} onSelectModule={mi => goModule(mi)} onSelectFinal={goFinal} finalUnlocked={finalUnlocked} />
          )}

          {view.page === "module" && lesson && (
            <>
              {/* Lesson navigation pills */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {mod.lessons.map((l, i) => (
                    <Pill key={i} active={activeLesIdx === i} done={progress[`${mod.id}-${i}`]} onClick={() => { setActiveLesIdx(i); scrollTop(); }}>
                      {i + 1}. {l.title.length > 28 ? l.title.slice(0, 28) + "…" : l.title}
                    </Pill>
                  ))}
                  <Pill active={false} done={quizScores[mod.id] >= 70} onClick={goQuiz}>Quiz</Pill>
                </div>
              </div>
              <LessonView lesson={lesson} onComplete={completeLesson} isComplete={progress[`${mod.id}-${activeLesIdx}`]} />
            </>
          )}

          {view.page === "quiz" && (
            <QuizView quiz={mod.quiz} moduleId={mod.id} onComplete={completeQuiz} onExit={() => goModule(activeModIdx)} existingScore={quizScores[mod.id]} />
          )}

          {view.page === "final" && (
            finalUnlocked
              ? <FinalExamView exam={FINAL_EXAM} onBack={goHome} />
              : <Section>
                  <P style={{ textAlign: "center", color: T.t4, padding: 40 }}>Completa todos los quizzes de módulos para desbloquear.</P>
                </Section>
          )}
        </Container>
      </main>
    </div>
  );
}
