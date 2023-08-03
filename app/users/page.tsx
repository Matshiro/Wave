import React from "react";
import EmptyState from "../components/EmptyState";

function page() {
  return (
    <div className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </div>
  );
}

export default page;
