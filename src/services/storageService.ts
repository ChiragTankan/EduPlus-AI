interface Certificate {
  id: number;
  user_id: string;
  module_name: string;
  issued_at: string;
}

const PROGRESS_KEY = 'eduai_user_progress';
const CERTIFICATES_KEY = 'eduai_user_certificates';

export const storageService = {
  getProgress: async (userId: string): Promise<string[]> => {
    if (!userId || userId === "undefined") return [];
    try {
      const response = await fetch(`/api/progress/${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Sync to local storage for offline/fallback
        const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
        allProgress[userId] = data;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
        return data;
      }
    } catch (error) {
      // Only log if it's not a common initialization issue
      if (userId && userId !== "undefined") {
        console.warn("Could not sync progress with server, using local data");
      }
    }
    
    // Fallback to local storage
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    return allProgress[userId] || [];
  },

  saveProgress: async (userId: string, moduleId: string): Promise<void> => {
    if (!userId || userId === "undefined") return;
    // Save to local storage first for immediate feedback
    const allProgress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    if (!allProgress[userId]) allProgress[userId] = [];
    if (!allProgress[userId].includes(moduleId)) {
      allProgress[userId].push(moduleId);
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
    }

    // Save to server
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moduleId })
      });
    } catch (error) {
      console.warn("Failed to save progress to server", error);
    }
  },

  getCertificates: async (userId: string): Promise<Certificate[]> => {
    if (!userId || userId === "undefined") return [];
    try {
      const response = await fetch(`/api/certificates/${userId}`);
      if (response.ok) {
        const data = await response.json();
        // Sync to local storage
        const allCerts = JSON.parse(localStorage.getItem(CERTIFICATES_KEY) || '{}');
        allCerts[userId] = data;
        localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(allCerts));
        return data;
      }
    } catch (error) {
      if (userId && userId !== "undefined") {
        console.warn("Could not sync certificates with server, using local data");
      }
    }

    // Fallback to local storage
    const allCerts = JSON.parse(localStorage.getItem(CERTIFICATES_KEY) || '{}');
    return allCerts[userId] || [];
  },

  issueCertificate: async (userId: string, moduleName: string): Promise<{ success: boolean; alreadyExists?: boolean }> => {
    if (!userId || userId === "undefined") return { success: false };
    // Optimistically update local storage
    const allCerts = JSON.parse(localStorage.getItem(CERTIFICATES_KEY) || '{}');
    if (!allCerts[userId]) allCerts[userId] = [];
    
    const existing = allCerts[userId].find((c: Certificate) => c.module_name === moduleName);
    if (existing) return { success: true, alreadyExists: true };

    // Save to server
    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moduleName })
      });
      
      if (response.ok) {
        const result = await response.json();
        // Refresh local storage with server data
        const freshCerts = await storageService.getCertificates(userId);
        allCerts[userId] = freshCerts;
        localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(allCerts));
        return result;
      }
    } catch (error) {
      console.error("Failed to issue certificate on server", error);
    }

    // Local-only fallback if server fails
    const newCert: Certificate = {
      id: Date.now(),
      user_id: userId,
      module_name: moduleName,
      issued_at: new Date().toISOString()
    };

    allCerts[userId].push(newCert);
    localStorage.setItem(CERTIFICATES_KEY, JSON.stringify(allCerts));
    return { success: true };
  }
};
