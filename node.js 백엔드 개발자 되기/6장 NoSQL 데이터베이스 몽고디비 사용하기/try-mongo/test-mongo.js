
const { MongoClient} = require('mongodb');
const uri = "mongodb+srv://jh940412:jahyun0503@cluster0.qalsiue.mongodb.net/test?retryWrites=true&w=majority";


const client = new MongoClient(uri);

async function run() {

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const adminDB = client.db('test').admin();
    const listDatabases = await adminDB.listDatabases();
    // Send a ping to confirm a successful connection
    console.log(listDatabases);
    return `OK`;
 
}

run()
    .then(console.log)
    .catch(console.error)
    .finally(()=> client.close);
