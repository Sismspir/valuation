import { ThemeProvider } from './components/Context/ThemeContext';
import { useTheme } from './components/Context/ThemeContext';
import {BrowserRouter as Router} from 'react-router-dom';
import ReactDOM from 'react-dom/client'
import 'tailwindcss/tailwind.css';
import App from './App'
import './assets/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
        <Router>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </Router>
)
