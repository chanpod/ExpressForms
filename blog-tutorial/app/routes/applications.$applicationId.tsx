import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import {
  ApplicationActionErrors,
  ApplicationsForm,
} from "~/components/ApplicationsForm";
import {
  deleteApplication,
  getApplication,
  updateApplication,
} from "~/models/application.server";
import { ApplicationsService } from "~/services/Applications.service";
import { ApplicationForm } from "~/types/Application";

interface ILoaderData {
  application: ApplicationForm;
}

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.applicationId, "noteId not found");

  const application = await getApplication({
    applicationId: params.applicationId,
  });
  if (!application) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ application });
};

export const action = async ({ params, request }: ActionArgs) => {
  invariant(params.applicationId, "noteId not found");

  if (request.method === "DELETE") {
    await deleteApplication({ applicationId: params.applicationId });

    return redirect("/applications");
  } else if (request.method === "PUT") {
    const applicationService = new ApplicationsService();

    const application: ApplicationForm =
      await applicationService.extractFormData(request);

    const errors = applicationService.validateApplicationForm(application);

    if (errors) {
      return json({ errors: errors }, { status: 400 });
    }

    const updatedApplication = await updateApplication({
      applicationId: params.applicationId,
      application,
    });

    return json({ application: updatedApplication });
  }

  throw new Error("Invalid method");
};

export default function NoteDetailsPage() {
  const data = useLoaderData<ILoaderData>();
  const actionData = useActionData<{ errors: ApplicationActionErrors }>();

  let [searchParams, setSearchParams] = useSearchParams();
  const editing = searchParams.get("editing") === "true";

  function toggleEditing() {
    console.log(searchParams);
    let newSearchParams = new URLSearchParams(searchParams);
    if (editing) {
      newSearchParams.delete("editing");
    } else {
      newSearchParams.set("editing", "true");
    }

    setSearchParams(newSearchParams);
  }

  return (
    <div className="max-w-xl">
      <h3 className="text-2xl font-bold">{data?.application?.name}</h3>
      {editing ? (
        <>
          <ApplicationsForm
            application={data.application as any}
            errors={actionData?.errors}
          />
          <div className="flex space-x-3">
            <button onClick={toggleEditing}>Cancel</button>
            <Form method="delete">
              <div>
                <button
                  type="submit"
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                  Delete
                </button>
              </div>
            </Form>
          </div>
        </>
      ) : (
        <div className="flex flex-col space-y-3">
          <p className="py-6">{data?.application?.firstName}</p>
          <p className="py-6">{data?.application?.lastName}</p>
          <hr className="my-4" />
          <div>
            <button
              onClick={toggleEditing}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
