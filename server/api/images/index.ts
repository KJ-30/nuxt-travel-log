import db from '../../../lib/db';
import { images } from '../../../lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

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
    const logId = getQuery(event).logId;

    if (!logId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Log ID is required',
      });
    }

    const allImages = await db
      .select()
      .from(images)
      .where(and(eq(images.logId, parseInt(logId as string)), eq(images.userId, userId)));
    return allImages;
  }

  if (method === 'POST') {
    const formData = await readFormData(event);
    const file = formData.get('file') as File;
    const logId = formData.get('logId') as string;

    if (!file || !logId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File and log ID are required',
      });
    }

    if (!file.type.startsWith('image/')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File must be an image',
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${randomUUID()}-${file.name}`;
    const url = `/uploads/${fileName}`;

    const fs = await import('fs/promises');
    const path = await import('path');

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {}

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const newImage = await db
      .insert(images)
      .values({
        logId: parseInt(logId),
        url,
        userId,
        createdAt: new Date(),
      })
      .returning();

    return newImage[0];
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  });
});
