# Preview run doc — Khelo Indore (frontend-website)

## Reproduce uncommitted artifacts
- No `.env` / `.env.local` files are required for `frontend-website`. The API base URL is
  hardcoded in `src/ApiUrl.js` (`API_URL = "https://qa.kheloindore.in/api"`,
  `IMG_URL = "https://qa.kheloindore.in"`) and the Google Maps key lives in the same file.
  Nothing needs to be copied from the main checkout.
- Dependencies: `npm install` in `frontend-website/` (package manager is npm; `node_modules`
  already present in this checkout).
- The backend (`backend/`) is a separate Express server (normally port 3001, run by the user)
  and is NOT required for the frontend preview — the site talks to the QA API remotely.

## Run the dev server
```
cd frontend-website && npm start
```
- `react-scripts start` (CRA), default port **3000**. If 3000 is taken, CRA auto-increments
  to 3001 — set `PORT=<n>` explicitly to pin it.
- Wait for HTTP 200 on `http://localhost:3000` before registering the preview.
- Log: `.freebuff/preview-a32942ea-0e16-42f7-a125-844ea202ac5a.log`
