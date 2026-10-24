export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  iconName: string;
  circularTag: string;
  bulletPoints: string[];
}

export const servicesData: ServiceItem[] = [
  {
    id: 'concrete-waste-analysis',
    title: 'Concrete Waste Analysis',
    subtitle: 'Crushed Rock & Slab Identification',
    description:
      'Detects structural concrete chunks, foundation slabs, and precast elements to evaluate suitability for crushed sub-base and structural backfill.',
    image: '/assets/images/concrete.jpg',
    iconName: 'Building2',
    circularTag: 'Type 1 Sub-base Aggregates',
    bulletPoints: [
      'Identifies visible aggregate size grading',
      'Detects surface contamination & mortar adherence',
      'Calculates estimated visible volume for mobile crushing',
    ],
  },
  {
    id: 'brick-recovery-intelligence',
    title: 'Brick Recovery Intelligence',
    subtitle: 'Masonry & Terracotta Salvage',
    description:
      'Identifies intact architectural bricks and crushed terracotta masonry to streamline sorting between high-value facing brick salvage and ground fill.',
    image: '/assets/images/bricks.jpg',
    iconName: 'Layers',
    circularTag: 'Architectural Facing Salvage',
    bulletPoints: [
      'Distinguishes whole bricks from rubble fragments',
      'Identifies antique and clay terracotta compositions',
      'Recommends palleting vs aggregate crushing',
    ],
  },
  {
    id: 'timber-reuse-identification',
    title: 'Timber Reuse Identification',
    subtitle: 'Lumber & Formwork Recovery',
    description:
      'Scans demolition waste for salvageable structural lumber, formwork plywood, joists, and clean wooden off-cuts prior to shredding or disposal.',
    image: '/assets/images/timber.jpg',
    iconName: 'Trees',
    circularTag: 'Biogenic Carbon Retention',
    bulletPoints: [
      'Locates dimensional lumber (2x4, 4x8 beams)',
      'Identifies non-treated vs pressure-treated wood',
      'Routes to reclamation yards or biomass pelleting',
    ],
  },
  {
    id: 'metal-steel-recovery',
    title: 'Metal & Steel Recovery',
    subtitle: 'Ferrous Rebar & Non-Ferrous Sorting',
    description:
      'Flags exposed steel reinforcement rebar, corrugated metal sheets, copper plumbing, and conduit wires for high-yield secondary scrap smelting.',
    image: '/assets/images/metals.jpg',
    iconName: 'Wrench',
    circularTag: 'High-Value Scrap Stream',
    bulletPoints: [
      'Pinpoints rebar mesh within crushed concrete',
      'Separates ferrous iron from aluminum and copper',
      'Estimates direct scrap yard commercial value',
    ],
  },
  {
    id: 'plastic-waste-identification',
    title: 'Plastic Waste Identification',
    subtitle: 'PVC, HDPE & Membrane Sorting',
    description:
      'Isolates construction polymers including rigid PVC pipes, electrical conduits, polyethylene protective films, and vapor barrier sheeting.',
    image: '/assets/images/plastics.jpg',
    iconName: 'Package',
    circularTag: 'Polymer Regrind Pathways',
    bulletPoints: [
      'Detects clean vs contaminated packaging polymers',
      'Categorizes rigid pipes vs flexible sheeting',
      'Connects with industrial chemical recyclers',
    ],
  },
  {
    id: 'mixed-debris-analysis',
    title: 'Mixed Construction Debris Analysis',
    subtitle: 'Multi-Fraction Demolition Sorting',
    description:
      'Analyzes heterogeneous piles of mixed job-site debris to quantify material breakdown, alerting haulers to optimal segregation steps.',
    image: '/assets/images/mixed.jpg',
    iconName: 'Shuffle',
    circularTag: 'Segregation Optimization',
    bulletPoints: [
      'Multi-class visual segmentation across 6+ materials',
      'Identifies high contamination risk items early',
      'Directs loaders to appropriate separation bays',
    ],
  },
  {
    id: 'material-composition-reporting',
    title: 'Material Composition Reporting',
    subtitle: 'Audit-Ready Circular Intelligence',
    description:
      'Generates verifiable digital reports detailing visible surface area percentages, class counts, and chain-of-custody documentation for green certifications.',
    image: '/assets/images/reporting.jpg',
    iconName: 'FileSpreadsheet',
    circularTag: 'LEED & BREEAM Compliance',
    bulletPoints: [
      'Surface area % distribution breakdowns',
      'Exportable CSV and PDF summary data',
      'Auditable digital photo evidence with timestamps',
    ],
  },
  {
    id: 'recycling-pathway-recommendations',
    title: 'Recycling Pathway Recommendations',
    subtitle: 'Destination & Market Matching',
    description:
      'Maps recognized material categories to nearby verified recycling facilities, secondary processors, and civil engineering infrastructure projects.',
    image: '/assets/images/roadbase.jpg',
    iconName: 'Route',
    circularTag: 'Circular Destination Matching',
    bulletPoints: [
      'Direct link to local aggregate recyclers and mills',
      'Reduces haulage distance and logistics carbon',
      'Maximizes gate fee avoidance and salvage rebates',
    ],
  },
];
