import { useEffect, useRef, useState } from "react";
import { getCache, isCacheValid, setCache } from "./cache.js";
import {
    clearPendingRequest,
    getPendingRequest,
    setPendingRequest,
} from "./requestMap.js";

const getCacheKey = (api) => api.toString();

const log = (debug, message) => {
  if (debug) {
    console.log(`[SmartLoader] ${message}`);
  }
};

export const useSmartLoader = (api, options = {}) => {
  const {
    cache: enableCache = true,
    retry: maxRetry = 0,
    delay: loadingDelay = 0,
    debug = false,
    ttl = null,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);
  const delayTimerRef = useRef(null);
  const loadingTimerRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  const fetchWithRetry = async () => {
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetry; attempt += 1) {
      try {
        log(debug, `Fetching (attempt ${attempt + 1}/${maxRetry + 1})...`);
        const result = await api();
        return result;
      } catch (err) {
        lastError = err;
        if (attempt < maxRetry) {
          log(debug, `Retry ${attempt + 1}/${maxRetry}...`);
        }
      }
    }
    throw lastError;
  };

  const executeRequest = async (cacheKey) => {
    try {
      if (enableCache && isCacheValid(cacheKey)) {
        const cached = getCache(cacheKey);
        log(debug, "Cache hit");
        if (isMountedRef.current) {
          setData(cached.data);
          setError(null);
          setLoading(false);
        }
        return cached.data;
      }

      const pending = getPendingRequest(cacheKey);
      if (pending) {
        log(debug, "Deduped request");
        const result = await pending;
        if (isMountedRef.current) {
          setData(result);
          setError(null);
          setLoading(false);
        }
        return result;
      }

      if (loadingDelay > 0) {
        setLoading(false);
        loadingTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setLoading(true);
          }
        }, loadingDelay);
      } else {
        setLoading(true);
      }

      setError(null);

      const promise = fetchWithRetry();
      setPendingRequest(cacheKey, promise);

      const result = await promise;

      if (enableCache) {
        setCache(cacheKey, result, ttl);
      }

      if (isMountedRef.current) {
        setData(result);
        setError(null);
        setLoading(false);
      }

      clearPendingRequest(cacheKey);
      return result;
    } catch (err) {
      log(debug, `Error: ${err.message}`);
      if (isMountedRef.current) {
        setError(err);
        setLoading(false);
      }
      clearPendingRequest(cacheKey);
      throw err;
    } finally {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (!api || typeof api !== "function") {
      return;
    }

    delayTimerRef.current = setTimeout(() => {
      executeRequest(getCacheKey(api));
    }, 0);

    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
      }
    };
  }, [api, enableCache, maxRetry, loadingDelay, debug, ttl]);

  const refetch = async () => {
    const cacheKey = getCacheKey(api);
    clearPendingRequest(cacheKey);
    return executeRequest(cacheKey);
  };

  return { data, loading, error, refetch };
};
