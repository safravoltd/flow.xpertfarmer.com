# XpertFarmer Admin Dashboard - Setup Guide

## Overview

This is a production-grade farm management admin dashboard built with Next.js 16, NextAuth, and Tailwind CSS. It provides complete CRUD operations for Users, Farms, Employees, Livestock, and Sales management with professional UI/UX.

## Quick Start

### 1. Environment Setup

Before running the application, set up your environment variables:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# You need:
# - NEXTAUTH_SECRET: Generate with: openssl rand -base64 32
# - NEXTAUTH_URL: Your application URL (http://localhost:3000 for dev)
# - NEXT_PUBLIC_API_URL: Your XpertFarmer API base URL
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000` - you'll be redirected to the login page.

### 4. Default Login

Use the credentials provided by your XpertFarmer API administrator:
- Email: `admin@xpertfarmer.com` (example)
- Password: As provided by admin

## Project Architecture

### Authentication Flow

```
User → Login Form → NextAuth → API /auth/login → Session Created → Dashboard
                                  ↓
                            JWT Token Stored
                                  ↓
                        Included in all API calls
```

### Folder Structure Highlights

- **`/app`** - Next.js App Router pages and layouts
- **`/components`** - Reusable React components organized by feature
- **`/lib`** - Utilities, types, hooks, and API services
- **`/auth.ts` & `/auth.config.ts`** - NextAuth configuration
- **`/globals.css`** - Tailwind CSS with design tokens

### Key Files

| File | Purpose |
|------|---------|
| `auth.ts` | NextAuth server setup with callbacks |
| `auth.config.ts` | NextAuth providers configuration |
| `lib/types/api.ts` | TypeScript interfaces for all API responses |
| `lib/hooks/use-api.ts` | Custom hook for API calls with auth |
| `lib/api-client.ts` | HTTP client with token injection |
| `lib/services/api.service.ts` | Organized API service methods |

## Module Breakdown

### 1. Dashboard Module (`/dashboard`)
- **Home Page**: Overview with stats and recent activity
- **Navigation**: Sidebar with module access
- **Header**: User info and quick actions

### 2. Users Module (`/dashboard/users`)
- List all users with search and filtering
- Create new users with role assignment
- Edit/Delete user functionality
- Status management (active/inactive)

### 3. Farms Module (`/dashboard/farms`)
- Browse all farm properties
- Create farms with location and crop type
- Track farm size and manager assignment
- Status tracking

### 4. Employees Module (`/dashboard/employees`)
- Employee directory with contact information
- Hire date tracking
- Position and farm assignment
- Status management

### 5. Livestock Module (`/dashboard/livestock`)
- Track animal types and breeds
- Monitor livestock count
- Health status tracking (healthy/sick/recovered)
- Last checkup date recording

### 6. Sales Module (`/dashboard/sales`)
- Record product sales transactions
- Revenue analytics and totals
- Buyer tracking
- Sale status management (completed/pending)

### 7. Settings Module (`/dashboard/settings`)
- User account management
- System preferences
- Security settings (ready for expansion)

## API Integration Points

The dashboard expects the following API endpoints:

### Authentication
```
POST /auth/login
Request: { email: string, password: string }
Response: { user: {...}, token: string }
```

### Resources (CRUD Pattern)
```
GET    /users
POST   /users
PUT    /users/:id
DELETE /users/:id

GET    /farms
POST   /farms
PUT    /farms/:id
DELETE /farms/:id

GET    /employees
POST   /employees
PUT    /employees/:id
DELETE /employees/:id

GET    /livestock
POST   /livestock
PUT    /livestock/:id
DELETE /livestock/:id

GET    /sales
POST   /sales
PUT    /sales/:id
DELETE /sales/:id
```

## Styling System

### Design Tokens (CSS Variables)

Located in `globals.css`, the application uses semantic color tokens:

- `--primary` / `--primary-foreground` - Main action color
- `--secondary` / `--secondary-foreground` - Supporting elements
- `--muted` / `--muted-foreground` - Disabled/secondary states
- `--destructive` / `--destructive-foreground` - Delete/error states
- `--background` / `--foreground` - Page backgrounds and text
- `--card` / `--card-foreground` - Card components

### Theme Support

The application supports light and dark modes through Tailwind CSS. Customize colors by modifying CSS variables in `globals.css`.

## Component Patterns

### Data Tables

All modules use a consistent table pattern:
- Search input for filtering
- Status/role filter dropdowns
- Edit and delete action buttons
- Loading and error states
- Empty state messaging

Example usage in components:
```tsx
<UsersTable searchTerm={searchTerm} statusFilter={statusFilter} />
```

### Dialog Forms

Create/Edit forms use Dialog components:
```tsx
<CreateUserDialog open={isOpen} onOpenChange={setIsOpen} />
```

Features:
- Form validation with Zod
- Error display with AlertCircle icon
- Loading state on submit button
- Auto-reset after success

### API Integration

Use the `useApi()` hook for API calls:
```tsx
const { get, post, put, delete: del, loading, error } = useApi()

const data = await get('/users')
const result = await post('/users', formData)
```

## Development Workflow

### Adding a New Module

1. **Create the page** at `/app/dashboard/[module]/page.tsx`
2. **Create components** in `/components/[module]/`
3. **Add types** to `/lib/types/api.ts`
4. **Add API service** methods to `/lib/services/api.service.ts`
5. **Add navigation item** in `/components/dashboard/dashboard-nav.tsx`

### Extending Components

All components are built with shadcn/ui and Tailwind CSS:
- Import components from `@/components/ui/`
- Use Tailwind classes for styling
- Follow existing patterns for consistency

### Testing Locally

```bash
npm run dev
# Visit http://localhost:3000
# Login with test credentials
# Navigate through modules
# Create/Edit/Delete records
```

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Vercel Deployment (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables on Vercel

Add these in Vercel project settings:
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your production domain
- `NEXT_PUBLIC_API_URL` - Production API URL

## Security Best Practices

1. **Never commit `.env.local`** - Use `.env.example` for reference
2. **Rotate NEXTAUTH_SECRET** regularly in production
3. **Use HTTPS** in production (Vercel handles this)
4. **Keep dependencies updated** - Run `npm audit` regularly
5. **Validate all user input** - Zod schemas are in place
6. **Protect API endpoints** - All requests include auth token

## Troubleshooting

### Login Not Working
- Check API endpoint is accessible
- Verify credentials are correct
- Check browser console for errors
- Ensure NEXTAUTH_SECRET is set

### API Calls Failing
- Check network tab in DevTools
- Verify NEXT_PUBLIC_API_URL is correct
- Ensure API server is running
- Check for CORS issues

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## Performance Tips

1. Use production build for testing: `npm run build && npm run start`
2. Check React DevTools for unnecessary re-renders
3. Use Chrome DevTools Network tab to monitor API calls
4. Dashboard uses server-side rendering for fast initial load

## Next Steps for Enhancement

1. Add real-time notifications using WebSockets
2. Implement advanced filtering and pagination
3. Add data export (CSV, PDF) functionality
4. Create analytics dashboards with charts
5. Add user activity logging and audit trails
6. Implement bulk operations for tables
7. Add image upload for user profiles
8. Create custom reports builder

## Support & Documentation

- **API Docs**: Contact your API provider
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth Docs**: https://next-auth.js.org
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com

## License

This project is proprietary software. All rights reserved by XpertFarmer Inc.

---

**Version**: 1.0.0  
**Last Updated**: January 2026  
**Built with**: Next.js 16, React 19.2, TypeScript, NextAuth 5, Tailwind CSS v4
