PICK v0.3 — Public PICK Feed

IMPORTANT ORDER:
1. Apply the included Supabase migration first.
2. Overwrite the matching app files.
3. Commit and push.
4. Let Render deploy.
5. Create a new PICK with “Let people discover this PICK” checked to populate the feed.

New:
- app/PublicFeed.tsx
- supabase/migrations/20260923200000_pick_public_feed.sql

Changed:
- app/page.tsx
- app/create/page.tsx
- app/globals.css

Behavior:
- Homepage becomes an interactive public PICK feed.
- Anonymous visitors can vote directly in feed cards.
- Blind Pick remains: results appear only after that visitor votes.
- Creators explicitly opt a PICK into public browsing.
- Link-only is the default.
- is_featured is reserved for future PICK/editorial selection.
