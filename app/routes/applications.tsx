import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { getApplications, getApplicationsRawSql } from "~/models/application.server";

//Loaders are GETs that happen on the server. They are used to fetch data for the page.
export const loader = async ({ request }: LoaderArgs) => {
  const applications = await getApplicationsRawSql();
  return json({ applications });
};

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Applications</Link>
        </h1>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Application
          </Link>

          <hr />

          {data.applications.length === 0 ? (
            <p className="p-4">No applications yet</p>
          ) : (
            <ol>
              {data.applications.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={note.id}
                  >
                    <span>📝 {note.name}</span>
                    <br />
                    <span>Completed: {note.completed ? "Yes" : "No"}</span>
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
