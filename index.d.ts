import type { ReactNode, ReactElement } from "react";

declare type SmartLoaderErrorRenderer = (error: unknown) => ReactNode;

declare type SmartLoaderProps<T = unknown> = {
  api: () => Promise<T>;
  skeleton?: ReactNode;
  error?: ReactNode | SmartLoaderErrorRenderer;
  children?: ((data: T) => ReactNode) | ReactNode;
};

declare type UseSmartLoaderOptions = {
  retry?: number;
  delay?: number;
  cache?: boolean;
};

declare type UseSmartLoaderResult<T = unknown> = {
  data: T | null;
  loading: boolean;
  error: unknown | null;
  refetch: () => Promise<T | null>;
};

export declare function SmartLoader<T = unknown>(props: SmartLoaderProps<T>): ReactElement | null;


export declare function useSmartLoader<T = unknown>(
  api: () => Promise<T>,
  options?: UseSmartLoaderOptions,
): UseSmartLoaderResult<T>;
