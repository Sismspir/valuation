import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ShowValuations from "./components/Screen/ShowValuations";
import Percentages from './components/Screen/Percentages';
import Navmenu from "./components/Navbars/Navmenu";
import Home from "./components/Screen/Home";
import { useState } from 'react';

function App() {
  const navItemsClass = 'w-full text-[#1c4055] font-serif text-[1.2rem] border-b-2 border-transparent hover:border-[#5380c5]';
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <div className="relative">
      <div className='flex flex-col'>
        <div className='flex flex-col h-screen'>
          <Navmenu setNavbar={toggleNavbar}></Navmenu>
          {/* This is my vertical navbar */}
          <div className={`z-10 border-t-2 border-b-2 border-r-2 border-[#618ba3] rounded-r-md  bg-gradient-to-b from-[#f0f2f5] via-[#ced6e4d2] to-[#c9d3d8] font-bold w-32 transition-all duration-700 ease-out text-center space-y-8 h-full ${navbarOpen ? '' : '-ml-32'}`}>
            <div className='text-[#234352] font-serif text-[1.2rem] mt-6 pb-6 border-b-2 border-[#23556e] italic'> Options</div>
            <button onClick={() => navigate("/home")} className={navItemsClass}>Home</button>
            <button className={navItemsClass} onClick={() => navigate("/valuations")}>Valuations</button>
            <button onClick={() => navigate("/getpercentages")} className={navItemsClass}>Get Percentages</button>
          </div>
        </div>
        <div className='mt-[5rem] w-full absolute flex justify-center'>
          <div id="table-content">
              <Routes> 
                <Route path="/home" element={<Home />}/>
                <Route path="/valuations" element={<ShowValuations />}/>
                <Route path="/getpercentages" element={<Percentages/>}/>
              </Routes>
          </div>
        </div>
      </div>
  </div>
  
  )
}

export default App
