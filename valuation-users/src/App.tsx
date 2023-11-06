import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import Valuations from "./components/Valuations";
import Navmenu from "./components/Navmenu";
import Navbar from './components/Navbar';
import { AiOutlineMenu as Menu } from 'react-icons/Ai';
import React, {Children, useState, ReactNode} from 'react';

function App() {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <div className="bg-gradient-to-r from-[#b1d4d6] via-[#bbd2ddd2] to-[#a3aab4]"> 
      <div className='flex flex-col min-h-screen'>
      <Navmenu setNavbar={toggleNavbar}></Navmenu>
      <div className=''>
        <div className={navbarOpen ? 'border-t-2 border-r-2 border-[#2e6788] absolute rounded-md  bg-gradient-to-b from-[#b1d4d6] via-[#bbd2ddd2] to-[#a3aab4] font-bold w-32 transition-all duration-700 ease-out text-center space-y-8 min-h-screen' 
        : 
        'border-t-2 border-r-2 border-[#2e6788] absolute rounded-md bg-gradient-to-b from-[#b1d4d6] via-[#bbd2ddd2] to-[#a3aab4] font-bold w-32 transition-all duration-700 ease-out text-center space-y-8 -ml-32'}>
          <div className='text-[#474747] font-serif text-[1.2rem] mt-6 pb-6 border-b-2 border-[#2e6788] italic'> Options</div>
          <button className='text-[#474747] font-serif text-[1.2rem] border-b-2 border-transparent hover:border-[#7bb0cf]'>Home</button>

          <button className='text-[#474747] font-serif text-[1.2rem] border-b-2 border-transparent hover:border-[#7bb0cf]' onClick={() => navigate("/valuations")}>Valuations</button>
      
          <button className='text-[#474747] font-serif text-[1.2rem] border-b-2 border-transparent hover:border-[#7bb0cf]'>Register</button>
        </div>
        </div>
        <div className='border-t-2 border-[#2e6788] flex-1'>
          <div className='h-full flex justify-center items-center'>
              <Routes>
                <Route path="/valuations" element={<Valuations/>}></Route>
              </Routes>
          </div>
        </div>
      </div>
      </div>
  )
}

export default App
