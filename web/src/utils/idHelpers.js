/**
 * Helper to get ID from MongoDB document or legacy object
 * MongoDB uses _id, legacy PHP uses id
 */
export const getId = (obj) => {
  return obj?._id || obj?.id;
};

/**
 * Helper to compare IDs (handles both _id and id)
 */
export const compareIds = (id1, id2) => {
  const normalizeId = (id) =>
    typeof id === "object" ? id.toString() : String(id);
  return normalizeId(id1) === normalizeId(id2);
};

/**
 * Helper to filter array by ID
 */
export const filterById = (array, idToRemove) => {
  return array.filter((item) => !compareIds(getId(item), idToRemove));
};

/**
 * Helper to find item by ID
 */
export const findById = (array, idToFind) => {
  return array.find((item) => compareIds(getId(item), idToFind));
};

/**
 * Helper to find index by ID
 */
export const findIndexById = (array, idToFind) => {
  return array.findIndex((item) => compareIds(getId(item), idToFind));
};
