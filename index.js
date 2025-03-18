import open from 'open';
import { generate } from 'random-words';
import { exec } from 'child_process';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import fs from 'fs';
import readline from 'node:readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configFilePath = path.join(__dirname, 'config.json');

function loadConfig() {
  if (fs.existsSync(configFilePath)) {
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    return config;
  }
  return { CONFIGURADO: false }; 
}

function saveConfig(config) {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
}


let wordsList = generate(10);

async function openBrowser(wordSearched) {
  await open(
    `https://www.bing.com/news/search?q=${wordSearched}&qs=n&form=QBNT&sp=-1&ghc=1&lq=0&pq=${wordSearched}+&sc=2-8&sk=&cvid=697499DDF7DF4D49B25964C123BB5960&ghsh=0&ghacc=0&ghpl=`,
    { app: { name: 'msedge' } }
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchAllWords() {
  console.log('Iniciando pesquisas...');
  for (let i = 0; i < wordsList.length; i++) {
    await openBrowser(wordsList[i]);
    await delay(7000); 
  }
  console.log('Pesquisas concluídas.');
}

function configureAutoStart(timeConfigured) {
  const scriptPath = path.resolve(__filename); 
  const osType = os.type(); 

  if (osType === 'Windows_NT') {
    const command = `schtasks /create /tn "PesquisasAutomaticas" /tr "node ${scriptPath}" /sc daily /st ${timeConfigured}`;
    exec(command, (error) => {
      if (error) {
        console.error('Erro ao configurar agendamento no Windows:', error);
      } else {
        console.log(`Agendamento configurado no Windows. O script será executado diariamente às ${timeConfigured}.`);
      }
    });
  }
}

const config = loadConfig();

if (!config.CONFIGURADO) {
  askTimeForUser();
  config.CONFIGURADO = true; 
  saveConfig(config); 
} else {
  console.log('Executando pesquisas...');
  searchAllWords(); 
}


function askTimeForUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(`Deseja configurar a pesquisa diária para qual horário \n`, timeConfigured => {
    configureAutoStart(timeConfigured); 
    rl.close();
  });
}
