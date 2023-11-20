import { spawn } from 'child_process';
import data from '../../data.json';
import Loading from "./Loading";

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

interface Itotalhits {
    [key:string]: number; 
  }

function Percentages() {
    const companies: Icompanies = {};
    const iAD2021 = [];

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
            // example for iad
            if(data[i].Name === 'iAD' && data[i].Year === availableYears[k])
            iAD2021.push(data[i]);

            // sort the companies array
            companies[availableYears[k]].sort((a, b) => { 
                if(a.Name === b.Name) { 
                    return a.Month - b.Month;
                };
                return a.Month - b.Month;
            });
        };
    };

    console.log(companies);
    // all available months
    const months = [...new Set(iAD2021.map((month) => (month.Month)))];
    // calculate percentages

    interface Itotalhits {
        [key:string]: number; 
    };

    interface Iyearhits {
        [key:string]: Itotalhits;
    };

    let totalHits:Iyearhits = {};

    for(let j=0; j<availableYears.length; j++){

        for( let i=0; i<companyNames.length; i++ ){

            console.log(`year: ${availableYears[j]}, company: ${companyNames[i]}`)
            if( totalHits[availableYears[j]] === undefined ) totalHits[availableYears[j]] = {};
            totalHits[availableYears[j]][companyNames[i]] = 0; 
        };
    };

    let totalAllCompanies = 0;
    // calculate total hits fore each company
    for(let j=0; j<availableYears.length; j++){
        for(let i=0; i<companies[`${availableYears[j]}`].length; i++){
                totalHits[`${availableYears[j]}`][companies[`${availableYears[j]}`][i].Name] += companies[`${availableYears[j]}`][i].Hits;
                totalAllCompanies += companies[`${availableYears[j]}`][i].Hits;
        };
    };
    console.log(totalHits, months);
    // console.log(totalHits, totalAllCompanies);
    console.log(companies['2021'])
    return(
            <div className="flex flex-col justify-center space-y-10">
                <p className="self-center">Percentages</p>
                {/* <Loading/> */}
                {/* FOR LOOP 2  YEARS */}
                    <table className="my-10">
                        <thead className=''>
                            <tr className="h-16 font-[ui-serif] text-white text-[1.2rem] table-auto bg-[#2e2a2a]">
                                <th className='border-t border-[#2e2a2a] border-l'></th> 
                                <th className='border-t border-[#2e2a2a]' colSpan={12}>2021</th> 
                                <th rowSpan={2} className='bg-[#454545] border border-[#7f7d7d]'><span className='border-b-[3px] border-orange-500 mx-2'>Total</span></th>
                                <th rowSpan={2} className='bg-[#454545] border border-[#7f7d7d]'><span className='border-b-[3px] border-orange-500 mx-2'>Total %</span></th>
                            </tr>
                            <tr className="h-12 font-[ui-serif] text-white text-[1.2rem] table-auto bg-[#0c4574] border-l border-[#0c4574]">
                                <th></th> 
                                {months.map((month, index) => (
                                <th key={index}>{month}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='font-[system-ui]'>
                            { companyNames.map( (name, indexKey) => (
                            <tr>
                            <th className='text-gray-500 border-b-[2.4px] border-l-[2.4px] border-gray-400  bg-gray-200 hover:bg-slate-800 hover:text-white text-center'>{name}</th>
                            {companies['2021'].map((item, index) => (    
                                item.Name == name &&             
                                <th 
                                    key={item.Month}
                                    className="border border-gray-400 hover:bg-slate-800 hover:text-white p-3 bg-white">
                                    <td  key={indexKey}
                                    className="border-slate-600 text-[#040404] flex justify-center">
                                        {item.Hits !== 0 ? item.Hits : <span className='text-red-600'>x</span>} 
                                    </td>
                                </th>         
                            ))}
                            <td className='text-[#040404] bg-[#454545] hover:bg-slate-800 hover:text-white text-center'>{totalHits['2021'][`${name}`]}</td>
                            <td className='text-[#040404] bg-[#454545] hover:bg-slate-800 hover:text-white text-center'>{(totalHits['2021'][`${name}`]/totalAllCompanies*100).toFixed(2) } <span className='text-orange-500'>%</span></td>
                            </tr>))}
                    </tbody>
                </table>
            </div>
    )
}
export default Percentages;