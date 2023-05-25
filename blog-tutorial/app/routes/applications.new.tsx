import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useFetcher } from "@remix-run/react";
import { useRef } from "react";
import {
  ApplicationActionErrors,
  ApplicationsForm,
} from "~/components/ApplicationsForm";
import { createApplication } from "~/models/application.server";
import { ApplicationFormService } from "~/services/ApplicationForm.service";
import { ApplicationValidationService } from "~/services/ApplicationValidation.service";
import { ApplicationForm } from "~/types/Application";

/**
 * Actions are a lumping of everything but GET. This includes POST, PUT, PATCH, DELETE.
 * In this particular rout
 *
 */
export const action = async ({ request }: ActionArgs) => {
  if (request.method === "POST") {
    const applicationValidationService = new ApplicationValidationService();
    const applicationFormService = new ApplicationFormService();

    const formData = await request.formData();
    const application = applicationFormService.extractFormData(formData);

    const errors =
      applicationValidationService.validateApplicationForm(application);

    if (errors) {
      return json({ errors: errors }, { status: 400 });
    }

    const newApplication = await createApplication(application);

    return redirect(`/applications/${newApplication.id}`);
  }

  throw new Error("Method not allowed");
};

export default function NewNotePage() {
  const formRef = useRef();
  const submitter = useFetcher();

  function submit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const form = new FormData(formRef.current!);
    console.log(form.get("name"));
    const applicationService = new ApplicationFormService();
    const newApplication: Partial<ApplicationForm> =
      applicationService.buildFormData(form);

    submitter.submit(
      { ...newApplication },
      {
        method: "POST",
      }
    );
  }

  return (
    <>
      <Form
        ref={formRef}
        onSubmit={submit}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <ApplicationsForm errors={submitter.data?.errors} />
        <button type="submit" onClick={submit}>
          Save
        </button>
      </Form>
    </>
  );
}
