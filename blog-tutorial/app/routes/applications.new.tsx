import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import {
  ApplicationActionErrors,
  ApplicationsForm,
} from "~/components/ApplicationsForm";
import { createApplication } from "~/models/application.server";
import { ApplicationsService } from "~/services/Applications.service";
import { ApplicationForm } from "~/types/Application";

export const action = async ({ request }: ActionArgs) => {
  const applicationService = new ApplicationsService();

  const application: Partial<ApplicationForm> =
    await applicationService.extractFormData(request);

  const errors = applicationService.validateApplicationForm(application);

  if (errors) {
    return json({ errors: errors }, { status: 400 });
  }

  const newApplication = await createApplication(application);

  return redirect(`/applications/${newApplication.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData<{ errors: ApplicationActionErrors }>();

  return <ApplicationsForm errors={actionData?.errors} />;
}
