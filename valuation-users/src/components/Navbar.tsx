import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AiOutlineMenu as Menu } from 'react-icons/Ai';
import { useNavigate } from "react-router-dom"
import Valuations from "./Valuations"
import {Children, useState} from 'react';
import React, { ReactNode } from "react";


export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex'>
        <div className='flex-1'>
          <button className=' ml-10 my-2 p-2 text-white text-[2rem] rounded-md bg-[#336b75]' onClick={() => setNavbarOpen(!navbarOpen)}><Menu/></button>
        </div>
        <div className='flex-2 h-16  flex items-center justify-center'><p className='text-[2.5vh] font-bold text-white'>i</p><p className='text-[2.5vh] font-bold text-orange-400'>A</p><p className='text-[2.5vh] font-bold text-purple-600 mr-2'>D</p> <p className='text-[#474747] text-[1.5rem] font-bold'>Dashboard</p></div>
        <div className='flex-1 invisible'>Empty div</div>
      </div>
      <div className='flex-1 flex flex-row relative'>
        <div className={navbarOpen ? 'border-t-2 border-r-2 border-[#2e6788] absolute rounded-md h-full bg-gradient-to-b from-[#b1d4d6] via-[#bbd2ddd2] to-[#a3aab4] font-bold w-32 transition-all duration-700 ease-out text-center space-y-8' 
        : 
        'border-t-2 border-r-2 border-[#2e6788] absolute rounded-md h-full bg-gradient-to-b from-[#b1d4d6] via-[#bbd2ddd2] to-[#a3aab4] font-bold w-32 transition-all duration-700 ease-out text-center space-y-8 -ml-32'}>
          <div className='text-[#474747] font-serif text-[1.2rem] mt-6 border-b-2 border-transparent hover:border-b-2 hover:border-yellow-400 hover:h-auto'> vertical navbar</div>
          <button className='text-[#474747] font-serif text-[1.2rem] border-b-2 border-transparent hover:border-yellow-400'>Home</button>

          <button className='text-[#474747] font-serif text-[1.2rem] border-b-2 border-transparent hover:border-yellow-400 '  onClick={() => navigate("/valuations")}>Valuations</button>
      
          <button className='text-[#474747] font-serif text-[1.2rem] border-b-2 border-transparent hover:border-yellow-400'>Register</button>
        </div>
        <div className='border-t-2 border-[#2e6788] flex-1'>
          <div className='h-full flex justify-center items-center'>
              ok
          </div>
        </div>
      </div>
    </div>
  );
}