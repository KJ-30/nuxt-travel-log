import db from '../../../lib/db';
import { locations } from '../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const userId = event.context.user?.id;
  const id = getRouterParam(event, 'id');

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Location ID is required',
    });
  }

  if (method === 'GET') {
    const location = await db
      .select()
      .from(locations)
      .where(eq(locations.id, parseInt(id)))
      .limit(1);

    if (!location[0]) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Location not found',
      });
    }

    if (location[0].userId !== userId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
      });
    }

    return location[0];
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    const { name, description, latitude, longitude, slug } = body;

    const updatedLocation = await db
      .update(locations)
      .set({
        name,
        description,
        latitude,
        longitude,
        slug,
        updatedAt: new Date(),
      })
      .where(eq(locations.id, parseInt(id)))
      .returning();

    if (!updatedLocation[0]) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Location not found',
      });
    }

    return updatedLocation[0];
  }

  if (method === 'DELETE') {
    const deletedLocation = await db
      .delete(locations)
      .where(eq(locations.id, parseInt(id)))
      .returning();

    if (!deletedLocation[0]) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Location not found',
      });
    }

    return { success: true };
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  });
});
