import mongoose from'mongoose'
import 'dotenv/config'


mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

const excerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    unit: { type: String, required: true },
    date: { type: String, required: true }
})

const Exercise = mongoose.model('Excercise', excerciseSchema);

const createExercise = async(name,reps,weight,unit,date) => {
    const exercise = new Exercise({name:name,reps:reps,weight:weight,unit:unit,date:date});
    return exercise.save();

}

const readExercise = async(filter)=> {
    const query = Exercise.find(filter)
    return query.exec();
}

const readExerciseByID = async(_id) =>{
    const query = Exercise.findByID(_id);
    return query.exec();
}

const updateExercise = async(_id,name,reps,weight,unit,date)=>{
    const result = await Exercise.updateOne({_id:_id},{name:name,reps:reps,weight:weight,unit:unit,date:date});
    return result.modifiedCount;
}

const deleteExercise = async(filter) => {
    const result = await Exercise.deleteMany({_id:filter});
    return result.deletedCount;
}



// /**
// *
// * @param {string} date
// * Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
// */
// // function isDateValid(date) {
// //     // Test using a regular expression. 
// //     // To learn about regular expressions see Chapter 6 of the text book
// //     const format = /^\d\d-\d\d-\d\d$/;
// //     return format.test(date);
// // }

export {createExercise, readExercise, readExerciseByID, updateExercise, deleteExercise};













