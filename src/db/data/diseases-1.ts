import type { DiseasePayload } from "@/lib/types";

// Compiled from NIH Pakistan weekly situation reports, WHO country profiles,
// National TB / Malaria / AIDS Control Programmes and EPI reporting (2015-2024).
export const diseases1: DiseasePayload[] = [
  {
    slug: "dengue",
    name: "Dengue Fever",
    shortName: "Dengue",
    tagline: "Post-monsoon arboviral epidemic of Pakistan's urban corridors",
    category: "Infectious — Viral",
    taxonomy: "Arboviral infection · Family Flaviviridae, genus Flavivirus, serotypes DENV-1 to DENV-4",
    icd: "A90 – A91",
    icd11: "1D86",
    acronyms: ["DF", "DHF", "DSS"],
    synonyms: ["Breakbone fever", "Dandy fever", "Dengue haemorrhagic fever"],
    cause:
      "Dengue virus, a positive-sense single-stranded RNA flavivirus with four antigenically distinct serotypes. Infection with one serotype gives lifelong homotypic immunity but only transient cross-protection — secondary infection with a different serotype drives severe disease in Pakistan's epidemic years.",
    transmission: [
      "Bite of infected Aedes aegypti and Aedes albopictus mosquitoes — aggressive daytime biters breeding in clean stored water",
      "Viremic human → mosquito → human cycle; mosquito becomes infective 8–12 days after a blood meal",
      "Rare routes: blood transfusion, organ transplant, vertical (mother-to-child)",
    ],
    riskFactors: [
      "Secondary infection with a different serotype (antibody-dependent enhancement)",
      "Monsoon and post-monsoon months (Aug–Nov) with stagnant water storage",
      "Dense urban living — Lahore, Rawalpindi–Islamabad, Karachi, Peshawar",
      "Unscreened water tanks, tyres and construction sites harbouring larvae",
      "Age <15 years and comorbidity (diabetes, asthma) for severe phenotypes",
    ],
    mechanism: [
      "Infected saliva deposits virus in skin — Langerhans cells and monocytes are infected and trafficked to lymph nodes",
      "Primary viremia (days 3–7) seeds liver, spleen and marrow; pre-existing heterotypic antibodies opsonise virus into monocytes (ADE), amplifying viral load",
      "Infected monocytes release TNF-α, IL-6, IL-8 and NS1 protein, which directly disrupts the endothelial glycocalyx",
      "Capillary plasma leakage raises haematocrit ≥20% — the hallmark of DHF — while marrow suppression and anti-platelet antibodies crash platelet counts",
      "Critical loss of intravascular volume produces dengue shock syndrome; bleeding manifestations follow thrombocytopenia plus platelet dysfunction",
    ],
    organs: ["Vascular endothelium", "Bone marrow", "Liver", "Skin", "Reticuloendothelial system"],
    biomarkers: [
      "NS1 antigen — positive days 1–5 of illness",
      "Rising haematocrit ≥20% with falling platelets (plasma leakage)",
      "Thrombocytopenia <100,000/µL, leukopenia with atypical lymphocytes",
      "AST/ALT elevation (often AST > ALT), hypoalbuminemia in plasma leak",
    ],
    incubation: "4–10 days after an infective bite (commonly 5–8 days); viremia precedes fever by ~24 hours.",
    signs: [
      "Biphasic high fever (39–40°C) with facial flushing",
      "Diffuse maculopapular rash with 'isles of white in a sea of red'",
      "Positive tourniquet test (>20 petechiae per 2.5 cm²)",
      "Periorbital oedema, conjunctival injection, tender hepatomegaly",
      "Warning signs: persistent vomiting, mucosal bleed, abdominal pain, lethargy",
    ],
    symptoms: [
      "Abrupt fever with severe frontal headache and retro-orbital pain",
      "Intense myalgia and arthralgia ('breakbone'), back pain",
      "Nausea, anorexia, altered taste",
      "Post-fever convalescent rash with peeling palms and soles",
    ],
    stages: [
      { name: "Febrile phase", window: "Day 1–4", desc: "High fever, flushing, aches; usually self-limited. Dehydration risk; monitor fluid intake." },
      { name: "Critical phase", window: "Day 4–6", desc: "Defervescence paradoxically brings plasma leakage — watch haematocrit and platelets; shock, effusions and bleeding occur here." },
      { name: "Recovery phase", window: "Day 7–10", desc: "Reabsorption of extravasated fluid — watch for fluid overload. Convalescent rash and profound fatigue." },
    ],
    prevalence:
      "Endemic in all four provinces since the 2011 Lahore epidemic; Pakistan has recorded >400,000 notified cases and >1,500 deaths across 2011–2024, with nationwide peaks in 2019, 2021 and the post-flood surge of 2022.",
    incidence:
      "Recorded 52,485 cases (2019), 52,943 (2021) and a record ~79,000 cases with 149 deaths in 2022 after catastrophic floods; 2023–24 settled to 15,000–27,000/yr.",
    global:
      "WHO estimates 390 million infections annually worldwide; Pakistan is among the highest-burden countries in the Eastern Mediterranean Region.",
    demographics: [
      "All ages susceptible in urban epidemics; severe disease clusters in children and seronegative adults",
      "Slight male predominance in reported admissions (mobility/exposure)",
      "Day-wage and outdoor workers at highest bite exposure",
    ],
    geography:
      "Hyper-endemic urban belt: Lahore, Rawalpindi, Islamabad, Karachi, Peshawar and Multan. KP northern districts (Haripur, Mansehra) and AJK report seasonal clusters; incidence tracks monsoon rainfall and flood years (2022).",
    criteria:
      "WHO 2009 classification: fever plus any 2 of nausea/vomiting, rash, aches, positive tourniquet test, leukopenia, or any warning sign, in a person living in or travelling from an endemic area — labelled 'probable dengue'. Confirmed by NS1, PCR or IgM seroconversion. Severe dengue requires plasma leakage with shock/respiratory distress, severe bleeding, or organ impairment.",
    imaging: [
      "Bedside ultrasound — gallbladder wall thickening, ascites, pleural/pericardial effusion (severity marker)",
      "Chest X-ray for effusions and respiratory distress grading",
    ],
    differential: ["Malaria", "Enteric (typhoid) fever", "Chikungunya", "COVID-19/influenza", "Leptospirosis", "Viral exanthems (measles)"],
    treatment: [
      "No specific antiviral — meticulous fluid management is lifesaving",
      "Paracetamol only for fever; strictly avoid aspirin/NSAIDs (bleeding risk)",
      "Judicious isotonic crystalloid for DHF; 48-hour haematocrit-guided titration in DSS",
      "Platelet/blood transfusion only for significant bleeding — not prophylactically",
    ],
    prevention: [
      "Weekly emptying/covering of water containers; community larval-source reduction",
      "DEET/PMD repellents, full-sleeved clothing, bed nets for daytime sleepers",
      "Municipal thermal fogging + larviciding (temephos) during peak season",
      "Hospital 'dengue counters' and NIH early-warning surveillance each monsoon",
    ],
    prognosis:
      "Case-fatality under 1% with protocol fluids; DSS mortality rises without haematocrit monitoring. Uncomplicated cases recover fully in 1–2 weeks with prolonged post-viral fatigue.",
    medicines: [
      { name: "Platelet concentrate (single donor)", brand: "Blood bank service", form: "Transfusion unit", price: 2850, note: "Only for active bleeding, per unit processing cost" },
      { name: "Paracetamol IV 1 g infusion", brand: "Perfalgan", form: "IV bottle", price: 915, note: "Fever control when oral route impossible" },
      { name: "Ringer's lactate 1 000 mL", brand: "Otsuka / local", form: "IV fluid", price: 310, note: "Plasma-leak resuscitation fluid" },
      { name: "Normal saline 0.9% 1 000 mL", brand: "Otsuka / local", form: "IV fluid", price: 260, note: "Maintenance & shock correction" },
      { name: "ORS sachet (75 mmol/L)", brand: "Electral / ORS-L", form: "Oral salts, pack of 6", price: 260, note: "First-line outpatient hydration" },
      { name: "Paracetamol 500 mg ×10 tabs", brand: "Panadol", form: "Oral strip", price: 42, note: "Only recommended antipyretic" },
    ],
    tests: [
      { name: "RT-PCR for Dengue (DENV)", purpose: "Gold-standard confirmation in first 5 days", price: 6500, turnaround: "24 hrs" },
      { name: "NS1 Antigen (ELISA)", purpose: "Early marker, day 1–5", price: 1800, turnaround: "Same day" },
      { name: "Dengue IgM / IgG serology", purpose: "After day 5; primary vs secondary", price: 1650, turnaround: "Same day" },
      { name: "CBC with platelet count", purpose: "Serial platelet & haematocrit monitoring", price: 550, turnaround: "2 hrs" },
      { name: "LFTs (AST/ALT/Albumin)", purpose: "Hepatic involvement & plasma leak", price: 950, turnaround: "Same day" },
    ],
    peakYearNote:
      "2022 — ~79,000 notified cases and 149 deaths, the highest in NIH records, driven by super-flood water pooling across Punjab, Sindh and KP.",
    source: "NIH Pakistan weekly dengue reports · Punjab/KP/Sindh DoH · WHO EMRO",
    icon: "bug",
    hue: "#06b6d4",
    severity: 7,
  },
  {
    slug: "malaria",
    name: "Malaria",
    shortName: "Malaria",
    tagline: "Flood-amplified parasitic re-emergence across the Indus basin",
    category: "Infectious — Parasitic",
    taxonomy: "Protozoal vector-borne infection · Apicomplexa, genus Plasmodium (P. vivax ≈75%, P. falciparum ≈25% in Pakistan)",
    icd: "B50 – B54",
    icd11: "1F40 – 1F4Z",
    acronyms: ["PV", "PF", "ACT", "RDT"],
    synonyms: ["Ague", "Jungle fever", "Paludism"],
    cause:
      "Five Plasmodium species infect humans; Pakistan's burden is overwhelmingly Plasmodium vivax (tertian pattern, relapsing hypnozoites) with a deadly minority of Plasmodium falciparum concentrated in Balochistan and Sindh.",
    transmission: [
      "Bite of female Anopheles mosquitoes (An. stephensi now invading urban Pakistan) — dusk-to-dawn feeders",
      "Sporozoites injected during blood meal; 10–14 day intrinsic incubation",
      "Occasional: blood transfusion, shared needles, congenital transmission",
    ],
    riskFactors: [
      "Post-flood standing water — the 2022 super-floods multiplied breeding sites nationwide",
      "Rural Sindh, Balochistan riverine belt and KP tribal districts (highest Annual Parasite Index)",
      "Absent bed nets, mud-walled housing, outdoor sleeping",
      "Children <5 years, pregnancy (maternal anemia, low birth weight)",
      "Undiagnosed G6PD deficiency — haemolysis risk with primaquine",
    ],
    mechanism: [
      "Sporozoites home to hepatocytes and multiply silently (schizogony); vivax forms dormant hypnozoites that reactivate weeks–months later",
      "Merozoites invade erythrocytes, digest haemoglobin and rupture cells synchronously every 48 h — producing the classic tertian paroxysms",
      "Falciparum-infected red cells express PfEMP1 and cytoadhere to brain, lung and placental microvasculature — sequestration causes cerebral and severe malaria",
      "Mass haemolysis → anaemia, haemoglobinuria; splenic clearance → splenomegaly; cytokine release → cyclical fever with rigors",
    ],
    organs: ["Erythrocytes", "Liver", "Spleen", "Brain (cerebral)", "Kidneys", "Placenta"],
    biomarkers: [
      "Thick/thin Giemsa film — parasite species + density %",
      "RDT positivity (HRP-2 for falciparum, pLDH pan-species)",
      "Haemoglobin drop, unconjugated hyperbilirubinemia",
      "Thrombocytopenia, elevated LDH, hypoglycaemia in severe disease",
    ],
    incubation: "P. falciparum 9–14 days; P. vivax 12–17 days, with relapses up to 3 months–1 year from hypnozoites if radical cure is omitted.",
    signs: [
      "Cyclical fever in three classic stages: cold rigor → hot spike → drenching sweat",
      "Soft splenomegaly after repeated paroxysms",
      "Pallor (anaemia), icterus in haemolysis",
      "Severe disease: impaired consciousness, seizures, respiratory distress, dark urine",
    ],
    symptoms: [
      "Paroxysmal high fever with shaking chills every 48 hours (tertian)",
      "Throbbing headache, myalgia, profound malaise",
      "Nausea, vomiting, loss of appetite",
      "Nocturnal worsening; sweating phase gives false sense of recovery",
    ],
    stages: [
      { name: "Uncomplicated", window: "Day 1–7 untreated", desc: "Cyclical fever, chills, sweats, mild anaemia. Fully curable with oral ACT/chloroquine." },
      { name: "Complicated / severe", window: "Any time in falciparum", desc: "Cerebral malaria, severe anaemia (Hb <5), acidosis, hypoglycaemia, renal failure — a medical emergency needing IV artesunate." },
      { name: "Relapse (vivax)", window: "Weeks–months later", desc: "Hypnozoite reactivation reproduces symptoms; prevented only by 14-day primaquine after G6PD testing." },
    ],
    prevalence:
      "Endemic in 60+ of ~150 districts; the 2022 super-flood triggered Pakistan's largest recorded surge — confirmed cases rose from ~0.5M (2021) to an estimated 2.6M (2023), concentrated in flooded districts of Sindh and Balochistan.",
    incidence:
      "Lab-confirmed cases: ~452k (2019) → ~531k (2021) → ~1.7M (2022) → ~2.1M (2023); malaria-attributable deaths 45–312/yr in official returns (substantial under-notification).",
    global:
      "WHO World Malaria Report: ~263M cases and 597k deaths globally (2023); Pakistan carries ~9% of the Eastern Mediterranean burden and is in the highest-burden 'HBHI' watch list.",
    demographics: [
      "Children <5 bear the brunt of severe disease and death",
      "Rural agricultural and flood-displaced populations",
      "Pregnant women — gestational malaria with fetal loss",
      "Mobile labour along the Sindh–Balochistan corridor",
    ],
    geography:
      "Highest Annual Parasite Index along the Indus and coastal Balochistan: Dadu, Khairpur, Larkana (Sindh); Kech, Panjgur, Lasbela (Balochistan); ex-FATA belt in KP. Punjab reports imported and low local transmission; northern GB is largely spared by altitude.",
    criteria:
      "Microscopy (Giemsa thick/thin film) remains the gold standard — species identification plus parasite density. RDT-positive febrile patients in endemic zones are treated presumptively. Severe malaria per WHO: one or more of impaired consciousness, prostration, multiple convulsions, acidosis, hypoglycaemia, severe anaemia, jaundice, shock.",
    imaging: [
      "Abdominal ultrasound — splenomegaly grade in chronic/repeated infection",
      "Chest X-ray if respiratory features (non-cardiogenic pulmonary oedema)",
    ],
    differential: ["Dengue fever", "Enteric (typhoid) fever", "Viral hepatitis", "Sepsis", "Visceral leishmaniasis (chronic splenomegaly)"],
    treatment: [
      "P. vivax: chloroquine 3 days + primaquine 0.25 mg/kg ×14 days (G6PD-confirmed) for radical cure",
      "P. falciparum / mixed: artemether–lumefantrine (Coartem) 6-dose course",
      "Severe malaria: IV artesunate 2.4 mg/kg at 0/12/24 h then daily + supportive ICU care",
      "Treat hypoglycaemia, transfuse severe anaemia, manage seizures",
    ],
    prevention: [
      "Long-lasting insecticidal nets (LLINs) — free distribution in high-API districts",
      "Indoor residual spraying (IRS) before transmission season, expanded after floods",
      "Larval source management: draining stagnant water, larvicides",
      "Chemoprevention in pregnancy in high-transmission areas; test-before-treat culture",
    ],
    prognosis:
      "Uncomplicated malaria cures >99% with timely therapy. Untreated falciparum can be fatal within 72 hours; cerebral malaria CFR 15–20% even treated. Vivax relapses indolently without primaquine.",
    medicines: [
      { name: "Artesunate 60 mg injection ×6 vials", brand: "Falcigo / Guilin", form: "IV/IM vial", price: 1750, note: "Life-saving severe malaria therapy (per vial ~₨292)" },
      { name: "Artemether–Lumefantrine 80/480 ×24", brand: "Coartem", form: "Oral course pack", price: 1150, note: "First-line falciparum & mixed infection" },
      { name: "Quinine dihydrochloride 300 mg ×20", brand: "GenPharm", form: "Oral strip", price: 420, note: "Reserve — pregnancy 1st trimester / G6PD unknown salvage" },
      { name: "Primaquine 7.5 mg ×14", brand: "Primaquine-Remedica", form: "Oral strip", price: 230, note: "Radical vivax cure — only after G6PD test" },
      { name: "Chloroquine phosphate 250 mg ×10", brand: "Nivaquine", form: "Oral strip", price: 95, note: "First-line vivax blood-stage clearance" },
      { name: "Long-lasting insecticidal net", brand: "DoMC social marketing", form: "LLIN (bed net)", price: 380, note: "Free via DoMC campaigns in endemic districts" },
    ],
    tests: [
      { name: "Malaria PCR (species panel)", purpose: "Low-density & mixed infection confirmation", price: 7000, turnaround: "24 hrs" },
      { name: "Thick/Thin Giemsa smear", purpose: "Gold standard — species + parasite density", price: 350, turnaround: "2 hrs" },
      { name: "ICT Malaria (HRP-2 / pLDH)", purpose: "Rapid screening at peripheral facilities", price: 380, turnaround: "20 min" },
      { name: "G6PD qualitative screen", purpose: "Safety gate before primaquine", price: 1200, turnaround: "Same day" },
      { name: "CBC + bilirubin", purpose: "Anaemia & haemolysis tracking", price: 1050, turnaround: "4 hrs" },
    ],
    peakYearNote:
      "2023 — an estimated 2.1M confirmed cases, the largest malaria resurgence in national history, following the 2022 climate super-floods (Sindh & Balochistan).",
    source: "Directorate of Malaria Control (DoMC) · WHO World Malaria Report 2024 · NACP flood response",
    icon: "droplets",
    hue: "#0ea5e9",
    severity: 8,
  },
];
