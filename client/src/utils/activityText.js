export const getActivityText = (activity, currentUserId) => {
    const isYou = activity.userId === currentUserId;
    const name = activity.user?.name || activity.user?.email || 'Someone';
    const who = isYou ? 'You' : name;

    switch (activity.action) {
        case 'create':
            return `${who} created a note${activity.note?.title ? `: "${activity.note.title}"` : ''}`;
        case 'update':
            return `${who} updated the note${activity.note?.title ? ` "${activity.note.title}"` : ''}`;
        case 'delete':
            return `${who} deleted a note${activity.note?.title ? `: "${activity.note.title}"` : ''}`;
        case 'share':
            return `${who} shared the note${activity.note?.title ? ` "${activity.note.title}"` : ''}`;
        case 'add_collaborator':
            return `${who} added a collaborator`;
        case 'remove_collaborator':
            return `${who} removed a collaborator`;
        default:
            return `${who} did something`;
    }
};
