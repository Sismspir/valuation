import { AiOutlineMenu as Menu } from 'react-icons/Ai';
import { useTheme } from '../Context/ThemeContext';
import { FaMoon as Moon} from "react-icons/Fa";
import { FaRegSun as Sun} from "react-icons/fa6";
import { useContext, useState } from 'react';


function Navmenu( { setNavbar }: any) {

    const { isDarkMode, toggleTheme } = useTheme();
    console.log(isDarkMode);

return(
        <div className={`flex min-w-screen border-b-2 ${ isDarkMode ? "border-[#dce4e8]" : "border-[#2e6788]"} font-[Georgia]`}>
            <div className='flex-1'>
                <button className={`sm:ml-8 md:ml-16 my-4 p-2 text-white text-[2rem] rounded-md bg-[#153d5e] border-2 ${ isDarkMode ? "border-[#8492b2]" : "border-[#1c4055]"}`} onClick={setNavbar}><Menu/></button>
            </div>
            <div className='sm:flex-shrink-0 md:flex-1 invisible border-2 border-black'></div>
            <div className='sm:flex-shrink-0 md:flex-1 h-16 flex items-center justify-center mt-3'><p className={`text-[2rem] font-bold ${ isDarkMode ? "text-[#bbc8db]" : "text-[#5f6c80]"}`}>i</p><p className={`text-[2rem] font-bold ${ isDarkMode ? "text-[#a3aabf]" : "text-[#1d3558]"}`}>A</p><p className='text-[2rem] font-bold text-[#5380c5] mr-2'>D</p> <p className={` ${ isDarkMode ? "text-[#c5cee9]" : "text-[#1d3558]"} text-[1.5rem] font-bold animated-text`}>
                <span className="inline-block animate-pulse">D</span>
                <span className="inline-block animate-pulse">a</span>
                <span className="inline-block animate-pulse">s</span>
                <span className="inline-block animate-pulse">h</span>
                <span className="inline-block animate-pulse">b</span>
                <span className="inline-block animate-pulse">o</span>
                <span className="inline-block animate-pulse">a</span>
                <span className="inline-block animate-pulse">r</span>
                <span className="inline-block animate-pulse">d</span>
                </p></div>        
            <div className='sm:flex-shrink-0 md:flex-1 invisible'></div>
           
            <div onClick={toggleTheme} className='flex-1 py-2 text-3xl text-[#223451] flex items-center justify-center'>
            { isDarkMode ?
                <div className='bg-[#92b4c6] px-3 py-2 rounded-full border-dashed border-4 border-[#112f33]'><Moon/></div> 
                :
                <div className='bg-[#b3c4cd] px-3 py-2 rounded-full border-solid border-2 border-[#3f4950]'><Sun/></div> 
            }
            </div>
        </div>
)}
export default Navmenu;