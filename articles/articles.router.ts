import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import { NotFoundError } from 'restify-errors'
import {Article} from './articles.model'
const {ObjectId} = require('mongodb');

class ArticlesRouter extends ModelRouter<Article> {
    constructor(){
        super(Article)
    }

    // Callback na função de render, servirá para atualizar as views do category
    print = (document) =>
        console.log(document);

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .populate('category')
            .populate('user')
            .then(this.render(resp, next, this.print))
            .catch(next)
    };

    findByUser = (req, resp, next) => {

        if(req.query.user) {
            Article.
            find({})
                .populate('user')
                .then((articles) => {

                    const articlesByUser = articles.filter((article) =>
                        article.user._id.toString() === req.query.user
                    );

                    resp.json(articlesByUser);

                }).catch(next)
        } else {
            next();
        }
    };

    findByCategory = (req, resp, next) => {

        if(req.query.category) {
            Article.
            find({})
                .then((articles) => {
                    const articlesFiltered = articles.filter((article) =>
                        article.category.toString().includes(req.query.category)
                    );

                    resp.json(articlesFiltered);
                }).catch(next)
        } else {
            next();
        }
    };

    findAll = (req, resp, next) => {
        this.model.find()
            .populate('category')
            .populate('user')
            .then(this.renderAll(resp,next))
            .catch(next)
    };

    applyRoutes(application: restify.Server){
        application.get('/articles', [this.findByUser, this.findByCategory, this.findAll]);
        application.get('/articles/:id', [this.validateId, this.findById]);
        application.post('/articles', this.save);
        application.put('/articles/:id', [this.validateId,this.replace]);
        application.patch('/articles/:id', [this.validateId,this.update]);
        application.del('/articles/:id', [this.validateId,this.delete]);
    }

}

export const articlesRouter = new ArticlesRouter();
