// ============================================================================
// [TRAE.AI DIRECTIVE: MASTER MCP EXPORTS]
// 
// Architect Note:
// This directory contains the Model Context Protocol (MCP) bridges. These modules
// are designed to act as tools for the LLM Copilot, allowing it to perform 
// secure out-of-band actions (task creation, DB queries, web scraping).
// 
// Your tasks:
// 1. Hook up the respective MCP servers in your environment.
// 2. Expose these functions to the LLM agent tool calling array in `src/app/api/chat/route.ts`.
// ============================================================================

export * from "./clickup";
export * from "./puppeteer";
export * from "./github";
export * from "./supabase";
