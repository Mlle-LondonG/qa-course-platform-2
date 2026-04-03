import { useState, useCallback, useMemo, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   COURSE DATA — All modules, lessons, quizzes
   ═══════════════════════════════════════════ */

const MODULES = [
  {
    id: "m1", title: "Fundamentos del Testing", desc: "Qué es el testing, por qué existe, tipos, STLC/SDLC y el rol real del tester.",
    lessons: [
      {
        id: "m1l1", title: "Qué es el Testing y por qué existe",
        intro: "El testing no es 'verificar que funcione'. Es una disciplina de ingeniería cuyo objetivo es reducir el riesgo de fallos en producción que impacten al negocio, a los usuarios o a la reputación de la empresa.",
        concepts: [
          { title: "El costo exponencial de los bugs", text: "Un bug encontrado en requisitos cuesta x1. En desarrollo x10. En QA x100. En producción x1000. Knight Capital perdió $440M en 45 minutos por un bug en trading. Facebook expuso 50M de tokens por un error de autenticación. No son errores de 'malos desarrolladores' — son fallos sistémicos donde el testing fue insuficiente." },
          { title: "Por qué los humanos producen bugs", text: "Sesgo de confirmación: el developer prueba que SU código funciona, no que falle. Efecto de anclaje: si algo funcionó ayer, asumimos que funciona hoy. Complejidad combinatoria: una app con 20 campos de 10 opciones tiene 10²⁰ combinaciones posibles. Nadie puede probar todo — necesitas ESTRATEGIA." },
          { title: "Tu verdadero trabajo", text: "No buscas bugs. Buscas RIESGO. Tu trabajo es responder: '¿Qué tan confiados estamos en que este software hace lo que debe, no hace lo que no debe, y sobrevive condiciones adversas?'" }
        ],
        senior: "En Big Tech, el QA no es un gate al final del proceso. Es un multiplicador de calidad que opera desde el diseño del requisito hasta el monitoreo en producción. Si esperas al código para empezar a testear, llegaste tarde.",
        exercise: {
          title: "Análisis de Riesgo Real",
          scenario: "Eres el QA Lead asignado al checkout de un e-commerce que procesa $2M diarios. El equipo quiere lanzar 'Compra con un click' (similar a Amazon 1-Click).\n\nIdentifica los 5 riesgos más críticos que testearías ANTES de producción. Para cada uno define: qué podría salir mal, impacto al negocio, y cómo lo testearías.\n\nNO pienses en 'casos de prueba'. Piensa en RIESGO.",
          solution: "1. Doble cobro por click múltiple — Impacto: chargebacks masivos. Test: simular clicks rápidos, verificar idempotencia del endpoint.\n\n2. Race condition en inventario — Impacto: vender producto agotado. Test: 100 usuarios simultáneos comprando el último ítem.\n\n3. Método de pago expirado — Impacto: orden sin cobro. Test: tarjetas expiradas, fondos insuficientes, bloqueadas.\n\n4. Dirección de envío incorrecta por defecto — Impacto: re-envíos costosos. Test: múltiples direcciones, default eliminada.\n\n5. Fallo parcial en el flujo — Impacto: cobro sin orden o viceversa. Test: timeout del servicio de inventario post-cobro, verificar rollback."
        }
      },
      {
        id: "m1l2", title: "Tipos de Testing — Taxonomía Real",
        intro: "Cada tipo de testing existe por una razón específica. Si no sabes cuándo usar cada uno, desperdicias tiempo y recursos.",
        concepts: [
          { title: "Por nivel de ejecución", text: "Unit Testing: lo hace el developer, verifica una función aislada. Integration Testing: aquí empieza tu territorio — verificas que los componentes hablan correctamente. E2E Testing: flujo completo como usuario real, desde login hasta checkout. Es el más costoso y frágil, úsalo con criterio." },
          { title: "Por propósito", text: "Smoke Testing: '¿La app enciende?' — funcionalidades críticas en <15 min. Regression: lo que funcionaba SIGUE funcionando (70% de bugs en prod son regresiones). Sanity: subset enfocado de regression. Exploratory: testing con charter — 'En 30 min, exploro registro con datos extremos'." },
          { title: "La pirámide de testing", text: "70% unit, 20% integration, 10% E2E. Si tu suite E2E tiene 500 tests y tu integration tiene 50, tu arquitectura de testing está invertida y vas a sufrir con tests lentos y frágiles." }
        ],
        senior: "Un tester que dice 'voy a hacer testing exploratorio' sin un charter definido no está haciendo exploratory testing — está clickeando sin dirección. Siempre define: qué área, qué tipo de datos, cuánto tiempo, qué documentas.",
        exercise: {
          title: "Decide el Tipo de Testing",
          scenario: "Para cada escenario, decide qué tipo(s) de testing aplicarías y justifica:\n\n1. Se cambió el color de un botón de 'Comprar' de azul a verde.\n2. Se migró la DB de MySQL a PostgreSQL sin cambiar la API.\n3. Es viernes 4pm, hay un hotfix para un bug crítico en producción.\n4. El PM dice 'quiero asegurarme de que el checkout funciona bien en general'.",
          solution: "1. Visual regression test (screenshot comparison). Verifica que el click handler no se rompió.\n\n2. Integration testing extenso. Cada query debe retornar los mismos resultados. Performance comparison.\n\n3. Smoke testing SOLAMENTE del fix y área afectada. NO regression completo. Deploy con monitoreo activo.\n\n4. Esto NO es un requerimiento testeable. Tu respuesta: '¿Qué significa bien? ¿Qué escenarios te preocupan? ¿Cambió algo reciente?' Cuestionar requerimientos ambiguos es tu TRABAJO."
        }
      },
      {
        id: "m1l3", title: "STLC, SDLC y tu Rol Real",
        intro: "El error más común de un tester junior: esperar a que development termine para empezar a testear. En Big Tech, si esperas al código, llegaste tarde.",
        concepts: [
          { title: "STLC — Las 6 fases", text: "1. Análisis de Requisitos: encontrar ambigüedades y gaps ANTES del código. 2. Planificación: qué testeas, qué NO, herramientas, tiempo, criterios. 3. Diseño de Casos: técnicas formales, no improvisación. 4. Configuración del Ambiente: datos, staging, mocks. 5. Ejecución: correr tests, documentar, reportar. 6. Cierre: métricas, lecciones, qué se escapó y por qué." },
          { title: "En la práctica Agile", text: "Todo ocurre en un sprint de 2 semanas. El tester participa en refinement, estima esfuerzo de testing, hace shift-left (testing temprano) y shift-right (monitoreo en producción). No eres un paso en el proceso — eres un participante continuo." },
          { title: "Tu influencia real", text: "En Google, los SDET tienen la misma voz que los SWE. Pueden bloquear un release si la calidad no cumple el estándar. Esa autoridad se gana con CRITERIO, no con título." }
        ],
        senior: "Shift-left significa que tus preguntas en el refinement de una story evitan más bugs que tus tests en el sprint. Una sola pregunta sobre un edge case puede ahorrar 3 días de desarrollo y 2 bugs en producción.",
        exercise: {
          title: "Shift-Left en Acción",
          scenario: "Te entregan esta user story:\n\n'Como usuario, quiero poder resetear mi contraseña para acceder a mi cuenta cuando la olvide.'\n\nCriterios de aceptación:\n- El usuario recibe un email con un link de reset\n- El link expira en 24 horas\n- La nueva contraseña debe cumplir las políticas de seguridad\n\nANTES de que se escriba código, identifica al menos 8 preguntas o ambigüedades que deberías escalar.",
          solution: "1. ¿Múltiples resets invalidan links anteriores?\n2. 'Políticas de seguridad' — ¿cuáles exactamente? ¿Longitud? ¿Caracteres? ¿No repetir últimas N?\n3. ¿Rate limiting? ¿Cuántos intentos por hora?\n4. Si el email NO existe, ¿qué mensaje mostramos? (Decir 'no encontrado' permite enumeración de usuarios)\n5. ¿Link de un solo uso o múltiples dentro de 24h?\n6. ¿Qué pasa si cambia su email después de solicitar reset?\n7. ¿Se cierra sesión en todos los dispositivos post-cambio?\n8. ¿Notificación de que la contraseña fue cambiada?\n9. ¿Proxies de enterprise que hacen prefetch de links invalidan el token?\n10. ¿Interacción con 2FA?"
        }
      }
    ],
    quiz: [
      { q: "Un bug encontrado en requisitos cuesta x1. ¿Cuánto cuesta aproximadamente el mismo bug en producción?", opts: ["x10", "x100", "x1000", "x50"], correct: 2 },
      { q: "¿Cuál es la distribución correcta de la pirámide de testing?", opts: ["70% E2E, 20% Integration, 10% Unit", "70% Unit, 20% Integration, 10% E2E", "33% cada uno", "50% Integration, 30% Unit, 20% E2E"], correct: 1 },
      { q: "Un tester que 'hace exploratory testing sin charter definido' realmente está:", opts: ["Siendo creativo e innovador", "Clickeando sin dirección ni documentación", "Aplicando testing ágil correctamente", "Haciendo ad-hoc testing válido"], correct: 1 },
      { q: "¿Qué es shift-left testing?", opts: ["Testear más rápido", "Involucrar testing desde las fases más tempranas del desarrollo", "Mover los tests a la izquierda del dashboard", "Automatizar antes de diseñar"], correct: 1 },
      { q: "El PM dice 'quiero que el checkout funcione bien'. Tu respuesta profesional es:", opts: ["Testear todo el checkout exhaustivamente", "Preguntar qué significa 'bien', qué escenarios preocupan, si hubo cambios recientes", "Decir que no es tu responsabilidad definir eso", "Ejecutar el smoke test estándar"], correct: 1 },
      { q: "El 70% de los bugs en producción son:", opts: ["Bugs nuevos de features recientes", "Regresiones de código existente", "Problemas de performance", "Errores de UI/UX"], correct: 1 },
      { q: "¿Cuándo empieza el trabajo del tester en un sprint Agile?", opts: ["Cuando development termina", "En el refinement de la story", "Cuando el PM asigna las tareas", "El día del deploy"], correct: 1 }
    ]
  },
  {
    id: "m2", title: "Diseño de Pruebas", desc: "Técnicas formales para derivar casos de prueba: EP, BVA, tablas de decisión, state transition y RTM.",
    lessons: [
      {
        id: "m2l1", title: "Partición de Equivalencia y Valores Límite",
        intro: "Estas dos técnicas generan el mayor valor por esfuerzo invertido. Reducen miles de combinaciones posibles a un conjunto manejable y efectivo.",
        concepts: [
          { title: "Partición de Equivalencia (EP)", text: "Divide el dominio de entrada en clases donde todos los valores se comportan igual. Testeas UN valor por clase.\n\nEjemplo — Campo 'edad' para seguro de auto:\n• Inválida: < 18 (no puede contratar)\n• Válida 1: 18-25 (tarifa joven)\n• Válida 2: 26-65 (tarifa estándar)\n• Válida 3: 66-99 (tarifa senior)\n• Inválida: > 99 | no numérico | negativo | decimal\n\nCon 7 tests cubres un dominio de miles de valores." },
          { title: "Análisis de Valores Límite (BVA)", text: "Los bugs viven en los bordes. SIEMPRE. Si el rango es 18-65, testeas: 17, 18, 19, 64, 65, 66.\n\nEjemplo — Monto de transferencia bancaria (min $1, max $10,000):\n$0.99, $1.00, $1.01, $9,999.99, $10,000.00, $10,000.01\nTambién: $0.00, $0.01, -$0.01" },
          { title: "El error del junior", text: "Testear $5,000 porque 'es un valor intermedio'. Ese test no encuentra NADA que no encuentre $1.01. Desperdicias ejecución. En Big Tech, estas técnicas aplican a todo: strings (longitud 0, 1, max, max+1), arrays, timestamps." }
        ],
        senior: "Cuando un developer dice 'ya probé con datos normales y funciona', tu pregunta es: '¿Probaste en los límites?' El 80% de los bugs de validación están en los bordes, no en el medio del rango.",
        exercise: {
          title: "Diseña Tests con EP y BVA",
          scenario: "Formulario de registro de un servicio de streaming:\n\n- Username: 3-20 chars, alfanumérico, sin espacios\n- Contraseña: 8-64 chars, al menos 1 mayúscula, 1 número, 1 especial\n- Fecha de nacimiento: mayor de 13 años\n- Código postal: 5 dígitos (US)\n\nPara CADA campo: clases de equivalencia, valores límite, mínimo 3 casos.\nBonus: identifica interacciones ENTRE campos.",
          solution: "Username — EP válida: 'user123'. Inválidas: 'ab' (corto), 'user name' (espacio), 'user@!' (especiales). BVA: 2 chars (inválido), 3 (mínimo), 20 (máximo), 21 (inválido).\n\nContraseña — Inválidas: sin mayúscula, sin minúscula, sin número, sin especial, 7 chars. BVA: 7 (inválido), 8 (mínimo), 64 (máximo), 65 (inválido).\n\nInteracciones clave: ¿username = email prefix? ¿Username dentro de la contraseña (debería rechazarse)? ¿Exactamente 13 años HOY — qué zona horaria para calcular edad?"
        }
      },
      {
        id: "m2l2", title: "Tablas de Decisión y State Transition",
        intro: "Cuando el comportamiento depende de combinaciones de condiciones o estados del sistema, necesitas técnicas que mapeen la complejidad de forma sistemática.",
        concepts: [
          { title: "Tablas de Decisión", text: "Mapean todas las combinaciones de condiciones y su resultado esperado.\n\nEjemplo — Envío gratis en e-commerce:\nCondiciones: ¿Prime? ¿Monto > $50? ¿Producto elegible?\n\n2³ = 8 combinaciones, cada una es un caso de prueba. Sin la tabla, te pierdes combinaciones. Es matemática, no intuición." },
          { title: "State Transition Testing", text: "Para sistemas con estados definidos. Mapeas estados, transiciones válidas, transiciones INVÁLIDAS y guardas.\n\nEjemplo — Pedido: Pending → Paid → Processing → Shipped → Delivered. Pero también: Pending → Cancelled, Paid → Refunded.\n\nLo crítico: testear transiciones INVÁLIDAS. ¿Puedes pasar de Delivered a Pending? Si el sistema lo permite, tienes un bug." },
          { title: "Ubicuidad de state machines", text: "En Big Tech, los state machines están en todas partes: estados de usuario (active/suspended/banned), pagos, deployments, feature flags. Si no mapeas los estados, no puedes testear transiciones inválidas." }
        ],
        senior: "Las tablas de decisión son tu herramienta más poderosa en refinements. Cuando el PM dice 'si el usuario es premium Y tiene más de $100, envío gratis', tú preguntas: '¿Y las otras 6 combinaciones?' Eso es agregar valor.",
        exercise: {
          title: "State Transition de Cuenta Financiera",
          scenario: "Diseña el diagrama de transición para una cuenta de plataforma financiera (tipo PayPal):\n\nEstados: Pending Verification, Active, Suspended, Locked, Closed, Banned\n\nReglas: cuenta nueva en Pending, se activa con KYC, se suspende por actividad sospechosa, se bloquea tras 5 intentos fallidos, cierre voluntario, ban permanente por fraude.\n\nDefine: 1) Transiciones válidas, 2) 5 transiciones inválidas que DEBES verificar se rechacen, 3) Qué pasa con el saldo en cada transición.",
          solution: "Válidas: Pending→Active (KYC), Active→Suspended (sospecha), Active→Locked (5 intentos), Active→Closed (voluntario), Suspended→Active (legítima), Suspended→Banned (fraude), Locked→Active (reset password).\n\nInválidas críticas: Banned→Active (NUNCA, ban es permanente), Closed→Active (requiere nuevo registro), Pending→Suspended (no puedes suspender lo no activado), Banned→Closed (ban overrides todo).\n\nSaldo: Suspended=congelado, Closed=debe ser $0 antes, Banned=retenido para investigación legal."
        }
      },
      {
        id: "m2l3", title: "Casos de Prueba Profesionales y RTM",
        intro: "Un caso de prueba mal escrito es un caso que no puede ejecutar nadie más que tú. En Big Tech, tus casos deben ser autónomos, reproducibles y trazables.",
        concepts: [
          { title: "Anatomía de un caso profesional", text: "TC-LOGIN-001: Login exitoso con credenciales válidas\nPrecondiciones: Usuario registrado con email y password específicos\nAmbiente: Chrome 120+, staging\nPasos: Numerados, exactos, con datos específicos\nResultado esperado: Redirect a /dashboard en <3s, cookie de sesión creada\nPrioridad: P0 (smoke test)\nTrazabilidad: REQ-AUTH-001\n\nRegla: cualquier persona debe poder ejecutarlo y obtener el MISMO resultado." },
          { title: "Lo que NO es un caso de prueba", text: "'Verificar que el login funciona correctamente' — no dice nada. ¿Con qué datos? ¿Qué es 'correctamente'? ¿En qué browser? ¿Qué resultado esperas? Si alguien necesita preguntarte algo para ejecutar tu caso, está mal escrito." },
          { title: "Requirements Traceability Matrix (RTM)", text: "Tabla que mapea: Requisito → Caso(s) de prueba → Estado → Bugs. Si un requisito no tiene casos mapeados, NO ESTÁ CUBIERTO. Si un caso no mapea a ningún requisito, es un test huérfano. La RTM se mantiene viva cada sprint." }
        ],
        senior: "En Amazon, cada test case tiene un 'blast radius' asociado: si este test falla, ¿a cuántos usuarios y cuánto revenue afecta? Eso determina su prioridad y si bloquea el release o no.",
        exercise: {
          title: "Escribe Casos de Prueba Profesionales",
          scenario: "Feature: Carrito de compras con código de descuento.\n\nReglas:\n- Solo UN código por orden\n- 'SAVE10' da 10% de descuento\n- 'FLAT20' da $20 si total > $100\n- Los códigos expiran en fecha específica\n- No aplica a categoría 'Clearance'\n- El envío NO se descuenta\n\nEscribe 8 casos profesionales (formato completo). Incluye al menos 2 negativos y 1 de interacción entre reglas.",
          solution: "TC-CART-001: Aplicar SAVE10 a orden de $200 (items regulares) → descuento $20, total $180.\nTC-CART-002: Aplicar FLAT20 a orden de $150 → descuento $20, total $130.\nTC-CART-003 (negativo): Aplicar FLAT20 a orden de $80 → rechazado, mensaje 'Mínimo $100'.\nTC-CART-004 (negativo): Aplicar código expirado → rechazado con mensaje claro.\nTC-CART-005: Intentar aplicar dos códigos → segundo rechazado.\nTC-CART-006 (interacción): SAVE10 en carrito mixto (items regulares $100 + clearance $50) → descuento solo sobre $100 = $10.\nTC-CART-007: Verificar que envío $9.99 NO se descuenta con SAVE10.\nTC-CART-008: Aplicar SAVE10, luego eliminar items hasta $0 → descuento recalculado."
        }
      }
    ],
    quiz: [
      { q: "En Partición de Equivalencia, ¿cuántos valores se testean por clase?", opts: ["Todos los posibles", "Uno representativo", "Tres: mínimo, medio, máximo", "Depende del tamaño de la clase"], correct: 1 },
      { q: "¿Dónde se encuentran la mayoría de bugs de validación?", opts: ["En valores intermedios del rango", "En los bordes/límites del rango", "En valores nulos", "En valores negativos"], correct: 1 },
      { q: "Una tabla de decisión con 4 condiciones binarias genera:", opts: ["4 combinaciones", "8 combinaciones", "16 combinaciones", "32 combinaciones"], correct: 2 },
      { q: "En State Transition testing, ¿qué es MÁS importante testear?", opts: ["Solo las transiciones válidas (happy path)", "Las transiciones INVÁLIDAS que el sistema debe rechazar", "Solo el estado inicial y final", "Las transiciones más frecuentes"], correct: 1 },
      { q: "Un caso de prueba que dice 'verificar que el login funciona correctamente' es:", opts: ["Aceptable para smoke testing", "Insuficiente — falta datos, pasos exactos y resultado esperado", "Válido si el equipo ya conoce el sistema", "Un buen caso de alto nivel"], correct: 1 },
      { q: "Si un requisito no tiene casos de prueba mapeados en la RTM:", opts: ["Es normal en Agile", "No está cubierto por testing", "Se cubre con exploratory testing", "El developer lo cubrió con unit tests"], correct: 1 }
    ]
  },
  {
    id: "m3", title: "Bugs y Gestión de Calidad", desc: "Documentación profesional de bugs, severidad vs prioridad con criterio real, y gestión de defectos.",
    lessons: [
      {
        id: "m3l1", title: "Documentación de Bugs — El Arte de la Precisión",
        intro: "Un bug mal documentado es un bug que no se arregla. En Big Tech, tu reporte de bug es tu credibilidad profesional.",
        concepts: [
          { title: "Estructura profesional de un bug report", text: "Título: descriptivo y buscable. NO 'Login no funciona'. SÍ 'Login returns 500 when email contains + character'.\n\nAmbiente: OS, browser, API version, staging/prod, fecha/hora.\nPasos: Exactos, numerados, con DATOS ESPECÍFICOS. Un developer debe reproducirlo en <5 minutos.\nResultado actual: Lo que pasó, con evidencia (screenshot, video, logs, HTTP response).\nResultado esperado: Según spec, requisito o sentido común.\nFrecuencia: Siempre / Intermitente (3 de 10) / Una vez.\nImpacto: Quién se afecta, cuántos usuarios, impacto al negocio." },
          { title: "Severidad vs Prioridad", text: "Severidad = impacto TÉCNICO. Critical: sistema caído, pérdida de datos, breach. High: funcionalidad core rota sin workaround. Medium: rota con workaround. Low: cosmético.\n\nPrioridad = urgencia de NEGOCIO. P0: hotfix now. P1: este sprint. P2: próximo sprint. P3: backlog.\n\nUn typo en el nombre del CEO en landing = severidad LOW, prioridad P0.\nUn crash en un flujo del 0.1% de usuarios = severidad CRITICAL, puede ser P2." },
          { title: "Regla de oro", text: "El tester asigna severidad. El PO/PM asigna prioridad. Si mezclas ambos, pierdes poder de comunicación. Tu rol es dar la información correcta para que el equipo tome la decisión correcta." }
        ],
        senior: "Un bug report excelente incluye una hipótesis: 'Posiblemente el endpoint no sanitiza el carácter + en el email antes de la query SQL.' Esto acelera el fix y demuestra que entiendes el sistema, no solo la superficie.",
        exercise: {
          title: "Documenta Este Bug",
          scenario: "Testeando app de delivery. Pedido de $45.50, cupón WELCOME50 (50% off para nuevos usuarios). Descuento aplicado correctamente ($22.75). Pagaste con tarjeta, pedido confirmado.\n\nPero: en historial de pedidos muestra $45.50 (sin descuento). En el email de confirmación muestra $22.75 (correcto). En el statement de tarjeta: $22.75 (correcto).\n\nEscribe el bug report completo. Define severidad y prioridad con justificación.",
          solution: "Título: Order history displays pre-discount amount ($45.50) instead of final charged amount ($22.75) after WELCOME50 coupon\n\nSeveridad: Medium — No hay pérdida financiera (cobro correcto), pero genera confusión y tickets de soporte.\n\nPrioridad: P1 — Nuevos usuarios (target del cupón) verán discrepancia. Genera desconfianza y llamadas a soporte. Impacta retention.\n\nHipótesis: Order history lee subtotal pre-descuento en lugar del total post-descuento de la tabla de transacciones."
        }
      },
      {
        id: "m3l2", title: "Criterio Real para Clasificar Bugs",
        intro: "La diferencia entre un tester junior y uno senior no es encontrar más bugs — es saber clasificarlos correctamente y comunicar su impacto real.",
        concepts: [
          { title: "Red flags de bugs críticos", text: "1. Cualquier bug que involucre dinero (cobro incorrecto, doble cobro)\n2. Exposición de datos de otro usuario\n3. Bypass de autenticación/autorización\n4. Pérdida de datos irrecuperable\n5. Bloqueo del flujo principal para >5% de usuarios\n\nSi encuentras alguno de estos, no esperes al próximo standup. Escala INMEDIATAMENTE." },
          { title: "El dilema de priorización", text: "Escenario real: 6 bugs reportados, capacidad para arreglar 3 este sprint. El tester junior los lista por severidad. El tester senior cruza severidad con: usuarios afectados, impacto en revenue, si hay workaround, si es regresión (estaba funcionando antes), y riesgo de que empeore." },
          { title: "No todo bug merece un fix", text: "Tu trabajo no es pedir que se arreglen todos los bugs. Es dar la información para que el equipo decida correctamente. A veces la respuesta correcta es 'aceptamos el riesgo' — y eso está bien si la decisión es informada." }
        ],
        senior: "En Amazon hay un concepto: 'one-way door' vs 'two-way door'. Un bug que causa pérdida de datos es one-way (irreversible) — SIEMPRE es P0. Un bug visual que se puede hotfixear es two-way — puede esperar.",
        exercise: {
          title: "Clasifica y Prioriza",
          scenario: "6 bugs, capacidad para 3 este sprint:\n\n1. App crashea al tomar foto de perfil en iPhone 12 / iOS 17\n2. Botón 'Cancelar suscripción' no funciona (usuario debe llamar a soporte)\n3. Emails transaccionales con 30 min de delay\n4. Dashboard admin muestra métricas del día anterior\n5. Memory leak: app web lenta después de 4h de uso continuo\n6. Búsqueda con filtro de precio devuelve orden incorrecto\n\nClasifica cada uno y elige los 3 para este sprint.",
          solution: "Priorizo: #2 (P0 — posible violación legal, usuarios atrapados en suscripción), #1 (P1 — crash es siempre visible, iPhone 12 es dispositivo común), #3 (P1 — emails de transacción tardíos causan ansiedad y tickets de soporte).\n\nDejan para próximo sprint: #5 (afecta uso prolongado, minoría), #4 (admin-only, menor impacto), #6 (molesto pero no bloquea compra).\n\nClave: #2 podría ser P0 legal si estás en jurisdicciones donde cancelar suscripción debe ser tan fácil como suscribirse (California, UE)."
        }
      }
    ],
    quiz: [
      { q: "Un typo en el nombre del CEO en la landing page tiene:", opts: ["Severidad HIGH, Prioridad P0", "Severidad LOW, Prioridad P0", "Severidad LOW, Prioridad P3", "Severidad MEDIUM, Prioridad P1"], correct: 1 },
      { q: "¿Quién asigna la prioridad de un bug?", opts: ["El tester", "El developer", "El Product Owner / PM", "El QA Lead"], correct: 2 },
      { q: "Un endpoint que devuelve datos de OTRO usuario al cambiar el ID en la URL es:", opts: ["Severidad Medium, posible P2", "Severidad Critical, P0 inmediato", "Severidad Low si nadie lo reportó", "Severidad High, P1"], correct: 1 },
      { q: "Un crash que afecta al 0.1% de usuarios es:", opts: ["Severidad Low porque afecta pocos usuarios", "Severidad Critical — un crash siempre es critical", "Severidad Medium con workaround", "No es un bug, es un edge case"], correct: 1 },
      { q: "La hipótesis en un bug report sirve para:", opts: ["Demostrar que sabes programar", "Acelerar el fix y mostrar comprensión del sistema", "Asignar el bug al developer correcto", "Cubrir tu responsabilidad legal"], correct: 1 }
    ]
  },
  {
    id: "m4", title: "Herramientas del Tester", desc: "Jira, Postman, SQL y Git — las herramientas esenciales que usarás a diario.",
    lessons: [
      {
        id: "m4l1", title: "Jira, Postman y SQL para Testing",
        intro: "No basta con saber que existen estas herramientas. Necesitas dominar los patrones que te hacen productivo en el día a día.",
        concepts: [
          { title: "Jira avanzado para QA", text: "No solo creas tickets. Un tester senior usa Jira para:\n\n• Dashboards de calidad: bugs abiertos por severidad, por módulo, velocity de fix\n• JQL avanzado: project = CHECKOUT AND type = Bug AND severity = Critical AND status != Closed AND created >= -30d\n• Workflows de bug lifecycle: Open → In Progress → In Review → Verified → Closed\n• Trazabilidad: linkear bugs a test cases y stories" },
          { title: "API Testing con Postman", text: "En el mundo moderno, el 80% del testing crítico es a nivel de API.\n\nDomina: construir requests GET/POST/PUT/DELETE, variables de ambiente (staging vs prod), tests automatizados en la tab Tests, collections con flujos completos (register → login → create order), pre-request scripts para datos dinámicos." },
          { title: "SQL para investigación", text: "Queries esenciales:\n\nSELECT * FROM orders WHERE user_id = 123 AND status = 'pending';\n\nSELECT o.id, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.total != o.subtotal - o.discount;\n\nEsa última query encuentra inconsistencias que la UI NUNCA te mostraría. Git básico: clone, pull, branch, checkout, log, diff — para ver qué cambió y enfocar tu regression." }
        ],
        senior: "Un tester que solo usa la UI para verificar bugs es un tester a medias. El 50% de los bugs están en la capa de datos y solo los encuentras consultando la base de datos directamente.",
        exercise: {
          title: "Investigación con SQL",
          scenario: "Tablas: users (id, email, plan_type, created_at), orders (id, user_id, total, discount, final_amount, status), payments (id, order_id, amount, payment_method, status).\n\nReportan: 'Algunos usuarios Premium no recibieron su descuento del 15%.'\n\nEscribe las queries para: 1) Encontrar órdenes Premium sin descuento correcto, 2) Verificar si el cobro coincide con final_amount, 3) Desde cuándo empezó el problema.",
          solution: "1. SELECT o.id, u.email, o.total, o.discount, ROUND(o.total * 0.15, 2) AS expected FROM orders o JOIN users u ON o.user_id = u.id WHERE u.plan_type = 'premium' AND o.discount != ROUND(o.total * 0.15, 2) ORDER BY o.created_at DESC;\n\n2. SELECT o.id, o.final_amount, p.amount, (o.final_amount - p.amount) AS diff FROM orders o JOIN payments p ON p.order_id = o.id WHERE o.final_amount != p.amount AND p.status = 'completed';\n\n3. SELECT MIN(o.created_at) FROM orders o JOIN users u ON o.user_id = u.id WHERE u.plan_type = 'premium' AND o.discount != ROUND(o.total * 0.15, 2);"
        }
      }
    ],
    quiz: [
      { q: "¿Qué porcentaje del testing crítico moderno ocurre a nivel de API?", opts: ["30%", "50%", "80%", "95%"], correct: 2 },
      { q: "JQL en Jira sirve para:", opts: ["Escribir tests automatizados", "Hacer queries avanzadas de tickets", "Conectar con la base de datos", "Generar reportes de código"], correct: 1 },
      { q: "¿Por qué un tester necesita SQL?", opts: ["Para crear tablas de la base de datos", "Para verificar datos que la UI no muestra y encontrar inconsistencias", "Para optimizar queries del backend", "Solo si no hay developer disponible"], correct: 1 },
      { q: "Git diff es útil para un tester porque:", opts: ["Permite escribir código más rápido", "Muestra qué cambió en el último commit para enfocar regression", "Es requerido por Jira", "Permite hacer merge de branches"], correct: 1 }
    ]
  },
  {
    id: "m5", title: "Automatización de Testing", desc: "Cuándo automatizar, cuándo no, Playwright en la práctica, y CI/CD para testers.",
    lessons: [
      {
        id: "m5l1", title: "Estrategia de Automatización",
        intro: "La automatización no es un objetivo — es una herramienta. El anti-patrón más costoso de la industria es automatizar todo sin estrategia.",
        concepts: [
          { title: "Cuándo SÍ automatizar", text: "• Lo que ejecutas más de 3 veces y es estable\n• Smoke tests que corren en cada build\n• Regression de flujos core (login, checkout, CRUD)\n• Validaciones de API (contratos, schemas, status codes)\n• Data validation automatizada contra DB\n• Tests de performance recurrentes" },
          { title: "Cuándo NO automatizar", text: "• Exploratory testing (por definición no automatizable)\n• Tests que cambian cada sprint (alto costo de mantenimiento)\n• UX/usabilidad (necesitan juicio humano)\n• Features inestables en desarrollo activo\n• Validaciones one-time" },
          { title: "El anti-patrón de los 2000 E2E tests", text: "Equipos que automatizan todo terminan con: suite de 4 horas, 30% de tests flaky, nadie confía en los resultados, más tiempo manteniendo tests que testeando. La pirámide aplicada: 70% API/integration (rápidos, estables), 20% componente, 10% E2E (solo happy paths críticos)." }
        ],
        senior: "En Meta, la regla es: si un test automatizado falla más de 2 veces sin ser un bug real (flaky), se desactiva automáticamente y se crea un ticket para arreglarlo. Un test flaky es PEOR que no tener test — genera fatiga de alertas.",
        exercise: {
          title: "Decide Qué Automatizar",
          scenario: "App de gestión de proyectos. Capacidad: 20 tests esta semana. Candidatos:\n\n1. Login email/password\n2. Login con Google SSO\n3. Crear proyecto nuevo\n4. Drag and drop de tareas\n5. Invitar usuario al workspace\n6. Filtrar tareas por fecha/asignado/prioridad\n7. Subir archivos adjuntos\n8. Notificaciones en tiempo real\n9. Exportar proyecto a CSV\n10. Cambiar theme light/dark\n11. API: CRUD de tareas\n12. API: Permisos (viewer no puede editar)\n13. API: Rate limiting de búsqueda\n14. Flujo completo: crear → asignar → completar → archivar\n\n¿Cuáles priorizas?",
          solution: "Top priority (automatizar): #1 (smoke, cada build), #11 (API CRUD = alto ROI, estable, rápido), #12 (seguridad, crítico), #3 (flujo core), #14 (E2E happy path principal), #6 (regression frecuente), #13 (previene abuso).\n\nNO automatizar: #4 (drag&drop es frágil en automation), #8 (real-time es complejo y flaky), #10 (bajo valor), #2 (SSO requiere mocks complejos, testear manualmente).\n\nClave: priorizamos API tests sobre E2E por estabilidad y velocidad."
        }
      },
      {
        id: "m5l2", title: "Playwright en la Práctica",
        intro: "Playwright es la herramienta moderna de automatización. Soporta múltiples browsers, tiene auto-wait inteligente y network interception.",
        concepts: [
          { title: "Estructura profesional", text: "// tests/auth/login.spec.js\ntest.describe('Login Flow', () => {\n  test('successful login', async ({ page }) => {\n    await page.goto('/login');\n    await page.fill('[data-testid=\"email\"]', 'test@co.com');\n    await page.fill('[data-testid=\"password\"]', 'ValidP@ss1');\n    await page.click('[data-testid=\"login-btn\"]');\n    await expect(page).toHaveURL('/dashboard');\n  });\n});\n\nUsa data-testid, NUNCA selectores CSS frágiles." },
          { title: "Buenas prácticas", text: "1. Page Object Model para reusabilidad\n2. Datos de prueba independientes (cada test crea su data)\n3. Tests paralelos e independientes (sin dependencias entre tests)\n4. Assertions explícitas y descriptivas\n5. Screenshots y traces automáticos en fallo\n6. Retry configurado para flaky tests (máximo 1)" },
          { title: "CI/CD Integration", text: "En Big Tech, tests corren en cada PR. Si falla, merge bloqueado automáticamente. Se configura en GitHub Actions, Jenkins o CircleCI. El tester es responsable de que la suite sea confiable — un test flaky que bloquea deploys es un problema de TU equipo." }
        ],
        senior: "El Page Object Model no es opcional. Sin él, cuando cambia un selector, actualizas 47 tests. Con él, actualizas 1 archivo. La diferencia entre un framework mantenible y uno que abandonas en 3 meses.",
        exercise: {
          title: "Escribe Tests Automatizados",
          scenario: "Escribe el código Playwright para:\n\n1. Buscar producto por nombre\n2. Seleccionar primer resultado\n3. Elegir cantidad: 2\n4. Agregar al carrito\n5. Ir al carrito\n6. Verificar item con cantidad 2\n7. Verificar total correcto (precio × 2)\n8. Proceder a checkout\n\nIncluye: manejo de esperas, assertions significativas, y un caso negativo (producto agotado).",
          solution: "test('add to cart and verify total', async ({ page }) => {\n  await page.goto('/products');\n  await page.fill('[data-testid=\"search\"]', 'Wireless Mouse');\n  await page.click('[data-testid=\"product-card\"]:first-child');\n  await page.selectOption('[data-testid=\"qty\"]', '2');\n  const price = await page.textContent('[data-testid=\"price\"]');\n  await page.click('[data-testid=\"add-to-cart\"]');\n  await page.goto('/cart');\n  await expect(page.locator('[data-testid=\"qty-display\"]')).toHaveText('2');\n  const expectedTotal = parseFloat(price.replace('$','')) * 2;\n  await expect(page.locator('[data-testid=\"total\"]')).toContainText(expectedTotal.toString());\n});\n\ntest('out of stock shows message', async ({ page }) => {\n  // Navigate to known OOS product\n  await page.goto('/products/oos-item-123');\n  await expect(page.locator('[data-testid=\"add-to-cart\"]')).toBeDisabled();\n  await expect(page.locator('[data-testid=\"stock-msg\"]')).toContainText('Out of Stock');\n});"
        }
      }
    ],
    quiz: [
      { q: "¿Cuál es el anti-patrón más costoso en automatización?", opts: ["No automatizar nada", "Automatizar TODO sin estrategia", "Usar Selenium en vez de Playwright", "No usar CI/CD"], correct: 1 },
      { q: "¿Por qué un test flaky es peor que no tener test?", opts: ["Porque es más lento", "Porque genera fatiga de alertas y nadie confía en los resultados", "Porque consume más recursos del servidor", "Porque es difícil de debuggear"], correct: 1 },
      { q: "La distribución ideal de tests automatizados es:", opts: ["70% E2E, 20% Integration, 10% Unit", "70% API/Integration, 20% Componente, 10% E2E", "50% E2E, 50% API", "Depende del proyecto, no hay regla"], correct: 1 },
      { q: "¿Por qué se prefieren selectores data-testid sobre selectores CSS?", opts: ["Son más rápidos de ejecutar", "Son estables ante cambios de diseño y estructura CSS", "Son requeridos por Playwright", "Mejoran la accesibilidad"], correct: 1 },
      { q: "Page Object Model se usa para:", opts: ["Mejorar la performance de los tests", "Centralizar selectores y reducir mantenimiento", "Conectar con la base de datos", "Generar reportes automáticos"], correct: 1 }
    ]
  },
  {
    id: "m6", title: "Testing Avanzado", desc: "Performance testing, seguridad básica, microservicios, contract testing y chaos engineering.",
    lessons: [
      {
        id: "m6l1", title: "Performance, Seguridad y Microservicios",
        intro: "En sistemas distribuidos modernos, el testing funcional es solo el punto de partida. Los fallos más costosos son de performance, seguridad e integración entre servicios.",
        concepts: [
          { title: "Performance Testing", text: "Load Testing: ¿soporta 1000 usuarios simultáneos? Stress: ¿cuándo se rompe? Soak: ¿se degrada en 24h? Spike: ¿sobrevive Black Friday?\n\nHerramientas: k6, JMeter, Gatling, Locust.\nMétricas clave: response time (p50, p95, p99), throughput (RPS), error rate.\n\nEl p99 es lo que importa en Big Tech. Si p50=200ms pero p99=5s, con 10M usuarios son 100K personas con experiencia terrible." },
          { title: "Security Testing básico", text: "OWASP Top 10 que TODO QA debe testear:\n1. Injection: ¿qué pasa con <script>alert('xss')</script> en un campo?\n2. Broken Auth: ¿acceso sin login? ¿tokens expiran?\n3. IDOR: cambiar /api/users/123 a /124 ¿muestra datos de otro?\n4. CSRF: ¿puedo forzar acciones sin consentimiento?\n\nNo necesitas ser pentester, pero sí cubrir lo básico." },
          { title: "Microservicios y Contract Testing", text: "En microservicios, un bug puede ser la INTERACCIÓN entre 3 servicios. Contract Testing (Pact): cada servicio define qué produce/consume — si cambia, el contrato se rompe ANTES del deploy. Chaos Engineering: inyectar fallos deliberados. ¿Qué pasa si el servicio de pagos tiene 5s de latencia?" }
        ],
        senior: "En Netflix, Chaos Monkey apaga servidores aleatoriamente en producción. No porque sean irresponsables, sino porque la resiliencia no se asume — se prueba. Si tu sistema no sobrevive la pérdida de un nodo, no está listo para producción.",
        exercise: {
          title: "Plan de Testing para Microservicios",
          scenario: "Plataforma ride-sharing (tipo Uber). Servicios: User, Ride, Payment, Notification, Pricing.\n\nPricing Service fue actualizado con 'surge pricing'. El cambio solo fue en Pricing pero afecta Ride y Payment.\n\nDiseña: 1) Tests por servicio, 2) Contract tests entre servicios, 3) Escenario de chaos engineering, 4) Cómo verificar consistencia de precio entre lo que ve el usuario, lo que cobra Payment, y el recibo.",
          solution: "1. Pricing Service: unit tests de la nueva lógica, integration con datos históricos de demanda. Ride Service: regression de matching, verificar que consume nuevo schema de precios. Payment: regression de cobros.\n\n2. Contract tests: Pricing↔Ride (schema de tarifa), Pricing↔Payment (monto a cobrar), Ride↔Notification (datos del viaje).\n\n3. Chaos: Pricing Service con latencia de 10s. ¿Ride Service muestra precio al usuario? ¿Timeout? ¿Fallback a tarifa base? ¿Payment cobra sin confirmar precio?\n\n4. Consistencia: tracing de un request desde la UI hasta Payment. El precio mostrado al solicitar = precio en el cobro = precio en el recibo. Test con surge activo e inactivo."
        }
      }
    ],
    quiz: [
      { q: "¿Qué métrica de latencia importa más en Big Tech?", opts: ["p50 (mediana)", "p95", "p99", "Promedio"], correct: 2 },
      { q: "IDOR (Insecure Direct Object Reference) permite:", opts: ["Inyectar código SQL", "Acceder a datos de otro usuario cambiando un ID en la URL", "Ejecutar JavaScript malicioso", "Suplantar sesiones"], correct: 1 },
      { q: "Contract Testing en microservicios verifica:", opts: ["Que cada servicio es rápido", "Que los servicios respetan el formato de datos acordado", "Que hay suficientes réplicas", "Que el deployment fue exitoso"], correct: 1 },
      { q: "Chaos Engineering consiste en:", opts: ["Testear sin plan ni documentación", "Inyectar fallos deliberados para validar resiliencia", "Ejecutar tests aleatorios en producción", "Permitir que los usuarios encuentren bugs"], correct: 1 }
    ]
  },
  {
    id: "m7", title: "Metodologías Ágiles para QA", desc: "Scrum aplicado, rol del tester en el sprint, ceremonias y anti-patrones reales.",
    lessons: [
      {
        id: "m7l1", title: "Scrum Sin Teoría Vacía",
        intro: "Scrum no es un framework teórico. Es cómo trabajan los equipos que entregan software cada 2 semanas. Como tester, tu participación define si la calidad es parte del proceso o un afterthought.",
        concepts: [
          { title: "El sprint para un tester", text: "Sprint = 2 semanas. Día 1: Sprint Planning. Días 2-9: desarrollo + testing en paralelo. Día 10: release.\n\nEl tester NO espera a que development termine. Mientras devs implementan Story A, tú testeas Story B (del sprint anterior o ya completada) Y preparas los test cases de Story C.\n\nVelocidad de un equipo no es cuántas stories completan — es cuántas stories pasan DONE (incluido testing)." },
          { title: "Ceremonias y tu rol real", text: "Planning: estimas esfuerzo de testing, cuestionas stories ambiguas.\nDaily: reportas bloqueos, avance de testing, bugs encontrados (15s, no 5 min).\nReview: demuestras la calidad, no solo el feature. 'Testeamos estos escenarios, encontramos 3 bugs, 2 arreglados, 1 aceptado como known issue.'\nRetro: propones mejoras al proceso de calidad, no solo quejas." },
          { title: "Definition of Done", text: "Una story NO está 'Done' hasta que:\n• Code complete + code reviewed\n• Tests unitarios pasan\n• Testing funcional completado\n• Bugs críticos/altos resueltos\n• Regression no roto\n• Documentación actualizada\n\nSi tu equipo marca stories como Done antes del testing, tienen un problema sistémico." }
        ],
        senior: "El tester que más valor agrega en Agile no es el que encuentra más bugs en ejecución — es el que previene más bugs en planning. Una pregunta en refinement sobre un edge case ahorra 2 días de desarrollo y 3 bugs en testing.",
        exercise: {
          title: "Simulación de Sprint",
          scenario: "Sprint de 2 semanas. Tu equipo tiene:\n• 3 developers\n• 1 tester (tú)\n• 5 user stories comprometidas\n\nDía 3: Story 1 está en code review. Story 2 está en desarrollo. Stories 3-5 no han empezado.\nDía 5: Story 1 tiene 2 bugs (1 High, 1 Medium). Developer dice 'los arreglo mañana'. Story 2 llega a testing.\nDía 8: Bug High de Story 1 sigue abierto. Stories 3-4 llegan a testing simultáneamente. Story 5 está atrasada.\nDía 9: PM pregunta '¿vamos a entregar las 5 stories?'\n\nPara cada día, describe exactamente qué haces y qué comunicas al equipo.",
          solution: "Día 3: Preparo test cases de Story 2 mientras espero Story 1. Reviso la spec de Stories 3-5 (shift-left). Reporto en daily: 'Story 1 pendiente, preparando testing para Stories 2-5.'\n\nDía 5: Ejecuto testing de Story 2, documento bugs de Story 1 con prioridad clara. En daily: 'Story 1 bloqueada por Bug-High. Story 2 en testing. Risk flag: si el High no se arregla mañana, Story 1 no sale este sprint.'\n\nDía 8: Priorizo: Story 1 Bug-High es BLOQUEO — escalo al Scrum Master. Testeo Stories 3-4 en paralelo enfocándome en happy paths + critical paths. Story 5: flag como riesgo.\n\nDía 9: 'Realísticamente entregaremos 3-4 stories. Story 1 depende del fix del High. Story 5 no completará testing a tiempo. Recomiendo: mover Story 5 al próximo sprint y concentrar esfuerzo en Stories 1-4.'"
        }
      },
      {
        id: "m7l2", title: "Anti-patrones del QA en Agile",
        intro: "Conocer los anti-patrones es tan importante como conocer las buenas prácticas. Estos son los errores que destruyen la efectividad del tester en un equipo Agile.",
        concepts: [
          { title: "QA Pasivo", text: "El tester que solo ejecuta tests que le asignan. No cuestiona requisitos, no participa en planning, no propone mejoras. Es un ejecutor, no un ingeniero de calidad. En Big Tech, este perfil no sobrevive.\n\nSolución: participa activamente en cada ceremonia. Tu voz en refinement vale tanto como la del developer." },
          { title: "QA Tardío", text: "El equipo termina de desarrollar el jueves y 'pasa a QA' el viernes. El tester tiene 1 día para testear 5 stories. Resultado: testing superficial, bugs en producción.\n\nSolución: testing paralelo al desarrollo. Mientras Story A se desarrolla, preparas tests. Cuando llega, ejecutas inmediatamente." },
          { title: "QA Aislado", text: "El tester que trabaja solo, no hace pair testing con developers, no comparte su estrategia de testing. El resultado: duplicación de esfuerzo, gaps de cobertura.\n\nSolución: pair testing sessions, compartir test strategy en planning, feedback loops cortos con developers." },
          { title: "QA Policía", text: "El tester que bloquea todo, rechaza stories por bugs cosméticos, crea fricción constante. El equipo lo ve como obstáculo, no como aliado.\n\nSolución: criterio. No todo bug bloquea. Clasifica por severidad, negocia con el equipo, acepta riesgos calculados." }
        ],
        senior: "El mejor indicador de un buen tester en Agile no es su bug count. Es si los developers dicen: 'Quiero que revises mi story antes de empezar a codear.' Cuando el equipo te busca proactivamente, estás haciendo tu trabajo bien.",
        exercise: {
          title: "Identifica los Anti-patrones",
          scenario: "Lee estas situaciones y determina qué anti-patrón representa cada una. Propón la corrección:\n\n1. En el planning, el tester no dice nada. Después se queja de que las stories estaban mal definidas.\n2. El tester rechaza un release porque un tooltip tiene un typo.\n3. El último día del sprint, el tester recibe 4 stories para testear simultáneamente.\n4. El tester nunca habla con los developers sobre su approach de testing.\n5. Cuando le piden estimar esfuerzo de testing, dice 'no sé, depende'.",
          solution: "1. QA Pasivo — Debería cuestionar en planning, no después.\n2. QA Policía — Un typo en tooltip es Low/P3, no bloquea release.\n3. QA Tardío (problema sistémico) — Testing debe ser paralelo, no secuencial.\n4. QA Aislado — Pair testing y comunicar strategy evitarían gaps.\n5. QA Pasivo + falta de madurez — Debería poder estimar basándose en complejidad y riesgo de la story."
        }
      }
    ],
    quiz: [
      { q: "En Scrum, una story está 'Done' cuando:", opts: ["El developer termina de codear", "El code review pasa", "Testing funcional completado y bugs críticos resueltos", "El PM la aprueba"], correct: 2 },
      { q: "El tester agrega MÁS valor en:", opts: ["La ejecución de tests", "El refinement y planning (shift-left)", "El reporte de bugs", "La retrospectiva"], correct: 1 },
      { q: "QA Tardío significa:", opts: ["El tester llega tarde al daily", "Testing se hace al final del sprint sin tiempo suficiente", "El tester es nuevo en el equipo", "Los bugs se reportan después del release"], correct: 1 },
      { q: "Un tester que bloquea releases por bugs cosméticos es:", opts: ["Un tester riguroso y profesional", "Un ejemplo de QA Policía — falta criterio de priorización", "El estándar en Big Tech", "Correcto si la empresa tiene altos estándares"], correct: 1 },
      { q: "El mejor indicador de un buen tester en Agile es:", opts: ["Bug count alto", "Coverage del 100%", "Que los developers lo busquen proactivamente para revisar su trabajo", "Que el PM esté satisfecho"], correct: 2 }
    ]
  },
  {
    id: "m8", title: "Mentalidad y Soft Skills", desc: "Cómo piensa un tester de elite, comunicación, decisiones bajo incertidumbre y entrevistas Big Tech.",
    lessons: [
      {
        id: "m8l1", title: "Mentalidad de un Tester de Elite",
        intro: "La diferencia entre un tester y un gran tester no es técnica. Es mentalidad. Los mejores testers piensan diferente.",
        concepts: [
          { title: "Mentalidad destructiva constructiva", text: "Tu trabajo no es confirmar que funciona. Es encontrar cómo se rompe. Pero NO para destruir, sino para PROTEGER.\n\nAntes de testear, pregúntate:\n• ¿Cómo usaría esto un usuario distraído?\n• ¿Cómo abusaría esto un usuario malicioso?\n• ¿Qué pasa cuando el sistema está bajo presión?\n• ¿Qué asumió el developer que 'nunca pasaría'?" },
          { title: "Comunicación con developers", text: "NUNCA: 'Tu código tiene un bug.'\nSIEMPRE: 'Encontré un comportamiento inesperado en el flujo X. Cuando hago Y, el resultado es Z, pero según el requisito debería ser W. ¿Puede ser intencional?'\n\nLa diferencia: respeto + datos + pregunta abierta." },
          { title: "Decisiones bajo incertidumbre", text: "No siempre tendrás toda la información. Framework: '¿Cuál es el peor escenario si lanzamos con este bug? ¿Es reversible? ¿Tenemos monitoring para detectarlo rápido?'\n\nOwnership real: no digas 'yo reporté el bug, no es mi problema si no lo arreglan.' Tu responsabilidad es la calidad del PRODUCTO, no tu bug count." }
        ],
        senior: "En Google, los ingenieros de testing más respetados son los que dicen 'no sé, pero voy a investigar' en vez de pretender que saben todo. La humildad intelectual combinada con rigor técnico es la marca de un senior.",
        exercise: {
          title: "Escenarios de Criterio Real",
          scenario: "Escenario 1: Jueves 6pm. Release mañana 8am. Bug: en 2% de casos, confirmación de compra tarda 15s en vez de 2s. No hay error funcional. PM quiere lanzar. Dev dice 'lo arreglo la próxima semana.' ¿Qué haces?\n\nEscenario 2: Un dev senior rechaza tu bug: 'no es bug, es comportamiento esperado.' Tú estás seguro de que contradice el requisito. El dev tiene 10 años, tú 3 meses. ¿Cómo lo manejas?\n\nEscenario 3: Te piden testear un feature sin spec escrita. PM dice 'ya lo discutimos verbalmente'. ¿Qué haces?",
          solution: "1. Pido datos: ¿qué perfil de usuario? Si el 2% son usuarios de checkout (dinero involucrado), 15s es mucho — puede causar doble click y doble cobro. Recomiendo: lanzar CON monitoring de ese endpoint y alertas si latencia >10s. Documentar el riesgo aceptado.\n\n2. Voy al requisito escrito. Si dice X y el sistema hace Y, es un bug — independiente de la seniority de quien opine. Escalo con datos, no con emociones: 'Según REQ-123, el comportamiento esperado es X. ¿Cambió el requisito? Si sí, actualicemos la documentación.'\n\n3. No testeo sin criterios claros. Digo: 'Necesito al menos: criterios de aceptación escritos y escenarios acordados. Sin eso, no puedo garantizar cobertura ni reportar defectos contra una baseline.' Si el PM insiste, escribo YO los criterios y pido validación."
        }
      },
      {
        id: "m8l2", title: "Entrevistas de QA en Big Tech",
        intro: "Las Big Tech no buscan ejecutores de test cases. Buscan ingenieros que piensen en sistemas, prioricen por riesgo y comuniquen con claridad.",
        concepts: [
          { title: "Lo que evalúan", text: "1. Pensamiento sistemático: no una lista de tests, sino CÓMO piensas. Estructura: funcional → edge cases → integración → performance → seguridad → accesibilidad.\n2. Priorización basada en riesgo: 'Todos los tests posibles son estos, los 5 críticos son estos PORQUE...'\n3. Conocimiento técnico: lees código, entiendes APIs, sabes SQL, puedes automatizar.\n4. Comunicación clara: explicas problemas técnicos a un PM." },
          { title: "Pregunta clásica: '¿Cómo testearías un elevador?'", text: "Respuesta junior: 'Presionar botones, ver si se mueve.'\n\nRespuesta Big Tech: Categorizar tests — Funcional (cada piso accesible, puertas, indicador). Edge cases (todos los pisos a la vez, cancelar piso). Concurrencia (llamadas simultáneas). Seguridad (sensor de obstrucción, freno de emergencia). Performance (tiempo espera, capacidad peso). Resiliencia (corte de energía, fallo de sensor). Accesibilidad (braille, voz, tiempo de puerta)." },
          { title: "El factor diferenciador", text: "No es lo que sabes. Es cómo PIENSAS EN VOZ ALTA. Practica verbalizar tu proceso. Usa STAR para experiencias: Situation, Task, Action, Result. Siempre termina con qué aprendiste y qué harías diferente." }
        ],
        senior: "En la entrevista, cuando no sepas algo, di: 'No tengo experiencia directa con eso, pero mi approach sería...' Eso demuestra honestidad + capacidad de resolver problemas nuevos. Pretender que sabes todo es la forma más rápida de fallar.",
        exercise: {
          title: "Mock Interview",
          scenario: "Responde como si estuvieras en entrevista FAANG:\n\n1. '¿Cómo testearías la barra de búsqueda de Google?' (Organiza por categorías.)\n\n2. '15 bugs: 3 P0, 5 P1, 7 P2. Solo pueden arreglar 8. ¿Cuáles priorizas?'\n\n3. '¿Cuál es la diferencia entre un buen tester y un gran tester?'",
          solution: "1. Funcional: búsqueda normal, vacía, caracteres especiales, muy larga. Autocompletado: velocidad, relevancia, personalización. Resultados: orden, paginación, snippets. Internacionalización: idiomas, scripts RTL. Performance: latencia <200ms, load con millones de queries simultáneas. Seguridad: XSS en query, injection. Accesibilidad: screen reader, keyboard navigation.\n\n2. Los 3 P0 primero (no negociable). Luego evalúo los 5 P1: ¿cuáles afectan más usuarios? ¿hay workaround? ¿son regresiones? Selecciono los 5 de mayor impacto. Comunico al equipo: 'Estos son los 8 priorizados por impacto. Los 7 restantes van al backlog priorizado para el próximo sprint.'\n\n3. Un buen tester encuentra bugs. Un gran tester previene bugs. Un buen tester ejecuta tests. Un gran tester diseña estrategias de testing. Un buen tester reporta defectos. Un gran tester mejora el proceso para que esos defectos no vuelvan a ocurrir."
        }
      }
    ],
    quiz: [
      { q: "La mejor forma de comunicar un bug a un developer es:", opts: ["'Tu código tiene un bug en el login'", "'Encontré un comportamiento inesperado: al hacer X, ocurre Y en vez de Z. ¿Puede ser intencional?'", "'El login está roto, arréglalo'", "'Hay un bug, te asigné el ticket'"], correct: 1 },
      { q: "Ownership real en QA significa:", opts: ["Que eres responsable de ejecutar todos los tests", "Que si un bug llega a producción, es culpa del developer", "Que tu responsabilidad es la calidad del PRODUCTO, no solo tu bug count", "Que debes arreglar los bugs tú mismo"], correct: 2 },
      { q: "En una entrevista, cuando no sabes algo:", opts: ["Inventas una respuesta creíble", "'No tengo experiencia directa, pero mi approach sería...'", "Dices que nunca te han preguntado eso", "Cambias el tema a algo que sí sabes"], correct: 1 },
      { q: "La diferencia entre un buen tester y un gran tester:", opts: ["El gran tester encuentra más bugs", "El gran tester automatiza más", "El gran tester previene bugs y mejora procesos", "El gran tester tiene más certificaciones"], correct: 2 },
      { q: "Un dev senior rechaza tu bug. Tienes evidencia de que contradice el requisito. Tu acción:", opts: ["Cierras el bug para no generar conflicto", "Escalas al PM gritando que el dev está equivocado", "Muestras el requisito escrito y preguntas si cambió", "Abres otro bug igual para que otro dev lo revise"], correct: 2 }
    ]
  }
];

const FINAL_ASSESSMENT = {
  title: "Evaluación Final — QA Engineer",
  scenario: `Eres contratado como QA Lead para "QuickPay", una fintech que procesa pagos móviles. La app permite: registro con verificación de identidad (KYC), agregar tarjetas de crédito/débito, enviar dinero entre usuarios, pagar en comercios con QR, y solicitar créditos pre-aprobados.

El equipo acaba de desarrollar una nueva feature: "Pagos Programados" — el usuario puede programar pagos recurrentes (ej: renta mensual, suscripciones). El pago se ejecuta automáticamente en la fecha configurada.

Reglas de negocio:
- Monto mínimo: $1.00, máximo: $10,000.00 por transacción
- Frecuencias: semanal, quincenal, mensual
- El usuario puede cancelar o modificar hasta 24h antes de la ejecución
- Si no hay fondos suficientes, se reintenta 2 veces (a las 4h y 8h)
- Después de 3 fallos consecutivos, el pago programado se desactiva
- Se envía notificación 24h antes, al momento de ejecutar, y si falla
- El historial de pagos programados debe estar disponible por 2 años`,
  questions: [
    {
      id: "fa1",
      type: "text",
      prompt: "PARTE 1 — Análisis de Riesgo\n\nIdentifica los 5 riesgos más críticos de esta feature. Para cada uno: describe el riesgo, el impacto al negocio (en términos concretos: dinero, usuarios, regulación), y cómo lo testearías.",
      rubric: "Evalúa: ¿Identificó riesgos financieros (doble cobro, cobro incorrecto)? ¿Pensó en seguridad (modificación no autorizada)? ¿Consideró edge cases temporales (cambio de horario, zona horaria)? ¿Pensó en el reintento y sus implicaciones? ¿Mencionó compliance/regulación?"
    },
    {
      id: "fa2",
      type: "text",
      prompt: "PARTE 2 — Casos de Prueba\n\nEscribe 6 casos de prueba profesionales para esta feature. Incluye: 2 happy paths, 2 edge cases, 1 caso de seguridad, 1 caso de integración entre servicios. Formato completo: precondiciones, pasos, resultado esperado.",
      rubric: "Evalúa: ¿Los casos tienen datos específicos? ¿Son reproducibles por otra persona? ¿Los edge cases son realmente edge (no obvios)? ¿El caso de seguridad es relevante? ¿El caso de integración considera fallo entre servicios?"
    },
    {
      id: "fa3",
      type: "text",
      prompt: "PARTE 3 — Detección de Bugs\n\nDurante testing encuentras estos comportamientos. Para cada uno: ¿es bug o es comportamiento esperado? Si es bug, clasifica severidad y prioridad.\n\n1. Un pago programado para el 31 de febrero se ejecuta el 3 de marzo.\n2. Al modificar el monto 23h antes de la ejecución, el cambio no se aplica.\n3. Un usuario con cuenta 'Suspended' puede seguir teniendo pagos programados activos que se ejecutan.\n4. El email de notificación '24h antes' llega 26 horas antes.\n5. Si el usuario elimina la tarjeta asociada, el pago programado sigue activo pero falla en ejecución.",
      rubric: "1: Bug — febrero no tiene 31, debería rechazar o manejar correctamente. 2: Bug — la regla dice 24h, pero 23h debería permitir (el límite es 24h ANTES). 3: Bug CRITICAL — cuenta suspended no debería ejecutar transacciones. 4: Debatible — puede ser acceptable (2h de margen). 5: Bug HIGH — debería validar tarjeta activa o notificar al usuario."
    },
    {
      id: "fa4",
      type: "text",
      prompt: "PARTE 4 — Priorización\n\nTienes estos 6 bugs y el sprint solo permite arreglar 3. Selecciona, ordena por prioridad y justifica.\n\n1. Doble cobro cuando el reintento coincide con un pago manual del usuario.\n2. El historial solo muestra últimos 6 meses en vez de 2 años.\n3. La notificación de fallo llega en inglés a usuarios con idioma español configurado.\n4. Usuario con cuenta Suspended ejecuta pagos programados.\n5. El botón 'Cancelar pago' no responde en iOS 16.\n6. El monto máximo acepta $10,000.01 (off by one).",
      rubric: "Orden correcto: #1 (doble cobro = pérdida financiera directa, P0), #4 (breach de seguridad/compliance, P0), #5 (funcionalidad bloqueada para segmento de usuarios, P1). Los otros pueden esperar: #2 (compliance pero no inmediato), #3 (UX, no bloquea), #6 (técnicamente un bug pero $0.01 de impacto)."
    }
  ]
};

/* ═══════════════════════════════════════════
   UI COMPONENTS
   ═══════════════════════════════════════════ */

const styles = {
  colors: { bg: "#0B1120", bgCard: "#111827", bgHover: "#1F2937", border: "#1E293B", borderLight: "#374151", accent: "#6366F1", accentLight: "#818CF8", green: "#10B981", greenBg: "#10B98115", red: "#EF4444", redBg: "#EF444415", amber: "#F59E0B", amberBg: "#F59E0B15", text: "#E2E8F0", textSec: "#94A3B8", textDim: "#64748B" },
};

const Card = ({ children, style, ...p }) => (
  <div style={{ background: styles.colors.bgCard, border: `1px solid ${styles.colors.border}`, borderRadius: 10, padding: 20, ...style }} {...p}>{children}</div>
);

const Badge = ({ children, color = styles.colors.accent }) => (
  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: `${color}18`, color, letterSpacing: 0.3, textTransform: "uppercase" }}>{children}</span>
);

