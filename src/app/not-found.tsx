import Link from "next/link";
import { getI18n } from "@/lib/i18n";

export default async function NotFound() {
  const { d } = await getI18n();
  return (
    <div className="mx-auto max-w-md pt-16 text-center">
      <h1 className="text-3xl font-extrabold text-navy">{d.notFound.title}</h1>
      <p className="mt-3 text-slate-600">{d.notFound.body}</p>
      <Link href="/" className="btn btn-navy mt-6">
        {d.notFound.home}
      </Link>
    </div>
  );
}
