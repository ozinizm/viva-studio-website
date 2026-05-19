/**
 * Helper utility to safely format and resolve media paths in the Viva Studio application.
 * Licenses: Fikir Creative (https://fikircreative.com)
 */

export const PLACEHOLDER_IMAGE = 'https://vivastudiopilates.com/assets/images/placeholder.jpg';

const BACKEND_BASE = import.meta.env.PROD ? window.location.origin : 'http://localhost';

export function getMediaUrl(url: string | null | undefined, fallback: string = PLACEHOLDER_IMAGE): string {
    if (!url) return fallback;
    
    const trimmed = url.trim();
    if (trimmed === '') return fallback;
    
    // If it starts with http/https, use it directly
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    
    // If it starts with /uploads, prepend origin or resolve relative to current host
    if (trimmed.startsWith('/uploads')) {
        return BACKEND_BASE + trimmed;
    }
    
    // If it's another relative path, ensure leading slash and prepend origin
    if (trimmed.startsWith('/')) {
        return BACKEND_BASE + trimmed;
    }
    
    return BACKEND_BASE + '/' + trimmed;
}
