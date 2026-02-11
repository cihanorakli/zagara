import { motion } from 'framer-motion';
import { sectionVariants, imageVariants } from '../utils/anim';
import { collectionData } from '../data/collections';
import { Link } from 'react-router-dom';
import './CollectionPreview.css';
import { useLanguage } from '../context/LanguageContext';

const CollectionPreview = () => {
    const { t, language } = useLanguage();
    // Select 3 featured looks (e.g., Black Dahlia, Crimson Rose, Emerald Ivy)
    // Adjust indices to pick preferred models. Here using 0, 1, and 5 (Black, Red, Green)
    const featuredLooks = [collectionData[0], collectionData[1], collectionData[5]].map((item, index) => ({
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
