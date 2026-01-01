"use client";

import { userSignOut } from "@/app/actions/auth";
import { useStore } from "@/lib/store";
import TopbarMain from "./TopbarMain";

const Topbar = () => {
  const user = useStore((state) => state.user);

  return <TopbarMain user={user} userSignOutHandle={userSignOut} />;
};

export default Topbar;
