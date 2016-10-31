import { Jaccard } from "./Jaccard";
import ConversationGraph from "./ConversationGraph";


let graph = new ConversationGraph();

graph.setEntryPoint("Como posso ajudar?");
graph.setPossiblePath("Como posso ajudar?", "grave meu nome", () => console.log("DUDE!!!"));
graph.setPossiblePath("grave meu nome", "Qual o próximo comando?", () => console.log("Awsome!!"));
//graph.setPossiblePath("Qual o próximo comando?", , () => console.log("Awsome!!"));
graph.setPossiblePath("Qual o próximo comando?", "Como você está?", () => console.log("Awsome!!"));
graph.setPossiblePath("Como você está?", "Eu estou ótimo, sou uma máquina :D", () => console.log("Awsome!!"));
graph.setPossiblePath("Eu estou ótimo, sou uma máquina :D", "Qual o próximo comando?", () => console.log("Awsome!!"));
graph.setPossiblePath("Como está sua saúde?", "Impossibilitado por contusões... Dãh", () => console.log("Awsome!!"));
graph.setPossiblePath("Impossibilitado por contusões... Dãh", "Qual o próximo?", () => console.log("Awsome!!"));



const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'PROMPT> '
});

rl.prompt();

let currentLine = "";
let previousLine = "";
let myName = "";
let isRoot = true;
previousLine = graph.getRootNode().current;

rl.on('line', (line) => {
    currentLine = line.trim();

    // when i say some thing
    if (previousLine === ""){

        let possibilities = graph.getPossibleDestinationNodes(currentLine);    
        let node = graph.getNode(possibilities[0].dest);
        previousLine = node.dest;

        console.log(possibilities);      
    }
    // when agent say some thing
    else {
        console.log(previousLine);
        previousLine = "";            
    }

    rl.prompt();
}).on('close', () => {
    console.log('Tenha um ótimo dia');
    process.exit(0);
});


const phraseOne = "eu estava pensando em sentar ao sol.";
const phraseTwo = "estava eu pensando sentado ao sol.";


const jac = new Jaccard(3);

const sim = jac.similarity(phraseOne, phraseTwo);
const dis = jac.distance(phraseOne, phraseTwo);
console.log("Similarity: " + sim);
console.log("Distance: " + dis);

