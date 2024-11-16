

export const typeDef = /* GraphQL */ `
   type Query {
    hello:String
    user:User
   }
    type User {
        name:String
        id: Int
        age: Int
    }
    type Mutation{
        createUser(user:newUserInput!):User
    }
    input newUserInput{
        name:String!
        age: Int!
    }
`


export const resolvers = {
    Query: {
        user: () => { return { name: "Asml ", id: 23 ,age :15 } }
    },
    Mutation: {
        createUser: async (obj , {user} , {mongo}) => {
            const movies= await mongo.movies.find().toArray()
            console.log(movies);
            
            return {...user , id:12345}
        }
    },
    User: {
        name: (obj) => {
            return obj.name.toUpperCase();
        }
    }
}