import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/AppSidebar"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger className="mb-2"/>
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
