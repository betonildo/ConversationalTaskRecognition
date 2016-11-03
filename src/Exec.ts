
import LinkedGraph from "./LinkedGraph";
import readline = require("readline");


const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});

let lastLine = "";
rl.prompt();
rl.on('line', function(input:string) {

    if (input) {
                
    }
    else {
        console.log(lastLine);
    }

    rl.prompt();
});