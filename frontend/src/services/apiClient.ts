import { useState } from 'react';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost/api';

export const apiClient = {
    async request(endpoint: string, options: RequestInit = {}) {
        const token = localStorage.getItem('viva_admin_auth_token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || 'API Error');
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    get(endpoint: string) { return this.request(endpoint); },
    post(endpoint: string, body: any) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); },
    put(endpoint: string, body: any) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); },
    delete(endpoint: string, body: any) { return this.request(endpoint, { method: 'DELETE', body: JSON.stringify(body) }); }
};
