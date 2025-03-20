const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { 
  STATIC_PATH,
  SCSS_FILES_PATH, 
  SCSS_DIRS_PATH, 
  CSS_DIRS_PATH, 
} = require('./_const');

function getAppScssImport(appName){
  return `@use "${appName}_scss" as *;`
}

function getAppScssDirPath(appName){
  return `${STATIC_PATH}/${appName}/scss`
}

function getAppData(scssFile){
  const parts = scssFile.split(/[/\\]/); // Split path by '/' or '\'
  const scssIndex = parts.indexOf("scss");
  const appName = scssIndex > 0 ? parts[scssIndex - 1] : null; // Get the directory before "scss"
  
  return { scssPath: scssFile, appName }; // Return an object with both values
}


/**
 * Compiles SCSS to CSS
 * @param {string} scssDir - Path to the directory containing SCSS
 * @returns {void} No return value
 */
function compileScss(scssDir){
  const { scssPath, appName } = getAppData(scssDir);

  const globalScss = getAppScssDirPath('global');
  const appScss = getAppScssDirPath(appName);

  const stylesDir = path.join(scssPath, CSS_DIRS_PATH);
  const command = `sass ${scssPath}:${stylesDir} --load-path=${globalScss} --load-path=${appScss} --style=expanded --no-source-map`;
  exec(command);
}

/**
 * Starts watching and compiles SCSS to CSS at every change
 * @param {string} scssDir - Path to the app SCSS directory
 * @param {string} appName - Name of the app
 * @returns {void} No return value
 */
function watchSass(scssDir){
  const { scssPath, appName } = getAppData(scssDir);

  const globalScss = getAppScssDirPath('global');
  const appScss = getAppScssDirPath(appName);

  const stylesDir = path.join(scssPath, CSS_DIRS_PATH);
  const command = `sass --watch ${scssPath}:${stylesDir} --load-path=${globalScss} --load-path=${appScss} --style=expanded --no-source-map`;
  exec(command);
}

/**
 * Adds global and app SCSS files imports at the top of the file.
 * If the imports are already there leaves the file unchanged.
 * @param {string} scssFile - Path to the SCSS file
 * @param {string} appName - Name of the app
 * @returns {void} No return value
 */
function importScss(scssFile) {
  const { scssPath, appName } = getAppData(scssFile);

  // Do not add imports to global scss files
  if(appName === 'global') return;

  const globalImport = getAppScssImport('global');
  const appImport = getAppScssImport(appName);

  fs.readFile(scssPath, 'utf8', (err, data) => {
    // Check if import is already at the top
    if (data.startsWith(globalImport)) return;

    // Combine the imports to be added with the current content
    const newData = `${globalImport}\n${appImport}\n${data}`;
    fs.writeFile(scssPath, newData, 'utf8', (err) => {});
  });
}


module.exports = { 
  STATIC_PATH,
  SCSS_FILES_PATH,
  SCSS_DIRS_PATH,
  CSS_DIRS_PATH,
  watchSass,
  compileScss,
  importScss,
};