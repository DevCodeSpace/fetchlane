import { createElement } from "react";
import { useSmartLoader } from "./useSmartLoader";

export const SmartLoader = ({
  api,
  skeleton = createElement("p", null, "Loading..."),
  error = createElement("p", null, "Error occurred"),
  children,
}) => {
  const { data, loading, error: err } = useSmartLoader(api);

  if (loading) {
    return skeleton;
  }

  if (err) {
    return typeof error === "function" ? error(err) : error;
  }

  return typeof children === "function" ? children(data) : children;
};
