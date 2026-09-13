import {SalesTable} from "@/component/RecentSalesTable";
import { SalesPurchase } from "@/component/SalesPurchaseChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import{DollarSign,UserGroup} from "lucide-react";
// https://www.figma.com/community/file/1679121787285052191/school-management-system-website?fuid=1679110918066556664
function Homepage(){
    return(
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
            
            <div className="bg-primary-foreground p-4 rounded-lg">
             <Card>
                <CardHeader className="flex justify-between">
                    <CardTitle>Total Customers</CardTitle>
                  <UserGroup />
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">125</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-primary-foreground p-4 rounded-lg">
              <Card>
                <CardHeader>
                    <CardTitle>Total Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">400</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-primary-foreground p-4 rounded-lg">
                <Card>
                <CardHeader>
                    <CardTitle>Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">90000$</p>
                </CardContent>
              </Card>
            </div>


            <div className="bg-primary-foreground p-4 rounded-lg">
                <Card>
                <CardHeader>
                    <CardTitle>Total Profit</CardTitle>
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
    )
}
export default Homepage;