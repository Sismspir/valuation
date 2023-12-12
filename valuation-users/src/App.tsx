import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useTheme } from './components/Context/ThemeContext';
import Login from './components/UserManagment/Login';
import Register from './components/UserManagment/Register';
import ShowValuations from "./components/Screen/ShowValuations";
import ProtectedRoutes from './components/Routes/ProtectedRoutes';
import Equipments from './components/Screen/Equipments';
import Percentages from './components/Screen/Percentages';
import Navmenu from "./components/Navbars/Navmenu";
import Casco from "./components/Screen/Casco";
import Home from "./components/Screen/Home";
import { BsTools } from "react-icons/bs";
import { BiSolidPurchaseTag as Purch } from 'react-icons/Bi';
import { FaPercentage as Percentage } from 'react-icons/Fa';
import { AiTwotoneHome as HomeIc } from 'react-icons/Ai';
import { CiLogout as Logout} from "react-icons/ci";
import { FaCar as Car} from "react-icons/Fa";
import { useState, useEffect } from 'react';



function App() {
  const navItemsClass = 'w-full text-[#1c4055] font-serif text-[1.2rem] border-b-2 border-transparent hover:border-[#5380c5]';
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userLoggedIn, setUserLoggedIn] = useState<string>("");
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false); 
  const navigate = useNavigate();
  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };
  // change the "isLoggedIn variable when a user logs in"
  useEffect(() => {
    if(userLoggedIn.trim() == "") {
      setIsLoggedIn(false);
      console.log("Nobody is logged in");

    } else {
      setIsLoggedIn(true);
      console.log(`Sbdy is logged in, and this is the name ${userLoggedIn}`);
    }
  }, [isLoggedIn, userLoggedIn])

  //toogle between darkModes
  const { isDarkMode, toggleTheme } = useTheme();
  console.log(isDarkMode);

  return (
    <div className={` ${isDarkMode && "relative bg-gradient-to-b from-[#1a444a] via-[#0e1352d2] to-[#f0f2f5]"}`}>
      <div className='flex flex-col'>
        <div className='flex flex-col h-screen'>
        
          <Navmenu setNavbar={toggleNavbar}></Navmenu>

          {/* This is my vertical navbar */}
            <div className={`z-10 border-t-2 border-b-2 border-r-2 ${isDarkMode ? "text-[#c9d7dc] bg-gradient-to-b from-[#1a444a] via-[#0e1352d2] to-[#f0f2f5]" : "text-[#234352] border-[#618ba3] rounded-r-md  bg-gradient-to-b from-[#f0f2f5] via-[#ced6e4d2] to-[#c9d3d8]"} font-bold w-52 transition-all duration-700 ease-out text-center space-y-8 h-full min-h-20vh ${navbarOpen ? '' : '-ml-52'}`}>

              <div className={`font-serif text-[1.3rem] mt-6 pb-6 bg-gradient-to border-b-2 ${ isDarkMode ? "border-[#f1f4f6]" : "border-[#23556e]"} italic`}> Hello {userLoggedIn}
              </div>
                  {isLoggedIn && <>
                  <button onClick={() => navigate("/home")} className={navItemsClass}><div className={`${isDarkMode ? "text-[#c9d7dc]" : ""} flex flex-row items-ceneter justify-center space-x-2`}> <p className='text-[1.4rem]'>Home</p> <span className='mt-1'><HomeIc/></span> </div> </button>
                  <button className={navItemsClass} onClick={() => navigate("/valuations")}><div className={`${isDarkMode ? "text-[#c9d7dc]" : ""} flex flex-row items-ceneter justify-center space-x-2`}><p className='text-[1.4rem]'>Valuations</p><span className=' mt-1'><Purch/></span></div></button>
                  <button onClick={() => navigate("/getpercentages")} className={navItemsClass}> <div className={`${isDarkMode ? "text-[#c9d7dc]" : ""} flex flex-row items-center justify-center space-x-1`}><p className='text-[1.4rem]'>Percentages</p><Percentage/></div></button>
                  <button onClick={() => navigate("/casco")} className={navItemsClass}> <div className={` ${isDarkMode ? "text-[#c9d7dc]" : ""} flex flex-row items-center justify-center space-x-2`}><p className='text-[1.4rem]'>Casco</p><Car/></div></button>
                  <button onClick={() => navigate("/equip")} className={navItemsClass}> <div className={` ${isDarkMode ? "text-[#c9d7dc]" : ""} flex flex-row items-center justify-center space-x-2`}><p className='text-[1.4rem]'>Equipments</p><BsTools/>
                  </div></button>
                  <button onClick={() => {navigate("/"), setUserLoggedIn(''); }} className={navItemsClass}> <div className={`${isDarkMode ? "text-[#c9d7dc]" : ""} flex flex-row items-center justify-center space-x-2.5`}><p className='text-[1.4rem]'>Log out</p><Logout/></div></button>
                  </> 
                  }
            </div>
          </div>

          <div className='mt-[5rem] w-full absolute flex justify-center'>
            <div id="table-content">
                <Routes>  
                  <Route index path="/login" element={<Login updateUser={setUserLoggedIn}/>} />
                  <Route path="/register" element={<Register/>}/>
                  <Route path="/" element={<ProtectedRoutes loggedIn={isLoggedIn}/>}>
                    <Route path="/home" element={<Home/>} />
                    <Route path="/valuations" element={<ShowValuations />}/>
                    <Route path="/getpercentages" element={<Percentages/>}/>
                    <Route path="/casco" element={<Casco/>}/>
                    <Route path="/equip" element={<Equipments/>}/>
                  </Route>
                </Routes>
            </div>    
          </div>
      </div>
  </div>
  
  )
}

export default App
