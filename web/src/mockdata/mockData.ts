export const mockTours = [
    { id: 1, destination: 'Paris', title: 'Romantic Paris Tour', price: 1500, imageUrl: 'https://placehold.co/600x400/EEE/31343C' },
    { id: 2, destination: 'Tokyo', title: 'Explore Tokyo Adventure', price: 2000, imageUrl: 'https://placehold.co/600x400/EEE/31343C' },
    { id: 3, destination: 'New York', title: 'New York City Highlights', price: 1800, imageUrl: 'https://placehold.co/600x400/EEE/31343C' },
    { id: 4, destination: 'London', title: 'London Historical Tour', price: 1600, imageUrl: 'https://placehold.co/600x400/EEE/31343C' },
    { id: 5, destination: 'Rome', title: 'Ancient Rome Tour', price: 1700, imageUrl: 'https://placehold.co/600x400/EEE/31343C' },
    { id: 6, destination: 'Bali', title: 'Bali Relaxing Tour', price: 1200, imageUrl: 'https://placehold.co/600x400/EEE/31343C' },
];

export const mockBlogs = [
    { id: 1, title: 'Top 10 Places to Visit in Paris', date: '2024-01-15', imageUrl: 'https://placehold.co/400x200/EEE/31343C' },
    { id: 2, title: 'A Guide to Japanese Cuisine in Tokyo', date: '2024-01-20', imageUrl: 'https://placehold.co/400x200/EEE/31343C' },
    { id: 3, title: 'Exploring Central Park in New York', date: '2024-01-25', imageUrl: 'https://placehold.co/400x200/EEE/31343C' },
];

// Animation variants
export const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
};
