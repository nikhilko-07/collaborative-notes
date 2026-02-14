import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const createNote = async (req, res) => {
  try {
    const { title, content = '' } = req.body;
    const note = await prisma.note.create({
      data: { title, content, ownerId: req.user.id }
    });

    await prisma.activity.create({
      data: { action: 'create', userId: req.user.id, noteId: note.id }
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        OR: [
          { ownerId: req.user.id },
          { collaborators: { some: { userId: req.user.id } } }
        ]
      },
      include: { owner: { select: { id: true, email: true, name: true } } },
      orderBy: { lastModified: 'desc' }
    });
    res.json(notes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await prisma.note.findFirst({
      where: {
        OR: [
          { id, ownerId: req.user.id },
          { id, collaborators: { some: { userId: req.user.id } } }
        ]
      },
      include: { 
        owner: { select: { id: true, email: true, name: true } },
        collaborators: {
          include: { user: { select: { id: true, name: true, email: true } } }
        }
      }
    });

    if (!note) return res.status(404).json({ error: 'Access denied' });
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, version } = req.body;

    const note = await prisma.note.findFirst({
      where: {
        id,
        OR: [
          { ownerId: req.user.id },
          { collaborators: { some: { userId: req.user.id, role: 'EDITOR' } } }
        ]
      }
    });

    if (!note) return res.status(403).json({ error: 'Access denied' });
    if (note.version !== version) {
      return res.status(409).json({ 
        error: 'Conflict!', 
        currentVersion: note.version 
      });
    }

    const updated = await prisma.note.update({
      where: { id },
      data: { title: title || note.title, content: content || note.content, version: { increment: 1 } }
    });

    await prisma.activity.create({
      data: { action: 'update', userId: req.user.id, noteId: id }
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await prisma.note.findFirst({
      where: { id, ownerId: req.user.id },
    });

    if (!note) {
      return res.status(404).json({ error: 'Not found or not owner' });
    }

    await prisma.activity.create({
      data: {
        action: 'delete',
        userId: req.user.id,
        noteId: id,
        details: { title: note.title },
      },
    });

    await prisma.note.delete({ where: { id } });

    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(400).json({ error: error.message });
  }
};


export const searchNotes = async (req, res) => {
  const { q } = req.query;
  const notes = await prisma.note.findMany({
    where: {
      AND: [
        {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } }
          ]
        },
        {
          OR: [
            { ownerId: req.user.id },
            { collaborators: { some: { userId: req.user.id } } }
          ]
        }
      ]
    },
    include: { owner: true }
  });
  res.json(notes);
};

export const generatePublicLink = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.note.findFirst({
      where: {
        id,
        ownerId: req.user.id,
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const shareId = existing.publicShareId || crypto.randomUUID();

    const note = await prisma.note.update({
      where: { id },
      data: { publicShareId: shareId },
    });

    await prisma.activity.create({
      data: {
        action: 'share',
        userId: req.user.id,
        noteId: id,
        details: {
          publicShareId: shareId,
        },
      },
    });

    res.json({
      noteId: note.id,
      publicShareId: shareId,
      publicUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/public/${shareId}`,
    });
  } catch (error) {
    console.error('generatePublicLink error:', error);
    res.status(400).json({ error: 'Failed to generate public link' });
  }
};

export const getPublicNote = async (req, res) => {
  const { shareId } = req.params;

  try {
    const note = await prisma.note.findUnique({
      where: { publicShareId: shareId },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    if (!note) {
      return res.status(404).json({ error: 'This note is not available.' });
    }

    res.json(note);
  } catch (err) {
    console.error('getPublicNote error:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
// COLLABORATORS 👇
export const addCollaborator = async (req, res) => {
  const { id: noteId } = req.params;
  const { userId, role = 'VIEWER' } = req.body;

  const note = await prisma.note.findFirst({
    where: { id: noteId, ownerId: req.user.id }
  });
  if (!note) return res.status(403).json({ error: 'Owner only' });

  const collaborator = await prisma.collaborator.create({
    data: { noteId, userId, role },
    include: { user: true }
  });

  await prisma.activity.create({
    data: { action: 'add_collaborator', userId: req.user.id, noteId }
  });

  res.status(201).json(collaborator);
};

export const getCollaborators = async (req, res) => {
  const { id } = req.params;
  const collaborators = await prisma.collaborator.findMany({
    where: { noteId: id },
    include: { user: true }
  });
  res.json(collaborators);
};

export const removeCollaborator = async (req, res) => {
  const { id: noteId, userId: collabUserId } = req.params;

  await prisma.collaborator.delete({
    where: { noteId_userId: { noteId, userId: collabUserId } }
  });

  await prisma.activity.create({
    data: { action: 'remove_collaborator', userId: req.user.id, noteId }
  });

  res.json({ message: 'Removed' });
};
