import {Router} from './router'
import * as mongoose from 'mongoose'
import {NotFoundError} from 'restify-errors'


export abstract class ModelRouter<D extends mongoose.Document> extends Router {

    basePath: string;
    pageSize: number = 1;

    constructor(protected model: mongoose.Model<D>){
        super();
        this.basePath = `/${model.collection.name}`;
    }

    envelope(document: any): any {
        let resource = Object.assign({_links:{}}, document.toJSON());
        resource._links.self = `${this.basePath}/${resource._id}`;
        return resource;
    }

    envelopeAll(documents: any[], options): any {
        let resource: any = {
            _links: {
                self: `${options.url}`
            },
            items: documents
        };

        if(options.page && options.count && options.pageSize) {
            if(options.page > 1) {
                resource._links.previues = `${this.basePath}?_page=${options.page - 1}`
            }

            const remaining = options.count - (options.page * options.pageSize);

            if(remaining > 0) {
                resource._links.next = `${this.basePath}?_page=${options.page + 1}`;
            }
        }

        return resource;
    }

    validateId = (req, resp, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            next(new NotFoundError('Document not found'))
        }else{
            next()
        }
    };

    findAll = (req, resp, next) => {
        this.model.find()
            .limit(this.pageSize)
            .then(this.renderAll(resp,next))
            .catch(next)
    };

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .then(this.render(resp, next))
            .catch(next)
    };

    save = (req, resp, next) => {
        let document = new this.model(req.body);
        document.save()
            .then(this.render(resp, next))
            .catch(next)
    };
}
