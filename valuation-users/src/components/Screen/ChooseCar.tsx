import { IoIosArrowDropdownCircle } from "react-icons/io";
import { GrRotateLeft } from "react-icons/gr";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { TbRotate360 } from "react-icons/tb";
import { GiGearStick } from "react-icons/gi";
import { BsFuelPumpFill } from "react-icons/bs";
import { GiBodyHeight } from "react-icons/gi";
import { ImTextWidth } from "react-icons/im";
import { ToastContainer, toast } from 'react-toastify';
import { TbRulerMeasure } from "react-icons/tb";
import { useEffect, useState, FormEvent, useRef } from 'react';
import { useTheme } from '../Context/ThemeContext';
import { Controller } from 'swiper/modules';
import  Skeleton  from './Skeleton';
import Loading from './Loading';
import axios  from 'axios';

import gsap from 'gsap';
import { Navigation, Pagination, Scrollbar, A11y} from 'swiper/modules';
import '../../assets/index.css';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Icar {
    [key:string]: string; 
  }

function ChooseCar() {

    const [img, setImg] = useState<string>();
    const [separatedImages, setSeparatedImages] = useState<string[]>([]);
    const [tempIndex, setTempIndex] = useState<number>(0);
    const [allImages, setAllImages] = useState<string[]>([]);
    const [moreSeparatedImages, setMoreSeparatedImages] = useState<string[]>([]);
    const [specsShown, setSpecsShown] = useState<boolean>(true);
    const [carSpecs, setCarSpecs] = useState<Icar>()
    const [loading, setLoading] = useState<boolean>(false);
    const [rotated, setRotated] = useState<boolean>(true);
    const { isDarkMode, toggleTheme } = useTheme();
   
    const getCar = async (e: FormEvent<HTMLFormElement>) => {

        const input = e.currentTarget.typ.value;  

        e?.preventDefault();

        setLoading(true);

        try {

          const response = await axios.post(`http://localhost:3000/choose/car`, { "typnatcode": input});

          setImg(response.data[0].imageLink);

          setCarSpecs(response.data[0]);

        } catch (err) {
          console.log(err);

          const notify = () => toast(`Car with typnatcode: ${input} is not "Open" or it does not exist!`);

          notify();
        }

        setLoading(false);
      };

    const handleSpecs = () => {
        setSpecsShown(!specsShown);
    } 

    useEffect(() => {
      
      const separated = img?.split(',').map((image) => image.trim());
      
      if (separated) {
        setAllImages(separated);
        const middleOfImages =  Math.ceil(separated.length/2);
        setSeparatedImages(separated.slice(0, middleOfImages));
        setMoreSeparatedImages(separated.slice(middleOfImages));
      };

    }, [img]);

    // Animation code
    
    const turnPage = async() => {

      const page = document.querySelector('.page');

      const content = document.querySelectorAll('.content');

      if (rotated === false) {
     
        await gsap.to(page, { duration: 0.4, rotationY: '90deg' });

        setRotated(!rotated);
        // Start rotating the content back to its original position
        gsap.set(content, { rotationY: '-90deg' });

        // Second half of the page rotation (90 to 180 degrees) and content rotation (90 to 0 degrees)
        await gsap.to(page, { duration: 0.4, rotationY: '180deg' });

        gsap.to(content, { duration: 0.0001, rotationY: '0deg' });

        // Reset page rotation for next turn
        gsap.set(page, { rotationY: '0deg' });

      } else {    

        await gsap.to(page, { duration: 0.4, rotationY: '-90deg' });

        setRotated(!rotated);
        // Start rotating the content back to its original position
        gsap.set(content, { rotationY: '+90deg' });

        // Second half of the page rotation (90 to 180 degrees) and content rotation (90 to 0 degrees)
        await gsap.to(page, { duration: 0.4, rotationY: '-180deg' });

        gsap.to(content, { duration: 0.0001, rotationY: '0deg' });

        // Reset page rotation for next turn
        gsap.set(page, { rotationY: '0deg' });

      }      
    };

    const addThousandSeparator = (number: number) => {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return(
        <div>
            <div>
                <ToastContainer
                position="top-right"
                newestOnTop={false}
                limit={4}
                theme="light"/>
            </div>
            <div className='flex flex-col items-center space-y-24 mt-5 '>
                <form onSubmit={getCar} className="text-center h-[2rem] w-[14rem] rounded-md" >
                    <input type="text" className="border-2 border-[#2e3875] text-center h-[3.5rem] rounded-full focus:outline-none" name="typ" placeholder="Enter typnatcode" />
                    <input type="submit" className='bg-slate-800 w-[6vw] min-w-[6rem] mt-3 p-1 border-2 border-[#8f93a8] rounded-md text-center font-semibold text-[#ffffff] hover:bg-[#8ca3c5] hover:text-black hover:border-[#153d5e] hover:italic shadow-btnShadow flex-2' value="Search"/>
                </form>
                { loading ? ( rotated ? <Loading/> : <Skeleton/> ) : img ?
                rotated ?
                <div  
                className={'page sm:h-[42rem] md:h-[30rem] lg:h-[25rem] min-h-[25rem] lg:w-[62rem] md:w-[33rem] sm:w-[22rem]  border-2 border-[#5f5c5c] bg-[#ffffff] shadow-btnShadow flex sm:flex-col md:flex-row lg:flex-row relative'}>
                        {/* ---------------- White Car DIV -------------- */}
                        <div className='lg:w-1/2 md:w-1/2 sm:w-full h-full flex justify-center items-center content'>
                            <Swiper
                              className="sm:h-4/5 md:h-3/5 lg:h-full lg:border-r-2 lg:border-b-0 md:border-r-2 md:border-b-0 sm:border-b-2 sm:border-r-0 border-[#613c1e]"
                              modules={[Navigation, Pagination, Scrollbar, A11y]}
                              spaceBetween={10}
                              slidesPerView={1}
                              pagination={{ clickable: true }}
                              navigation
                            > 
                              {separatedImages.map((image)=> 
                                <SwiperSlide key={image}>
                                  <img 
                                    className="sm:h-full md:h-3/4 lg:h-3/4 w-3/4 sm:pb-2 md:p-0 m-auto text-center"
                                    src={image}
                                    alt={`Slide ${tempIndex}`}
                                /> 
                                <div className="h-[2rem] invisible" slot="wrapper-end">ok</div>
                            </SwiperSlide>)
                            }
                          </Swiper>
                        </div>
                        {/*Info DIV */} 
                        <div className='content sm:w-full md:w-1/2 lg:w-1/2 h-full flex flex-col lg:space-y-8 md:space-y-5 sm:space-y-5 sm:mt-0 md:mt-5 lg:mt-0'>
                            {/*Show specs */} 
                            <div className="flex justify-between items-center">
                              <div className='flex-1'></div>                              
                              { specsShown ?
                                <div className='flex-1 flex justify-center lg:mt-3'>
                                    <span className='italic text-base font-medium text-[#323358]'>Show specs</span> <button onClick={() => handleSpecs()} className='my-auto mx-1 text-2xl text-[#4069a5]'><IoIosArrowDropdownCircle /></button>
                                </div> : 
                                <div className='flex-1 flex justify-center lg:mt-3'>
                                {/*Hide specs */}
                                <span className='italic text-base font-medium text-[#323358]'>Hide specs</span> <button onClick={() => handleSpecs()} className='my-auto mx-2 text-2xl text-[#4069a5] '><IoIosArrowDropupCircle /></button>
                                </div>
                              }
                              <div className="flex-1 text-center flex justify-between"> <div className="w-1/2"></div><button onClick={() => turnPage()} className="italic text-4xl font-medium text-[#323358]"><GrRotateLeft /></button></div>
                            </div>
                            <div className="bg-[#eceef3] rounded-xl h-1/4 mx-[2vw] flex flex-col shadow-btnShadow">

                                <div className='flex space-x-8 mx-auto my-auto'>

                                    <div className='flex flex-col border-r-2 lg:pr-[0.6rem] md:pr-[0.6rem] sm:pr-0 border-[#504c4c] h-3/4 my-auto'>
                                        <div className='text-[#202020] text-[0.9rem] font-thin mx-2'>Introduced in {carSpecs?.YEAR}</div>
                                        <div className='text-blue-800 lg:text-[1.25rem] md:text-[1.05rem] sm:text-[1.05rem] font-bold mb-2 mx-2'>{carSpecs?.makname + " - " + carSpecs?.modnamegrp1}</div>
                                    </div>
                                    <div className='flex flex-col w-1/3 mt-2 sm:space-y-2 md:space-y-1 lg:space-y-2 text-[#202020] lg:text-[0.85rem] md:text-[0.70rem] sm:text-[0.70rem] font-bold sm:pr-4.5 md:pr-0 lg:pr-4.5'>
                                        <div className=''>
                                            {"HP: " + carSpecs?.HP}
                                        </div>
                                        <div className=''>
                                            {"KW: " + carSpecs?.KW}
                                        </div>
                                        <div className=''>
                                            {"C02: " + carSpecs?.CO2}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {specsShown ?
                            <div className='text-[#252424] text-[0.95rem] text-center font-medium mx-[2rem] w-10/12 my-4'>
                            We are talking about the <span className='italic font-bold'>{carSpecs?.typinfo}</span> model. Its accelaration is (0-100 km/h) in <span className='italic font-bold'>{carSpecs?.tcoaccel + "s"} </span> and it weights <span className='italic font-bold'>{carSpecs?.typtotwgt + "kg"}</span>
                            {/*Show height - length - width */} 
                            </div> :
                                <div className={`flex shadow-btnShadow text-[#110d22] lg:text-[0.95rem] md:text-[0.82rem]  sm:text-[0.72rem] mx-[1rem] my-3 bg-[#eceef3]`}>
                                    <div className='rounded-md flex flex-col w-1/2 my-2 space-y-2 items-center'>
                                        <div className='flex space-x-2'>
                                        <span className='text-xl'><GiBodyHeight/></span> <p className='italic font-bold'>{"Height: " + carSpecs?.typheight + " mm"}   
                                        </p>
                                        </div> 
                                        <div className='flex space-x-2'>
                                        <span className='text-xl'><ImTextWidth />
                                        </span> <p className='italic font-bold'>{"Width: " + carSpecs?.typwidth + " mm"}   
                                        </p>
                                        </div>
                                        <div className='flex space-x-2'>
                                        <span className='text-xl'><TbRulerMeasure />
                                        </span> <p className='italic font-bold'>{"Length: " + carSpecs?.typlength + " mm"}   
                                        </p>
                                        </div>
                                    </div> 
                                    <div className='rounded-md flex flex-col w-1/2 my-auto space-y-3 lg:text-[0.95rem] md:text-[0.82rem]  sm:text-[0.72rem]'>
                                        <div className='flex space-x-2'>
                                        <span className='text-xl'><BsFuelPumpFill/></span> <p className='italic font-bold'>{"Fuel: " + carSpecs?.Fuel}   
                                        </p>
                                        </div> 
                                        <div className='flex'>
                                        <span className='text-2xl'><GiGearStick/>
                                        </span> <p className='italic font-bold'>{"Transition: " + carSpecs?.Transition}   
                                        </p>
                                        </div>
                                    </div> 
                                </div> 
                            }
                            <div className="bg-[#eceef3] rounded-xl h-max w-1/2 my-4 mx-auto flex flex-col shadow-btnShadow">
                                    <div className='my-auto mx-auto '>
                                        <div className='text-[#245c75] lg:text-[1.25rem] md:text-[1.15rem] sm:text-[1.15rem] font-bold mx-2 '>{"Cost " +  addThousandSeparator(parseInt(carSpecs?.prinp1 as string)) + "€"}</div>
                                    </div>                                    
                            </div> 
                        <div>
                    </div>
                </div>
            </div> : 
            (<div className={`page h-[20rem] sm:h-[42rem] md:h-[30rem] lg:h-[26rem] min-h-[25rem] lg:w-[62rem] md:w-[34rem] sm:w-[23rem] border-2 border-[#5f5c5c] bg-[#1f1d1d] shadow-btnShadow flex sm:flex-col md:flex-row lg:flex-row relative`}>
                  {/*------------------- Black Car DIV ------------------- */}
                  <div className='mx-auto content w-1/2 h-full flex lg:w-1/2 md:w-1/2 sm:w-11/12 justify-center items-center md:ml-2 lg:ml-0 '>
                        <Swiper
                        className="bg-[#3a3636] border-2 border-[#2e2b29] md:h-3/5 lg:h-full lg:border-r-2 lg:border-b-0 md:border-r-2 md:border-b-0 sm:border-b-2 sm:border-r-0"
                        modules={[Navigation, Pagination, Scrollbar, A11y, Controller]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        navigation
                       > 
                          {moreSeparatedImages.map((img, i) => 
                          <SwiperSlide key = {i}>
                            <img 
                              className="lg:mb-2 lg:h-full md:pt-1 md:px-1 md:h-4/5 sm:p-1"
                              src={img}
                              alt={`${i}`}
                          /> 
                          {moreSeparatedImages.length > 1 && <div className="h-[2rem] invisible" slot="wrapper-end">ok</div>}
                          </SwiperSlide>)}                            
                      </Swiper>
                  </div>
                <div className='content sm:w-full md:w-1/2 lg:w-1/2 h-full flex flex-col lg:space-y-5 md:my-3 md:mx-2 sm:space-y-5'>
                {/* ------ Specs ------- */} 
                <div className="flex justify-between items-center">
                      <button
                        onClick={turnPage}
                        className="absolute top-0 right-0 sm:px-4 md:px-3 lg:px-4 py-2 bg-[#383c3d] text-white sm:text-2xl md:text-xl lg:text-2xl rounded-bl-md transition-colors duration-300 hover:bg-[#866549] focus:outline-none"
                      >
                        <TbRotate360 />
                      </button>
                      <div className="ml-2 bg-[#333742] rounded-xl h-full mt-2 w-3/4 flex flex-col shadow-btnShadow border-2 border-[#9ebed1]">
                          <div className='flex space-x-8 mx-auto my-auto'>
                              <div className='flex flex-col h-full my-auto text-center'>
                                  <div className='text-[#ffffff] text-[0.9rem] font-thin mx-2'>Introduced in {carSpecs?.YEAR}</div>
                                  <div className='text-[#eb784b] mb-1 mx-2'><span className="text-[.95rem] font-bold">{carSpecs?.makname + " - "}</span><span className="text-[0.9rem] font-semibold">{carSpecs?.typinfo}</span></div>
                              </div>
                          </div>
                      </div>
                      </div>
                      <div className="mx-2 bg-[#333742] rounded-xl w-4/4 sm:h-[14rem] md:h-[19rem] lg:h-[18rem] flex shadow-btnShadow border-2 border-[#a6bac5] sm:text-[0.88rem] md:text-[0.87rem] lg:text-[0.95rem]">
                            <div className='flex flex-col w-1/2 border-[#d8dee2] border-r space-y-2 space-x-2 items-start justify-center text-[#ffffff] font-semibold'>
                                <div className="mx-2">
                                    {"HP: " + carSpecs?.HP}
                                </div>
                                <div className=''>
                                    {"KW: " + carSpecs?.KW}
                                </div>
                                <div className=''>
                                    {"C02: " + carSpecs?.CO2}
                                </div>
                                <div className=''>
                                    {"Body Type: " + carSpecs?.BodyType}
                                </div>
                                <div className=''>
                                    {"Fuel: " + carSpecs?.Fuel}
                                </div>
                                <div className=''>
                                    {"Transition: " + carSpecs?.Transition}
                                </div>
                                <div className=''>
                                    {"Acceleration: " + carSpecs?.tcoaccel + " s"}
                                </div>
                            </div>
                            <div className='flex flex-col w-1/2'>
                                <div className="flex flex-col h-3/4">
                                  <div className="text-[#ffffff] font-semibold items-center justify-center text-center border-b-2 italic">
                                      Dimensions
                                  </div>
                                  <div className="text-[#ffffff] font-normal space-y-1 text-center mt-1 mb-1">
                                    <div className=''>
                                    {"Height: " + carSpecs?.typheight + " mm"}   
                                    </div>
                                    <div className=''>
                                    {"Width: " + carSpecs?.typwidth + " mm"}
                                    </div>
                                    <div className=''>
                                    {"Length: " + carSpecs?.typlength + " mm"} 
                                    </div>
                                  </div>
                                </div>
                                <div>
                                <div className="text-[#ffffff] font-semibold py-[0.12rem] text-center border border-b italic">
                                    Specifications
                                </div>
                                <div className="text-[#ffffff] font-normal space-y-2 text-center my-1">
                                    <div className=''>
                                    {"Weight: " + carSpecs?.typtotwgt + " kg"}   
                                    </div>
                                    { carSpecs &&
                                    <div className='mx-auto'>
                                    {"Κατανάλωση: " + carSpecs["Κατανάλωση καυσήμου"] + (carSpecs["Fuel"] !== "Ηλεκτρισμός (Μπαταρία)" ? " L/ 100km" : " kWh/ 100km")}
                                    </div>}
                                  </div>
                                </div>
                                <div className="flex flex-col h-1/4 border-t-2 sm:py-[0rem] md:py-[0.5rem] sm:mb-5 md:mb-0 border-[#c7cdda] items-center justify-center">
                                  <div className='text-[#bee9cf] lg:text-[1.22rem] font-bold mx-2 shadow-inner shadow-slate-700 p-1'>{"Cost " +  addThousandSeparator(parseInt(carSpecs?.prinp1 as string)) + "€"}</div>
                                  </div>
                            </div>
                      </div>
                  </div>
          </div>) : <></> } 
        </div> 
    </div>
)
}
export default ChooseCar;