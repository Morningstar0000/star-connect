# StarConnect - Celebrity Booking Platform

StarConnect is a modern web application that allows fans to book personalized video calls with their favorite celebrities. The platform includes user authentication, celebrity browsing, booking management, and a comprehensive admin dashboard.

## Features

### For Fans
- **Browse Celebrities**: Discover and filter celebrities by category, price, and ratings
- **Celebrity Profiles**: View detailed information about celebrities including bio, rating, and reviews
- **Book Sessions**: Multi-step booking flow with date/time selection and payment method configuration
- **Dashboard**: Manage bookings, save favorites to wishlist, and update profile
- **Wishlist**: Save favorite celebrities for quick access
- **Profile Management**: Update personal information and notification preferences

### For Admins
- **Booking Management**: Review and confirm pending bookings, manage rejections
- **Celebrity Management**: Edit celebrity profiles, adjust pricing
- **Payment Configuration**: Configure payment methods and transaction settings
- **User Management**: View and manage user accounts
- **Analytics**: Real-time platform statistics, revenue tracking, and usage trends
- **Admin Settings**: Configure platform-wide settings

## Tech Stack

- **Frontend**: Next.js 16, React 19, JavaScript/JSX
- **Styling**: TailwindCSS 4.2, Radix UI components
- **State Management**: React Context for authentication and global state
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization
- **Responsive Design**: Mobile-first approach with Tailwind utilities

## Project Structure

```
app/
├── admin/                    # Admin dashboard pages
│   ├── page.jsx            # Main admin dashboard
│   ├── bookings/           # Booking management
│   ├── celebrities/        # Celebrity management
│   ├── payments/           # Payment configuration
│   ├── users/              # User management
│   ├── analytics/          # Analytics & reports
│   └── settings/           # Admin settings
├── dashboard/              # Fan dashboard
│   ├── page.jsx           # Main dashboard
│   ├── profile-setup/     # Initial profile setup
│   ├── profile/           # Profile editing
│   └── settings/          # User settings
├── booking/               # Booking flow
│   └── [id]/             # Booking page for specific celebrity
├── browse/               # Celebrity browsing
│   └── page.jsx
├── celebrity/            # Celebrity detail pages
│   └── [id]/
├── login/               # Authentication
├── signup/
└── layout.jsx           # Root layout

components/
├── Header.jsx           # Navigation header
├── Footer.jsx           # Footer
├── AuthContext.jsx      # Auth context provider
├── CelebrityCard.jsx    # Celebrity card component
├── BookingForm.jsx      # Multi-step booking form
├── BookingsList.jsx     # User bookings list
└── AdminWrapper.jsx     # Admin layout wrapper

lib/
├── data.js             # Mock data, celebrities, utilities
└── utils.js            # Helper functions

context/
└── AuthContext.jsx     # Authentication context
```

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

### Fan Account
- Email: `demo@starconnect.com`
- Password: `password123`

### Admin Account
- Email: `admin@starconnect.com`
- Password: `password123`

## Key Features Explained

### Authentication
- Mock authentication with localStorage persistence
- User context stores authenticated user data
- Login/Signup flow with email and password validation
- Automatic redirect for protected pages

### Celebrity Browsing
- Filter by category, price range
- Sort by rating, reviews, price
- Save favorites to wishlist
- Detailed celebrity profiles with mock reviews

### Booking System
- Multi-step form (Date/Time → Payment)
- Multiple payment methods support
- Booking confirmation with status tracking
- Admin approval workflow (Pending → Confirmed/Rejected)

### Dashboard Features
- Booking status tracking (Pending, Confirmed, Completed, Rejected)
- Wishlist management
- Profile customization
- Notification preferences

### Admin Features
- Real-time booking verification
- Rejection workflow with custom reasons
- Celebrity pricing management
- Payment method configuration
- Analytics with charts and trends

## Color Scheme

The application uses a premium, sophisticated color palette:
- **Primary**: Deep Navy (#1a1a1a)
- **Accent**: Gold (#d4af37)
- **Secondary**: Gold variant (#c9a961)
- **Background**: Cream (#faf9f6) - Light mode
- **Background**: Deep Navy (#0f1419) - Dark mode

## Deployment

The application is ready for deployment on Vercel:

1. Connect your repository to Vercel
2. Vercel will automatically detect Next.js configuration
3. Deploy with a single click

## Future Enhancements

- Backend API integration (Node.js/Express)
- Real database (PostgreSQL/MongoDB)
- Real payment processing (Stripe)
- Video calling integration
- Email notifications
- Advanced analytics
- Celebrity mobile app
- Rating and review system
- Subscription tiers

## License

This project is open source and available under the MIT License.
