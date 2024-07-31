export async function GET() {
  const page = {
    title: "hello world",
    description: "my name is dadada",
  }
  
  return Response.json({
    page
  }, {
    headers: {
      "Content-Type": 'application/json'
    }
  })
}