const cache = new Map();

export const getCache = (key) => {
  return cache.get(key);
};

export const setCache = (key, value, ttl) => {
  cache.set(key, {
    data: value,
    expiry: ttl ? Date.now() + ttl : null,
  });
};

export const isCacheValid = (key) => {
  const item = cache.get(key);
  if (!item) return false;

  if (!item.expiry) return true;

  return Date.now() < item.expiry;
};