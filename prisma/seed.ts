/**
 * Seed data: realistic sample needs and offers so the platform doesn't
 * launch empty. Run with `npm run db:seed` (safe to re-run — it only
 * seeds an empty database).
 */
import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const token = () => crypto.randomBytes(18).toString("base64url");

const listings = [
  {
    type: "NEED",
    title: "Drinking water for 30 families",
    description:
      "Our neighborhood has been without running water for 5 days after the flooding. We need bottled or trucked drinking water for roughly 30 families (about 110 people). We can organize distribution ourselves — we just need the water delivered to the community center.",
    category: "NUTRITION",
    urgency: "CRITICAL",
    quantity: "~600 liters per day",
    locationName: "Barrio San José, Comerío, Puerto Rico",
    lat: 18.2199,
    lng: -66.2260,
    contactName: "María Rivera",
    orgName: "Centro Comunal San José",
    phone: "+1 787 555 0142",
    whatsapp: "+1 787 555 0142",
  },
  {
    type: "OFFER",
    title: "Doctor available for remote consultations",
    description:
      "I'm a licensed general practitioner offering free remote consultations by phone or WhatsApp video, evenings and weekends. Spanish and English. I can help triage symptoms, review medications, and advise when in-person care is really needed.",
    category: "HEALTH",
    urgency: "NORMAL",
    quantity: "Up to 10 consultations per week",
    locationName: "Remote — based in Miami, FL, USA",
    lat: 25.7617,
    lng: -80.1918,
    contactName: "Dr. Andrés Molina",
    whatsapp: "+1 305 555 0177",
    email: "dr.molina@example.org",
  },
  {
    type: "NEED",
    title: "Insulin (rapid-acting) urgently needed",
    description:
      "My father is diabetic and we lost his medication in the evacuation. He needs rapid-acting insulin (Humalog or equivalent) within the next 48 hours. We have a cooler and can meet anywhere in the metro area.",
    category: "HEALTH",
    urgency: "CRITICAL",
    quantity: "2–3 pens",
    locationName: "Guaynabo, Puerto Rico",
    lat: 18.3833,
    lng: -66.1096,
    contactName: "Luis Ortega",
    phone: "+1 787 555 0163",
    whatsapp: "+1 787 555 0163",
  },
  {
    type: "OFFER",
    title: "Church hall available as temporary shelter",
    description:
      "Our church hall can host up to 25 people. We have mats, blankets, two bathrooms, a kitchen, and a backup generator. Families with children are prioritized. Open immediately, for stays up to 3 weeks.",
    category: "SHELTER",
    urgency: "HIGH",
    quantity: "25 beds",
    locationName: "Iglesia Roca Firme, Caguas, Puerto Rico",
    lat: 18.2341,
    lng: -66.0485,
    contactName: "Pastor Elías Fuentes",
    orgName: "Iglesia Roca Firme",
    phone: "+1 787 555 0110",
    email: "rocafirme@example.org",
  },
  {
    type: "NEED",
    title: "Volunteers to clear debris from elderly residents' homes",
    description:
      "We're coordinating cleanup for elderly residents who can't clear storm debris themselves. Need able-bodied volunteers for Saturday morning shifts. Gloves and tools provided; bring water and sun protection.",
    category: "VOLUNTEERS",
    urgency: "HIGH",
    quantity: "15–20 volunteers, Saturdays 7am–12pm",
    locationName: "Cataño, Puerto Rico",
    lat: 18.4411,
    lng: -66.1500,
    contactName: "Carmen Delgado",
    orgName: "Brigada Vecinal Cataño",
    whatsapp: "+1 787 555 0195",
  },
  {
    type: "OFFER",
    title: "Pickup truck + driver for supply deliveries",
    description:
      "I have a 4x4 pickup (1-ton capacity) and free time Tuesdays and Thursdays. I can move supplies, water, or building materials anywhere within 100 km. Fuel covered for verified relief runs.",
    category: "LOGISTICS",
    urgency: "NORMAL",
    quantity: "2 days/week, ~1 ton per trip",
    locationName: "Ponce, Puerto Rico",
    lat: 18.0111,
    lng: -66.6141,
    contactName: "Jorge Santana",
    phone: "+1 787 555 0129",
    whatsapp: "+1 787 555 0129",
  },
  {
    type: "NEED",
    title: "Psychologist for teens at community shelter",
    description:
      "Our shelter currently hosts 14 teenagers who lived through the earthquake. We're looking for a psychologist or counselor who can run weekly group sessions, in person or remotely. Spanish required.",
    category: "HEALTH",
    urgency: "HIGH",
    quantity: "1–2 sessions per week",
    locationName: "Yauco, Puerto Rico",
    lat: 18.0344,
    lng: -66.8499,
    contactName: "Rosa Meléndez",
    orgName: "Albergue Esperanza",
    email: "albergue.esperanza@example.org",
    whatsapp: "+1 787 555 0136",
  },
  {
    type: "OFFER",
    title: "Baby supplies: diapers, formula, wipes",
    description:
      "Our parent group collected surplus baby supplies: ~40 packs of diapers (sizes 1–4), 25 cans of formula (sealed, long expiry), wipes, and some baby clothes. Free for families in need; we can arrange delivery for nearby towns.",
    category: "NUTRITION",
    urgency: "NORMAL",
    quantity: "40 diaper packs, 25 formula cans",
    locationName: "Bayamón, Puerto Rico",
    lat: 18.3985,
    lng: -66.1557,
    contactName: "Ana Torres",
    orgName: "Madres Unidas Bayamón",
    whatsapp: "+1 787 555 0188",
  },
  {
    type: "NEED",
    title: "Roofing materials for 6 damaged homes",
    description:
      "Six homes in our street lost part of their roofs. We have volunteer labor but need corrugated metal sheets, treated lumber (2x4), and roofing screws. Any partial contribution helps — we'll coordinate the rest.",
    category: "SHELTER",
    urgency: "HIGH",
    quantity: "~90 metal sheets, 200 lumber pieces",
    locationName: "Utuado, Puerto Rico",
    lat: 18.2655,
    lng: -66.7005,
    contactName: "Ramón Vega",
    phone: "+1 787 555 0171",
  },
  {
    type: "OFFER",
    title: "Volunteer translators (Spanish/English/Haitian Creole)",
    description:
      "Our student group offers free translation and interpretation for aid organizations, medical visits, and paperwork — Spanish, English, and Haitian Creole. Remote or in person in the San Juan metro area.",
    category: "CONNECT",
    urgency: "NORMAL",
    quantity: "8 volunteers",
    locationName: "San Juan, Puerto Rico",
    lat: 18.4655,
    lng: -66.1057,
    contactName: "Valeria Pagán",
    orgName: "UPR Voluntarios",
    email: "upr.voluntarios@example.org",
  },
  {
    type: "NEED",
    title: "School supplies for 120 displaced students",
    description:
      "The temporary school site needs notebooks, pencils, backpacks, and basic art supplies for 120 students (ages 6–14) who lost their materials. Donations can be dropped at the municipal office weekdays 8am–4pm.",
    category: "EDUCATION",
    urgency: "NORMAL",
    quantity: "120 student kits",
    locationName: "Arecibo, Puerto Rico",
    lat: 18.4725,
    lng: -66.7157,
    contactName: "Prof. Ivelisse Marrero",
    orgName: "Escuela Comunitaria Arecibo",
    email: "escuela.arecibo@example.org",
    phone: "+1 787 555 0154",
  },
  {
    type: "OFFER",
    title: "Free dental clinic day — extractions and urgent care",
    description:
      "Our dental practice is running a free clinic day on the last Saturday of the month: urgent extractions, infection treatment, and basic checkups. First come, first served, 8am–3pm. Bring ID if you have one; nobody is turned away.",
    category: "DENTAL",
    urgency: "NORMAL",
    quantity: "~40 patients",
    locationName: "Mayagüez, Puerto Rico",
    lat: 18.2013,
    lng: -67.1397,
    contactName: "Dra. Nilsa Cordero",
    orgName: "Clínica Dental Cordero",
    phone: "+1 787 555 0118",
  },
  {
    type: "OFFER",
    title: "Warehouse space for relief supplies (300 m²)",
    description:
      "Dry, secure warehouse space available free of charge for storing relief supplies. Loading dock, forklift on site, 24/7 access for registered organizations. Available for at least 6 months.",
    category: "LOGISTICS",
    urgency: "NORMAL",
    quantity: "300 m²",
    locationName: "Carolina, Puerto Rico",
    lat: 18.3808,
    lng: -65.9574,
    contactName: "Miguel Ferrer",
    orgName: "Ferrer Distribución",
    email: "m.ferrer@example.org",
    phone: "+1 787 555 0102",
  },
  {
    type: "NEED",
    title: "Transportation to dialysis appointments (3x per week)",
    description:
      "My mother needs a ride to dialysis three times a week (Mon/Wed/Fri, 6am pickup, return around 11am). Our car was destroyed and public transport isn't running on our route yet. We can contribute to fuel.",
    category: "LOGISTICS",
    urgency: "HIGH",
    quantity: "3 round trips per week",
    locationName: "Humacao, Puerto Rico",
    lat: 18.1494,
    lng: -65.8272,
    contactName: "Teresa Nieves",
    phone: "+1 787 555 0147",
    whatsapp: "+1 787 555 0147",
  },
  {
    type: "OFFER",
    title: "Hot meals — 100 plates daily from community kitchen",
    description:
      "Our community kitchen cooks 100 hot meal plates daily, Monday to Saturday, ready at noon. Pickup at the kitchen, or we deliver to shelters within 15 km with a day's notice. This listing has been running for a month — come by!",
    category: "NUTRITION",
    urgency: "NORMAL",
    quantity: "100 plates/day",
    locationName: "Toa Baja, Puerto Rico",
    lat: 18.4439,
    lng: -66.2544,
    contactName: "Chef Roberto Igartúa",
    orgName: "Cocina Solidaria Toa Baja",
    whatsapp: "+1 787 555 0125",
    status: "ASSIGNED",
  },
  {
    type: "NEED",
    title: "Generator for community medical post",
    description:
      "Our volunteer-run medical post needs a generator (3kW or more) to keep vaccines refrigerated and lights on during evening hours. Loan or donation both welcome. This need was met — thank you!",
    category: "HEALTH",
    urgency: "NORMAL",
    quantity: "1 generator, 3kW+",
    locationName: "Adjuntas, Puerto Rico",
    lat: 18.1636,
    lng: -66.7232,
    contactName: "Dr. Pablo Reyes",
    orgName: "Puesto Médico Adjuntas",
    email: "puesto.adjuntas@example.org",
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
