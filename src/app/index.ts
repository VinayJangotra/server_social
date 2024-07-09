import express from  'express'
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from 'body-parser';

 export async function initServer(){
    const app=express();
    app.use(bodyParser.json());
    const graphqlServer = new ApolloServer({
        typeDefs:`
        type Query{
            hello:String
    }`
    ,
        resolvers:{
            Query:{
                hello:()=>"Hello World"
            },

        },
        },
     
    );
    await graphqlServer.start();
    app.use(expressMiddleware(graphqlServer));
    return app;
}