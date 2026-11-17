export interface LocalProfile {
  id: string;
  uid: string;
  type: string;
  image?: string;
  symptoms?: string | string[] | any[];
  inputs?: any;
  analysis?: any;
  results?: any;
  goalTitle?: string;
  createdAt: number;
  isPaid?: boolean;
  planId?: string;
  price?: number;
  analysisLang?: string;
  analysisPlanId?: string;
}

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AyurzenixHistoryDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('health_profiles')) {
        db.createObjectStore('health_profiles', { keyPath: 'id' });
      }
    };
  });
};

export const saveProfileLocally = async (idOrProfile: string | Omit<LocalProfile, 'id' | 'createdAt'>, profileData?: Omit<LocalProfile, 'id' | 'createdAt'>): Promise<string> => {
  const db = await initDB();
  let id: string;
  let data: Omit<LocalProfile, 'id' | 'createdAt'>;

  if (typeof idOrProfile === 'string') {
    id = idOrProfile;
    data = profileData!;
  } else {
    id = `profile_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    data = idOrProfile;
  }

  const fullProfile: LocalProfile = {
    ...data,
    id,
    createdAt: Date.now()
  };
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction('health_profiles', 'readwrite');
    const store = tx.objectStore('health_profiles');
    const request = store.put(fullProfile);
    
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const getHistoryLocally = async (uid?: string): Promise<LocalProfile[]> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction('health_profiles', 'readonly');
    const store = tx.objectStore('health_profiles');
    const request = store.getAll();
    
    request.onsuccess = () => {
      let results = request.result as LocalProfile[];
      // Option to filter by UID, or keep all local device history
      if (uid) {
        results = results.filter(p => p.uid === uid || p.uid === 'guest');
      }
      // Sort newest first
      results.sort((a, b) => b.createdAt - a.createdAt);
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
};

export const getProfileLocally = async (id: string): Promise<LocalProfile | null> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction('health_profiles', 'readonly');
    const store = tx.objectStore('health_profiles');
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const updateProfileLocally = async (id: string, updates: Partial<LocalProfile>): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction('health_profiles', 'readwrite');
    const store = tx.objectStore('health_profiles');
    const getReq = store.get(id);
    
    getReq.onsuccess = () => {
      if (!getReq.result) {
        reject(new Error("Profile not found"));
        return;
      }
      
      // Since updates might contain nested keys like 'analysis.herbsAndProducts', we should handle it better,
      // but typical JS spread handles top-level. 
      // If we pass an object, we just merge.
      let updatedData = { ...getReq.result };
      Object.keys(updates).forEach(key => {
        if (key.includes('.')) {
          const parts = key.split('.');
          let curr = updatedData;
          for (let i = 0; i < parts.length - 1; i++) {
            if (!curr[parts[i]]) curr[parts[i]] = {};
            curr = curr[parts[i]];
          }
          curr[parts[parts.length - 1]] = (updates as any)[key];
        } else {
          updatedData[key] = (updates as any)[key];
        }
      });
      
      const putReq = store.put(updatedData);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
};

export const clearLocalHistory = async (): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('health_profiles', 'readwrite');
    const store = tx.objectStore('health_profiles');
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};