const Btn = ({ children, variant = "primary", style, ...p }) => {
  const base = { padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.15s", fontFamily: "inherit" };
  const v = variant === "primary" ? { background: styles.colors.accent, color: "#fff" } : variant === "outline" ? { background: "transparent", border: `1px solid ${styles.colors.borderLight}`, color: styles.colors.textSec } : { background: styles.colors.bgHover, color: styles.colors.text };
  return <button style={{ ...base, ...v, ...style }} {...p}>{children}</button>;
};

/* Sidebar */
const Sidebar = ({ modules, activeModule, setActiveModule, setActiveView, progress, allQuizScores, sidebarOpen, setSidebarOpen, finalUnlocked }) => {
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0) + modules.length; // +quizzes
  const completedTotal = Object.values(progress).filter(Boolean).length;

  return (
    <>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40 }} />}
      <aside style={{
        width: 280, minWidth: 280, background: styles.colors.bgCard, borderRight: `1px solid ${styles.colors.border}`, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden",
        position: sidebarOpen ? "fixed" : "relative", zIndex: sidebarOpen ? 50 : 1, left: 0, top: 0
      }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${styles.colors.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: styles.colors.text, letterSpacing: -0.3 }}>QA Engineering Mastery</div>
          <div style={{ fontSize: 11, color: styles.colors.textDim, marginTop: 2, marginBottom: 12 }}>Programa Profesional</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 4, background: styles.colors.bgHover, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${(completedTotal / totalLessons) * 100}%`, height: "100%", background: styles.colors.accent, borderRadius: 2, transition: "width 0.4s" }} />
            </div>
            <span style={{ fontSize: 11, color: styles.colors.textDim, fontWeight: 600 }}>{Math.round((completedTotal / totalLessons) * 100)}%</span>
          </div>
        </div>

        <nav style={{ flex: 1, overflow: "auto", padding: "8px 0" }}>
          {modules.map((mod, mi) => {
            const modLessonsComplete = mod.lessons.filter((_, li) => progress[`${mod.id}-${li}`]).length;
            const quizDone = allQuizScores[mod.id] !== undefined;
            const allLessonsDone = modLessonsComplete === mod.lessons.length;
            const modComplete = allLessonsDone && quizDone;
            const isActive = activeModule === mi;

            return (
              <div key={mod.id}>
                <button onClick={() => { setActiveModule(mi); setActiveView({ type: "lesson", index: 0 }); setSidebarOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: isActive ? `${styles.colors.accent}10` : "transparent", border: "none", borderLeft: isActive ? `3px solid ${styles.colors.accent}` : "3px solid transparent", color: isActive ? styles.colors.accentLight : styles.colors.textSec, cursor: "pointer", textAlign: "left", transition: "all 0.15s", fontFamily: "inherit" }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, background: modComplete ? styles.colors.greenBg : isActive ? `${styles.colors.accent}20` : styles.colors.bgHover, color: modComplete ? styles.colors.green : isActive ? styles.colors.accentLight : styles.colors.textDim }}>
                    {modComplete ? "✓" : mi + 1}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mod.title}</div>
                    <div style={{ fontSize: 10, color: styles.colors.textDim, marginTop: 1 }}>{modLessonsComplete}/{mod.lessons.length} lecciones{quizDone ? " + quiz" : ""}</div>
                  </div>
                </button>
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${styles.colors.border}`, margin: "8px 0" }} />
          <button onClick={() => { setActiveModule(-1); setActiveView({ type: "final" }); setSidebarOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", background: activeModule === -1 ? `${styles.colors.accent}10` : "transparent", border: "none", borderLeft: activeModule === -1 ? `3px solid ${styles.colors.accent}` : "3px solid transparent", color: finalUnlocked ? (activeModule === -1 ? styles.colors.accentLight : styles.colors.textSec) : styles.colors.textDim, cursor: finalUnlocked ? "pointer" : "default", textAlign: "left", opacity: finalUnlocked ? 1 : 0.5, fontFamily: "inherit" }}>
            <span style={{ width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, background: styles.colors.bgHover, color: styles.colors.textDim }}>{finalUnlocked ? "F" : "🔒"}</span>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Evaluación Final</div>
          </button>
        </nav>
      </aside>
    </>
  );
};

