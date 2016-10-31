"use strict";
var Jaccard_1 = require("./Jaccard");
var ConversationGraph_1 = require("./ConversationGraph");
var graph = new ConversationGraph_1.default();
graph.setEntryPoint("Como posso ajudar?");
graph.setPossiblePath("Como posso ajudar?", "grave meu nome", function () { return console.log("DUDE!!!"); });
graph.setPossiblePath("grave meu nome", "Qual o próximo comando?", function () { return console.log("Awsome!!"); });
//graph.setPossiblePath("Qual o próximo comando?", , () => console.log("Awsome!!"));
graph.setPossiblePath("Qual o próximo comando?", "Como você está?", function () { return console.log("Awsome!!"); });
graph.setPossiblePath("Como você está?", "Eu estou ótimo, sou uma máquina :D", function () { return console.log("Awsome!!"); });
graph.setPossiblePath("Eu estou ótimo, sou uma máquina :D", "Qual o próximo comando?", function () { return console.log("Awsome!!"); });
graph.setPossiblePath("Como está sua saúde?", "Impossibilitado por contusões... Dãh", function () { return console.log("Awsome!!"); });
graph.setPossiblePath("Impossibilitado por contusões... Dãh", "Qual o próximo?", function () { return console.log("Awsome!!"); });
var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'PROMPT> '
});
rl.prompt();
var currentLine = "";
var previousLine = "";
var myName = "";
var isRoot = true;
previousLine = graph.getRootNode().current;
rl.on('line', function (line) {
    currentLine = line.trim();
    // when i say some thing
    if (previousLine === "") {
        var possibilities = graph.getPossibleDestinationNodes(currentLine);
        var node = graph.getNode(possibilities[0].dest);
        previousLine = node.dest;
        console.log(possibilities);
    }
    else {
        console.log(previousLine);
        previousLine = "";
    }
    rl.prompt();
}).on('close', function () {
    console.log('Tenha um ótimo dia');
    process.exit(0);
});
var phraseOne = "eu estava pensando em sentar ao sol.";
var phraseTwo = "estava eu pensando sentado ao sol.";
var jac = new Jaccard_1.Jaccard(3);
var sim = jac.similarity(phraseOne, phraseTwo);
var dis = jac.distance(phraseOne, phraseTwo);
console.log("Similarity: " + sim);
console.log("Distance: " + dis);
