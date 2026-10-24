export interface ProcessStep {
  stepNumber: string;
  title: string;
  description: string;
  iconName: string;
  details: string;
}

export const processSteps: ProcessStep[] = [
  {
    stepNumber: '01',
    title: 'Upload a Construction Image',
    description:
      'Capture or drop an on-site photograph of construction rubble, demolition skips, stockpiles, or sorting conveyor belts from mobile or desktop.',
    iconName: 'UploadCloud',
    details: 'Supports high-res JPG, PNG, and WebP images up to 15MB with automatic orientation and EXIF handling.',
  },
  {
    stepNumber: '02',
    title: 'Detect and Identify Materials',
    description:
      'Our fine-tuned vision models scan the image for discrete rubble fragments, recognizing concrete, rebar steel, bricks, timber, and plastics.',
    iconName: 'ScanLine',
    details: 'Runs high-confidence localized detection with bounding box coordinates and class probability scoring.',
  },
  {
    stepNumber: '03',
    title: 'Analyze Visible Composition',
    description:
      'The platform calculates visible surface area coverage and item frequency distributions across all recognized construction fractions.',
    iconName: 'PieChart',
    details: 'Generates clear proportional metrics of visible debris to guide segregation and sorting priorities.',
  },
  {
    stepNumber: '04',
    title: 'Explore Recovery Recommendations',
    description:
      'Access actionable circular pathways tailored to the detected materials—from mobile sub-base crushing to architectural wood salvage.',
    iconName: 'Lightbulb',
    details: 'Provides concrete commercial processing steps and circular market applications for each material stream.',
  },
  {
    stepNumber: '05',
    title: 'Export the Analysis Report',
    description:
      'Download audit-ready summary data in CSV format or print visual reports for site sustainability logs, haulers, and environmental compliance.',
    iconName: 'Download',
    details: 'Includes timestamped photo verification, bounding box classifications, and carbon mitigation estimates.',
  },
];
