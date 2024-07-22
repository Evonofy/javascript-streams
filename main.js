import http from "node:http"
import cors from "cors"
import { Writable, Readable, Transform } from "node:stream"

class ReadableStream extends Readable {
  index = 1

  _read() {
    for (let i = 0; i < 100; i++) {
      const buf = Buffer.from(String(i))
      this.read(buf)
    }
  }
}


class WritableStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(Number(chunk.toString()) * 10)
    callback()
  }
}

class TransformByMultiply extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * 10
    console.log(transformed)

    callback(null, Buffer.from(String(transformed)))
  }
}

async function* generateData() {
  for (let i = 0; i < 1000; i++) {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Yield data chunk
    yield `data chunk ${i}\n`;
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  res.setHeader('Access-Control-Allow-Headers', 'content-type'); // Might be helpful
  console.log("Requisição Recebida")

  res.writeHead(200, { "Content-Type": "text/plain" })
  for await (const chunk of generateData()) {
    res.write(chunk);
    console.log(`Sent: ${chunk}`);
  }

  res.end()


  // return new ReadableStream().pipe(res)
  // const readable = new ReadableStream()
  // const writable = new WritableStream()
  // const transform = new TransformByMultiply()

  // transform.on("data", data => {
  //   res.write(data)
  // })

  // readable.pipe(transform)

  // return res.end()
  // return res.write(transform)
  // return readable.pipe(transform).pipe(res)
})

server.listen(5501, () => {
  console.log("Server listening")
})
