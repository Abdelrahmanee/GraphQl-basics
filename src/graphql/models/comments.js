


import { ObjectId } from "mongodb";
export const typeDef = /* GraphQL */ `

    type Query{
        comments:[Comment]
        comment(_id:ID):Comment
    }
    type Mutation{
        createComment(comment:newCommentInput!):Comment!
        deleteComment(_id:ID!):Boolean!
        updateComment(_id:ID! , updated_comment:updateCommentInput):Comment
    }

    input updateCommentInput{
        text:String!
    }

    type Comment{
        _id:ID
        email:String
        text:String
        user:User   
    }
    input newCommentInput{
        text:String!
        email:String
        _id:ID
    }
`


export const resolvers = {
    Query: {
        comments: async (parent, args, { mongo }) => {
            const comments = await mongo.comments.find().limit(20).toArray()
            return comments
        },
        comment: async (parent, { _id }, { mongo }) => {
            const comment = await mongo.comments.findOne({ _id: new ObjectId(_id) })
            return comment
        }
    },
    Mutation: {
        createComment: async (parent, { comment }, { mongo }) => {
            const new_comment = await mongo.comments.insertOne(comment)
            return { ...comment, _id: new_comment.insertedId };
        },
        deleteComment: async (parent, { _id }, { mongo }) => {
            try {
                const response = await mongo.users.deleteOne({ _id: new ObjectId(_id) });
                return response.deletedCount > 0;
            } catch (err) {
                console.error(err);
                throw new Error("Failed to delete comment");
            }
        },
        updateComment: async (parent, { _id, updated_comment }, { mongo }) => {                        
            const response = await mongo.comments.updateOne(
                { _id: new ObjectId(_id) },
                { $set: { text: updated_comment.text } })
            if (response.matchedCount === 0) throw new Error("User not found");
            return mongo.comments.findOne({ _id: new ObjectId(_id) });
        }
    },
    Comment: {
        user: ({ email }, args, { mongo }) => {
            return mongo.users.findOne({ email });
        }
    }
}