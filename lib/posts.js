import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';


const postDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData(){
    const fileNames = fs.readdirSync(postDirectory);
    const allPostData = fileNames.map((filename) => {
        const id = filename.replace(/\.md$/, '');

        const fullPath = path.join(postDirectory, filename);

        const fileContents = fs.readFileSync(fullPath);

        const matterResult = matter(fileContents);

        return {
            id,
            ...matterResult.data
        };
    });
    
    return allPostData.sort((a, b) => {
        if(a.date < b.date){
            return 1;
        }
        return -1;
    })
}

export function getAllPostIds(){
    const fileNames = fs.readdirSync(postDirectory);

    return fileNames.map((fileName) => {
        return {
            params:{
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
}

export async function getPostData(id){
    const filePath = path.join(postDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(filePath);

    const matterResult = matter(fileContents);

    var processedContent = await remark().use(html).process(matterResult.content);

    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        ...matterResult.data
    };
}