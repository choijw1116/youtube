import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/youtube");

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log("DB error", error);

db.on("error", handleError); //error가 뜨면 error를 받고 console을 띄워준다
db.once("open", handleOpen); //once() 한번만 실행시킨다. 연결이 잘되었는지 확인
