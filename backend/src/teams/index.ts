import { Elysia } from 'elysia'
import { Teamservice } from './service'
import { TeamModel } from './model'

export const teamsPlugin = new Elysia({ prefix: '/teams' })
  .model(TeamModel)

  .get('/', async () => {
    return await Teamservice.getAll()
  })

  .get(
    '/:id',
    async ({ params: { id }, status }) => {
      try {
        return await Teamservice.getById(id)
      } catch (err: any) {
        return status(404, { message: err.message })
      }
    },
    {
      params: TeamModel.params
    }
  )

  .post(
    '/',
    async ({ body, status }) => {
      try {
        return await Teamservice.create(body)
      } catch (err: any) {
        return status(400, { message: err.message })
      }
    },
    {
      body: TeamModel.createBody
    }
  )