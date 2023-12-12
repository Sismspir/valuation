import { useTheme } from '../Context/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import data from '../../Final Boss.json';

interface Idata {
    NameID: string,
    Name: string,
    Year: number,
    Month: number,
    Hits: number,
}

interface Icompanies {
    [key:string]: Idata[]; 
  }

function Percentages() {
    const [startingYear, setStartingYear] = useState<number>(2019);
    const [endingYear, setEndingYear] = useState<number>(2019);
    const [yearsToMap, setYearsToMap] = useState<number[]>([2019, 2020]);
    const companies: Icompanies = {};
    const { isDarkMode, toggleTheme } = useTheme();
    console.log(isDarkMode);

    // all company names
    const companyNames = [...new Set(data.map((element) => (element.Name)))]; 

    // sort company names 
    companyNames.sort((a, b) => { 
        return a.localeCompare(b);
    });
    // all available years
    const availableYears = [...new Set(data.map((element) => (element.Year)))]; 
    
    // setting years as keys
    for(let k=0; k<availableYears.length; k++){
        companies[`${availableYears[k]}`] = [];
    };

    // for every year
    for(let k=0; k<availableYears.length; k++){
        // for every month
        for(let i =1; i<=12; i++){
            // for every comppany
            for(let j=0; j<companyNames.length; j++){
                    // initialize the array
                    companies[availableYears[k]].push({ NameID: "0", Name: `${companyNames[j]}`, Year: availableYears[k], Month: i, Hits: 0 });                            
            };
        };
    };

    // for every year
    for(let k=0; k<availableYears.length; k++){
        // for every object in data
        for(let i=0; i<data.length; i++){
            // for every different name you find in data
            for(let j=0; j<companyNames.length; j++){

                        if(companyNames[j] == data[i].Name && data[i].Year == availableYears[k]){
                            // companies[`${data[i].Year}`].push(data[i]);
                            const currentObj = companies[`${availableYears[k]}`].find(obj => obj.Name == data[i].Name && obj.Month  == data[i].Month && obj.Year == availableYears[k] );  
                            // fill the object with the new values
                            if(currentObj){
                            currentObj.NameID = data[i].NameID ;
                            currentObj.Hits = data[i].Hits;
                            currentObj.Year = availableYears[k];
                            };
                        };
                };

            // sort the companies array
            companies[availableYears[k]].sort((a, b) => { 
                if(a.Name === b.Name) { 
                    return a.Month - b.Month;
                };
                return a.Month - b.Month;
            });
        };
    };

    // all available months
    const months = [1,2,3,4,5,6,7,8,9,10,11,12];

    // calculate percentages
    interface Itotalhits {
        [key:string]: number; 
    };

    interface Iyearhits {
        [key:string]: Itotalhits;
    };

    let totalHits:Iyearhits = {};

    let grandTotal:Itotalhits = {};

    let totalAllCompanies:Itotalhits = {};

    for(let j=0; j<yearsToMap.length; j++){

        for( let i=0; i<companyNames.length; i++ ){

            if( totalHits[yearsToMap[j]] === undefined ) totalHits[yearsToMap[j]] = {};

            totalHits[yearsToMap[j]][companyNames[i]] = 0; 

            grandTotal[companies[`${yearsToMap[j]}`][i].Name] = 0;
        };

        totalAllCompanies[`${yearsToMap[j]}`] = 0;
    };

    let sumGrandTotal = 0;

    for(let j=0; j<yearsToMap.length; j++){

        for(let i=0; i<companies[`${yearsToMap[j]}`].length; i++){
                // calculate total hits fore each company
                totalHits[`${yearsToMap[j]}`][companies[`${yearsToMap[j]}`][i].Name] += companies[`${yearsToMap[j]}`][i].Hits;
                totalAllCompanies[`${yearsToMap[j]}`] += companies[`${yearsToMap[j]}`][i].Hits;

                // calculate grand total hits fore each company
                grandTotal[companies[`${yearsToMap[j]}`][i].Name] += companies[`${yearsToMap[j]}`][i].Hits;
                sumGrandTotal += companies[`${yearsToMap[j]}`][i].Hits;
        };
    };
    // when "starting year" option changes
    const handleStarting = (e:any) => {
        e.preventDefault();
        let input = e.currentTarget;
        setStartingYear(parseInt(input.value));
    };
    // when "ending year" option changes
    const handleEnding = (e:any) => {
        e.preventDefault();
        let input = e.currentTarget;
        setEndingYear(parseInt(input.value));
    };

    // display different tables when starting/ending year changes
    useEffect(() => {

        // exit if ending year is lower than starting
        if(endingYear < startingYear){
            const notify = () => toast("Starting year cant be greater than ending year");
            notify();
            return;
        };
        // set the yearsToMap variable depending on the user's option
        function initializeArray(startingYear: number, endingYear: number) {
            let newArr = [];
            for(let i=startingYear; i<=endingYear; i++){
                newArr.push(i);
            };
          setYearsToMap(newArr); 
        };

        initializeArray(startingYear, endingYear);

    }, [startingYear, endingYear])

    return(
            <div className="mt-10 flex flex-col justify-center space-y-8">
                <div className='mb-8 flex justify-center space-x-16'>
                    <div>
                    <p className={`${isDarkMode ? "text-[#f2f7f7]" : "text-[#33608d]"} flex flex-col text-center text-xl font-bold italic mb-2`}>Starting</p>
                        <select className='border-4 border-orange-500 rounded-full min-h-[3rem] min-w-[6rem] p-2 h-[4vh] w-[8vw] bg-[#5b9cd2] text-center text-[#ffffff] text-lg' value={startingYear} name="starting" id="starting" onChange={handleStarting}>
                            {availableYears.map((year, sind) => (<option key={sind} value={year}>{year}</option>))}
                        </select>
                    </div>
                    <div>
                        <p className={`${isDarkMode ? "text-[#f2f7f7]" : "text-[#33608d]"} flex flex-col text-center text-xl font-bold italic  mb-2`}>Ending</p>
                        <select className='border-4 border-orange-500 text-center rounded-full min-h-[3rem] min-w-[6rem] p-2 h-[4vh] w-[8vw] bg-[#5b9cd2] text-[#ffffff] text-lg' value={endingYear} name="ending" id="ending" onChange={handleEnding}>
                            {availableYears.map((year, eind) => (<option key={eind} value={year}>{year}</option>))}
                        </select>
                    </div>
                    <div>
                        <ToastContainer
                        position="top-right"
                        newestOnTop={false}
                        limit={4}
                        theme="light"/>
                    </div>
                </div>
                { yearsToMap.map((year) => 
                    (<table className='shadow-btnShadow'>
                        <thead>
                            <tr className="h-16 font-[ui-serif] text-white text-[1.2rem] table-auto bg-[#2e2a2a]">
                                <th className='border-t border-[#2e2a2a] border-l'></th> 
                                <th className='border-t border-[#2e2a2a]' colSpan={12}>{year}</th> 
                                <th rowSpan={2} className='bg-[#454545] border border-[#7f7d7d]'><span className='border-b-[2px] border-orange-500 mx-2'>Total</span></th>
                                <th rowSpan={2} className='bg-[#454545] border border-[#7f7d7d]'><span className='border-b-[2px] border-orange-500 mx-2'>Total %</span></th>
                                <th rowSpan={2} className='bg-[#454545] border border-[#7f7d7d]'><span className='border-b-[2px] border-orange-500 mx-2'>Grand Total</span></th>
                                <th rowSpan={2} className='bg-[#454545] border border-[#7f7d7d]'><span className='border-b-[2px] border-orange-500 mx-2'>Grand Total %</span></th>
                            </tr>
                            <tr className="h-12 font-[ui-serif] text-white text-[1.2rem] table-auto bg-[#0c4574] border-l border-[#0c4574]">
                                <th></th> 
                                {months.map((month, index) => (
                                <th key={index}>{month}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='font-[system-ui]'>
                            { companyNames.map((name, indexKey) => (
                            <tr>
                            <th key={indexKey} className='text-gray-500 border-b-[2.4px] border-l-[2.4px] border-gray-400  bg-gray-200 hover:bg-slate-400 hover:text-white text-center shadow-companyShadow px-2'>{name}</th>
                            { companies[`${year}`] && companies[`${year}`].map((item, index) => (    
                                item.Name == name &&             
                                <th 
                                    key={item.Month}
                                    className="border border-gray-400 hover:bg-slate-400 hover:text-white p-3 bg-white">
                                    <td  key={index}
                                    className="border-slate-600 text-[#040404] flex justify-center">
                                        {item.Hits !== 0 ? item.Hits : <span className='text-red-700'>X</span>} 
                                    </td>
                                </th>         
                            ))}
                            <td className='text-[#f1eaea] bg-[#454545] hover:bg-slate-800 hover:text-white text-center border-b border-[#635c5c]'>{totalHits[`${year}`][`${name}`]}</td>
                            <td className='text-[#f1eaea] bg-[#454545] hover:bg-slate-800 hover:text-white text-center border-b border-[#635c5c]'>{(totalHits[`${year}`][`${name}`]/totalAllCompanies[`${year}`]*100).toFixed(2) } <span className='text-orange-500'>%</span></td>
                      
                            <td className='text-[#f1eaea] bg-[#454545] hover:bg-slate-800 hover:text-white text-center border-b border-[#635c5c]'>{ year === yearsToMap[0] ? grandTotal[`${name}`] : (<span className='text-orange-500'>*</span>)}</td>
                            <td className='text-[#f1eaea] bg-[#454545] hover:bg-slate-800 hover:text-white text-center border-r border-b border-[#635c5c]'>{year === yearsToMap[0] ? (grandTotal[`${name}`]/sumGrandTotal*100).toFixed(2) : (<span className='text-orange-500'>*</span>)}{ year === yearsToMap[0] ? (<span className='text-orange-500'> %</span>) : ""}</td>
                            </tr>))}
                    </tbody>
                </table>)
            )} 
            </div>
    )
}
export default Percentages;