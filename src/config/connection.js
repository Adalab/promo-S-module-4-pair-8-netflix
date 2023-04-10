
const mongoose = require('mongoose');
const dbConnect = () => {
    const db = "Adalab";
    const user = "nataliaouteiral";
    const password = "vHWmaUUZnJ5DECwP";
    const URI = `mongodb+srv://${user}:${password}@cluster0.pqext4p.mongodb.net/${db}?retryWrites=true&w=majority`
    ;
    mongoose 
        .connect(uri, {userNewUrlParser: true, useUnidiefTopology: true})
        .then(() => console.log('conectado a mongodb') )
        .catch ((e) => console.log('error de coneción', e) );
}