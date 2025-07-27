import { ChatSystem } from "@/components/chat-system"
import { NotificationSystem } from "@/components/notification-system"

export default function VendorDashboard() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-100 p-4 flex justify-between items-center">
        <div>Vendor Dashboard</div>
        <NotificationSystem />
      </header>

      <main className="flex-grow p-4">
        <div>Content of the dashboard</div>
      </main>

      <ChatSystem />
    </div>
  )
}
