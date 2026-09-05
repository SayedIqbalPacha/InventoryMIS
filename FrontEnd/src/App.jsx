import { Route,Routes } from "react-router-dom"
import Homepage from "./pages/HomePage" 
import Catagory from "./pages/Catagory"
import NotFound from "./pages/NotFound"
import Currency from "./pages/Currency"
import Customer from "./pages/Customer"
import Items from "./pages/Items"
import Login from "./pages/Login"
import Purchase from "./pages/Purchase"
import Reports from "./pages/Reports"
import Sales from "./pages/Sales"
import Signup from "./pages/Signup"
import Units from "./pages/Units"
import Users from "./pages/Users"
import Vendor from "./pages/Vendor"


import { ThemeProvider } from "@/components/ThemProvider"
import AppLayout from "@/pages/AppLayout"
import HomeRedirect from "@/component/HomeRedirect"
import PublicRoute from "@/component/PublicRoute"
import ProtectedRoute from "@/component/ProtectedRoute"

import {AuthProvider} from "@/contexts/AuthContext"

function App(){
  return(
    
    <div>
    <ThemeProvider>
    <AuthProvider>
          <Routes>

            {/* HOME */}
        <Route path="/" element={<HomeRedirect />}/>


            {/* PUBLIC ROUTES */}
        <Route element={<PublicRoute />}>

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />}/>

          <Route path="/forgot-password" element={<div>Forgot Password</div>}/>

        </Route>

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

              <Route path="/dashboard" element={<Homepage />} />
              <Route path="catagory" element={<Catagory />} />
              <Route path="catagory/:id"  element={<Catagory />} />
              <Route path="currency" element={<Currency />} />
              <Route path="customer" element={<Customer/>} />
              <Route path="items" element={<Items />} />
              <Route path="purchase" element={<Purchase />} />
              <Route path="reports" element={<Reports />} />
              <Route path="sales" element={<Sales />} />
              <Route path="units" element={<Units />} />
              <Route path="users" element={<Users />} />
              <Route path="vendor" element={<Vendor />} />

        </Route>
        </Route>
              <Route path="*" element={<NotFound />} />
          </Routes>
    </AuthProvider>
    </ThemeProvider>
      
    </div>
  )
}


export default App;
