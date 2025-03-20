// WARNING! THIS SCRIPT IS CURRENTY NOT USED!
/* 
# Why it's not used?

This script only handles files within 'scss' directory.
If there are additional directories within 'scss' one, that
contain scss for compiling, they ARE NOT prefixed with preambule.
*/

/**
 * @fileoverview Adds preambule for importing global base scss styles to all non partial *.scss files in project.
 * @version 1.1.0
 * @date 2025-03-20
 */ 


const glob = require('glob');
const { SCSS_FILES_PATH, importScss } = require('./_sass');


// Retrives every SASS file in project
const scssFiles = glob.sync(SCSS_FILES_PATH);


// Adds preambule at the top of each retrived file if it's not already there
scssFiles.forEach(scssFile => importScss(scssFile));