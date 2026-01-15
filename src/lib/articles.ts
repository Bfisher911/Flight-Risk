import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDirectory = path.join(process.cwd(), 'src/data/articles');

export type Article = {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
    image?: string;
    tags: string[];
    content: string;
};

export function getAllArticles(): Article[] {
    // Create directory if it doesn't exist to prevent build errors
    if (!fs.existsSync(articlesDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(articlesDirectory);
    const allArticlesData = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            content,
            title: data.title,
            excerpt: data.excerpt,
            date: data.date,
            author: data.author,
            category: data.category,
            image: data.image,
            tags: data.tags || [],
        };
    });

    // Sort articles by date
    return allArticlesData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getArticleBySlug(slug: string): Article | null {
    try {
        const fullPath = path.join(articlesDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            content,
            title: data.title,
            excerpt: data.excerpt,
            date: data.date,
            author: data.author,
            category: data.category,
            image: data.image,
            tags: data.tags || [],
        };
    } catch (e) {
        return null;
    }
}
