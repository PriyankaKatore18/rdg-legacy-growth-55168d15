export type PublicEnquiry = {
  type: "contact" | "distributor" | "franchise" | "other";
  name: string;
  email?: string;
  phone?: string;
  city?: string;
  businessType?: string;
  investmentRange?: string;
  message?: string;
};

export async function submitPublicEnquiry(payload: PublicEnquiry) {
  const response = await fetch("/api/public/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false)
    throw new Error(data.error || "Unable to submit your enquiry.");
  return data.data;
}
