// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
 
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}
 
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
 
const encoder = new TextEncoder()
 
async function* makeIterator() {
  for(let i = 0; i < 100; i++) {
    await sleep(Math.random() * 1000)
    yield encoder.encode(JSON.stringify({
      id: i,
      name: `test ${i}`
    }))
  }
}
 
export async function GET() {
  const iterator = makeIterator()
  const stream = iteratorToStream(iterator)
 
  return new Response(stream)
}
// export async function GET() {
//   const products = [
//     { id: 1, name: "product 1" }
//   ]
  
//   return Response.json({
//     products
//   })
// }