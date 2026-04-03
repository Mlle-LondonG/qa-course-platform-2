import { useState, useCallback, useMemo } from 'react';

const MODULES = [
  {
    id: 1,
    title: 'Fundamentos del Testing',
    icon: '🏗️',
    color: '#3B82F6',
    units: [
      {
        title: '¿Qué es el Testing y por qué existe?',
        content: `El testing NO es "verificar que funcione". Es una disciplina de ingeniería cuyo objetivo es **reducir el riesgo de fallos en producción** que impacten al negocio, a los usuarios o a la reputación de la empresa.

**Por qué existe el testing:**
En 2012, Knight Capital perdió $440 millones en 45 minutos por un bug en su sistema de trading. En 2018, un error en el sistema de autenticación de Facebook expuso tokens de acceso de 50 millones de cuentas. Estos no son errores de "desarrolladores malos" — son fallos sistémicos donde el testing fue insuficiente o inexistente.

**El testing existe porque:**
1. El software es escrito por humanos, y los humanos cometen errores cognitivos sistemáticos (sesgo de confirmación, efecto de anclaje, ceguera por familiaridad).
2. Los sistemas modernos tienen complejidad combinatoria: una app con 20 campos de 10 opciones cada uno tiene 10²⁰ combinaciones posibles.
3. El costo de un bug crece exponencialmente según la fase: un bug encontrado en requisitos cuesta x1, en desarrollo x10, en QA x100, en producción x1000.

**Lo que un tester de Big Tech entiende:**
No buscas bugs. Buscas RIESGO. Tu trabajo es responder: "¿Qué tan confiados estamos en que este software hace lo que debe, no hace lo que no debe, y sobrevive condiciones adversas?"`,
        exercise: {
          type: 'scenario',
          title: 'Ejercicio: Análisis de Riesgo Real',
          description: `Escenario: Eres el QA Lead asignado al checkout de un e-commerce que procesa $2M diarios. El equipo quiere lanzar una nueva feature: "Compra con un click" (similar a Amazon 1-Click).

PREGUNTA: Identifica los 5 riesgos más críticos que testearías ANTES de que este feature llegue a producción. Para cada riesgo, define: qué podría salir mal, cuál sería el impacto al negocio, y cómo lo testearías.

NO pienses en "casos de prueba". Piensa en RIESGO.`,
          hints: [
            'Piensa en doble cobro — ¿qué pasa si el usuario hace click dos veces rápidamente?',
            '¿Qué pasa con la dirección de envío si el usuario tiene múltiples direcciones?',
            'Race conditions: dos requests simultáneos al mismo endpoint de pago',
            '¿Qué pasa si el método de pago guardado ya expiró?',
            'Considera el rollback: si el pago se procesa pero el inventario ya no está disponible',
          ],
          sampleAnswer: `**Respuesta de nivel Big Tech:**

1. **Doble cobro por click múltiple** — Impacto: chargebacks masivos, pérdida de confianza. Test: simular clicks rápidos (debounce), verificar idempotencia del endpoint de pago.

2. **Race condition en inventario** — Impacto: vender producto agotado. Test: 100 usuarios simultáneos comprando el último ítem. Verificar que solo 1 transacción se complete.

3. **Método de pago inválido/expirado** — Impacto: orden creada sin cobro real. Test: tarjetas expiradas, fondos insuficientes, tarjetas bloqueadas. Verificar que la orden NO se cree si el pago falla.

4. **Datos de envío incorrectos por defecto** — Impacto: envíos a dirección equivocada, costo de re-envío. Test: usuario con múltiples direcciones, dirección default eliminada, dirección incompleta.

5. **Fallo parcial en el flujo** — Impacto: cobro sin orden o orden sin cobro. Test: simular timeout del servicio de inventario después del cobro. Verificar mecanismo de compensación/rollback.`,
        },
      },
      {
        title: 'Tipos de Testing — Taxonomía Real',
        content: `Olvida las listas genéricas. Aquí vas a entender cuándo y por qué usar cada tipo.

**POR NIVEL DE EJECUCIÓN:**

• Unit Testing — Lo hace el developer. Verifica una función aislada. Si un tester está escribiendo unit tests, algo está mal en el proceso.

• Integration Testing — Aquí empieza tu territorio. Verificas que los componentes hablan correctamente entre sí. Ejemplo real: el servicio de usuarios devuelve un JSON, el servicio de pedidos lo consume. ¿Qué pasa si el campo "email" viene null?

• E2E (End-to-End) Testing — El flujo completo como lo haría un usuario. Desde login hasta checkout completado. Es el más costoso y frágil. Úsalo con criterio.

**POR PROPÓSITO:**

• Smoke Testing — "¿La app enciende?" Verificas que las funcionalidades críticas no están rotas. Debe tomar <15 minutos. Si tu smoke suite tarda 2 horas, no es smoke.

• Regression Testing — Verificas que lo que ya funcionaba SIGUE funcionando después de un cambio. El 70% de bugs en producción son regresiones.

• Sanity Testing — Subset enfocado de regression. "Cambiamos el módulo de pagos, vamos a verificar solo pagos a profundidad."

• Exploratory Testing — NO es "clickear sin plan". Es testing con charter: "En los próximos 30 minutos, voy a explorar el flujo de registro usando datos extremos en campos opcionales." Documentas lo que encuentras en tiempo real.

**POR NATURALEZA:**

• Funcional — ¿Hace lo que debe hacer?
• No funcional — ¿Lo hace bien? (performance, seguridad, usabilidad, accesibilidad)

**LA REGLA DE ORO EN BIG TECH:**
La pirámide de testing: 70% unit, 20% integration, 10% E2E. Si tu suite de E2E tiene 500 tests y tu integration tiene 50, tu arquitectura de testing está invertida y vas a sufrir.`,
        exercise: {
          type: 'decision',
          title: 'Ejercicio: Decide el Tipo de Testing',
          description: `Para cada escenario, decide qué tipo(s) de testing aplicarías y justifica. No hay respuesta única correcta, pero hay respuestas INCORRECTAS.

1. Se cambió el color de un botón de "Comprar" de azul a verde.
2. Se migró la base de datos de MySQL a PostgreSQL sin cambiar la API.
3. Se agregó un nuevo endpoint /api/v2/users que coexiste con /api/v1/users.
4. Es viernes 4pm, hay un hotfix que corrige un bug crítico en producción.
5. El product manager dice "quiero asegurarme de que el checkout funciona bien en general".`,
          sampleAnswer: `1. **Cambio de color** — Visual regression test (screenshot comparison). NO necesitas regression funcional completo. Pero SÍ verifica que el click handler no se rompió.

2. **Migración de DB** — Integration testing EXTENSO. Cada query debe retornar los mismos resultados. Data integrity tests. Performance comparison (PostgreSQL puede comportarse diferente en queries complejas). Smoke de todos los endpoints críticos.

3. **Nuevo endpoint v2** — Integration tests del nuevo endpoint. Regression del v1 (asegurar que no se rompió). Contract testing entre ambas versiones. Test de backward compatibility.

4. **Hotfix viernes** — Smoke testing SOLAMENTE del fix y del área afectada. NO es momento de regression completo. Sanity test del flujo impactado. Si el smoke pasa, deploy con monitoreo activo.

5. **"Funciona bien en general"** — Esto NO es un requerimiento testeable. Tu respuesta correcta es: "¿Qué significa 'bien'? ¿Qué escenarios te preocupan? ¿Hubo algún cambio reciente?" Cuestionar requerimientos ambiguos es tu TRABAJO.`,
        },
      },
      {
        title: 'STLC y SDLC — Tu Rol Real',
        content: `**SDLC (Software Development Lifecycle):**
El ciclo completo de desarrollo de software. Hay variantes (Waterfall, Agile, SAFe), pero la constante es: el tester debe estar involucrado DESDE EL INICIO.

**El error más común de un tester junior:**
Esperar a que development termine para empezar a testear. En Big Tech, si esperas al código, llegaste tarde.

**STLC (Software Testing Lifecycle):**

1. **Análisis de Requisitos** — Lees la spec/PRD/user story. Tu objetivo: encontrar ambigüedades, contradicciones y gaps ANTES de que se escriba código. Esto es el mayor multiplicador de valor de un tester.

2. **Planificación de Testing** — Defines: qué vas a testear, qué NO vas a testear (igualmente importante), qué herramientas necesitas, cuánto tiempo necesitas, cuáles son los criterios de entrada/salida.

3. **Diseño de Casos de Prueba** — Aplicas técnicas formales (las veremos en el Módulo 2) para derivar los casos. NO improvises.

4. **Configuración del Ambiente** — Datos de prueba, ambientes staging, mocks de servicios externos. Un tester que no puede configurar su ambiente es un tester bloqueado.

5. **Ejecución** — Corres los tests. Documentas resultados. Reportas bugs.

6. **Cierre** — Métricas, lecciones aprendidas, test summary report. ¿Qué bugs se escaparon? ¿Por qué?

**En la práctica Agile (como funciona en Big Tech):**
Todo esto ocurre dentro de un sprint de 2 semanas. El tester participa en refinement, estima esfuerzo de testing, hace shift-left (testing temprano) y shift-right (monitoreo en producción).

**TU INFLUENCIA REAL:**
En Google, los SDET (Software Development Engineer in Test) tienen la misma voz que los SWE. Pueden bloquear un release si la calidad no cumple el bar. Esa autoridad se gana con CRITERIO, no con título.`,
        exercise: {
          type: 'scenario',
          title: 'Ejercicio: Shift-Left en Acción',
          description: `Te entregan esta user story:

"Como usuario, quiero poder resetear mi contraseña para poder acceder a mi cuenta cuando la olvide."

Criterios de aceptación:
- El usuario recibe un email con un link de reset.
- El link expira en 24 horas.
- La nueva contraseña debe cumplir las políticas de seguridad.

Tu tarea: ANTES de que se escriba una línea de código, identifica al menos 8 preguntas o ambigüedades que deberías escalar al Product Manager o al equipo de desarrollo. Estas preguntas deben demostrar que piensas en edge cases, seguridad y experiencia de usuario.`,
          hints: [
            '¿Qué pasa si el usuario solicita múltiples resets?',
            "¿Cuáles son las 'políticas de seguridad' exactamente?",
            '¿Qué pasa si el email del usuario ya no existe o está comprometido?',
            '¿Rate limiting en el endpoint de reset?',
          ],
          sampleAnswer: `**Preguntas de nivel Big Tech:**

1. ¿Qué pasa si el usuario solicita múltiples resets? ¿Se invalidan los links anteriores?
2. "Políticas de seguridad" — ¿cuáles exactamente? ¿Longitud mínima? ¿Caracteres especiales? ¿No repetir las últimas N contraseñas?
3. ¿Hay rate limiting? ¿Cuántos intentos de reset por hora/día se permiten?
4. ¿Qué mensaje mostramos si el email NO existe en el sistema? (Si decimos "email no encontrado", estamos revelando si alguien tiene cuenta — enumeración de usuarios)
5. ¿El link de reset es de un solo uso o puede usarse múltiples veces dentro de las 24h?
6. ¿Qué pasa si el usuario cambia su email DESPUÉS de solicitar el reset?
7. ¿Se debe cerrar sesión en todos los dispositivos después del cambio de contraseña?
8. ¿Se envía una notificación al usuario de que su contraseña fue cambiada? (Detección de compromiso)
9. ¿El link funciona en todos los clientes de email? (Algunos proxies de enterprise prefetch links — ¿el prefetch invalida el token?)
10. ¿Qué pasa si el usuario está en un flujo de 2FA y solicita reset?

Estas preguntas demuestran que piensas en seguridad, UX y edge cases ANTES del código.`,
        },
      },
    ],
  },
  {
    id: 2,
    title: 'Diseño de Pruebas',
    icon: '📐',
    color: '#8B5CF6',
    units: [
      {
        title: 'Partición de Equivalencia y Valores Límite',
        content: `Estas son las dos técnicas más fundamentales y las que más valor generan por esfuerzo invertido.

**Partición de Equivalencia (EP):**
Divide el dominio de entrada en clases donde TODOS los valores de la clase se comportan igual. Testeas UN valor por clase.

Ejemplo real — Campo "edad" para seguro de auto:
• Clase inválida: < 18 (no puede contratar)
• Clase válida 1: 18-25 (tarifa joven)
• Clase válida 2: 26-65 (tarifa estándar)
• Clase válida 3: 66-99 (tarifa senior)
• Clase inválida: > 99 (no asegurable)
• Clase inválida: no numérico, negativo, decimal

Con 7 tests cubres un dominio de miles de valores.

**Análisis de Valores Límite (BVA):**
Los bugs viven en los bordes. SIEMPRE. Si un rango es 18-65, testeas: 17, 18, 19, 64, 65, 66.

Ejemplo real — campo de monto de transferencia bancaria:
• Mínimo: $1.00. Tests: $0.99, $1.00, $1.01
• Máximo: $10,000.00. Tests: $9,999.99, $10,000.00, $10,000.01
• También: $0.00, $0.01, -$0.01, $999,999.99

**El error que cometen los juniors:**
Testear $5,000 porque "es un valor intermedio". Ese test no encuentra NADA que no encuentre $1.01. Desperdicias ejecución.

**En Big Tech:**
Estas técnicas se aplican a CUALQUIER input: strings (longitud 0, 1, max, max+1), arrays (vacío, 1 elemento, lleno), timestamps (medianoche, cambio de zona horaria, año bisiesto), etc.`,
        exercise: {
          type: 'practice',
          title: 'Ejercicio: Diseña Tests con EP y BVA',
          description: `Sistema: Formulario de registro de un servicio de streaming (tipo Netflix).

Campos:
- Username: 3-20 caracteres, alfanumérico, sin espacios
- Email: formato válido de email
- Contraseña: 8-64 caracteres, al menos 1 mayúscula, 1 número, 1 especial
- Fecha de nacimiento: debe ser mayor de 13 años
- Código postal: 5 dígitos (US)

Para CADA campo, define:
1. Las clases de equivalencia (válidas e inválidas)
2. Los valores límite
3. Mínimo 3 casos de prueba por campo

Bonus: identifica interacciones ENTRE campos que no se cubren testeando campos individuales.`,
          sampleAnswer: `**Username:**
EP válida: "user123" (alfanumérico, longitud ok)
EP inválida: "ab" (muy corto), "user name" (espacio), "user@!" (especiales), "" (vacío), string de 21 chars
BVA: 2 chars (inválido), 3 chars (mínimo válido), 20 chars (máximo válido), 21 chars (inválido)

**Contraseña:**
EP válida: "MyP@ss123" (cumple todo)
EP inválida: "mypass1!" (sin mayúscula), "MYPASS1!" (sin minúscula), "MyPasss!!" (sin número), "MyPass123" (sin especial), "My@1abc" (7 chars)
BVA: 7 chars (inválido), 8 chars (mínimo), 64 chars (máximo), 65 chars (inválido)

**Interacciones entre campos (lo que separa a un senior):**
- ¿Qué pasa si username = email prefix?
- ¿Se puede usar el username como parte de la contraseña? (Debería rechazarse)
- Si la fecha de nacimiento indica exactamente 13 años HOY, ¿pasa o falla?
- ¿Qué zona horaria se usa para calcular la edad? (UTC vs local del usuario)`,
        },
      },
      {
        title: 'Tablas de Decisión y State Transition',
        content: `**Tablas de Decisión:**
Cuando el comportamiento depende de COMBINACIONES de condiciones, una tabla de decisión mapea todas las combinaciones posibles y su resultado esperado.

Ejemplo real — Lógica de envío gratis en e-commerce:
Condiciones: ¿Es miembro Prime? ¿Monto > $50? ¿Es producto elegible?

| Prime | >$50 | Elegible | Resultado |
|-------|------|----------|-----------|
| Sí | Sí | Sí | Envío gratis |
| Sí | Sí | No | Envío $5.99 |
| Sí | No | Sí | Envío gratis |
| Sí | No | No | Envío $5.99 |
| No | Sí | Sí | Envío gratis |
| No | Sí | No | Envío estándar |
| No | No | Sí | Envío estándar |
| No | No | No | Envío estándar |

Son 2³ = 8 combinaciones. Cada una es un caso de prueba. Sin la tabla, te pierdes combinaciones.

**State Transition Testing:**
Para sistemas con ESTADOS definidos. Mapeas: estados, transiciones válidas, transiciones INVÁLIDAS, y guardas (condiciones).

Ejemplo real — Estado de un pedido:
Pending → Paid → Processing → Shipped → Delivered
Pending → Cancelled (por usuario)
Paid → Refunded (por usuario o sistema)
Shipped → Returned (por usuario post-entrega)

Lo que testeas:
1. Cada transición válida (happy path)
2. Cada transición INVÁLIDA: ¿Qué pasa si intentas pasar de "Delivered" a "Pending"? ¿El sistema lo permite? Si sí, tienes un bug.
3. Guardas: ¿Se puede cancelar un pedido que ya fue shipped?

**En Big Tech:**
Los state machines son UBICUOS: estados de usuario (active/suspended/banned), estados de pago, estados de deployment, feature flags. Si no mapeas los estados, no puedes testear transiciones inválidas.`,
        exercise: {
          type: 'practice',
          title: 'Ejercicio: State Transition de una Cuenta de Usuario',
          description: `Diseña el diagrama de transición de estados para una cuenta de usuario de una plataforma financiera (tipo PayPal/Stripe):

Estados posibles: Pending Verification, Active, Suspended, Locked, Closed, Banned

Reglas de negocio:
- Una cuenta nueva empieza en "Pending Verification"
- Se activa cuando el usuario completa KYC (Know Your Customer)
- Se suspende temporalmente por actividad sospechosa (se puede reactivar)
- Se bloquea (Locked) después de 5 intentos de login fallidos
- Se cierra voluntariamente por el usuario
- Se banea permanentemente por fraude confirmado

Define: 1) Todas las transiciones válidas, 2) Al menos 5 transiciones inválidas que DEBES verificar que el sistema RECHAZA, 3) Qué pasa con el saldo de la cuenta en cada transición.`,
          sampleAnswer: `**Transiciones válidas:**
Pending → Active (KYC completado)
Pending → Closed (usuario cancela antes de verificar)
Active → Suspended (actividad sospechosa detectada)
Active → Locked (5 intentos fallidos)
Active → Closed (cierre voluntario)
Suspended → Active (revisión completada, cuenta legítima)
Suspended → Banned (fraude confirmado)
Locked → Active (reset de contraseña exitoso)
Locked → Suspended (si se detecta fraude durante el lockout)

**Transiciones inválidas CRÍTICAS:**
1. Banned → Active (NUNCA debe ocurrir. Un ban es permanente.)
2. Closed → Active (cuenta cerrada no se reabre — nuevo registro requerido)
3. Pending → Suspended (no puedes suspender lo que no está activo)
4. Locked → Closed (no permitas cierre mientras está investigación)
5. Banned → Closed (el ban overrides todo, no das opción de "cierre limpio")

**Saldo en transiciones:**
Active → Suspended: saldo congelado, no puede mover fondos
Active → Closed: saldo debe ser $0 o transferido antes de cierre
Suspended → Banned: saldo retenido para investigación legal
Locked → Active: saldo intacto, sin cambios`,
        },
      },
      {
        title: 'Casos de Prueba Profesionales y RTM',
        content: `**Cómo NO escribir un caso de prueba:**
"Verificar que el login funciona correctamente." — Esto no dice NADA. ¿Con qué datos? ¿Qué es "correctamente"? ¿En qué navegador? ¿Qué resultado esperas?

**Anatomía de un caso de prueba de nivel Big Tech:**

TC-LOGIN-001: Login exitoso con credenciales válidas
• Precondiciones: Usuario registrado con email "test@company.com" y password "V@lidP4ss!"
• Ambiente: Chrome 120+, staging
• Pasos:
  1. Navegar a /login
  2. Ingresar email: test@company.com
  3. Ingresar password: V@lidP4ss!
  4. Click en "Sign In"
• Resultado esperado: Redirect a /dashboard en <3s. Cookie de sesión creada. Header muestra nombre del usuario.
• Datos de prueba: User ID 12345, plan: Premium
• Prioridad: P0 (smoke test)
• Trazabilidad: REQ-AUTH-001

**La clave:** Cualquier persona del equipo debe poder ejecutar este caso y obtener el MISMO resultado. Si necesitan preguntarte algo, el caso está mal escrito.

**Requirements Traceability Matrix (RTM):**
Es una tabla que mapea: Requisito → Caso(s) de prueba → Estado de ejecución → Bugs encontrados.

Si un requisito no tiene casos de prueba mapeados, NO ESTÁ CUBIERTO. Si un caso de prueba no mapea a ningún requisito, es un test huérfano que probablemente no necesitas.

En Big Tech, la RTM se mantiene viva. No es un documento que creas una vez y olvidas. Se actualiza cada sprint.`,
        exercise: {
          type: 'practice',
          title: 'Ejercicio: Escribe Casos de Prueba Profesionales',
          description: `Feature: Carrito de compras con código de descuento.

Reglas:
- Solo se puede aplicar UN código por orden
- Código "SAVE10" da 10% de descuento
- Código "FLAT20" da $20 de descuento si el total es >$100
- Los códigos expiran en una fecha específica
- Descuentos no aplican a items en categoría "Clearance"
- El envío NO se descuenta

Escribe 8 casos de prueba profesionales (formato completo: precondiciones, pasos, resultado esperado, prioridad). Incluye al menos 2 casos negativos y 1 caso de interacción entre reglas.`,
        },
      },
    ],
  },
  {
    id: 3,
    title: 'Bugs y Gestión de Calidad',
    icon: '🐛',
    color: '#EF4444',
    units: [
      {
        title: 'Documentación de Bugs — El Arte de la Precisión',
        content: `Un bug mal documentado es un bug que no se arregla. En Big Tech, tu reporte de bug es tu CREDIBILIDAD.

**Estructura de un bug report de nivel profesional:**

**Título:** Descriptivo y buscable. NO: "Login no funciona". SÍ: "Login returns 500 error when email contains '+' character (e.g., user+tag@gmail.com)"

**Ambiente:** OS, browser/version, API version, ambiente (staging/prod), fecha/hora

**Pasos para reproducir:**
1. Exactos. Numerados. Sin ambigüedad.
2. Incluye DATOS ESPECÍFICOS usados.
3. Un developer debe poder reproducirlo en <5 minutos.

**Resultado actual:** Lo que PASÓ. Con evidencia (screenshot, video, logs, HTTP response).

**Resultado esperado:** Lo que DEBERÍA pasar, según spec/requisito/sentido común.

**Frecuencia:** Siempre reproducible / Intermitente (3 de 10 veces) / Una sola vez

**Impacto:** Quién se ve afectado, cuántos usuarios, impacto al negocio.

**Contexto adicional:** ¿Es regresión? ¿Desde qué build? ¿Workaround disponible?

**SEVERIDAD vs PRIORIDAD — La confusión más común:**

Severidad = impacto TÉCNICO del bug.
• Critical: sistema caído, pérdida de datos, breach de seguridad
• High: funcionalidad core rota sin workaround
• Medium: funcionalidad rota con workaround
• Low: cosmético, typo, UX menor

Prioridad = urgencia de NEGOCIO para arreglarlo.
• P0: Fix now. Deploy hotfix.
• P1: Fix this sprint.
• P2: Fix next sprint.
• P3: Backlog.

Un typo en el nombre del CEO en la landing page es severidad LOW pero prioridad P0.
Un crash en un flujo que usa el 0.1% de usuarios es severidad CRITICAL pero puede ser prioridad P2.

**El tester asigna severidad. El PO/PM asigna prioridad.** Si mezclas ambos, pierdes poder de comunicación.`,
        exercise: {
          type: 'scenario',
          title: 'Ejercicio: Documenta Este Bug',
          description: `Encontraste lo siguiente:

Estás testeando una app de delivery de comida. Hiciste un pedido de $45.50, aplicaste el cupón "WELCOME50" (50% de descuento para nuevos usuarios). El descuento se aplicó correctamente ($22.75). Pagaste con tarjeta. El pedido se confirmó.

Pero luego notaste que en tu historial de pedidos, el monto muestra $45.50 (sin descuento). Y en el email de confirmación, muestra $22.75 (con descuento). Además, revisaste el statement de tu tarjeta y te cobraron $22.75 (correcto).

Escribe el bug report completo. Define severidad y prioridad con justificación.`,
          sampleAnswer: `**Título:** Order history displays pre-discount amount ($45.50) instead of charged amount ($22.75) after applying WELCOME50 coupon

**Severidad:** Medium — No hay pérdida financiera (el cobro es correcto), pero genera confusión y potenciales tickets de soporte.

**Prioridad:** P1 — Los nuevos usuarios (target del cupón) verán discrepancia entre lo cobrado y lo mostrado. Generará desconfianza y llamadas a soporte. Impacta retention de nuevos usuarios.

**Pasos:**
1. Registrar nueva cuenta
2. Agregar items al carrito (total: $45.50)
3. Aplicar cupón WELCOME50
4. Verificar que el descuento se muestra ($22.75)
5. Completar pago con tarjeta
6. Ir a Order History

**Resultado actual:** Order History muestra $45.50
**Resultado esperado:** Order History debe mostrar $22.75 (monto efectivamente cobrado)

**Nota:** El email de confirmación SÍ muestra el monto correcto ($22.75). El cobro en tarjeta es correcto. La inconsistencia es solo en Order History.

**Hipótesis:** El order history probablemente lee el subtotal pre-descuento en lugar del total post-descuento de la tabla de transacciones.`,
        },
      },
      {
        title: 'Severidad vs Prioridad — Casos Reales',
        content: `Vamos a solidificar este concepto con escenarios que verás en tu carrera.

**Caso 1: Bug invisible pero devastador**
Un endpoint de la API devuelve datos de OTRO usuario cuando se hace una request con un ID numérico secuencial. Nadie lo ha reportado porque los usuarios normales no manipulan URLs.
→ Severidad: CRITICAL (breach de datos personales, posible violación de GDPR/CCPA)
→ Prioridad: P0 (aunque nadie lo reportó, si se descubre externamente, es un incidente de seguridad)

**Caso 2: Bug visible pero inofensivo**
El footer de la página muestra "© 2023" en vez de "© 2024".
→ Severidad: LOW (cosmético)
→ Prioridad: P3 (nadie va a dejar de comprar por esto)

**Caso 3: El dilema del PM**
El flujo de onboarding tiene un bug donde el step 3 de 5 se puede saltear. El resultado final es el mismo (la cuenta se crea bien), pero el usuario se pierde un tutorial importante.
→ Severidad: MEDIUM (funcionalidad afectada con workaround implícito)
→ Prioridad: Depende. Si el onboarding es clave para retención (y métricas muestran que usuarios que completan onboarding retienen 3x más), → P1. Si no impacta métricas → P2.

**Tu criterio como tester senior:**
NO todo bug necesita ser arreglado. Tu trabajo es dar la INFORMACIÓN correcta para que el equipo tome la decisión correcta. No eres el juez, eres el investigador.

**Red flags de bugs críticos en producción:**
1. Cualquier bug que involucre dinero (cobro incorrecto, doble cobro)
2. Cualquier bug que exponga datos de otro usuario
3. Cualquier bug que permita bypass de autenticación/autorización
4. Cualquier bug que cause pérdida de datos irrecuperable
5. Cualquier bug que bloquee el flujo principal para >5% de usuarios`,
        exercise: {
          type: 'decision',
          title: 'Ejercicio: Clasifica y Prioriza',
          description: `Eres el QA Lead. Tienes 6 bugs reportados y el sprint tiene capacidad para arreglar solo 3. Clasifica cada bug con severidad y prioridad, y decide cuáles 3 se arreglan ESTE sprint.

1. La app se crashea cuando el usuario toma una foto de perfil en iPhone 12 con iOS 17.
2. El botón "Cancelar suscripción" no funciona (el usuario debe llamar a soporte).
3. Los emails transaccionales se envían con 30 minutos de delay.
4. El dashboard de admin muestra métricas del día anterior en vez de hoy.
5. Un memory leak causa que la app web se ponga lenta después de 4 horas de uso continuo.
6. La búsqueda devuelve resultados en orden incorrecto cuando se usa el filtro de precio.

Justifica cada decisión.`,
        },
      },
    ],
  },
  {
    id: 4,
    title: 'Herramientas del Tester',
    icon: '🔧',
    color: '#F59E0B',
    units: [
      {
        title: 'Jira, Postman y SQL para Testers',
        content: `**JIRA / Azure DevOps — Tu herramienta de gestión diaria:**

No solo creas tickets. Un tester senior usa Jira para:
• Crear dashboards de calidad (bugs abiertos por severidad, bugs por módulo, velocity de fix)
• Configurar workflows de bug lifecycle (Open → In Progress → In Review → Verified → Closed)
• Usar JQL para queries avanzadas: \`project = CHECKOUT AND type = Bug AND severity = Critical AND status != Closed AND created >= -30d\`
• Linkear bugs a test cases y a stories (trazabilidad)

**Postman / API Testing — Tu segundo idioma:**

En el mundo moderno, el 80% del testing crítico es a nivel de API. La UI es solo la punta del iceberg.

Lo que debes dominar:
1. Construir requests GET/POST/PUT/DELETE
2. Usar variables de ambiente (staging vs prod)
3. Escribir tests en la pestaña Tests:
   \`pm.test("Status is 200", () => pm.response.to.have.status(200));\`
   \`pm.test("Response has user", () => { const json = pm.response.json(); pm.expect(json.user).to.exist; });\`
4. Crear collections con flujos completos (register → login → create order → verify order)
5. Usar pre-request scripts para generar datos dinámicos

**SQL para Testers — Lo que necesitas, sin ser DBA:**

Queries esenciales:
• SELECT * FROM orders WHERE user_id = 123 AND status = 'pending';
• SELECT COUNT(*) FROM users WHERE created_at > '2024-01-01';
• SELECT o.id, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.total != o.subtotal - o.discount;

La última query es ORO: encuentra inconsistencias de datos que la UI nunca te mostraría.

**Git para Testers:**
Mínimo viable: clone, pull, branch, checkout, log, diff. No necesitas ser un Git wizard, pero necesitas poder ver qué cambió en el último commit para enfocar tu regression testing.`,
        exercise: {
          type: 'practice',
          title: 'Ejercicio: Investigación con SQL',
          description: `Tienes acceso a estas tablas:
- users (id, email, plan_type, created_at, last_login)
- orders (id, user_id, total, discount, final_amount, status, created_at)
- payments (id, order_id, amount, payment_method, status, processed_at)

Te reportan: "Algunos usuarios Premium dicen que no recibieron su descuento del 15%."

Escribe las queries SQL que usarías para investigar:
1. Encontrar órdenes de usuarios Premium donde el descuento NO es 15% del total
2. Verificar si el monto cobrado (payments) coincide con el final_amount de la orden
3. Identificar desde cuándo empezó el problema

Bonus: ¿Qué JOIN usarías y por qué?`,
          sampleAnswer: `-- 1. Órdenes Premium sin descuento correcto
SELECT o.id, u.email, u.plan_type, o.total, o.discount, 
       ROUND(o.total * 0.15, 2) AS expected_discount
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.plan_type = 'premium'
AND o.discount != ROUND(o.total * 0.15, 2)
AND o.created_at > '2024-01-01'
ORDER BY o.created_at DESC;

-- 2. Inconsistencias entre payment y order
SELECT o.id AS order_id, o.final_amount, p.amount AS paid_amount,
       (o.final_amount - p.amount) AS discrepancy
FROM orders o
JOIN payments p ON p.order_id = o.id
WHERE o.final_amount != p.amount
AND p.status = 'completed';

-- 3. Cuándo empezó el problema (buscar el primer caso)
SELECT MIN(o.created_at) AS first_occurrence
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.plan_type = 'premium'
AND o.discount != ROUND(o.total * 0.15, 2)
AND o.discount > 0;

-- Uso INNER JOIN porque solo me interesan registros que existan en ambas tablas. Si quisiera ver órdenes SIN pago (posible bug), usaría LEFT JOIN.`,
        },
      },
    ],
  },
  {
    id: 5,
    title: 'Automatización',
    icon: '🤖',
    color: '#10B981',
    units: [
      {
        title: 'Cuándo Automatizar y Cuándo NO',
        content: `**La regla de oro:**
Automatiza lo que ejecutas más de 3 veces, es estable, y el costo de mantenimiento es menor que el costo de ejecución manual.

**SÍ automatiza:**
• Smoke tests que corren en cada build
• Regression de flujos core (login, checkout, CRUD principal)
• Validaciones de API (contratos, schemas, status codes)
• Data validation (queries SQL automatizadas contra DB)
• Tests de performance recurrentes

**NO automatiza:**
• Exploratory testing (por definición, no es automatizable)
• Tests que cambian cada sprint (alto costo de mantenimiento)
• Tests de UX/usabilidad (necesitan juicio humano)
• Features inestables o en desarrollo activo
• One-time validations

**El anti-patrón más costoso:**
Automatizar TODO. Equipos que automatizan 2000 E2E tests y luego pasan más tiempo manteniendo tests que testeando. La suite tarda 4 horas en correr. El 30% de los tests son flaky. Nadie confía en los resultados.

**La pirámide aplicada a automatización:**
70% tests de API/integración (rápidos, estables, alto valor)
20% tests de componente/servicio
10% tests E2E (solo happy paths críticos)

**Herramientas reales en Big Tech:**

Playwright — La opción moderna. Soporta múltiples browsers, auto-wait, network interception. Es lo que elegiría para un proyecto nuevo.

Cypress — Excelente DX, pero solo Chrome-based. Ideal para frontend-heavy apps.

Selenium — El legacy. Sigue siendo relevante en enterprise. Más verboso, más frágil.

**CI/CD y Testing:**
En Big Tech, los tests corren en cada PR (Pull Request). Si un test falla, el merge se bloquea automáticamente. Esto se configura en GitHub Actions, Jenkins, o CircleCI. El tester es responsable de que la suite sea confiable — un test flaky que bloquea deploys es un problema de TU equipo.`,
        exercise: {
          type: 'decision',
          title: 'Ejercicio: Decide Qué Automatizar',
          description: `Tu equipo tiene una app de gestión de proyectos (tipo Asana). Tienes capacidad para automatizar 20 tests esta semana. Estos son los candidatos:

1. Login con email/password (flujo principal)
2. Login con Google SSO
3. Crear un proyecto nuevo
4. Drag and drop de tareas entre columnas del board
5. Invitar un usuario al workspace por email
6. Filtrar tareas por fecha, asignado y prioridad
7. Subir archivos adjuntos a una tarea
8. Notificaciones en tiempo real cuando te asignan una tarea
9. Exportar proyecto a CSV
10. Cambiar el theme de light a dark mode
11. API: CRUD de tareas (/api/tasks)
12. API: Permisos — verificar que un viewer no puede editar
13. API: Rate limiting del endpoint de búsqueda
14. Flujo completo: crear proyecto → crear tarea → asignar → completar → archivar

Selecciona tus 20 tests y justifica. ¿Qué dejaste fuera y por qué?`,
        },
      },
      {
        title: 'Ejemplo Práctico: Automatización con Playwright',
        content: `**Setup básico de Playwright:**

\`\`\`javascript
// playwright.config.js
module.exports = {
  testDir: "./tests",
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: "https://staging.myapp.com",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
};
\`\`\`

**Test de login — estructura profesional:**

\`\`\`javascript
// tests/auth/login.spec.js
const { test, expect } = require("playwright/test");

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('successful login with valid credentials', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'test@company.com');
    await page.fill('[data-testid="password"]', 'ValidP@ss1');
    await page.click('[data-testid="login-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-name"]'))
      .toHaveText('Test User');
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'test@company.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]'))
      .toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  test('rate limits after 5 failed attempts', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.fill('[data-testid="email"]', 'test@company.com');
      await page.fill('[data-testid="password"]', 'wrong' + i);
      await page.click('[data-testid="login-button"]');
    }
    
    await expect(page.locator('[data-testid="rate-limit-message"]'))
      .toContainText('Too many attempts');
  });
});
\`\`\`

**Buenas prácticas que separan a un pro:**
1. Usa data-testid, NUNCA selectores CSS frágiles
2. Page Object Model para reusabilidad
3. Datos de prueba independientes (cada test crea su propia data)
4. Tests paralelos e independientes (nunca dependencias entre tests)
5. Assertions explícitas y descriptivas
6. Screenshots y traces automáticos en fallo`,
        exercise: {
          type: 'practice',
          title: 'Ejercicio: Escribe un Test Automatizado',
          description: `Escribe el código Playwright (o pseudocódigo si prefieres) para testear este flujo:

Feature: Agregar item al carrito y proceder al checkout
1. Buscar un producto por nombre
2. Seleccionar el primer resultado
3. Elegir cantidad: 2
4. Agregar al carrito
5. Ir al carrito
6. Verificar que el item está con cantidad 2
7. Verificar que el total es correcto (precio unitario × 2)
8. Proceder al checkout
9. Verificar que llegas a la página de checkout con el monto correcto

Incluye: manejo de esperas, assertions significativas, y al menos un caso negativo (qué pasa si el producto está agotado).`,
        },
      },
    ],
  },
  {
    id: 6,
    title: 'Testing Avanzado',
    icon: '🚀',
    color: '#EC4899',
    units: [
      {
        title: 'Performance, Seguridad y Microservicios',
        content: `**Performance Testing — No es solo "¿es rápido?"**

Tipos:
• Load Testing — ¿Soporta la carga esperada? (1000 usuarios simultáneos en hora pico)
• Stress Testing — ¿Cuándo se rompe? (incrementar hasta que falle, encontrar el límite)
• Soak Testing — ¿Se degrada con el tiempo? (carga constante por 24h, buscar memory leaks)
• Spike Testing — ¿Sobrevive picos repentinos? (Black Friday: de 100 a 10,000 usuarios en 2 minutos)

Herramientas: k6, JMeter, Gatling, Locust
Métricas clave: Response time (p50, p95, p99), throughput (RPS), error rate, resource utilization

**El p99 es lo que importa en Big Tech.** Si tu p50 es 200ms pero tu p99 es 5s, el 1% de tus usuarios tiene una experiencia terrible. Y si tienes 10M de usuarios, son 100,000 personas.

**Security Testing — Lo básico que TODO tester debe saber:**

OWASP Top 10 (los que testeas como QA, no como pentester):
1. Injection (SQL, XSS) — ¿Qué pasa si pongo <script>alert('xss')</script> en un campo de texto?
2. Broken Authentication — ¿Puedo acceder sin login? ¿Los tokens expiran?
3. IDOR (Insecure Direct Object Reference) — ¿Si cambio /api/users/123 a /api/users/124, veo datos de otro usuario?
4. CSRF — ¿Puedo hacer que otro usuario ejecute acciones sin su consentimiento?

**Testing en Microservicios:**

El desafío: en un monolito, un bug está en UN lugar. En microservicios, un bug puede ser la INTERACCIÓN entre 3 servicios.

Estrategias:
• Contract Testing (Pact) — Cada servicio define un contrato de lo que produce y consume. Si un servicio cambia su respuesta, el contrato se rompe ANTES del deploy.
• Chaos Engineering — Inyectar fallos deliberadamente. ¿Qué pasa si el servicio de pagos tiene 5s de latencia? ¿El servicio de órdenes maneja el timeout?
• Distributed Tracing — Herramientas como Jaeger o Zipkin para seguir un request a través de múltiples servicios.

**Testing en Sistemas Distribuidos:**
Problemas únicos: consistencia eventual, partición de red, clock skew. El bug más difícil: "funciona en mi ambiente local pero falla con 3 réplicas detrás de un load balancer."`,
        exercise: {
          type: 'scenario',
          title: 'Ejercicio: Plan de Testing para Microservicios',
          description: `Sistema: Plataforma de ride-sharing (tipo Uber).

Microservicios:
- User Service (perfiles, auth)
- Ride Service (solicitar viaje, matching conductor-pasajero)
- Payment Service (cobros, propinas)
- Notification Service (push, email, SMS)
- Pricing Service (cálculo dinámico de tarifa)

Escenario: El Pricing Service acaba de ser actualizado para incluir "surge pricing" (precios dinámicos por demanda). El cambio solo fue en Pricing Service, pero afecta a Ride Service y Payment Service.

Diseña un plan de testing que incluya:
1. Qué tipo de tests aplicarías a cada servicio
2. Qué contract tests necesitas entre servicios
3. Un escenario de chaos engineering para validar resiliencia
4. Cómo verificas que el pricing es consistente entre lo que ve el usuario, lo que cobra Payment, y lo que muestra el recibo`,
        },
      },
    ],
  },
  {
    id: 7,
    title: 'Mentalidad y Soft Skills',
    icon: '🧠',
    color: '#6366F1',
    units: [
      {
        title: 'Cómo Piensa un Tester de Elite',
        content: `**La diferencia entre un tester y un GRAN tester no es técnica. Es mentalidad.**

**1. Mentalidad Destructiva Constructiva:**
Tu trabajo no es confirmar que funciona. Es encontrar cómo se rompe. Pero NO para destruir, sino para PROTEGER. Cada bug que encuentras antes de producción es un incidente que evitaste.

Antes de testear cualquier feature, pregúntate:
• ¿Cómo usaría esto un usuario distraído?
• ¿Cómo abusaría esto un usuario malicioso?
• ¿Qué pasa cuando el sistema está bajo presión?
• ¿Qué asumió el developer que "nunca pasaría"?

**2. Cuestionar Requerimientos:**
El 40% de los bugs en producción se originan en requisitos ambiguos o incompletos. Tu primera línea de defensa no es la ejecución de tests, es la REVISIÓN de specs.

Cuando lees un requisito, busca:
• Verbos ambiguos: "el sistema debería manejar..." (¿cómo?)
• Ausencia de negativos: solo dice qué hacer, no qué NO hacer
• Números mágicos sin justificación: "timeout de 30 segundos" (¿por qué 30?)
• Dependencias no mencionadas: "usa los datos del usuario" (¿de qué servicio? ¿qué pasa si está caído?)

**3. Comunicación con Developers:**
NUNCA: "Tu código tiene un bug."
SIEMPRE: "Encontré un comportamiento inesperado en el flujo X. Cuando hago Y, el resultado es Z, pero según el requisito debería ser W. ¿Puede ser intencional?"

La diferencia es: respeto + datos + pregunta abierta.

**4. Decisiones Bajo Incertidumbre:**
No siempre vas a tener toda la información. A veces tienes que decidir: "¿es seguro lanzar?" con el 70% de la información.

Framework: "¿Cuál es el peor escenario si lanzamos con este bug? ¿Es reversible? ¿Tenemos monitoring para detectarlo rápido?"

**5. Ownership Real:**
No digas "yo reporté el bug, no es mi problema si no lo arreglan." Tu responsabilidad es la CALIDAD DEL PRODUCTO, no la cantidad de bugs reportados. Si un bug crítico llega a producción, el tester también falló.`,
        exercise: {
          type: 'scenario',
          title: 'Ejercicio: Escenarios de Criterio Real',
          description: `Escenario 1: Es jueves 6pm. El release es mañana viernes 8am. Encontraste un bug: en el 2% de los casos, la confirmación de compra tarda 15 segundos en vez de 2 segundos. No hay error funcional — el resultado es correcto, solo lento. El PM quiere lanzar. El developer dice "lo arreglo la próxima semana." ¿Qué haces?

Escenario 2: Un developer senior rechaza tu bug diciendo "no es un bug, es el comportamiento esperado." Tú estás seguro de que contradice el requisito. Pero el developer tiene 10 años en la empresa y tú llevas 3 meses. ¿Cómo manejas esto?

Escenario 3: Te piden testear un feature pero no hay especificación escrita. El PM dice "ya lo discutimos verbalmente, los developers saben qué hacer." ¿Qué haces?

Para cada escenario, describe tu respuesta EXACTA: qué dices, a quién, y qué acción tomas.`,
        },
      },
      {
        title: 'Destacar en Entrevistas de QA — Big Tech',
        content: `**Lo que buscan las Big Tech en un QA/SDET:**

1. **Pensamiento sistemático** — No quieren lista de tests. Quieren ver CÓMO piensas. Estructura tu respuesta: funcional → edge cases → integración → performance → seguridad → accesibilidad.

2. **Priorización basada en riesgo** — "Estos son todos los tests posibles, pero los 5 más críticos son estos PORQUE..."

3. **Conocimiento técnico** — Puedes leer código, entiendes APIs, sabes SQL, puedes automatizar.

4. **Comunicación clara** — Explicas problemas técnicos de forma que un PM entienda.

**Pregunta clásica: "¿Cómo testearías un elevador?"**

Respuesta junior: "Presionar botones, ver si se mueve."

Respuesta Big Tech:
"Primero categorizaría los tests:
Funcional: cada piso es accesible, puertas abren/cierran, indicador de piso es correcto.
Edge cases: ¿qué pasa si presiono todos los pisos? ¿Si presiono un piso y luego lo cancelo?
Concurrencia: llamadas simultáneas desde múltiples pisos — algoritmo de scheduling.
Seguridad: sensor de puertas detecta obstrucción, freno de emergencia funciona, teléfono de emergencia conecta.
Performance: tiempo de espera máximo, capacidad de peso, comportamiento con carga máxima.
Resiliencia: corte de energía durante movimiento, fallo de sensor, pérdida de comunicación.
Accesibilidad: botones braille, anuncios de voz, tiempo de puerta abierta suficiente.
Usabilidad: los botones son intuitivos, el indicador es visible, el movimiento es suave."

**Otros tipos de preguntas:**
• "Test this API endpoint" — Diseña tests de contrato, validación, error handling, performance
• "Write automation for..." — Código limpio, mantenible, con assertions significativas
• "Tell me about a bug you found" — STAR format: Situation, Task, Action, Result
• "How would you test with incomplete requirements?" — Muestra que puedes operar con ambigüedad

**El factor diferenciador:**
No es lo que sabes. Es cómo PIENSAS en voz alta. Practica verbalizar tu proceso de pensamiento.`,
        exercise: {
          type: 'scenario',
          title: 'Ejercicio: Mock Interview',
          description: `Responde estas preguntas como si estuvieras en una entrevista de FAANG:

1. "¿Cómo testearías la barra de búsqueda de Google?"
   (Organiza tu respuesta en categorías. No listes tests al azar.)

2. "Encontraste 15 bugs en un sprint. 3 son P0, 5 son P1, 7 son P2. Development solo puede arreglar 8 esta sprint. ¿Cuáles priorizas y cómo comunicas la decisión al equipo?"

3. "¿Cuál es la diferencia entre un buen tester y un gran tester?"

Escribe tus respuestas completas. Sé específico.`,
        },
      },
    ],
  },
];

