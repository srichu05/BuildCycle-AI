import type {
  AnalysisResult,
  DetectionItem,
  CompositionItem,
  RecoveryRecommendation,
  AnalysisHistoryResponse,
} from '../types/analysis';
import { sampleAnalysisRubble } from '../data/mockAnalysisData';

// Configurable FastAPI backend base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ApiError {
  message: string;
  isBackendUnavailable?: boolean;
  statusCode?: number;
  details?: string;
}

const MATERIAL_COLORS: Record<string, string> = {
  concrete: '#10b981',
  brick: '#ef4444',
  rebar_steel: '#f59e0b',
  reinforcement_steel: '#f59e0b',
  reinforcement: '#f59e0b',
  timber: '#8b5cf6',
  wood: '#8b5cf6',
  plastic: '#06b6d4',
  plastic_bottle: '#06b6d4',
  plasticbottle: '#06b6d4',
  stone: '#64748b',
  tile: '#f97316',
  pipes: '#3b82f6',
  foam: '#ec4899',
  gypsum_board: '#84cc16',
  general_w: '#94a3b8',
};

function getMaterialColor(rawName: string): string {
  const key = rawName.toLowerCase().replace(/[\s-]+/g, '_');
  return MATERIAL_COLORS[key] || '#6366f1';
}

/**
 * Transform the FastAPI backend response (API_CONTRACT.md)
 * into the AnalysisResult expected by the React UI components.
 */
