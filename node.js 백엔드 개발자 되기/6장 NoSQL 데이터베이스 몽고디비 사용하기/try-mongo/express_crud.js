const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Person = require("./person-model")

mongoose.set('strictQuery', false);

const app = express();
app.use(bodyParser.json());
app.listen(3000, async() => {
    console.log('server start');

    const mongodbUrl = "mongodb+srv://jh940412:jahyun0503@cluster0.qalsiue.mongodb.net/test?retryWrites=true&w=majority";
    mongoose
        .connect(mongodbUrl, {useNewUrlParser : true})
        .then(console.log("connect to mongodb"));
})

// 특정이메일 찾기
app.get("/person/:email", async (req, res)=> {
    const person = await Person.findOne({email:req.params.email});
    res.send(person)
});

app.get("/person", async(req, res) => {
    const person = await Person.find({});
    res.send(person);
});

app.post("/person", async(req, res)=>{
    const person = new Person(req.body);
    await person.save();
    res.send(person);
})

// person 데이터 수정
app.put("/person/:email", async(req, res) =>{
    const person = await Person.findOneAndUpdate(
        {email: req.params.email},
        {$set: req.body},
        {new : true}
    )
});

app.delete("/person/:email", async(req, res) => {
    await Person.deleteMany({email: req.params.email});
    res.send({success : true});
});


