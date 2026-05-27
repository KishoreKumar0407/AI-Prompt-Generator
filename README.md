
# AI Prompt Generator

Vite + React + TypeScript app that generates optimized AI prompts and stores history in Supabase.

Local development
1. Copy `.env.example` to `.env.local` and fill values.

```bash
cp .env.example .env.local
```

2. (Optional) Run the local functions server:

```bash
npm run local:functions
```

3. Start the frontend:

```bash
npm run dev
# or
npm start
```

Deployment
- Deploy Supabase Edge Function:

```bash
supabase login
supabase functions deploy generate-prompt --project-ref <your-project-ref>
```

CI
- A GitHub Actions workflow template is included at `.github/workflows/deploy-supabase.yml`. Configure the repository secrets `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF` to enable deployments.

Security
- Keep `.env.local` and any service role keys out of source control. Use `.env.example` for reference.

If you want, I can run lint/typecheck and push these changes to the GitHub repository you provided. Confirm and provide Git access if you want me to push.


