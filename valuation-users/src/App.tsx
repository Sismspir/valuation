import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/UserManagment/Login';
import Register from './components/UserManagment/Register';
import ShowValuations from "./components/Screen/ShowValuations";
import ProtectedRoutes from './components/Routes/ProtectedRoutes';
import Percentages from './components/Screen/Percentages';
import Navmenu from "./components/Navbars/Navmenu";
import Home from "./components/Screen/Home";
import { BiSolidPurchaseTag as Purch } from 'react-icons/Bi';
import { AiTwotoneHome as HomeIc } from 'react-icons/Ai';
import { FaPercentage as Percentage } from 'react-icons/Fa';
import { CiLogout as Logout} from "react-icons/ci";
import { useState, useEffect } from 'react';

function App() {
  const navItemsClass = 'w-full text-[#1c4055] font-serif text-[1.2rem] border-b-2 border-transparent hover:border-[#5380c5]';
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userLoggedIn, setUserIsLoggedIn] = useState<string>("");
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };
  // change the "isLoggedIn variable when a user logs in"
  useEffect(() => {
    if(userLoggedIn.trim() !== "") {
      setIsLoggedIn(true);
      console.log("Sbdy is logged in");
    } else {
      setIsLoggedIn(false);
    }
  }, [userLoggedIn])

  return (
    <div className="relative">
      <div className='flex flex-col'>
        <div className='flex flex-col h-screen'>
          <Navmenu setNavbar={toggleNavbar}></Navmenu>

          {/* This is my vertical navbar */}
          <div className={`z-10 border-t-2 border-b-2 border-r-2 border-[#618ba3] rounded-r-md  bg-gradient-to-b from-[#f0f2f5] via-[#ced6e4d2] to-[#c9d3d8] font-bold w-36 transition-all duration-700 ease-out text-center space-y-8 h-full ${navbarOpen ? '' : '-ml-36'}`}>

            <div className='text-[#234352] font-serif text-[1.2rem] mt-6 pb-6 border-b-2 border-[#23556e] italic'> Hello {userLoggedIn}
            </div>
            {isLoggedIn && <>
            <button onClick={() => navigate("/home")} className={navItemsClass}><div className='flex flex-row items-ceneter justify-center space-x-2'> <p>Home</p> <span className='mt-1'><HomeIc/></span> </div> </button>
            <button className={navItemsClass} onClick={() => navigate("/valuations")}><div className='flex flex-row items-center justify-center space-x-1'><p>Valuations</p><span className=' mt-1'><Purch/></span></div></button>
            <button onClick={() => navigate("/getpercentages")} className={navItemsClass}> <div className='flex flex-row items-center justify-center space-x-0.5'><p>Percentages</p><Percentage/></div></button>
            <button onClick={() => {navigate("/"), setIsLoggedIn(false); }} className={navItemsClass}> <div className='flex flex-row items-center justify-center space-x-2.5'><p>Log out</p><Logout/></div></button>
            </> 
            }
          </div>
        </div>
        <div className='mt-[5rem] w-full absolute flex justify-center'>
          <div id="table-content">
              <Routes>  
                <Route path="/" element={<Login updateUser={setUserIsLoggedIn}/>} />
                  <Route path="/home"  element={<Home />} />
                  <Route path="/valuations" element={<ShowValuations />}/>
                  <Route path="/getpercentages" element={<Percentages/>}/>
                  <Route path="/register" element={<Register/>}/>
              </Routes>
          </div>
        </div>
      </div>
  </div>
  
  )
}

export default App
