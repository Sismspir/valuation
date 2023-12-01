import { ToastContainer, toast } from 'react-toastify';
import { FaCheck as CheckMe } from "react-icons/fa6";
import LoadingBtn from "./LoadingBtn";  
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

interface Imessage {
    [key:string]: string | boolean | number; 
}

function Casco() {

    const [btnStateLoading, setBtnStateLoading] = useState<boolean[]>([false, false, false, false, false, false, false])
    const [btnHasPressed, setBtnHasPressed] = useState<boolean[]>([false, false, false, false, false, false])
    const [fileNameRequest, setFileNameRequest] = useState<string>("");
    const [messages, setMessages] = useState<Imessage[]>([]);
    const [tableName, setTableName] = useState<string>("");
    const [btnFree, setBtnFree] = useState<boolean>(false);
    const [xlsFile, setXlsFile] = useState<Blob>();

    // When the file is changed
    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {

        const { files } = e?.target;
        const fileName = files?.[0].name;

        // for the next button to appear
        setXlsFile(files?.[0]);
        setBtnHasPressed([true, false, false]);
        setFileNameRequest(fileName != undefined ? fileName : "");
      
    };

    // Update the displayed message
    const updateMessageStatus = (messageKey: number) => {
        setMessages(prevMessages => {
            return prevMessages.map(message => {
                if (message.id === messageKey) {
                // Return a new object with updated status
                return { ...message, completed: true };
                }
                return message; // Return the original message if key doesn't match
            });
        });
    };

    //-----------------------------GPT CODE TO CHECK THE FILE TYPE---------------------------------------

    function isExcelFile(buffer: ArrayBuffer): boolean {
        // Check the file signature to identify Excel files
        const signatureBytes = new Uint8Array(buffer.slice(0, 4)); // Read the first 4 bytes
        // XLSX signature: 50 4B 03 04 (ZIP file format signature)
        const xlsxSignature = [0x50, 0x4B, 0x03, 0x04];
        // XLS signature: D0 CF 11 E0 A1 B1 1A E1 (OLE Compound File Binary Format)
        const xlsSignature = [0xD0, 0xCF, 0x11, 0xE0];
      
        // Check if the signature matches either XLSX or XLS format
        if (arraysEqual(signatureBytes, xlsxSignature)) {
          return true; // XLSX file
        } else if (arraysEqual(signatureBytes.slice(0, 4), xlsSignature)) {
          return true; // XLS file
        }
      
        return false; // Not recognized as an Excel file
      }
      
      // Function to compare arrays
      function arraysEqual(a: Uint8Array, b: number[]): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }
      
    //-----------------------------GPT CODE TO CHECK THE FILE TYPE---------------------------------------

    const upload = async (e:FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setMessages([...messages, {'id': 1, 'msg' : "Upolading & converting to CSV...", 'completed': false}]);

        // disable all buttons
        setBtnFree(true);

        // for the button loader
        const newBtnState = [...btnStateLoading]
        newBtnState[0] = true;
        setBtnStateLoading(newBtnState);

        const formData = new FormData();

        if (xlsFile != undefined) formData.append('file', xlsFile);
        console.log("submited", xlsFile)

        const reader = new FileReader();

        reader.onload = () => {
            // Check the file type based on the magic numbers or file signature
            if (isExcelFile(reader.result as ArrayBuffer)) {
              // If the file type is recognized as Excel, append it to the form data
              console.log("File type recognized as Excel, proceeding to upload.");  
              // Proceed with sending the form data to the server
              sendData();
            } else {
              const notify = () => toast("Invalid file type. Only Excel files are allowed.");
              setMessages([...messages, {'id': 1, 'msg' : "Error on the upload.", 'completed': false}]);
              notify();
              console.log("Invalid file type. Only Excel files are allowed.");
              // Handle error or display a message indicating that only Excel files are accepted
            }
          };
        
        if(xlsFile !== undefined){
            reader.readAsArrayBuffer(xlsFile);
        };
        // send the file to the server
        const sendData = async () => {
            try {
                console.log(formData, "this is sent to the server")
                const response = await axios.post('http://localhost:3000/server/upload', formData);
                if(response.data) {
                    console.log(`[Login] Response #1, ${response.data} successfully uploaded!`);

                    // set message to completed
                    updateMessageStatus(1);

                    // update btn state
                    const brandNewBtnState = [...btnStateLoading]
                    brandNewBtnState[0] = false;
                    setBtnStateLoading(brandNewBtnState);

                    // for the next button to appear
                    const btnState1 = [true, true, false];
                    // checking if the create table has pressed before in order to stop the load button from disabling
                    btnHasPressed[2] == false ? setBtnHasPressed(btnState1) : setBtnHasPressed([true, true, true]);

                    console.log(messages);

                    // activate all buttons
                    setBtnFree(false);
                } else {
                    console.log(`[Login] Response #2`);
                    setMessages([...messages, {'id': 1, 'msg' : "Error on the upload.", 'completed': false}]);
                    // activate all buttons
                    setBtnFree(false);
                }
            } catch(err) {
                console.log(err);
                // activate all buttons
                setBtnFree(false);
            };

            // update btn state if it hasn't changed
            const brandNewBtnState = [...btnStateLoading]
            brandNewBtnState[0] = false;
            setBtnStateLoading(brandNewBtnState);
        };

    };

    // connects to anydesk
    const connectAnydesk = async () => {
        try {
            console.log("Connecting to anyDesk")
            const response = await axios.post('http://localhost:3000/server/anyDesk');
            if(response.data) {
                console.log(`CONNECTED!`);
            } else {
                console.log(`err~~`);
            }
        } catch(err) {
            console.log(err);
        }; 
    };

    // Creates Casco table in the db
    const createTable = async () => {

        // disable all buttons
        setBtnFree(true);

        // setting the message for the board
        setMessages([...messages, {'id': 2, 'msg' : "Creating casco/kasko table...", 'completed': false}])

        // sets the state of the btn - loading
        const newBtnState = [...btnStateLoading]
        newBtnState[2] = true;
        setBtnStateLoading(newBtnState);

        try {
            console.log("Creating new table", fileNameRequest)
            // changing the name of the xls file
            const name = fileNameRequest.replace(/^smarka/i, '');
            const finalName = name.replace(/.xls/i, '').toLocaleLowerCase();

            setTableName(`${finalName}_kasko`);

            const response = await axios.post('http://localhost:3000/kasko/table', {finalName: `${finalName}_kasko`});

            if(response.data) {
                console.log(`Table created successfully!`);
            } else {
                console.log(`No error but no response as well?!`);
            }
            // set message to completed
            updateMessageStatus(2);
            
            // all the buttons should appear now
            const btnState1 = [true, true, true];
            setBtnHasPressed(btnState1);

            // activate all buttons
            setBtnFree(false);

        } catch(err) {
            setMessages([...messages, {'id': 2, 'msg' : "Table creation failed.", 'completed': false}]);

            // changing the button state
            const brandNewBtnState = [...btnStateLoading]
            newBtnState[2] = false;
            setBtnStateLoading(brandNewBtnState);
            console.log(err, btnStateLoading);

            // activate all buttons
            setBtnFree(false);
        };

        // changing the button state - no loading
        const brandNewBtnState = [...btnStateLoading]
        newBtnState[2] = false;
        setBtnStateLoading(brandNewBtnState);
    };

    const loadTable = async () => {

        setMessages([...messages, {'id': 2, 'msg' : "Loading casco/kasko table...", 'completed': false}])
        // changing the button state - loading
        const newBtnState = [...btnStateLoading]
        newBtnState[3] = true;
        setBtnStateLoading(newBtnState);

        // disable all buttons
        setBtnFree(true);

        try {
            console.log("Loading new table", tableName)
            console.log(fileNameRequest.replace('.xls', '.csv'))

            const response = await axios.post('http://localhost:3000/kasko/load', { tableParams: [tableName, fileNameRequest.replace('.xls', '.csv')] });
      
            console.log(`Table ${tableName} loaded successfully!`, response);
             // set message to completed
            setMessages([...messages, {'id': 2, 'msg' : "Loading casco/kasko table...", 'completed': true}]);

            // activate all buttons
            setBtnFree(false);

            // all the buttons should appear now
            const btnState1 = [true, true, true, true];
            setBtnHasPressed(btnState1);

        } catch(err) {
            console.log(err);
            setMessages([...messages, {'id': 2, 'msg' : "Loading table failed.", 'completed': false}]);

            // activate all buttons
            setBtnFree(false);
        };
        // changing the button state - no loading
        const brandNewBtnState = [...btnStateLoading]
        brandNewBtnState[3] = false;
        setBtnStateLoading(brandNewBtnState);
    };

    // copy/truncate/fill monthly import
    const handleMonthlyImport = async (id: number, msgFalse: string, msgTrue: string, path: string, action: string) => {

        setMessages([...messages, {'id': id, 'msg' : msgTrue, 'completed': false}]);

        // changing the button state - loading
        const newBtnState = [...btnStateLoading]
        newBtnState[id+1] = true;
        setBtnStateLoading(newBtnState);

        // disable all buttons
        setBtnFree(true);

        try {
            console.log(`${action} monthly import...`)
            // the path variable chooses the endpoint to hit
            const response = await axios.post(`http://localhost:3000/kasko/${path}`, {tableName});
            
            if(response.data) {

                setMessages([...messages, {'id': id, 'msg' : msgTrue, 'completed': true}])
                console.log(messages);
                // activate all buttons
                setBtnFree(false);

                // all the buttons should appear now
                let btnState1 = []
                for(let i=0; i<=id+1; i++){
                    btnState1.push(true);
                };
                setBtnHasPressed(btnState1);
            };

        } catch(err) {
            console.log(err);
            setMessages([...messages, {'id': id, 'msg' : msgFalse, 'completed': false}]);

            // activate all buttons
            setBtnFree(false); 
        }; 

        // changing the button state - no loading
        const brandNewBtnState = [...btnStateLoading]
        brandNewBtnState[id+1] = false;
        setBtnStateLoading(brandNewBtnState); 
    };

    useEffect((() => {console.log('messages updated!', btnStateLoading)}),[messages, btnStateLoading, btnHasPressed])

    return(
        <>
        <div>
            <ToastContainer
            position="top-right"
            newestOnTop={false}
            limit={4}
            theme="light"/>
        </div>
        <div className='mt-6 flex flex-col items-center'>
            <form className="mt-6 flex flex-col relative" action="submit" onSubmit={upload}>
                <input className="shadow-btnShadow flex mb-10 mx-auto px-20 py-4 text-xl font-medium bg-[#325474] text-[#ffedc9] border border-[#325474] rounded-full file:rounded-full file:mr-6 file:px-4 file:py-3 file:bg-[#23768a] file:text-[#ffedc9] file:hover:cursor-pointer file:shadow-btnShadow file:hover:bg-[#399143] " type="file" onChange={handleFile} id="fileInput" accept=".xls,.xlsx" />
                {btnHasPressed[0] &&
                <button disabled={btnFree} className="shadow-btnShadow mt-4 mb-4 mx-auto w-[12vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-center font-bold text-[#473d72] italic bg-[#e2ebee] rounded-md tracking-wider hover:bg-[#599dbd] hover:text-[#ffffff]" type="submit" >{!btnStateLoading[0] ? (<p>Upload & Convert to CSV</p>) : <LoadingBtn/>} 
                </button>}
            </form>
            <div className='flex justify-between space-x-4'>
                {/* {btnHasPressed[1] &&
                <button disabled={btnFree} onClick={connectAnydesk} className="shadow-btnShadow mt-4 mx-auto w-[10vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-center font-bold text-white italic bg-[#bc7575] rounded-md tracking-wider hover:bg-[#ff6e5e]">
                {!btnStateLoading[1] ? (<p>Connect to anydesk</p>) : <LoadingBtn/>} 
                </button>} */}
                {btnHasPressed[1] && 
                <button disabled={btnFree} onClick={createTable} className="shadow-btnShadow mt-4 mx-auto w-[10vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-center font-bold text-[#463e52] italic bg-[#d3e4f0] rounded-md tracking-wider hover:bg-[#77a7be] hover:text-[#ffffff]">
                {!btnStateLoading[2] ? (<p>Create kasko Table</p>) : <LoadingBtn/>}  
                </button>}
            </div>
            <div className='flex flex-col'>
                {btnHasPressed[2] && 
                <button disabled={btnFree} onClick={loadTable} className="items-center shadow-btnShadow mt-8 mx-auto w-[12vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-center text-lg font-bold text-[#3f346f] italic bg-[#c5ddee] rounded-md tracking-wider hover:bg-[#77a7be] hover:text-[#ffffff]">
                    {!btnStateLoading[3] ? (<p>Load kasko Table</p>) : <LoadingBtn/>}         
                </button>}
            </div>
            <div className='flex flex-col'>
                {btnHasPressed[3] && 
                <button disabled={btnFree} onClick={() => 
                        handleMonthlyImport(3, "Failed to truncate monthly import table", "Truncated monthly import table", "truncate", "truncating")} className="items-center shadow-btnShadow mt-8 mx-auto w-[12vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-lg text-center font-bold text-[#243461] italic bg-[#aed4f0] rounded-md tracking-wider hover:bg-[#599dbd] hover:text-[#ffffff]">
                    {!btnStateLoading[4] ? (<p>Truncate monthly import</p>) : <LoadingBtn/>}         
                </button>}
            </div>
            <div className='flex flex-col'>
                {btnHasPressed[4] && 
                <button disabled={btnFree} onClick={() => handleMonthlyImport(4, "Failed to fill the monthly import table", "Filled monthly import table", "fill", "filling")} className="items-center shadow-btnShadow mt-8 mx-auto w-[12vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-lg text-center font-bold text-[#241b4c] italic bg-[#9bc9f3] rounded-md tracking-wider hover:bg-[#599dbd] hover:text-[#ffffff]">
                    {!btnStateLoading[5] ? (<p>Fill monthly import</p>) : <LoadingBtn/>}         
                </button>}
            </div>
            <div className='flex flex-col'>
                {btnHasPressed[5] && 
                <button disabled={btnFree} onClick={() => handleMonthlyImport(5, "Failed to copy the monthly import table", "Copying monthly import table", "copy", "copying")} className="items-center shadow-btnShadow mt-8 mx-auto w-[12vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-lg text-center font-bold text-[#294087] italic bg-[#88bef0] rounded-md tracking-wider hover:bg-[#599dbd] hover:text-[#ffffff]">
                    {!btnStateLoading[6] ? (<p>Copy monthly import</p>) : <LoadingBtn/>}         
                </button>}
            </div>
            {/* The parent div inherits the width of the div below*/}
            <div className='bg-[#325474] border-2 border-[#325474] h-[40vh] w-[50vw] mt-16 shadow-btnShadow rounded-lg flex'>
                <div className='md:w-1/2 sm:w-screen flex-col border-dotted border-r-4 position-fixed overflow-y-auto overflow-x-hidden'>
                    <h2 className='text-center text-[#e7efa3] text-[1.6rem] font-medium border-b-2 mx-4  border-[#ffffff] mb-4'>Process</h2>
                    <div className='border-[#ffffff] relative'>
                            {messages.map((msg) => (<div className='text-[1.2rem] border-b-2 border-[#ffffff] flex space-x-8 mt-2 mb-0 mx-4'><p className='text-[#e2ec8c]'>{msg['msg']}</p> <div>{msg['completed'] && <div className=' mr-4'><CheckMe/></div>}</div> </div>))}
                    </div>
                </div>
                <div className='md:w-1/2 sm:w-[0vw] flex-col position-fixed overflow-hidden sm:invisible md:visible'>
                        <h2 className='text-center text-[#dee59e] text-[1.6rem] font-medium border-b-2 mx-4  border-[#ffffff] mb-4 '>Steps</h2>
                        <ul>
                            <li className='text-[1.3rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#eff3c7] tracking-wide font-semibold'> 1.&nbsp; Choose a file to upload</p>
                            </li>
                            <li className='text-[1.3rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#eff3c7] tracking-wide font-semibold'> 2.&nbsp; Press the upload button</p>
                            </li>
                            <li className='text-[1.3rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#eff3c7] tracking-wide font-semibold'> 3.&nbsp; Press the create table button</p>
                            </li>
                            <li className='text-[1.3rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#eff3c7] tracking-wide font-semibold'> 4.&nbsp; Press the Load table button</p>
                            </li>
                            <li className='text-[1.3rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#eff3c7] tracking-wide font-semibold'> 5.&nbsp; Truncate monthly import table</p>
                            </li>
                            <li className='text-[1.3rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#eff3c7] tracking-wide font-semibold'> 6.&nbsp; Fill monthly import table</p>
                            </li>
                            <li className='text-[1.3rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#eff3c7] tracking-wide font-semibold'> 7.&nbsp; Copy monthly import table to eurotax</p>
                            </li>
                            <li><button disabled={btnFree} onClick={()=>{setMessages([])}} className='flex items-center justify-center w-1/2 mx-auto rounded-full text-center text-[#fad995] font-bold bg-[#23768a] mt-10 mb-4 py-3 tracking-wider shadow-btnShadow hover:bg-[#2a7c44]'>Clear Process</button>
                            </li>
                        </ul>
                </div>
            </div>
        </div>
        <div>
            <ToastContainer
            position="top-right"
            newestOnTop={false}
            limit={4}
            theme="light"/>
        </div>
        </>
    )
}
export default Casco;