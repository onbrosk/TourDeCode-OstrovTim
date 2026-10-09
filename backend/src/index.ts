import { Elysia } from 'elysia';
import { membersPlugin } from './members/index';
import { healthPlugin } from './health/index';
import { teamsPlugin } from './teams/index';
import { initDb } from './db';

await initDb();
const app = new Elysia({ prefix: '/api' })
  .use(membersPlugin)
  .use(teamsPlugin)
  .use(healthPlugin)
  .listen(3001, () => {
    console.log('Server is running on http://localhost:3001')
  })