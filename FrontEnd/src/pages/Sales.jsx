import { ChartBase } from "@/component/ChartBase";
import { LoginSignup } from "@/component/LoginSignup";
import { MyCard } from "@/component/MyCard";
function SalesPage(){
    return(
        <div className="flex px-5 py-2 mx-2  items-center">SalesPage
             <div className="w-72 h-72 px-4 ">
                <ChartBase></ChartBase>
                    
            </div>
            <div>
                <MyCard />
            </div>

            <div className="mx-4 w-[600px]">
                <LoginSignup />
            </div>
        </div>
    )
}
export default SalesPage;