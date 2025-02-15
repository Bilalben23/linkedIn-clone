import express from "express";
import dotenv from "dotenv";
dotenv.config();


const app = express();


// app.use("/api/v1/auth/")



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('listening on port ')
})