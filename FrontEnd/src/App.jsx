import { Route,Routes } from "react-router-dom"
import Homepage from "./pages/HomePage" 
import Catagory from "./pages/Catagory"
import NotFound from "./pages/NotFound"
import Currency from "./pages/Currency"
import Customer from "./pages/Customer"
import Dashboard from "./pages/Dashboard"
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


function App(){
  return(
    
    <div>
      <ThemeProvider>
    
          <Routes>

            <Route path="/login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
              <Route element={<AppLayout />}>

              <Route index element={<Homepage />} />
              <Route path="catagory" element={<Catagory />} />
              <Route path="catagory/:id"  element={<Catagory />} />
              <Route path="currency" element={<Currency />} />
              <Route path="customer" element={<Customer/>} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="items" element={<Items />} />
              <Route path="purchase" element={<Purchase />} />
              <Route path="reports" element={<Reports />} />
              <Route path="sales" element={<Sales />} />
              <Route path="units" element={<Units />} />
              <Route path="users" element={<Users />} />
              <Route path="vendor" element={<Vendor />} />

              </Route>
              <Route path="*" element={<NotFound />} />
          </Routes>
      </ThemeProvider>
      
    </div>
  )
}


export default App;
