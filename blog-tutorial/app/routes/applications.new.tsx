import { Application } from "@prisma/client";
import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import {
  ApplicationActionErrors,
  ApplicationsForm,
} from "~/components/ApplicationsForm";
import { createApplication } from "~/models/application.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const application: Partial<Application> = {
    name: formData.get("name") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
  };

  if (typeof application.name !== "string" || application.name?.length === 0) {
    return json({ errors: { name: "Name is required" } }, { status: 400 });
  }

  const newApplication = await createApplication(application);

  return redirect(`/applications/${newApplication.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData<{ errors: ApplicationActionErrors }>();

  return <ApplicationsForm errors={actionData?.errors} />;
}
