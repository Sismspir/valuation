import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import Valuations from "./components/Valuations";
import Navbar from "./components/Navbar";

function App() {
  return (
    
    <div className="bg-gradient-to-r from-[#b1d4d6] via-[#bbd2ddd2] to-[#a3aab4]"> 
        <Navbar/>
        <Routes>
          <Route path="/valuations" element={<Valuations/>}/>
        </Routes>
    </div>
  )
}

export default App
