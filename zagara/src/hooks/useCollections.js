import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { collectionData as localData } from '../data/collections';

export const useCollections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "collections"));
                const firestoreData = [];
                querySnapshot.forEach((doc) => {
                    firestoreData.push({ id: doc.id, ...doc.data() });
                });

                if (firestoreData.length > 0) {
                    setCollections(firestoreData);
                } else {
                    // Fallback to local data if Firestore is empty
                    console.log("Firestore empty, using local data");
                    setCollections(localData);
                }
            } catch (error) {
                console.error("Error fetching collections:", error);
                // Fallback on error
                setCollections(localData);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    return { collections, loading };
};
