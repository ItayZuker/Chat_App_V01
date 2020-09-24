const http = require("http");
const fs = require("fs");
const Url = require("url-parse");

http.createServer( (request, response) => {

    function renderHistory(history) {
        return history.reduce((html, {message}) => {
            html += `<div><span>${message}</span></div>`;
            return html;
        }, "");
    }

    if(request.url === "/favicon.ico") return;
    if(request.url === "/style.css") {
        let cssFile = fs.readFileSync("style.css", {encoding: "UTF-8"});
        response.writeHead(200, {"Content-Type": "text/css"});
        response.write(cssFile);
        response.end();
    } else {
        const url = new Url(request.url, true);
        const message = url.query.message || "";

        const messageEvent = {
            message,
        };

        const history = JSON.parse(fs.readFileSync("history.json"));

        if(message !== "") {
            history.push(messageEvent);    
            fs.writeFileSync("history.json", JSON.stringify(history));
        };

        let file = fs.readFileSync("index.html", {encoding: "UTF-8"});
        file = file.replace("%message%", renderHistory(history));

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(file);
        response.end();
    }    
} ).listen(8080);

    


