import open from 'open';
import { generate, count } from "random-words";

let wordsList = generate(15)

async function openBrowser(wordSearched) {
  await open(`https://www.bing.com/news/search?q=${wordSearched}&qs=PN&form=QBNT&sp=1&lq=0&sc=8-0&cvid=BA21D79F54CF4F3CA43AC45BF3E0C6C4`, { app: { name: 'msedge' } });
}

async function searchAllWords(){
    console.log(wordsList)
    let i = 0;
    while(i<wordsList.length){
        //await new Promise(r => setTimeout(r, 5000));
        openBrowser(wordsList[i])
        i++;
    }
}

searchAllWords();