export function transformBackendResponse(
  raw: any,
  fallbackImageUrl?: string
): AnalysisResult {
  const imgWidth = raw.image?.width || 1280;
  const imgHeight = raw.image?.height || 720;

  // Detections
  const detections: DetectionItem[] = (raw.detections || []).map(
    (d: any, index: number) => {
      const x1 = d.bbox?.x1 ?? 0;
      const y1 = d.bbox?.y1 ?? 0;
      const x2 = d.bbox?.x2 ?? 0;
      const y2 = d.bbox?.y2 ?? 0;

      const xMinPct = Math.max(0, Math.min(100, (x1 / imgWidth) * 100));
      const yMinPct = Math.max(0, Math.min(100, (y1 / imgHeight) * 100));
      const xMaxPct = Math.max(0, Math.min(100, (x2 / imgWidth) * 100));
      const yMaxPct = Math.max(0, Math.min(100, (y2 / imgHeight) * 100));

      return {
        id: `det-${index + 1}`,
        label: `${d.class_name.replace(/_/g, ' ')} ${(d.confidence * 100).toFixed(0)}%`,
        confidence: d.confidence,
        bbox: [xMinPct, yMinPct, xMaxPct, yMaxPct] as [number, number, number, number],
        material_class: d.class_name,
        color: getMaterialColor(d.class_name),
      };
    }
  );

  // Material counts
  const materialCounts: Record<string, number> =
    raw.summary?.material_counts || {};

  // Composition chart items
  const coverageMap: Record<string, number> =
    raw.composition?.coverage_percent_by_class || {};

  const composition: CompositionItem[] = Object.entries(coverageMap).map(
    ([mat, pct]) => {
      const percentage = typeof pct === 'number' ? Number(pct.toFixed(1)) : 0;
      return {
        material: mat.replace(/_/g, ' ').toUpperCase(),
        percentage,
        estimated_visible_area: `${percentage}% estimated surface coverage`,
        color: getMaterialColor(mat),
        badge: percentage > 25 ? 'Dominant Fraction' : 'Secondary Fraction',
      };
    }
  );

  // Recommendations
  const recommendations: RecoveryRecommendation[] = (
    raw.recommendations || []
  ).map((r: any, index: number) => {
    const matKey = (r.material || '').toLowerCase();
    const isGradeA = ['concrete', 'brick', 'reinforcement_steel', 'reinforcement'].includes(matKey);

    return {
      id: `rec-${index + 1}`,
      material: (r.material || 'General Debris').replace(/_/g, ' ').toUpperCase(),
      pathway: r.title || r.pathway || 'Recycling & Diversion',
      action: r.description || 'Segregate and inspect prior to circular reuse.',
      target_industry: 'Aggregate processing & circular building materials',
      environmental_benefit: r.caution ? `Caution: ${r.caution}` : 'Lowers embodied carbon and diverts waste from landfills',
      recovery_grade: isGradeA ? 'A' : 'B',
    };
  });

  // Annotated image (backend returns base64 without data:image/jpeg;base64, prefix)
  let annotatedImage: string | undefined = fallbackImageUrl;
  if (raw.annotated_image_base64) {
    annotatedImage = `data:image/jpeg;base64,${raw.annotated_image_base64}`;
  }

  const dominantMaterial =
    Object.keys(materialCounts).length > 0
      ? Object.entries(materialCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'demolition';

  return {
    analysis_id: raw.analysis_id || `analysis-${Date.now()}`,
    status: (raw.status as any) || 'completed',
    image_dimensions: {
      width: imgWidth,
      height: imgHeight,
    },
    model_information: {
      model_name: raw.model?.name || 'construction-waste-yolo',
      version: raw.model?.version || 'v8l',
      inference_device: 'FastAPI Backend Ultralytics Engine',
    },
    summary: `Live AI Inference: Detected ${raw.summary?.total_objects ?? detections.length} waste fragments with primary ${dominantMaterial} content. Evaluated bounding-box coverage and generated circular recovery pathways.`,
    material_counts: materialCounts,
    detections,
    composition,
    recommendations,
    annotated_image: annotatedImage,
    inference_time_ms: raw.inference_time_ms || 0,
    created_at: raw.created_at || new Date().toISOString(),
    is_mock_demo: false,
  };
}

/**
 * Perform waste analysis either via live FastAPI backend or via interactive client demo.
 */
export async function analyzeWasteImage(
  file: File,
  mode: 'demo' | 'live' = 'demo'
): Promise<AnalysisResult> {
  const localImageUrl = URL.createObjectURL(file);

  if (mode === 'demo') {
    // Simulate real AI processing latency (1.4 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1400));

    return {
      ...sampleAnalysisRubble,
      analysis_id: `demo-${Date.now().toString(36)}`,
      created_at: new Date().toISOString(),
      annotated_image: localImageUrl,
      is_mock_demo: true,
      summary: `Client Demo: Analyzed "${file.name}" (${(file.size / (1024 * 1024)).toFixed(2)} MB). Identified concrete rubble, timber, ferrous rebar, and brick masonry fractions. (Illustrative model prediction).`,
    };
  }

  // Live FastAPI Backend Mode
  const formData = new FormData();
  formData.append('file', file);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout for model inference

    const response = await fetch(`${API_BASE_URL}/api/v1/analyses`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError: { error?: { code?: string; message?: string }; detail?: string; message?: string } = {};
      try {
        parsedError = JSON.parse(errorText);
      } catch {
        // Not JSON
      }

      const errorMessage =
        parsedError.error?.message ||
        parsedError.detail ||
        parsedError.message ||
        `Backend error (${response.status}): ${response.statusText}`;

      throw {
        message: errorMessage,
        statusCode: response.status,
        details: errorText,
      } as ApiError;
    }

    const rawData = await response.json();
    return transformBackendResponse(rawData, localImageUrl);
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string; statusCode?: number; details?: string };
    if (error.name === 'AbortError') {
      throw {
        message: 'Request timed out after 45 seconds. The model might be loading weights on the server.',
        isBackendUnavailable: true,
      } as ApiError;
    }

    // Network connection refused or server offline
    if (
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      !error.statusCode
    ) {
      throw {
        message: `Unable to connect to FastAPI backend at ${API_BASE_URL}.`,
        details:
          'Ensure the FastAPI service is running locally on port 8000 (e.g. `python -m uvicorn app.main:app --reload --port 8000`). You can continue testing using "Interactive Demo Mode".',
        isBackendUnavailable: true,
      } as ApiError;
    }

    throw {
      message: error.message || 'Unknown error occurred during analysis.',
      statusCode: error.statusCode,
      details: error.details,
    } as ApiError;
  }
}

/**
 * Fetch past analysis history from the backend (GET /api/v1/analyses).
 */
export async function fetchAnalysisHistory(
  limit = 20,
  offset = 0
): Promise<AnalysisHistoryResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/analyses?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch history (${response.status}): ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single stored analysis by ID (GET /api/v1/analyses/{id}).
 */
export async function fetchAnalysisById(analysisId: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/api/v1/analyses/${analysisId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch analysis ${analysisId} (${response.status})`);
  }

  const rawData = await response.json();
  return transformBackendResponse(rawData);
}

/**
 * Trigger CSV export download from the backend (GET /api/v1/analyses/{id}/report.csv).
 */
export async function downloadAnalysisCsv(analysisId: string): Promise<void> {
  const url = `${API_BASE_URL}/api/v1/analyses/${analysisId}/report.csv`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CSV export failed (${response.status})`);
  }
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `buildcycle_analysis_${analysisId}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(downloadUrl);
}

/**
 * Health check endpoint for FastAPI backend
 */
export async function checkBackendHealth(): Promise<{
  isOnline: boolean;
  url: string;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE_URL}/api/v1/health/live`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    return {
      isOnline: response.ok,
      url: API_BASE_URL,
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return {
      isOnline: false,
      url: API_BASE_URL,
      error: error.message || 'Connection refused',
    };
  }
}
