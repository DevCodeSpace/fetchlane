const pendingRequests = new Map();

export const getPendingRequest = (key) => {
  return pendingRequests.get(key);
};

export const setPendingRequest = (key, promise) => {
  pendingRequests.set(key, promise);
};

export const clearPendingRequest = (key) => {
  pendingRequests.delete(key);
};
