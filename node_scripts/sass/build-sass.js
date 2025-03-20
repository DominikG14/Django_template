/**
 * @fileoverview Compiles all non partial '*.scss' files in the project into css
 * @version 1.0.0
 * @date 2025-03-10
 */ 


const glob = require('glob');
const { SCSS_DIRS_PATH, compileScss } = require('./_sass');


// Retrives every SASS directory in project
const scssDirs = glob.sync(SCSS_DIRS_PATH);
console.log(scssDirs)

// Compiles each retrived SCSS file to CSS
scssDirs.forEach((scssDir) => compileScss(scssDir));