import slugify from 'slugify';
import Post from '../models/post_models.ts'; // Import your model


const generateUniqueSlug = async (title: string): Promise<string> => {
    // 1. Generate the base slug
    const baseSlug = slugify(title, {
        lower: true,
        strict: true,
        trim: true,
        replacement: '-',
    });

    let uniqueSlug = baseSlug;
    let counter = 0;

    // 2. Loop until a unique slug is found
    while (true) {
        // Find a post with the current slug
        const existingPost = await Post.findOne({ slug: uniqueSlug });

        if (!existingPost) {
            // Found a unique slug! Exit the loop.
            return uniqueSlug;
        }

        // If a post exists, increment the counter and try a new slug
        counter++;
        uniqueSlug = `${baseSlug}-${counter}`;
    }
};

export default generateUniqueSlug;