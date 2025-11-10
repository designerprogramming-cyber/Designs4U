
import type { Product } from '../types';

// Placeholder for a transparent 1x1 pixel PNG
const placeholder_image_url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
// Placeholder for a simple text file download
const placeholder_download_url = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==';


export const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    categoryId: 'cat_1',
    name: 'Modern Logo Design',
    description: 'A unique and modern logo for your brand. Includes 3 concepts and unlimited revisions. Delivered in all standard formats.',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    variants: [
        { id: 'v1_1', name: 'Web Resolution (PNG)', price: 150, downloadUrl: placeholder_download_url, fileName: 'logo_web.png' },
        { id: 'v1_2', name: 'Print Resolution (PDF)', price: 200, downloadUrl: placeholder_download_url, fileName: 'logo_print.pdf' },
        { id: 'v1_3', name: 'Source File (AI)', price: 250, downloadUrl: placeholder_download_url, fileName: 'logo_source.ai' },
    ]
  },
  {
    id: 'prod_2',
    categoryId: 'cat_2',
    name: 'Social Media Kit',
    description: 'Eye-catching graphics for all your social media profiles. Includes profile pictures and cover photos for 3 platforms.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    variants: [
        { id: 'v2_1', name: 'Basic Package (JPG)', price: 99, downloadUrl: placeholder_download_url, fileName: 'social_kit.jpg' },
        { id: 'v2_2', name: 'Pro Package (PNG & Source)', price: 149, downloadUrl: placeholder_download_url, fileName: 'social_kit_pro.zip' },
    ]
  },
  {
    id: 'prod_3',
    categoryId: 'cat_1',
    name: 'Full Branding Package',
    description: 'A complete branding solution. Includes logo, business cards, letterhead, and a comprehensive brand style guide.',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    variants: [
        { id: 'v3_1', name: 'Digital Files Only', price: 450, downloadUrl: placeholder_download_url, fileName: 'branding_digital.zip' },
        { id: 'v3_2', name: 'Digital + Print Ready', price: 600, downloadUrl: placeholder_download_url, fileName: 'branding_full.zip' },
    ]
  },
];