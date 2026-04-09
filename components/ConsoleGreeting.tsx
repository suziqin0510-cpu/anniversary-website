'use client';

import { useEffect } from 'react';

export default function ConsoleGreeting() {
  useEffect(() => {
    const heart = `
    @@@@@@@     @@@@@@@
  @@@@@@@@@@@ @@@@@@@@@@@
 @@@@@@@@@@@@@@@@@@@@@@@@@
 @@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@
   @@@@@@@@@@@@@@@@@@@@@
    @@@@@@@@@@@@@@@@@@@
     @@@@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@
       @@@@@@@@@@@@@
        @@@@@@@@@@@
         @@@@@@@@@
          @@@@@@@
           @@@@@
            @@@
             @
    `;

    const styleHeart = `
      color: #E35D6A;
      font-family: monospace;
      font-size: 14px;
      line-height: 1.2;
      font-weight: bold;
    `;

    const styleText = `
      color: #E35D6A;
      font-size: 16px;
      font-weight: bold;
      padding: 4px 0;
    `;

    console.log(`%c${heart}`, styleHeart);
    console.log('%c"不管你翻看哪里，甚至在这个网站的代码最深处，我都写满了：苏子钦永远爱李丹。"', styleText);
  }, []);

  return null;
}
