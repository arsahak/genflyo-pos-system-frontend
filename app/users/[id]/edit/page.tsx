"use client";

import UserEdit from "@/component/userManagement/UserEdit";
import { use } from "react";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <UserEdit userId={id} />;
}
