import { motion } from 'framer-motion';
import { sectionVariants, imageVariants } from '../utils/anim';
import { Link } from 'react-router-dom';
import './CollectionPreview.css';
import { useLanguage } from '../context/LanguageContext';
import { useCollections } from '../hooks/useCollections';

const CollectionPreview = () => {
    const { t, language } = useLanguage();
    const { collections, loading } = useCollections();

    // While loading, we could show skeleton or nothing. 
    // Since we have fallback, 'collections' will be maintained.

    // Select first 3 items as featured
    const featuredLooks = collections.slice(0, 3).map((item, index) => ({
        ...item,
        align: index === 0 ? "left" : index === 1 ? "right" : "center",
        offset: index === 0 ? "0px" : index === 1 ? "120px" : "60px"
    }));

    return (
        <section className="collection-section">
            <motion.h2
                className="collection-header"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={sectionVariants}
            >
                {t('home.collectionPreview.title')} <span className="season">{t('home.collectionPreview.subtitle')}</span>
            </motion.h2>

            <div className="looks-container">
                {featuredLooks.map((look) => (
                    <div key={look.id} className={`look-wrapper align-${look.align}`} style={{ marginTop: look.offset }}>
                        <Link to="/collections">
                            <motion.div
                                className="look-image-container"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-10%" }}
                                variants={imageVariants}
                                style={{ mixBlendMode: look.blendMode || 'multiply' }}
                            >
                                <img src={look.images[0]} alt={look.name} className="look-image" />
                            </motion.div>
                        </Link>
                        <div className="look-info">
                            <h3 className="look-title">{look.name}</h3>
                            <p className="look-desc">{look[`description_${language}`] || look.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="collection-footer">
                <Link to="/collections" className="explore-link">{t('home.collectionPreview.explore')}</Link>
            </div>
        </section>
    );
};

export default CollectionPreview;
