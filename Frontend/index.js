const express = require("express");   //express module import

const app = express(); // express module on

app.get("/", function(req, res){
    res.send("Hello");
})                                 // app.get("위치", 콜백 함수)로 브라우저가 서버에 "/"(메인) Route로 데이터를 요청하면 repsonse.send 함수를 실행하게 한다.

app.get("/contact", function(req, res){
    res.send("Hello");
})                                 // app.get("위치", 콜백 함수)로 브라우저가 서버에 "/contact" Route로 데이터를 요청하면 repsonse.send 함수를 실행하게 한다.

app.get("/", function(req, res){
    res.sendFile("index.html" or __dirname + "/index.html");
})                                 // res.sendfile로 HTML 파일을 실행해준다. __dirname 사용 시, 현재 파일 위치로 항상 지정해줌 host 위치와 무관하게. 따라서 안정적으로 index.html을 항상 찾을 수 있게 된다.

app.listen(3000); // port 3000인 server 실행