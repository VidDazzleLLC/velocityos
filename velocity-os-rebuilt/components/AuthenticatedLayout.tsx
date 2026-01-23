import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopNav />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
