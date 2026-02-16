import db from '../../../../lib/db';
import { locations } from '../../../../lib/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;
  const slug = getRouterParam(event, 'slug');

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    });
  }

  const location = await db.select().from(locations).where(eq(locations.slug, slug)).limit(1);

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
});
