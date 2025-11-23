const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const run = async (data = {}, options = { templatePath: "" }) => {
  try {
    const { templatePath } = options;

    const content = fs.readFileSync(templatePath);
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(data);

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    return buffer;
  } catch (error) {
    console.error("Template error:", error);
    throw error;
  }
};

module.exports = {
  run,
};
