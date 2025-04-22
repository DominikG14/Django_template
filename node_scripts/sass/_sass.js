/**
 * @fileoverview Search functionality for locating *.scss files to watch and build.
 * @version 1.3.1
 * @date 2025-14-04
 */ 

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { 
  SCSS_FILES_PATH, 
  SCSS_DIRS_PATH, 
  CSS_DIRS_PATH, 
} = require('./_const');


/**
 * Generates an SCSS import statement for a given app.
 * @param {string} appName - The name of the app.
 * @returns {string} The SCSS import statement.
 */
function getAppScssImport(appName){
  return `@use "${appName}_scss" as *;`
}

/**
 * Constructs the SCSS directory path for a given app.
 * @param {string} appName - The name of the app.
 * @returns {string} The full SCSS directory path.
 */
function getAppScssDirPath(appName){
  return `apps/${appName}/static/${appName}/scss`
}

/**
 * Extracts SCSS file metadata, including the app name and whether it's the app specific SCSS file.
 * @param {string} scssFile - The full file path of the SCSS file.
 * @returns {Object} An object containing:
 *  - `path` {string}: The normalized file path.
 *  - `appName` {string}: The app name (directory before "scss")
 *  - `isAppScssFile` {boolean}: Whether the file is the app specific SCSS file.
 */
function getScssFileData(scssFile){
  const path = scssFile.replaceAll('\\', '/');
  const parts = path.split('/');
  
  const scssIndex = parts.indexOf("scss");
  const appName = scssIndex > 0 ? parts[scssIndex - 1] : null; // Get the directory before "scss"
  
  const appScss = getAppScssDirPath(appName) + `/${appName}_scss`;
  const isAppScssFile = path.includes(appScss);

  return { path, appName, isAppScssFile };
}

/**
 * Compiles SCSS to CSS
 * @param {string} scssDir - Path to the directory containing SCSS
 * @returns {void} No return value
 */
function compileScss(scssDir){
  const scssData = getScssFileData(scssDir);

  const globalScss = getAppScssDirPath('project');
  const appScss = getAppScssDirPath(scssData.appName);

  const stylesDir = path.join(scssData.path, CSS_DIRS_PATH);
  const command = `sass ${scssData.path}:${stylesDir} --load-path=${globalScss} --load-path=${appScss} --style=expanded --no-source-map`;
  exec(command);
}

/**
 * Starts watching and compiles SCSS to CSS at every change
 * @param {string} scssDir - Path to the app SCSS directory
 * @returns {void} No return value
 */
function watchScss(scssDir){
  const scssData = getScssFileData(scssDir);

  const globalScss = getAppScssDirPath('project');
  const appScss = getAppScssDirPath(scssData.appName);

  const stylesDir = path.join(scssData.path, CSS_DIRS_PATH);
  const command = `sass --watch ${scssData.path}:${stylesDir} --load-path=${globalScss} --load-path=${appScss} --style=expanded --no-source-map`;
  exec(command);
}

/**
 * Adds global and app SCSS files imports at the top of the file.
 * If the imports are already there leaves the file unchanged.
 * @param {string} scssFile - Path to the SCSS file
 * @returns {void} No return value
 */
function importScss(scssFile) {
  const scssData = getScssFileData(scssFile);

  // Do not add imports to global scss files
  if(scssData.appName === 'project') return;
  // Do not add imports to '_index.scss' files
  if(scssData.path.endsWith('_index.scss')) return;

  const globalImport = getAppScssImport('project');
  const appImport = getAppScssImport(scssData.appName);

  fs.readFile(scssData.path, 'utf8', (err, data) => {
    // Check if import is already at the top
    if (data.startsWith(globalImport)) return;

    // Combine the imports to be added with the current content
    let newData = `${globalImport}`;
    // If scss is an app specific, this prevents circular import
    if(!scssData.isAppScssFile) newData += `\n${appImport}`
    newData += `\n${data}`

    fs.writeFile(scssData.path, newData, 'utf8', (err) => {});
  });
}


module.exports = { 
  SCSS_FILES_PATH,
  SCSS_DIRS_PATH,
  CSS_DIRS_PATH,
  watchScss,
  compileScss,
  importScss,
};