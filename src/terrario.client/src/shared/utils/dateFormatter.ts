import i18n from '../i18n';

/**
 * Formats a date string as a relative time (e.g., "2h ago", "3 days ago")
 * or as a localized date if older than a week
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return i18n.t('time.justNow');
  } else if (diffInHours < 24) {
    return i18n.t('time.hoursAgo', { hours: diffInHours });
  } else if (diffInDays < 7) {
    return i18n.t('time.daysAgo', { days: diffInDays });
  } else {
    const locale = i18n.language || 'en';
    return date.toLocaleDateString(locale);
  }
};

/**
 * Formats a date string in a long format (e.g., "January 15, 2024")
 * using the current locale
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const locale = i18n.language || 'en';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a date string in a short format (e.g., "01/15/2024")
 * using the current locale
 */
export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  const locale = i18n.language || 'en';
  return date.toLocaleDateString(locale);
};
