import * as restify from 'restify'
import {EventEmitter} from 'events'
import {NotFoundError} from 'restify-errors'
import * as js2xmlparser from "js2xmlparser";

export abstract class Router extends EventEmitter {
    abstract applyRoutes(application: restify.Server)

    render(response: restify.Response, next: restify.Next, callback?){
        return (document)=>{
            if(document){
                this.emit('beforeRender', document);

                if(callback)
                  callback(document);

                response.json(document)
            }else{
                console.log(document);
                throw new NotFoundError('Documento não encontrado')
            }
            return next()
        }
    }

    renderAll(response: restify.Response, next: restify.Next){
        return (documents: any[])=>{
            if(documents){
                documents.forEach(document=>{
                    this.emit('beforeRender', document)
                });
                response.json(documents)
            }else{
                response.json([])
            }
        }
    }

    renderAllXml(response: restify.Response, next: restify.Next){
        return (documents: any[])=>{
            if(documents){
                documents.forEach(document=>{
                    this.emit('beforeRender', document)
                });

                response.setHeader("Content-Type", "application/xml");
                response.send(js2xmlparser.parse("root", JSON.parse(JSON.stringify(documents))));
            } else {
                response.send(js2xmlparser.parse("root", JSON.parse(JSON.stringify([]))));
            }
        }
    }

    renderForCallback(document, response: restify.Response, next: restify.Next){
        return (document) => {
            if(document){
                this.emit('beforeRender', document);
                response.json(document)
            }else{
                console.log(document);
                throw new NotFoundError('Documento não encontrado')
            }
            return next()
        }
    }

}
