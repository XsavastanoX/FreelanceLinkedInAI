# FreelancePostAI

A Next.js 15 micro-SaaS for generating viral LinkedIn posts tailored for freelance web developers.

## Features
- **AI Post Generator**: OpenAI (GPT-4o mini) powered generation specific to freelance niches.
- **Tone Selection**: Professional, Storytelling, Controversial, etc.
- **History**: Save and view past posts.
- **Authentication**: Secure sign-up/login via Clerk.
- **Payments**: Stripe subscription integration (Basic/Pro tiers).
- **Dashboard**: User profile and credits management.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + Shadcn/UI
- Clerk (Auth)
- Drizzle ORM + Vercel Postgres (Database)
- Stripe (Payments)
- OpenAI (AI models)

## Setup

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd FreelanceLinkedInAI
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

**Required Environment Variables:**

#### Clerk (Authentication)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - From Clerk Dashboard
- `CLERK_SECRET_KEY` - From Clerk Dashboard
- `CLERK_WEBHOOK_SECRET` - From Clerk Webhooks (see setup below)

#### Database (Vercel Postgres)
- `POSTGRES_URL` - Connection string from Vercel Storage

#### Stripe (Payments)
- `STRIPE_SECRET_KEY` - From Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET` - From Stripe CLI or Dashboard
- `STRIPE_PRICE_ID` - Your subscription price ID from Stripe

#### OpenAI
- `OPENAI_API_KEY` - From OpenAI Platform

#### App URL
- `NEXT_PUBLIC_APP_URL` - Your app URL (e.g., `http://localhost:3000`)

### 3. Database Setup

#### Push Schema to Database
```bash
npm run db:push
# or
npx drizzle-kit push
```

This will create the following tables:
- `users` - User profiles with credits and subscription status
- `posts` - Saved LinkedIn posts
- `subscriptions` - Stripe subscription records

### 4. Clerk Webhook Setup

To sync users from Clerk to your database:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Webhooks
2. Click "Add Endpoint"
3. Set endpoint URL: `https://your-domain.com/api/webhooks/clerk`
4. Subscribe to events: `user.created` and `user.updated`
5. Copy the "Signing Secret" to `CLERK_WEBHOOK_SECRET` in `.env.local`

**For local development:**
```bash
clerk listen --forward-to localhost:3000/api/webhooks/clerk
```

### 5. Stripe Setup

#### Create Products and Prices
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Products
2. Create a "Professional" subscription product
3. Copy the Price ID to `STRIPE_PRICE_ID` in `.env.local`

#### Webhook Setup (Local Development)
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`

#### Webhook Setup (Production)
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Subscribe to events: `checkout.session.completed`, `invoice.payment_succeeded`
4. Copy the signing secret to your production environment variables

### 6. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 7. Testing the Flow

1. **Sign Up**: Create a new account at `/sign-up`
2. **Profile**: Complete your profile at `/dashboard/settings`
3. **Generate**: Create posts at `/dashboard/generate`
4. **Upgrade**: Test subscription at `/dashboard/settings` (use test card `4242 4242 4242 4242`)
5. **History**: View saved posts at `/dashboard/history`

## Deployment (Vercel)

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel
1. Import project in [Vercel Dashboard](https://vercel.com)
2. Connect your GitHub repository
3. Add all environment variables from `.env.local`
4. Deploy

### 3. Configure Webhooks for Production
- Update Clerk webhook endpoint to your Vercel URL
- Update Stripe webhook endpoint to your Vercel URL
- Add webhook secrets to Vercel environment variables

### 4. Database Migration
Vercel Postgres is automatically connected. Run:
```bash
npx drizzle-kit push
```

## Project Structure

```
├── app/
│   ├── (auth)/              # Sign-in/Sign-up pages
│   ├── (marketing)/         # Landing page
│   ├── api/
│   │   └── webhooks/        # Clerk & Stripe webhooks
│   └── dashboard/           # Protected dashboard routes
├── components/
│   ├── forms/               # Form components
│   ├── shared/              # Navbar, Sidebar
│   └── ui/                  # Shadcn/UI components
├── lib/
│   ├── db.ts                # Database connection
│   ├── schema.ts            # Drizzle schema
│   ├── stripe.ts            # Stripe client
│   └── openai.ts            # OpenAI client
└── actions/                 # Server actions
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema to database

## Troubleshooting

### "User not found" error
- Ensure Clerk webhook is configured and receiving events
- Check that `CLERK_WEBHOOK_SECRET` is correct
- Verify webhook endpoint is accessible

### Stripe checkout not working
- Verify `STRIPE_PRICE_ID` matches your product
- Check webhook is receiving events with `stripe listen`
- Ensure `STRIPE_WEBHOOK_SECRET` is correct

### Database connection issues
- Verify `POSTGRES_URL` is correct
- Run `npx drizzle-kit push` to sync schema
- Check Vercel Postgres dashboard for connection status

## License
MIT
# FreelanceLinkedInAI
