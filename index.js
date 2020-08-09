import express from "express";
import {promises as fs} from "fs";
import gradesRouter from "./routes/grades.js";

const { readFile, writeFile} = fs;


const app = express();
app.use(express.json());
app.use("/grades", gradesRouter);


app.listen(3000, async ()=>{
    try {
        await readFile("grades.json");
        console.log("API started!")
    } catch (err) {
        console.log(err);        
    }
});