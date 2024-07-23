import http from "node:http"
import streams from "node:stream/web"

import Chance from "chance"

const chance = Chance()

const repository = {
  getUsers: function* () {
    // simulates mongodb cursor
    for (let i = 0; i < 10; i++) {
      yield {
        name: chance.name(),
        email: chance.email(),
        age: chance.age(),
      }
    }
  }
}

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
}

const analytics = {
  track() {
    console.log("processing data after request has ended...")
  }
}

const server = http.createServer(async (request, response) => {
  console.log("requisição recebida")
  // enables any client to call server
  cors(response)

  if(request.method === "GET" && request.url === '/products') {
    response.writeHead(200)

    const writableStream = new streams.WritableStream({
      write(chunk) {
        response.write(JSON.stringify(chunk))
      }
    })

    const writer = writableStream.getWriter()

    for await (const user of repository.getUsers()) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 300))
      writer.write(user)
    }

    await writer.close()

    response.end()
  } else {
    response.writeHead(404, { 'Content-Type': "application/json" })
    response.end(JSON.stringify({
      error: "Chame a rota GET /products"
    }))
  }

  console.log("requisição finalizada")

  analytics.track()
  return
})

server.listen(3333, () => console.log("server listening at http://localhost:3333"))