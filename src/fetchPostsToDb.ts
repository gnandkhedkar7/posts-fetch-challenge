import { PrismaClient } from "@prisma/client";
import { title } from "process";

type RemotePost = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

const prisma = new PrismaClient();

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, {method: "GET"});
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    return res.json() as Promise<T>;
}

async function main() {
    try{
        console.time("fetch-transform-store");

        const posts = await fetchJson<RemotePost[]>(POSTS_URL);

        const uniqueUserIds  = Array.from(new Set(posts.map(p => p.userId)));
        const usersData = uniqueUserIds.map(uid => ({ apiUserId: uid}));

        const userResult = await prisma.user.createMany({
            data: usersData,
            // skipDuplicates: true
        });

        const postsData = posts.map(p => ({
            postId: p.id,
            title: String(p.title),
            body: String(p.body),
            userApiId: p.userId
        }));

        const postsResult = await prisma.post.createMany({
            data: postsData,
            // skipDuplicates
        });

        console.log(`Inserted ${userResult.count} users and ${postsResult.count}`);
        console.timeEnd("fetch-transform-store");
    } catch(err){
        console.error(`Error:`, err instanceof Error ? err.message : String(err));
        process.exit(1);
    } finally{
        await prisma.$disconnect();
    }
}

if(require.main === module) main();