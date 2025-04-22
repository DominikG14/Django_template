/**
 * @fileoverview Utility functions for handling CSS custom properties and toggling color schemes (light/dark)
 * based on session-stored user preference.
 *
 * @version 1.0.0
 * @date 2025-04-16
 */


/**
 * An object representing available color scheme options.
 * Used for toggling UI themes between light, dark, or a session-stored preference.
 * @typedef {Object}
 * @property {string} SESSION - Represents session storage key
 * @property {string} LIGHT - Represents the light color scheme.
 * @property {string} DARK - Represents the dark color scheme.
 */
const COLOR_SCHEME = {
  SESSION: 'color-scheme-session',
  LIGHT: 'light',
  DARK: 'dark',
}

/**
 * Checks if a stylesheet is from the same domain.
 * Inline styles (no href) are assumed to be same-domain.
 * @param {CSSStyleSheet} styleSheet
 * @returns {boolean}
 */
function isSameDomain(styleSheet){
  if (!styleSheet.href) {
    return true;
  }

  return styleSheet.href.indexOf(window.location.origin) === 0;
};

/**
 * Checks if a CSS rule is a style rule.
 * @param {CSSRule} rule
 * @returns {boolean}
 */
function isStyleRule(rule){
  return rule instanceof CSSStyleRule;
}

/**
 * Checks if a CSS property is a custom property (CSS variable).
 * @param {string} property
 * @returns {boolean}
 */
function isCustomProp(property){
  return property.startsWith('--');
}

/**
 * Extracts all CSS custom properties (CSS variables) and their values
 * from all stylesheets in the document that are from the same domain.
 * @returns {Array<[string, string]>} Array of [propertyName, propertyValue]
 */
function getCSSCustomPropIndex() {
  return Array.from(document.styleSheets)
    .filter(isSameDomain)
    .flatMap(sheet =>
      Array.from(sheet.cssRules)
        .filter(isStyleRule)
        .flatMap(rule =>
          Array.from(rule.style)
            .filter(isCustomProp)
            .map(prop => [prop, rule.style.getPropertyValue(prop).trim()])
        )
    );
}

/**
 * Switches CSS variable references from dark to light or vice versa
 * based on the session-stored color scheme.
 * @param {string} propValue
 * @returns {string}
 */
function switchPropColorScheme(propValue){
  const colorScheme = sessionStorage.getItem(COLOR_SCHEME.SESSION);
  switch(colorScheme){
    case COLOR_SCHEME.DARK:
      return propValue.replace(`--${COLOR_SCHEME.DARK}`, `--${COLOR_SCHEME.LIGHT}`);
    
    case COLOR_SCHEME.LIGHT:
      return propValue.replace(`--${COLOR_SCHEME.LIGHT}`, `--${COLOR_SCHEME.DARK}`);
  }
}

/**
 * Checks if a property name includes a color scheme modifier like `--dark` or `--light`.
 * Ignores root-level variables like `--color-primary`.
 * @param {string} styleName
 * @returns {boolean}
 */
function isColorSchemeProp(styleName){
  return styleName.indexOf('--', 1) !== -1;
}

/**
 * Changes the document’s CSS custom properties according to the stored color scheme.
 * It dynamically replaces values that use `--dark` or `--light` references.
 */
function changeColorScheme(){
  const colorSchemeProperties =  getCSSCustomPropIndex();

  colorSchemeProperties.forEach(property => {
    let [propertyName, propValue] = property;
    if( isColorSchemeProp(propertyName) ) return;

    propValue = switchPropColorScheme(propValue);
    document.documentElement.style.setProperty(propertyName, propValue);
  });
}

export {
  COLOR_SCHEME,
  changeColorScheme,
}