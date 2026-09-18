# Grad Notes

Public study notes for my master's degree, built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) and hosted on GitHub Pages.

## Setup (first time only)

### 1. Fork or clone this repository

```bash
git clone https://github.com/YOUR-USERNAME/grad-notes.git
cd grad-notes
npm install
```

### 2. Update `astro.config.mjs`

Replace `YOUR-USERNAME` in the two places it appears:

```js
site: 'https://YOUR-USERNAME.github.io',
// and
github: 'https://github.com/YOUR-USERNAME/grad-notes',
```

### 3. Enable GitHub Pages

In your repository on GitHub:
1. Go to **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

That's it. The next `git push` to `main` will trigger the deploy.

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:4321 to see the site.

---

## Adding a new week

1. Copy `src/content/docs/embedded-systems/_template.md`
2. Rename it to `week-XX.md`
3. Fill in the frontmatter (`title`, `description`)
4. Write your notes in Markdown
5. `git add . && git commit -m "add week XX notes" && git push`

The site updates in ~1 minute.

---

## Adding a new course

1. Create a new folder: `src/content/docs/your-course-name/`
2. Add an `index.md` as the course overview
3. Add weekly notes: `week-01.md`, `week-02.md`, …
4. Add the course to the sidebar in `astro.config.mjs`:

```js
{
  label: 'Your Course Name',
  autogenerate: { directory: 'your-course-name' },
}
```

---

## Project structure

```
grad-notes/
├── .github/workflows/deploy.yml   ← automated deploy
├── src/
│   ├── assets/                    ← logo SVGs
│   ├── styles/custom.css          ← theme customization
│   └── content/docs/
│       ├── getting-started/       ← about & conventions
│       └── embedded-systems/      ← one folder per course
│           ├── index.md           ← course overview
│           ├── week-01.md
│           ├── week-02.md
│           └── _template.md       ← copy this for new weeks
└── astro.config.mjs               ← site title, sidebar, colors
```
