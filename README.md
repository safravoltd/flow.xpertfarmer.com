# XpertFarmer Admin Dashboard

A professional, production-grade farm management and administration system built with Next.js 16, NextAuth, and modern web technologies.

## Features

- **Authentication**: Secure NextAuth.js-based credential authentication
- **User Management**: Create, edit, and manage system users with role-based access
- **Farm Management**: Track and manage multiple farms with crop types and acreage
- **Employee Management**: Manage farm employees with hire dates and positions
- **Livestock Tracking**: Monitor animal health and inventory across farms
- **Sales Management**: Record and track farm product sales with revenue analytics
- **Professional UI**: Clean, modern interface built with shadcn/ui components
- **Real-time API Integration**: Full REST API integration with XpertFarmer backend

## Project Structure

```
├── app/
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx              # Login page
│   ├── api/
│   │   └── auth/[...nextauth]/
│   │       └── route.ts              # NextAuth route handler
│   ├── dashboard/
│   │   ├── page.tsx                  # Dashboard home
│   │   ├── layout.tsx                # Dashboard layout with nav
│   │   ├── users/page.tsx            # Users management
│   │   ├── farms/page.tsx            # Farms management
│   │   ├── employees/page.tsx        # Employees management
│   │   ├── livestock/page.tsx        # Livestock tracking
│   │   ├── sales/page.tsx            # Sales management
│   │   └── settings/page.tsx         # User settings
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles with design tokens
│
├── components/
│   ├── ui/                           # shadcn/ui components
│   ├── dashboard/
│   │   ├── dashboard-nav.tsx         # Sidebar navigation
│   │   ├── dashboard-header.tsx      # Top header with user info
│   │   ├── dashboard-overview.tsx    # Stats cards
│   │   └── recent-activity.tsx       # Activity feed
│   ├── users/
│   │   ├── users-table.tsx           # Users data table
│   │   └── create-user-dialog.tsx    # Create user form
│   ├── farms/
│   │   ├── farms-table.tsx           # Farms data table
│   │   └── create-farm-dialog.tsx    # Create farm form
│   ├── employees/
│   │   ├── employees-table.tsx       # Employees data table
│   │   └── create-employee-dialog.tsx# Create employee form
│   ├── livestock/
│   │   ├── livestock-table.tsx       # Livestock data table
│   │   └── create-livestock-dialog.tsx # Add livestock form
│   └── sales/
│       ├── sales-table.tsx           # Sales data table with analytics
│       └── create-sale-dialog.tsx    # Record sale form
│
├── lib/
│   ├── types/
│   │   └── api.ts                    # TypeScript interfaces for API
│   ├── hooks/
│   │   └── use-api.ts                # Custom API hook
│   ├── api-client.ts                 # API client utility
│   └── utils.ts                      # Utility functions
│
├── auth.config.ts                    # NextAuth configuration
├── auth.ts                           # NextAuth initialization
├── package.json                      # Dependencies
└── tsconfig.json                     # TypeScript configuration
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=https://api.xpertfarmer.com
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd xpertfarmer-admin
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run start
```

## API Integration

The dashboard integrates with XpertFarmer REST API endpoints:

### Authentication
- `POST /auth/login` - User login

### Users
- `GET /users` - List all users
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Farms
- `GET /farms` - List all farms
- `POST /farms` - Create new farm
- `PUT /farms/{id}` - Update farm
- `DELETE /farms/{id}` - Delete farm

### Employees
- `GET /employees` - List all employees
- `POST /employees` - Create new employee
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee

### Livestock
- `GET /livestock` - List all livestock
- `POST /livestock` - Add livestock
- `PUT /livestock/{id}` - Update livestock
- `DELETE /livestock/{id}` - Delete livestock

### Sales
- `GET /sales` - List all sales
- `POST /sales` - Record new sale
- `PUT /sales/{id}` - Update sale
- `DELETE /sales/{id}` - Delete sale

## Authentication Flow

1. User navigates to `/auth/login`
2. Enters credentials (email/password)
3. NextAuth validates credentials against `/auth/login` API endpoint
4. On success, JWT token is stored in secure session
5. Token is automatically included in all subsequent API requests
6. User is redirected to `/dashboard`
7. Protected routes require active session

## Key Technologies

- **Next.js 16**: React framework with App Router
- **NextAuth.js 5**: Authentication solution
- **React 19.2**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Utility-first styling
- **shadcn/ui**: Component library
- **Zod**: Schema validation
- **Lucide Icons**: Icon library
- **Recharts**: Data visualization (optional)

## Component Patterns

### Data Tables
All data tables follow a consistent pattern:
- Search/filter functionality
- Pagination support (extensible)
- Edit and delete actions
- Loading and error states

### Dialog Forms
All create/edit forms use Dialog components with:
- Form validation with Zod
- Error state display
- Loading states on submission
- Automatic form reset after success

### API Hooks
The `useApi()` hook provides:
- Automatic token injection
- Error handling
- Loading state management
- TypeScript-safe requests

## Code Organization Best Practices

1. **Components** are organized by feature (users, farms, etc.)
2. **Types** are centralized in `lib/types/`
3. **API logic** is abstracted through `useApi()` hook
4. **State management** uses React hooks with SWR patterns
5. **Styling** uses Tailwind CSS with shadcn/ui components
6. **Authentication** is server-side validated with NextAuth

## Styling

The project uses Tailwind CSS v4 with a professional color scheme defined in `globals.css`:

- **Primary Color**: Used for main actions and highlights
- **Secondary Colors**: For supporting elements
- **Muted Colors**: For disabled or secondary states
- **Semantic Colors**: For success, warning, and destructive actions

All colors are defined as CSS custom properties for easy theming.

## Security Considerations

1. **NextAuth.js** handles secure session management
2. **HTTP-only cookies** store authentication tokens
3. **CSRF protection** is built-in
4. **API tokens** are never exposed in client-side code
5. **Protected routes** require valid session
6. **Input validation** with Zod schemas

## Performance Optimization

1. **Server-side rendering** for dashboard layout
2. **Client-side data fetching** for dynamic content
3. **React hooks** for efficient state management
4. **Code splitting** by route
5. **Image optimization** with Next.js Image component
6. **CSS optimization** with Tailwind CSS v4

## Troubleshooting

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure API endpoint is accessible

### API Connection Errors
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check API server is running
- Review browser console for detailed errors

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (16+)

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
Ensure Node.js 16+ is available and run:
```bash
npm run build
npm run start
```

## Support

For API documentation and support, visit the XpertFarmer documentation site or contact the support team.

## License

This project is proprietary software owned by XpertFarmer Inc.
