import { PortfolioProvider } from './context/PortfolioContext';
import { LanguageProvider } from './context/LanguageContext';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
    return (
        <LanguageProvider>
            <PortfolioProvider>
                <div className="app-container">
                    <Dashboard />
                </div>
            </PortfolioProvider>
        </LanguageProvider>
    );
}

export default App;
