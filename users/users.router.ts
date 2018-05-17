import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { User } from './users.model'
import { Category } from "../category/category.model";


class UsersRouter extends ModelRouter<User> {

    constructor(){
        super(User)
        // this.on('beforeRender', document=>{
        //   document.password = undefined
        // })
    }

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

        application.get('/users', this.findAll);
        application.get('/users/:id', [this.validateId, this.findById]);
        application.post('/users', this.save);
        application.put('/users/:id', [this.validateId,this.replace]);
        application.patch('/users/:id', [this.validateId,this.update]);
        application.del('/users/:id', [this.validateId,this.delete]);

    }
}

export const usersRouter = new UsersRouter();
