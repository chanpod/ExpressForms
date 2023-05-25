import React, { RefObject, forwardRef } from "react";

interface Props {
  errors: boolean;
  errorMessage: string;
  label: string;
  name: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent) => void;
}

const Input = forwardRef(
  (
    { label, errors, errorMessage, name, defaultValue, onChange }: Props,
    ref
  ) => {
    return (
      <>
        <label className="flex w-full flex-col gap-1">
          <span>{label} </span>
          <input
            ref={ref}
            defaultValue={defaultValue}
            name={name}
            onChange={onChange}
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={errors}
            aria-errormessage={errors ? errorMessage : undefined}
          />
        </label>
        {errors ? (
          <div className="pt-1 text-red-700" id="body-error">
            {errorMessage}
          </div>
        ) : null}
      </>
    );
  }
);

export default Input;
