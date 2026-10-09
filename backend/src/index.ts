import { Elysia } from 'elysia';
import { membersPlugin } from './members/index';
import { healthPlugin } from './health/index';
import { initDb } from './db';

async function startServer() {
  await initDb()

  new Elysia({ prefix: '/api' })
    .use(membersPlugin)
    .use(healthPlugin)
    .listen(3001, () => {
      console.log('Server is running on http://localhost:3001')
    })
}

startServer().catch((error: unknown) => {
  console.error('[Server Startup Error]:', error)
  process.exitCode = 1
})