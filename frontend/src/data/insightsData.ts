export interface InsightArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  image: string;
  content: string[];
  keyTakeaways: string[];
}

export const insightsData: InsightArticle[] = [
  {
    id: 'why-construction-waste-segregation-matters',
    title: 'Why Construction Waste Segregation Matters',
    category: 'Best Practices',
    readTime: '4 min read',
    date: 'March 2025',
    image: '/assets/images/mixed.jpg',
    excerpt:
      'Sorting demolition waste at the source prevents cross-contamination, preserves aggregate purity, and significantly cuts tipping fees at landfills.',
    keyTakeaways: [
      'Segregated concrete achieves up to 95% secondary reuse in road sub-bases.',
      'Mixed skips incur up to 40% higher tipping fees due to mechanical sorting overhead.',
      'Clean timber separation prevents wood rot and chemical contamination in aggregate lines.',
    ],
    content: [
      'The construction and demolition (C&D) sector represents over a third of total solid waste produced globally. When debris is dumped indiscriminately into combined skips, materials that could easily find a second life—such as clean masonry, reusable framing lumber, and structural steel—become intermingled with plastics, gypsum, and hazardous residues.',
      'Source segregation transforms waste from a disposal liability into a valuable operational asset. By organizing dedicated containment bays or sorting zones on active job sites, contractors preserve the high intrinsic strength of mineral rubble, allowing local recyclers to produce certified aggregate without expensive decontamination cycles.',
      'Modern site managers who implement early photographic inspection and digital classification protocols report smoother handoffs to material recovery facilities and substantial reductions in overall hauling logistics.',
    ],
  },
  {
    id: 'concrete-recovery-circular-economy',
    title: 'Concrete Recovery and the Circular Economy',
    category: 'Circular Engineering',
    readTime: '5 min read',
    date: 'February 2025',
    image: '/assets/images/concrete.jpg',
    excerpt:
      'How on-site crushing and graded recycled aggregate are revolutionizing civil infrastructure, reducing reliance on quarried natural stone.',
    keyTakeaways: [
      'Recycled Concrete Aggregate (RCA) meets ASTM and EN standards for non-structural fill.',
      'Mobile crushers on demolition projects eliminate thousands of truck miles.',
      'Carbonation of crushed concrete absorbs atmospheric CO2 throughout its secondary lifecycle.',
    ],
    content: [
      'Concrete is the most consumed synthetic material on earth. When structures reach end-of-life, demolishing and crushing the concrete produces Recycled Concrete Aggregate (RCA). Historically relegated to low-grade landfill cover, high-grade RCA is now actively specified for highway sub-bases, parking facilities, and permeable civil pavements.',
      'The environmental calculus is compelling: utilizing one ton of recycled crushed concrete saves approximately one ton of virgin quarry rock from being blasted and hauled, while dramatically reducing heavy transport emissions.',
      'Furthermore, fine aggregate fractions and broken surfaces actively undergo enhanced atmospheric carbonation, re-absorbing a portion of the calcination emissions generated during original cement manufacture.',
    ],
  },
  {
    id: 'improving-material-reuse-construction-sites',
    title: 'Improving Material Reuse on Construction Sites',
    category: 'Site Operations',
    readTime: '4 min read',
    date: 'January 2025',
    image: '/assets/images/timber.jpg',
    excerpt:
      'Practical workflows for salvaging dimensional lumber, intact architectural bricks, and metal elements before heavy demolition begins.',
    keyTakeaways: [
      'Pre-demolition audits identify up to 25% salvageable materials by value.',
      'Hand-salvaged architectural brick commands premium prices in restoration projects.',
      'Structural timber reuse preserves biogenic carbon and avoids energy-intensive virgin milling.',
    ],
    content: [
      'True circularity begins before the wrecking ball or high-reach excavator touches the facade. Deconstruction—the systematic disassembly of building components—prioritizes the preservation of intact items such as timber rafters, hardwood flooring, copper piping, and heritage facing bricks.',
      'Contractors who establish clear sorting protocols and train operators to recognize reusable lumber prevent high-grade timber from being down-cycled into low-value mulch. Intact bricks can be chemically cleaned and re-laid, preserving historical architectural character while cutting embodied carbon to near zero.',
      'Digital inventory tools and computer vision platforms allow project teams to quickly inventory visible materials and notify salvage brokers before materials reach the ground.',
    ],
  },
  {
    id: 'how-computer-vision-supports-waste-management',
    title: 'How Computer Vision Can Support Waste Management',
    category: 'AI & Technology',
    readTime: '6 min read',
    date: 'December 2024',
    image: '/assets/images/facility.jpg',
    excerpt:
      'Leveraging deep learning object detection to quantify demolition debris, identify contamination risks, and automate sorting recommendations.',
    keyTakeaways: [
      'Object detection models identify discrete material boundaries in complex rubble heaps.',
      'Automated visual analysis provides objective baseline data for sustainability certifications.',
      'AI assists human operators by highlighting hazardous or high-value materials in real-time.',
    ],
    content: [
      'Traditional waste auditing on construction sites relies heavily on manual visual estimation or post-disposal weight tickets—providing data only after the materials have already left the site. Computer vision introduces immediate, accessible intelligence at the point of generation.',
      'By training deep convolutional networks and YOLO architectures on thousands of real-world construction waste images, BuildCycle AI identifies discrete fragments of concrete, twisted rebar, masonry, and plastics within complex, heterogeneous piles.',
      'While visual analysis cannot calculate exact internal density or chemical purity from photographs alone, it provides site managers with rapid, actionable visibility into surface composition and contamination risks, enabling proactive decision-making before haul trucks depart.',
    ],
  },
];
