/**
 * Helper utility to safely format and resolve media paths in the Viva Studio application.
 * Licenses: Fikir Creative (https://fikircreative.com)
 */

export const PLACEHOLDER_IMAGE = 'https://vivastudiopilates.com/assets/images/placeholder.jpg';

/**
 * Format media URL using premium structured rules:
 * - If empty/null/undefined: returns fallback placeholder
 * - If starts with http/https: returns directly
 * - If relative (no leading slash): prepends '/'
 * - If starts with /uploads: prepends window.location.origin
 */
export function getMediaUrl(url: string | null | undefined, fallback: string = PLACEHOLDER_IMAGE): string {
    if (!url) return fallback;
    
    let trimmed = url.trim();
    if (trimmed === '') return fallback;
    
    // URL http ile başlıyorsa direkt kullan
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    
    // URL relative ise başına / ekle
    if (!trimmed.startsWith('/')) {
        trimmed = '/' + trimmed;
    }
    
    // URL /uploads ile başlıyorsa window.location.origin + url kullan
    return window.location.origin + trimmed;
}

/**
 * Fallback event handler to replace broken images with a premium placeholder
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
}
