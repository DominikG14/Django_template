/**
 * @fileoverview Const variables for sass compiling.
 * @version 1.1.0
 * @date 2025-14-04
 */ 

/**
 * Path to SCSS directories
 * @type {string}
 */
const SCSS_DIRS_PATH = `apps/**/scss`;

/**
 * Path to compiled CSS directories (Relitve to 'scss' directory)
 * @type {string}
 */
const CSS_DIRS_PATH = '../styles';

/**
 * Path to the SCSS files
 * @type {string}
 */
const SCSS_FILES_PATH = `${SCSS_DIRS_PATH}/**/*.scss`;


module.exports = { 
  SCSS_DIRS_PATH,
  CSS_DIRS_PATH,
  SCSS_FILES_PATH,
};