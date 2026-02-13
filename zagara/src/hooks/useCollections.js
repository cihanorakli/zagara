import { useState, useEffect } from 'react';
import { collectionData as localData } from '../data/collections';

export const useCollections = () => {
    // Return local data immediately
    return { collections: localData, loading: false };
};
