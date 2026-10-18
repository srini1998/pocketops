# PocketOps

A standalone phone control panel for a local laptop task runner. This project is independent of Neon Expedition.

## Start the real laptop runner

Requires Node.js 20 or newer. No package installation is needed to run the downloaded kit.

```bash
node runner.mjs
```

Open the localhost pairing link printed by the terminal on your laptop. Go to Devices and scan the QR code on your phone. Both devices must be on the same trusted network; a personal hotspot can help if venue Wi-Fi blocks connections. The terminal must remain open. Stop the runner with Ctrl+C. Restarting invalidates previous pairing links.

To use a different trusted project:

```bash
node runner.mjs --workspace /absolute/path/to/project
```

The phone app is served directly by this runner. Pairing links contain a session token in the URL fragment. API calls require that token. Use trusted networks: local HTTP does not encrypt traffic. The hosted app is a separate, clearly labeled browser sandbox and cannot reach the laptop on its own. An Internet relay is not included.

## Registered tasks

* Inspect a workspace: list file names, sizes, extensions, and Node test files.
* Check syntax: run `node --check` on up to 30 JavaScript files.
* Run tests: review and approve `node --test` on up to 20 existing Node test files.
* Propose a pricing fix: review the known percentage calculation patch in `src/pricing.mjs`, approve it, and rerun tests.

Test execution and file writes require explicit approval in the app. Hidden folders, dependency directories, and symbolic links are skipped. Paths are restricted to the chosen workspace. Before applying a patch, the runner checks that the original file has not changed. The repair task supports the included sample bug; it is not a general coding agent. The runner does not accept arbitrary shell commands. Project tests execute code with the runner’s OS permissions and are not an OS sandbox. Use a project you trust.

Tasks, results, and events are written to `.pocketops/state.json` locally for inspection. The current live task session begins fresh when the runner starts.

## Optional local AI routing

If Ollama is already running with an installed model, set `OLLAMA_MODEL` to its name before launching:

```bash
OLLAMA_MODEL=your-installed-model node runner.mjs
```

The model can choose only one of the four registered actions. It cannot supply shell commands, paths, or patches. The same approval rules apply. If the model is unavailable, the app labels its fallback task router. The default task router is deterministic and does not use an LLM. No cloud model API is required.

## Browser sandbox

The hosted preview runs a sample workspace in browser memory. Its four arithmetic assertions actually fail before the sample fix and pass after approval. It does not execute Node processes or edit laptop files. Reload or use Reset sample to start again.

## Build and verify source

```bash
npm install
npm run build
npm test
```

Building packages the local runner download and the hosted static preview. Integration checks verify pairing authorization, real Node tests, approval before edits, rejection, stale patch detection, path boundaries, and syntax checks.

## A 90 second demo

1. Start `node runner.mjs` on the laptop and pair your phone.
2. From the phone, inspect the sample project.
3. Run tests, approve execution, and show the failure.
4. Propose the pricing fix, review the before and after, and approve it.
5. Show the passing tests and the matching activity log on both devices.

QR rendering uses qrcode-generator by Kazuhiko Arase, included under the MIT license in the vendored source.

## Engineering review
See docs/review.md for corrected behavior, actual verification, scope and limitations.

## Public browser sandbox

https://pocketops-lab.vercel.app — inspect the sample files, review the pricing patch, approve it and run actual arithmetic checks in your browser. The browser task router is deterministic, not a trained general coding model. Real workspace actions use the downloadable local runner; optional Ollama routing stays local. The public host does not gain access to a visitor’s laptop. Existing owner-private Sites preview is unchanged.
