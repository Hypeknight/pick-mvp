PICK v0.5 — PICK Machine & Content Engine

The database migration has ALREADY been applied to the live Supabase project.
Keep the included SQL migration in GitHub history; do not manually re-run it.

NEW
- app/admin/machine/page.tsx
- supabase/migrations/20260923210000_pick_machine_content_engine.sql
- README-v0.5.txt

REPLACE
- app/admin/page.tsx

IMPORTANT CSS
The included app/globals.css contains ONLY the v0.5 CSS additions.
DO NOT overwrite your existing globals.css with it.
Append its contents to the bottom of your existing app/globals.css.

Workflow:
Admin -> PICK Machine -> create candidate -> review -> Publish.
Published machine PICKs enter the public feed as source_type=system.
