import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { User } from './users.model'
import { Category } from "../category/category.model";
import { numDaysBetween } from "../helpers/helpers";


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

        if(req.query.lastmonth) {
            User.find({})
                .then(users => {
                    const usersFiltered = users.filter((user) => {
                        if(!user.lastPost)
                            return true;
                        else if (numDaysBetween(new Date(user.lastPost), new Date()) > 30) {
                            return true;
                        } else {
                            return false;
                        }
                    });

                    resp.send(usersFiltered);
                })
        } else {
            next();
        }
    };

    findAll = (req, resp, next) => {
        this.model.find()
            .populate('articles')
            .populate('category')
            .then(this.renderAll(resp, next))
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

                        resp.send(document);

                    }).catch(next);
            })
            .catch(next)
    };

    applyRoutes(application: restify.Server){

        application.get('/users', [this.findByLastPost, this.findAll]);
        application.get('/users/:id', [this.validateId, this.findById]);
        application.post('/users', this.save);
        application.put('/users/:id', [this.validateId,this.replace]);
        application.patch('/users/:id', [this.validateId,this.update]);
        application.del('/users/:id', [this.validateId,this.delete]);

    }
}

export const usersRouter = new UsersRouter();
