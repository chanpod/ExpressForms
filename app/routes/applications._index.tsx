import { Link } from "@remix-run/react";

export default function RootApplicationsRoute() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      Select an application on the left or click{" "}
      <Link to="new" className="text-blue-500">
        {" "}
        New Application
      </Link>
    </div>
  );
}
