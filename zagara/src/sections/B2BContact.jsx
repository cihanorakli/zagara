import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './B2BContact.css';
import { useLanguage } from '../context/LanguageContext';

const B2BContact = () => {
    const { t } = useLanguage();

    return (
        <footer className="b2b-footer">
            <div className="footer-content">
                <motion.div
                    className="inquiry-block"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="label">{t('footer.wholesale')}</span>
                    <Link to="/contact" className="contact-link">
                        {t('footer.request')}
                    </Link>
                    <Link to="/contact" className="contact-link secondary">
                        {t('footer.book')}
                    </Link>
                </motion.div>

                <div className="brand-signature">
                    <h2>Zagara</h2>
                    <span className="byline">{t('footer.byline')}</span>
                </div>

                <div className="footer-meta">
                    <div className="col">
                        <span className="label">{t('footer.social')}</span>
                        <a href="https://instagram.com/fashionzagara" target="_blank" rel="noopener noreferrer" className="social-link">Instagram</a>
                    </div>
                </div>
            </div>

            <div className="copyright">
                &copy; 2026 Oraklı Tekstil. {t('footer.rights')}
            </div>
        </footer>
    );
};

export default B2BContact;
