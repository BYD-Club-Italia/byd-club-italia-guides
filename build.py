name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

# Force Node.js 24 runtime for JavaScript actions (opts-in early before June 2026 default).
# Needed because actions/upload-pages-artifact and actions/deploy-pages don't yet
# have a release that bundles Node 24. See: https://github.com/actions/deploy-pages/issues/410
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5

      - name: Setup Python
        uses: actions/setup-python@v6
        with:
          python-version: "3.11"
          cache: "pip"

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Build guides
        run: python build.py

      # Upload artifact for Pages only on push to main (not on PR).
      # On PRs the build runs as a validation check — if it fails, merge is
      # blocked; but we don't publish the PR version to the live site.
      - name: Upload artifact for Pages
        if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./docs

  deploy:
    # Deploy only on push to main or manual dispatch, never on PRs.
    if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4