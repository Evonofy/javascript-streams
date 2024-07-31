import { Suspense } from "react";
import { StreamingClient } from "./streaming-client";

export default async function Home() {
  const response = await fetch("http://localhost:3000/api/preview", {
    next: {
      revalidate: 10
    }
  })
  const data = await response.json() as {
    page: {
      title: string
      description: string
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-start p-24">
      <div className="z-10 w-full max-w-5xl items-center gap-2 font-mono text-sm lg:flex">
        <h1 className="text-2xl font-white font-bold">
        {data.page.title}
        </h1>
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {data.page.description}
        </p>
      </div>

      <Suspense fallback={<p>loading...</p>}>
        <StreamingClient />
      </Suspense>
    </main>
  );
}