/* Lesson View */
const LessonView = ({ lesson, moduleColor, onComplete, isCompleted }) => {
  const [section, setSection] = useState(0); // 0=intro, 1=concepts, 2=senior, 3=exercise
  const [showSolution, setShowSolution] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => { setSection(0); setShowSolution(false); setUserAnswer(""); }, [lesson.id]);

  const sections = ["Introducción", "Conceptos Clave", "Insight Senior", "Ejercicio"];

  return (
    <div>
      {/* Section tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, flexWrap: "wrap" }}>
        {sections.map((s, i) => (
          <button key={i} onClick={() => setSection(i)} style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${i === section ? styles.colors.accent : styles.colors.border}`, background: i === section ? `${styles.colors.accent}15` : "transparent", color: i === section ? styles.colors.accentLight : styles.colors.textDim, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>{s}</button>
        ))}
      </div>

      {section === 0 && (
        <Card>
          <Badge>Introducción</Badge>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: styles.colors.text, marginTop: 12 }}>{lesson.intro}</p>
        </Card>
      )}

      {section === 1 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {lesson.concepts.map((c, i) => (
            <Card key={i}>
              <h4 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: styles.colors.text }}>{c.title}</h4>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: styles.colors.textSec, whiteSpace: "pre-wrap" }}>{c.text}</div>
            </Card>
          ))}
        </div>
      )}

      {section === 2 && (
        <Card style={{ borderLeft: `3px solid ${styles.colors.accent}` }}>
          <Badge color={styles.colors.accent}>Perspectiva Senior</Badge>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: styles.colors.text, marginTop: 12, fontStyle: "italic" }}>{lesson.senior}</p>
        </Card>
      )}

      {section === 3 && lesson.exercise && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <Badge color={styles.colors.amber}>Ejercicio Práctico</Badge>
            <h4 style={{ margin: "12px 0 8px", fontSize: 15, fontWeight: 700, color: styles.colors.text }}>{lesson.exercise.title}</h4>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: styles.colors.textSec, whiteSpace: "pre-wrap" }}>{lesson.exercise.scenario}</div>
          </Card>
          <Card>
            <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)} placeholder="Escribe tu respuesta aquí antes de ver la solución..." style={{ width: "100%", minHeight: 140, padding: 14, borderRadius: 8, border: `1px solid ${styles.colors.border}`, background: styles.colors.bg, color: styles.colors.text, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }} />
            <div style={{ marginTop: 12 }}>
              <Btn variant="outline" onClick={() => setShowSolution(!showSolution)}>{showSolution ? "Ocultar" : "Ver"} Respuesta Modelo</Btn>
            </div>
            {showSolution && (
              <div style={{ marginTop: 16, padding: 16, background: styles.colors.greenBg, borderRadius: 8, borderLeft: `3px solid ${styles.colors.green}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: styles.colors.green, marginBottom: 8, textTransform: "uppercase" }}>Respuesta de referencia</div>
                <div style={{ fontSize: 13, lineHeight: 1.8, color: styles.colors.text, whiteSpace: "pre-wrap" }}>{lesson.exercise.solution}</div>
              </div>
            )}
          </Card>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <Btn onClick={onComplete} style={{ background: isCompleted ? styles.colors.green : styles.colors.accent }}>
          {isCompleted ? "Completada ✓" : "Marcar como completada"}
        </Btn>
      </div>
    </div>
  );
};

/* Quiz Component */
const ModuleQuiz = ({ quiz, moduleId, onComplete, existingScore }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(existingScore !== undefined);
  const [score, setScore] = useState(existingScore || 0);

  const handleSubmit = () => {
    let correct = 0;
    quiz.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    const s = Math.round((correct / quiz.length) * 100);
    setScore(s);
    setSubmitted(true);
    if (s >= 70) onComplete(s);
  };

  if (submitted) {
    const passed = score >= 70;
    return (
      <Card style={{ borderLeft: `3px solid ${passed ? styles.colors.green : styles.colors.red}` }}>
        <div style={{ textAlign: "center", padding: 20 }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: passed ? styles.colors.green : styles.colors.red }}>{score}%</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: styles.colors.text, marginTop: 8 }}>{passed ? "Aprobado" : "No aprobado — Mínimo 70%"}</div>
          {!passed && <Btn onClick={() => { setSubmitted(false); setAnswers({}); }} style={{ marginTop: 16 }}>Reintentar</Btn>}
        </div>
        {submitted && (
          <div style={{ marginTop: 20 }}>
            {quiz.map((q, i) => {
              const isCorrect = answers[i] === q.correct;
              return (
                <div key={i} style={{ padding: 12, marginBottom: 8, borderRadius: 8, background: isCorrect ? styles.colors.greenBg : styles.colors.redBg }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: styles.colors.text, marginBottom: 4 }}>{q.q}</div>
                  <div style={{ fontSize: 12, color: isCorrect ? styles.colors.green : styles.colors.red }}>
                    {isCorrect ? "Correcto" : `Incorrecto — Respuesta: ${q.opts[q.correct]}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <Badge color={styles.colors.amber}>Evaluación del Módulo</Badge>
        <p style={{ fontSize: 13, color: styles.colors.textSec, marginTop: 8 }}>Responde correctamente al menos el 70% para aprobar. Selecciona la mejor respuesta para cada pregunta.</p>
      </Card>
      {quiz.map((q, i) => (
        <Card key={i}>
          <div style={{ fontSize: 13, fontWeight: 600, color: styles.colors.text, marginBottom: 12 }}>{i + 1}. {q.q}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {q.opts.map((opt, oi) => (
              <button key={oi} onClick={() => setAnswers({ ...answers, [i]: oi })}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, border: `1px solid ${answers[i] === oi ? styles.colors.accent : styles.colors.border}`, background: answers[i] === oi ? `${styles.colors.accent}12` : "transparent", color: answers[i] === oi ? styles.colors.accentLight : styles.colors.textSec, cursor: "pointer", textAlign: "left", fontSize: 13, fontFamily: "inherit", transition: "all 0.15s" }}>
                <span style={{ width: 18, height: 18, borderRadius: 99, border: `2px solid ${answers[i] === oi ? styles.colors.accent : styles.colors.borderLight}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {answers[i] === oi && <span style={{ width: 8, height: 8, borderRadius: 99, background: styles.colors.accent }} />}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </Card>
      ))}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn onClick={handleSubmit} disabled={Object.keys(answers).length < quiz.length} style={{ opacity: Object.keys(answers).length < quiz.length ? 0.5 : 1 }}>
          Enviar Respuestas ({Object.keys(answers).length}/{quiz.length})
        </Btn>
      </div>
    </div>
  );
};

/* Final Assessment */
const FinalAssessmentView = ({ assessment }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card style={{ borderLeft: `3px solid ${styles.colors.accent}` }}>
        <Badge>Evaluación Final</Badge>
        <h3 style={{ margin: "12px 0 8px", fontSize: 18, fontWeight: 700, color: styles.colors.text }}>Caso: QuickPay — Pagos Programados</h3>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: styles.colors.textSec, whiteSpace: "pre-wrap" }}>{assessment.scenario}</div>
      </Card>

      {assessment.questions.map((q, i) => (
        <Card key={q.id}>
          <Badge color={styles.colors.amber}>Parte {i + 1}</Badge>
          <div style={{ fontSize: 14, lineHeight: 1.8, color: styles.colors.text, marginTop: 12, whiteSpace: "pre-wrap" }}>{q.prompt}</div>
          <textarea value={answers[q.id] || ""} onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })} placeholder="Tu respuesta..." disabled={submitted}
            style={{ width: "100%", minHeight: 160, padding: 14, borderRadius: 8, border: `1px solid ${styles.colors.border}`, background: styles.colors.bg, color: styles.colors.text, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", marginTop: 12, lineHeight: 1.6 }} />
          {submitted && (
            <div style={{ marginTop: 12, padding: 14, background: styles.colors.greenBg, borderRadius: 8, borderLeft: `3px solid ${styles.colors.green}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: styles.colors.green, marginBottom: 6, textTransform: "uppercase" }}>Rúbrica de evaluación</div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: styles.colors.text, whiteSpace: "pre-wrap" }}>{q.rubric}</div>
            </div>
          )}
        </Card>
      ))}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {!submitted ? (
          <Btn onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < assessment.questions.length} style={{ opacity: Object.keys(answers).length < assessment.questions.length ? 0.5 : 1 }}>
            Enviar Evaluación Final
          </Btn>
        ) : (
          <Card style={{ width: "100%", borderLeft: `3px solid ${styles.colors.green}`, textAlign: "center", padding: 30 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: styles.colors.green }}>Evaluación Completada</div>
            <p style={{ fontSize: 14, color: styles.colors.textSec, marginTop: 8 }}>Revisa las rúbricas de cada parte para autoevaluar tu desempeño. Compara tus respuestas contra los criterios de evaluación de nivel Big Tech.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */

export default function App() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeView, setActiveView] = useState({ type: "lesson", index: 0 }); // lesson|quiz|final
  const [progress, setProgress] = useState({});
  const [quizScores, setQuizScores] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef(null);

  const currentModule = activeModule >= 0 ? MODULES[activeModule] : null;
  const finalUnlocked = MODULES.every(m => quizScores[m.id] !== undefined && quizScores[m.id] >= 70);

  const completeLesson = useCallback((modId, lessonIdx) => {
    setProgress(p => ({ ...p, [`${modId}-${lessonIdx}`]: true }));
    const mod = MODULES.find(m => m.id === modId);
    if (lessonIdx < mod.lessons.length - 1) {
      setActiveView({ type: "lesson", index: lessonIdx + 1 });
    } else {
      setActiveView({ type: "quiz" });
    }
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, []);

  const completeQuiz = useCallback((modId, score) => {
    setQuizScores(s => ({ ...s, [modId]: score }));
    setProgress(p => ({ ...p, [`${modId}-quiz`]: true }));
  }, []);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [activeView, activeModule]);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: styles.colors.bg, color: styles.colors.text, overflow: "hidden" }}>
      <Sidebar modules={MODULES} activeModule={activeModule} setActiveModule={setActiveModule} setActiveView={setActiveView} progress={progress} allQuizScores={quizScores} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} finalUnlocked={finalUnlocked} />

      <main ref={mainRef} style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{ padding: "14px 24px", borderBottom: `1px solid ${styles.colors.border}`, background: styles.colors.bgCard, display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: styles.colors.textSec, cursor: "pointer", fontSize: 18, padding: 4, display: "flex" }}>☰</button>
          <div>
            {currentModule ? (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: styles.colors.accent, textTransform: "uppercase", letterSpacing: 0.5 }}>Módulo {activeModule + 1} de {MODULES.length}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: styles.colors.text }}>{currentModule.title}</div>
              </>
            ) : (
              <div style={{ fontSize: 16, fontWeight: 700, color: styles.colors.text }}>Evaluación Final</div>
            )}
          </div>
        </header>

        {/* Content area */}
        <div style={{ flex: 1, padding: "28px 32px", maxWidth: 780 }}>
          {currentModule && activeView.type === "lesson" && (
            <>
              {/* Module intro */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 14, color: styles.colors.textSec, margin: 0, lineHeight: 1.6 }}>{currentModule.desc}</p>
              </div>
              {/* Lesson nav */}
              <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
                {currentModule.lessons.map((l, i) => {
                  const done = progress[`${currentModule.id}-${i}`];
                  const active = activeView.index === i;
                  return (
                    <button key={i} onClick={() => setActiveView({ type: "lesson", index: i })}
                      style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${active ? styles.colors.accent : done ? styles.colors.green : styles.colors.border}`, background: active ? `${styles.colors.accent}15` : "transparent", color: active ? styles.colors.accentLight : done ? styles.colors.green : styles.colors.textDim, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                      {done && "✓ "}{i + 1}. {l.title.length > 30 ? l.title.slice(0, 30) + "…" : l.title}
                    </button>
                  );
                })}
                <button onClick={() => setActiveView({ type: "quiz" })}
                  style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${activeView.type === "quiz" ? styles.colors.amber : quizScores[currentModule.id] !== undefined ? styles.colors.green : styles.colors.border}`, background: activeView.type === "quiz" ? `${styles.colors.amber}15` : "transparent", color: activeView.type === "quiz" ? styles.colors.amber : quizScores[currentModule.id] !== undefined ? styles.colors.green : styles.colors.textDim, cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                  {quizScores[currentModule.id] !== undefined && "✓ "}Quiz
                </button>
              </div>
              <LessonView lesson={currentModule.lessons[activeView.index]} moduleColor={styles.colors.accent} onComplete={() => completeLesson(currentModule.id, activeView.index)} isCompleted={progress[`${currentModule.id}-${activeView.index}`]} />
            </>
          )}

          {currentModule && activeView.type === "quiz" && (
            <ModuleQuiz quiz={currentModule.quiz} moduleId={currentModule.id} onComplete={(s) => completeQuiz(currentModule.id, s)} existingScore={quizScores[currentModule.id]} />
          )}

          {activeModule === -1 && activeView.type === "final" && (
            finalUnlocked ? <FinalAssessmentView assessment={FINAL_ASSESSMENT} /> : (
              <Card style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 36, marginBottom: 16, opacity: 0.5 }}>🔒</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: styles.colors.text }}>Evaluación Final Bloqueada</div>
                <p style={{ fontSize: 14, color: styles.colors.textSec, marginTop: 8 }}>Completa y aprueba el quiz de todos los módulos para desbloquear la evaluación final.</p>
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start", maxWidth: 300, marginLeft: "auto", marginRight: "auto" }}>
                  {MODULES.map(m => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                      <span style={{ color: quizScores[m.id] >= 70 ? styles.colors.green : styles.colors.textDim }}>{quizScores[m.id] >= 70 ? "✓" : "○"}</span>
                      <span style={{ color: quizScores[m.id] >= 70 ? styles.colors.green : styles.colors.textSec }}>{m.title}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )
          )}
        </div>
      </main>
    </div>
  );
}