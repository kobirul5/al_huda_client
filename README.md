# Al-Huda Frontend

Al-Huda Frontend is a Next.js app focused on the public navbar and authentication flow.

## What this app includes

- Public navbar
- Login
- Register
- OTP verification
- Forgot password
- Reset password

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI primitives
- Lucide React icons
- Sonner toasts
- jsonwebtoken

## Project Structure

- `src/app` - layouts and auth pages
- `src/components` - navbar, forms, and UI primitives
- `src/services` - server actions that call the backend
- `src/lib` - helper utilities

## Backend Connection

This frontend expects the backend API to be available through `NEXT_PUBLIC_API_URL`.

## Environment Variables

- `NEXT_PUBLIC_API_URL` - backend base URL

## Scripts

- `bun run dev` or `npm run dev` - start the development server
- `bun run build` or `npm run build` - build the app
- `bun run start` or `npm run start` - run the production build
- `bun run lint` or `npm run lint` - run ESLint
