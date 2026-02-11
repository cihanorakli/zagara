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
    const selectedItem = collections.find(item => item.id === selectedId);

    return (
        <div className="collections-page">
            <h1 className="collections-title">{t('collections.title')}</h1>

            <div className="collections-grid">
                {collections.map((item) => (
                    <motion.div
                        key={item.id}
                        className="collection-card"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedId(item.id)}
                        layoutId={`card-${item.id}`}
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
                {selectedModel && (
                    <div className="modal-overlay" onClick={() => setSelectedModel(null)}>
                        <motion.div
                            className="modal-content"
                            layoutId={`card-${selectedModel.id}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="close-button" onClick={() => setSelectedModel(null)}>
                                <X size={24} />
                            </button>

                            <div className="modal-image-container">
                                <div className="modal-gallery">
                                    {selectedModel.images.map((img, index) => (
                                        <motion.img
                                            key={index}
                                            src={img}
                                            alt={`${selectedModel.name} view ${index + 1}`}
                                            className="modal-image"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + (index * 0.1) }}
                                            style={{ mixBlendMode: selectedModel.blendMode || 'multiply' }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <motion.div className="modal-details" layoutId={`info-${selectedModel.id}`}>
                                <h2 className="modal-title">{selectedModel.name}</h2>
                                <span className="modal-color">{selectedModel.color} Series</span>
                                <p className="modal-description">{selectedModel[`description_${language}`] || selectedModel.description}</p>
                                {selectedModel.contactText && (
                                    <Link to="/contact" className="modal-contact-link">
                                        {selectedModel[`contactText_${language}`] || selectedModel.contactText}
                                    </Link>
                                )}
                                <div className="modal-footer">
                                    <span>{selectedModel.season || "Collection 2026"}</span>
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
