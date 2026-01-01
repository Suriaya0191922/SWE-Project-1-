import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("=== 1. SWAGGER.JS LOADED ===");
console.log("__dirname:", __dirname);
console.log("Project root:", process.cwd());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Virtual Thrift Store API",
      version: "1.0.0",
      description: "API documentation for Virtual Thrift Store",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.join(__dirname, 'routes', '*.js')],  // FIXED: scans backend/src/routes/*.js
};

console.log("=== 2. Generating Swagger spec from routes... ===");
const swaggerSpec = swaggerJsDoc(options);

console.log("=== 3. RESULTS ===");
console.log("Paths found:", Object.keys(swaggerSpec.paths || {}).length);
if (swaggerSpec.paths) {
  console.log("Path endpoints:", Object.keys(swaggerSpec.paths));
} else {
  console.log("ERROR: No paths object generated!");
}
console.log("Swagger ready!");

export { swaggerUi, swaggerSpec };
