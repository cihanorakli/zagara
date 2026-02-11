import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const { language, toggleLanguage, t } = useLanguage();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Determine navbar class
    const navbarClass = isHome && !isScrolled && !isMenuOpen ? 'navbar-transparent' : 'navbar-glass';

    return (
        <nav className={`navbar ${navbarClass}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    {t('navbar.brand')}
                </Link>

                {/* Mobile Menu Toggle */}
                <button className="mobile-menu-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Links */}
                <div className="navbar-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        Home
                    </NavLink>
                    <NavLink to="/collections" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        {t('navbar.collections')}
                    </NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        {t('navbar.atelier')}
                    </NavLink>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        {t('navbar.contact')}
                    </NavLink>
                    <button onClick={toggleLanguage} className="lang-toggle">
                        {language === 'en' ? 'TR' : 'EN'}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                    <div className="mobile-menu-links">
                        <NavLink to="/" className="mobile-nav-link">Home</NavLink>
                        <NavLink to="/collections" className="mobile-nav-link">{t('navbar.collections')}</NavLink>
                        <NavLink to="/about" className="mobile-nav-link">{t('navbar.atelier')}</NavLink>
                        <NavLink to="/contact" className="mobile-nav-link">{t('navbar.contact')}</NavLink>
                        <button onClick={toggleLanguage} className="mobile-lang-toggle">
                            {language === 'en' ? 'Switch to Turkish' : 'İngilizceye Geç'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
