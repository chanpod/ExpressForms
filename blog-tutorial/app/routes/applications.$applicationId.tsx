import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { ApplicationsForm } from "~/components/ApplicationsForm";
import {
  deleteApplication,
  getApplication,
  updateApplication,
} from "~/models/application.server";
import { ApplicationValidationService } from "~/services/ApplicationValidation.service";
import {
  ApplicationFormService,
 
} from "~/services/ApplicationForm.service";
import { ApplicationData, ApplicationForm } from "~/types/Application";

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
    const applicationService = new ApplicationValidationService();
    const applicationFormService = new ApplicationFormService();
    const formData = await request.formData();

    const application: ApplicationData =
      applicationFormService.extractFormData(formData);

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

export default function ApplicationDetailsPage() {
  const data = useLoaderData<ILoaderData>();

  let [searchParams, setSearchParams] = useSearchParams();
  const editing = searchParams.get("editing") === "true";
  const submitter = useFetcher();
  const formRef = useRef();

  useEffect(() => {
    formRef.current?.reset();
  }, []);

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

  function deleteForm() {
    submitter.submit(
      {}, 
      {
        method: "DELETE",
      }
    );
  }

  function submit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const form = new FormData(formRef.current!);
    const applicationService = new ApplicationFormService();
    const newApplication: Partial<ApplicationForm> =
      applicationService.buildFormData(form);

    submitter.submit(
      { ...newApplication },
      {
        method: "PUT",
      }
    );
  }

  return (
    <div className="max-w-xl">
      <h3 className="text-2xl font-bold mb-5">{data?.application?.name}</h3>
      {editing ? (
        <>
          <Form
            method={"PUT"}
            ref={formRef}
            onSubmit={submit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%",
            }}
          >
            <ApplicationsForm
              application={data.application as any}
              errors={submitter.data?.errors}
            />
            <div className="flex space-x-3 mt-6">
              <button type="button" onClick={toggleEditing}>
                Cancel
              </button>

              <div>
                <button
                  type="button"
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                  onClick={deleteForm}
                >
                  Delete
                </button>
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                  Save
                </button>
              </div>
            </div>
          </Form>
        </>
      ) : (
        <div className="flex flex-col space-y-3">
          <p className="py-6">First Name: {data?.application?.firstName}</p>
          <p className="py-6">Last Name: {data?.application?.lastName}</p>          
          <p className="py-6">City: {data?.application?.address?.city}</p>
          <p className="py-6">State: {data?.application?.address?.state}</p>
          <p className="py-6">Zip: {data?.application?.address?.zip}</p>


          <hr className="my-4" />
          <div>
            <button
              type="button"
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
