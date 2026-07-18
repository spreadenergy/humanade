/**
 * Seed data: realistic sample listings for the Venezuela relief effort
 * (La Guaira / Vargas focus), in Spanish, so the platform doesn't launch
 * empty. Based on real requests circulating in WhatsApp/Facebook relief
 * groups. Run with `npm run db:seed` (only seeds an empty database).
 */
import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const token = () => crypto.randomBytes(18).toString("base64url");

const listings = [
  {
    type: "NEED",
    title: "Agua potable para el sector — necesidad continua",
    description:
      "Seguimos sin servicio de agua en el sector. Necesitamos agua potable de forma continua para unas 40 familias: botellones, botellas o cisterna. Podemos organizar la distribución nosotros mismos desde la casa comunal.",
    category: "NUTRITION",
    urgency: "CRITICAL",
    quantity: "Botellones y cisterna, ~40 familias",
    locationName: "La Guaira, Vargas",
    lat: 10.6012,
    lng: -66.9321,
    contactName: "María Rondón",
    orgName: "Casa Comunal del sector",
    whatsapp: "+58 412 555 0142",
    phone: "+58 412 555 0142",
  },
  {
    type: "NEED",
    title: "Antibióticos y antialérgicos para puesto de salud",
    description:
      "El puesto de salud improvisado atiende a decenas de personas al día. Se necesitan con urgencia antibióticos de amplio espectro, antialérgicos, analgésicos y material de cura. También guantes de nitrilo para el personal.",
    category: "HEALTH",
    urgency: "CRITICAL",
    quantity: "Todo lo que se pueda aportar",
    locationName: "Maiquetía, Vargas",
    lat: 10.5971,
    lng: -66.9771,
    contactName: "Dr. José Blanco",
    orgName: "Puesto de salud comunitario",
    whatsapp: "+58 414 555 0163",
  },
  {
    type: "NEED",
    title: "Pañales (todas las tallas) y toallas húmedas",
    description:
      "Familias con bebés y adultos mayores necesitan pañales de todas las tallas — de bebé y de adulto — y toallas húmedas. La necesidad es constante. Recibimos donaciones todos los días en la mañana.",
    category: "NUTRITION",
    urgency: "HIGH",
    quantity: "Todas las tallas, entrega continua",
    locationName: "Catia La Mar, Vargas",
    lat: 10.6003,
    lng: -67.0301,
    contactName: "Carmen Ugueto",
    whatsapp: "+58 424 555 0195",
  },
  {
    type: "NEED",
    title: "Protector solar, crema humectante y repelente para brigadas",
    description:
      "Las brigadas de rescate y voluntarios trabajan todo el día bajo el sol. Se necesita mucho protector solar, crema humectante y repelente de insectos. También pedimos hielo y bebidas hidratantes para los turnos largos.",
    category: "HEALTH",
    urgency: "HIGH",
    quantity: "Para ~60 voluntarios diarios",
    locationName: "Macuto, Vargas",
    lat: 10.6089,
    lng: -66.8997,
    contactName: "Luis Perdomo",
    orgName: "Brigada de voluntarios de Macuto",
    whatsapp: "+58 412 555 0129",
  },
  {
    type: "NEED",
    title: "Gatarina, perrarina, pecheras y correas para animales rescatados",
    description:
      "Estamos rescatando perros y gatos que quedaron atrás. Necesitamos gatarina y perrarina de forma continua, además de pecheras, correas y jaulas de transporte. Cualquier cantidad ayuda.",
    category: "CONNECT",
    urgency: "HIGH",
    quantity: "Alimento continuo + 20 pecheras/correas",
    locationName: "Caraballeda, Vargas",
    lat: 10.6113,
    lng: -66.8521,
    contactName: "Andreína Sojo",
    orgName: "Rescate Animal Vargas",
    whatsapp: "+58 416 555 0188",
  },
  {
    type: "NEED",
    title: "Hielo y bebidas para voluntarios — indicar punto de entrega",
    description:
      "Necesitamos hielo (¡y dónde entregarlo, hay poca cadena de frío!), agua fría, bebidas dulces y energizantes para los equipos que trabajan en la remoción de escombros. Coordinamos por WhatsApp el punto de entrega del día.",
    category: "NUTRITION",
    urgency: "NORMAL",
    quantity: "Diario, equipos de ~30 personas",
    locationName: "Naiguatá, Vargas",
    lat: 10.6224,
    lng: -66.7357,
    contactName: "Pedro Iriarte",
    whatsapp: "+58 426 555 0136",
  },
  {
    type: "OFFER",
    title: "Camión disponible para traslado de donaciones Caracas–Vargas",
    description:
      "Tengo un camión NPR con capacidad de 3 toneladas disponible martes y jueves para subir donaciones desde Caracas hasta La Guaira y los sectores del litoral. Combustible cubierto para cargas de organizaciones verificadas.",
    category: "LOGISTICS",
    urgency: "NORMAL",
    quantity: "2 viajes/semana, 3 toneladas",
    locationName: "Caracas → La Guaira",
    lat: 10.488,
    lng: -66.8792,
    contactName: "Rafael Medina",
    whatsapp: "+58 412 555 0171",
    phone: "+58 412 555 0171",
  },
  {
    type: "OFFER",
    title: "Médico general disponible por WhatsApp (telemedicina gratuita)",
    description:
      "Soy médico general y ofrezco consultas gratuitas por WhatsApp (texto, audio o videollamada) en las tardes y fines de semana. Puedo orientar sobre síntomas, revisar tratamientos e indicar cuándo acudir a un centro de salud.",
    category: "HEALTH",
    urgency: "NORMAL",
    quantity: "Hasta 15 consultas semanales",
    locationName: "Remoto — Caracas",
    lat: 10.4806,
    lng: -66.9036,
    contactName: "Dra. Gabriela Paz",
    whatsapp: "+58 414 555 0177",
    email: "dra.paz@example.org",
  },
  {
    type: "OFFER",
    title: "Psicóloga disponible por WhatsApp para afectados",
    description:
      "Ofrezco acompañamiento psicológico gratuito por WhatsApp a personas y familias afectadas, con prioridad para niños y adolescentes. Sesiones de 40 minutos, en horario flexible.",
    category: "HEALTH",
    urgency: "NORMAL",
    quantity: "10 sesiones semanales",
    locationName: "Remoto — Venezuela",
    lat: null,
    lng: null,
    contactName: "Lic. Verónica Añez",
    whatsapp: "+58 424 555 0154",
  },
  {
    type: "OFFER",
    title: "Iglesia ofrece refugio temporal para 20 personas",
    description:
      "Nuestro templo tiene espacio techado, baños y cocina para alojar hasta 20 personas, con prioridad para familias con niños. Contamos con colchonetas y agua. Disponible de inmediato.",
    category: "SHELTER",
    urgency: "HIGH",
    quantity: "20 personas",
    locationName: "Catia La Mar, Vargas",
    lat: 10.6048,
    lng: -67.0203,
    contactName: "Pastor Daniel Rengifo",
    orgName: "Iglesia El Buen Samaritano",
    phone: "+58 412 555 0110",
    whatsapp: "+58 412 555 0110",
  },
  {
    type: "OFFER",
    title: "Cocina comunitaria: 150 platos de comida caliente diarios",
    description:
      "Nuestra cocina comunitaria prepara 150 platos de comida caliente de lunes a sábado, listos al mediodía. Retiro en el punto o entregamos a refugios cercanos avisando con un día de anticipación.",
    category: "NUTRITION",
    urgency: "NORMAL",
    quantity: "150 platos/día",
    locationName: "Pariata, Maiquetía",
    lat: 10.5995,
    lng: -66.9552,
    contactName: "Sra. Josefina Mayora",
    orgName: "Cocina Solidaria Pariata",
    whatsapp: "+58 416 555 0125",
    status: "ASSIGNED",
  },
  {
    type: "OFFER",
    title: "Grupo de estudiantes voluntarios para jornadas de limpieza",
    description:
      "Somos 25 estudiantes universitarios disponibles los fines de semana para jornadas de limpieza, remoción de escombros menores, clasificación de donaciones y apoyo logístico. Llevamos nuestras propias herramientas básicas.",
    category: "VOLUNTEERS",
    urgency: "NORMAL",
    quantity: "25 voluntarios, sábados y domingos",
    locationName: "La Guaira y alrededores",
    lat: 10.5965,
    lng: -66.9401,
    contactName: "Diego Chacón",
    orgName: "Voluntariado UCV",
    whatsapp: "+58 412 555 0102",
    email: "voluntariado.ucv@example.org",
  },
  {
    type: "OFFER",
    title: "Depósito techado disponible para almacenar donaciones (200 m²)",
    description:
      "Ofrecemos un galpón techado, seco y con vigilancia para almacenar donaciones. Acceso para camiones y montacarga manual. Disponible sin costo por al menos 6 meses para organizaciones de ayuda.",
    category: "LOGISTICS",
    urgency: "NORMAL",
    quantity: "200 m²",
    locationName: "Maiquetía, Vargas",
    lat: 10.5934,
    lng: -66.9822,
    contactName: "Miguel Ascanio",
    orgName: "Comercial Ascanio",
    phone: "+58 414 555 0118",
  },
  {
    type: "NEED",
    title: "Transporte para trasladar adultos mayores a diálisis",
    description:
      "Tres adultos mayores del sector necesitan traslado a sus sesiones de diálisis (lunes, miércoles y viernes en la mañana). La vía está parcialmente afectada y no hay transporte público en la ruta. Podemos aportar para la gasolina.",
    category: "LOGISTICS",
    urgency: "HIGH",
    quantity: "3 traslados ida y vuelta, 3 veces/semana",
    locationName: "Carayaca, Vargas",
    lat: 10.5391,
    lng: -67.1234,
    contactName: "Teresa Liendo",
    whatsapp: "+58 426 555 0147",
    phone: "+58 426 555 0147",
  },
  {
    type: "NEED",
    title: "Útiles escolares para 80 niños del sector",
    description:
      "La escuelita del sector retoma clases en un espacio prestado. Se necesitan cuadernos, lápices, colores, morrales y material didáctico básico para 80 niños entre 5 y 12 años que perdieron sus útiles.",
    category: "EDUCATION",
    urgency: "NORMAL",
    quantity: "80 kits escolares",
    locationName: "Macuto, Vargas",
    lat: 10.6102,
    lng: -66.9052,
    contactName: "Profa. Milagros Guanche",
    orgName: "Escuela Comunitaria de Macuto",
    whatsapp: "+58 412 555 0161",
    email: "escuela.macuto@example.org",
  },
  {
    type: "NEED",
    title: "Planta eléctrica para puesto médico — ¡RESUELTO, gracias!",
    description:
      "Nuestro puesto médico necesitaba una planta eléctrica (3kW o más) para refrigerar medicamentos y atender de noche. Una empresa de Caracas donó una planta de 5kW. ¡Gracias a todos los que compartieron la publicación!",
    category: "HEALTH",
    urgency: "NORMAL",
    quantity: "1 planta de 5kW (donada)",
    locationName: "Caraballeda, Vargas",
    lat: 10.6127,
    lng: -66.8479,
    contactName: "Dr. Pablo Reyes",
    orgName: "Puesto Médico Caraballeda",
    whatsapp: "+58 414 555 0139",
    status: "FULFILLED",
  },
];

async function main() {
  const existing = await prisma.listing.count();
  if (existing > 0) {
    console.log(`Database already has ${existing} listings — skipping seed.`);
    return;
  }
  for (const l of listings) {
    await prisma.listing.create({
      data: { status: "OPEN", ...l, manageToken: token() },
    });
  }
  console.log(`Seeded ${listings.length} listings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
