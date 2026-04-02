const API = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8080';

export const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${API}${url}`;
};

export const openFile = (url) => {
  if (!url) return;
  window.open(getMediaUrl(url), '_blank');
};
