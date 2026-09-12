/**
 * Formatting Helper Utilities
 */

export function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(isoStr, options = {}) {
  if (!isoStr) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const dateObj = new Date(isoStr);
  const defaultOpts = { year: 'numeric', month: 'short', day: 'numeric', ...options };
  return dateObj.toLocaleDateString('en-US', defaultOpts);
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFirstName(fullNameStr) {
  if (!fullNameStr) return 'Client';
  return fullNameStr.trim().split(' ')[0] || 'Client';
}

export function sanitizeString(str) {
  if (!str) return '';
  return str.replace(/[<>&"']/g, (match) => {
    const map = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return map[match];
  });
}
