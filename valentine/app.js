const $=id=>document.getElementById(id);
const presets={standard:{w:1600,h:1200,label:'4:3 • Standard'},portrait:{w:1080,h:1350,label:'4:5 • Instagram Portrait'},story:{w:1080,h:1920,label:'9:16 • Story / Status'},square:{w:1080,h:1080,label:'1:1 • Square'},print:{w:2550,h:3300,label:'8.5 × 11 in • Print'}};
const themes={rose:{bg:'#f9d9dc',dark:'#81384d',accent:'#d85270',paper:'#fff8f4',leaf:'#7b9d77'},night:{bg:'#30334f',dark:'#f8e9d9',accent:'#df7594',paper:'#f6ebe2',leaf:'#a3c3a0'},peach:{bg:'#f5c5ac',dark:'#704354',accent:'#bd5d63',paper:'#fff8ef',leaf:'#7a9a76'},meadow:{bg:'#d7e1cf',dark:'#38554a',accent:'#bd5969',paper:'#fffdf6',leaf:'#65886a'}};
let theme='rose',pdfMode='digital';
function value(id){return $(id).value.trim()}
function fitText(ctx,text,maxWidth,start,min){let size=start;ctx.font=`${size}px Playfair Display`;while(ctx.measureText(text).width>maxWidth&&size>min){size-=2;ctx.font=`${size}px Playfair Display`}return size}
function wrap(ctx,text,maxWidth){const out=[];let line='';for(const word of text.split(/\s+/)){const attempt=line?line+' '+word:word;if(ctx.measureText(attempt).width<=maxWidth||!line)line=attempt;else{out.push(line);line=word}}if(line)out.push(line);return out}
function drawCard(canvas,w,h){canvas.width=w;canvas.height=h;const c=canvas.getContext('2d'),t=themes[theme],safe=Math.round(Math.min(w,h)*.08),scale=Math.min(w/1600,h/1200);c.fillStyle=t.bg;c.fillRect(0,0,w,h);
  // organic backdrop
  c.globalAlpha=.4;c.fillStyle=t.paper;c.beginPath();c.ellipse(w*.84,h*.13,w*.33,h*.34,-.4,0,7);c.fill();c.beginPath();c.ellipse(w*.06,h*.92,w*.32,h*.28,.4,0,7);c.fill();c.globalAlpha=1;
  c.strokeStyle=t.accent;c.globalAlpha=.3;c.lineWidth=3*scale;c.beginPath();c.arc(w*.05,h*.15,52*scale,0,Math.PI*1.7);c.stroke();c.globalAlpha=1;
  // floral dots
  for(let i=0;i<19;i++){const x=(i*173%w),y=(i*311%h);if(x>safe&&x<w-safe&&y>safe&&y<h-safe)continue;c.fillStyle=i%2?t.accent:t.leaf;c.globalAlpha=.32;c.beginPath();c.arc(x,y,(6+i%5)*scale,0,7);c.fill()}c.globalAlpha=1;
  const cx=w/2;let to=value('recipient')||'You';c.textAlign='center';c.fillStyle=t.dark;c.font=`600 ${Math.max(28,fitText(c,to,w-safe*2,106*scale,28))}px 'Playfair Display'`;c.fillText(to,cx,h*.23);
  c.fillStyle=t.accent;c.font=`${35*scale}px serif`;c.fillText('♥',cx,h*.33);
  const msg=value('message')||'A little note, just for you.';c.fillStyle=t.dark;c.font=`500 ${42*scale}px 'DM Sans'`;let lines=wrap(c,msg,w-safe*2);let font=42*scale;while(lines.length*font*1.5>h*.34&&font>18*scale){font-=2*scale;c.font=`500 ${font}px 'DM Sans'`;lines=wrap(c,msg,w-safe*2)};const start=h*.47-(lines.length-1)*font*.75;lines.forEach((l,i)=>c.fillText(l,cx,start+i*font*1.5));
  c.strokeStyle=t.accent;c.lineWidth=2*scale;c.globalAlpha=.5;c.beginPath();c.moveTo(cx-55*scale,h*.73);c.lineTo(cx+55*scale,h*.73);c.stroke();c.globalAlpha=1;c.font=`italic 600 ${36*scale}px 'Playfair Display'`;c.fillText('with love,',cx,h*.81);c.font=`600 ${47*scale}px 'Playfair Display'`;c.fillText(value('sender')||'Someone special',cx,h*.87);
}
function render(){const p=presets[value('size')];drawCard($('preview'),p.w,p.h);$('previewSize').textContent=p.label;$('count').textContent=$('message').value.length+' / 500'}
function sanitize(name){return name.toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')}
function filename(ext){const n=sanitize(value('recipient'));return `valentine-card${n?'-'+n:''}.${ext}`}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function canvasBlob(canvas,type,quality){return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Image conversion failed')),type,quality))}
async function exportCard(){const button=$('download'),status=$('status'),format=value('format'),p=presets[value('size')];status.textContent='';button.disabled=true;button.textContent='Rendering your card…';try{if(!window.HTMLCanvasElement)throw Error('Canvas is unavailable');const canvas=document.createElement('canvas');drawCard(canvas,p.w,p.h);
  if(format==='png'){downloadBlob(await canvasBlob(canvas,'image/png'),filename('png'))}
  else if(format==='jpeg'){downloadBlob(await canvasBlob(canvas,'image/jpeg',Number(value('quality'))),filename('jpg'))}
  else {if(!window.jspdf)throw Error('PDF library unavailable');const print=pdfMode==='print';const source=print&&value('size')!=='print'?Object.assign(document.createElement('canvas'),{}):canvas;if(print&&value('size')!=='print')drawCard(source,2550,3300);const img=source.toDataURL('image/jpeg',.98),{jsPDF}=window.jspdf;const pdf=new jsPDF({orientation:print?'portrait':(p.w>p.h?'landscape':'portrait'),unit:'in',format:print?'letter':[p.w/160,p.h/160]});const pw=print?8.5:p.w/160,ph=print?11:p.h/160,ratio=source.width/source.height;let dw=pw,dh=dw/ratio;if(dh>ph){dh=ph;dw=dh*ratio}pdf.addImage(img,'JPEG',(pw-dw)/2,(ph-dh)/2,dw,dh,undefined,'FAST');pdf.save(filename('pdf'))}
  status.textContent='Your card is on its way!';status.style.color='#71906e';
}catch(e){console.error(e);status.style.color='';status.textContent='Something went wrong while exporting your card. Please try again.'}finally{setTimeout(()=>{button.disabled=false;updateExportUI()},400)}}
function updateExportUI(){const f=value('format');$('qualityField').hidden=f!=='jpeg';$('pdfType').hidden=f!=='pdf';$('download').textContent='↓  Download '+({png:'PNG',jpeg:'JPEG',pdf:'PDF'}[f])}
document.querySelectorAll('input,textarea,select').forEach(el=>el.addEventListener('input',()=>{render();updateExportUI()}));document.querySelectorAll('.swatch').forEach(b=>b.addEventListener('click',()=>{theme=b.dataset.theme;document.querySelector('.swatch.active').classList.remove('active');b.classList.add('active');render()}));document.querySelectorAll('.pdf-choice').forEach(b=>b.addEventListener('click',()=>{pdfMode=b.dataset.pdf;document.querySelector('.pdf-choice.active').classList.remove('active');b.classList.add('active')}));$('download').addEventListener('click',exportCard);render();updateExportUI();
