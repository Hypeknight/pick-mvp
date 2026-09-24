PICK v0.6 — PICK Player + Question Factory

No Supabase migration required.

NEW:
lib/pick-machine/questionFactory.ts
V0.6-CSS-APPEND.txt
README-v0.6.txt

REPLACE:
app/PublicFeed.tsx
app/admin/machine/page.tsx
app/page.tsx

CSS: paste V0.6-CSS-APPEND.txt at the BOTTOM of your existing app/globals.css. Do not replace globals.css.

Homepage: one random PICK at a time; Vote or Skip; results then Next; local seen history reduces repeats.
Admin: Generate 12 candidates; every generated item stays draft until Approve & publish or Deny.
Generator is procedural/local and requires no AI API.
