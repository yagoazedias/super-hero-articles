import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';
import { User } from './users.model';
import { Category } from "../category/category.model";
import { isLastMonth } from "../helpers/helpers";


class UsersRouter extends ModelRouter<User> {

    constructor(){
        super(User);
        this.on('beforeRender', document => {
            this.preFormatter(document);
        })
    }

    preFormatter =  (document) => {
        document.category.users = undefined;
        document.category.articles = undefined;
        document.articles.forEach((actual) => {
            actual.category = undefined;
        })
    };

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .populate('articles')
            .populate('category')
            .then(this.render(resp, next))
            .catch(next)
    };

    findByLastPost = (req, resp, next) => {
            User.find({})
                .populate('articles')
                .then(users => {
                    const usersFiltered = users.filter((user) => {
                        if(!user.lastPost)
                            return true;
                        else return !isLastMonth(new Date(user.lastPost), new Date());
                    });

                    resp.send(usersFiltered);
                    next();
                })
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
                    .populate('articles')
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

        document
            .save()
            .then((user) => {
                Category
                    .findOne({'_id': req.body.category})
                    .then(() => {
                        Category
                            .findOneAndUpdate({'_id': req.body.category}, {$push: { users: user._id} })
                            .catch(next);

                        resp(document);

                    }).catch(next);
            })
            .catch(next)
    };

    applyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/irregular`, this.findByLastPost);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
    }
}

export const usersRouter = new UsersRouter();
