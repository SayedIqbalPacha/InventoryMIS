// import { AppSidebar } from "@/component/Sidebar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { Outlet } from "react-router-dom";

// export default function AppLayout(){
//     return(
//         <div>
//         <SidebarProvider>
//          <AppSidebar />
//          {/* <SidebarTrigger /> */}
//         </SidebarProvider>
//         <main>
//             <Outlet />
//         </main>
//         </div>
//     )
// }

import NavBar from "@/component/NavBar";
import { AppSidebar } from "@/component/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex min-h-screen w-full flex-col">
        <NavBar />

        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}