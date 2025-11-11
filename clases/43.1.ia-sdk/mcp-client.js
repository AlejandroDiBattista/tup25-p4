// Cliente simple para conectar a un MCP remoto desde Node.js (ESM)
// Exporta funciones: connectMcp, getClient, listTools, invokeTool
// Usa createMCPClient con un transport tipo "streamableHttp".

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

let _client = null;

/**
 * Conecta al MCP remoto. Si ya existe una conexión reutiliza el cliente.
 * @param {{url?: string, token?: string, reconnectionOptions?: object}} opts
 */
export async function connectMcp(opts = {}) {
  const url = opts.url || process.env.MCP_URL || "https://mcp.agentdb.dev/WvZ1-CcyHX";
  const token = opts.token || process.env.MCP_TOKEN;

  if (_client) return _client;

  // Crear instancia del cliente y del transport streamable HTTP
  const client = new Client({ name: "ia-sdk-client", version: "0.1.0" });
  const transport = new StreamableHTTPClientTransport(new URL(url), {
    requestInit: {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    },
    reconnectionOptions: opts.reconnectionOptions || {
      initialReconnectionDelay: 1000,
      maxReconnectionDelay: 30000,
      reconnectionDelayGrowFactor: 1.5,
      maxRetries: 10
    }
  });

  try {
    await client.connect(transport);
    _client = client;
    console.log("✅ Conectado al MCP:", url);
    return _client;
  } catch (err) {
    console.error("❌ Error conectando al MCP:", err?.message || err);
    throw err;
  }
}

export function getClient() {
  if (!_client) throw new Error("Cliente MCP no inicializado. Llama a connectMcp() primero.");
  return _client;
}

export async function listTools() {
  const client = getClient();
  return await client.listTools();
}

export async function invokeTool(options) {
  const client = getClient();
  // options: { toolId, params }
  const { toolId, params } = options || {};
  if (!toolId) throw new Error('invokeTool: se requiere toolId');
  // Client.callTool espera { name, input }
  const callParams = { name: toolId, input: params ?? {} };
  return await client.callTool(callParams);
}

export async function disconnect() {
  if (!_client) return;
  try {
    if (typeof _client.disconnect === 'function') await _client.disconnect();
  } catch (err) {
    // noop
  } finally {
    _client = null;
  }
}

/**
 * Crea un objeto con funciones dinámicas para cada tool disponible en el MCP.
 * Uso: const mcp = await createToolProxies(); await mcp.execute_sql({ dbName, statements });
 * También admite llamadas de conveniencia: si la herramienta tiene un inputSchema con una única propiedad,
 * puedes llamar mcp.theTool(singleValue) y se mapeará al único campo.
 */
export async function createToolProxies() {
  const client = getClient();
  const toolsRes = await client.listTools();
  const proxies = {};

  const tools = toolsRes?.tools || [];
  for (const tool of tools) {
    const name = tool.name;
    // Crear función dinámica
    proxies[name] = async function (...args) {
      // Determinar params a enviar
      let params;
      if (args.length === 1 && args[0] && typeof args[0] === 'object' && !Array.isArray(args[0])) {
        params = args[0];
      } else if (args.length === 1) {
        // Si tiene inputSchema con una sola propiedad, mapear al nombre de esa propiedad
        const schema = tool.inputSchema;
        try {
          if (schema && schema.type === 'object' && schema.properties) {
            const keys = Object.keys(schema.properties);
            if (keys.length === 1) {
              params = { [keys[0]]: args[0] };
            }
          }
        } catch (e) {
          // ignore
        }
      }

      // Si no determinamos params, y hay múltiples args, enviamos como array bajo key 'args'
      if (!params) {
        if (args.length === 0) params = {};
        else if (args.length === 1) params = { input: args[0] };
        else params = { args };
      }

      // Llamar al cliente
      return await invokeTool({ toolId: name, params });
    };
  }

  return proxies;
}
