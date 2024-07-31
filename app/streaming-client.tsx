"use client"

import { useEffect, useState } from "react";

async function* process(readableStream: ReadableStreamDefaultReader) {
  const decoder = new TextDecoder()
  
  while(true) {
    const { value, done } = await readableStream.read()

    if(done) {
      return
    }

    const user = decoder.decode(value)

    yield JSON.parse(user)
  }
}

export async function* streamingFetch( input: RequestInfo | URL, init?: RequestInit ) {

  const response = await fetch(input, init)  
  const reader  = response.body?.getReader();
  const decoder = new TextDecoder();

  while(true) {
    const { done, value } = await reader!.read()

    if(done) {
      return
    }
  
    const obj = decoder.decode(value)
    yield JSON.parse(obj)
  }
}

// async function getPage() {
//   const response = await fetch("http://localhost:3000/api/page")
//   await new Promise(resolve => setTimeout(resolve, 2000))
//   return await response.json() as Array<{ id: number, name: string }>
// }

export function StreamingClient() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const asyncFetch = async () => {
      const response = await fetch('http://localhost:3000/api/page');
      const reader = response.body!.getReader()

      for await (const obj of process(reader)) {
        setData(items => {
          if(items.find(item => item.id === obj.id)) {
            return items
          }

          return [...items, obj]
        })
      }
    }
    
    asyncFetch()
  }, [])
  // const promise = use(getPage())

  if(data.length === 0) {
    return <p>loading...</p> 
  }

  return (
    <div className="flex flex-col items-start lg:text-left">
      <p>count: {data.length}</p>
      
      {data.map((item) => (

        <a
        key={item.id}
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            {item.name}{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>
      ))}

      {data.length < 10&& (
        <p>loading...</p> 
      )}
    </div>  
  )
}