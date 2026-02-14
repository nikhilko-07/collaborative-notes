// src/sockets/setupSockets.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const setupSockets = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // JOIN NOTE ROOM
    socket.on('join-note', async ({ noteId, userId }) => {
      try {
        const note = await prisma.note.findFirst({
          where: {
            id: noteId,
            OR: [
              { ownerId: userId },
              { collaborators: { some: { userId } } },
            ],
          },
        });

        if (!note) {
          return socket.emit('error', { message: 'Access denied to this note' });
        }

        socket.join(noteId);

        socket.emit('note-loaded', {
          id: note.id,
          title: note.title,
          content: note.content,
          version: note.version,
          lastModified: note.lastModified,
        });

      } catch (err) {
        console.error('join-note error:', err);
        socket.emit('error', { message: 'Error joining note' });
      }
    });

    // REAL-TIME UPDATE
    socket.on('note-update', async ({ noteId, content, title, version, userId }) => {
      try {
        // Permission basic (owner OR collaborator EDITOR)
        const note = await prisma.note.findFirst({
          where: {
            id: noteId,
            OR: [
              { ownerId: userId },
              { collaborators: { some: { userId, role: 'EDITOR' } } },
            ],
          },
          select: { id: true, version: true },
        });

        if (!note) {
          return socket.emit('error', { message: 'No write permission on this note' });
        }


        const updated = await prisma.note.update({
          where: { id: noteId },
          data: {
            content,
            title,
            version: { increment: 1 },
          },
        });

        const payload = {
          noteId,
          content: updated.content,
          title: updated.title,
          version: updated.version,
          lastModified: updated.lastModified,
        };

        io.to(noteId).emit('content-updated', payload);
      } catch (err) {
        console.error('note-update error:', err);
        socket.emit('error', { message: 'Error updating note' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
};
