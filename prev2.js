const { chromium } = require("/home/user/.npm/_npx/e41f203b7505f1fb/node_modules/playwright");
const fs=require("fs");
const SP="/tmp/claude-1000/-home-user-projects-agency-website/c690fc4e-fb42-44ce-875c-f757bbd08de5/scratchpad";
const svg=fs.readFileSync(SP+"/devliora-logo-fixed.svg","utf8");
const b64=Buffer.from(svg).toString("base64");
(async()=>{
  const br=await chromium.launch({executablePath:"/home/user/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome"});
  const p=await br.newPage({viewport:{width:560,height:220}});
  await p.setContent(`<div style="font-family:system-ui">
    <div style="background:#F2F0EC;padding:22px 34px"><img src="data:image/svg+xml;base64,${b64}" style="height:40px"></div>
    <div style="background:#0E1420;padding:22px 34px"><img src="data:image/svg+xml;base64,${b64}" style="height:36px"></div>
  </div>`);
  await p.waitForTimeout(300);
  await p.screenshot({path:SP+"/logo-fixed-preview.png"});
  await br.close();
})().catch(e=>{console.error(e);process.exit(1)});
