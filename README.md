# Lodestar Lab website

The public site for Lodestar Lab, MiCreate's volunteer tech lab. It covers the lab's two tracks (AI agent automation and ML research for trafficking prevention), every planned project, the research agenda and how to contribute.

Static HTML, CSS and JavaScript with no build step, deployed with GitHub Pages. Colors and type follow micreate.org (Rubik and Karla, coral, teal and slate).

## Pages

| Page | What's on it |
|---|---|
| `index.html` | Interactive project map, the two tracks, how we work, ways to get involved |
| `agents.html` | Simulated agent runs you can approve or send back, agent structure, guardrails, agent projects |
| `research.html` | Research questions, planned datasets with record previews, evaluation steps, release check, publications, collaboration |
| `projects.html` | Filterable project table with details. Link to a project with `projects.html#B1` |
| `about.html` | Why the lab exists, principles, roadmap, impact, roles, pseudonym generator |

## Deploy

1. Create the repository `MiCreateInc/mcr-lodestar` and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. In **Settings → General → Features**, turn on **Discussions**. The site's "Start a discussion" and "Introduce yourself" buttons link there.
4. The workflow in `.github/workflows/pages.yml` deploys on every push to `main` once the repository is public. While it is private the deploy job is skipped, because GitHub Free can't publish Pages from a private repository. The site will be at https://micreateinc.github.io/mcr-lodestar/

Project repositories use the `lodestar-` prefix (for example `MiCreateInc/lodestar-resource-finder`). Project links on the site work once those repositories exist.

## Edit content

All content lives in `assets/data.js`, and every page reads from it:

| Key | What it controls |
|---|---|
| `CONFIG` | GitHub organization, the lab's home repository and the MiCreate link |
| `PROJECTS` | Projects in the table, home map and track lists. `x`/`y` place the star on the 680 × 520 map |
| `AGENT_RUNS` | Steps and permissions of the simulated agent runs |
| `RESEARCH_QUESTIONS`, `DATASETS`, `PUBLICATIONS` | The research page |
| `STEPS`, `QUESTIONS` | Evaluation steps and the release check |
| `ROAD`, `PRINCIPLES`, `METRICS`, `ROLES`, `STAR_NAMES` | The about page |

Page layout is in the `.html` files, styles in `assets/style.css`, behavior in `assets/site.js`.

## Preview locally

Run `python3 -m http.server` in this folder and visit http://localhost:8000.
