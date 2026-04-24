import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center px-4 text-center">
      <p className="font-sans font-black text-[6rem] leading-none text-brand-amber opacity-20 select-none">
        404
      </p>
      <div className="-mt-4 mb-8">
        <p className="font-sans font-black text-[1.7rem] leading-none tracking-tight text-brand-amber">
          trust<sup className="text-[0.45em] align-super ml-px font-medium">®</sup>
        </p>
        <p className="font-sans text-[10px] text-white/50 leading-none mt-0.5">
          Electric Heating
        </p>
      </div>
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-brand-cream mb-4">
        Page Not Found
      </h1>
      <p className="font-sans text-base text-white/60 max-w-md leading-relaxed mb-8">
        We couldn&apos;t find the page you were looking for. It may have moved or
        been removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand-amber text-white font-sans font-medium px-6 py-3 rounded-lg hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
      >
        ← Back to homepage
      </Link>
    </div>
  );
}
