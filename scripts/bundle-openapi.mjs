#!/usr/bin/env node

/**
 * OpenAPI Bundler Script
 *
 * Combines multiple OpenAPI YAML files into a single bundled spec.
 * Run with: node scripts/bundle-openapi.mjs
 * Or add to package.json: "openapi:bundle": "node scripts/bundle-openapi.mjs"
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENAPI_DIR = path.join(__dirname, '../openapi');
const OUTPUT_FILE = path.join(__dirname, '../openapi.json');
const OUTPUT_YAML = path.join(__dirname, '../openapi.yaml');

function loadYamlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content);
}

function loadAllYamlInDir(dir) {
  const result = {};

  if (!fs.existsSync(dir)) {
    return result;
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml'));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = loadYamlFile(filePath);
    Object.assign(result, content);
  }

  return result;
}

function bundle() {
  console.log('🔄 Bundling OpenAPI specification...\n');

  // Load base spec
  const baseFile = path.join(OPENAPI_DIR, 'base.yaml');
  if (!fs.existsSync(baseFile)) {
    console.error('❌ base.yaml not found!');
    process.exit(1);
  }

  const base = loadYamlFile(baseFile);
  console.log('✅ Loaded base.yaml');

  // Initialize components if not present
  if (!base.components) {
    base.components = {};
  }

  // Load all path files
  const pathsDir = path.join(OPENAPI_DIR, 'paths');
  const paths = loadAllYamlInDir(pathsDir);
  base.paths = { ...base.paths, ...paths };
  console.log(`✅ Loaded ${Object.keys(paths).length} path definitions`);

  // Load component schemas
  const schemasDir = path.join(OPENAPI_DIR, 'components/schemas');
  const schemas = loadAllYamlInDir(schemasDir);
  base.components.schemas = { ...base.components.schemas, ...schemas };
  console.log(`✅ Loaded ${Object.keys(schemas).length} schema definitions`);

  // Load component parameters
  const paramsDir = path.join(OPENAPI_DIR, 'components/parameters');
  const params = loadAllYamlInDir(paramsDir);
  base.components.parameters = { ...base.components.parameters, ...params };
  console.log(`✅ Loaded ${Object.keys(params).length} parameter definitions`);

  // Load component responses
  const responsesDir = path.join(OPENAPI_DIR, 'components/responses');
  const responses = loadAllYamlInDir(responsesDir);
  base.components.responses = { ...base.components.responses, ...responses };
  console.log(`✅ Loaded ${Object.keys(responses).length} response definitions`);

  // Load examples
  const examplesDir = path.join(OPENAPI_DIR, 'examples');
  const examples = loadAllYamlInDir(examplesDir);
  base.components.examples = { ...base.components.examples, ...examples };
  console.log(`✅ Loaded ${Object.keys(examples).length} example definitions`);

  // Load security schemes if separate file exists
  const securityFile = path.join(
    OPENAPI_DIR,
    'components/security-schemes.yaml'
  );
  if (fs.existsSync(securityFile)) {
    const securitySchemes = loadYamlFile(securityFile);
    base.components.securitySchemes = {
      ...base.components.securitySchemes,
      ...securitySchemes,
    };
    console.log('✅ Loaded security schemes');
  }

  // Ensure public directory exists
  const publicDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write JSON output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(base, null, 2));
  console.log(`\n📄 Written JSON spec to: ${OUTPUT_FILE}`);

  // Write YAML output
  fs.writeFileSync(OUTPUT_YAML, yaml.dump(base, { lineWidth: -1 }));
  console.log(`📄 Written YAML spec to: ${OUTPUT_YAML}`);

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   Paths: ${Object.keys(base.paths).length}`);
  console.log(`   Schemas: ${Object.keys(base.components.schemas || {}).length}`);
  console.log(`   Parameters: ${Object.keys(base.components.parameters || {}).length}`);
  console.log(`   Responses: ${Object.keys(base.components.responses || {}).length}`);
  console.log(`   Examples: ${Object.keys(base.components.examples || {}).length}`);

  console.log('\n✨ OpenAPI bundling complete!');
}

// Run bundler
bundle();
