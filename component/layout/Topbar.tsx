"use client";

import { userSignOut } from "@/app/actions/auth";
import TopbarMain from "./TopbarMain";

const Topbar = () => {
  return <TopbarMain userSignOutHandle={userSignOut} />;
};

export default Topbar;
