# Al-Huda Client

Al-Huda is a web application for Islamic learning and guidance. This repository contains its frontend, built with Next.js and TypeScript. It connects to the Al-Huda REST API for Quran, Hadith, prayer-time, account, and assistant features.

## Features

- **Quran** — browse Surahs and read by Surah, Juz, or page, with a dedicated reader experience.
- **Hadith** — browse collections and read individual books.
- **Prayer times** — view prayer schedules and related information for a selected location.
- **Ramadan** — explore Ramadan information, duas, and a countdown.
- **Ask Al-Huda** — access the Islamic question-and-answer assistant.
- **Accounts** — register, sign in, verify an OTP, recover or reset a password, and manage a profile.
- **Bookmarks** — access saved reading items.
- **Public pages** — browse the blog, About, Contact, Privacy Policy, Copyright, and credits pages.

## Tech stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Radix UI primitives and reusable UI components
- React Hook Form and Zod for forms and validation
- Lucide React icons and Sonner notifications
- Bun lockfile and package scripts

## Project structure

```text
src/
├── app/
│   ├── (commonLayout)/       # Public pages and authentication routes
│   └── (reader)/             # Quran reader routes and layout
├── components/
│   ├── modules/               # Feature-specific UI (Quran, Hadith, prayer, etc.)
│   ├── providers/             # App-wide providers
│   ├── shared/                # Shared application components
│   └── ui/                    # Reusable UI primitives
├── hooks/                     # Shared React hooks
├── lib/                       # Utilities and auth helpers
└── services/                  # API calls and server actions
```

## Routes

| Area | Routes |
|---|---|
| Home | `/` |
| Quran reader | `/surah/[id]`, `/juz/[id]`, `/page/[id]` |
| Hadith | `/hadith`, `/hadith/[bookName]` |
| Prayer and Ramadan | `/prayer-time`, `/ramadan` |
| Assistant | `/ask-alhuda` |
| Account | `/login`, `/register`, `/verify-otp`, `/foget-password`, `/reset-password`, `/profile` |
| Other pages | `/bookmarks`, `/blog`, `/about-us`, `/contact-us`, `/privacy-policy`, `/copyright`, `/thanks-credits` |

## Requirements

- Node.js or Bun
- The Al-Huda backend API for features that load or submit API data

The backend project and its setup instructions are in [`../al_huda_server/README.md`](../al_huda_server/README.md).

## Getting started

From this directory, install dependencies and start the development server:

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The repository includes a Bun lockfile. If you prefer npm, use `npm install` and `npm run dev`.

## Backend configuration

The frontend reads `NEXT_PUBLIC_API_URL` for backend requests. Most services default to `http://localhost:5000/api/v1`, so a local backend using that address works without additional configuration.

To use a different backend, create `.env.local` in this directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Set the value to the backend's API base URL, including its API prefix if applicable. Restart the development server after changing environment variables.

## Scripts

Run these scripts with `bun run <script>` or `npm run <script>`:

| Script | Description |
|---|---|
| `dev` | Start the Next.js development server |
| `build` | Create an optimized production build |
| `start` | Serve the production build |
| `lint` | Run ESLint |

For example, build and run the production app with:

```bash
bun run build
bun run start
```
