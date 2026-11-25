# Strokes Gained – project handover

Start a new chat with: "Read HANDOVER.md and README.md in my Strokes Gained App folder, then let's keep going."

## What it is
A strokes gained app for everyday golfers: log a round in about 10 seconds a hole, see where shots are gained and lost in plain golfer terms, and what to work on to reach a goal handicap. First users: Harry and his mates. Long term: a product for the masses that is simpler and cheaper than specialist SG programs.

## Where things live
| Thing | Where |
|---|---|
| Web app (the live code) | `docs/` in this folder, and the `strokes-gained` GitHub repo |
| Database setup | `supabase/schema.sql` (new Supabase project, same account as the NFL tipping app) |
| Setup steps | `README.md` |
| Hosting | GitHub Pages now (public repo, publishes `/docs`); move to Netlify later when more polished |
| Claude version of the app (prototype, has the AI features) | https://claude.ai/artifact/9E3qroJYe9EcSF5NayARmW |
| Design mockups (chosen look: "A · Scorecard") | https://claude.ai/artifact/B1e5bWDsXgWFGjEVjynFow |
| Lesson video, iPhone portrait | https://claude.ai/artifact/YMVSvQpgDAYigq4TFHDe8W |
| Lesson video, landscape pilot | https://claude.ai/artifact/NY9BZoBf18UMqbRNuxRAgR |
| Prototype source for reference | `reference/claude-artifact-version.html` |

## How strokes gained is worked out
- Shots between checkpoints cancel out, so each hole only needs: score, where the tee shot finished (lie + distance), the first chip/pitch/bunker shot within 30 m (if any), number of putts and first-putt length, plus penalties.
- Categories: Driving (tee shots on par 4/5), Approach, Short game (within 30 m, off the green), Putting.
- Tour baseline: published PGA Tour expected-strokes tables (in `docs/engine.js`).
- Handicap baselines: an early estimate scaled from the tour tables by handicap, sliding smoothly so 8.3 vs 9.2 differ slightly. To be replaced with researched amateur data.

## Decisions made
- Entry: tap distance ranges by default, exact numbers any time, talk-through after the round (Claude only). Smart entry assumes 2 putts and scrolls on.
- Units: metres or yards for full shots, metres or feet for putts, all in Settings. Everything is stored in metres.
- Look: light, clean "Scorecard" style, white cards on soft grey, deep fairway green (#0E3B2C), gains green (#17804A), losses red (#C2402F), small yellow flag accent (#E6B422), Inter Tight + Inter. No AI-looking tropes.
- Language: golfer terms ("Gaining 1.9", "Losing 2.3"), a "What does this mean?" explanation on numbers.
- No "check before saving" prompt (it plants doubt): a positive Round complete screen instead, and only flag holes that can't add up.
- Sign-in: email + password. Each golfer's rounds are private; sharing to the Mates leaderboard is opt-in.
- Claude features (talk-through, photo "where should I miss?" caddie) are off in the web app to avoid per-use API costs. Turning them on later needs a Netlify function holding an Anthropic API key, with a daily cap per person.
- Usage: batch changes; preview in Claude first, then upload to GitHub.

## Built in the web app
Home (averages, Path to goal needle movers), hole-by-hole entry, round results + share card, Stats (progress charts, the usual stats, hole-by-hole history, tee club table), Mates (leaderboard, best driver/iron/short game/putter, round of the week vs own handicap), Learn (lesson links), Settings (handicap, goal, units, entry style, smart entry, club tracking, account). Works offline; syncs to Supabase.

## Designed but not yet built into the web app
On the design canvas: one-focus Home card, "What does this mean?" sheet, Round complete screen, Analysis (blow-up holes, par 3/4/5 averages, front/back 9, bounce-back), interactive what-if planner, putting make % and approach shots by distance, "Where should you miss?" interactive hole.

## Parked / later
- Researched amateur handicap benchmark data.
- Course database (pars, lengths, hazard positions), built alongside the benchmark data.
- Learn library: SG and smart-golf videos, technique and shot selection, many example-hole lessons, working toward animated narrated hole flyovers.
- Photo caddie and talk-through back on (API key + Netlify function).
- Native iPhone app (React Native/Expo, TestFlight) once the web app is proven.
- Optional own domain so moving hosts never changes the address.
