const libre = require("libreoffice-convert");
const util = require("util");

libre.convert = util.promisify(libre.convert);

/**
 *
 * @param {Buffer} docxBuf
 * @returns
 */
const docxToPdf = async (docxBuf) => {
  try {
    const pdfBuf = libre.convert(docxBuf, ".pdf", undefined);
    return pdfBuf;
  } catch (error) {
    console.error("docxToPdf error:", error);
    throw error;
  }
};

module.exports = {
  docxToPdf,
};
