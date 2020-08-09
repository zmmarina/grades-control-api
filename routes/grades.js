import express from "express";
import {promises as fs} from "fs";

const { readFile, writeFile} = fs;
const router = express.Router();

router.post("/", async(req, res, next)=>{
    try {
        let grade = req.body;
        
        if (!grade.student || !grade.subject || !grade.value || !grade.type == null){
            throw new Error("All fields are mandatory!")
        }

        const data = JSON.parse(await readFile("grades.json"));

        grade = { 
            id: data.nextId++, 
            student: grade.student,
            subject: grade.subject,
            type: grade.type,
            value: grade.value,
            timestamp: new Date()
        };

        console.log(grade);
        data.grades.push(grade);

        await writeFile("grades.json", JSON.stringify(data, null, 2));
        res.send(grade);    

    } catch (err) {
        next(err);
    }
});


router.put("/", async(req, res, next)=>{
    try {
        let grade = req.body;
        
        if (!grade.student || !grade.subject || !grade.value || !grade.type == null){
            throw new Error("All fields are mandatory!")
        }

        const data = JSON.parse(await readFile("grades.json"));
        const index = data.grades.findIndex(g=> g.id === grade.id);

        if (index === -1){
            throw new Error ("Grade not found");
        }

        data.grades[index].student = grade.student;
        data.grades[index].subject = grade.subject;
        data.grades[index].value = grade.value;
        data.grades[index].type = grade.type;


        await writeFile("grades.json", JSON.stringify(data, null, 2));
        res.send(grade);    

    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async(req, res, next)=>{
    try {
        const data = JSON.parse(await readFile("grades.json"));
        data.grades = data.grades.filter(
            g=> g.id !== parseInt(req.params.id));
        
        await writeFile("grades.json", JSON.stringify(data, null, 2));
        res.end();
        
    } catch (err) {
        next(err);
    }
});

router.get("/:id", async (req, res, next)=>{
    try {
        const data = JSON.parse(await readFile("grades.json"));
        const grade = data.grades.find(
            g=> g.id === parseInt(req.params.id));
        
            res.send(grade);
        
    } catch (err) {
        next(err);        
    }
});


  router.get("/avg/:student/:subject", async (req, res, next)=>{
    try {
        const data = JSON.parse(await readFile("grades.json"));       
        const filteredData = data.grades.filter(
            g=> g.student === req.params.student && g.subject === req.params.subject)
            .map(item => item.value);           
        const summedNumbers = filteredData.reduce((acc, cur)=>{
            return acc+cur});
            console.log(summed)
        const media = summedNumbers/filteredData.length;
        
                   
            res.send(req.params.student + " " + req.params.subject + " : " + media);
            

    } catch (err) {
        next(err);        
    }
});   

router.get("/sum/:subject/:type", async (req, res, next)=>{
    try {
        const data = JSON.parse(await readFile("grades.json"));       
        const filteredData = data.grades.filter(
            g=> g.subject === req.params.subject && g.type === req.params.type)
            .map(item => item.value);                     
        const summedNumbers = filteredData.reduce((acc, cur)=>{
            return acc+cur});
        const media = summedNumbers/filteredData.length;
        
                   
            res.send(req.params.subject + " " + req.params.type + " : " + media);
           

    } catch (err) {
        next(err);        
    }
});

 router.get("/best/:subject/:type", async (req, res, next)=>{
    try {
        const data = JSON.parse(await readFile("grades.json"));       
        const filteredData = data.grades.filter(
            g=> g.subject === req.params.subject && g.type === req.params.type)
            .map(item => { 
                return { value: item.value,
                         id:  item.id } });                     
        const bestGrades = filteredData.sort((a, b)=> b.value-a.value).slice(0,3)
        console.log(bestGrades)
                           
            res.send(req.params.subject + " " + req.params.type + " : " + JSON.stringify(bestGrades));
           

    } catch (err) {
        next(err);        
    }
}); 



export default router;