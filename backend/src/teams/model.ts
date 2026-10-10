import { t } from 'elysia'

export const TeamModel = {
  params: t.Object({
    id: t.Numeric()
  }),

  createBody: t.Object({
    name: t.String({ minLength: 2 })
  }),

  teamResponse: t.Object({
    id: t.Number(),
    name: t.String(),
    created_at: t.Date()
  })
}
