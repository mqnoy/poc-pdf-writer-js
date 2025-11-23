const nunjucks = require("nunjucks");
const path = require("path");

const templatesPath = path.resolve(__dirname, "templates");
nunjucks.configure(templatesPath, {
  autoescape: true,
  noCache: true,
});

const nunjucksRender = async (templateName, context = {}) => {
  return new Promise((resolve, reject) => {
    nunjucks.render(`${templateName}.html`, context, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

module.exports = {
  nunjucksRender,
};
