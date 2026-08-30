const { chromium } = require("/home/user/.npm/_npx/e41f203b7505f1fb/node_modules/playwright");
const fs=require("fs");
const SP="/tmp/claude-1000/-home-user-projects-agency-website/c690fc4e-fb42-44ce-875c-f757bbd08de5/scratchpad";
const svg=fs.readFileSync(SP+"/user-logo-raw.svg","utf8");
(async()=>{
  const b=await chromium.launch({executablePath:"/home/user/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome"});
  const p=await b.newPage();
  await p.setContent(`<body style="margin:0">${svg}</body>`);
  await p.waitForTimeout(200);
  const bb=await p.evaluate(()=>{
    const s=document.querySelector("svg");
    // union bbox of all rendered geometry
    let x1=1e9,y1=1e9,x2=-1e9,y2=-1e9;
    s.querySelectorAll("path,rect,circle,polygon,ellipse,line,text").forEach(el=>{
      try{const bb=el.getBBox(); if(bb.width||bb.height){x1=Math.min(x1,bb.x);y1=Math.min(y1,bb.y);x2=Math.max(x2,bb.x+bb.width);y2=Math.max(y2,bb.y+bb.height);}}catch(e){}
    });
    return {x1,y1,x2,y2,w:x2-x1,h:y2-y1,vb:s.getAttribute("viewBox")};
  });
  console.log(JSON.stringify(bb,null,2));
  await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
