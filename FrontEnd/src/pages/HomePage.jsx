import { SalesTable } from "@/component/RecentSalesTable";
import { SalesPurchase } from "@/component/SalesPurchaseChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PackageIcon,
  ShoppingCart,
  TrendingUp,
  UsersRoundIcon,
} from "lucide-react";

function Homepage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Total Customers</CardTitle>
            <UsersRoundIcon />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">125</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Total Items</CardTitle>
            <PackageIcon />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">400</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Total Sales</CardTitle>
            <ShoppingCart />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">90000$</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg">
        <Card>
          <CardHeader className="flex justify-between">
            <CardTitle>Total Profit</CardTitle>
            <TrendingUp />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">20000$</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg">
        <SalesPurchase />
      </div>

      <div className="bg-primary-foreground p-4 rounded-lg">
        <SalesTable />
      </div>
    </div>
  );
}
export default Homepage;
