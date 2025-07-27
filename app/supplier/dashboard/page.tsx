import { ChatSystem } from "@/components/chat-system"
import { NotificationSystem } from "@/components/notification-system"

export default function SupplierDashboard() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Supplier Dashboard</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:text-gray-500">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-500">
                  Orders
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-500">
                  Inventory
                </a>
              </li>
            </ul>
          </nav>
          {/* User Profile and Notifications */}
          <div className="flex items-center space-x-4">
            {/* <button className="bg-gray-100 hover:bg-gray-200 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 13.828V12c0-1.087-.743-2.016-1.85-2.366L12 3.016l-5.15 8.634A2.033 2.033 0 016 12v1.828a2.032 2.032 0 01-1.405 1.405L4 17h5m6 0h1.965a1 1 0 00.895-.553L21 12V8a2 2 0 00-2-2H5a2 2 0 00-2 2v4l5.105 9.447a1 1 0 00.895.553H9"
                />
              </svg>
            </button> */}
            <NotificationSystem />
            <div className="relative">
              <img src="https://via.placeholder.com/40" alt="User Avatar" className="rounded-full w-10 h-10" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="container mx-auto">
          <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
          {/* Add your dashboard content here */}
          <p>Welcome to your supplier dashboard!</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 px-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Supplier Portal</p>
        </div>
      </footer>
      <ChatSystem />
    </div>
  )
}
