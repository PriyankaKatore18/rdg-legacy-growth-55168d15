import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "mr" | "hi";

export const languageOptions: { code: Language; label: string; nativeLabel: string }[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
];

type TranslationTable = Record<string, string>;

const mr: TranslationTable = {
  Home: "मुखपृष्ठ",
  Company: "कंपनी",
  "About Us": "आमच्याबद्दल",
  "Success Stories": "यशोगाथा",
  Events: "कार्यक्रम",
  Gallery: "गॅलरी",
  Career: "करिअर",
  "Anmol Ratan": "अनमोल रतन",
  "Anmol Ratan Juice": "अनमोल रतन ज्यूस",
  "Product Details": "उत्पादन माहिती",
  Opportunity: "संधी",
  "Business Opportunity": "व्यवसायाची संधी",
  "Generation Plan": "जनरेशन प्लॅन",
  "Income Calculator": "उत्पन्न कॅल्क्युलेटर",
  "Become a Distributor": "डिस्ट्रिब्युटर बना",
  "Franchise Opportunity": "फ्रँचायझीची संधी",
  Resources: "संसाधने",
  Downloads: "डाउनलोड्स",
  Blog: "ब्लॉग",
  FAQs: "सामान्य प्रश्न",
  Contact: "संपर्क",
  "Quick Links": "जलद दुवे",
  Policies: "धोरणे",
  Newsletter: "वृत्तपत्र",
  "Your email": "तुमचा ईमेल",
  Subscribe: "सबस्क्राइब करा",
  Search: "शोधा",
  "Search articles": "लेख शोधा",
  "Switch language": "भाषा बदला",
  Language: "भाषा",
  "Toggle menu": "मेनू उघडा किंवा बंद करा",
  "Become Distributor": "डिस्ट्रिब्युटर बना",
  "Contact the RDG team": "RDG टीमशी संपर्क करा",
  "Discover the Goodness": "चांगुलपणा अनुभवाः",
  "Understand the plan": "प्लॅन समजून घ्या",
  "View reward milestones": "रिवॉर्ड टप्पे पहा",
  "Send franchise enquiry": "फ्रँचायझी चौकशी पाठवा",
  "Send an enquiry": "चौकशी पाठवा",
  "About Us": "आमच्याबद्दल",
  "Our Signature Product": "आमचे प्रमुख उत्पादन",
  "One carefully presented wellness drink": "काळजीपूर्वक सादर केलेले वेलनेस ड्रिंक",
  "Why Choose RDG": "RDG का निवडावे",
  "Built on quality, priced for families, designed for growth":
    "गुणवत्तेवर आधारित, कुटुंबांसाठी योग्य किंमत आणि प्रगतीसाठी तयार",
  "Generation Plan": "जनरेशन प्लॅन",
  "Six income streams from a single business": "एका व्यवसायातून उत्पन्नाचे सहा मार्ग",
  "Real families. Real results.": "खरे कुटुंब. खरे परिणाम.",
  "Upcoming seminars & launches": "आगामी सेमिनार आणि लॉन्च",
  "Training Academy": "प्रशिक्षण अकादमी",
  "Learn the business, module by module": "व्यवसाय टप्प्याटप्प्याने शिका",
  "Rewards & Recognition": "रिवॉर्ड्स आणि गौरव",
  "A luxury reward ladder that keeps climbing": "सतत उंचावणारी आकर्षक रिवॉर्ड शिडी",
  "From the Blog": "ब्लॉगमधून",
  "Health, business and lifestyle insights": "आरोग्य, व्यवसाय आणि जीवनशैलीविषयक माहिती",
  "Natural Goodness": "नैसर्गिक चांगुलपणा",
  "Herbal Care": "हर्बल काळजी",
  "Better Tomorrow": "उज्ज्वल उद्या",
  "Pure Herbal Nutrition for a Healthier": "आरोग्यदायी उद्यासाठी शुद्ध हर्बल पोषण",
  Tomorrow: "उद्या",
  Natural: "नैसर्गिक",
  Preservatives: "प्रिझर्व्हेटिव्ह्ज",
  Immunity: "प्रतिकारशक्ती",
  Support: "सहाय्य",
  "Rich in": "समृद्ध",
  Antioxidants: "अँटिऑक्सिडंट्स",
  "View product details": "उत्पादनाची माहिती पहा",
  "All events": "सर्व कार्यक्रम",
  "View full plan": "संपूर्ण प्लॅन पहा",
  "Open income calculator": "उत्पन्न कॅल्क्युलेटर उघडा",
  "Read the blog": "ब्लॉग वाचा",
  "Talk to our team": "आमच्या टीमशी बोला",
  "Pure Herbal Nutrition for a Healthier": "स्वस्थ उद्यासाठी शुद्ध हर्बल पोषण",
  Tomorrow: "कल",
  Natural: "प्राकृतिक",
  Preservatives: "प्रिज़र्वेटिव्स",
  Immunity: "रोग प्रतिरोधक क्षमता",
  Support: "सहायता",
  "Rich in": "भरपूर",
  Antioxidants: "एंटीऑक्सीडेंट्स",
  "View product details": "उत्पाद विवरण देखें",
  "All events": "सभी कार्यक्रम",
  "View full plan": "पूरा प्लान देखें",
  "Open income calculator": "आय कैलकुलेटर खोलें",
  "Read the blog": "ब्लॉग पढ़ें",
  "Talk to our team": "हमारी टीम से बात करें",
  "About Us": "आमच्याबद्दल",
  "By the numbers": "आकडेवारीतून",
  "Growth measured in families served": "सेवा दिलेल्या कुटुंबांतून मोजलेली वाढ",
  Milestones: "महत्त्वाचे टप्पे",
  "The road so far": "आतापर्यंतचा प्रवास",
  "Company profile & leadership": "कंपनी प्रोफाइल आणि नेतृत्व",
  "Trust is built with transparency": "पारदर्शकतेतून विश्वास निर्माण होतो",
  "Business Opportunity": "व्यवसायाची संधी",
  "A business you can start this week, from home": "घरातून या आठवड्यात सुरू करता येणारा व्यवसाय",
  "How it works": "हे कसे काम करते",
  "From your first order to leadership income": "पहिल्या ऑर्डरपासून नेतृत्व उत्पन्नापर्यंत",
  "Why join RDG": "RDG मध्ये का सामील व्हावे",
  "Six reasons distributors stay for years":
    "डिस्ट्रिब्युटर वर्षानुवर्षे टिकून राहण्याची सहा कारणे",
  "Free registration. Lifetime opportunity.": "मोफत नोंदणी. आयुष्यभराची संधी.",
  "Download Center": "डाउनलोड केंद्र",
  "Every document you need, in one place": "आवश्यक प्रत्येक दस्तऐवज एका ठिकाणी",
  "Where the business comes alive": "व्यवसायाला चालना देणारे क्षण",
  "Straight answers, no fine print": "सरळ उत्तरे, कोणतीही लपलेली अट नाही",
  "Media Gallery": "मीडिया गॅलरी",
  "Moments from the RDG movement": "RDG चळवळीतील क्षण",
  "Business Plans": "व्यवसाय प्लॅन्स",
  "A clear view of the 15-level income and reward structure":
    "१५ स्तरांच्या उत्पन्न आणि रिवॉर्ड रचनेचा स्पष्ट आढावा",
  "ID package income plan": "ID पॅकेज उत्पन्न प्लॅन",
  "15 levels, shown with the 100-ID formula": "१००-ID सूत्रासह दाखवलेले १५ स्तर",
  "Single-leg referral plan": "सिंगल-लेग रेफरल प्लॅन",
  "Reference referral income by package": "पॅकेजनुसार रेफरल उत्पन्न",
  "Award & reward plan": "अवार्ड आणि रिवॉर्ड प्लॅन",
  "From welcome kit to leadership recognition": "वेलकम किटपासून नेतृत्व गौरवापर्यंत",
  "Plan Calculator": "प्लॅन कॅल्क्युलेटर",
  "Calculate plan value, referral references and reward progress":
    "प्लॅन मूल्य, रेफरल रक्कम आणि रिवॉर्ड प्रगती मोजा",
  "Our Signature Product": "आमचे प्रमुख उत्पादन",
  "What makes Anmol Ratan Juice special": "अनमोल रतन ज्यूस विशेष का आहे",
  "Product information": "उत्पादन माहिती",
  "Everything you need before you order": "ऑर्डर करण्यापूर्वी आवश्यक सर्व माहिती",
  "How to enjoy it": "याचा आनंद कसा घ्यावा",
  Legal: "कायदेशीर",
  "Privacy Policy": "गोपनीयता धोरण",
  "Refund Policy": "परतावा धोरण",
  "Shipping Policy": "शिपिंग धोरण",
  "Terms & Conditions": "अटी आणि शर्ती",
  "Quality Assurance": "गुणवत्ता हमी",
  "Affordable Pricing": "परवडणारी किंमत",
  "Direct Company Products": "कंपनीची थेट उत्पादने",
  "Income Opportunity": "उत्पन्नाची संधी",
  "Training Support": "प्रशिक्षण सहाय्य",
  "Fast Delivery": "जलद वितरण",
  "Customer Satisfaction": "ग्राहक समाधान",
  "Trusted Brand": "विश्वसनीय ब्रँड",
  Join: "सामील व्हा",
  "Buy Products": "उत्पादने खरेदी करा",
  "Refer Members": "सदस्यांना रेफर करा",
  "Build Team": "टीम तयार करा",
  "Earn Income": "उत्पन्न मिळवा",
  "Leadership Rewards": "नेतृत्व रिवॉर्ड्स",
  Level: "स्तर",
  Package: "पॅकेज",
  Formula: "सूत्र",
  Reward: "रिवॉर्ड",
  "Milestone reward": "टप्प्यावरील रिवॉर्ड",
  "No articles found.": "लेख सापडले नाहीत.",
  "Page not found": "पृष्ठ सापडले नाही",
  "Go home": "मुखपृष्ठावर जा",
  "This page didn't load": "हे पृष्ठ लोड झाले नाही",
  "Try again": "पुन्हा प्रयत्न करा",
  "Full name": "पूर्ण नाव",
  Email: "ईमेल",
  "Mobile number": "मोबाइल नंबर",
  Message: "संदेश",
  "Your name": "तुमचे नाव",
  City: "शहर",
  "Business background": "व्यवसायाची पार्श्वभूमी",
  "Investment range": "गुंतवणूक श्रेणी",
  "First business": "पहिला व्यवसाय",
  "To be discussed": "चर्चा करायची आहे",
  Optional: "पर्यायी",
};

