import { RiArrowDownLine as Down} from 'react-icons/Ri';
import { useState, FormEvent, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { RiArrowUpLine as Up } from 'react-icons/Ri';
import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';
import axios from 'axios';

interface Ivaluations {
  [key:string]: string | number
}

function ShowValuations () {

  const [notifyText, setnotifyText] = useState<string>("Please enter some input!!");
  const [allVluations, setAllValuations] = useState<Ivaluations[]>([]);
  const [valuations, setValuations] = useState<Ivaluations[]>([]);
  const [chosenHeader, setChosenHeader] = useState<string>();
  const [sortedAsc, setSortedAsc] = useState<boolean>(true);
  const [tablekeys, setTablekeys] = useState<string[]>([]);
  const [option, setOption] = useState<string>('company');
  const [loading, setLoading] = useState<boolean>(false);
  const placeHoldervalue = `Search by ${option}`;

  const getValuations = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:3000/server/valuations`);
      setValuations(response.data);
      setAllValuations(response.data);
      setTablekeys(Object.keys(response.data[0]));

    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  
  const handleChangeInput = (e: FormEvent<HTMLFormElement>) => {

    e?.preventDefault();
    const input = e.currentTarget.company.value;  

    // Search in allvaluations array for a company string
    if( option == 'company'){

      // Check if the user gave a number as input
      if (!isNaN(Number(input))){  
        toast(`${notifyText}`);
        return;
      };

      const tempVar = allVluations.filter((valuation) =>  typeof valuation[`company`] === 'string' ? valuation[`company`].toLowerCase() == input.toLowerCase() || valuation[`company`].toLowerCase().includes(input.toLowerCase()): valuation); 
      setValuations([...tempVar]);

    } else {
      console.log(Number(input), "here");
       // Check if the user gave a string as input
      if (Number(input) == 0 || isNaN(Number(input))){
        toast(`${notifyText}`);
        return;
      };

      const tempVar = allVluations.filter((valuation) =>  typeof valuation[`id`] === 'number' ? valuation[`id`] == input : valuation); 
      setValuations([...tempVar]);
    };
  };

  const sortyByHeader = (header: string) => {
    const tempVar = [...valuations];

    tempVar.sort((a ,b) => { 
      // if a is a number sort them as numbers
      // else apply toString() to show ts we are dealing with strings 
      return ( typeof a[`${header}`] == 'number' ? ( sortedAsc ? +a[header] - +b[header] : +b[header] - +a[header] ) : sortedAsc ? (a[header].toString().toUpperCase() > b[header].toString().toUpperCase() ? 1 : -1) : (a[header].toString().toUpperCase() < b[header].toString().toUpperCase() ? 1 : -1) );
    });

    setChosenHeader(header);
    setSortedAsc(!sortedAsc);
    setValuations([...tempVar]);
  };

  // sets the notifyText variable based on the option varialbe value
  useEffect(() => {
    if(option ==  'company') {
      setnotifyText("Please enter some text!");
    } else {
      setnotifyText("Please enter a non zero integer!");
    }
  }, [option]);

  return (
    <div>
      <div>
        <ToastContainer
        position="top-right"
        newestOnTop={false}
        limit={4}
        theme="light"/>
      </div>
      <div className='flex justify-center mt-2 space-x-6'>
        <button onClick={getValuations} className='bg-slate-800 h-[5vh] min-h-[3rem] w-[10vw] min-w-[8rem] p-1 border-2 border-[#8f93a8] rounded-md text-center font-semibold text-[#ffffff] mt-2 hover:bg-[#8ca3c5] hover:text-black hover:italic hover:border-[#153d5e] shadow-btnShadow'> Get valuations </button>
        {/* show search company if the button is clicked */}
        <form onSubmit={handleChangeInput} className="text-center mb-10 h-[2rem] w-[14rem] rounded-md" >
          <input type="text" className="border-2 border-[#2e3875] text-center w-[12vw] min-w-[12rem] h-[3.5rem] rounded-full focus:outline-none" name="company" placeholder={placeHoldervalue} />
          <input type="submit" className='bg-slate-800 w-[6vw] min-w-[6rem] p-1 border-2 border-[#8f93a8] rounded-md text-center font-semibold text-[#ffffff] mt-2 hover:bg-[#8ca3c5] hover:text-black hover:border-[#153d5e] hover:italic shadow-btnShadow' value="Search"/>
        </form>
        <select onChange={e => setOption(e.target.value)} defaultValue={'company'} className='bg-slate-800 h-[5vh] min-h-[3rem] w-[10vw] min-w-[8rem] p-1 border-2 border-[#8f93a8] rounded-md text-center font-semibold text-[#ffffff] mt-2 shadow-btnShadow focus:outline-none' id="id">
          <option value="company">Company</option>
          <option value="id">Id</option>
        </select>
      </div>
      {loading ? <div className="my-32 flex justify-center italic"><Loading/></div> :
      <table className="my-10">
          <thead>
              <tr className="font-[ui-serif] text-[#e48d46] text-[1.2rem] table-auto bg-[#153d5e]">
                  {tablekeys.map((header) => (
                      <th onClick={() => sortyByHeader(header)} className="border border-spacing-2 border-slate-600" key={header}>
                          <span className='flex flex-row justify-center items-center py-4 pr-3 pl-6'>{header.charAt(0).toUpperCase() + header.slice(1)}<div className='mt-1 ml-4'>{chosenHeader == header && ( sortedAsc ? <Up/> : <Down/>)}</div></span>
                      </th>
                  ))}
              </tr>
          </thead>
          <tbody className='font-[system-ui]'>
              {valuations.map((purchase, index) => (
                  <tr 
                      key={index}
                      className={index % 2 == 0
                          ? "text-center text-[#c5b8b8] border border-slate-600  bg-slate-700 hover:bg-slate-800 hover:text-white"
                          : "text-center text-[#d6caca] border border-slate-600  bg-slate-600 hover:bg-slate-800 hover:text-white"
                      }>
                      { tablekeys.map((key) => (
                      <td   key={key}
                      className="border border-lines border-slate-600 p-2">
                          {purchase[key]}
                      </td>
                      ))}
                  </tr>
              ))}
          </tbody>
      </table>}
    </div>
  )
}
export default ShowValuations;