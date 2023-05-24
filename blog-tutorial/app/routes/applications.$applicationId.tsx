import { Application } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  ApplicationActionErrors,
  ApplicationsForm,
} from "~/components/ApplicationsForm";
import { deleteApplication, getApplication } from "~/models/application.server";

interface ILoaderData {
    application: Application;
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
  }

  throw new Error("Invalid method");
};

export default function NoteDetailsPage() {
  const data = useLoaderData<ILoaderData>();
  const actionData = useActionData<{ errors: ApplicationActionErrors }>();
  return (
    <div>
      <h3 className="text-2xl font-bold">{data?.application?.name}</h3>
      <p className="py-6">{data?.application?.firstName}</p>
      <hr className="my-4" />
      <ApplicationsForm
        application={data.application as any}
        errors={actionData?.errors}
      />
      <Form method="delete">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
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
