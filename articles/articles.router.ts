import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';
import { Article } from './articles.model';
import { Category } from "../category/category.model";
import { User } from "../users/users.model";
import { BadRequestError, NotFoundError } from "restify-errors";

class ArticlesRouter extends ModelRouter<Article> {

    constructor() {
        super(Article);
        this.on('beforeRender', document => {
            this.preFormatter(document);
        })
    }

    preFormatter =  (document) => {
        document.user.category = undefined;
        document.user.articles = undefined;
        document.category.articles = undefined;
        document.category.users = undefined;
    };

    findById = (req, resp, next) => {
        this.model
            .findOneAndUpdate({'_id': req.params.id}, {$inc: { views: 1} })
            .populate('category')
            .populate('user')
            .then(article => {

                try {
                    Category.findOneAndUpdate({'_id': article.category.id}, {$inc: { views: 1} });

                    this.preFormatter(article);
                    resp.send(article);

                } catch (e) {
                    throw new NotFoundError(`No article found for: ${req.params.id} ID`);
                }
            })
            .catch(next)
    };

    findByUser = (req, resp, next) => {

        if(req.query.user) {
            Article.
            find({})
                .populate('user')
                .then((articles) => {

                    const articlesByUser = articles.filter((article) =>
                        article.user._id.toString() === req.query.user);

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
                            article.category.toString() === req.query.category
                        );

                        resp.json(articlesFiltered);
                    }).catch(next)
        } else {
            next();
        }
    };

    findAll = (req, resp, next) => {

        let page = parseInt(req.query._page || 1);
        page = page > 0 ? page : 1;

        if(req.query._count)
            this.pageSize = parseInt(req.query._count, 10);

        const skip = (page - 1) * this.pageSize;

        this.model
            .count({})
            .exec()
            .then((count) =>
                this.model
                    .find()
                    .populate('user')
                    .skip(skip)
                    .limit(this.pageSize)
                    .populate('category')
                    .then(this.renderAll(resp, next,
                        {
                            page, count, pageSize: this.pageSize, url: req.url
                        })))
            .catch(next)
    };

    save = (req, resp, next) => {
        const document = new this.model(req.body);

        User
            .findOne({'_id': req.body.user})
            .then((user) => {
                if(user.category.toString() === req.body.category) {
                    document
                        .save()
                        .then((article) => {

                            User
                                .findOne({'_id': req.body.user})
                                .then((user) => {
                                    User
                                        .findOneAndUpdate({'_id': req.body.user}, {$push: { articles: article._id} })
                                        .catch(next);
                                    User
                                        .findOneAndUpdate({'_id': req.body.user}, {$set: { lastPost : new Date(req.body.date) } })
                                        .catch(next);

                                }).catch(next);

                            Category
                                .findOne({'_id': req.body.category})
                                .then(() => {
                                    Category
                                        .findOneAndUpdate({'_id': req.body.category}, {$push: { articles: article._id} })
                                        .catch(next);

                                }).catch(next);

                            resp.send(document);
                        })
                        .catch(next)
                } else {
                    throw new BadRequestError('User category and article category does not match');
                }
            }).catch(next);
    };

    applyRoutes(application: restify.Server){
        application.get('/articles', [this.findByUser, this.findByCategory, this.findAll]);
        application.get('/articles/:id', [this.validateId, this.findById]);
        application.post('/articles', this.save);
    }
}

export const articlesRouter = new ArticlesRouter();
