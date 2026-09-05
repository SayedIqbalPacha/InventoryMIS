import { useNavigate } from "react-router-dom";

function Homepage(){
   const navigate = useNavigate();
    return(
        <div onClick={()=>{navigate("login")}} className="w-20 h-20 bg-amber-400">HomePage</div>
    )
}
export default Homepage;