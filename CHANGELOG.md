# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-19

### Added

- Initial release of the Company Firmographic Enricher MCP server.
- `enrich_company_firmographics` tool: enrich a company domain into employee
  band, industry, HQ, founded year, revenue estimate, logo, and description,
  parsed from schema.org/Organization JSON-LD and HTML meta tags.
- Batch enrichment via the `domains` array input, with a configurable
  `batchSize` (default 5, maximum 10) for concurrent waves.
- `skipCache` input to force a fresh enrichment and bypass the 7 day result cache.
- Every record returns a `source_signals` array and a `data_completeness` score
  for provenance.
- stdio transport for use with Claude Desktop and other MCP clients.

[1.0.0]: https://github.com/mambalabsdev/mcp-company-firmographic-enricher/releases/tag/v1.0.0
