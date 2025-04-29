import { generate } from 'openapi-typescript-codegen';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = 'http://localhost:8000/api/v1/openapi.json';
const OUTPUT_DIR = resolve(__dirname, '../src/lib/api');

async function generateApi() {
  try {
    await generate({
      input: API_URL,
      output: OUTPUT_DIR,
      httpClient: 'fetch',
      useOptions: true,
      useUnionTypes: true,
      exportSchemas: true
    });
    console.log('✅ API types generated successfully');
  } catch (error) {
    console.error('❌ Error generating API types:', error);
    process.exit(1);
  }
}

generateApi(); 