require("dotenv").config();
const { Hono } = require("hono");
const pdfWritter = require("./pdf-writer");
const docxWritter = require("./docx-writter");
const { serve } = require("@hono/node-server");
const { writeFile } = require("fs/promises");
const path = require("path");
const exampleService = require("./services/example-service");
const converter = require("./converter");
const templateEngine = require("./template-engine");

const appPort = process.env.PORT || 3000;

console.info(
  `PUPPETEER_EXECUTABLE_PATH`,
  process.env.PUPPETEER_EXECUTABLE_PATH
);
console.info(`PDF_OUTPUT_DIR`, process.env.PDF_OUTPUT_DIR);

const app = new Hono();
app.get("/pdf", async (c) => {
  try {
    const { output = "binary" } = c.req.query();
    console.info(`executed pdfWritter with output as ${output}`);

    const response = await fetch("http://example.com/");
    const html = await response.text();

    const result = await pdfWritter.run(html);

    if (output === "file") {
      const outputDir = path.resolve(process.env.PDF_OUTPUT_DIR);
      await writeFile(path.join(outputDir, "generated_pdf.pdf"), result);
      return c.status(200);
    }

    c.header("Content-Type", "application/pdf");
    c.status(200);
    return c.body(result);
  } catch (error) {
    console.error(error);
    return c.status(500);
  }
});

app.get("/docx", async (c) => {
  try {
    const data = await exampleService.loopTableData();

    const templatePath = path.join(`${__dirname}/templates`, "loop-table.docx");
    console.info(`executed docx with data as ${JSON.stringify(data, null, 2)}`);
    console.info(`executed docx with templatePath ${templatePath}`);

    const result = await docxWritter.run(data, {
      templatePath,
    });

    c.header("Content-Type", "application/docx");
    c.status(200);
    return c.body(result);
  } catch (error) {
    console.error(error);
    return c.status(500);
  }
});

app.get("/docx-to-pdf", async (c) => {
  try {
    const data = await exampleService.loopTableData();

    const templatePath = path.join(`${__dirname}/templates`, "loop-table.docx");
    console.info(`executed docx with data as ${JSON.stringify(data, null, 2)}`);
    console.info(`executed docx with templatePath ${templatePath}`);

    const docxBuffer = await docxWritter.run(data, {
      templatePath,
    });

    const pdfBuffer = await converter.docxToPdf(docxBuffer);
    const outputDir = path.resolve(process.env.PDF_OUTPUT_DIR);
    await writeFile(path.join(outputDir, "docx_to_pdf.pdf"), pdfBuffer);
    await writeFile(path.join(outputDir, "docx_to_pdf.docx"), docxBuffer);

    c.header("Content-Type", "application/pdf");
    c.status(200);
    return c.body(pdfBuffer);
  } catch (error) {
    console.error(error);
    return c.status(500);
  }
});

app.get("/njk", async (c) => {
  try {
    const data = await exampleService.exampleWithNestedObjectData();

    const html = await templateEngine.nunjucksRender("table", {
      data,
    });

    c.status(200);
    return c.html(html);
  } catch (error) {
    console.error(error);
    return c.status(500);
  }
});

app.get("/njk-to-pdf", async (c) => {
  try {
    const data = await exampleService.exampleWithNestedObjectData();

    const html = await templateEngine.nunjucksRender("table", {
      data,
    });

    const pdfBuffer = await pdfWritter.run(html);

    const outputDir = path.resolve(process.env.PDF_OUTPUT_DIR);
    await writeFile(path.join(outputDir, "njk_to_pdf.pdf"), pdfBuffer);

    c.header("Content-Type", "application/pdf");
    c.status(200);
    return c.body(pdfBuffer);
  } catch (error) {
    console.error(error);
    return c.status(500);
  }
});

app.onError((error, c) => {
  console.error(error.cause);
  c.json({
    message: "error",
  });
  return c.status(500);
});

app.notFound((c) => {
  return c.status(404);
});

const server = serve(
  {
    fetch: app.fetch,
    port: appPort,
  },
  (r) => {
    console.info("server running on port ", r.port);
  }
);

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
