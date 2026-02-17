import { desc, eq } from "drizzle-orm";

import db from "../../../lib/db";
import { locations } from "../../../lib/db/schema";

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const userId = event.context.user?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  if (method === 'GET') {
    const allLocations = await db.select().from(locations).where(eq(locations.userId, userId)).orderBy(desc(locations.createdAt));
    return allLocations;
  }

  if (method === 'POST') {
    const body = await readBody(event);
    const { name, description, latitude, longitude, slug } = body;

    if (!name || !slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and slug are required',
      });
    }

    const newLocation = await db
      .insert(locations)
      .values({
        name,
        description,
        latitude,
        longitude,
        slug,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newLocation[0];
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  });
})
