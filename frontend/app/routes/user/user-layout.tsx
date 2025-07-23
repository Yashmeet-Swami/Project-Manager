import { Outlet } from "react-router";


export default function UserLayout() {
  return (
    <div className="container max-w-3xl mx-auto py-8 md:py-16">
      <Outlet />
    </div>
  );
};

