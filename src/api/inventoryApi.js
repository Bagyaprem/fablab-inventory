// src/api/inventoryApi.js
const GAS_URL = "https://script.google.com/macros/s/AKfycbweodnN2W5nIa2h8iAM6EhAgTUF4oljGfl3brYRo6ctQUKqGxfqe71hXzSdifkD2xzEhA/exec";


/**
 * Sends a "Take" request to Google Sheets
 */
export const takeComponents = async (formData) => {
    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            redirect: 'follow', 
            body: JSON.stringify({ action: 'take', ...formData }),
        });
        return await response.json();
    } catch (error) {
        throw new Error("Failed to connect to the inventory database.");
    }
};

/**
 * Fetches all inventory records for the Dashboard
 */
export const getRequests = async () => {
    try {
        // Added ?t= parameter to prevent browser caching of old sheet data
        const response = await fetch(`${GAS_URL}?t=${Date.now()}`); 
        const data = await response.json();
        return { data: { data: data.data, counts: data.counts } };
    } catch (error) {
        throw new Error("Could not load inventory records.");
    }
};

/**
 * Updates a specific item to "Returned"
 */
export const returnComponents = async (requestId) => {
    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify({ action: 'return', id: requestId }),
        });
        return await response.json();
    } catch (error) {
        throw new Error("Failed to update return status.");
    }
};

/**
 * Helper to find a specific record by ID
 */
export const getRequestById = async (id) => {
    const all = await getRequests();
    const record = all.data.data.find(r => r.id === id);
    return { data: { data: record } };
};

/**
 * Looks up requests by Name, Email, or ID
 * Prioritizes Name and handles case-insensitive search
 */
export const lookupRequests = async (searchQuery) => {
  try {
    const response = await fetch(`${GAS_URL}?t=${Date.now()}`);
    const result = await response.json();
    
    if (!searchQuery) return { data: { data: result.data } };

    const query = searchQuery.toLowerCase().trim();

    const filteredData = result.data.filter(r => 
        // Priority 1: Search by Name
        r.name.toLowerCase().includes(query) || 
        // Priority 2: Search by Email or ID
        r.email.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query)
    );

    return { data: { data: filteredData } };
  } catch (error) {
    console.error("Lookup error:", error);
    throw new Error("Could not find any records for that search.");
  }
};