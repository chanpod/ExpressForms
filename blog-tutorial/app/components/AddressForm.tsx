import React, { useRef } from "react";
import Input from "./Input";
import { ApplicationActionErrors } from "./ApplicationsForm";
import { ApplicationForm } from "~/types/Application";

interface Props {
  errors?: ApplicationActionErrors;
  application?: ApplicationForm;
}

const AddressForm = ({ errors, application }: Props) => {
  const cityRef = useRef<HTMLTextAreaElement>(null);
  const stateRef = useRef<HTMLTextAreaElement>(null);
  const zipRef = useRef<HTMLTextAreaElement>(null);
  const streetRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-row space-x-3">
      <Input
        label="Street"
        ref={streetRef}
        name="street"
        errors={errors?.address?.street !== undefined}
        errorMessage={errors?.address?.street}
        defaultValue={application?.address?.street}
      />
      
      <Input
        label="City"
        ref={cityRef}
        name="city"
        errors={errors?.address?.city !== undefined}
        errorMessage={errors?.address?.city}
        defaultValue={application?.address?.city}
      />

      <Input
        label="State"
        ref={stateRef}
        name="state"
        errors={errors?.address?.state !== undefined}
        errorMessage={errors?.address?.state}
        defaultValue={application?.address?.state}
      />

      <Input
        label="Zip"
        ref={zipRef}
        name="zip"
        errors={errors?.address?.zip !== undefined}
        errorMessage={errors?.address?.zip}
        defaultValue={application?.address?.zip}
      />
    </div>
  );
};

export default AddressForm;
