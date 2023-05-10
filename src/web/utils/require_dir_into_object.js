const path = require("path");
const fs = require("fs");

const require_dir_into_object = (dirPath) => {
  if (!dirPath || typeof dirPath !== "string")
    throw Error("Directory path must be a valid dir path [string]");

  const Files = {};
  fs.readdirSync(dirPath).forEach((file) => {
    const [fileName, fileExtension] = file.split(".");
    if (
      typeof fileName === "string" &&
      fileName !== "index" &&
      fileExtension === "js"
    ) {
      try {
        console.log(fileName, file);
        Files[fileName] = require(path.join(dirPath, `./${fileName}`));
      } catch (error) {
        console.warn("WARN", error.message);
      }
    }
  });

  return Files;
};

module.exports = require_dir_into_object;