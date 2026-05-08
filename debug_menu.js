const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  
  await page.goto('file:///c:/Users/daniel/Desktop/xavales00/index.html');
  await page.waitForTimeout(4500); // Wait for splash to finish
  
  // Scroll to Integrantes
  const integrantes = await page.locator('#integrantes');
  await integrantes.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  // Click hamburger
  await page.click('#hamburger');
  await page.waitForTimeout(500);
  
  // Evaluate the stacking context and dimensions
  const dump = await page.evaluate(() => {
    const navLinks = document.getElementById('nav-links');
    const memberCard = document.querySelector('.member-card');
    const main = document.getElementById('main-content');
    
    const getStyles = (el) => {
      const s = window.getComputedStyle(el);
      return {
        zIndex: s.zIndex,
        position: s.position,
        display: s.display,
        opacity: s.opacity,
        transform: s.transform,
        backdropFilter: s.backdropFilter,
        isolation: s.isolation,
        mixBlendMode: s.mixBlendMode
      };
    };
    
    return {
      navLinks: {
        rect: navLinks.getBoundingClientRect(),
        styles: getStyles(navLinks),
        classList: Array.from(navLinks.classList)
      },
      memberCard: {
        rect: memberCard.getBoundingClientRect(),
        styles: getStyles(memberCard)
      },
      main: {
        rect: main.getBoundingClientRect(),
        styles: getStyles(main)
      }
    };
  });
  
  console.log(JSON.stringify(dump, null, 2));
  
  // Take a screenshot
  await page.screenshot({ path: 'test_menu.png' });
  
  await browser.close();
})();
