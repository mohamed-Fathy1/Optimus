const express = require('express');
const router = express.Router();
const { MongoClient } = require("mongodb");
const url = 'mongodb+srv://essamayman:UaM7kxXwCkUCp4pB@optimusevaluation.m3tro.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(url);

const connection = require('./common/db')

router.get('/', async (req, res) => {
    try {
        let db = await connection.Get();
        //     let result = await db.collection('student').find({id:1800135});

        //    result.then((res)=>{
        //        console.log(res);
        //    }).catch((err)=>{
        //        console.log(err)
        //    })
        db.db("OptimusEvaluation").collection("Students").findOne({ "id": 1800135 }, (err, res) => {
            if (err) throw err
            console.log(res)
        })
    } catch (e) {
        console.log(e)
    }






















    // // & ---------query---------
    // async function runQuery() {
    //     try {
    //         await client.connect();
    //         console.log("connected to database");
    //         const database = client.db('OptimusEvaluation');
    //         const students = database.collection('Students');

    //         const query = { "id": 1800135 };
    //         const Projection = {};
    //         const sort = {};
    //         const skip = {};
    //         const limit = {};

    //         const student = await students.findOne(query);

    //         console.log(student["courses"]);
    //         res.status(200).json(student);
    //     } finally {
    //         // Ensures that the client will close when you finish/error
    //         await client.close();
    //     }
    // }
    // runQuery().catch(console.dir);
    // // & ---------End Of query---------

})

// router.post('/', (req, res) => {
//     const data = req.body;
//     console.log(data);
//     // & ---------query---------
//     async function runQuery() {
//         try {
//             await client.connect();
//             console.log("connected to database");
//             const database = client.db('OptimusEvaluation');
//             const students = database.collection('Students');

//             const query = {};
//             const Projection = {};
//             const sort = {};
//             const skip = {};
//             const limit = {};

//             const student = await students.insertOne(data);
//             res.status(200).json({ success: true, data: data });
//         } finally {
//             // Ensures that the client will close when you finish/error
//             await client.close();
//         }
//     }
//     runQuery().catch(console.dir);
//     // & ---------End Of query---------

// })

router.post('/', async (req, res) => {
    try {
        let db = await connection.Get();
        //     let result = await db.collection('student').find({id:1800135});

        //    result.then((res)=>{
        //        console.log(res);
        //    }).catch((err)=>{
        //        console.log(err)
        //    })
        db.db("OptimusEvaluation").collection("Students").findOne({ "id": 1800379 }, (err, res) => {
            if (err) throw err
            console.log(res)
        })
    } catch (e) {
        console.log(e)
    }

})

// router.get('/', getStudents)

module.exports = router;