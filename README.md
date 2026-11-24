# SII · Self-Improvement Intelligence

A browser-first, GitHub Pages-ready prototype of a collaborative multi-agent assistant. It demonstrates a proposed flow: four specialist drafts → two synthesis passes → a final answer, with local feedback helpers.

## Try it

Open `index.html`, or enable GitHub Pages for the repository (deploy from the branch's root). No build step, server, API key, or dependency installation is required. All app logic runs in the browser.

## Important: what this prototype is (and is not)

This repository currently contains a static UI and deterministic JavaScript templates. It does **not** contain custom PyTorch models, model weights, actual independent AI agents, Gemini integration, or model training. The “mini-agents” shown in the demo are local feedback templates, not Gemini calls. The interface is an honest, deployable starting point—not a production AI system.

A static GitHub Pages site cannot safely keep a Gemini API key secret or run conventional Python/PyTorch inference. To connect real models, use a separately hosted backend (never put private API keys in browser code) or investigate a browser inference runtime and compatible exported weights. A practical production design would make agent roles and backend calls explicit, add timeouts/failure handling, validate output, and require human review before accepting generated training examples.

## Data and learning

The app includes three tiny, hand-written starter examples/patterns in `app.js`. User feedback is stored in browser `localStorage` only, capped at 100 records, and can be exported or deleted in the data dialog. Feedback does not change model weights and should be reviewed before any future training use. Clearing browser storage/site data also removes it.

The intended future dataset is [HuggingFaceTB/smoltalk on Hugging Face](https://huggingface.co/datasets/HuggingFaceTB/smoltalk). The dataset is **not downloaded or bundled** here; review its current card, license, terms, and format before using it. A future data pipeline should fetch and preprocess it outside the static frontend, document provenance and filtering, and avoid treating user feedback or generated suggestions as automatically correct labels.

## Files

- `index.html` — accessible app structure and explanatory data dialog
- `styles.css` — responsive dark interface
- `app.js` — local-only demo pipeline, starter patterns, feedback export/reset
