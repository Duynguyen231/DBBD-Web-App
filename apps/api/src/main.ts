import { createNestApp } from './app.factory'

async function bootstrap() {
  const app = await createNestApp()

  const port = process.env.PORT || 4000
  await app.listen(port)
  console.log(`API running on http://localhost:${port}`)
  console.log(`Swagger docs: http://localhost:${port}/api/docs`)
}

bootstrap()

