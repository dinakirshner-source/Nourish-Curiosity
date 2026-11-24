# Nourish Curiosity
A self-directed, 12-week intellectual residency in Copenhagen: four disciplines × three weekly seminar modules. React + Vite, no backend, no login. Progress autosaves to your browser's localStorage; use **Backup / Restore** (header) for JSON export/import.

## Run locally
    npm install
    npm run dev

## Publish to GitHub Pages
1. Create a GitHub repo and push this folder to the `main` branch.
2. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`; `.github/workflows/deploy.yml` builds and deploys. Site appears at `https://<user>.github.io/<repo>/`.
(`base: './'` in vite.config.js makes it work under any repo name.)

## Edit content
All curriculum lives in `src/curriculum.js`. Each module feeds six worksheet sections: Core/Context, Supporting Evidence, Application, Prompt/Inquiry, Activity, Assignment/Create.
