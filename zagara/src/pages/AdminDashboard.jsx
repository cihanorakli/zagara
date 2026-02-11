import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
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

    if (loading && !collections.length) return <div className="admin-login-page">Yükleniyor...</div>;

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <div className="user-info">
                    <span style={{ marginRight: '1rem' }}>{user?.email}</span>
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
