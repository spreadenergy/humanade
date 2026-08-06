/**
 * One-time data fix, safe to re-run: the state formerly called Vargas is
 * known to everyone as La Guaira — the listings should say what locals
 * say. Runs during the Vercel build (after `prisma db push`).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.listing.findMany({
    where: { locationName: { contains: "Vargas" } },
  });
  let changed = 0;
  for (const r of rows) {
    const locationName =
      r.locationName.trim() === "La Guaira, Vargas"
        ? "La Guaira"
        : r.locationName.replace(/,\s*Vargas\b/g, ", La Guaira");
    const title = r.title.replace("Caracas–Vargas", "Caracas–La Guaira");
    const orgName =
      r.orgName?.replace("Rescate Animal Vargas", "Rescate Animal La Guaira") ??
      null;
    if (
      locationName !== r.locationName ||
      title !== r.title ||
      orgName !== r.orgName
    ) {
      await prisma.listing.update({
        where: { id: r.id },
        data: { locationName, title, orgName },
      });
      changed++;
    }
  }
  console.log(`la-guaira rename: ${changed}/${rows.length} rows updated`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
