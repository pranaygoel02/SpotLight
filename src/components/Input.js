import React from "react";

function Input({
  type,
  label,
  placeholder,
  value,
  cb,
  leftIcon,
  rightIcon,
  options,
  show,
  required,
  defaultValue,
  disabled
}) {
  return ( show &&
    <div className="flex flex-col">
      {label && <label className="text-sm text-neutral-500">{label}{required && <span className="text-red-600">*</span>}</label>}
      {options ? (
        <div className="inline-flex gap-2 flex-wrap" >
          {options?.map((option, index) => {
            return (
              <button
                className={`p-2 ${(option.value ?? option.label) === value ? "primary-btn" : "sidebar-link"}`}
                onClick={(e) => {
                  e?.preventDefault();
                  cb((prev) => (option.value ?? option.label));
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-2 border-b border-neutral-300 focus-within:border-black bg-transparent w-full inline-flex font-poppins">
          {leftIcon}
          {type === "textarea" ? (
            <textarea
              onChange={(e) => {
                e?.preventDefault();
                if(cb) {
                  cb((prev) => e.target.value);
                }
              }}
              value={value}
              placeholder={placeholder}
              className="p-2 w-full bg-transparent focus-within:outline-none focus-within:border-none"
            />
          ) : 
          (<input
            disabled={disabled}
            min={0}
            defaultValue={defaultValue}
            type={type}
            onChange={(e) => {
              e?.preventDefault();
              cb((prev) => e.target.value)
            }}
            value={value}
            placeholder={placeholder}
            className="p-2 w-full bg-transparent focus-within:outline-none focus-within:border-none disabled:text-neutral-500"
          />)}
          {rightIcon}
        </div>
      )}
    </div>
  );
}

export default Input;
