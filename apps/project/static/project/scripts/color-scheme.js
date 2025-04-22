/**
 * @fileoverview Script for switching between color schemes
 * @version 1.0.0
 * @date 2025-16-04
 */ 


import { COLOR_SCHEME, changeColorScheme } from './color-scheme/utils.js';


// Set user preferences based on system default style
if(!sessionStorage.getItem(COLOR_SCHEME.SESSION)){
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const colorScheme = prefersDark ? COLOR_SCHEME.DARK : COLOR_SCHEME.LIGHT;
  sessionStorage.setItem(COLOR_SCHEME.SESSION, colorScheme);
}
changeColorScheme();


document.addEventListener('click', event => {
  if( !event.target.hasAttribute('data-switch-color-scheme') ) return;

  const colorScheme = sessionStorage.getItem(COLOR_SCHEME.SESSION);

  switch(colorScheme){
    case COLOR_SCHEME.DARK:
      sessionStorage.setItem(COLOR_SCHEME.SESSION, COLOR_SCHEME.LIGHT);
      break;
    
    case COLOR_SCHEME.LIGHT:
      sessionStorage.setItem(COLOR_SCHEME.SESSION, COLOR_SCHEME.DARK);
      break;
  }

  changeColorScheme();
});