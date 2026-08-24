import 'reflect-metadata'
import type { IncomingMessage, ServerResponse } from 'http'
import express from 'express'
import serverlessExpress from '@vendia/serverless-express'
import { ExpressAdapter } from '@nestjs/platform-express'
import { createNestApp } from '../src/app.factory'

type ServerlessHandler = (req: IncomingMessage, res: ServerResponse) => void

let cachedHandler: ServerlessHandler | undefined

async function bootstrapServerless(): Promise<ServerlessHandler> {
  const expressApp = express()
  const app = await createNestApp(new ExpressAdapter(expressApp))
  await app.init()
  return serverlessExpress({ app: expressApp })
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!cachedHandler) {
    cachedHandler = await bootstrapServerless()
  }
  return cachedHandler(req, res)
}
