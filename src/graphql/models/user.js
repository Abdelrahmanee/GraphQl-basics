

import { ObjectId } from "mongodb";
export const typeDef = /* GraphQL */ `
   type Query {
      hello: String
      users: [User!]!
      user(id: ID!): User
   }

   type User {
      name: String!
      email: String!
      id: ID!
      comments:[Comment]
   }

   type Mutation {
      createUser(user: newUserInput!): User
      deleteUser(id: ID!): Boolean
      updateUser(id: ID!, update: updateUserInput!): User
   }

   input newUserInput {
      name: String!
      email: String!
   }

   input updateUserInput {
      name: String!
   }
`;



export const resolvers = {
    Query: {
        users: async (parent, args, { mongo }) => {
            try {
                const users = await mongo.users.find().limit(20).toArray();
                return users;
            } catch (err) {
                console.error(err);
                throw new Error("Failed to fetch users");
            }
        },
        user: async (parent, { id }, { mongo }) => {
            try {
                const user = await mongo.users.findOne({ _id: new ObjectId(id) });
                if (!user) throw new Error("User not found");
                return user;
            } catch (err) {
                console.error(err);
                throw new Error("Failed to fetch user");
            }
        },
    },

    Mutation: {
        createUser: async (parent, { user }, { mongo }) => {
            try {
                const response = await mongo.users.insertOne(user);
                return { ...user, id: response.insertedId };
            } catch (err) {
                console.error(err);
                throw new Error("Failed to create user");
            }
        },

        deleteUser: async (parent, { id }, { mongo }) => {
            try {
                const response = await mongo.users.deleteOne({ _id: new ObjectId(id) });
                return response.deletedCount > 0;
            } catch (err) {
                console.error(err);
                throw new Error("Failed to delete user");
            }
        },

        updateUser: async (parent, { id, update }, { mongo }) => {
            try {
                const response = await mongo.users.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { name: update.name } }
                );
                if (response.matchedCount === 0) throw new Error("User not found");
                return mongo.users.findOne({ _id: new ObjectId(id) });
            } catch (err) {
                console.error(err);
                throw new Error("Failed to update user");
            }
        },
    },

    User: {
        id: (parent) => parent._id || parent.id,
        name: (parent) => (parent.name ? parent.name.toUpperCase() : null),
        comments :(parent ,args , {mongo})=> mongo.comments.find({email : parent.email})
        
    },
};
