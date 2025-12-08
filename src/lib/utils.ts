import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeHtmlElements(html: string) {
  let result = html;
  result = replaceNbsps(result);
  result = result.replace(/<[^>]*>/g, '');
  result = result.replace(/&[a-z0-9#]+;/gi, '');
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

export function replaceNbsps(str: string) {
  return str.replace(/&nbsp;|\u00A0/g, ' ');
}