const ProgressBar = ({ completed, total }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <div
      style={{
        flex: 1,
        height: 6,
        background: 'var(--bg-tertiary)',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${(completed / total) * 100}%`,
          height: '100%',
          background: 'var(--accent)',
          borderRadius: 3,
          transition: 'width 0.3s',
        }}
      />
    </div>
    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
      {completed}/{total}
    </span>
  </div>
);

const ExerciseSection = ({ exercise }) => {
  const [showHints, setShowHints] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userNotes, setUserNotes] = useState('');

  return (
    <div
      style={{
        marginTop: 24,
        padding: 20,
        background: 'var(--bg-secondary)',
        borderRadius: 12,
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 18 }}>🎯</span>
        <h4
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          {exercise.title}
        </h4>
        {exercise.type && (
          <span
            style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 99,
              background:
                exercise.type === 'scenario'
                  ? '#3B82F620'
                  : exercise.type === 'decision'
                  ? '#F59E0B20'
                  : '#10B98120',
              color:
                exercise.type === 'scenario'
                  ? '#3B82F6'
                  : exercise.type === 'decision'
                  ? '#F59E0B'
                  : '#10B981',
              fontWeight: 600,
            }}
          >
            {exercise.type === 'scenario'
              ? 'ESCENARIO'
              : exercise.type === 'decision'
              ? 'DECISIÓN'
              : 'PRÁCTICA'}
          </span>
        )}
      </div>
      <div
        style={{
          whiteSpace: 'pre-wrap',
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text-primary)',
        }}
      >
        {exercise.description}
      </div>

      <div style={{ marginTop: 16 }}>
        <textarea
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          placeholder="Escribe tu respuesta aquí antes de ver la solución..."
          style={{
            width: '100%',
            minHeight: 120,
            padding: 12,
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            fontSize: 14,
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {exercise.hints && (
          <button
            onClick={() => setShowHints(!showHints)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: showHints ? '#F59E0B20' : 'var(--bg-primary)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {showHints ? 'Ocultar' : 'Mostrar'} Pistas 💡
          </button>
        )}
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: showAnswer ? '#10B98120' : 'var(--bg-primary)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {showAnswer ? 'Ocultar' : 'Ver'} Respuesta Modelo ✅
        </button>
      </div>

      {showHints && exercise.hints && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: '#F59E0B10',
            borderRadius: 8,
            borderLeft: '3px solid #F59E0B',
          }}
        >
          {exercise.hints.map((h, i) => (
            <div
              key={i}
              style={{
                fontSize: 13,
                color: 'var(--text-primary)',
                marginBottom: 4,
              }}
            >
              💡 {h}
            </div>
          ))}
        </div>
      )}

      {showAnswer && exercise.sampleAnswer && (
        <div
          style={{
            marginTop: 12,
            padding: 16,
            background: '#10B98110',
            borderRadius: 8,
            borderLeft: '3px solid #10B981',
          }}
        >
          <div
            style={{
              whiteSpace: 'pre-wrap',
              fontSize: 13,
              lineHeight: 1.7,
              color: 'var(--text-primary)',
            }}
          >
            {exercise.sampleAnswer}
          </div>
        </div>
      )}
    </div>
  );
};

export default function QACourse() {
  const [activeModule, setActiveModule] = useState(0);
  const [activeUnit, setActiveUnit] = useState(0);
  const [completedUnits, setCompletedUnits] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentModule = MODULES[activeModule];
  const currentUnit = currentModule.units[activeUnit];
  const totalUnits = MODULES.reduce((a, m) => a + m.units.length, 0);
  const completedCount = Object.keys(completedUnits).length;

  const markComplete = useCallback(() => {
    const key = `${activeModule}-${activeUnit}`;
    setCompletedUnits((prev) => ({ ...prev, [key]: true }));
    if (activeUnit < currentModule.units.length - 1) {
      setActiveUnit(activeUnit + 1);
    } else if (activeModule < MODULES.length - 1) {
      setActiveModule(activeModule + 1);
      setActiveUnit(0);
    }
  }, [activeModule, activeUnit, currentModule]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: 'var(--bg-primary, #0f172a)',
        color: 'var(--text-primary, #e2e8f0)',
        overflow: 'hidden',
        '--bg-primary': '#0f172a',
        '--bg-secondary': '#1e293b',
        '--bg-tertiary': '#334155',
        '--text-primary': '#e2e8f0',
        '--text-secondary': '#94a3b8',
        '--border': '#334155',
        '--accent': '#3B82F6',
      }}
    >
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 10,
          }}
        />
      )}

      <aside
        style={{
          width: 300,
          minWidth: 300,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: sidebarOpen ? 'fixed' : 'relative',
          zIndex: sidebarOpen ? 20 : 1,
          height: '100%',
          ...(typeof window !== 'undefined' &&
          window.innerWidth < 768 &&
          !sidebarOpen
            ? { display: 'none' }
            : {}),
        }}
      >
        <div
          style={{
            padding: '20px 16px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 20 }}>🎓</span>
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: -0.3,
              }}
            >
              QA Engineering Mastery
            </h2>
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--text-secondary)',
              marginBottom: 12,
              marginLeft: 28,
            }}
          >
            Big Tech Level • De cero a profesional
          </div>
          <ProgressBar completed={completedCount} total={totalUnits} />
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
          {MODULES.map((mod, mi) => (
            <div key={mod.id}>
              <div
                style={{
                  padding: '12px 16px 4px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: mod.color,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{mod.icon}</span> Módulo {mod.id}
              </div>
              <div
                style={{
                  padding: '0 8px 4px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  paddingLeft: 16,
                }}
              >
                {mod.title}
              </div>
              {mod.units.map((unit, ui) => {
                const isActive = mi === activeModule && ui === activeUnit;
                const isComplete = completedUnits[`${mi}-${ui}`];
                return (
                  <button
                    key={ui}
                    onClick={() => {
                      setActiveModule(mi);
                      setActiveUnit(ui);
                      setSidebarOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '8px 16px',
                      background: isActive ? `${mod.color}15` : 'transparent',
                      border: 'none',
                      borderLeft: isActive
                        ? `3px solid ${mod.color}`
                        : '3px solid transparent',
                      color: isActive ? mod.color : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: 12,
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 14 }}>
                      {isComplete ? '✅' : '○'}
                    </span>
                    <span style={{ lineHeight: 1.3 }}>{unit.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <header
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'var(--bg-secondary)',
            position: 'sticky',
            top: 0,
            zIndex: 5,
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: 20,
              padding: 4,
              display: 'flex',
            }}
          >
            ☰
          </button>
          <div style={{ flex: 1 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: currentModule.color,
              }}
            >
              {currentModule.icon} MÓDULO {currentModule.id}
            </span>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              {currentUnit.title}
            </h1>
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              textAlign: 'right',
            }}
          >
            {Math.round((completedCount / totalUnits) * 100)}% completado
          </div>
        </header>

        <div
          style={{
            flex: 1,
            padding: '24px 20px',
            maxWidth: 800,
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              whiteSpace: 'pre-wrap',
              fontSize: 14,
              lineHeight: 1.8,
              color: 'var(--text-primary)',
            }}
          >
            {currentUnit.content.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong
                    key={i}
                    style={{ color: currentModule.color, fontWeight: 700 }}
                  >
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </div>

          {currentUnit.exercise && (
            <ExerciseSection exercise={currentUnit.exercise} />
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 32,
              paddingTop: 20,
              borderTop: '1px solid var(--border)',
            }}
          >
            <button
              onClick={() => {
                if (activeUnit > 0) setActiveUnit(activeUnit - 1);
                else if (activeModule > 0) {
                  setActiveModule(activeModule - 1);
                  setActiveUnit(MODULES[activeModule - 1].units.length - 1);
                }
              }}
              disabled={activeModule === 0 && activeUnit === 0}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                cursor:
                  activeModule === 0 && activeUnit === 0
                    ? 'not-allowed'
                    : 'pointer',
                fontSize: 13,
                fontWeight: 600,
                opacity: activeModule === 0 && activeUnit === 0 ? 0.4 : 1,
              }}
            >
              ← Anterior
            </button>
            <button
              onClick={markComplete}
              style={{
                padding: '10px 24px',
                borderRadius: 8,
                border: 'none',
                background: completedUnits[`${activeModule}-${activeUnit}`]
                  ? '#10B981'
                  : currentModule.color,
                color: 'white',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {completedUnits[`${activeModule}-${activeUnit}`]
                ? '✅ Completado'
                : 'Completar y Continuar →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
