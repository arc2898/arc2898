# Profile site maintenance

- Public GitHub profile and repository metadata load from the GitHub REST API in the browser.
- The scheduled workflow writes a weekly public-metrics snapshot to `data/weekly.json` every Monday at 01:17 UTC (06:47 India time). It can also be run manually from Actions.
- Add project images under `assets/screenshots/` using the matching `.webp` paths shown in the visual frames. The current slots are `upm.webp`, `selfhost-dashboard.webp`, `winisland.webp`, `termimg.webp`, `android.webp`, `windows.webp`, `refind-gui.webp`, and `sharexf.webp`.
- For GitHub Pages, select **Settings → Pages → Build and deployment → GitHub Actions** once. The deployment workflow handles subsequent site releases.