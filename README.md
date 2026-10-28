# Al-Huda Frontend

This is the frontend application for Al-Huda, built with Next.js. It focuses on public navigation and the complete authentication flow.

## Features

- Public navbar
- Login
- Register
- OTP verification
- Forgot password
- Reset password

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI primitives
- Lucide React icons
- Sonner toasts
- jsonwebtoken

## Project Structure

- `src/app` - app routes, layouts, and authentication pages
- `src/components` - navbar, forms, and reusable UI components
- `src/services` - server actions and backend communication
- `src/lib` - helper utilities and shared logic

## Backend Connection

This frontend expects the backend API to be available through the `NEXT_PUBLIC_API_URL` environment variable.

## Environment Variables

Create a `.env.local` file with the following:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Scripts

- `npm run dev` or `bun run dev` - start the development server
- `npm run build` or `bun run build` - create a production build
- `npm run start` or `bun run start` - run the production build
- `npm run lint` or `bun run lint` - run ESLint

## Getting Started

```bash
npm install
npm run dev
```

Then open the local app in your browser to continue development.
