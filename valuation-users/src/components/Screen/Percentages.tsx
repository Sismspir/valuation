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
    // all available years
    const availableYears = [...new Set(data.map((element) => (element.Year)))]; 

    // setting years as keys
    for(let k=0; k<availableYears.length; k++){
        companies[`${availableYears[k]}`] = [];
    };

    // for every object in data
    for(let i=0; i<data.length; i++){
            // for every different name you find in data
            for(let j=0; j<companyNames.length; j++){

                    if(companyNames[j] == data[i].Name){
                        companies[`${data[i].Year}`].push(data[i]); 
                    };
            };
        
        // example for iad
        if(data[i].Name === 'iAD' && data[i].Year === 2021)
        iAD2021.push(data[i]);
    };

    // all available months
    const months = iAD2021.map((month) => (month.Month));
    // all company keys
    const arrayKeys = Object.keys(iAD2021[0]);
   
    // fill empty shels -- problem with aegean and santader and...
    for(let i=0; i<companies['2021'].length; i++){

        let currentid = companies[2021][i].NameID;
        let currentCompany = companies[2021][i].Name;

        // fill the previous month
        if(i != 0 && companies['2021'][i].Month !== companies['2021'][i-1].Month + 1 && companies['2021'][i].Month != 1 && (companies['2021'][i].Month !== companies['2021'][i-1].Month + 1) ){

            // console.log(currentCompany, companies['2021'][i].Month);
            companies[`2021`].push({
                NameID: currentid,
                Name: currentCompany, 
                Year: data[i].Year,
                Month: companies['2021'][i].Month - 1, 
                Hits: 0, 
                
            });

        };

        // fill the next month
        if(companies['2021'][i].Month !== 12 && companies['2021'][i].Month + 1 !== companies['2021'][i+1].Month){
            // console.log(currentCompany, companies['2021'][i].Month);
            companies[`2021`].push({
                NameID: currentid,
                Name: currentCompany, 
                Year: data[i].Year,
                Month: companies['2021'][i].Month + 1, 
                Hits: 0, 
            });
        }

        // sort the companies array
        companies['2021'].sort((a, b) => { 
            if(a.Name === b.Name) { 
                return a.Month - b.Month;
            }
            return a.Name.localeCompare(b.Name);
        });
    };

    // calculate percentages
    // calculate total hits for each company
    interface Itotalhits {
        [key:string]: number; 
      }

    let totalHits:Itotalhits = {};
    for( let i=0; i<companyNames.length; i++ ){
        totalHits[`${companyNames[i]}`] = 0 
    };

    let totalAllCompanies = 0;
    // calculate total hits fore each company
    for(let i=0; i<companies['2021'].length; i++){
            totalHits[companies['2021'][i].Name] += companies['2021'][i].Hits;
            totalAllCompanies += companies['2021'][i].Hits;
    };

    console.log(totalHits, totalAllCompanies);
    // console.log(companies['2021'])
    return(
            <div className="flex flex-col justify-center space-y-10">
                <p className="self-center">Percentages</p>
                {/* <Loading/> */}
                      <table className="my-10">
                            <thead>

                                <tr className="font-[ui-serif] text-[#e48d46] text-[1.2rem] table-auto bg-[#153d5e]">
                                    <th className="border border-spacing-2 border-slate-600"><div className='flex flex-row justify-center items-center py-4 px-10 pl-6'></div></th>
                                    {months.map((month) => (
                                        <th className="border border-spacing-2 border-slate-600" key={month}>
                                            <div className='flex flex-row justify-center items-center py-4 pr-3 pl-6'>{month}</div>
                                        </th>
                                    ))}
                                    <th>total</th>
                                    <th>total %</th>
                                </tr>
                            </thead>
                            <tbody className='font-[system-ui]'>
                                { companyNames.map( (name, indexKey) => (
                                <tr>
                                <th className='text-[#c5b8b8] border border-slate-600  bg-slate-700 hover:bg-slate-800 hover:text-white text-center'>{name}</th>
                                {companies['2021'].map((item, index) => (    
                                    item.Name == name &&             
                                    <th 
                                        key={item.Month}
                                        className={index % 2 == 0
                                            ? "text-[#c5b8b8] border border-slate-600  bg-slate-700 hover:bg-slate-800 hover:text-white p-3"
                                            : " text-[#d6caca] border border-slate-600  bg-slate-600 hover:bg-slate-800 hover:text-white p-3"
                                        }>
                                        <td  key={indexKey}
                                        className="border-slate-600">
                                            {item.Hits + ' '} 
                                            {`Month: ${item.Month}`} {`row: ${indexKey +1}`}
                                        </td>
                                    </th>         
                                ))}
                                <td className='text-[#c5b8b8] border border-slate-600  bg-slate-700 hover:bg-slate-800 hover:text-white text-center'>{totalHits[`${name}`]}</td>
                                <td className='text-[#c5b8b8] border border-slate-600  bg-slate-700 hover:bg-slate-800 hover:text-white text-center'>{(totalHits[`${name}`]/totalAllCompanies*100).toFixed(2) }%</td>
                                </tr>))}
                            </tbody>
                        </table>
            </div>
    )
}
export default Percentages;