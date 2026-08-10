import type { DiseasePayload } from "@/lib/types";

export const diseases4: DiseasePayload[] = [
  {
    slug: "covid-19",
    name: "COVID-19 (SARS-CoV-2)",
    shortName: "COVID-19",
    tagline: "The pandemic that rewired Pakistan's health surveillance",
    category: "Infectious — Viral",
    taxonomy: "Respiratory viral infection · Coronaviridae, Betacoronavirus — SARS-CoV-2 (variants Alpha→Omicron documented in Pakistan)",
    icd: "U07.1 / U07.2",
    icd11: "RA01.x · RA02 (post-COVID)",
    acronyms: ["COVID-19", "SARS-CoV-2", "ARDS", "MIS-C", "HRCT"],
    synonyms: ["Coronavirus disease 2019", "Novel coronavirus pneumonia", "Long COVID (sequelae)"],
    cause:
      "SARS-CoV-2, an enveloped betacoronavirus whose spike protein binds ACE2 receptors on respiratory epithelium. Pakistan confirmed its first cases on 26 Feb 2020 (travellers from Iran) and evolved through eight pandemic waves dominated successively by Delta and Omicron lineages.",
    transmission: [
      "Respiratory aerosols and droplets — close-range indoor sharing is dominant",
      "Airborne accumulation in poorly ventilated, crowded spaces",
      "Peak infectiousness straddles symptom onset (48 h before to 72 h after)",
      "Fomite transmission minor; superspreading events amplify clusters",
    ],
    riskFactors: [
      "Age >60 — mortality rises steeply each decade",
      "Diabetes, CKD, obesity, cardiovascular disease (high baseline prevalence in PK)",
      "Immunosuppression, transplant, active chemotherapy",
      "Unvaccinated status; pregnancy (severe disease risk)",
      "Frontline occupational exposure and multigenerational households",
    ],
    mechanism: [
      "Spike-ACE2 docking with TMPRSS2 priming → upper-airway replication (2–4 days)",
      "Descent to alveoli infects type-II pneumocytes → diffuse alveolar damage and ground-glass pneumonia",
      "In severe hosts, delayed interferon responses permit hyperinflammation (IL-6, TNF-α) — the week-2 'cytokine storm'",
      "Endotheliitis with complement-driven microthrombi causes hypoxaemia out of proportion to imaging ('happy hypoxia'), plus myocardial and renal injury",
    ],
    organs: ["Lungs (alveoli)", "Vascular endothelium", "Heart", "Kidneys", "CNS (anosmia, strokes)", "GI tract"],
    biomarkers: [
      "RT-PCR Ct value / antigen RAT (infectivity window)",
      "D-dimer, ferritin, CRP, IL-6 — inflammatory escalation markers",
      "Lymphopenia; high neutrophil-to-lymphocyte ratio",
      "SpO2 ≤93%, rising procalcitonin flags bacterial co-infection",
    ],
    incubation: "2–14 days; median 4–5 days for ancestral/Delta, ~3 days for Omicron.",
    signs: [
      "Fever, tachypnoea, desaturation on walking (6-minute walk test)",
      "Bilateral basal crackles; silent hypoxaemia",
      "Conjunctivitis, skin rashes, COVID toes (children)",
      "Delirium in elderly; MIS-C signs 2–6 weeks post-infection",
    ],
    symptoms: [
      "Dry cough, fever, sore throat, coryza",
      "Anosmia/ageusia (signature of early variants)",
      "Myalgia, profound fatigue, headache",
      "Dyspnoea and chest tightness in the inflammatory second week",
    ],
    stages: [
      { name: "Early viral phase", window: "Day 1–5", desc: "Upper-airway replication; contagious; home isolation suits most." },
      { name: "Pulmonary / inflammatory phase", window: "Day 6–12", desc: "Hypoxaemia window — monitor SpO2; steroids and oxygen change outcomes here." },
      { name: "Recovery", window: "Week 2–6", desc: "Radiological and functional resolution; graded return to activity." },
      { name: "Post-acute (Long COVID)", window: ">12 weeks", desc: "Fatigue, brain fog, dysautonomia in 5–15%; multidisciplinary rehab." },
    ],
    prevalence:
      "Pakistan reported ~1.58M confirmed cases and ~30.6k deaths (2020–2024); national sero-surveys suggest true infections were several-fold higher. The eighth wave (late 2022) faded as hybrid immunity matured.",
    incidence:
      "Peak waves: summer 2020, Delta spring-autumn 2021, Omicron Jan–Feb 2022 (record ~7,500 daily cases). Post-2023 the disease settled into low endemic transmission.",
    global:
      ">775M confirmed cases and >7M deaths reported globally to WHO; excess-mortality modelling estimates true toll several times higher.",
    demographics: [
      "Median case age ~35 (young population), deaths concentrated >60",
      "Males ~60% of reported fatalities",
      "Urban metros (Karachi, Lahore, Islamabad) drove every wave onset",
    ],
    geography:
      "Sindh (Karachi) and Punjab (Lahore/Rawalpindi) led every wave; ICT recorded the highest per-capita testing and positivity. Northern tourist corridors saw summer surges during domestic travel peaks.",
    criteria:
      "Confirmed: RT-PCR or antigen-positive. During surges, clinical-radiological diagnosis (typical HRCT + symptoms + contact) sufficed per NCOC guidance. Severity graded on SpO2/respiratory rate (mild → critical ARDS).",
    imaging: [
      "HRCT chest — bilateral peripheral ground-glass opacities; CORADS scoring",
      "Chest X-ray for progression tracking",
      "CT pulmonary angiography when embolism suspected (high D-dimer)",
      "Lung ultrasound — bedside B-lines and consolidation",
    ],
    differential: ["Influenza/RSV", "Bacterial & atypical pneumonia", "Pulmonary TB", "Co-circulating dengue/malaria fevers", "Pulmonary embolism"],
    treatment: [
      "Mild: isolation, hydration, paracetamol — most managed at home/tele-clinics",
      "Hypoxaemic: targeted oxygen, awake proning; dexamethasone 6 mg ×10 days when O2 needed",
      "Hospitalised: remdesivir (5-day), prophylactic LMWH, empiric antibiotics only on suspicion",
      "High-risk outpatients: nirmatrelvir/ritonavir within 5 days; severe: tocilizumab/baricitinib",
    ],
    prevention: [
      "Mass vaccination — 300M+ doses administered (Sinopharm, Pfizer, AstraZeneca, CanSino)",
      "Ventilation and masking in healthcare/congregate settings during surges",
      "Test-trace-isolate via NCOC data cells; border screening protocols",
      "Booster priority for elderly and immunocompromised",
    ],
    prognosis:
      "Overall reported CFR ≈1.9%; full recovery expected in mild disease within 2 weeks. ICU ARDS carried 30–45% mortality; 5–15% report symptoms beyond 3 months. Vaccination cut severe outcomes >80%.",
    medicines: [
      { name: "Tocilizumab 400 mg/20 mL", brand: "Actemra", form: "IV infusion", price: 62000, note: "IL-6 blockade for severe/critical — single dose" },
      { name: "Nirmatrelvir/Ritonavir (5-day course)", brand: "Paxlovid (imported)", form: "Oral course pack", price: 29500, note: "High-risk outpatients within 5 days" },
      { name: "Remdesivir 100 mg (5-day course per vial)", brand: "Veklury / generics", form: "IV vial", price: 9800, note: "Hospitalised, oxygen-requiring patients" },
      { name: "Baricitinib 4 mg ×14", brand: "Olumiant", form: "Oral strip", price: 4900, note: "JAK inhibitor alternative in severe disease" },
      { name: "Enoxaparin 40 mg prefilled", brand: "Clexane", form: "SC syringe", price: 890, note: "Thromboprophylaxis in admitted patients" },
      { name: "Dexamethasone 4 mg/mL ×5 amps", brand: "Decadron", form: "IM/IV ampoule", price: 175, note: "Only when supplemental oxygen required" },
    ],
    tests: [
      { name: "HRCT Chest (high-resolution)", purpose: "Severity grading of pneumonia", price: 12000, turnaround: "24 hrs" },
      { name: "SARS-CoV-2 RT-PCR", purpose: "Definitive diagnosis (gold standard)", price: 6500, turnaround: "24 hrs" },
      { name: "IL-6 level", purpose: "Cytokine-storm stratification", price: 5500, turnaround: "48 hrs" },
      { name: "D-dimer", purpose: "Thrombotic risk marker", price: 2100, turnaround: "4 hrs" },
      { name: "Rapid antigen test", purpose: "Fast infectivity screen", price: 1200, turnaround: "30 min" },
      { name: "CRP + ferritin", purpose: "Inflammatory trajectory", price: 1950, turnaround: "6 hrs" },
    ],
    peakYearNote:
      "2021 was Pakistan's heaviest year (~787k cases, Delta wave) while Omicron delivered the single highest daily tally (~7.5k) in late Jan 2022.",
    source: "NCOC daily dashboards · NIH Pakistan · WHO situation reports",
    icon: "virus",
    hue: "#67e8f9",
    severity: 6,
  },
  {
    slug: "measles",
    name: "Measles",
    shortName: "Measles",
    tagline: "Exploiting every gap in routine immunisation",
    category: "Infectious — Viral",
    taxonomy: "Paramyxoviral exanthem · Morbillivirus (ssRNA), among the most contagious pathogens known (R₀ 12–18)",
    icd: "B05",
    icd11: "1F03",
    acronyms: ["MMR", "EPI", "SSPE", "ORI"],
    synonyms: ["Rubeola", "Khasra (Urdu)", "Red measles"],
    cause:
      "Measles virus (Morbillivirus), a single-stranded RNA paramyxovirus with one stable serotype. It transmits by aerosol so efficiently that a single case can infect 12–18 susceptible people and virus lingers airborne for up to 2 hours.",
    transmission: [
      "Airborne respiratory droplets and aerosols from cough/sneezing",
      "Infectious 4 days before to 4 days after rash onset",
      "Contaminated air space remains infectious up to 2 hours",
      "Direct contact with nasal/throat secretions",
    ],
    riskFactors: [
      "Unvaccinated children <5 — one-dose MMR coverage ~76%, two-dose only ~61–68% in PK",
      "Malnutrition and vitamin A deficiency (mortality multiplier)",
      "Displacement camps, flood shelters and urban slums (2022–24 outbreaks)",
      "Immunodeficiency and intact-virus exposure in infants <9 months",
    ],
    mechanism: [
      "Virus enters via respiratory tract, infecting SLAM/CD150-positive immune cells",
      "Viremia disseminates to epithelium; the rash itself is a T-cell mediated immune attack on infected skin",
      "Transient profound immunosuppression ('immune amnesia') erases pre-existing antibody memory for months–years",
      "Secondary bacterial pneumonia and diarrhoea cause most deaths; rare CNS invasion produces encephalitis or late SSPE",
    ],
    organs: ["Respiratory tract", "Skin", "Conjunctiva", "GI mucosa", "CNS (encephalitis/SSPE)"],
    biomarkers: [
      "Measles-specific IgM (day 3+ of rash)",
      "RT-PCR of throat swab/urine (early confirmation, genotyping)",
      "Leukopenia with lymphopenia",
      "Low serum vitamin A — correlates with severity",
    ],
    incubation: "8–12 days to fever; rash appears about day 14 after exposure (range 7–21).",
    signs: [
      "Koplik spots — bluish-white grains on buccal mucosa (pathognomonic, day −2)",
      "Maculopapular confluent rash: hairline → face → trunk → limbs over 3 days",
      "Conjunctivitis with photophobia, coryza, lymphadenopathy",
      "Dehydration, oral ulcers, otitis media in complicated cases",
    ],
    symptoms: [
      "Prodrome of high fever with the '4 Cs': cough, coryza, conjunctivitis, cephalgia",
      "Malaise and anorexia worsen as rash evolves",
      "Diarrhoea (common in malnourished)",
      "Rash darkens and desquamates as fever breaks",
    ],
    stages: [
      { name: "Incubation", window: "Day 0–10", desc: "Silent; then prodrome builds with fever and catarrhal features." },
      { name: "Prodrome / Koplik", window: "Day 10–13", desc: "High fever, 4 Cs, Koplik spots — peak contagion before rash." },
      { name: "Exanthem", window: "Day 14–18", desc: "Descending confluent rash; fever persists; complications window opens." },
      { name: "Recovery / complications", window: "Week 3+", desc: "Pneumonia (commonest killer), diarrhoea, encephalitis (1/1000), SSPE (1/10k, years later)." },
    ],
    prevalence:
      "Post-flood immunity gaps ignited Pakistan's largest measles resurgence in over a decade: >17,000 reported cases (2023) climbing past 23,000 (2024), with outbreaks in 60+ districts per EPI situation reports.",
    incidence:
      "Reported suspected+confirmed cases roughly tripled from ~6.5k (2021) to >23k (2024); measles deaths reached an estimated 300–400/yr in the resurgence.",
    global:
      "~10.3M cases worldwide in 2023 (up 20%) as coverage slipped under 83%; every unimmunised cohort is a delayed outbreak — Pakistan's is among EMRO's largest.",
    demographics: [
      "Children 6 months–5 years dominate; infants below vaccine age highly vulnerable",
      "Rural and camp-dwelling children with zero doses ('zero-dose' children >1M nationally)",
      "No sex skew; malnourished cohorts drive mortality",
    ],
    geography:
      "Outbreaks concentrate where routine coverage is weakest: interior Sindh flood districts, southern KP/ex-FATA belt, and Balochistan's remote districts; Karachi and Lahore peri-urban slums report recurrent clusters.",
    criteria:
      "Suspected: fever + maculopapular rash + cough/coryza/conjunctivitis. Confirmed: measles IgM or RT-PCR positive. Outbreak threshold: ≥3 lab-confirmed cases in a district within 21 days (EPI/NIH).",
    imaging: [
      "Chest X-ray when pneumonia suspected (commonest severe complication)",
      "EEG/MRI only for encephalitis or suspected SSPE",
    ],
    differential: ["Dengue rash", "Rubella", "Scarlet fever", "Kawasaki disease", "Drug eruption", "Roseola"],
    treatment: [
      "No specific antiviral — meticulous supportive care is the treatment",
      "WHO vitamin A supplementation: 2 doses 24 h apart (halves mortality in deficient children)",
      "Antipyretics, oral rehydration, nutrition support (continue feeding)",
      "Antibiotics only for pneumonia/otitis; isolation until day 4 post-rash",
    ],
    prevention: [
      "MMR/MR vaccine at 9 and 15 months via EPI (free) — target ≥95% two-dose coverage",
      "Outbreak-response immunisation (ORI) rounds in affected districts",
      "Catch-up campaigns for zero-dose and missed children (Big Catch-Up)",
      "Case isolation plus vitamin A prophylaxis to malnourished contacts",
    ],
    prognosis:
      "Healthy vaccinated-adjacent cases recover fully in 1–2 weeks. CFR is 1–5% in malnourished children; pneumonia and dehydrating diarrhoea are the main killers, encephalitis leaves sequelae, and SSPE is universally fatal.",
    medicines: [
      { name: "MR/MMR vaccine (single dose, private)", brand: "EPI (free) / private", form: "SC injection", price: 1350, note: "Free at all EPI centres — prevention, not treatment" },
      { name: "Vitamin A 200 000 IU capsule", brand: "A-Cap", form: "Oral capsule", price: 60, note: "WHO protocol: 2 doses, 24 h apart" },
      { name: "Amoxicillin 250 mg suspension", brand: "Amoxil", form: "Bottle 90 mL", price: 185, note: "Only for bacterial complications" },
      { name: "Hyoscine-butylbromide drops", brand: "Buscopan", form: "Oral drops", price: 165, note: "Crampy abdominal pain" },
      { name: "ORS sachet (pack of 6)", brand: "Electral", form: "Oral salts", price: 260, note: "Diarrhoeal dehydration control" },
      { name: "Paracetamol syrup 120 mg/5 mL", brand: "Panadol", form: "Bottle", price: 115, note: "Fever control; avoid aspirin (Reye's)" },
    ],
    tests: [
      { name: "Measles RT-PCR (throat/urine)", purpose: "Early confirmation + genotype tracking", price: 7200, turnaround: "48 hrs" },
      { name: "Measles IgM serology", purpose: "Standard confirmation, day 3+ of rash", price: 2350, turnaround: "24 hrs" },
      { name: "Serum vitamin A (retinol)", purpose: "Deficiency — severity modifier", price: 3800, turnaround: "72 hrs" },
      { name: "Chest X-ray", purpose: "Pneumonia complication screen", price: 1250, turnaround: "1 hr" },
      { name: "CBC with differential", purpose: "Leukopenia pattern; bacterial co-infection", price: 550, turnaround: "2 hrs" },
    ],
    peakYearNote:
      "2024 — >23,000 reported cases, the largest national measles wave since 2012–13, seeded by two-dose coverage stuck near 61–68% and post-flood displacement.",
    source: "Federal EPI / WHO-EMRO measles surveillance · UNICEF Pakistan",
    icon: "scan",
    hue: "#5eead4",
    severity: 6,
  },
];
