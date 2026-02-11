import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Collections.css';
import { useLanguage } from '../context/LanguageContext';
import { useCollections } from '../hooks/useCollections';
import { Link } from 'react-router-dom';

const Collections = () => {
    const { t, language } = useLanguage();
    const { collections, loading } = useCollections();
    const [selectedId, setSelectedId] = useState(null);

    // Find selected item from the dynamic collections array
    const selectedItem = collections.find(item => item.id === selectedId);

    return (
        <div className="collections-page">
            <h1 className="collections-title">{t('collections.title')}</h1>

            <div className="collections-grid">
                {collections.map((model) => (
                    <motion.div
                        key={model.id}
                        className="collection-card"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedId(model.id)}
                        layoutId={`card-${model.id}`}
                    >
                        <div className="card-image-wrapper">
                            <motion.img
                                src={model.images[0]}
                                alt={model.name}
                                className="card-image"
                                layoutId={`image-${model.id}-0`}
                                style={{ mixBlendMode: model.blendMode || 'multiply' }}
                            />
                            <div className="card-overlay">
                                <span className="view-text">{t('collections.viewModel')}</span>
                            </div>
                        </div>
                        <motion.div className="card-info" layoutId={`info-${model.id}`}>
                            <h3 className="card-name">{model.name}</h3>
                            <p className="card-color">{model.color}</p>
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedItem && (
                    <div className="modal-overlay" onClick={() => setSelectedId(null)}>
                        <motion.div
                            className="modal-content"
                            layoutId={`card-${selectedItem.id}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="close-button" onClick={() => setSelectedId(null)}>
                                <X size={24} />
                            </button>

                            <div className="modal-image-container">
                                <div className="modal-gallery">
                                    {selectedItem.images.map((img, index) => (
                                        <motion.img
                                            key={index}
                                            src={img}
                                            alt={`${selectedItem.name} view ${index + 1}`}
                                            className="modal-image"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + (index * 0.1) }}
                                            style={{ mixBlendMode: selectedItem.blendMode || 'multiply' }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <motion.div className="modal-details" layoutId={`info-${selectedItem.id}`}>
                                <h2 className="modal-title">{selectedItem.name}</h2>
                                <span className="modal-color">{selectedItem.color} Series</span>
                                <p className="modal-description">{selectedItem[`description_${language}`] || selectedItem.description}</p>
                                {selectedItem.contactText && (
                                    <Link to="/contact" className="modal-contact-link">
                                        {selectedItem[`contactText_${language}`] || selectedItem.contactText}
                                    </Link>
                                )}
                                <div className="modal-footer">
                                    <span>{selectedItem.season || "Collection 2026"}</span>
                                    <span>{t('collections.uniquePiece')}</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Collections;
