import ReactDOM from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom';
import AlertContainer from "./Alert/AlertContainer";
import 'tailwindcss/tailwind.css';
import App from './App'
import './assets/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AlertContainer>
        <Router>
            <App />
        </Router>
    </AlertContainer>
)
