import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

app.use(cors({
    origin: [ "http://localhost:3000", "http://localhost:3001"],
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.get('/', (req, res) => {
    
    res.json("Server work")
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})