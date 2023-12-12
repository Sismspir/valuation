import { useState, FormEvent, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Loading from "./Loading";
import axios from 'axios';

interface Iequipments {
    [key:string]: string | number | boolean
  }
  
function Equipments() {
    const [equipments, setEquipments] = useState<Iequipments[]>();
    const [tablekeys, setTablekeys] = useState<string[]>();
    const [loading, setLoading] = useState<boolean>(false);

    const getEquipments = async (e: FormEvent<HTMLFormElement>) => {

        const input = e.currentTarget.company.value;  
        e?.preventDefault();
        setLoading(true);
        try {
          const response = await axios.post(`http://localhost:3000/server/equip`, { "typnatcode": input});
          setEquipments(await response.data);
          setTablekeys(Object.keys(await response.data[0]));
    
        } catch (err) {
          console.log(err);
          const notify = () => toast(`Equipment with typnatcode: ${input} is not "Open" or it does not exist!`);
          notify();
        }
        setLoading(false);
        console.log(equipments, tablekeys);
      };

    const handleClick = (i: number) => {
        // equipment['isClicked'] = true
        const tempEquip = [...(equipments) || []];
        tempEquip[i]['isClicked'] = !tempEquip[i]['isClicked']
        setEquipments(tempEquip);
        console.log(i, equipments);
    } 
      
    return(
        <div className='flex flex-col items-center space-y-28 mb-5'>
            <div>
                <ToastContainer
                position="top-right"
                newestOnTop={false}
                limit={4}
                theme="light"/>
            </div>
            <form onSubmit={getEquipments} className="text-center h-[2rem] w-[14rem] rounded-md" >
                <input type="text" className="border-2 border-[#2e3875] text-center h-[3.5rem] mb-2 rounded-full focus:outline-none" name="company" placeholder="Enter typnatcode" />
                <input type="submit" className='bg-slate-800 w-[6vw] min-w-[6rem] mt-4 p-1 border-2 border-[#8f93a8] rounded-md text-center font-semibold text-[#ffffff] hover:bg-[#8ca3c5] hover:text-black hover:border-[#153d5e] hover:italic shadow-btnShadow flex-2' value="Search"/>
            </form>
            {loading ? <Loading/> :
            <table className='shadow-btnShadow w-3/4'>
                <thead>
                    <tr className="h-16 font-[ui-serif] text-white text-[1.2rem] table-auto bg-[#2e2a2a]">
                        {tablekeys?.map((header) => (
                            <th>
                                <span className='flex flex-row justify-center items-center py-4 pr-3 pl-6'>{header.charAt(0).toUpperCase() + header.slice(1)}<div className='mt-1 ml-4'></div></span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className='font-[system-ui]'>
                    {equipments?.map((equip, index) => (
                        <tr onClick={() => {handleClick(index)}}
                            key={index}
                            className={
                                `${equip['isClicked'] && "bg-[#2b6d6a] text-[#ffffff]"} ${
                                index % 2 === 0
                                    ? "text-center text-[#c5b8b8] border border-slate-600 bg-slate-700 hover:bg-slate-500 hover:text-white"
                                    : "text-center text-[#d6caca] border border-slate-600 bg-slate-600 hover:bg-slate-500 hover:text-white"
                                }`
                            }>
                            { tablekeys?.map((key) => (
                            <td   key={key}
                            className="border border-lines border-slate-600 p-2">
                                {equip[key]}
                            </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>}
</div>
)
}
export default Equipments;