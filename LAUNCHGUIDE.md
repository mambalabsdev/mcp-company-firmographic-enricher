# Company Firmographic Enricher MCP Server

## Tagline
Turn a company domain into employee band, industry, HQ, founded year, and revenue estimate.

## Description
An MCP server that exposes the Mamba Labs Company Firmographic Enricher actor on Apify (immutable Actor ID `YlUtLWjfPpqykmB8g`) as one tool, `enrich_company_firmographics`. Give it a bare company domain, or a list of domains, and it returns structured firmographics: employee band, industry, HQ location, founded year, revenue estimate, logo, and description.

The actor parses the company's own schema.org/Organization JSON-LD and HTML meta tags. Every record carries a `source_signals` array that names where each field came from and a `data_completeness` score, so you can filter weak rows before they reach a CRM or a Clay table. Output is flat, Clay-ready JSON.

The package is a thin stdio client. It starts the actor run, polls it to a finished status, and reads the dataset. A run is allowed 1,800 seconds. If the run is still going two minutes after that, the call returns the run ID and an Apify Console link instead of a timeout. It is built for revenue teams, GTM engineers, and anyone enriching account lists from an AI client.

## Setup Requirements
- `APIFY_TOKEN` (required): Your Apify API token. Every tool call runs the actor on your Apify account and is billed there. https://console.apify.com/account/integrations

## Category
Business Tools

## Features
- Enrich one domain or a batch of domains in a single call
- Employee band, industry, HQ, founded year, revenue estimate, logo, and description
- Source provenance on every field through a `source_signals` array
- A `data_completeness` score per record for filtering weak rows
- Batch mode with a configurable wave size, default 5 and maximum 10 domains at once
- A 7 day result cache, with `skipCache` to force a fresh read
- `failOnMostlyEmpty` control: fail the run when most rows resolve nothing, or return them with `resolution_status` and `empty_reason`
- Start and poll execution, so a long run is not cut off at 300 seconds
- Flat, Clay-ready JSON output
- Runs locally through npx with one environment variable

## Getting Started
- "Enrich stripe.com: employees, industry, HQ, founded year, and revenue estimate."
- "What firmographics can you find for gitlab.com, and how complete is the data?"
- "Pull company firmographics for these domains: stripe.com, gitlab.com, notion.so."
- "Find the employee band and HQ location for acme.com."
- Tool: enrich_company_firmographics: Enrich one bare domain (`domain`) or a list (`domains`) into structured firmographics with provenance. Use it before scoring, routing, or segmenting accounts.

## Tags
firmographics, company enrichment, company data, domain enrichment, b2b data, account enrichment, employee count, revenue estimate, industry classification, headquarters, founded year, lead enrichment, sales intelligence, gtm, revops, clay, apify, crm enrichment, account research, data provenance

## Documentation URL
https://github.com/mambalabsdev/mcp-company-firmographic-enricher#readme

## Health Check URL
Not applicable. This is a local stdio server run through npx.
