import React, { useState, useEffect } from "react";
import QAList from "./qa-list";
import QAForm from "./add-qa-form";

export default function QAListAndForm() {
  return (
    <div className="ml-8 max-w-xl">
      <h3 className="text-md font-semibold mb-2">Existing pairs</h3>
      <QAList />
      <QAForm />
    </div>
  );
}
