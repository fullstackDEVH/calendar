import React, { useEffect, useCallback, MutableRefObject } from "react";

interface PopupProps {
  onClose: () => void;
  children: React.ReactNode;
  index: number;
  refs: MutableRefObject<(HTMLElement | null)[]>;
}

const Popup: React.FC<PopupProps> = ({ onClose, children, index, refs }) => {
  const setRef = useCallback(
    (node: HTMLElement | null) => {
      refs.current[index] = node;
    },
    [index, refs]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        refs.current[index] &&
        !refs.current[index]!.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, index, refs]);

  return (
    <div ref={setRef} className="popup">
      {children}
    </div>
  );
};

export default Popup;
