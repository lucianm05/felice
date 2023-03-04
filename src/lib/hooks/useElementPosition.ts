import { MutableRefObject } from "react";

const useElementPosition = (ref?: MutableRefObject<HTMLElement | null>) => {
  if (!ref?.current) return null;

  return ref.current.getBoundingClientRect();
};

export default useElementPosition;
