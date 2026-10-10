import { t } from 'elysia'

export const MemberModel = {
  params: t.Object({
    id: t.Numeric()
  }),

  createBody: t.Object({
    name: t.String({ minLength: 2 }),
    surname: t.String({ minLength: 2 }),
  }),

  memberResponse: t.Object({
    id: t.Number(),
    name: t.String(),
    email: t.String(),
    created_at: t.Date()
  })
}