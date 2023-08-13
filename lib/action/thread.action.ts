import { connectToDB } from "../mongoose";

interface Params {
    text: string,
    author: string,
    comunityId: string | null,
    path: string,
}

export async function createThread({ text, author, comunityId, path }: Params) {
    connectToDB();

    const createThread = await Thread
};