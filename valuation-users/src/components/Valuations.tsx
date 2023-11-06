// import { useState } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';

interface Ivaluations {
  [key:string]: string | number
}

function Valuations () {

    const [valuations, setValuations] = useState<Ivaluations[]>([]);
    const [allVluations, setAllValuations] = useState<Ivaluations[]>([]);
    const [tablekeys, setTableketys] = useState<string[]>([]);
    const [showValuations, setShowValuations] = useState<boolean>(false);
    const [showCompanySearch, setShowCompanySearch] = useState<boolean>(false);

    const getValuations = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/server/valuations`);
        setValuations(response.data);
        setAllValuations(response.data);
        setTableketys(Object.keys(response.data[0]));
        console.log("These are the keys: ", Object.keys(response.data[0]));
        console.log("These are the values ", response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const handleChangeInput = (e: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      const input = e.currentTarget.company.value;  
      // Search in allvaluations array for a company string
      if( typeof input == 'string'){
        const tempVar = allVluations.filter((valuation) =>  typeof valuation[`company`] === 'string' ? valuation[`company`].toLowerCase() == input.toLowerCase() || valuation[`company`].toLowerCase().includes(input.toLowerCase()): valuation); 
        setValuations(tempVar);
      }
    }
    return (
      <div>
        <div className='flex flex-row'>
         {true &&
          <button onClick={() => {getValuations()}} className='bg-[#3e7e7e] w-[10vw] min-w-[8rem] p-1 border-2 border-[#2e3875] rounded-md text-center font-semibold text-[#ffffff] mx-auto mt-2 hover:bg-[#7adbdb] hover:text-black hover:italic shadow-btnShadow'> Get valuations </button>
         }
          {/* show search company if the button is clicked*/}
          {true &&
          <form onSubmit={handleChangeInput} className="text-center mb-10 h-[2rem] w-[14rem] rounded-md" >
            <input type="text" className="border-2 border-[#2e3875] text-center w-[12vw] min-w-[12rem] h-[6vh] rounded-full focus:outline-none" name="company" placeholder="Search by company" />
            <input type="submit" className='bg-[#3e7e7e] w-[6vw] min-w-[6rem] p-1 border-2 border-[#2e3875] rounded-md text-center font-semibold text-[#ffffff] mx-auto mt-2 hover:bg-[#7adbdb] hover:text-black hover:italic shadow-btnShadow'/>
          </form>
          }
          </div>
        <table className="mx-auto my-10">
            <thead>
                <tr className="text-center border border-slate-600 table-auto bg-slate-200">
                    {tablekeys.map((header) => (
                        <th className=" border border-spacing-2 border-slate-600" key={header}>
                            {header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {valuations.map((purchase, index) => (
                    <tr 
                        key={index}
                        className={index % 2 == 0
                            ? "text-center border border-slate-600  bg-slate-100 hover:bg-slate-200"
                            : "text-center border border-slate-600  bg-stone-200 hover:bg-slate-300"
                        }>
                        { tablekeys.map((key) => (
                        <td   key={key}
                        className="border border-lines border-slate-600">
                            {purchase[key]}
                        </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    )
}
export default Valuations;