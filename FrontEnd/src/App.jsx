import Button from "./services/ui/Button"
function App() {

  return (
    <>
      <Hello />
    </>
  )
}

function Hello(){
  return <div>
     <h1 className="text-yellow-400 font-semibold text-center text-[23px] mt-[5rem]">hello world</h1>
     <button className="button">Click-Here</button>
     <br></br>
     <Button>new button</Button>
  </div>
}
export default App;
