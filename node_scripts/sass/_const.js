/**
 * Path to static files
 * @type {string}
 */
const STATIC_PATH = 'project/static';

/**
 * Path to SCSS directories
 * @type {string}
 */
const SCSS_DIRS_PATH = `${STATIC_PATH}/*/scss`;

/**
 * Path to compiled CSS directories (Relitve to 'scss' directory)
 * @type {string}
 */
const CSS_DIRS_PATH = '../styles';

/**
 * Preambule at the top of each SCSS file
 * @type {string}
 */
const SASS_IMPORT = '@use "global_scss" as *;';

/**
 * Path to the SCSS files
 * @type {string}
 */
const SCSS_FILES_PATH = `${SCSS_DIRS_PATH}/**/*.scss`;

/**
 * Path to the global base SCSS
 * @type {string}
 */
const SCSS_GLOBAL_BASE = `${STATIC_PATH}/global/scss`


module.exports = { 
  STATIC_PATH,
  SCSS_DIRS_PATH,
  CSS_DIRS_PATH,
  SASS_IMPORT,
  SCSS_FILES_PATH,
  SCSS_GLOBAL_BASE,
};