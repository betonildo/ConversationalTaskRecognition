import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";
import { Jaccard } from "./Jaccard";

let j = new Jaccard(1);
let ph1 = "Estou cansado pra caramba.";
let ph2 = "Estou bem cansado.";

let sim = j.similarity(ph1, ph2);
console.log(sim);

ReactDOM.render(
    <Hello compiler="TypeScript2" framework="React" />,
    document.getElementById("example")
);