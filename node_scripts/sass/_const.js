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
 * Path to the SCSS files
 * @type {string}
 */
const SCSS_FILES_PATH = `${SCSS_DIRS_PATH}/**/*.scss`;


module.exports = { 
  STATIC_PATH,
  SCSS_DIRS_PATH,
  CSS_DIRS_PATH,
  SCSS_FILES_PATH,
};