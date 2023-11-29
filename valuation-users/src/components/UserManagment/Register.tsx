import { useNavigate } from 'react-router-dom';
import React, {useState, FormEvent} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Loading from "../Screen/Loading";
import axios from 'axios';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [registering, setRegistering] = useState(false);

    let result: any;

    const handleRegister = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formEvent = event.currentTarget;
        const username = formEvent.username.value;
        const password = formEvent.password.value;
        const email = formEvent.email.value;
        const confirm = formEvent.confirm.value;
        // validate input
        if( password != confirm ){
            const notify = () => toast("Passwords dont match");
            notify();
            return;
        } else if(password.length < 3){
            const notify = () => toast("Your pass must contain at least 3 characters!");
            notify();
            return;
        } else if(username.trim() == "") {
            const notify = () => toast("Please enter a valid username");
            notify();
            return;
        }

        const insertUser = async () => {
            setRegistering(true);
            try {
                const response = await axios.post(`http://localhost:3000/server/insert`, { username: username, password, email });
                result = response;
                console.log("response =>", response.data.response);
                setRegistering(false);
            } catch(err: any) {
                    console.log(err.response);
                    if(err.response.status == 409){
                        setRegistering(false);
                        const notify = () => toast("Username already exists");
                        notify();
                    } 
                    return;
            };
            const notify = () => toast("User registered successfully");
            notify();    
        };

        insertUser();
    };

    const goLogin = () => {
        navigate('/login');
    };

    return(
        <>
        <div>
            <ToastContainer
            position="top-right"
            newestOnTop={false}
            limit={4}
            theme="light"/>
        </div>
        {registering ? <Loading/> : <div className='w-[35vw]'>
        <div className='mt-4 mb-2 text-center font-serif font-bold'><div className='tracking-wider font-serif text-2xl text-[#254352] text-center mb-2 font-bold mx-auto w-1/2'>Register</div></div>
        <form className="flex flex-col space-y-6 bg-[#708f97] rounded-md p-2 py-4" action="submit" onSubmit={(e) => {handleRegister(e)}}>
            <input className='text-center rounded-md focus:outline-none  placeholder-[#706161] italic' placeholder='username' name='username' type="text" />
            <input className='text-center rounded-md focus:outline-none placeholder-[#706161] italic' placeholder='email' name='email' type="email" />
            <input className='text-center rounded-md focus:outline-none placeholder-[#706161] italic' placeholder='password' name='password' type="password" />
            <input className='text-center rounded-md focus:outline-none placeholder-[#706161] italic' placeholder='confirm password' name='confirm' type="password" />
            <input className="cursor-pointer border border-[#9dd3e0] bg-[#f5e587] font-sans font-semibold text-[#1a494d] w-1/2 self-center rounded-md hover:italic hover:bg-[#f8fa93] min-w-fit" value="Sign Up" type="submit" />
        </form>
            <div className='mt-3 bg-slate-200 p-1 rounded-md text-[#496d6d] font-serif flex justify-center space-x-2'><div className='ml-2 mt-1'></div><p onClick={goLogin} className='italic font-semibold underline hover:cursor-pointer hover:no-underline'>Login here</p><div className='mt-1'></div></div>
        </div>}
        </>
    );
}
export default Register;