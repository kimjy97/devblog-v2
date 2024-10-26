import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Types
interface ApiError extends Error {
  status: number;
  message: string;
}

interface BlacklistError extends ApiError {
  reason: string;
}

// Constants
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Error Handlers
const customThrowError = (error: any): ApiError => {
  const status = error?.response?.status || error.status || 500;
  const message = error?.response?.data?.error || error.message || 'Unknown error occurred';

  const apiError = new Error(message) as ApiError;
  apiError.status = status;
  apiError.message = message;

  return apiError;
};

const blacklistThrowError = (reason: string): BlacklistError => {
  const error = new Error(reason) as BlacklistError;
  error.status = 403;
  error.message = reason;
  error.reason = reason;

  return error;
};

// Response Handler
const handleResponse = (response: AxiosResponse) => {
  if (response.headers?.['x-is-blacklisted'] === 'true') {
    throw blacklistThrowError(response.data.reason);
  }
  return response.data;
};

// Utility Functions
const getFullUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

// Base API Configuration
const baseConfig: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Client-side API Functions
export const apiGet = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const response = await axios.get(url, { ...baseConfig, ...config });
    return handleResponse(response);
  } catch (error) {
    throw customThrowError(error);
  }
};

export const apiPost = async (url: string, data: any, config?: AxiosRequestConfig) => {
  try {
    const response = await axios.post(url, data, { ...baseConfig, ...config });
    return handleResponse(response);
  } catch (error) {
    throw customThrowError(error);
  }
};

export const apiPut = async (url: string, data: any, config?: AxiosRequestConfig) => {
  try {
    const response = await axios.put(url, data, { ...baseConfig, ...config });
    return handleResponse(response);
  } catch (error) {
    throw customThrowError(error);
  }
};

export const apiDelete = async (url: string, data?: any) => {
  try {
    const config = data ? { ...baseConfig, data } : baseConfig;
    const response = await axios.delete(url, config);
    return handleResponse(response);
  } catch (error) {
    throw customThrowError(error);
  }
};

// Server-side API Functions
export const serverApiGet = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const fullUrl = getFullUrl(url);
    const response = await axios.get(fullUrl, {
      ...baseConfig,
      ...config,
      headers: {
        ...baseConfig.headers,
        ...config?.headers,
        'User-Agent': 'Server',
      },
    });
    return response.data;
  } catch (error) {
    throw customThrowError(error);
  }
};

export const serverApiPost = async (url: string, data: any, config?: AxiosRequestConfig) => {
  try {
    const fullUrl = getFullUrl(url);
    const response = await axios.post(fullUrl, data, {
      ...baseConfig,
      ...config,
      headers: {
        ...baseConfig.headers,
        ...config?.headers,
        'User-Agent': 'Server',
      },
    });
    return response.data;
  } catch (error) {
    throw customThrowError(error);
  }
};

export const serverApiPut = async (url: string, data: any, config?: AxiosRequestConfig) => {
  try {
    const fullUrl = getFullUrl(url);
    const response = await axios.put(fullUrl, data, {
      ...baseConfig,
      ...config,
      headers: {
        ...baseConfig.headers,
        ...config?.headers,
        'User-Agent': 'Server',
      },
    });
    return response.data;
  } catch (error) {
    throw customThrowError(error);
  }
};

export const serverApiDelete = async (url: string, data?: any) => {
  try {
    const fullUrl = getFullUrl(url);
    const config = {
      ...baseConfig,
      headers: {
        ...baseConfig.headers,
        'User-Agent': 'Server',
      },
      ...(data && { data }),
    };
    const response = await axios.delete(fullUrl, config);
    return response.data;
  } catch (error) {
    throw customThrowError(error);
  }
};