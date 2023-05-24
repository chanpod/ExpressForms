import React from "react";

interface Props {
  ref: React.MutableRefObject<HTMLInputElement | null>;
  errors: boolean;
  errorMessage: string;
  label: string;
  name: string;
  defaultValue?: string;
}

const Input = ({ ref, label, errors, errorMessage, name, defaultValue }: Props) => {
  return (
    <>
      <label className="flex w-full flex-col gap-1">
        <span>{label} </span>
        <input
          ref={ref}
          defaultValue={defaultValue}
          name={name}
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
};

export default Input;
