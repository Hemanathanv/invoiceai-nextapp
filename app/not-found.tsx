// app/not-found.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}

      <main className="flex-1 container py-16 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gradient mb-6">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            The page you are looking for doesnot exist or has been moved.
          </p>
          <Link href="/" passHref>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90">Return Home</Button>
          </Link>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  )
}