const hi: TranslationTable = {
  Home: "होम",
  Company: "कंपनी",
  "About Us": "हमारे बारे में",
  "Success Stories": "सफलता की कहानियां",
  Events: "कार्यक्रम",
  Gallery: "गैलरी",
  Career: "करियर",
  "Anmol Ratan": "अनमोल रतन",
  "Anmol Ratan Juice": "अनमोल रतन जूस",
  "Product Details": "उत्पाद विवरण",
  Opportunity: "अवसर",
  "Business Opportunity": "व्यवसाय का अवसर",
  "Generation Plan": "जनरेशन प्लान",
  "Income Calculator": "आय कैलकुलेटर",
  "Become a Distributor": "डिस्ट्रिब्यूटर बनें",
  "Franchise Opportunity": "फ्रेंचाइज़ी अवसर",
  Resources: "संसाधन",
  Downloads: "डाउनलोड्स",
  Blog: "ब्लॉग",
  FAQs: "सामान्य प्रश्न",
  Contact: "संपर्क",
  "Quick Links": "त्वरित लिंक",
  Policies: "नीतियां",
  Newsletter: "न्यूज़लेटर",
  "Your email": "आपका ईमेल",
  Subscribe: "सब्सक्राइब करें",
  Search: "खोजें",
  "Search articles": "लेख खोजें",
  "Switch language": "भाषा बदलें",
  Language: "भाषा",
  "Toggle menu": "मेनू खोलें या बंद करें",
  "Become Distributor": "डिस्ट्रिब्यूटर बनें",
  "Contact the RDG team": "RDG टीम से संपर्क करें",
  "Discover the Goodness": "अच्छाई खोजें",
  "Understand the plan": "प्लान समझें",
  "View reward milestones": "रिवॉर्ड चरण देखें",
  "Send franchise enquiry": "फ्रेंचाइज़ी पूछताछ भेजें",
  "Send an enquiry": "पूछताछ भेजें",
  "Our Signature Product": "हमारा प्रमुख उत्पाद",
  "One carefully presented wellness drink": "सावधानी से प्रस्तुत वेलनेस ड्रिंक",
  "Why Choose RDG": "RDG क्यों चुनें",
  "Built on quality, priced for families, designed for growth":
    "गुणवत्ता पर आधारित, परिवारों के लिए उचित कीमत और विकास के लिए तैयार",
  "Six income streams from a single business": "एक व्यवसाय से आय के छह रास्ते",
  "Real families. Real results.": "सच्चे परिवार। सच्चे परिणाम।",
  "Upcoming seminars & launches": "आगामी सेमिनार और लॉन्च",
  "Training Academy": "प्रशिक्षण अकादमी",
  "Learn the business, module by module": "व्यवसाय को मॉड्यूल दर मॉड्यूल सीखें",
  "Rewards & Recognition": "रिवॉर्ड्स और सम्मान",
  "A luxury reward ladder that keeps climbing": "लगातार आगे बढ़ती शानदार रिवॉर्ड सीढ़ी",
  "From the Blog": "ब्लॉग से",
  "Health, business and lifestyle insights": "स्वास्थ्य, व्यवसाय और जीवनशैली की जानकारी",
  "Natural Goodness": "प्राकृतिक अच्छाई",
  "Herbal Care": "हर्बल देखभाल",
  "Better Tomorrow": "बेहतर कल",
  "By the numbers": "आंकड़ों में",
  "Growth measured in families served": "सेवा प्राप्त परिवारों से मापी गई वृद्धि",
  Milestones: "महत्वपूर्ण पड़ाव",
  "The road so far": "अब तक का सफर",
  "Company profile & leadership": "कंपनी प्रोफाइल और नेतृत्व",
  "Trust is built with transparency": "पारदर्शिता से विश्वास बनता है",
  "A business you can start this week, from home": "घर से इस सप्ताह शुरू किया जा सकने वाला व्यवसाय",
  "How it works": "यह कैसे काम करता है",
  "From your first order to leadership income": "पहले ऑर्डर से नेतृत्व आय तक",
  "Why join RDG": "RDG से क्यों जुड़ें",
  "Six reasons distributors stay for years": "डिस्ट्रिब्यूटर वर्षों तक जुड़े रहने के छह कारण",
  "Free registration. Lifetime opportunity.": "मुफ्त पंजीकरण। जीवनभर का अवसर।",
  "Download Center": "डाउनलोड केंद्र",
  "Every document you need, in one place": "आपको चाहिए हर दस्तावेज़ एक ही जगह",
  "Where the business comes alive": "जहां व्यवसाय जीवंत होता है",
  "Straight answers, no fine print": "सीधे जवाब, कोई छिपी शर्त नहीं",
  "Media Gallery": "मीडिया गैलरी",
  "Moments from the RDG movement": "RDG आंदोलन के यादगार पल",
  "Business Plans": "बिजनेस प्लान",
  "A clear view of the 15-level income and reward structure":
    "15 स्तरों वाली आय और रिवॉर्ड संरचना का स्पष्ट विवरण",
  "ID package income plan": "ID पैकेज आय प्लान",
  "15 levels, shown with the 100-ID formula": "100-ID फॉर्मूला के साथ दिखाए गए 15 स्तर",
  "Single-leg referral plan": "सिंगल-लेग रेफरल प्लान",
  "Reference referral income by package": "पैकेज के अनुसार रेफरल आय",
  "Award & reward plan": "अवार्ड और रिवॉर्ड प्लान",
  "From welcome kit to leadership recognition": "वेलकम किट से नेतृत्व सम्मान तक",
  "Plan Calculator": "प्लान कैलकुलेटर",
  "Calculate plan value, referral references and reward progress":
    "प्लान मूल्य, रेफरल राशि और रिवॉर्ड प्रगति की गणना करें",
  "Our Signature Product": "हमारा प्रमुख उत्पाद",
  "What makes Anmol Ratan Juice special": "अनमोल रतन जूस को खास क्या बनाता है",
  "Product information": "उत्पाद जानकारी",
  "Everything you need before you order": "ऑर्डर से पहले आवश्यक पूरी जानकारी",
  "How to enjoy it": "इसे कैसे लें",
  Legal: "कानूनी",
  "Privacy Policy": "गोपनीयता नीति",
  "Refund Policy": "रिफंड नीति",
  "Shipping Policy": "शिपिंग नीति",
  "Terms & Conditions": "नियम और शर्तें",
  "Quality Assurance": "गुणवत्ता आश्वासन",
  "Affordable Pricing": "किफायती कीमत",
  "Direct Company Products": "कंपनी के सीधे उत्पाद",
  "Income Opportunity": "आय का अवसर",
  "Training Support": "प्रशिक्षण सहायता",
  "Fast Delivery": "तेज़ डिलीवरी",
  "Customer Satisfaction": "ग्राहक संतुष्टि",
  "Trusted Brand": "विश्वसनीय ब्रांड",
  Join: "जुड़ें",
  "Buy Products": "उत्पाद खरीदें",
  "Refer Members": "सदस्यों को रेफर करें",
  "Build Team": "टीम बनाएं",
  "Earn Income": "आय कमाएं",
  "Leadership Rewards": "नेतृत्व रिवॉर्ड्स",
  Level: "स्तर",
  Package: "पैकेज",
  Formula: "फॉर्मूला",
  Reward: "रिवॉर्ड",
  "Milestone reward": "पड़ाव रिवॉर्ड",
  "No articles found.": "कोई लेख नहीं मिला।",
  "Page not found": "पेज नहीं मिला",
  "Go home": "होम पर जाएं",
  "This page didn't load": "यह पेज लोड नहीं हुआ",
  "Try again": "फिर कोशिश करें",
  "Full name": "पूरा नाम",
  Email: "ईमेल",
  "Mobile number": "मोबाइल नंबर",
  Message: "संदेश",
  "Your name": "आपका नाम",
  City: "शहर",
  "Business background": "व्यवसाय की पृष्ठभूमि",
  "Investment range": "निवेश सीमा",
  "First business": "पहला व्यवसाय",
  "To be discussed": "चर्चा की जाएगी",
  Optional: "वैकल्पिक",
};

