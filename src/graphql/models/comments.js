import { ObjectId } from "mongodb";

export const typeDef = /* GraphQL */ `
    type Query {
        comments: [Comment]!
        comment(_id: ID!): Comment
    }

    type Mutation {
        createComment(comment: NewCommentInput!): Comment!
        deleteComment(_id: ID!): Boolean!
        updateComment(_id: ID!, updatedComment: UpdateCommentInput!): Comment
    }

    input UpdateCommentInput {
        text: String!
    }

    type Comment {
        _id: ID!
        email: String
        text: String
        user: User
    }

    input NewCommentInput {
        text: String!
        email: String!
    }
`;

export const resolvers = {
    Query: {
        comments: async (parent, args, { mongo }) => {
            try {
                const comments = await mongo.comments.find().limit(20).toArray();
                return comments;
            } catch (error) {
                console.error("Failed to fetch comments:", error);
                throw new Error("Could not fetch comments");
            }
        },
        comment: async (parent, { _id }, { mongo }) => {
            try {
                const comment = await mongo.comments.findOne({ _id: new ObjectId(_id) });
                if (!comment) {
                    throw new Error("Comment not found");
                }
                return comment;
            } catch (error) {
                console.error("Failed to fetch comment:", error);
                throw new Error("Could not fetch comment");
            }
        },
    },
    Mutation: {
        createComment: async (parent, { comment }, { mongo }) => {
            try {
                const newComment = await mongo.comments.insertOne(comment);
                return { ...comment, _id: newComment.insertedId };
            } catch (error) {
                console.error("Failed to create comment:", error);
                throw new Error("Could not create comment");
            }
        },
        deleteComment: async (parent, { _id }, { mongo }) => {
            try {
                const response = await mongo.comments.deleteOne({ _id: new ObjectId(_id) });
                return response.deletedCount > 0;
            } catch (error) {
                console.error("Failed to delete comment:", error);
                throw new Error("Could not delete comment");
            }
        },
        updateComment: async (parent, { _id, updatedComment }, { mongo }) => {
            try {
                const response = await mongo.comments.updateOne(
                    { _id: new ObjectId(_id) },
                    { $set: { text: updatedComment.text } }
                );
                if (response.matchedCount === 0) {
                    throw new Error("Comment not found");
                }
                return mongo.comments.findOne({ _id: new ObjectId(_id) });
            } catch (error) {
                console.error("Failed to update comment:", error);
                throw new Error("Could not update comment");
            }
        },
    },
    Comment: {
        user: async ({ email }, args, { mongo }) => {
            try {
                return await mongo.users.findOne({ email });
            } catch (error) {
                console.error("Failed to fetch user:", error);
                return null;
            }
        },
    },
};
