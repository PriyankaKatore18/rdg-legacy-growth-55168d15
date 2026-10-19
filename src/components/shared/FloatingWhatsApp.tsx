import { company } from "@/data/site";

const whatsappNumber = company.phone.replace(/\D/g, "");
const whatsappMessage = encodeURIComponent("Hello RDG Future Way, I need more information.");

export function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with RDG Future Way on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed right-4 bottom-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_rgba(37,211,102,0.4)] transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-[#25D366]/40 focus-visible:outline-none sm:right-6 sm:bottom-6"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982 1-3.648-.235-.374a9.86 9.86 0 0 1-1.511-5.26c.001-5.45 4.437-9.884 9.893-9.884 2.64 0 5.122 1.03 6.986 2.896a9.825 9.825 0 0 1 2.893 6.994c-.002 5.45-4.437 9.884-9.889 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.89c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.89a11.821 11.821 0 0 0-3.478-8.416" />
      </svg>
    </a>
  );
}