const marathiHome: TranslationTable = {
  "Pure Herbal Nutrition for a Healthier": "आरोग्यदायी उद्यासाठी शुद्ध हर्बल पोषण",
  Tomorrow: "उद्या",
  Natural: "नैसर्गिक",
  Preservatives: "प्रिझर्व्हेटिव्ह्ज",
  Immunity: "प्रतिकारशक्ती",
  Support: "सहाय्य",
  "Rich in": "समृद्ध",
  Antioxidants: "अँटिऑक्सिडंट्स",
  "View product details": "उत्पादनाची माहिती पहा",
  "All events": "सर्व कार्यक्रम",
  "View full plan": "संपूर्ण प्लॅन पहा",
  "Open income calculator": "उत्पन्न कॅल्क्युलेटर उघडा",
  "Read the blog": "ब्लॉग वाचा",
  "Talk to our team": "आमच्या टीमशी बोला",
};

const hindiHome: TranslationTable = {
  "Pure Herbal Nutrition for a Healthier": "स्वस्थ कल के लिए शुद्ध हर्बल पोषण",
  Tomorrow: "कल",
  Natural: "प्राकृतिक",
  Preservatives: "प्रिज़र्वेटिव्स",
  Immunity: "रोग प्रतिरोधक क्षमता",
  Support: "सहायता",
  "Rich in": "भरपूर",
  Antioxidants: "एंटीऑक्सीडेंट्स",
  "View product details": "उत्पाद विवरण देखें",
  "All events": "सभी कार्यक्रम",
  "View full plan": "पूरा प्लान देखें",
  "Open income calculator": "आय कैलकुलेटर खोलें",
  "Read the blog": "ब्लॉग पढ़ें",
  "Talk to our team": "हमारी टीम से बात करें",
};

