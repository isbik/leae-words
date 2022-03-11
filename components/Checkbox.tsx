import clsx from "clsx";
import React, { FC } from "react";

type Props = {
  checked?: boolean;
  onChange?: () => void;
};

const Checkbox: FC<Props> = ({ onChange, checked, ...props }) => {
  return (
    <div
      onClick={onChange}
      className="flex items-center gap-2 text-left cursor-pointer group"
    >
      <div
        className={clsx(
          "transition-all w-4 h-4 rounded-full group-hover:bg-indigo-300",
          {
            "bg-indigo-500 !border-white": checked,
            "border-2 border-indigo-500": !checked,
          }
        )}
      ></div>
      {props.children}
    </div>
  );
};

export default Checkbox;
