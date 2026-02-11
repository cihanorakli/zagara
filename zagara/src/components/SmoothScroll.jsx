import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { useLocation } from 'react-router-dom';

const SmoothScroll = ({ children }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        // Scroll to top on route change
        lenis.scrollTo(0, { immediate: true });

        return () => {
            lenis.destroy();
        };
    }, [pathname]); // Re-run effect when pathname changes

    // Prevent browser from restoring scroll position
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);


    return <>{children}</>;
};

export default SmoothScroll;
