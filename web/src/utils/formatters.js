/**
 * Format date to MM-DD-YYYY
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  if (!date) return "N/A";

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";

    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();

    return `${month}-${day}-${year}`;
  } catch (error) {
    return "Invalid Date";
  }
}

/**
 * Format date and time to MM-DD-YYYY HH:MM AM/PM
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(date) {
  if (!date) return "N/A";

  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Invalid Date";

    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
  } catch (error) {
    return "Invalid Date";
  }
}

/**
 * Format MongoDB ObjectId for display (show last 8 characters)
 * @param {string} id - MongoDB ObjectId or regular ID
 * @returns {string} Formatted ID
 */
export function formatId(id) {
  if (!id) return "N/A";

  // If it's a MongoDB ObjectId (24 character hex string)
  if (
    typeof id === "string" &&
    id.length === 24 &&
    /^[a-f0-9]{24}$/i.test(id)
  ) {
    return `...${id.slice(-8)}`;
  }

  // Otherwise return as-is
  return String(id);
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return "$0.00";
  return `$${Number(amount).toFixed(2)}`;
}

/**
 * Format percentage
 * @param {number} value - Value to format as percentage
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value) {
  if (value == null || isNaN(value)) return "0%";
  return `${Number(value).toFixed(1)}%`;
}
