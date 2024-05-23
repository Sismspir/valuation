import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowRight as Right} from 'react-icons/Ai';
import { AiOutlineArrowLeft as Left} from 'react-icons/Ai';

const Login  = (props: {updateUser: (user:string) => void}) =>{

    const navigate = useNavigate();
    const handleLogin = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        const form = ev.currentTarget;
        const username = form.username.value;
        const password = form.password.value;

        const loginUser = async () => {
            try {
                const response = await axios.post('http://localhost:3000/server/login', {username, password});
                if(response.data) {
                    props.updateUser(username);
                    console.log(`[Login] Response #1, ${username} successfully logged in`);
                    navigate('/valuations');
                } else {
                    console.log(`[Login] Response #2`);
                }
            } catch(err) {
                console.log(`[Login] Response #3, wrong pasword!`);
                console.log(err);
                const notify = () => toast("wrong password!");
                notify();
                props.updateUser("");
            };
        }
        // sent user's credentials in the db
        loginUser();
    };

    const goRegister = () => {
        navigate('/register');
    };

    return(
        <>
        <div>
            <div>
                <ToastContainer
                position="top-right"
                newestOnTop={false}
                limit={4}
                theme="light"/>
            </div>
            <form className="mt-16 flex flex-col space-y-4 bg-[#708f97] rounded-md p-2" action="submit" onSubmit={handleLogin}>
                <input className='text-center rounded-md focus:outline-none' placeholder='username' name='username' type="text" />
                <input className='text-center rounded-md focus:outline-none' placeholder='password' name='password' type="password" />
                <input className="cursor-pointer border border-[#9dd3e0] bg-[#f5e587] font-serif font-normal text-[#1a494d] w-1/2 self-center rounded-md hover:italic hover:bg-[#f8fa93]" value="Log In" type="submit" />
            </form>
        </div>
        <div className='mt-3 bg-slate-200 p-1 rounded-md text-[#496d6d] font-serif flex flex-row space-x-2'>Don't have an account? <div className='ml-2 mt-1'><Right/></div><p onClick={goRegister} className='italic font-semibold underline hover:cursor-pointer hover:no-underline'>Sign up here</p><div className='mt-1'><Left/></div></div>
        </>
    )
}
export default Login;