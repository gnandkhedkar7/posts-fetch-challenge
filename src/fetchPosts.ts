import axios from "axios";
import fs from "fs/promises";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

type post = {
    id: number;
    userId: number;
    title: string;
    body: string;
};

async function fetchWithRetry<T>(url: string, retries = 1): Promise<T> {
    try {

        const data = await axios.get(url, {
            timeout: 10_000,
            validateStatus: (s) => s >=200 && s<=300,
        });

        return data.data;
    } catch (err) {
        if (retries > 0) {
            console.warn(`fetch failed, retrying..... (${retries} left)`);
            return fetchWithRetry<T>(url, retries-1);
        }
        throw err;
    }
};

async function main() {
    console.time("fetch-posts");
    try {
        const data = await fetchWithRetry<post[]>(API_URL, 1);
        await fs.writeFile("posts.json", JSON.stringify(data, null, 2), "utf-8");
        console.log(`Saved ${data.length} posts to posts.json`)
    } catch(err){
        console.error("Error:", err instanceof Error ? err.message : String(err));
        process.exit(1);
    } finally {
        console.timeEnd("fetch-posts");
    }

}

if (require.main === module){
    main();
}