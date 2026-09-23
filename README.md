# PICK MVP

PICK is a mobile-first decision app: create a question, add 2–4 choices, share the link, vote before seeing the crowd, then reveal the result.

## Stack
Next.js 15 + React 19 + TypeScript + Supabase. Designed for Render.

## Setup
1. Copy `.env.example` to `.env.local`.
2. Add the PICK Supabase publishable key.
3. `npm install`
4. `npm run dev`

The production Supabase schema is represented in `supabase/migrations/` and should remain the source of truth.

## Render
Create a Web Service from the GitHub repository, or use `render.yaml`. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` in Render environment settings. Build: `npm ci && npm run build`. Start: `npm start`.

## MVP rule
Anonymous visitors can vote. Accounts are required to create/manage PICKs. Crowd results remain hidden until a visitor has voted.
