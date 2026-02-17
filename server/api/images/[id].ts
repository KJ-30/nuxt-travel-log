import { eq } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';

import db from '../../../lib/db';
import { images } from '../../../lib/db/schema';

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const userId = event.context.user?.id
  const id = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    })
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Image ID is required",
    })
  }

  if (method === "DELETE") {
    const image = await db
      .select()
      .from(images)
      .where(eq(images.id, Number.parseInt(id)))
      .limit(1)

    if (!image[0]) {
      throw createError({
        statusCode: 404,
        statusMessage: "Image not found",
      })
    }

    if (image[0].userId !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      })
    }

    try {
      const filePath = path.join(process.cwd(), "public", image[0].url)
      await fs.unlink(filePath)
    }
    catch (error) {}

    await db.delete(images).where(eq(images.id, Number.parseInt(id)))

    return { success: true }
  }

  throw createError({
    statusCode: 405,
    statusMessage: "Method not allowed",
  })
});
