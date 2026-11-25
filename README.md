# Strokes Gained

Strokes gained for everyday golfers. A web app you add to your iPhone home screen, hosted on GitHub Pages, with accounts and data in Supabase.

```
docs/                the app itself (GitHub Pages publishes this folder)
  index.html, app.js, engine.js, style.css
  config.js          your Supabase URL and anon key go here
  manifest.webmanifest, sw.js, icons/   home-screen app + offline support
supabase/schema.sql  run once in Supabase to create the tables and security rules
```

## Setup (about 20 minutes, once)

### 1. Supabase (accounts and data)
1. supabase.com > your existing account > **New project**. Name it `strokes-gained`, region **Sydney**, set a database password and save it.
2. **SQL Editor > New query**: paste all of `supabase/schema.sql`, press **Run**.
3. **Authentication > Sign In / Providers > Email**: keep Email on and turn **Confirm email** off (fine for a small group; turn it back on before going public).
4. **Project Settings > API**: copy the **Project URL** and the **anon public** key into `docs/config.js` (open it in Notepad).

### 2. GitHub (code + hosting)
1. github.com > **New repository** > name `strokes-gained` > **Public** > Create.
2. On the empty repo: **uploading an existing file** > drag in the `docs` and `supabase` folders and `README.md` > **Commit changes**.
3. Repo **Settings > Pages** > Source: **Deploy from a branch** > Branch: `main`, folder: `/docs` > **Save**.
4. After a minute the page shows your address, like `https://yourname.github.io/strokes-gained/`.
5. Back in Supabase > **Authentication > URL Configuration**: set **Site URL** to that address.

### 3. On your iPhone
Open the address in **Safari** > Share > **Add to Home Screen**. Sign up with your name, email and a password.

### Making changes later
Edit or replace files in the repo (or upload new versions) and commit. The site updates within a couple of minutes. Fully close and reopen the app on your phone to pick up the new version.

### Moving to Netlify later
In Netlify: Import from GitHub > pick this repo > set the publish directory to `docs`. Then update Supabase's Site URL to the new address.

## Notes
- The anon key in `docs/config.js` is meant to be public. The rules in `schema.sql` make rounds private to their owner; only what someone chooses to share appears on the Mates leaderboard.
- Talk-it-through and the photo caddie are switched off in this version (they need a paid Anthropic API key behind a Netlify function). The code is ready to switch back on later.
- The lesson video in the Learn tab is a Claude link, so only people you share it with in Claude can open it for now.
- Handicap baselines are an early estimate and will be replaced with researched amateur data.
