/**
 * Generic API HTTP Client
 * Prepares HTTP fetch requests using ENV.API_BASE_URL.
 */
import ENV from '../config/env';

export async function apiClient(endpoint, { body, headers: customHeaders, ...customConfig } = {}) {
  const headers = { 'Content-Type': 'application/json', ...customHeaders };

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers
    }
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const fullUrl = `${ENV.API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  try {
    const response = await fetch(fullUrl, config);
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return { success: true, data, status: response.status };
    }

    return {
      success: false,
      message: data.message || `API Error (${response.status})`,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Network request failed. Operating in offline/local mode.',
      isNetworkError: true
    };
  }
}

export default apiClient;
