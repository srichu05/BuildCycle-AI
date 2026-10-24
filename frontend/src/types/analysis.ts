export interface BoundingBox {
  x: number; // percentage (0-100) or pixel
  y: number;
  width: number;
  height: number;
}

export interface DetectionItem {
  id: string;
  label: string;
  confidence: number; // e.g. 0.94
  bbox: [number, number, number, number]; // [x_min, y_min, x_max, y_max] in percentages (0-100)
  material_class: 'concrete' | 'rebar_steel' | 'brick' | 'timber' | 'plastic_pvc' | 'mixed_debris';
  color: string;
}

export interface CompositionItem {
  material: string;
  percentage: number;
  estimated_visible_area: string;
  color: string;
  badge: string;
}

export interface RecoveryRecommendation {
  id: string;
  material: string;
  pathway: string;
  action: string;
  target_industry: string;
  environmental_benefit: string;
  recovery_grade: 'A' | 'B' | 'C';
}

export interface AnalysisResult {
  analysis_id: string;
  status: 'completed' | 'processing' | 'failed';
  image_dimensions: {
    width: number;
    height: number;
  };
  model_information: {
    model_name: string;
    version: string;
    inference_device?: string;
  };
  summary: string;
  material_counts: Record<string, number>;
  detections: DetectionItem[];
  composition: CompositionItem[];
  recommendations: RecoveryRecommendation[];
  annotated_image?: string;
  inference_time_ms: number;
  created_at: string;
  is_mock_demo?: boolean;
}

export type AnalysisMode = 'demo' | 'live';

export interface AnalysisHistoryItem {
  analysis_id: string;
  created_at: string;
  original_filename: string;
  total_detections: number;
  model_name: string;
}

export interface AnalysisHistoryResponse {
  items: AnalysisHistoryItem[];
  limit: number;
  offset: number;
  total: number;
}
