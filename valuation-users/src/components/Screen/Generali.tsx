import { ChangeEvent, useState, FormEvent } from 'react';
import LoadingBtn from "./LoadingBtn";
import axios from 'axios';

function Generali () {
    const [txtFile, setTxtFile] = useState<Blob>();
    const [hasFile, setHasFile] = useState<boolean>();
    const [uploaded, setIsUploaded] = useState<boolean>();
    const [btnStateLoading, setBtnStateLoading] = useState<boolean>();

    const handleFile = (e: ChangeEvent<HTMLInputElement>) =>{
    
        const { files } = e?.target;

        const fileName = files?.[0].name;

        setTxtFile(files?.[0]);
        setHasFile(true);
    }

    const formData = new FormData();

    if (txtFile != undefined) formData.append('file', txtFile);

    const handleUpload = async (e:FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setBtnStateLoading(true);

        try {
            const resp = await axios.post('http://localhost:3000/server/generali', formData)

            if(resp.data){                
                setIsUploaded(true);
                setBtnStateLoading(false);
            };
        }catch(error){
            console.log(error);
            setBtnStateLoading(false); 
        };
    }

 return(
    <form className="mt-6 flex flex-col relative" action="submit" onSubmit={() => {console.log("upload")}}>
    <input className="shadow-btnShadow flex mb-10 mx-auto px-20 py-4 text-xl font-medium bg-[#325474] text-[#ffedc9] border border-[#325474] rounded-full file:rounded-full file:mr-6 file:px-4 file:py-3 file:bg-[#23768a] file:text-[#ffedc9] file:hover:cursor-pointer file:shadow-btnShadow file:hover:bg-[#399143] " type="file" onChange={handleFile} id="fileInput" accept=".txt" />
    {hasFile &&
    <button disabled={uploaded} className="shadow-btnShadow mt-4 mb-4 mx-auto w-[12vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-center font-bold text-[#fcfcfc] italic bg-[#23a16d] rounded-md tracking-wider hover:bg-[#2dcc5d] hover:text-[#ffffff]" type="submit" >{!btnStateLoading ? (<p>Upload File</p>) : <LoadingBtn/>}  
    </button>}
</form>
 )
}
export default Generali