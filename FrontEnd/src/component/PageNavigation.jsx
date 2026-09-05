import { NavLink } from "react-router-dom";

const navigation = [
  { name: "HomePage", path: "/" },
  { name: "Category", path: "/catagory" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Customer", path: "/customer" },
  { name: "Vendor", path: "/vendor" },
  { name: "Purchases", path: "/purchase" },
  { name: "Sales", path: "/sales" },
  { name: "Currencies", path: "/currency" },
  { name: "Users", path: "/users" },
  { name: "Reports", path: "/reports" },
  { name: "Items", path: "/items" },
  { name: "Login", path: "/login" },
  { name: "SignUp", path: "/signup" },
  { name: "Units", path: "/units" },
];

function PageNavigation() {
  return (
    <nav>
      {navigation.map((item) => (
        <NavLink
          className="px-4 bg-blue-500"
          key={item.path}
          to={item.path}>

          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}

export default PageNavigation;