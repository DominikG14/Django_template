/**
 * @fileoverview Starts watching and compiles upon change all non partial '*.scss' files in the project into css
 * @version 1.0.0
 * @date 2025-03-10
 */ 


const glob = require('glob');
const { SCSS_DIRS_PATH, watchScss } = require('./_sass');


// Retrives every SASS directory in project
const scssDirs = glob.sync(SCSS_DIRS_PATH);

// Starts watching each retrived SCSS file for changes
scssDirs.forEach((scssDir) => watchScss(scssDir));