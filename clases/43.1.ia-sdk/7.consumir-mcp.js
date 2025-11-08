import { titulo } from "./utils.js";
import { connectMcp, listTools, createToolProxies } from "./mcp-client.js";

titulo("Demo: consumir MCP remoto");

// Conecta (usa MCP_URL / MCP_TOKEN del entorno si están definidos)
await connectMcp();

try {
  const tools = await listTools();
  console.log("Herramientas disponibles:", tools);

  // Crear proxies dinámicos para llamar a las tools como funciones: mcp.<toolName>(...)
  const mcp = await createToolProxies();

  // Ejemplos de uso:
  //  - Si la tool espera un objeto: await mcp.create_template({ name: 'mi', initializationSql: [...] })
  //  - Si la tool tiene un único campo en su inputSchema (p.ej. { n: number }) puedes llamar: await mcp.someTool(10)

  const demoToolName = tools?.tools?.[0]?.name;
  if (demoToolName && typeof mcp[demoToolName] === 'function') {
    try {
      console.log(`Invocando herramienta de demo como función: mcp.${demoToolName}(...)`);
      // Llamada de demostración: si la función admite un mapeo de un solo argumento, lo usaremos
      const result = await mcp[demoToolName](10);
      console.log("Resultado:", result);
    } catch (err) {
      console.error("Error invocando herramienta:", err?.message || err);
    }
  } else {
    console.log('No se encontró ninguna herramienta para invocar de demo.');
  }

} catch (err) {
  console.error("Error listando herramientas o creando proxies:", err?.message || err);
}

