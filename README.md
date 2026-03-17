This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Teaching Notes: Audit & Fixes (What Changed and Why)

This section summarizes the key improvements and the reasoning behind them, so you can learn the security and optimization principles and reuse them later.

### 1) Authentication moved to httpOnly cookies
- **Problem:** Session data in `sessionStorage` can be read by any script running in the browser and is not enforced server-side. That means APIs can be called by anyone, even if the UI hides them.
- **Fix:** Added a signed session cookie (`ubc_session`) using `SESSION_SECRET` and enforced it in API routes.
- **Why it matters:** httpOnly cookies prevent JavaScript access and allow server-side authorization checks.
- **Files:** `lib/auth.ts`, `app/api/login/route.ts`, `app/api/me/route.ts`, `context/ServiceContext.tsx`, `app/login/page.tsx`.

### 2) Admin APIs now check authorization
- **Problem:** Admin endpoints were publicly callable, exposing client data and allowing unauthorized changes.
- **Fix:** Added `getSessionFromRequest` checks to admin endpoints.
- **Why it matters:** Server-side enforcement is the only reliable security boundary.
- **Files:** `app/api/appointments/route.ts`, `app/api/appointments/[id]/route.ts`, `app/api/appointments/create/route.ts`, `app/api/orders/route.ts`, `app/api/notifications/route.ts`.

### 3) Public vs admin data separation
- **Problem:** Client calendar used the admin endpoint, which included private order data.
- **Fix:** Added a public endpoint that only returns available appointment slots.
- **Why it matters:** Principle of least privilege; smaller payloads are faster and safer.
- **Files:** `app/api/appointments/public/route.ts`, `hooks/useFetchPublicAppointments.ts`, `components/ClientCalendar.tsx`.

### 4) Server-side validation with Zod
- **Problem:** API routes trusted incoming payloads, which can be tampered with.
- **Fix:** Added Zod schemas in routes to validate and reject invalid requests.
- **Why it matters:** Prevents crashes, bad data, and security bugs.
- **Files:** `app/api/orders/route.ts`, `app/api/appointments/create/route.ts`, `app/api/appointments/[id]/route.ts`, `app/api/appointments/getAvailable/route.ts`, `app/api/notifications/route.ts`.

### 5) Booking flow hardened (price/duration/endTime)
- **Problem:** Client was sending price/duration/time, which can be manipulated.
- **Fix:** Server now calculates price and duration from the database and updates times safely inside a transaction.
- **Why it matters:** Data integrity and prevention of fraudulent bookings.
- **Files:** `app/api/orders/route.ts`.

### 6) Transactional booking
- **Problem:** Race conditions could allow double bookings.
- **Fix:** Booking now happens inside a Prisma transaction, including availability updates.
- **Why it matters:** Ensures atomic writes and consistent state.
- **Files:** `app/api/orders/route.ts`.

### 7) Email optimization
- **Problem:** A new SMTP transporter was created for every request.
- **Fix:** Transporter is now created once and reused.
- **Why it matters:** Saves CPU and improves throughput.
- **Files:** `utility/sendEmail.ts`.

### 8) Admin iCal + QR subscription
- **Problem:** Admin had no automated calendar integration.
- **Fix:** Added a private iCal feed protected by `ADMIN_ICAL_TOKEN` and generated a QR code for easy subscription.
- **Why it matters:** One-time subscription, automatic updates.
- **Files:** `app/api/admin/ical/route.ts`, `utility/ical.ts`, `app/admin/page.tsx`.

### Environment variables introduced
- `SESSION_SECRET`: HMAC key for signing session cookies.
- `ADMIN_ICAL_TOKEN`: Secret token for the admin iCal feed.

If you want a deeper walk-through of any specific change, tell me which part and I can break it down further with examples.
