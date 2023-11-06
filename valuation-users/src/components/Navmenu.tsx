import React, { ReactNode } from "react";
import { AiOutlineMenu as Menu } from 'react-icons/Ai';


function Navmenu( { setNavbar }: any) {

return(
        <div className='flex '>
            <div className='flex-1'>
                <button className=' ml-10 my-2 p-2 text-white text-[2rem] rounded-md bg-[#6e87cc]' onClick={setNavbar}><Menu/></button>
            </div>
            <div className='flex-2 h-16  flex items-center justify-center'><p className='text-[2rem] font-bold text-[#5f6c80]'>i</p><p className='text-[2rem] font-bold text-[#1d3558]'>A</p><p className='text-[2rem] font-bold text-[#5380c5] mr-2'>D</p> <p className='text-[#474747] text-[1.5rem] font-bold'>Dashboard</p></div>
            <div className='flex-1 invisible'>Empty div</div>
        </div>
)}
export default Navmenu;