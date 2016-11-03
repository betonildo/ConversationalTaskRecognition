"use strict";
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var lastLine = "";
rl.prompt();
rl.on('line', function (input) {
    if (input) {
    }
    else {
        console.log(lastLine);
    }
    rl.prompt();
});
//# sourceMappingURL=Exec.js.map