const tables: Record<Exclude<Language, "en">, TranslationTable> = {
  mr: { ...mr, ...marathiHome },
  hi: { ...hi, ...hindiHome },
};
const originalTextNodes = new WeakMap<Text, string>();
const originalElements = new WeakMap<Element, Record<string, string>>();

function hasNoTranslateAncestor(node: Node): boolean {
  let element = node.parentElement;
  while (element) {
    if (
      element.hasAttribute("data-no-translate") ||
      ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(element.tagName)
    ) {
      return true;
    }
    element = element.parentElement;
  }
  return false;
}

function preserveWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated.trim()}${trailing}`;
}

export function translateText(original: string, language: Language) {
  if (language === "en" || !original.trim()) return original;
  const table = tables[language];
  const exact = table[original.trim()];
  if (exact) return preserveWhitespace(original, exact);

  let translated = original;
  const phrases = Object.keys(table).sort((a, b) => b.length - a.length);
  for (const phrase of phrases) {
    if (phrase.length < 3 || !translated.includes(phrase)) continue;
    translated = translated.split(phrase).join(table[phrase]);
  }
  return translated;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = window.localStorage.getItem("rdg-language");
    return saved === "mr" || saved === "hi" ? saved : "en";
  });

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem("rdg-language", next);
    document.documentElement.lang = next === "mr" ? "mr-IN" : next === "hi" ? "hi-IN" : "en-IN";
  };

  useEffect(() => {
    document.documentElement.lang =
      language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN";

    let translating = false;

    const translateNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (hasNoTranslateAncestor(node)) return;
        const text = node as Text;
        if (!originalTextNodes.has(text)) originalTextNodes.set(text, text.data);
        const source = originalTextNodes.get(text) ?? text.data;
        const next = translateText(source, language);
        if (text.data !== next) text.data = next;
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const element = node as Element;
      if (element.hasAttribute("data-no-translate")) return;
      const attributes = ["placeholder", "aria-label", "title"];
      const saved = originalElements.get(element) ?? {};
      for (const attribute of attributes) {
        const value = element.getAttribute(attribute);
        if (value && !saved[attribute]) saved[attribute] = value;
        const source = saved[attribute];
        if (source) element.setAttribute(attribute, translateText(source, language));
      }
      originalElements.set(element, saved);
      for (const child of Array.from(element.childNodes)) translateNode(child);
    };

    const run = () => {
      if (translating) return;
      translating = true;
      translateNode(document.body);
      translating = false;
    };

    run();
    const observer = new MutationObserver(() => run());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({ language: "en", setLanguage: () => undefined });

export function useLanguage() {
  return useContext(LanguageContext);
}
