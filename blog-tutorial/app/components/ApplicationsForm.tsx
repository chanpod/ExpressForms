import { Address, Application, Vehicle } from "@prisma/client";
import { Form } from "@remix-run/react";
import { useEffect, useRef } from "react";
import Input from "~/components/Input";
import { ApplicationForm } from "~/types/Application";

export interface ApplicationActionErrors {
  name?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  vehicles?: Vehicle[];
  address?: Address;
}

interface Props {
  errors?: ApplicationActionErrors;
  application?: ApplicationForm;
}

export const ApplicationsForm = ({ application, errors }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLTextAreaElement>(null);
  const lastNameRef = useRef<HTMLTextAreaElement>(null);
  const dobRef = useRef<HTMLTextAreaElement>(null);
  const cityRef = useRef<HTMLTextAreaElement>(null);
  const stateRef = useRef<HTMLTextAreaElement>(null);
  const zipRef = useRef<HTMLTextAreaElement>(null);
  const streetRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (application !== undefined) {
      formRef.current?.reset();
    }
  }, []);

  useEffect(() => {
    if (errors?.name) {
      nameRef.current?.focus();
    } else if (errors?.firstName) {
      firstNameRef.current?.focus();
    } else if (errors?.lastName) {
      lastNameRef.current?.focus();
    } else if (errors?.dob) {
      dobRef.current?.focus();
    } else if (errors?.address?.city) {
      cityRef.current?.focus();
    } else if (errors?.address?.state) {
      stateRef.current?.focus();
    } else if (errors?.address?.zip) {
      zipRef.current?.focus();
    } else if (errors?.address?.street) {
      streetRef.current?.focus();
    }
  }, [errors]);

  return (
    <Form
      method={application ? "PUT" : "POST"}
      ref={formRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <Input
          label="Name"
          ref={nameRef}
          name="name"
          errors={errors?.name !== undefined}
          errorMessage={errors?.name}
          defaultValue={application?.name}
        />
      </div>

      <div>
        <Input
          label="First Name"
          ref={firstNameRef}
          name="firstName"
          errors={errors?.firstName !== undefined}
          errorMessage={errors?.firstName}
          defaultValue={application?.firstName}
        />
      </div>
      <div>
        <Input
          label="Last Name"
          ref={lastNameRef}
          name="lastName"
          errors={errors?.lastName !== undefined}
          errorMessage={errors?.lastName}
          defaultValue={application?.lastName}
        />
      </div>

      <div>
        <Input
          label="Date of Birth"
          ref={dobRef}
          name="dob"
          errors={errors?.dob !== undefined}
          errorMessage={errors?.dob}
          defaultValue={application?.dob}
        />
      </div>

      <div>
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
        />

        <Input
          label="Street"
          ref={streetRef}
          name="street"
          errors={errors?.address?.street !== undefined}
          errorMessage={errors?.address?.street}
        />
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
};
