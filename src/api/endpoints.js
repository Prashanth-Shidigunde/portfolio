/**
 * Centralized API Endpoint Definitions
 */

export const ENDPOINTS = {
  SERVICES: '/services',
  SERVICE_BY_SLUG: (slug) => `/services/${slug}`,
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  TESTIMONIALS: '/testimonials',
  BOOKINGS: '/bookings',
  BOOKING_BY_ID: (id) => `/bookings/${id}`,
  CONTACT: '/contact',
  FILE_UPLOAD: '/files/upload'
};

export default ENDPOINTS;
