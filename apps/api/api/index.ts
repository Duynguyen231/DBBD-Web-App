import 'reflect-metadata'
import type { IncomingMessage, ServerResponse } from 'http'
import express, { type Express } from 'express'
import { ExpressAdapter } from '@nestjs/platform-express'
import { createNestApp } from '../src/app.factory'

let cachedApp: Express | undefined

async function bootstrap(): Promise<Express> {
  const expressApp = express()
  const app = await createNestApp(new ExpressAdapter(expressApp))
  await app.init()
  return expressApp
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!cachedApp) {
    cachedApp = await bootstrap()
  }
  cachedApp(req, res)
}
