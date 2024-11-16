

export const typeDef = /* GraphQL */ `
   
    type User {
        id: Int
        name:String
    }
`


export const resolvers = {
    Query: {
        user: () => { return { name: "Asml ", id: 23 } }
    },
    User: {
        name: (obj) => {
            return obj.name.toUpperCase();
        }
    }
}