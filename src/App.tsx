import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";

function App() {
  return <Router>
    <div className="flex h-screen">
      <Sidebar/> 
    </div>
  </Router>;
}

export default App;
