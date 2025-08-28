
import { promises as fsp } from "fs";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";


export async function read(origen='./agenda.json'){
    const data = await fsp.readFile(origen, 'utf-8');
    return JSON.parse(data ?? "[]");
}

export async function write(data, destino='./agenda.json'){
  await fsp.writeFile(destino, JSON.stringify(data, null, 2), 'utf-8');
}

export async function prompt(mensaje = "") {
  const rl = readline.createInterface({ input, output });
  try {
    const ans = await rl.question(mensaje);
    return ans.trim();
  } finally {
    rl.close();
  }
}

