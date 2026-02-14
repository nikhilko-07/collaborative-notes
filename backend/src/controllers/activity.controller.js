import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUserActivityFeed = async (req, res) => {
    try {
        const userId = req.user.id;

        const notes = await prisma.note.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { collaborators: { some: { userId } } },
                ],
            },
            select: { id: true },
        });

        const noteIds = notes.map((n) => n.id);
        if (noteIds.length === 0) return res.json([]);

        const activity = await prisma.activity.findMany({
            where: {
                OR: [
                    { noteId: { in: noteIds } },
                    {
                        noteId: null,
                        userId: userId,
                    },
                ],
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                note: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        res.json(activity);
    } catch (err) {
        console.error('activity feed error:', err);
        res.status(400).json({ error: err.message });
    }
};