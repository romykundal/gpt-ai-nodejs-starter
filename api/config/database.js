import mongoose from "mongoose";

//Import MongoUI 
const MONGO_UI = process.env.MONGO_UI;

// mongoose.connect(MONGO_UI, {
//   useCreateIndex: true,
//   useNewUrlParser: true
// });
mongoose.connect( MONGO_UI, { 
	useNewUrlParser: true,
	useUnifiedTopology: true } );

mongoose.Promise = global.Promise;
let connection = mongoose.connection;

//Check for errors
connection.on('error', (err) => {
  if (err) console.log(err);
});

//Check for connection
connection.once('open', () => console.log(`connecting to mongodb...`));

export default connection;