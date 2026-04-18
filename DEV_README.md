# VelocityOS - Developer Guide

This guide details the newly added Autonomous Agent Core capabilities, which wrap the existing Express backend in an Electron desktop shell.

## Architecture Additions

- **Electron Core** (`src-electron/main.js`): Spawns the Express server as a background process and renders the UI in a browser window.
- **License Enforcement** (`src-electron/licenseManager.js`): Generates machine fingerprints and verifies JWT-based licenses to enforce a 1-machine policy.
- **LLM Router** (`src-electron/llmRouter.js`): Dynamically routes requests between OpenAI, Anthropic, and local Ollama based on cost/latency logic.
- **Self-Healing** (`src-electron/selfHealing.js`): Monitors the Express server health and implements exponential backoff restarts.
- **Self-Improving** (`src-electron/selfImproving.js`): Records metrics and uses basic optimization to tweak concurrency and delay parameters.

## Building the Installer

To package the application into a saleable zip file (Zero-touch installer):

```bash
# 1. Install dependencies
npm install

# 2. Run the build command (uses electron-builder)
npm run dist
```

This will produce the final installer inside the `dist/` folder, configured to create desktop shortcuts and install without admin prompts.

## Development

To run the application locally without packaging:

```bash
npm start
```
