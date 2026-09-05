import { EditUser } from "@/component/EditUser";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

function UsersPage(){
    return(
        <div>
            UsersPage
            <Sheet>
                <div>
                    <SheetTrigger  render={<Button variant="outline">Edit User</Button>} />
                </div>
                <EditUser />
            </Sheet>
        </div>
    )
}
export default UsersPage;