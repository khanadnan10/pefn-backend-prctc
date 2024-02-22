import vine from "@vinejs/vine";

export const newsSchema = vine.object({
  title: vine.string().minLength(10),
  content: vine.string().minLength(10).maxLength(1000),
  image: vine.string().optional(),
});
