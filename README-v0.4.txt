PICK v0.4 — Admin Control

Database foundation has already been applied to the live Supabase project and the existing account was assigned Master.
Keep the included migration in GitHub as source history; do NOT manually re-run it.

New:
- app/admin/page.tsx
- supabase/migrations/20260923203000_admin_control_foundation.sql
- README-v0.4.txt

Changed:
- app/AuthNav.tsx
- app/globals.css

Admin v1:
- /admin protected by database-backed admin membership
- Master/Admin/Moderator role foundation
- platform overview counts
- recent PICK review
- make PICK public / remove from feed
- feature / unfeature public PICKs
- Admin nav appears only for admin members

Important: Master assignment is intentionally NOT hard-coded in this migration.
