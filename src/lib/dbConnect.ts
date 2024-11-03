import mongoose from "mongoose";

type ConnectionObject = {
   isConnected?: number;
};

const connection: ConnectionObject = {};
// console.log(connection)

async function dbConnect(): Promise<void> {
   // console.log("inside dnbconnect");

   if (connection.isConnected) {
      // console.log("Already connected to database");
      return;
   }

   try {
      const db = await mongoose.connect(process.env.MONGO_URI || "");
      //   console.log(db)
      connection.isConnected = db.connections[0].readyState;

      console.log("db Connected Successfully");
   } catch (error) {
      console.log("database connection failed", error);
      process.exit(1);
   }
}

export default dbConnect;
