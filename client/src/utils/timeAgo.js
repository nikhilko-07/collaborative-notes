export const timeAgo = (dateString) => {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    if (sec < 60) return 'just now';
    if (min < 60) return `${min} min${min > 1 ? 's' : ''} ago`;
    if (hr < 24) return `${hr} hour${hr > 1 ? 's' : ''} ago`;
    return `${day} day${day > 1 ? 's' : ''} ago`;
};
