# Local Garden Weather Reporter

## Context

* **Origin** Developed as a helper that pulls data from SMHI pmp3g forecast model and reworks it into a localized weather report.
* **Objective** To be integrated in a garden-analysis system in the future.
* **Status** 🟢 Complete/Functional

---

## Systems Architechture

* **Logic** Functional
* **Tech Stack** Typescript + Node.js
* **AI-Layer** Llama3.1 (via Ollama)

---

## Functionality

* Pulls data from SMHI pmp3g forecast model API
* Transforms the time series-organized data into defined "windows":
  - Immediate (0-24h)
  - Short-term (24-48h)
  - Mid-term (3-6d)
  - Long-term (10d)
* Calculates per window:
  - Precipitation volume
  - Min/max temperatures
  - Mean wind & humidity
* Injects a "frost risk level" for each window

---

## Setup & Usage

1. Clone the repository
2. Open in IDE of your choice
3. Terminal: 'npx tsx src/index.ts'

---

## Learning Outcomes

* Typescript syntax
* SMHI pmp3g API fetching
* Functinal architechture setup & execution
* Safely passing and manipulating 'any'-types during ingestion of external JSON payloads
