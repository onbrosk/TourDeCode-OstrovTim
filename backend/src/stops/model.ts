import { t } from "elysia";

export const StopModel = {
  params: t.Object({ id: t.Numeric() }),
  stopInput: t.Object({
    name: t.String({ minLength: 1 }),
    image_url: t.Optional(t.Nullable(t.String())),
    wheelchair_accessible: t.Boolean(),
    has_shelter: t.Boolean(),
    has_ticket_machine: t.Boolean(),
  }),
  stopResponse: t.Object({
    id: t.Number(),
    name: t.String(),
    image_url: t.Nullable(t.String()),
    wheelchair_accessible: t.Boolean(),
    has_shelter: t.Boolean(),
    has_ticket_machine: t.Boolean(),
  }),
};
