

export const sortNewsData = (data) => {
    return [...data].sort((a, b) => {
        // Convert string IDs to numbers
        const idA = Number.parseInt(a.haber_id, 10) || 0;
        const idB = Number.parseInt(b.haber_id, 10) || 0;
        return idB - idA; // Sort in descending order (newest first)
    });
};