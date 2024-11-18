import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

// export const dbConnection = () => {
//     mongoose.
//         connect(process.env.CONNECTION_STRING)
//         .then(() => console.log("Db is connected"))
//         .catch(() => console.log("Error to connect to db"))
// }


const client = new MongoClient(process.env.CONNECTION_STRING, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export async function setUpDataBase() {

    try {
        await client.connect()
        const db = client.db('sample_mflix')
        return {
            client,
            db,
            users: db.collection('users'),
            movies: db.collection('movies'),

        }
    } catch (err) {
        console.log("Error to setUp database");
        return {};
    }
}