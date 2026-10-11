/*
    Author: Connor Kippes

    Delete the old projdb database from Mongo.
    Run once for server that used the old codebase.
*/

import mongoose from "mongoose";

async function runDeleteProjdb() {
    await mongoose.connect("mongodb://localhost:27017/projdb");
    await mongoose.connection.db.dropDatabase();
    console.log(`Dropped database: ${mongoose.connection.name}`);
    await mongoose.disconnect();
}

runDeleteProjdb().catch((err) => {
    console.error("Delete old DB failed:", err);
    process.exit(1);
});
