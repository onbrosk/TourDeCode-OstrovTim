import { Elysia } from 'elysia';
import { membersPlugin } from './members/index';
import { healthPlugin } from './health/index';

const app = new Elysia({ prefix: '/api' })
  .use(membersPlugin)
  .use(healthPlugin)
  .listen(3001, () => {
    console.log('Server is running on http://localhost:3001')
  })