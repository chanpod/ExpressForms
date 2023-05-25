import React, { forwardRef } from "react";

interface Props {
  errors: boolean;
  errorMessage: string;
  label: string;
  name: string;
  defaultValue?: string | number | readonly string[] | undefined;
  onChange?: (event: React.ChangeEvent) => void;
  type?: string;
}

const DateInput = forwardRef(
  (
    { label, errors, errorMessage, name, defaultValue, type, onChange }: Props,
    ref
  ) => {
    return (
      <div className="flex flex-col space-y-1">
        <label className="flex w-full flex-col gap-1">
          <span>{label} </span>
          <input
            type="date"
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
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
