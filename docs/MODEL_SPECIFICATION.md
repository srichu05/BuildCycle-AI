# Model Specification

## Objective
Detect construction and demolition waste materials in a user-uploaded image and provide bounding-box coordinates and class confidence.

## Candidate source
The user is downloading CODD from Mendeley Data: https://data.mendeley.com/datasets/wds85kt64j/1
CODD is a dataset; do not assume it includes pretrained model weights. Inspect the archive's README, annotation format, class names and license once downloaded.

Another candidate is the published construction-waste YOLOv11 dataset/model at https://zenodo.org/records/17447590. Verify exact filenames, class names, task type and license before use.

## Model integration requirements
- `MODEL_PATH` is configurable.
- Load weights once per process at application startup/lifespan or lazy-load once safely.
- Read class names from the loaded model metadata.
- Report the real model task (`detect` vs `segment`).
- Do not assume the sample five classes match CODD's categories.
- Do not rename classes without a documented explicit mapping.
- Set confidence and IoU thresholds through environment configuration.
- Fail clearly if weights are missing or incompatible; do not silently return fake detections.
- Inference output must be normalized to the API contract.
- Keep inference calls from blocking the event loop; use a synchronous route or threadpool as appropriate.

## Detection versus segmentation
A detection model returns bounding boxes. A segmentation model returns masks. Only calculate true pixel-area composition if masks are available and correctly mapped. The MVP can calculate bounding-box coverage and must label it as such.

## Evaluation
For hackathon MVP, use a small manual smoke set (at least 3 images if available). Record whether inference runs, whether classes are plausible, and latency. Do not claim a formal accuracy figure unless measured against held-out ground-truth annotations using appropriate metrics.

## License
Before publishing or commercially deploying weights/datasets, verify their license and attribution requirements. Do not assume the dataset license automatically grants rights to the pretrained model weights.
