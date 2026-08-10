import type { DiseasePayload } from "@/lib/types";

export const diseases2: DiseasePayload[] = [
  {
    slug: "tuberculosis",
    name: "Tuberculosis",
    shortName: "TB",
    tagline: "Pakistan's largest infectious killer — 5th highest burden on earth",
    category: "Infectious — Bacterial",
    taxonomy: "Mycobacterial airborne infection · Mycobacterium tuberculosis complex (actinobacterium, acid-fast)",
    icd: "A15 – A19",
    icd11: "1B10 – 1B1Z",
    acronyms: ["TB", "PTB", "EPTB", "MDR-TB", "XDR-TB", "DOTS"],
    synonyms: ["Consumption", "Phthisis", "White plague"],
    cause:
      "Mycobacterium tuberculosis — a slow-growing, acid-fast bacillus whose waxy mycolic-acid cell wall lets it survive desiccation and resist immune killing. Transmitted by inhaling 1–5 µm droplet nuclei expelled by untreated pulmonary cases.",
    transmission: [
      "Airborne droplet nuclei from coughing, sneezing, speaking of active pulmonary/laryngeal TB",
      "Transmission scales with indoor crowding, poor ventilation and bacillary load",
      "One untreated smear-positive case infects 10–15 contacts per year",
      "Not spread by utensils, handshakes or surfaces",
    ],
    riskFactors: [
      "Household contact of an index case — especially children <5",
      "Diabetes mellitus (3× risk; ~20% of Pakistan's TB is diabetes-attributable)",
      "Malnutrition and underweight; tobacco smoking",
      "HIV co-infection and immunosuppressive therapy (steroids, anti-TNF)",
      "Overcrowded housing, prisons, urban slums; silicosis in miners",
    ],
    mechanism: [
      "Inhaled bacilli reach the alveoli and are engulfed by alveolar macrophages — but phagosome–lysosome fusion is blocked, allowing intracellular replication",
      "A T-cell granuloma (Ghon focus) walls off the bacilli → latent TB in ~90%; bacilli may persist dormant for decades",
      "Immune waning (diabetes, age, HIV) reactivates the focus; caseous necrosis liquefies into upper-lobe cavities teeming with bacilli",
      "Cough aerosolises cavity contents — sustaining transmission; lympho-haematogenous spread seeds miliary and extrapulmonary disease",
    ],
    organs: ["Lungs (upper lobes)", "Lymph nodes", "Pleura", "Spine (Pott's disease)", "Meninges", "Kidneys", "Bone marrow"],
    biomarkers: [
      "Sputum AFB smear and culture (gold standard, 4–8 weeks)",
      "GeneXpert MTB/RIF Ultra — detects DNA + rifampicin resistance in 2 hours",
      "Raised ESR/CRP; anaemia of chronic disease",
      "IGRA / tuberculin skin test for latent infection",
    ],
    incubation: "Latent for months-to-decades after infection; ~5–10% lifetime risk of reactivation (half within 2 years). Children and diabetics progress fastest.",
    signs: [
      "Cough >2 weeks; low-grade evening fever, drenching night sweats",
      "Haemoptysis in cavitary disease",
      "Cachexia — weight loss >10%, pallor, tachycardia",
      "Apical crackles/bronchial breathing; lymphadenopathy in EPTB",
    ],
    symptoms: [
      "Persistent cough with sputum, chest pain on breathing",
      "Evening fever, night sweats, anorexia",
      "Progressive weight loss and easy fatiguability",
      "Haemoptysis in advanced cavitary disease",
    ],
    stages: [
      { name: "Primary infection", window: "Weeks after exposure", desc: "Ghon focus ± hilar nodes; usually asymptomatic, heals with calcification." },
      { name: "Latent TB", window: "Months–decades", desc: "Contained bacilli, no symptoms, not infectious. IGRA/Mantoux positive; TPT prevents activation." },
      { name: "Active TB", window: "Progressive over months", desc: "Cough, fever, weight loss, cavity formation; infectious and requires full DOTS therapy." },
      { name: "Drug-resistant / disseminated", window: "After irregular treatment", desc: "MDR (INH+RIF resistant) or miliary/meningeal spread — prolonged regimens, higher mortality." },
    ],
    prevalence:
      "WHO 2024 report places ~686,000 people falling ill with TB in Pakistan each year (incidence ≈258/100,000), with ~48,000 annual deaths — the 5th rank among 30 high-burden countries. An estimated 25,000+ drug-resistant cases arise yearly.",
    incidence:
      "Case notifications hit a record ~333,000 in 2023 (NTP), recovering from the COVID-era detection dip; treatment coverage still leaves a 'missing millions' gap of ~40%.",
    global:
      "10.8M incident TB cases and 1.25M deaths worldwide (2023) — TB reclaimed its place as the leading single-pathogen killer post-COVID.",
    demographics: [
      "Peaks in working-age adults 15–49 — deep economic impact",
      "Men notified more (≈55%), women under-diagnosed",
      "Diabetics, smokers, slum and prison populations concentrated",
    ],
    geography:
      "All provinces endemic; Punjab contributes the largest absolute caseload, with intense clusters in Karachi, Lahore, Faisalabad, Peshawar and Quetta. MDR hotspots track prior irregular treatment in urban Sindh and KP.",
    criteria:
      "Bacteriologically confirmed: positive smear, GeneXpert or culture. Clinically diagnosed (bacteriology negative): compatible CXR plus symptoms not responding to broad antibiotics, decided by NTP algorithm. Latent TB: IGRA/Mantoux+ without active disease.",
    imaging: [
      "Chest X-ray — apical infiltrates, cavities, miliary pattern (first screen)",
      "High-resolution CT chest — tree-in-bud, occult cavities",
      "MRI spine (Pott's), CT abdomen/lymph nodes for EPTB",
    ],
    differential: ["Bacterial/fungal pneumonia", "Lung carcinoma", "Bronchiectasis", "Sarcoidosis", "Histoplasmosis (endemic pockets)"],
    treatment: [
      "Drug-susceptible: 2 months HRZE + 4 months HR (fixed-dose combos, DOTS support) — free via NTP",
      "MDR/RR-TB: 6-month BPaLM (bedaquiline, pretomanid, linezolid, moxifloxacin) or 9–20 month individualised regimens",
      "Treat diabetes aggressively; nutritional support (adherence and cure improve)",
      "Surgery rarely — destroyed lung, massive haemoptysis (BRONCHIAL artery embolisation preferred)",
    ],
    prevention: [
      "BCG vaccination at birth (EPI coverage ~85%)",
      "Contact investigation of every index case; TPT (isoniazid/rifapentine) for latent TB",
      "Airborne infection control: ventilation, masks for suspected cases, cough etiquette",
      "Screening camps in prisons, diabetes clinics and slums; digital adherence (99DOTS)",
    ],
    prognosis:
      "Drug-susceptible TB cures in 85–90% under DOTS; MDR-TB ~60–65% with modern all-oral regimens. Untreated smear-positive TB kills ~50% within 5 years and infects dozens along the way.",
    medicines: [
      { name: "Bedaquiline 100 mg (188-tab course)", brand: "Sirturo", form: "Oral course bottle", price: 28500, note: "MDR-TB backbone (free via PMDT sites)" },
      { name: "Pretomanid 200 mg ×26", brand: "Dovprela", form: "Oral bottle", price: 9200, note: "Component of BPaL/BPaLM regimens" },
      { name: "Linezolid 600 mg ×30", brand: "Nezkil", form: "Oral pack", price: 4850, note: "MDR/XDR component; monitor neuropathy" },
      { name: "Rifampicin–Isoniazid–PZA–EMB FDC ×28", brand: "Myrin-P Forte", form: "Oral strip", price: 1850, note: "Intensive-phase fixed-dose combination" },
      { name: "Rifampicin 300 mg ×10", brand: "Rimactane", form: "Oral strip", price: 460, note: "Continuation phase / latent TPT" },
      { name: "Isoniazid 100 mg ×100", brand: "Isozid", form: "Oral bottle", price: 980, note: "Latent TB preventive therapy ×6–9 months" },
    ],
    tests: [
      { name: "HRCT Chest", purpose: "Cavitation & occult disease mapping", price: 11500, turnaround: "24 hrs" },
      { name: "IGRA (QuantiFERON / T-Spot)", purpose: "Latent TB infection", price: 9500, turnaround: "48 hrs" },
      { name: "GeneXpert MTB/RIF Ultra", purpose: "Rapid diagnosis + rifampicin resistance", price: 5500, turnaround: "2 hrs (free at NTP sites)" },
      { name: "AFB Culture (MGIT)", purpose: "Viability & drug-susceptibility", price: 2850, turnaround: "2–6 weeks" },
      { name: "Chest X-ray (PA view)", purpose: "First-line screening & follow-up", price: 1250, turnaround: "1 hr" },
      { name: "Sputum AFB smear ×2", purpose: "Infectiousness at diagnosis & month 2", price: 350, turnaround: "Same day" },
    ],
    peakYearNote:
      "2023 — record ~333,000 notified cases as NTP post-COVID recovery intensified finding the 'missing millions'; incidence stable around 611,000–648,000/yr.",
    source: "National TB Control Programme (NTP) · WHO Global TB Report 2024",
    icon: "lungs",
    hue: "#14b8a6",
    severity: 9,
  },
  {
    slug: "typhoid",
    name: "Typhoid Fever (XDR)",
    shortName: "Typhoid",
    tagline: "Home of the world's first extensively drug-resistant outbreak",
    category: "Infectious — Bacterial",
    taxonomy: "Enteric bacterial infection · Salmonella enterica serovar Typhi (Gram-negative bacillus); XDR clone since 2016",
    icd: "A01.0",
    icd11: "1A07",
    acronyms: ["XDR", "MDR", "TCV", "WASH"],
    synonyms: ["Enteric fever", "Typhoid fever", "Moti jhar (colloq.)"],
    cause:
      "Salmonella Typhi, a human-restricted Gram-negative bacillus. In November 2016 an extensively drug-resistant (XDR) clone emerged in Hyderabad, Sindh — resistant to chloramphenicol, ampicillin, co-trimoxazole, fluoroquinolones and third-generation cephalosporins — leaving azithromycin and carbapenems as the remaining options.",
    transmission: [
      "Faecal–oral route: water contaminated by sewage and food handled by carriers",
      "Short-cycle (street food, ice, raw vegetables) and long-cycle (municipal water mixing with sewage)",
      "2–5% of patients become chronic gallbladder carriers, shedding bacilli for years",
      "No animal reservoir — humans are the only source",
    ],
    riskFactors: [
      "Drinking untreated municipal/hand-pump water — mixed sewers in Sindh towns",
      "Street-vended food and unpasteurised dairy",
      "Children aged 2–15 years (highest incidence)",
      "Poor sanitation, open defecation, absent hand-washing",
      "Gallstones and prior gallbladder disease → chronic carriage",
    ],
    mechanism: [
      "Ingested bacilli that survive gastric acid reach the terminal ileum and invade M cells overlying Peyer's patches",
      "Uptake by macrophages (not killed — Vi capsule resists complement) → carriage to mesenteric nodes, then week-1 bacteraemia",
      "Reticuloendothelial seeding of liver, spleen and bone marrow; re-entry via the gallbladder multiplies bacilli in bile",
      "Week-2–3 ileal lymphoid hyperplasia ulcerates longitudinally → intestinal haemorrhage or perforation (~1–3%)",
    ],
    organs: ["Terminal ileum (Peyer's patches)", "Gallbladder", "Liver", "Spleen", "Bone marrow"],
    biomarkers: [
      "Blood culture — gold standard (week 1, sensitivity 40–80%)",
      "Bone marrow culture — most sensitive even after antibiotics",
      "Relative bradycardia + leukopenia with eosinopenia",
      "Modestly raised transaminases; Typhidot IgM for rapid field use",
    ],
    incubation: "6–30 days (typically 8–14); duration inversely related to inoculum dose.",
    signs: [
      "Step-ladder fever rising to 39–40°C with toxic appearance",
      "Rose spots — 2–4 mm blanching salmon papules on the trunk (week 2)",
      "Hepatosplenomegaly, coated tongue, relative bradycardia",
      "'Pea-soup' diarrhoea or paradoxical constipation",
    ],
    symptoms: [
      "Sustained high fever with frontal headache and malaise",
      "Diffuse abdominal pain, anorexia, nausea",
      "Constipation early, diarrhoea later (children more)",
      "Apathy, confusion ('typhoid state') in late untreated disease",
    ],
    stages: [
      { name: "Week 1 — invasion", window: "Day 1–7", desc: "Rising bacteraemia, step-ladder fever, headache; blood cultures most likely positive." },
      { name: "Week 2 — toxaemia", window: "Day 8–14", desc: "Sustained fever, rose spots, splenomegaly, delirium risk; stool cultures turn positive." },
      { name: "Week 3 — complications", window: "Day 15–21", desc: "Ileal ulceration — haemorrhage/perforation; encephalopathy; myocarditis." },
      { name: "Week 4+ — convalescence / carriage", window: "Day 22+", desc: "Defervescence and recovery, or chronic gallbladder carriage in 2–5%." },
    ],
    prevalence:
      "Pakistan reports the world's largest XDR typhoid outbreak: >15,000 lab-confirmed XDR cases (2016–2024), overwhelmingly from Sindh (Hyderabad, Karachi, Sukkur). Prospective Karachi cohorts show typhoid incidence ~170–500/100,000 child-years.",
    incidence:
      "Lab-reported enteric fever rose from ~6.8k (2016) to >21k cases (2023) in national returns — a fraction of the true burden given limited blood-culture access.",
    global:
      "9–11M typhoid cases and ~110k deaths globally each year; Pakistan is the only country with a self-sustaining XDR epidemic, now exported to 80+ travellers abroad.",
    demographics: [
      "School-age children 2–15 years dominate notifications",
      "Both sexes equal; urban poor with piped-sewage mixing most exposed",
      "Chronic carriers skew to older women with gallstones",
    ],
    geography:
      "Sindh is the epicentre — Hyderabad division, Karachi (Lyari, Korangi), Sukkur and Larkana. Punjab (Lahore, Faisalabad) and KP report rising secondary clusters; sporadic cases nationwide wherever water and sewage lines intermix.",
    criteria:
      "Confirmed: culture of S. Typhi from blood, bone marrow or stool with antimicrobial susceptibility (XDR definition per CDC/NIH). Probable: fever ≥3 of 7 days in an endemic area with compatible clinical picture. Carriage: persistent stool shedding >12 months.",
    imaging: [
      "Abdominal ultrasound — hepatosplenomegaly, free fluid",
      "Erect chest X-ray — sub-diaphragmatic free air if perforation suspected",
    ],
    differential: ["Malaria", "Dengue", "Brucellosis", "Tuberculosis", "Viral hepatitis", "Rickettsial fevers"],
    treatment: [
      "Uncomplicated XDR: oral azithromycin 20 mg/kg/day ×7–14 days",
      "Severe/XDR admitted: IV meropenem (last reliable class) ×10–14 days",
      "Non-XDR confirmed susceptible: ceftriaxone or fluoroquinolone",
      "High-dose dexamethasone for severe toxaemia/encephalopathy; surgery for perforation",
    ],
    prevention: [
      "Typhoid conjugate vaccine (TCV) in EPI since 2019 — single dose at 9 months; catch-up campaigns to 15 years in Sindh",
      "WASH: safe chlorinated water, boiling, hand hygiene, sewage–water separation",
      "Food safety — licensed vendors, covered food, pasteurisation",
      "Identify and treat carriers; cholecystectomy in refractory cases",
    ],
    prognosis:
      "Treated CFR <1%; XDR with complications 2–4%. Relapse in 5–10% and chronic carriage in 2–5% (women >men). TCV campaigns in Sindh cut XDR notifications sharply post-2019.",
    medicines: [
      { name: "Meropenem 1 g injection (×14 doses course)", brand: "Merom / Remeron", form: "IV vial", price: 4980, note: "Last-line IV option for severe XDR (per vial)" },
      { name: "Azithromycin 500 mg ×6 tabs", brand: "Zithromax / Azomax", form: "Oral strip", price: 540, note: "First-line oral therapy for XDR" },
      { name: "Ceftriaxone 1 g injection", brand: "Rocephin / Oxidil", form: "IV/IM vial", price: 680, note: "Only if strain proven susceptible (non-XDR)" },
      { name: "Dexamethasone 4 mg/mL ampoule", brand: "Decadron", form: "IM/IV ampoule", price: 55, note: "Adjunct in severe toxaemia/encephalopathy" },
      { name: "Ciprofloxacin 500 mg ×10", brand: "Ciprodex / Novidat", form: "Oral strip", price: 330, note: "Quinolone-susceptible strains only — rare in Sindh" },
      { name: "ORS sachet (pack of 6)", brand: "Electral", form: "Oral salts", price: 260, note: "Supportive rehydration" },
    ],
    tests: [
      { name: "Bone marrow culture + sensitivity", purpose: "Highest-yield confirmation even post-antibiotics", price: 3250, turnaround: "48–72 hrs" },
      { name: "Blood culture (aerobic) + MIC", purpose: "Gold standard & XDR profiling", price: 1650, turnaround: "48–72 hrs" },
      { name: "Stool culture (rectal swab)", purpose: "Week-2+ diagnosis & carrier detection", price: 1450, turnaround: "72 hrs" },
      { name: "Typhidot-M (IgM/IgG)", purpose: "Rapid field screen — supportive only", price: 950, turnaround: "3 hrs" },
      { name: "CBC with differential", purpose: "Leukopenia/eosinopenia pattern", price: 550, turnaround: "2 hrs" },
      { name: "Widal agglutination", purpose: "Legacy test — discouraged (unreliable in PK)", price: 650, turnaround: "Same day" },
    ],
    peakYearNote:
      "Sindh XDR outbreak ongoing since Nov 2016 — lab-notified enteric fever peaked at ~21,400 cases in 2023, led by Hyderabad & Karachi divisions.",
    source: "NIH Pakistan / Aga Khan University XDR surveillance · CDC travel notices · DoH Sindh",
    icon: "thermometer",
    hue: "#0891b2",
    severity: 7,
  },
];
