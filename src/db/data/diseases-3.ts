import type { DiseasePayload } from "@/lib/types";

export const diseases3: DiseasePayload[] = [
  {
    slug: "hepatitis-c",
    name: "Hepatitis C (Chronic)",
    shortName: "Hep C",
    tagline: "The world's largest reservoir — a silent epidemic in the liver",
    category: "Infectious — Viral",
    taxonomy: "Blood-borne viral hepatitis · Flaviviridae, Hepacivirus C (ssRNA); GT-3a dominates Pakistan (~75%)",
    icd: "B18.2 (chronic) · B17.1 (acute)",
    icd11: "1E50.1",
    acronyms: ["HCV", "DAA", "SVR12", "APRI", "GT3a"],
    synonyms: ["Viral hepatitis C", "Non-A non-B hepatitis (historic)", "Kala yarqan ka khatra (colloq.)"],
    cause:
      "Hepatitis C virus, an enveloped positive-sense RNA virus with extreme genetic diversity (7 genotypes). Pakistan carries genotype 3a in three-quarters of infections — highly curable with modern direct-acting antivirals but associated with steatosis and faster fibrosis.",
    transmission: [
      "Unsafe therapeutic injections and infusions with reused syringes — the dominant driver in Pakistan",
      "Unscreened blood transfusion (formal screening since ~2010, gaps persist)",
      "Barbershop straight-razor shaves, shared dental/surgical instruments without sterilisation",
      "Haemodialysis, tattooing, needle-stick injuries; rare sexual/vertical transmission",
    ],
    riskFactors: [
      "Multiple therapeutic injections per year (national average among the world's highest)",
      "Rural residence with informal 'injectionist' practice",
      "Age >40 — infections accumulated before single-use norms",
      "Thalassaemia/CKD patients on repeated transfusions or dialysis",
      "HBV/HIV co-infection accelerates fibrosis",
    ],
    mechanism: [
      "HCV enters hepatocytes via CD81/SR-B1 receptors and replicates in membranous webs without integrating into host DNA",
      "Innate evasion (NS3/4A cleaves MAVS) aborts interferon signalling → 55–85% progress to chronicity",
      "Decades of lobular inflammation activate hepatic stellate cells → collagen deposition → bridging fibrosis (F0→F4)",
      "Cirrhosis raises portal pressure (varices, ascites) and drives hepatocarcinogenesis at 1–4%/yr; immune complexes cause cryoglobulinaemic vasculitis and membranoproliferative GN",
    ],
    organs: ["Liver (hepatocytes)", "Kidneys (MPGN)", "Blood vessels (cryoglobulins)", "Pancreas / metabolic axis", "Bone marrow (B-cells → lymphoma link)"],
    biomarkers: [
      "Anti-HCV antibody — screening (remains positive after cure)",
      "HCV RNA quantitative PCR — confirms viremia and cure (SVR12)",
      "ALT/AST — fluctuating, often near-normal despite damage",
      "APRI / FIB-4 scores and elastography kPa — fibrosis staging without biopsy",
      "Rising AFP or platelet fall — cirrhosis/HCC surveillance flags",
    ],
    incubation: "2 weeks–6 months to acute phase (usually silent); chronicity declared when viremia persists >6 months; cirrhosis typically after 20–30 years.",
    signs: [
      "Usually none until advanced — the 'silent' hallmark",
      "Icterus, palmar erythema, spider naevi in cirrhosis",
      "Hepatosplenomegaly, shifting dullness (ascites)",
      "Asterixis and confusion in decompensated encephalopathy",
    ],
    symptoms: [
      "Chronic fatigue and poor concentration ('brain fog')",
      "Right-upper-quadrant heaviness, nausea, anorexia",
      "Dark urine, pale stools in icteric flares",
      "Pruritus; joint aches with cryoglobulinaemia",
    ],
    stages: [
      { name: "Acute HCV", window: "0–6 months", desc: "Mostly asymptomatic; 15–45% clear spontaneously, often in symptomatic patients." },
      { name: "Chronic hepatitis", window: "Years 1–20", desc: "Persistently detectable RNA with fluctuating ALT; fibrosis F0–F2 — curable window." },
      { name: "Compensated cirrhosis", window: "~Year 20–30 (20–30% of cases)", desc: "F4 fibrosis; synthetic function preserved; annual HCC surveillance begins." },
      { name: "Decompensated cirrhosis / HCC", window: "Variable", desc: "Ascites, variceal bleeding, encephalopathy; transplant or palliation; DAAs still eradicate virus." },
    ],
    prevalence:
      "Pakistan hosts the world's largest HCV population: an estimated 7–9 million viremic people (±6% of adults) with ~24,000–29,000 HCV-related deaths yearly. Screening surveys show village clusters exceeding 20% seroprevalence in interior Sindh.",
    incidence:
      "An estimated 140,000–210,000 new viremic infections still occur annually in Pakistan despite elimination programme scale-up (shown above as new cases/yr).",
    global:
      "~50M people live with chronic HCV globally and 242k die/yr (WHO 2024); Pakistan contributes ~1 in 6 of the world's infections — the single largest national share.",
    demographics: [
      "Prevalence rises steeply with age — highest in 40–65 cohort",
      "Rural Punjab (Okara, Pakpattan, Rajanpur) and interior Sindh (Larkana, Sukkur) hotspots",
      "Marginal female predominance in some surveys (injection history)",
      "High-risk: dialysis, thalassaemia and PWID populations",
    ],
    geography:
      "Nationwide with intense clustering: rural Punjab districts and interior Sindh report the highest seroprevalence in national surveys; metropolitan Karachi/Lahore large absolute numbers. Several 'mega-hotspot' districts drive elimination-campaign targeting.",
    criteria:
      "Reactive anti-HCV confirmed by detectable HCV RNA = current infection. Treatment candidacy assessed with viral load, genotype (optional with pangenotypic DAA), CBC/INR/creatinine, fibrosis score (APRI/FIB-4 or elastography). SVR12 = undetectable RNA 12 weeks post-therapy = cure.",
    imaging: [
      "Abdominal ultrasound ± Doppler — surface nodularity, portal vein, spleen",
      "Transient elastography (FibroScan) — kPa fibrosis/steatosis staging",
      "Triple-phase CT / MRI liver for focal lesions (HCC protocol)",
    ],
    differential: ["Hepatitis B & D co-endemic", "Metabolic (MASLD) liver disease", "Autoimmune hepatitis", "Drug-induced liver injury", "Wilson disease (young)"],
    treatment: [
      "Pangenotypic DAA: sofosbuvir/velpatasvir 400/100 mg OD ×12 weeks — >95% cure, pangenotypic",
      "Alternative: sofosbuvir + daclatasvir ×12 weeks (national programme backbone)",
      "Cirrhosis needs regime adjustment ± ribavirin; severe decompensation → transplant referral",
      "Post-SVR cirrhotics continue 6-monthly HCC ultrasound ± AFP for life",
    ],
    prevention: [
      "No vaccine exists — prevention is systems-level",
      "Auto-disable single-use syringes; regulate informal injection practice",
      "Mandatory blood screening (NAT/ELISA) before any transfusion",
      "Autoclave-verified dental/surgical instruments; safe-barber campaigns",
      "PM's National Hepatitis Elimination Programme — mass micro-elimination screening-and-treat drives",
    ],
    prognosis:
      "SVR12 cure exceeds 95% with DAAs and normalises life expectancy in non-cirrhotics. Untreated, 15–30% develop cirrhosis within two decades; cirrhotics face 1–4%/yr HCC risk even after cure — surveillance is permanent.",
    medicines: [
      { name: "Sofosbuvir/Velpatasvir 400/100 (12-week course)", brand: "Velpanat / imported Epclusa", form: "84 tabs course", price: 24000, note: "Pangenotypic first-line; imported brands cost far more" },
      { name: "Sofosbuvir + Daclatasvir (12-week course)", brand: "Sovaldi + Diklavir", form: "Combo course", price: 13500, note: "National programme backbone" },
      { name: "Peg-interferon α-2a (legacy, weekly ×24–48)", brand: "Pegasys", form: "SC pen, per dose", price: 6500, note: "Largely obsolete — replaced by DAAs" },
      { name: "Ribavirin 400 mg ×60", brand: "Rebetol", form: "Oral bottle", price: 1450, note: "Adjunct in decompensated cirrhosis" },
      { name: "Ursodeoxycholic acid 250 mg ×30", brand: "Ursofalk", form: "Oral strip", price: 1150, note: "Cholestatic support" },
      { name: "Vitamin D3 200 000 IU ampoule", brand: "Indrop-D", form: "IM/Oral ampoule", price: 330, note: "Common deficiency correction pre-therapy" },
    ],
    tests: [
      { name: "HCV Genotyping (GT 1–6)", purpose: "Optional with pangenotypic DAAs; maps 3a dominance", price: 12500, turnaround: "5–7 days" },
      { name: "HCV RNA quantitative PCR", purpose: "Confirms viremia; baseline & SVR12 cure check", price: 9800, turnaround: "48 hrs" },
      { name: "Transient elastography (FibroScan)", purpose: "Non-invasive fibrosis/steatosis staging", price: 6000, turnaround: "Same day" },
      { name: "Triple-phase CT liver", purpose: "HCC work-up in cirrhotics", price: 14500, turnaround: "24 hrs" },
      { name: "Liver profile (LFTs + INR + albumin)", purpose: "Synthetic function & prognosis", price: 1450, turnaround: "Same day" },
      { name: "Anti-HCV screening (ELISA/ICT)", purpose: "First-line antibody screen", price: 950, turnaround: "3 hrs" },
    ],
    peakYearNote:
      "Prevalence has plateaued near 7–9M viremic cases since the 2016 DAA era; incident infections are slowly declining (~208k → ~143k/yr, 2015–24) as elimination screening scales up.",
    source: "National Hepatitis Survey · PM Hepatitis Elimination Programme · WHO/WHO-AFRO regional office",
    icon: "activity",
    hue: "#22d3ee",
    severity: 8,
  },
  {
    slug: "poliomyelitis",
    name: "Poliomyelitis (WPV1)",
    shortName: "Polio",
    tagline: "One of Earth's final two endemic frontiers",
    category: "Infectious — Viral",
    taxonomy: "Enteroviral neuroinfection · Picornaviridae, Enterovirus C — serotypes 1–3 (wild type-1 remains endemic; types 2 & 3 eradicated)",
    icd: "A80 (acute) · B91 (sequelae)",
    icd11: null,
    acronyms: ["WPV1", "AFP", "OPV", "IPV", "NIDs", "EPI"],
    synonyms: ["Infantile paralysis", "Polio", "Post-polio syndrome (late)"],
    cause:
      "Poliovirus — a naked, acid-stable RNA enterovirus. Wild poliovirus type 1 (WPV1) is the last endemic lineage in Pakistan; it enters via the faecal–oral route and, in <1% of infections, invades the nervous system to cause flaccid paralysis within hours.",
    transmission: [
      "Faecal–oral: sewage-contaminated drinking water and food",
      "Oral–oral droplet possible in crowded households",
      "Virus shed in stool for 3–6 weeks; each paralytic case implies ~200 silent infections",
      "Environmental (sewage) surveillance detects circulation even without cases",
    ],
    riskFactors: [
      "Children <5 years missed by vaccination campaigns (refusals, inaccessible areas)",
      "Southern KP belt (districts along the Afghan border) and Karachi's high-risk UCs",
      "Mobile and displaced populations crossing transmission corridors",
      "Malnutrition and enteric co-infections blunt vaccine take",
      "Poor sanitation scoring on environmental surveillance",
    ],
    mechanism: [
      "Virus replicates in oropharyngeal and intestinal mucosa, then seeds Peyer's patches",
      "Primary and secondary viremia carry virus across the blood–nerve barrier",
      "Selective binding to CD155 on motor neurons → lytic destruction of anterior horn cells",
      "Denervated fibres produce acute flaccid paralysis; bulbar involvement compromises swallowing and breathing",
      "Denervated muscle atrophies over months → deformity and limb-length discrepancy",
    ],
    organs: ["Anterior horn motor neurons", "Brainstem (bulbar form)", "Skeletal muscle (denervation)", "GI mucosa (entry)"],
    biomarkers: [
      "Stool culture ×2 (AFP surveillance gold standard) within 14 days of onset",
      "Intratypic differentiation PCR — wild vs vaccine strain",
      "CSF lymphocytic pleocytosis with normal glucose",
      "EMG: denervation of anterior-horn pattern",
    ],
    incubation: "3–35 days to paralysis (usually 7–21); asymptomatic intestinal shedding dominates the epidemic curve.",
    signs: [
      "Acute flaccid paralysis — asymmetric, proximal worse than distal",
      "Absent/depressed deep tendon reflexes with intact sensation",
      "Neck stiffness; tripod sign in pre-paralytic meningitis",
      "Bulbar signs: nasal voice, dysphagia, respiratory failure",
    ],
    symptoms: [
      "Prodrome of fever, fatigue, headache and vomiting",
      "Severe back and limb pain with muscle tenderness",
      "Sudden flaccid weakness evolving over 48–72 hours",
      "Breathing/swallowing difficulty in bulbar cases — emergency",
    ],
    stages: [
      { name: "Asymptomatic / abortive", window: "72–95% of infections", desc: "Mild flu-like illness or none; silently spreads virus in stool." },
      { name: "Non-paralytic", window: "1–5%", desc: "Aseptic meningitis — stiff neck, pain; full recovery typical." },
      { name: "Paralytic", window: "0.1–0.5% (<1/200)", desc: "Flaccid paralysis over hours-days; residual deficit in most, bulbar fatality 2–10%*." },
      { name: "Post-polio syndrome", window: "15–40 years later", desc: "New weakness, fatigue and pain in recovered muscle groups." },
    ],
    prevalence:
      "Pakistan and Afghanistan are the only two countries where WPV1 has never been interrupted. Pakistan's confirmed paralytic cases: 54 (2015) → 1 (2021) → 20 (2022) → 6 (2023) → 74 (2024), with recurrent positive environmental samples in >60 districts.",
    incidence:
      "74 WPV1 cases confirmed in 2024 — a 21-fold rise from the 2021 low — seeded mainly from southern KP and Karachi reservoirs, per the Pakistan Polio Eradication Programme.",
    global:
      "Wild poliovirus survives globally only across the Pak–Afghan epidemiological bloc; >350,000 cases/yr worldwide in 1988 fell to double digits — a 99.9% reduction under GPEI.",
    demographics: [
      "Almost exclusively children <5 years; median age ~2 years",
      "Boys slightly more reported (access/refusal dynamics)",
      "High-risk mobile populations and underserved peri-urban UCs",
    ],
    geography:
      "Core reservoirs: southern KP (Bannu, Lakki Marwat, DI Khan, Tank, N & S Waziristan), Karachi (Gadap, SITE, Baldia), Quetta block and northern Sindh corridors; positive sewage sites map the Pak–Afghan transit belt.",
    criteria:
      "Standard AFP case definition: any child <15 with acute flaccid paralysis, or paralysis at any age when polio suspected. Confirmed = WPV isolated from stool/close contacts by an accredited lab; compatible = residual paralysis at 60 days. Environmental positives document silent circulation.",
    imaging: [
      "EMG / nerve conduction — anterior horn denervation pattern",
      "MRI spine (rule out transverse myelitis when atypical)",
    ],
    differential: ["Guillain–Barré syndrome (symmetric + sensory)", "Non-polio enterovirus AFP (EV-D68/71)", "Transverse myelitis", "Traumatic neuritis", "Botulism"],
    treatment: [
      "No antiviral or cure exists — care is supportive",
      "Acute: airway/ventilation support, analgesia, careful positioning",
      "Early physiotherapy to prevent contractures; orthotics (AFO/callipers)",
      "Corrective orthopaedic surgery for fixed deformities later",
    ],
    prevention: [
      "OPV (bivalent) plus IPV in EPI schedule; ≥5 supplementary national immunisation days/yr",
      "House-to-house campaigns with transit & cross-border vaccination teams",
      "Environmental surveillance at 60+ sewage sites triggers targeted mop-ups",
      "Community trust-building, refusals mapping, 0.5M+ frontline vaccinators",
    ],
    prognosis:
      "Paralytic polio leaves permanent residual weakness in the majority; 2–10% of childhood paralytic cases die (bulbar cases more). Lifelong rehabilitation and orthotics preserve independence; eradication remains the only definitive exit.",
    medicines: [
      { name: "Ankle-foot orthosis (AFO calliper)", brand: "Custom orthotic workshop", form: "Assistive device", price: 6500, note: "Restores gait in lower-limb paralysis" },
      { name: "IPV (inactivated polio vaccine) 1 dose", brand: "Sanofi / private", form: "IM injection", price: 3900, note: "Free at EPI centres & campaign rounds" },
      { name: "Physiotherapy session (programme ×8wks)", brand: "Rehabilitation centre", form: "Per session", price: 2200, note: "Contracture prevention & strengthening" },
      { name: "Wheelchair (paediatric adaptive)", brand: "Local manufacturer", form: "Assistive device", price: 18500, note: "Severe bilateral lower-limb involvement" },
      { name: "Paracetamol syrup 120 mg/5 mL", brand: "Panadol", form: "Bottle", price: 115, note: "Prodromal fever/pain control" },
    ],
    tests: [
      { name: "Stool culture ×2 (AFP protocol)", purpose: "Definitive WPV1 isolation — free via programme", price: 0, turnaround: "21–28 days (surveillance lab)" },
      { name: "EMG / NCS (2 limbs)", purpose: "Denervation pattern; separates GBS", price: 9500, turnaround: "24–48 hrs" },
      { name: "CSF routine & microscopy", purpose: "Lymphocytic pleocytosis, normal sugar", price: 2450, turnaround: "Same day" },
      { name: "MRI spine with contrast", purpose: "Excludes transverse myelitis in atypical cases", price: 18500, turnaround: "24 hrs" },
    ],
    peakYearNote:
      "2024 — 74 WPV1 cases detected (vs 6 in 2023, 1 in 2021), the highest count since elimination neared in 2021; southern KP leads with recurrent environmental positives.",
    source: "Pakistan Polio Eradication Programme (End Polio Pakistan) · GPEI weekly updates",
    icon: "syringe",
    hue: "#2dd4bf",
    severity: 9,
  },
];
