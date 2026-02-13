import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { collectionData } from '../data/collections';
import './Admin.css';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Form State
    const [newItem, setNewItem] = useState({
        name: '',
        images: '', // Comma separated URLs
        description_en: '',
        description_tr: '',
        contactText_en: 'Inquire about this look',
        contactText_tr: 'Bu model hakkında bilgi al'
    });

    // Auth Check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchCollections();
            } else {
                navigate('/admincihan');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Fetch Data
    const fetchCollections = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "collections"));
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            // Sort by creation or name if needed. For now default order.
            setCollections(items);
        } catch (error) {
            console.error("Error fetching collections:", error);
        }
        setLoading(false);
    };

    // Add Item
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.images) return;

        try {
            const imagesArray = newItem.images.split(',').map(url => url.trim());

            await addDoc(collection(db, "collections"), {
                ...newItem,
                images: imagesArray,
                id: Date.now(), // Fallback ID for compatibility
                createdAt: new Date()
            });

            // Reset Form & Refresh
            setNewItem({
                name: '',
                images: '',
                description_en: '',
                description_tr: '',
                contactText_en: 'Inquire about this look',
                contactText_tr: 'Bu model hakkında bilgi al'
            });
            fetchCollections();
            alert('Koleksiyon başarıyla eklendi!');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Hata oluştu.');
        }
    };

    // Delete Item
    const handleDelete = async (id) => {
        if (window.confirm('Bu koleksiyonu silmek istediğinize emin misiniz?')) {
            try {
                await deleteDoc(doc(db, "collections", id));
                fetchCollections();
            } catch (error) {
                console.error("Error deleting document: ", error);
            }
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admincihan');
    };

    // ... removed misplaced import

    // ... (inside component)

    // Bulk Add / Demo Data
    const handleBulkAdd = async () => {
        if (!window.confirm('Bu işlem 6 adet demo koleksiyon ürününü veritabanına ekleyecek. Onaylıyor musunuz?')) return;

        setLoading(true);
        try {
            const promises = collectionData.map(item => {
                // Ensure images are strings
                const images = Array.isArray(item.images) ? item.images : [item.images];
                // Convert imported image paths to something usable if needed, 
                // but here we can just store the path strings. 
                // Note: Local import paths like "/src/assets/..." might work on localhost 
                // but for production, real URLs are better. 
                // However, for "demo" purposes, this is fine.

                return addDoc(collection(db, "collections"), {
                    name: item.name,
                    description_en: item.description_en || item.description,
                    description_tr: item.description_tr || item.description,
                    contactText_en: item.contactText_en || item.contactText,
                    contactText_tr: item.contactText_tr || item.contactText,
                    season: item.season || '2025 Collection',
                    images: images,
                    createdAt: new Date()
                });
            });

            await Promise.all(promises);
            alert('Demo veriler başarıyla yüklendi!');
            fetchCollections();
        } catch (error) {
            console.error("Bulk add error:", error);
            alert("Hata oluştu: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !collections.length) return <div className="admin-login-page">Yükleniyor...</div>;

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '0.5rem' }}>İçerik Yönetim Paneli</p>
                </div>
                <div className="user-info">
                    <span style={{ marginRight: '1rem' }}>{user?.email}</span>
                    <button onClick={handleBulkAdd} className="submit-button" style={{ marginRight: '1rem', backgroundColor: '#4CAF50' }}>
                        Demo İçerik Yükle (Hızlı)
                    </button>
                    <button onClick={handleLogout} className="btn-logout">Çıkış Yap</button>
                </div>
            </header>

            <div className="admin-grid">
                {/* Form Section */}
                <div className="collection-form-container">
                    <h3>Yeni Koleksiyon Ekle</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>Model Adı</label>
                            <input
                                type="text"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                placeholder="Örn: Black Dahlia"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Resimler (URL)</label>
                            <input
                                type="text"
                                value={newItem.images}
                                onChange={(e) => setNewItem({ ...newItem, images: e.target.value })}
                                placeholder="Virgülle ayırarak resim linkleri"
                                required
                            />
                            <small style={{ opacity: 0.5 }}>Proje içindeki resimler için: /assets/resim-adi.jpg</small>
                        </div>
                        <div className="form-group">
                            <label>Açıklama (EN)</label>
                            <textarea
                                value={newItem.description_en}
                                onChange={(e) => setNewItem({ ...newItem, description_en: e.target.value })}
                                placeholder="English description..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Açıklama (TR)</label>
                            <textarea
                                value={newItem.description_tr}
                                onChange={(e) => setNewItem({ ...newItem, description_tr: e.target.value })}
                                placeholder="Türkçe açıklama..."
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Ekle</button>
                    </form>
                </div>

                {/* List Section */}
                <div className="collection-list">
                    <h3>Mevcut Koleksiyonlar ({collections.length})</h3>
                    {collections.length === 0 ? (
                        <p>Henüz Firebase'de hiç veri yok. Varsayılan (lokal) veriler gösteriliyor olabilir.</p>
                    ) : (
                        collections.map(item => (
                            <div key={item.id} className="list-item">
                                <div>
                                    <h4>{item.name}</h4>
                                    <small>{item.images && item.images[0] ? 'Resim var' : 'Resim yok'}</small>
                                </div>
                                <div className="actions">
                                    <button onClick={() => handleDelete(item.id)} className="btn-delete">Sil</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
