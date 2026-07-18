import type { Dict } from "./en";

export const es: Dict = {
  locale: "es",
  siteTagline: "Conectando Necesidades Humanas con Soluciones Humanas.",
  siteDescription:
    "Humanade es la forma más simple de pedir ayuda u ofrecer ayuda. Publica una necesidad, publica una oferta y conéctate — en cualquier parte del mundo.",

  nav: { browse: "Explorar", map: "Mapa", about: "Acerca de" },
  cta: { need: "Necesito Ayuda", offer: "Puedo Ayudar" },
  footer: {
    platformOf: "Una plataforma del",
    org: "Institute for Human Evolution",
  },
  lang: { switchTo: "English", switchCode: "en" },

  types: { NEED: "Necesito Ayuda", OFFER: "Puedo Ayudar" },
  categories: {
    CONNECT: { label: "Conexión Humana", short: "Conexión" },
    HEALTH: { label: "Salud", short: "Salud" },
    DENTAL: { label: "Salud Dental", short: "Dental" },
    NUTRITION: { label: "Alimentación", short: "Alimentación" },
    SHELTER: { label: "Refugio", short: "Refugio" },
    VOLUNTEERS: { label: "Voluntarios", short: "Voluntarios" },
    LOGISTICS: { label: "Logística", short: "Logística" },
    EDUCATION: { label: "Educación", short: "Educación" },
  },
  urgencies: { CRITICAL: "Crítica", HIGH: "Alta", NORMAL: "Normal" },
  urgencyBadge: { CRITICAL: "Urgencia crítica", HIGH: "Urgencia alta" },
  statuses: {
    OPEN: "Abierto",
    ASSIGNED: "Asignado",
    FULFILLED: "Resuelto",
    CLOSED: "Cerrado",
  },

  time: {
    justNow: "ahora mismo",
    m: " min",
    h: " h",
    d: " d",
    mo: " meses",
    y: " años",
  },

  home: {
    heroSub:
      "Humanade es la forma más simple de pedir ayuda u ofrecer ayuda. Sin cuentas ni registro. Publica en menos de un minuto.",
    needDesc: "Publica una solicitud — agua, comida, medicinas, refugio, transporte…",
    offerDesc: "Ofrece insumos, habilidades, espacio, transporte o tu tiempo.",
    openRequests: "solicitudes abiertas",
    openRequest: "solicitud abierta",
    openOffers: "ofertas abiertas",
    openOffer: "oferta abierta",
    browseAllInline: "ver todas",
    orWord: "o",
    viewMapInline: "ver el mapa",
    criticalNow: "Crítico en este momento",
    seeAllCritical: "Ver todo lo crítico",
    byCategory: "Explorar por categoría",
    latest: "Últimas publicaciones",
    browseAll: "Ver todas",
    emptyPre: "Aún no hay publicaciones. Sé la primera persona en",
    emptyLink: "publicar una necesidad o una oferta",
    howTitle: "Cómo funciona Humanade",
    how1t: "Publica",
    how1d: "Describe qué necesitas o qué puedes dar, y dónde. Sin cuentas ni formularios más allá de lo esencial.",
    how2t: "Conecta",
    how2d: "Las personas te contactan directamente por teléfono, WhatsApp o correo — sin intermediarios, sin esperas.",
    how3t: "Resuelve",
    how3d: "Marca tu publicación como asignada o resuelta con tu enlace privado de gestión, para que la ayuda llegue donde todavía hace falta.",
  },

  filter: {
    searchPlaceholder: "Buscar…",
    searchAria: "Buscar publicaciones",
    needsOffers: "Necesidades + Ofertas",
    allCategories: "Todas las categorías",
    anyUrgency: "Cualquier urgencia",
    activeDefault: "Activas (abiertas + asignadas)",
    everything: "Todas",
    filter: "Filtrar",
    clear: "Limpiar",
    type: "Tipo",
    category: "Categoría",
    urgency: "Urgencia",
    status: "Estado",
  },

  browse: {
    title: "Explorar publicaciones",
    results: "resultados",
    result: "resultado",
    viewOnMap: "ver en el mapa",
    noMatch: "Ninguna publicación coincide con estos filtros.",
    postCtaPre: "",
    postCta: "Publica una necesidad o una oferta",
    postCtaPost: "para comenzar.",
    prev: "← Anterior",
    next: "Siguiente →",
    pageWord: "Página",
    ofWord: "de",
  },

  listing: {
    back: "← Volver a explorar",
    posted: "Publicado",
    resolvedPre: "Esta publicación fue marcada como",
    resolvedPost: "y ya no está activa.",
    browseActive: "Ver publicaciones activas",
    quantity: "Cantidad / escala:",
    contact: "Contactar a",
    contactSub: "Contacta directamente — Humanade no es intermediario.",
    pinned: "Ubicación marcada:",
    openOSM: "abrir en OpenStreetMap",
    seeAllMap: "ver todo en el mapa de Humanade",
    safety:
      "¿Publicaste algo? Usa el enlace privado de gestión que recibiste para actualizar o cerrar tu publicación. Cuídate: reúnete en lugares públicos cuando sea posible y nunca envíes dinero a personas que no puedas verificar.",
    call: "Llamar",
    whatsapp: "WhatsApp",
    email: "Correo",
  },

  post: {
    chooseTitle: "¿Qué quieres publicar?",
    needCardDesc: "Publica una solicitud para ti, tu familia o tu comunidad.",
    offerCardDesc: "Ofrece insumos, habilidades, espacio, transporte o tiempo.",
    changeType: "← Cambiar tipo",
    needIntro:
      "Describe qué necesitas. Sé concreto para que quienes pueden ayudar sepan exactamente cómo responder.",
    offerIntro:
      "Describe qué puedes aportar. Sé concreto para que la gente sepa exactamente qué pedir.",
    whatsappTitle: "O publica por WhatsApp",
    whatsappDesc:
      "Envía un mensaje de WhatsApp que empiece con NECESITO u OFREZCO y lo publicamos por ti.",
    whatsappBtn: "💬 Publicar por WhatsApp",
  },

  form: {
    whatNeed: "¿Qué necesitas?",
    whatOffer: "¿Qué puedes ofrecer?",
    needTitlePh: "ej. Agua potable para 30 familias",
    offerTitlePh: "ej. Médico disponible para consultas remotas",
    details: "Detalles",
    needDetailsPh:
      "Qué se necesita exactamente, para cuántas personas, para cuándo, y cualquier contexto importante.",
    offerDetailsPh:
      "Qué puedes aportar, cuánto, cuándo está disponible y bajo qué condiciones.",
    category: "Categoría",
    choose: "Elige…",
    urgency: "Urgencia",
    quantity: "Cantidad / escala",
    optional: "(opcional)",
    quantityPh: "ej. 200 litros, 5 camas, 3 voluntarios",
    location: "Ubicación",
    locationPh: "Ciudad, pueblo, sector o zona",
    contactLegend: "Contacto",
    contactSub: "Las personas te contactarán directamente. Indica al menos un canal.",
    yourName: "Tu nombre",
    org: "Organización",
    orgPh: "ONG, iglesia, refugio, negocio…",
    phone: "Teléfono",
    whatsapp: "WhatsApp",
    email: "Correo",
    submitNeed: "Publicar mi solicitud",
    submitOffer: "Publicar mi oferta",
    posting: "Publicando…",
    afterNote:
      "Al publicar recibirás un enlace privado de gestión para editar, marcar como resuelta o cerrar tu publicación. Tus datos de contacto se muestran públicamente para que puedan ayudarte.",
  },

  picker: {
    addPin: "📍 Marcar en el mapa (opcional)",
    useMyLocation: "Usar mi ubicación",
    removePin: "Quitar marcador",
    pinnedAt: "Marcado en",
    tapMap: "Toca el mapa para colocar un marcador",
  },

  errors: {
    titleMin: "El título debe tener al menos 4 caracteres",
    titleMax: "El título debe tener 120 caracteres o menos",
    descMin: "Describe la necesidad u oferta en al menos 10 caracteres",
    descMax: "La descripción debe tener 4000 caracteres o menos",
    locationMin: "Indica dónde es (ciudad, pueblo o zona)",
    nameMin: "Indica un nombre",
    emailInvalid: "Correo electrónico inválido",
    contactRequired:
      "Indica al menos una forma de contacto: teléfono, WhatsApp o correo",
    coordInvalid: "Coordenada inválida",
  },

  manage: {
    managing: "Gestionando tu publicación",
    createdTitle: "🎉 ¡Tu publicación está en línea!",
    createdNote:
      "Guarda este enlace privado. Es la única forma de editar, marcar como resuelta o cerrar tu publicación después — en Humanade no hay cuentas ni contraseñas.",
    saved: "✓ Cambios guardados.",
    invalid:
      "Algunos campos eran inválidos y no se guardó la actualización. Revisa el formulario — toda publicación necesita título, detalles, ubicación, tu nombre y al menos un canal de contacto.",
    confirmDelete:
      "Para eliminar, marca la casilla de confirmación junto al botón de eliminar.",
    viewPublic: "Ver publicación pública →",
    statusTitle: "Actualizar estado",
    statusSub:
      "Mantener el estado al día dirige la ayuda hacia donde todavía hace falta.",
    editTitle: "Editar publicación",
    save: "Guardar cambios",
    deleteTitle: "Eliminar publicación",
    deleteSub:
      "Elimina la publicación de forma permanente. Si la necesidad fue cubierta, es mejor marcarla como Resuelta.",
    imSure: "Estoy seguro",
    deleteBtn: "Eliminar permanentemente",
    privateLink: "Tu enlace privado",
    privateLinkNote:
      "Cualquier persona con este enlace puede gestionar esta publicación. No lo compartas públicamente.",
    copyLink: "Copiar enlace",
    copied: "✓ Copiado",
  },

  map: {
    title: "Mapa de necesidades y ofertas",
    needs: "Necesidades",
    offers: "Ofertas",
    showing: "Mostrando",
    pinnedListings: "publicaciones marcadas",
    pinnedListing: "publicación marcada",
    unpinnedNote: "Las publicaciones sin marcador aparecen solo en",
    browseWord: "explorar",
    need: "Necesidad",
    offer: "Oferta",
    viewListing: "Ver publicación →",
  },

  about: {
    title: "Acerca de Humanade",
    p1strong: "Humanade es la forma más simple de pedir ayuda u ofrecer ayuda.",
    p1: "Conecta a personas que necesitan algo — agua, comida, medicinas, refugio, transporte, un profesional, un voluntario — con personas, organizaciones y negocios que pueden proveerlo.",
    p2: "No hay cuentas, ni muros sociales, ni campañas de recaudación. Publicas lo que necesitas o lo que puedes dar, las personas te contactan directamente por teléfono, WhatsApp o correo, y cierras la publicación cuando se resuelve. Piénsalo como infraestructura práctica: una cartelera pública de necesidades humanas y soluciones humanas.",
    p3: "Humanade está construida para funcionar donde más se necesita — zonas de desastre, comunidades desatendidas y lugares con internet débil o inestable. Las páginas son livianas, explorar funciona en teléfonos básicos y nada requiere una tienda de aplicaciones.",
    p4pre: "Humanade es una plataforma del",
    p4post: ", una organización sin fines de lucro. La plataforma es gratuita, para todos, en todas partes.",
    safetyTitle: "Recomendaciones de seguridad",
    safety1: "Reúnete en lugares públicos al entregar o recibir donaciones cuando sea posible.",
    safety2: "Nunca envíes dinero a alguien que no puedas verificar.",
    safety3: "No compartas más información personal de la necesaria.",
    safety4pre: "Reporta publicaciones sospechosas a",
    cta: "Publicar una necesidad o una oferta",
  },

  admin: {
    title: "Moderación",
    enterNote:
      "Ingresa la clave de administración configurada en la variable de entorno ADMIN_KEY.",
    keyPh: "Clave de administración",
    enter: "Entrar",
    listings: "publicaciones",
    listing: "publicación",
    hidden: "Oculta",
    hide: "Ocultar",
    unhide: "Mostrar",
    delete: "Eliminar",
  },

  notFound: {
    title: "Página no encontrada",
    body: "La página que buscas no existe o la publicación fue eliminada.",
    home: "Ir a la página principal",
  },
};
