// import { useState } from 'react'
import Navbar from './Navbar'
import { LiaCommentsSolid as Comment } from 'react-icons/Lia';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { FormEvent } from 'react';
import axios from 'axios';

interface Ivaluations {
  [key:string]: string | number
}

function Valuations () {
    const [valuations, setValuations] = useState<Ivaluations[]>([]);
    const [tablekeys, setTableketys] = useState<string[]>([]);

    const getValuations = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/server/valuations`);
        setValuations(response.data);
        setTableketys(Object.keys(response.data[0]));
        console.log("These are the keys: ", Object.keys(response.data[0]));
        console.log("These are the values ", response.data);
      } catch (err) {
        console.log(err);
      }
    };
    return (
      <div>
        <button onClick={() => {getValuations()}} className='bg-[#778686] w-full p-1 border-2 border-[#2e3875] rounded-md text-center font-semibold text-[#ffffff] mx-auto mt-2 hover:bg-[#7adbdb] hover:text-black hover:italic '> Get valuations </button>
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
                        className={ index % 2 == 0
                            ? "text-center border border-slate-600  bg-slate-100"
                            : "text-center border border-slate-600  bg-stone-200"
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