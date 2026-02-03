# Room Vision 🏠✨

> Transform your living spaces with AI-powered interior design. Upload a photo, describe your vision, and watch it come to life in seconds.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Storage-3ecf8e?style=flat-square&logo=supabase)

## Features

- 🎨 **AI-Powered Redesign** – Powered by Google Gemini 2.5 Flash via Vercel AI SDK
- 📸 **Drag & Drop Upload** – Simply drop a room photo to get started
- 🔄 **Before/After Slider** – Compare original and transformed images
- 📱 **Mobile Optimized** – Responsive design with touch-friendly controls
- 🔐 **Secure Authentication** – Google OAuth & email/password via Supabase
- 📊 **Generation History** – All your designs saved and accessible
- ⚡ **Rate Limiting** – 10 free generations per day via Upstash Redis

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Framework      | Next.js 16 (App Router, Turbopack)      |
| Styling        | Tailwind CSS 4                          |
| Authentication | Supabase Auth (OAuth + Email)           |
| Storage        | Supabase Storage                        |
| Database       | Supabase Postgres (with RLS)            |
| AI             | Vercel AI SDK + Google Gemini 2.5 Flash |
| Rate Limiting  | Upstash Redis                           |

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/mohamedafrash/room-vision.git
cd room-vision
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SECRET_KEY=your_supabase_service_role_key

# AI Gateway
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### 3. Database Setup

Run the migrations to set up the database schema:

```bash
supabase db push
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── api/generate/    # AI generation endpoint
│   ├── auth/callback/   # OAuth callback handler
│   ├── login/           # Login page
│   ├── signup/          # Signup page
│   └── page.tsx         # Main app
├── components/
│   ├── ImageStage.tsx   # Image upload & display
│   ├── ImageCompare.tsx # Before/after slider
│   ├── PromptComposer.tsx
│   ├── HistoryPanel.tsx
│   └── ...
└── lib/
    ├── supabase/        # Supabase clients
    ├── rate-limit.ts    # Rate limiting logic
    └── aiGateway.ts     # AI API client
```

## Security

- ✅ Server-side authentication on all API routes
- ✅ Row Level Security (RLS) on all database tables
- ✅ Rate limiting (10 requests/day per user)
- ✅ Input validation (prompt length, image size)
- ✅ Security headers (X-Frame-Options, CSP)
- ✅ User-scoped file storage

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm lint     # Run ESLint
pnpm start    # Start production server
```

## License

MIT – See [LICENSE](LICENSE) for details.

---

Built by [Mohamed Afrash](https://github.com/mohamedafrash)
