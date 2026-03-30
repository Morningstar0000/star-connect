import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-foreground/60 mb-8">Page not found</p>
        <Link to="/" className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold">
          Go Home
        </Link>
      </div>
    </main>
  )
}
