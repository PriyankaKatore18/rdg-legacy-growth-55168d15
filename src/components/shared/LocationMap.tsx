import { company } from "@/data/site";

export function LocationMap({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-border shadow-soft ${className}`}>
      <iframe
        title="RDG Future Way location"
        src={company.mapEmbedUrl}
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        className="h-72 w-full"
      />
    </div>
  );
}
