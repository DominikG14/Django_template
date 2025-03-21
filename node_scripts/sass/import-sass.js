/**
 * @fileoverview Adds import statement for global scss styles to appropriate *.scss files in project.
 * @version 1.1.0
 * @date 2025-03-20
 */ 


const glob = require('glob');
const { SCSS_FILES_PATH, importScss } = require('./_sass');


// Retrives every SASS file in project
const scssFiles = glob.sync(SCSS_FILES_PATH);

// Adds preambule at the top of each retrived file if it's not already there
scssFiles.forEach(scssFile => importScss(scssFile));