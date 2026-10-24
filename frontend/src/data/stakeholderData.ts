export interface StakeholderScenario {
  id: string;
  theme: string;
  role: string;
  sector: string;
  quote: string;
  keyBenefit: string;
  metricsLabel: string;
  metricsValue: string;
  avatarBg: string;
}

export const stakeholderScenarios: StakeholderScenario[] = [
  {
    id: 'faster-waste-assessment',
    theme: 'Faster Preliminary Waste Assessment',
    role: 'Demolition Site Operations Lead',
    sector: 'Illustrative Scenario: Urban Deconstruction Project',
    quote:
      'Photographing waste piles directly from a mobile device provides an immediate breakdown of surface materials. Instead of guessing aggregate ratios before mobilizing crushing equipment, our ground crews obtain an instant preliminary perspective on debris distribution.',
    keyBenefit: 'Instant on-site material visual breakdown within seconds',
    metricsLabel: 'Assessment Speed',
    metricsValue: '< 2 Seconds',
    avatarBg: 'bg-emerald-700',
  },
  {
    id: 'improved-visibility',
    theme: 'Improved Visibility into Mixed Debris',
    role: 'Site Environmental Compliance Officer',
    sector: 'Illustrative Scenario: Commercial Renovation Project',
    quote:
      'Detecting embedded rebar wires, plastic conduit fragments, and lumber within heterogeneous rubble heaps helps prevent contaminated skips from being rejected at municipal recovery yards, saving substantial disposal surcharges.',
    keyBenefit: 'Proactive detection of contaminant fractions and salvage streams',
    metricsLabel: 'Contamination Risk',
    metricsValue: 'Early Flagging',
    avatarBg: 'bg-teal-700',
  },
  {
    id: 'better-informed-decisions',
    theme: 'Better-Informed Recycling Decisions',
    role: 'Recycling Facility Yard Manager',
    sector: 'Illustrative Scenario: Circular Aggregate Processing Facility',
    quote:
      'Visual material intelligence allows us to quickly assess incoming truckloads before dumping. We can direct high-purity concrete rubble to the primary impact crusher while routing mixed debris to mechanical pre-screening lines.',
    keyBenefit: 'Optimized sorting bay assignment and crusher protection',
    metricsLabel: 'Secondary Reuse Potential',
    metricsValue: 'Optimized Routing',
    avatarBg: 'bg-amber-700',
  },
  {
    id: 'structured-reporting',
    theme: 'Structured Material Recovery Reporting',
    role: 'Sustainability & ESG Coordinator',
    sector: 'Illustrative Scenario: Green Building Contractor',
    quote:
      'Having timestamped photo records paired with exportable CSV composition logs provides transparent documentation for project stakeholders and green building documentation without manual tally sheets.',
    keyBenefit: 'Digital photographic chain of custody with structured data exports',
    metricsLabel: 'Documentation Format',
    metricsValue: 'Audit-Ready CSV',
    avatarBg: 'bg-indigo-700',
  },
];
