import { Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import downloadsBreadcrumbImage from "@/assets/downloads-breadcrumb.png";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { downloads as fallbackDownloads } from "@/data/site";
import { getPublicDownloads, type PublicDownload } from "@/lib/cms";

const title = "Download Center — Brochure, Catalogue, Income Plan & Forms | RDG";
const description =
  "Download the RDG Future Way company brochure, product catalogue, generation income plan, price list, application form and training material.";

function Downloads() {
  const [items, setItems] = useState<PublicDownload[]>(
    fallbackDownloads.map((item, index) => ({
      id: `fallback-${index}`,
      slug: item.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      title: item.title,
      fileType: item.type,
      sizeLabel: item.size,
    })),
  );

  useEffect(() => {
    getPublicDownloads().then((data) => {
      if (data) setItems(data);
    });
  }, []);

  return (
    <>
      <section className="relative w-full overflow-hidden bg-white sm:h-[clamp(390px,29vw,560px)]">
        <img
          src={downloadsBreadcrumbImage}
          alt="RDG Future Way Download Center"
          width={2048}
          height={760}
          className="block h-auto w-full sm:absolute sm:inset-0 sm:h-full sm:object-cover sm:object-center"
        />
      </section>

      <section className="py-16">
        <div className="container-x">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <StaggerItem key={item.id}>
                <div className="card-lift flex h-full items-center gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <span className="bg-leaf flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-secondary-foreground">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.fileType || "FILE"} • {item.sizeLabel || "Available on request"}
                    </p>
                  </div>
                  {item.fileUrl ? (
                    <a
                      href={item.fileUrl}
                      download={item.fileName || undefined}
                      aria-label={`Download ${item.title}`}
                      className="bg-brand flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  ) : (
                    <span
                      aria-label={`${item.title} is not available yet`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
                    >
                      <Download className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

export default Downloads;
