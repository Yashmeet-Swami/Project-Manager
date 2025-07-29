import { Outlet, useLocation } from "react-router";

export default function UserLayout() {
  const location = useLocation();
  const isProfilePage = location.pathname.includes("/profile");

  return (
    <div className={isProfilePage ? "" : "container max-w-3xl mx-auto py-8 md:py-16"}>
      <Outlet />
    </div>
  );
}
