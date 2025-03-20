const glob = require('glob');
const { SCSS_FILES_PATH, importSass } = require('./_sass');


// Retrives every SASS file in project
const scssFiles = glob.sync(SCSS_FILES_PATH);
console.log(scssFiles);


const importData = scssFiles.map(scssFile => {
  const parts = scssFile.split(/[/\\]/); // Split path by '/' or '\'
  const scssIndex = parts.indexOf("scss");
  const appName = scssIndex > 0 ? parts[scssIndex - 1] : null; // Get the directory before "scss"
  
  return { scssFile, appName }; // Return an object with both values
});

console.log(importData);