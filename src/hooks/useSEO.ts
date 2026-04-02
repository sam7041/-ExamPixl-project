import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description: string;
  canonical?: string;
}

/**
 * Sets document <title> and meta description on every tool page.
 * React doesn't touch the <head> natively, so we do it manually here.
 * For a full SSR/SSG setup you'd use react-helmet-async, but this
 * is enough for Vercel/Netlify SPA deployments indexed via JavaScript rendering.
 */
export function useSEO({ title, description, canonical }: SEOOptions) {
  useEffect(() => {
    // Title
    document.title = `${title} | ExamPixl`;

    // Meta description
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;

    // OG title
    let ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${title} | ExamPixl`;

    // OG description
    let ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = description;

    // Canonical
    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [title, description, canonical]);
}
