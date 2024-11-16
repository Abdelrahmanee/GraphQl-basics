import express from "express"
// var createHandler  = require("graphql-http/lib/use/express")
import { ruruHTML } from "ruru/server"



import { createSchema, createYoga } from 'graphql-yoga'
import { schema } from "./src/graphql/index.js"

const yoga = createYoga({
  schema
})

const app = express()

// Create and use the GraphQL handler.
app.all("/graphql", yoga )
// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
    res.type("html")
    res.end(ruruHTML({ endpoint: "/graphql" }))
})

// Start the server at port
app.listen(4000)
console.log(`
Api Running a GraphQL API server at http://localhost:4000/graphql
Test: http://localhost:4000/graphql?query={hello,age}
`)



// Construct a schema, using GraphQL schema language
// var schema = buildSchema(`
//   type Query {
//     hello(name :String!): String
//     age: Int
//     weight :Float
//     isConfirmed:Boolean
//     _id :ID
//     hobbies :[String!]!
//     user :User
//     friends :[User]
//   }
//     type User{
//     id: Int
//     name :String
//     }
// `)

// const userType = new GraphQLObjectType({
//     name :"userType",
//     fields :{
//         name : {
//             type : GraphQLString,
//             resolve :(obj)=>{
//                 return obj.name.trim()
//             }
//         },
//         _id : {type : GraphQLID}
//     }
// })
// const schema = new GraphQLSchema({
//     query :new GraphQLObjectType({
//         name :"Query",
//         fields :{
//             hello :{
//                 type :GraphQLString,
//                 resolve : ()=>{
//                     return "Hello yani ya amma"
//                 }
//             },

//             getUser  :{
//                 type : userType,
//                 resolve :()=>{
//                     return {name : "    Abdo      " , _id:123}
//                 }
//             }
//         }
//     })
// })
// // The root provides a resolver function for each API endpoint
// // var root = {
// //     hello( args) {
// //         return "Hello " +args.name
// //     },
// //     age() {
// //         return 123
// //     },
// //     weight : 77.5,
// //     isConfirmed : true,
// //     _id : 1232,
// //     hobbies :["Abdo" , "null" , "kemo" ,"Emaam"],
// //     user : ()=>{
// //         return {id :1223  , name :"abdoo"}
// //     },
// //     friends : ()=>{
// //         return [
// //             {id :12  , name :"abdoo"},
// //             {id :1223  , name :"keom"},
// //             {id :54  , name :"messi"}
// //         ]
// //     }
// // }
