# Drishyam News - A Modern News Portal

A full-stack news portal built with Next.js 16, TypeScript, Firebase, and Tailwind CSS, inspired by The Indian Express design philosophy.

## Features

### Public Features
- **Homepage**: Featured articles, latest news grid, and category sections
- **Article Detail Pages**: Full-width editorial layout with author info and related articles
- **Category Pages**: Filter articles by category (Politics, Business, Technology, Sports)
- **Latest News Page**: Browse all articles with category filtering
- **Responsive Design**: Mobile-first design that works on all devices

### Admin Features
- **Protected Dashboard**: Admin authentication with Firebase Auth
- **Article Management**: Create, edit, and delete articles
- **Image Upload**: Upload featured images to Firebase Cloud Storage
- **Featured Articles**: Mark articles as featured for homepage prominence
- **Author Management**: Manage article authors
- **Analytics**: View article views and engagement metrics

## Tech Stack

- **Frontend**: Next.js 16 with TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Database**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Cloud Storage
- **Typography**: Lora (serif headlines) + Geist (body text)
- **Styling**: Custom CSS with semantic design tokens

## Getting Started

### 1. Setup Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Cloud Storage

3. Get your Firebase config from Project Settings

### 2. Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 4. Seed Sample Data (Optional)

First, set up Firebase Admin credentials:

```bash
# Option A: Set via environment variable
export FIREBASE_SERVICE_ACCOUNT_PATH=path/to/serviceAccountKey.json

# Option B: Use Application Default Credentials
gcloud auth application-default login

# Then run the seed script
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the homepage.

## Project Structure

```
app/
  layout.tsx                 # Root layout with fonts and providers
  page.tsx                  # Homepage
  article/[slug]/           # Article detail pages
  category/[slug]/          # Category listing pages
  latest/                   # Latest news page
  admin/
    layout.tsx              # Admin layout with sidebar
    page.tsx                # Admin dashboard
    login/page.tsx          # Admin login page
    articles/
      page.tsx              # Article management
      new/page.tsx          # Create new article
      [id]/edit/page.tsx    # Edit article

components/
  layout/
    Header.tsx              # Top header with logo
    Navbar.tsx              # Category navigation
    Footer.tsx              # Footer with links
  homepage/
    HeroSection.tsx         # Featured articles hero
    NewsGrid.tsx            # Main news grid
    Section.tsx             # Category sections
    ArticleCard.tsx         # Reusable article card
  article/
    ArticleHeader.tsx       # Article title and metadata
    ArticleContent.tsx      # Article body content
    RelatedArticles.tsx     # Related articles sidebar
  admin/
    AdminSidebar.tsx        # Admin navigation sidebar
    ArticleForm.tsx         # Create/edit form
    ImageUpload.tsx         # Firebase image upload
    
lib/
  firebase.ts               # Firebase configuration
  types.ts                  # TypeScript types
  hooks.ts                  # Custom React hooks for Firebase
```

## Database Schema

### Collections

#### Articles
```typescript
{
  id: string
  title: string
  headline: string
  category: string
  content: string
  excerpt: string
  imageUrl: string
  authorId: string
  date: number
  featured: boolean
  views: number
  slug: string
  createdAt: number
  updatedAt: number
}
```

#### Categories
```typescript
{
  id: string
  name: string
  slug: string
  order: number
}
```

#### Authors
```typescript
{
  id: string
  name: string
  bio: string
  avatarUrl: string
  email?: string
}
```

## Key Features in Detail

### Authentication
- Email/password registration and login via Firebase Auth
- Protected admin routes that redirect to login if not authenticated
- Persistent auth state across page refreshes

### Article Management
- Create articles with title, headline, category, content, and featured image
- Edit existing articles
- Delete articles
- Mark articles as featured
- Image upload to Firebase Cloud Storage
- Slug generation from titles

### Responsive Design
- Mobile-first approach
- Hamburger navigation on small screens
- Responsive grid layouts (1 col mobile, 2 col tablet, 3 col desktop)
- Touch-friendly buttons and spacing

### Performance
- Next.js Image optimization
- Real-time Firestore listeners with React hooks
- Client-side data fetching with React hooks
- Lazy loading for below-fold content

## Styling

The design uses a clean, minimal, white aesthetic inspired by The Indian Express:

- **Primary Color**: Red (#d41f16)
- **Neutral Colors**: White, grays, and off-whites
- **Typography**: Serif fonts (Lora) for headlines, sans-serif (Geist) for body
- **Spacing**: Generous whitespace and clean grid layouts
- **Borders**: Subtle borders and shadows for visual hierarchy

Design tokens are defined in `globals.css` and can be customized via CSS variables.

## Customization

### Change Colors
Edit the CSS variables in `app/globals.css`:

```css
:root {
  --primary: #d41f16;      /* Change primary red */
  --foreground: #1a1a1a;   /* Change text color */
  --background: #ffffff;   /* Change background */
}
```

### Change Fonts
Edit fonts in `app/layout.tsx` and `globals.css`:

```typescript
import { YourFont } from 'next/font/google'
const _font = YourFont({ ... })
```

### Add Categories
Modify the categories in `components/layout/Navbar.tsx` or manage via admin dashboard.

## Deployment

### Deploy to Vercel

1. Push to GitHub repository
2. Connect to Vercel at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

### Other Platforms

Works with any Node.js hosting that supports Next.js:
- AWS Amplify
- Netlify
- Railway
- Render
- Self-hosted servers

## API Routes

While this is primarily a static-generated app, you can add API routes for server-side functionality:

```typescript
// app/api/example/route.ts
export async function GET(request: Request) {
  // Handle requests
}
```

## Troubleshooting

### Firebase Connection Issues
- Verify Firebase config variables are set correctly
- Check that Firestore database rules allow read/write access
- Ensure Firebase services are enabled in the console

### Images Not Loading
- Check that Firebase Cloud Storage bucket is configured correctly
- Verify storage rules allow public or authenticated access
- Check image URLs in Firestore documents

### Admin Login Not Working
- Ensure Firebase Authentication is enabled
- Check that email/password provider is enabled
- Verify credentials are correct

## Future Enhancements

- Comment system for article discussions
- User accounts and reading history
- Newsletter subscription
- Social media sharing
- Dark mode support
- Advanced search functionality
- Article search/filtering
- Analytics dashboard
- Content moderation system

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or contributions, please create an issue or pull request on the GitHub repository.

---

Built with ❤️ using Next.js and Firebase
