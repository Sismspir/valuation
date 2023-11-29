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
    const [isValidType, setIsValidType] = useState<RegExpMatchArray | null>();
    const [fileNameRequest, setFileNameRequest] = useState<string>("");
    const [messages, setMessages] = useState<Imessage[]>([]);
    const [tableName, setTableName] = useState<string>("");
    const [xlsFile, setXlsFile] = useState<Blob>();
    const [btnFree, setBtnFree] = useState<boolean>(false);
    const fileNameRegex = /\.(xls|xlsx)$/i;

    // When the file is changed
    const handleFile = (e: ChangeEvent<HTMLInputElement>) => {

        const { files } = e?.target;
        const fileName = files?.[0].name;

        // for the next button to appear
        setXlsFile(files?.[0]);
        setBtnHasPressed([true, false, false]);
        setFileNameRequest(fileName != undefined ? fileName : "");

        // returns undefined if the file does not end with .xls or xlsx
        if (fileName?.match(fileNameRegex) != undefined && fileName?.match(fileNameRegex) != null){
            setIsValidType(fileName?.match(fileNameRegex)); 
        }
      
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

    //-----------------------------GPT CODE CHECK THE FILE TYPE---------------------------------------

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
      
    //-----------------------------GPT CODE CHECK THE FILE TYPE---------------------------------------

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

    // creates table in the db
    const createTable = async () => {

        // disable all buttons
        setBtnFree(true);

        // set the message for the board
        setMessages([...messages, {'id': 2, 'msg' : "Creating casco/kasko table...", 'completed': false}])

        // sets the state of the btn - loading
        const newBtnState = [...btnStateLoading]
        newBtnState[2] = true;
        setBtnStateLoading(newBtnState);

        try {
            console.log("Creating new table", fileNameRequest)
            const name = fileNameRequest.replace(/^smarka/i, '');
            const finalName = name.replace(/.xls/i, '').toLocaleLowerCase();
            setTableName(`${finalName}_kasko`);
            const response = await axios.post('http://localhost:3000/kasko/table', {finalName: `${finalName}_kasko`});
            if(response.data) {
                console.log(`Table created successfully!`);
            } else {
                console.log(`err~~`);
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

    // truncate monthly import
    const truncate = async () => {

        setMessages([...messages, {'id': 3, 'msg' : "Truncating monthly import table...", 'completed': false}]);

        // changing the button state - loading
        const newBtnState = [...btnStateLoading]
        newBtnState[4] = true;
        setBtnStateLoading(newBtnState);

        // disable all buttons
        setBtnFree(true);

        try {
            console.log("Truncating monthly import...")
            const response = await axios.post('http://localhost:3000/kasko/truncate');

            if(response.data) {
                console.log(`Truncated!`);
                setMessages([...messages, {'id': 3, 'msg' : "Truncated monthly import table", 'completed': true}])

                // activate all buttons
                setBtnFree(false);

                // all the buttons should appear now
                const btnState1 = [true, true, true, true, true];
                setBtnHasPressed(btnState1);
            };

        } catch(err) {
            console.log(err);
            setMessages([...messages, {'id': 3, 'msg' : "Failed to truncate monthly import table", 'completed': false}]);
            
            // activate all buttons
            setBtnFree(false); 
        };
        // changing the button state - no loading
        const brandNewBtnState = [...btnStateLoading]
        brandNewBtnState[4] = false;
        setBtnStateLoading(brandNewBtnState); 
    };

    // truncate monthly import
    const fill = async () => {

        setMessages([...messages, {'id': 4, 'msg' : "Filling monthly import table...", 'completed': false}]);

        // changing the button state - loading
        const newBtnState = [...btnStateLoading]
        newBtnState[5] = true;
        setBtnStateLoading(newBtnState);
        
        // disable all buttons
        setBtnFree(true);

        try {
            console.log("Filling monthly import...")
            const response = await axios.post('http://localhost:3000/kasko/fill', { tableName });

            if(response.data) {
                console.log(`Truncated!`);
                setMessages([...messages, {'id': 4, 'msg' : "Filling monthly import table", 'completed': true}])

                // activate all buttons
                setBtnFree(false);

                // all the buttons should appear now
                const btnState1 = [true, true, true, true, true, true];
                setBtnHasPressed(btnState1);
            };

        } catch(err) {
            console.log(err);
            setMessages([...messages, {'id': 4, 'msg' : "Failed to fill monthly import table", 'completed': false}]);

            // activate all buttons
            setBtnFree(false); 
        }; 
        // changing the button state - no loading
        const brandNewBtnState = [...btnStateLoading]
        brandNewBtnState[5] = false;
        setBtnStateLoading(brandNewBtnState); 
    };

    // copy monthly import
    const copy = async () => {

        setMessages([...messages, {'id': 5, 'msg' : "Copying monthly import table...", 'completed': false}]);

        // disable all buttons
        setBtnFree(true);

        try {
            console.log("Copying monthly import...")
            const response = await axios.post('http://localhost:3000/kasko/copy');
            
            if(response.data) {
                console.log(`Truncated!`);
                setMessages([...messages, {'id': 5, 'msg' : "Copying monthly import table", 'completed': true}])

                // activate all buttons
                setBtnFree(false);
            };

        } catch(err) {
            console.log(err);
            setMessages([...messages, {'id': 5, 'msg' : "Failed to copy monthly import table", 'completed': false}]);

            // activate all buttons
            setBtnFree(false); 
        }; 
    };

    useEffect((() => {console.log('messages updated!', btnStateLoading)}),[messages, btnStateLoading, btnHasPressed])

    return(
        <>
        <div className='flex flex-col items-center'>
            <form className="mt-6 flex flex-col relative" action="submit" onSubmit={upload}>
                <input className="shadow-btnShadow flex mb-10 mx-auto px-20 py-4 text-xl font-medium bg-[#709bac] text-[#ffffff] border-2 border-[#ffffff] rounded-md file:rounded-full file:mr-6 file:px-4 file:py-3 file:bg-[#68abba] file:text-[#ffffff] file:hover:cursor-pointer" type="file" onChange={handleFile} id="fileInput" accept=".xls,.xlsx" />
                {btnHasPressed[0] &&
                <button disabled={btnFree} className="shadow-btnShadow mt-4 mb-4 mx-auto w-[12vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-center font-bold text-[#473d72] italic bg-[#dae5e9] rounded-md tracking-wider hover:bg-[#599dbd] hover:text-[#ffffff]" type="submit" >{!btnStateLoading[0] ? (<p>Upload & Convert to CSV</p>) : <LoadingBtn/>} 
                </button>}
            </form>
            <div className='flex justify-between space-x-4'>
                {btnHasPressed[1] &&
                <button disabled={btnFree} onClick={connectAnydesk} className="shadow-btnShadow mt-4 mx-auto w-[10vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-center font-bold text-white italic bg-[#bc7575] rounded-md tracking-wider hover:bg-[#ff6e5e]">
                {!btnStateLoading[1] ? (<p>Connect to anydesk</p>) : <LoadingBtn/>} 
                </button>}
                {btnHasPressed[1] && 
                <button disabled={btnFree} onClick={createTable} className="shadow-btnShadow mt-4 mx-auto w-[10vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-center font-bold text-white italic bg-[#338459] rounded-md tracking-wider hover:bg-[#59bd88]">
                {!btnStateLoading[2] ? (<p>Create kasko Table</p>) : <LoadingBtn/>}  
                </button>}
            </div>
            <div className='flex flex-col'>
                {btnHasPressed[2] && 
                <button disabled={btnFree} onClick={loadTable} className="items-center shadow-btnShadow mt-8 mx-auto w-[12vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-center text-lg font-bold text-[#3f346f] italic bg-[#c6dae1] rounded-md tracking-wider hover:bg-[#77a7be] hover:text-[#ffffff]">
                    {!btnStateLoading[3] ? (<p>Load kasko Table</p>) : <LoadingBtn/>}         
                </button>}
            </div>
            <div className='flex flex-col'>
                {btnHasPressed[3] && 
                <button disabled={btnFree} onClick={truncate} className="items-center shadow-btnShadow mt-8 mx-auto w-[12vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-lg text-center font-bold text-[#243461] italic bg-[#bfdbe4] rounded-md tracking-wider hover:bg-[#599dbd] hover:text-[#ffffff]">
                    {!btnStateLoading[4] ? (<p>Truncate monthly import</p>) : <LoadingBtn/>}         
                </button>}
            </div>
            <div className='flex flex-col'>
                {btnHasPressed[4] && 
                <button disabled={btnFree} onClick={fill} className="items-center shadow-btnShadow mt-8 mx-auto w-[12vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-lg text-center font-bold text-[#241b4c] italic bg-[#b1d4e1] rounded-md tracking-wider hover:bg-[#599dbd] hover:text-[#ffffff]">
                    {!btnStateLoading[5] ? (<p>Fill monthly import</p>) : <LoadingBtn/>}         
                </button>}
            </div>
            <div className='flex flex-col'>
                {btnHasPressed[5] && 
                <button disabled={btnFree} onClick={copy} className="items-center shadow-btnShadow mt-8 mx-auto w-[12vw] min-w-[15rem] h-[3vh] min-h-[4rem] text-lg text-center font-bold text-[#294087] italic bg-[#b4cee7] rounded-md tracking-wider hover:bg-[#599dbd] hover:text-[#ffffff]">
                    {!btnStateLoading[6] ? (<p>Copy monthly import</p>) : <LoadingBtn/>}         
                </button>}
            </div>
            {/* The parent div inherits the width of the div below*/}
            <div className='bg-[#325474] border-2 border-[#ffffff] min-h-[35vh] w-[50vw] mt-16 shadow-btnShadow rounded-lg flex'>
                <div className='w-1/2 flex-col border-r-2'>
                    <h2 className='text-center text-[#e2ec8c] text-[1.6rem] font-medium border-b-2 mx-4  border-[#ffffff] mb-4'>Process</h2>
                    <div className='border-[#ffffff]'>
                            {messages.map((msg) => (<div className='text-[1.2rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'><p className='text-[#e2ec8c]'>{msg['msg']}</p> <div>{msg['completed'] && <CheckMe/>}</div> </div>))}
                    </div>
                </div>
                <div className='w-1/2 flex-col'>
                        <h2 className='text-center text-[#e2ec8c] text-[1.6rem] font-medium border-b-2 mx-4  border-[#ffffff] mb-4'>Steps</h2>
                        <ul>
                            <li className='text-[1.2rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#e2ec8c]'> 1. Choose a file to upload</p>
                            </li>
                            <li className='text-[1.2rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#e2ec8c]'> 2. Press the upload button</p>
                            </li>
                            <li className='text-[1.2rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#e2ec8c]'> 3. Press the create table button</p>
                            </li>
                            <li className='text-[1.2rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#e2ec8c]'> 4. Press the Load table button</p>
                            </li>
                            <li className='text-[1.2rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#e2ec8c]'> 5. Truncate monthly import table</p>
                            </li>
                            <li className='text-[1.2rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#e2ec8c]'> 6. Fill monthly import table</p>
                            </li>
                            <li className='text-[1.2rem] border-b-2 border-[#ffffff] flex space-x-8 my-2 mx-4'>
                                <p className='text-[#e2ec8c]'> 7. Copy monthly import table to eurotax</p>
                            </li>
                            <li><button disabled={btnFree} onClick={()=>{setMessages([])}} className='flex items-center justify-center w-1/2 mx-auto rounded-full text-center text-[#fad995] font-bold bg-[#23768a] mt-10 mb-4 py-3 tracking-wider shadow-btnShadow hover:bg-[#2a7c44]'>Clear Process</button></li>
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