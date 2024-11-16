var express = require("express")
var { createHandler } = require("graphql-http/lib/use/express")
var { buildSchema } = require("graphql")
var { ruruHTML } = require("ruru/server")


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello(name :String!): String
    age: Int
    weight :Float
    isConfirmed:Boolean
    _id :ID
    hobbies :[String!]!
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
    hello( args) {
        return "Hello " +args.name
    },
    age() {
        return 123
    },
    weight : 77.5,
    isConfirmed : true,
    _id : 1232,
    hobbies :["Abdo" , "null" , "kemo" ,"Emaam"]
}

var app = express()


// Create and use the GraphQL handler.
app.all(
    "/graphql",
    createHandler({
        schema: schema,
        rootValue: root,
    })
)
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