const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  });
  const page = await browser.newPage();

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('isPassed', 'true');
    localStorage.setItem('anniversary-game-state', JSON.stringify({
      unlockedLevels: [1, 2],
      collectedLetters: []
    }));
    localStorage.removeItem('timeline-emoji-slots');
  });

  await page.goto('https://anniversary-website-mu.vercel.app/timeline', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 8000));

  const clues = ['火锅', '雪山', '撸猫', '跨越山海'];

  for (let i = 0; i < 4; i++) {
    const currentTitle = await page.$eval('h2', el => el.innerText).catch(() => 'unknown');
    console.log(`Chapter ${i + 1} title:`, currentTitle);

    const spans = await page.$$('span');
    let target = null;
    for (const span of spans) {
      const text = await span.evaluate(el => el.textContent);
      const cls = await span.evaluate(el => el.className);
      if (text && text.trim() === clues[i] && cls.includes('cursor-pointer')) {
        target = span;
        break;
      }
    }

    if (target) {
      await target.click();
      await new Promise(r => setTimeout(r, 1500));
      const slots = await page.evaluate(() => localStorage.getItem('timeline-emoji-slots'));
      console.log(`After clue ${i + 1} (${clues[i]}), slots:`, slots);
    } else {
      console.log(`Clue ${i + 1} (${clues[i]}) NOT FOUND`);
    }

    if (i < 3) {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const next = btns.find(b => b.textContent.includes('下一章'));
        if (next) next.click();
      });
      await new Promise(r => setTimeout(r, 2500));
    }
  }

  await new Promise(r => setTimeout(r, 2000));

  // Inspect 4th slot DOM
  const buttons = await page.$$('button');
  for (let i = 0; i < buttons.length; i++) {
    const parentDiv = await buttons[i].evaluate(el => el.parentElement?.parentElement?.textContent);
    if (parentDiv && parentDiv.includes('🔒') || parentDiv.includes('✈️')) {
      const disabled = await buttons[i].evaluate(el => el.disabled);
      const cls = await buttons[i].evaluate(el => el.className);
      const spanCls = await buttons[i].evaluate(el => el.querySelector('span')?.className);
      console.log(`Slot button found: disabled=${disabled}, class=${cls}, spanClass=${spanCls}`);
    }
  }

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Body contains 4 / 4?', bodyText.includes('4 / 4'));
  console.log('Body contains "所有槽位已激活"?', bodyText.includes('所有槽位已激活'));

  await browser.close();
})();
