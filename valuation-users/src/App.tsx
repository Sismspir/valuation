import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {Children, useState } from 'react';
import Percentages from './components/Percentages';
import Valuations from "./components/Valuations";
import Navmenu from "./components/Navmenu";

function App() {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const navItemsClass = 'text-[#1c4055] font-serif text-[1.2rem] border-b-2 border-transparent hover:border-orange-700';

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <div className="relative">
      <div className='flex flex-col'>
        <div className='flex flex-col h-screen'>
          <Navmenu setNavbar={toggleNavbar}></Navmenu>
          {/* This is my vertical navbar */}
          <div className={`z-10 border-t-2 border-b-2 border-r-2 border-[#1c4055] rounded-r-md  bg-gradient-to-b from-[#b1d4d6] via-[#bbd2ddd2] to-[#d1e2e2] font-bold w-32 transition-all duration-700 ease-out text-center space-y-8 h-full ${navbarOpen ? '' : '-ml-32'}`}>
            <div className='text-[#234352] font-serif text-[1.2rem] mt-6 pb-6 border-b-2 border-[#2e6788] italic'> Options</div>
            <button className={navItemsClass}>Home</button>
            <button className={navItemsClass} onClick={() => navigate("/valuations")}>Valuations</button>
            <button onClick={() => navigate("/getpercentages")} className={navItemsClass}>Get Percentages</button>
          </div>
        </div>
        <div className='mt-[5rem] w-full absolute flex justify-center'>
          <div id="table-content">
            <Routes>
              <Route path="/valuations" element={<Valuations />}/>
              <Route path="/getpercentages" element={<Percentages/>}/>
            </Routes>
          </div>
        </div>
      </div>
  </div>
  
  )
}

export default App
