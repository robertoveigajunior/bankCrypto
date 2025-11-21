import { PortfolioProvider } from './context/PortfolioContext';
import { LanguageProvider } from './context/LanguageContext';
import { ApiKeyProvider } from './context/ApiKeyContext';
import Dashboard from './components/Dashboard';
import ApiKeyModal from './components/ApiKeyModal';
import './index.css';

function App() {
    return (
        <ApiKeyProvider>
            <LanguageProvider>
                <PortfolioProvider>
                    <ApiKeyModal />
                    <div className="app-container">
                        <Dashboard />
                    </div>
                </PortfolioProvider>
            </LanguageProvider>
        </ApiKeyProvider>
    );
}

export default App;
