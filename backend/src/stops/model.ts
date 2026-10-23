import { t } from "elysia";

export const StopModel = {
  params: t.Object({ id: t.Numeric({ minimum: 1, multipleOf: 1 }) }),
  stopInput: t.Object(
    {
      name: t.String({ minLength: 1, maxLength: 255 }),
      image_url: t.Optional(
        t.Nullable(t.String({ format: "uri-reference", maxLength: 255 })),
      ),
      wheelchair_accessible: t.Boolean(),
      has_shelter: t.Boolean(),
      has_ticket_machine: t.Boolean(),
    },
    { additionalProperties: false },
  ),
  stopResponse: t.Object(
    {
      id: t.Integer({ minimum: 1 }),
      name: t.String({ minLength: 1, maxLength: 255 }),
      image_url: t.Nullable(t.String({ format: "uri-reference", maxLength: 255 })),
      wheelchair_accessible: t.Boolean(),
      has_shelter: t.Boolean(),
      has_ticket_machine: t.Boolean(),
    },
    { additionalProperties: false },
  ),
  error: t.Object(
    { error: t.String() },
    { additionalProperties: false },
  ),
};