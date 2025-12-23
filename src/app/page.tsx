"use client";

import { useSession } from "@/lib/auth/client";
import { FormEvent, useState } from "react";

export default function Page() {
  const session = useSession();
  const [syllabuses, setSyllabuses] = useState<FileList | null>();

  if (session.isPending) {
    return <div className="">Loading...</div>;
  }

  if (session.error) {
    return <div className="text-red-500">{session.error.message}</div>;
  }

  console.log(session.data)

  return (
    <form className="mb-3 w-96" onSubmit={handleSubmittedFiles}>
      <label
        htmlFor="syllabusFiles"
        className="mb-2 inline-block text-neutral-700 dark:text-neutral-200"
      >
        Choose your syllabus files
      </label>
      <input
        type="file"
        id="syllabusFiles"
        accept=".pdf,.doc,.docx"
        onChange={(ev) => setSyllabuses(ev.target.files)}
        multiple={true}
        className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:me-3 hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
      />

      <button type="submit" className="">
        Submit files
      </button>
    </form>
  );

  async function handleSubmittedFiles() {
    console.log("file: ", syllabuses);
    setSyllabuses(null);
  }
}
