export function adminKeyOk(key: string | undefined | null) {
  const configured = process.env.ADMIN_KEY;
  return Boolean(configured && configured !== "change-me" && key === configured);
}
