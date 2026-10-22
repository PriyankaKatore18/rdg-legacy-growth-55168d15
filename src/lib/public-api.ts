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

const web3FormsAccessKey = "93c04efd-777c-4f9d-a69a-aadd91741878";

async function submitToWeb3Forms(payload: PublicEnquiry) {
  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: web3FormsAccessKey,
      subject: `RDG ${payload.type} enquiry from ${payload.name}`,
      from_name: "RDG Future Way Website",
      name: payload.name,
      email: payload.email || "",
      phone: payload.phone || "",
      city: payload.city || "",
      business_type: payload.businessType || "",
      investment_range: payload.investmentRange || "",
      message: payload.message || `New ${payload.type} enquiry from ${payload.name}.`,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Web3Forms could not receive the enquiry.");
  }
}

export async function submitPublicEnquiry(payload: PublicEnquiry) {
  const response = await fetch("/api/public/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false)
    throw new Error(data.error || "Unable to submit your enquiry.");

  // Keep the enquiry in the RDG admin panel even if the email provider is temporarily unavailable.
  try {
    await submitToWeb3Forms(payload);
  } catch (error) {
    console.warn("Web3Forms submission failed after the enquiry was saved locally.", error);
  }

  return data.data;
}
