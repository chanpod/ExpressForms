import { Address, Application, Vehicle } from "@prisma/client";
import { Form } from "@remix-run/react";
import { useEffect, useRef } from "react";
import Input from "~/components/Input";

export interface ApplicationActionErrors {
  name?: string;
  firstName?: string;
  lastName?: string;
  vehicles?: Vehicle[];
  address?: Address;
}

interface Props {
  errors?: ApplicationActionErrors;
  application?: Application;
}

export const ApplicationsForm = ({ application, errors }: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLTextAreaElement>(null);
  const lastNameRef = useRef<HTMLTextAreaElement>(null);

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
    }
  }, [errors]);

  return (
    <Form
      method="post"
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
        />
      </div>
      <div>
        <Input
          label="Last Name"
          ref={lastNameRef}
          name="lastName"
          errors={errors?.lastName !== undefined}
          errorMessage={errors?.lastName}
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
