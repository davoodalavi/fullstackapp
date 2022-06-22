import express from 'express'
import * as exercise from './excercise_model.mjs'
import 'dotenv/config'
import asyncHandler from "express-async-handler"
import {body, validationResult} from 'express-validator'


const PORT = 3000;

const app = express();

// const {body,validationResult} = require('express-validator');

app.use(express.json());

// app.post('/exercises', (req, res) => {
//     exercise.createExercise (req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
//         .then(exercises => {
//             res.status(201).json(exercises);
//         })
//         .catch(error => {
//             console.error(error);
//             // In case of an error, send back status code 400 in case of an error.
//             // A better approach will be to examine the error and send an
//             // error status code corresponding to the error.
//             res.status(400).json({ Error: 'Request failed' });
//         });
// });


function isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

app.post(
    '/exercises',
    body('name').isString(),
    body('reps').isInt({min: 1}),
    body('weight').isInt({min: 1}),
    body('date'),
    (req,res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    if(isDateValid(req.body.date)===false){
       return res.status(400).json({errors: errors.array()});
    }
    exercise.createExercise (req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercises => {
            res.status(201).json(exercises);
        })
        .catch(error => {
            console.error(error);
            // In case of an error, send back status code 400 in case of an error.
            // A better approach will be to examine the error and send an
            // error status code corresponding to the error.
            res.status(400).json({ Error: 'Request failed' });
        });
    })


app.get("/exercises", asyncHandler (async (req,res)=>{
    
    const filter = {};
    if(req.query.name !== undefined){
        filter.name=req.query.name;
    }
    if(req.query.reps !== undefined){
        filter.reps = req.query.age;
    }
    if(req.query.weight!== undefined){
        filter.weight = req.query.email;
    }
    if(req.query.unit !== undefined){
        filter.unit = req.query.phoneNumber;
    }
    if(req.query.date !== undefined){
        filter.date = req.query._id
    }
    const result = await exercise.readExercise(filter);
    res.send(result);
}));

app.get('/exercises/:_id', (req, res) => {
    const exerciseID = req.params._id;
    exercise.readExerciseByID(exerciseID)
        .then(exercises => { 
            if (exercises !== null) {
                res.json(exercises);
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }         
         })
        .catch(error => {
            res.status(400).json({ Error: 'Request failed' });
        });

});

app.put('/exercises/:_id',
    body('name').isString(),
    body('reps').isInt({min: 1}),
    body('weight').isInt({min: 1}),
    body('date'),
    (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    if(isDateValid(req.body.date)===false){
        return res.status(400).json({errors: errors.array()});
     }
    exercise.updateExercise(req.params._id,req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date })
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});



app.delete('/exercises/:_id', (req, res) => {
    exercise.deleteExercise(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Resource not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});