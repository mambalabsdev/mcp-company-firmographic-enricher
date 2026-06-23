# Company Firmographic Enricher MCP Server

[![Smithery](https://smithery.ai/badge/mambabuilt/mcp-company-firmographic-enricher)](https://smithery.ai/servers/mambabuilt/mcp-company-firmographic-enricher) [![Glama score](https://glama.ai/mcp/servers/mambalabsdev/mcp-company-firmographic-enricher/badges/score.svg)](https://glama.ai/mcp/servers/mambalabsdev/mcp-company-firmographic-enricher) [![MCP Registry](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.modelcontextprotocol.io%2Fv0%2Fservers%3Fsearch%3Dcom.mambabuilt%252Fmcp-company-firmographic-enricher%26limit%3D1&query=%24.servers%5B0%5D._meta%5B%22io.modelcontextprotocol.registry%2Fofficial%22%5D.status&label=mcp%20registry&color=blue)](https://registry.modelcontextprotocol.io/v0/servers?search=com.mambabuilt/mcp-company-firmographic-enricher&limit=1) [![npm version](https://img.shields.io/npm/v/@mambalabsdev/mcp-company-firmographic-enricher)](https://www.npmjs.com/package/@mambalabsdev/mcp-company-firmographic-enricher) [![npm downloads](https://img.shields.io/npm/dm/@mambalabsdev/mcp-company-firmographic-enricher)](https://www.npmjs.com/package/@mambalabsdev/mcp-company-firmographic-enricher) [![license](https://img.shields.io/github/license/mambalabsdev/mcp-company-firmographic-enricher)](https://github.com/mambalabsdev/mcp-company-firmographic-enricher/blob/main/LICENSE) [![mcpservers.org](https://img.shields.io/badge/mcpservers.org-listed-blue)](https://mcpservers.org/servers/mambalabsdev/mcp-company-firmographic-enricher)

An MCP server that exposes the Mamba Labs Company Firmographic Enricher as a single tool. Install one package and give your MCP client a way to turn a company domain into structured firmographics, wrapping the Mamba Labs actor on Apify and returning Clay-ready flat JSON with source provenance.

## What's Inside

- [What it does](#what-it-does)
- [Quick start](#quick-start)
- [Prerequisites](#prerequisites)
- [Example prompts](#example-prompts)
- [Tool and inputs](#tool-and-inputs)
- [Full actor documentation](#full-actor-documentation)
- [Mamba Labs GTM Suite](#mamba-labs-gtm-suite)
- [License](#license)

## What it does

This server gives an AI client one tool:

- `enrich_company_firmographics`: enrich a company domain into employee band, industry, HQ, founded year, revenue estimate, logo, and description, parsed from the company's schema.org/Organization JSON-LD and HTML meta tags. Every record includes a `source_signals` array and a `data_completeness` score.

All of the work runs on Apify. This package is a thin client that routes the tool call to the actor and hands back the result.

## Quick start

You need Node.js 18 or newer and an Apify account with an API token.

Add this to your Claude Desktop config:

```json
{
  "mcpServers": {
    "company-firmographic-enricher": {
      "command": "npx",
      "args": ["-y", "@mambalabsdev/mcp-company-firmographic-enricher"],
      "env": {
        "APIFY_TOKEN": "your-apify-token"
      }
    }
  }
}
```

Get your token at https://console.apify.com/account/integrations, paste it in, and restart Claude Desktop. The tool will be available.

## Prerequisites

- Node.js 18 or newer
- An Apify account with an API token

## Example prompts

- "Enrich stripe.com: employees, industry, HQ, founded year, and revenue estimate."
- "What firmographics can you find for gitlab.com, and how complete is the data?"
- "Pull company firmographics for these domains: stripe.com, gitlab.com, notion.so."
- "Find the employee band and HQ location for acme.com."

## Tool and inputs

`enrich_company_firmographics`:

- `domain` (string): bare company domain to enrich, e.g. stripe.com. Provide this or `domains`.
- `company_name` (string): optional company name, used as a fallback label when the page does not expose one.
- `domains` (array): list of bare domains for batch processing. Takes precedence over `domain`.
- `batchSize` (number): domains enriched concurrently per wave in batch mode. Default 5, maximum 10.
- `skipCache` (boolean): force a fresh enrichment and ignore the 7 day result cache.

## Full actor documentation

For the complete input and output reference, pricing, and run history, see the Company Firmographic Enricher actor on the Apify Store (canonical immutable Actor ID URL):

https://apify.com/mambalabs/YlUtLWjfPpqykmB8g

---

## Mamba Labs GTM Suite

This server is part of the **Mamba Labs GTM Suite**, a fleet of twelve specialized MCP servers for go-to-market signal intelligence, each backed by a dedicated Apify actor.

| Actor | Immutable Actor ID |
|---|---|
| [GTM Hiring Signal Scraper](https://console.apify.com/actors/D7O1SA2EqwHGsGr1P) | `D7O1SA2EqwHGsGr1P` |
| [GTM Tech Stack Signal Enrichment](https://console.apify.com/actors/qyd7nNyqFPelQViBx) | `qyd7nNyqFPelQViBx` |
| [GTM Signals Aggregator](https://console.apify.com/actors/xKdRfnfFNkdMpFuNs) | `xKdRfnfFNkdMpFuNs` |
| [Job Board Keyword Signal Scanner](https://console.apify.com/actors/4DvqpvhMR74NLcDDY) | `4DvqpvhMR74NLcDDY` |
| [Domain to LinkedIn URL Resolver](https://console.apify.com/actors/3HtnSaqPHOg1Qg5gx) | `3HtnSaqPHOg1Qg5gx` |
| [ICP Fit Scorer](https://console.apify.com/actors/W161DT8W4kW55dMFh) | `W161DT8W4kW55dMFh` |
| [Domain Deliverability Checker](https://console.apify.com/actors/0tVgxI7A6o9jMlxmc) | `0tVgxI7A6o9jMlxmc` |
| [Company Firmographic Enricher](https://console.apify.com/actors/YlUtLWjfPpqykmB8g) | `YlUtLWjfPpqykmB8g` |
| [Company Social Presence Mapper](https://console.apify.com/actors/4k6CCemkgBDz18m2h) | `4k6CCemkgBDz18m2h` |
| [Company Identity Resolver](https://console.apify.com/actors/lr8fTRAmZCBZmuwwh) | `lr8fTRAmZCBZmuwwh` |
| [Company Change-Event Feed](https://console.apify.com/actors/oX44rS0fkEJ3rXLWe) | `oX44rS0fkEJ3rXLWe` |
| [Funding & Press Signal Scanner](https://console.apify.com/actors/FS13X6dhQVgX3XOM6) | `FS13X6dhQVgX3XOM6` |

> Built by [Mamba Labs](https://github.com/mambalabsdev) | [npm](https://www.npmjs.com/org/mambalabsdev) | [Apify Store](https://apify.com/mambalabs)

## License

MIT

Built by Mamba Labs. https://apify.com/mambalabs
