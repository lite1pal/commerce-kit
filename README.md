# CommerceKit Storefront

A minimal, modern e-commerce storefront built with Next.js, Prisma, and PostgreSQL. This project demonstrates clean architecture, variant-aware cart and checkout flows, and a minimalistic, accessible UI.

## Features

- Product and collection pages with SEO metadata
- Variant selection and stock management
- Add to cart, update quantity, and remove items
- Persistent cart (cookie-based)
- Checkout flow with order creation and stock decrement
- Order lookup by email
- Minimal, responsive design
- Global fixed checkout card for quick access
- Accessible and keyboard-friendly UI

## Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL (local or cloud)

### Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd commerce-kit
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` and set your `DATABASE_URL`.
4. **Run migrations and seed the database:**
   ```bash
   pnpm prisma migrate reset
   pnpm prisma db seed
   ```
5. **Start the development server:**
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront.

## Project Structure

- `app/` — Next.js app directory (pages, components, layouts)
- `prisma/` — Prisma schema, migrations, and seed script
- `lib/` — Utility modules (e.g., cart logic, Prisma client)
- `public/` — Static assets

## Customization

- **Products & Collections:** Edit `prisma/seed.ts` to customize demo data.
- **Styling:** Tweak `app/globals.css` or Tailwind config for branding.
- **SEO:** Page-level metadata is set in each route file.

## Scripts

- `pnpm dev` — Start the development server
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm prisma` — Prisma CLI (migrate, generate, etc.)

## License

MIT. See [LICENSE](LICENSE) for details.

_CommerceKit Storefront is a demo and not production-hardened. For real-world use, add authentication, payment, and security best practices._
