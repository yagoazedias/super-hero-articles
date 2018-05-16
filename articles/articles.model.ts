import * as mongoose from 'mongoose';

export interface Article extends mongoose.Document {
    title: string,
    description: string,
}

export const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});


export const Article = mongoose.model<Article>('article', articleSchema);
