import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll window
        window.scrollTo(0, 0);

        // Scroll body and html (standard)
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        // Scroll app-container if it's the scrollable element
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.scrollTop = 0;
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
