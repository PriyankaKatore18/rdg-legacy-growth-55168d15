export type PublicCmsConfig = {
  settings: Record<string, string>;
  banners: {
    title: string;
    description?: string | null;
    ctaLabel?: string | null;
    ctaUrl?: string | null;
    imageUrl?: string | null;
    altText?: string | null;
  }[];
};

export async function getPublicCmsConfig(): Promise<PublicCmsConfig | null> {
  try {
    const response = await fetch("/api/public/site-config");
    if (!response.ok) return null;
    const payload = await response.json();
    return payload.success ? payload.data : null;
  } catch {
    return null;
  }
}
