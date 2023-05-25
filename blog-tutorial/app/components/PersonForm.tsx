import { useEffect, useRef } from "react";
import Input from "./Input";

import { ApplicationActionErrors, ApplicationForm } from "~/types/Application";
import DateInput from "./DateInput";

interface Props {
  errors?: ApplicationActionErrors;
  application?: ApplicationForm;
}

const PersonForm = ({ errors, application }: Props) => {
  const firstNameRef = useRef<HTMLTextAreaElement>(null);
  const lastNameRef = useRef<HTMLTextAreaElement>(null);
  const dobRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (errors?.firstName) {
      firstNameRef.current?.focus();
    } else if (errors?.lastName) {
      lastNameRef.current?.focus();
    } else if (errors?.dob) {
      dobRef.current?.focus();
    }
  }, [errors]);

  return (
    <div>
      <div className="flex flex-row space-x-3">
        <div>
          <Input
            label="First Name"
            ref={firstNameRef}
            name="firstName"
            errors={errors?.firstName !== undefined}
            errorMessage={errors?.firstName as string}
            defaultValue={application?.firstName as string}
          />
        </div>
        <div>
          <Input
            label="Last Name"
            ref={lastNameRef}
            name="lastName"
            errors={errors?.lastName !== undefined}
            errorMessage={errors?.lastName as string}
            defaultValue={application?.lastName}
          />
        </div>
      </div>
      <div style={{ maxWidth: "250px" }}>
        <DateInput
          label="Date of Birth"
          ref={dobRef}
          name="dob"
          type="date"
          errors={errors?.dob !== undefined}
          errorMessage={errors?.dob as string}
          defaultValue={application?.dob}
        />
      </div>
    </div>
  );
};

export default PersonForm;
