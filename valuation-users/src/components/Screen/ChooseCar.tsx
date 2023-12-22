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
import Loading from './Loading';
import  axios  from 'axios';

import gsap from 'gsap';
import { Navigation, Pagination, Scrollbar, A11y} from 'swiper/modules';
import '../../assets/index.css';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Icar {
    [key:string]: string; 
  }

function ChooseCar() {

    const [img, setImg] = useState<string>();
    const [separatedImages, setSeparatedImages] = useState<string[]>([]);
    const [moreSeparatedImages, setMoreSeparatedImages] = useState<string[]>([]);
    const [specsShown, setSpecsShown] = useState<boolean>(true);
    const [carSpecs, setCarSpecs] = useState<Icar>()
    const [loading, setLoading] = useState<boolean>(false);
    const [rotated, setRotated] = useState<boolean>(false)
    const { isDarkMode, toggleTheme } = useTheme();
    console.log(isDarkMode);

    const getCar = async (e: FormEvent<HTMLFormElement>) => {

        const input = e.currentTarget.typ.value;  
        e?.preventDefault();
        setLoading(true);
        try {
          const response = await axios.post(`http://localhost:3000/choose/car`, { "typnatcode": input});
          setImg(response.data[0].imageLink);
          setCarSpecs(response.data[0]);
          console.log(response.data, response.data[0].imageLink);
        } catch (err) {
          console.log(err);
          const notify = () => toast(`Car with typnatcode: ${input} is not "Open" or it does not exist!`);
          notify();
        }
        setLoading(false);
      };

    const handleSpecs = () => {
        console.log("BTN CLICKED!", img, "spearated :", separatedImages)
        setSpecsShown(!specsShown);
    } 

    
    useEffect(() => {
      
      const separated = img?.split(',').map((image) => image.trim());
    
      if (separated) {
        const middleOfImages =  Math.ceil(separated.length/2);
        setSeparatedImages(separated.slice(0, middleOfImages));
        setMoreSeparatedImages(separated.slice(middleOfImages + 1));
      };

    }, [img]);

    // Animation code
    

    const turnPage = async() => {
      const rotationY = '-360deg'; 
     
      const page = document.querySelector('.page');
      
      if (rotated) setLoading(true);
      await gsap.to(page, { duration: 1, rotationY });
      setRotated(!rotated);

      // works only loading is true
      setLoading(false);
    };

    // Animation code

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
            <div className='flex flex-col items-center space-y-28 mt-5'>
                <form onSubmit={getCar} className="text-center h-[2rem] w-[14rem] rounded-md" >
                    <input type="text" className="border-2 border-[#2e3875] text-center h-[3.5rem] rounded-full focus:outline-none" name="typ" placeholder="Enter typnatcode" />
                    <input type="submit" className='bg-slate-800 w-[6vw] min-w-[6rem] mt-3 p-1 border-2 border-[#8f93a8] rounded-md text-center font-semibold text-[#ffffff] hover:bg-[#8ca3c5] hover:text-black hover:border-[#153d5e] hover:italic shadow-btnShadow flex-2' value="Search"/>
                </form>
                {loading ? <Loading/> : img ?
                rotated ?
                <div className='h-[20rem] min-h-[25rem] w-[65rem] border-2 border-[#5f5c5c] bg-[#ffffff] shadow-btnShadow flex relative'>
                        {/*Car DIV */}
                        <div className='w-1/2 h-full flex justify-center items-center'>
                            <Swiper
                            className="border-r-2 border-[#613c1e]"
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={20}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            scrollbar={{ draggable: true }}
                            onSwiper={(swiper) =>  swiper.slideNext()}
                            navigation
                          > 
                            {separatedImages.map(img => <SwiperSlide>
                              <img 
                                className=""
                                src={img}
                                alt="new"
                            /> 
                            <div className="h-[2rem] invisible" slot="wrapper-end">ok</div>
                            </SwiperSlide>)
                            }
                            
                          </Swiper>
                        </div>
                        {/*Info DIV */} 
                        <div className='w-1/2 h-full flex flex-col space-y-8'>
                            {/*Show specs */} 
                            <div className="flex justify-between items-center">
                              <div className='flex-1'></div>                              
                              { specsShown ?
                              <div className='flex-1 mt-4 -mb-3 flex justify-center'>
                                  <span className='italic text-base font-medium text-[#323358]'>Show specs</span> <button onClick={() => handleSpecs()} className='my-auto mx-2 text-2xl text-[#4069a5]'><IoIosArrowDropdownCircle /></button>
                              </div> : 
                              <div className='flex-1 mt-4 -mb-3 flex justify-center'>
                              {/*Hide specs */}
                              <span className='italic text-base font-medium text-[#323358]'>Hide specs</span> <button onClick={() => handleSpecs()} className='my-auto mx-2 text-2xl text-[#4069a5] '><IoIosArrowDropupCircle /></button>
                              </div>
                              }
                              <div className="flex-1 text-center flex justify-between"> <div className="w-1/2"></div><button onClick={() => turnPage()} className="italic text-4xl font-medium text-[#323358]"><GrRotateLeft /></button></div>
                            </div>
                            <div className="bg-[#eceef3] rounded-xl h-1/4 mt-5 mx-[2vw] flex flex-col shadow-btnShadow">

                                <div className='flex space-x-8 mx-auto my-auto'>

                                    <div className='flex flex-col border-r-2 pr-[0.6rem] border-[#504c4c] h-3/4 my-auto'>
                                        <div className='text-[#202020] text-[0.9rem] font-thin mx-2'>Introduced in {carSpecs?.YEAR}</div>
                                        <div className='text-blue-800 text-[1.25rem] font-bold mb-2 mx-2'>{carSpecs?.makname + " - " + carSpecs?.modnamegrp1}</div>
                                    </div>
                                    <div className='flex flex-col text-[#202020] text-[0.85rem] font-bold pr-2.5'>
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
                                <div className={`flex shadow-btnShadow text-[#110d22] text-[0.95rem] mx-[1rem] my-3 bg-[#eceef3]`}>
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
                                    <div className='rounded-md flex flex-col w-1/2 my-auto space-y-3'>
                                        <div className='flex space-x-2'>
                                        <span className='text-2xl'><BsFuelPumpFill/></span> <p className='italic font-bold text-sm'>{"Fuel: " + carSpecs?.Fuel}   
                                        </p>
                                        </div> 
                                        <div className='flex'>
                                        <span className='text-2xl'><GiGearStick/>
                                        </span> <p className='italic font-bold text-sm'>{"Transition: " + carSpecs?.Transition}   
                                        </p>
                                        </div>
                                    </div> 

                                </div> 
                            }
                            <div className="bg-[#eceef3] rounded-xl h-max w-1/2 my-4 mx-auto flex flex-col shadow-btnShadow">
                                    <div className='my-auto mx-auto '>
                                        <div className='text-[#245c75] text-[1.25rem] font-bold mx-2 '>{"Cost " +  addThousandSeparator(parseInt(carSpecs?.prinp1 as string)) + "€"}</div>
                                    </div>                                    
                            </div>
                        <div>
                    </div>
                </div>
            </div> : 
            (<div className='page h-[20rem] min-h-[25rem] w-[65rem] border-2 border-[#5f5c5c] bg-[#1f1d1d] shadow-btnShadow flex relative'>
                  {/*Car DIV */}
                  <div className='w-1/2 h-full flex justify-center items-center'>
                        <Swiper
                        className="border-r-2 border-dashed border-[#53473d]"
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        spaceBetween={20}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        onSwiper={(swiper) =>  swiper.slideNext()}
                        navigation> 
                          {moreSeparatedImages.map(img => 
                          <SwiperSlide>
                            <img 
                              className=""
                              src={img}
                              alt="new"
                          /> 
                          {moreSeparatedImages.length > 1 && <div className="h-[2rem] invisible" slot="wrapper-end">ok</div>}
                          </SwiperSlide>)}                            
                      </Swiper>
                  </div>
                <div className='w-1/2 h-full flex flex-col space-y-3 py-2'>
                {/*Show specs */} 
                <div className="flex justify-between items-center">
                  <button
                    onClick={turnPage}
                    className="absolute top-0 right-0 px-4 py-2 bg-[#383c3d] text-white text-2xl rounded-bl-md transition-colors duration-300 hover:bg-[#866549] focus:outline-none"
                  >
                    <TbRotate360 />
                  </button>
                    <div className="ml-2 bg-[#333742] rounded-xl h-full mt-2 w-3/4 flex flex-col shadow-btnShadow border-2 border-[#9ebed1]">
                                  <div className='flex space-x-8 mx-auto my-auto'>

                                      <div className='flex flex-col h-full my-auto text-center'>
                                          <div className='text-[#ffffff] text-[0.9rem] font-thin mx-2'>Introduced in {carSpecs?.YEAR}</div>
                                          <div className='text-[#eb784b] mb-2 mx-2'><span className="text-[1.25rem] font-bold">{carSpecs?.makname + " - "}</span><span className="text-[1.15rem] font-semibold">{carSpecs?.typinfo}</span></div>
                                      </div>
                                  </div>
                              </div>
                      </div>
                      <div className="mx-2 bg-[#333742] rounded-xl h-full w-4/4 flex shadow-btnShadow border-2 border-[#a6bac5]">
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
                                  <div className="text-[#ffffff] font-normal space-y-1 text-center mt-2">
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
                                    <div className=''>
                                    {"Κατανάλωση: " + carSpecs["Κατανάλωση καυσήμου"] + " L / 100km"}
                                    </div>}
                                  </div>
                                </div>
                                <div className="flex flex-col h-1/4 border-t-2 py-2 border-[#c7cdda] items-center justify-center">
                                  <div className='text-[#bee9cf] text-[1.25rem] font-bold mx-2 shadow-btnShadow p-1'>{"Cost " +  addThousandSeparator(parseInt(carSpecs?.prinp1 as string)) + "€"}</div>
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