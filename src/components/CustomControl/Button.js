import React from "react";

export const Button = (props) => {
  // console.log('virtualize props from button: ', props);
  return (
    <button
    title={props.title ? props.title : ""}
      onClick={() => {
        props.onClick();
      }}
      // className={props.class}
      className={props.disabled ? "btnDisable" : props.class}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  );
};
