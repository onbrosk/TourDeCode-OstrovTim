import { Elysia } from 'elysia'
import { MemberService } from './service'
import { MemberModel } from './model'

export const membersPlugin = new Elysia({ prefix: '/members' })
  .model(MemberModel)

  .get('/', async () => {
    return await MemberService.getAll()
  })

  .get(
    '/:id',
    async ({ params: { id }, status }) => {
      try {
        return await MemberService.getById(id)
      } catch (err: any) {
        return status(404, { message: err.message })
      }
    },
    {
      params: MemberModel.params
    }
  )

  .post(
    '/',
    async ({ body, status }) => {
      try {
        return await MemberService.create(body)
      } catch (err: any) {
        return status(400, { message: err.message })
      }
    },
    {
      body: MemberModel.createBody
    }
  )