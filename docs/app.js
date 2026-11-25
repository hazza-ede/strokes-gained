
// ================= data & settings =================
const CATS=[['ott','Driving'],['app','Approach'],['atg','Short game'],['putt','Putting']];
const LIES_TEE=[['fairway','Fairway'],['rough','Rough'],['sand','Bunker'],['recovery','Trees'],['green','Green']];
const LIES_ATG=[['fairway','Fringe / fairway'],['rough','Rough'],['sand','Bunker']];
const CLUBS=[['driver','Driver'],['3wood','3 wood'],['hybrid','Hybrid'],['longiron','Long iron'],['iron','Mid iron']];
const BAG=[['driver','Driver'],['3wood','3 wood'],['5wood','5 wood'],['hybrid','Hybrid'],['4i','4 iron'],['5i','5 iron'],['6i','6 iron'],['7i','7 iron'],['8i','8 iron'],['9i','9 iron'],['pw','Pitching wedge'],['gw','Gap wedge'],['sw','Sand wedge'],['lw','Lob wedge']];
const TEE_TO_BAG={driver:'driver','3wood':'3wood',hybrid:'hybrid',longiron:'4i',iron:'7i'};
const CLUB_RATIO={driver:1,'3wood':.92,'5wood':.87,hybrid:.84,'4i':.8,'5i':.76,'6i':.72,'7i':.68,'8i':.64,'9i':.6,pw:.55,gw:.5,sw:.44,lw:.38};
const CONDS=[['windy','Windy'],['wet','Wet'],['cold','Cold']];
const PUTT_M=[0.5,1,1.5,2,2.5,3,4,5,6,8,10,12,15,20];
const PUTT_FT=[1,2,3,4,5,6,8,10,12,15,20,25,30,40,50,60];
const ATG_CH=[2,4,6,8,10,12,15,20,25,30];
const TYPICAL_LEN={3:150,4:360,5:470};
const PARS9=[4,4,3,5,4,4,3,4,5];
const FT=0.3048, YD=0.9144;

function ex(n,par,len,o){ return Object.assign({n,par,len,score:null,putts:null,fp:null,teeLie:null,teeDist:null,teePen:'none',teeClub:null,atg:false,atgLie:null,atgDist:null,atgShots:1,penOther:0,unsure:[]},o); }
const EXAMPLE_ROUND={ id:'example', example:true, date:'2026-11-21', course:'Example course (sample data)', holes:[
  ex(1,4,365,{score:4,putts:2,fp:8,teeLie:'fairway',teeDist:135}),
  ex(2,3,155,{score:4,putts:2,fp:3,atg:true,atgLie:'sand',atgDist:12}),
  ex(3,5,480,{score:6,putts:2,fp:2,teeLie:'rough',teeDist:230,atg:true,atgLie:'rough',atgDist:15}),
  ex(4,4,390,{score:5,putts:3,fp:12,teeLie:'fairway',teeDist:150}),
  ex(5,4,340,{score:5,putts:2,fp:4,teeLie:'sand',teeDist:120,atg:true,atgLie:'fairway',atgDist:20}),
  ex(6,3,170,{score:3,putts:2,fp:6}),
  ex(7,4,410,{score:6,putts:1,fp:1.5,teeLie:'rough',teeDist:170,teePen:'drop',atg:true,atgLie:'rough',atgDist:10}),
  ex(8,5,505,{score:5,putts:1,fp:1,teeLie:'fairway',teeDist:260,atg:true,atgLie:'fairway',atgDist:25}),
  ex(9,4,375,{score:4,putts:2,fp:5,teeLie:'fairway',teeDist:140}),
  ex(10,4,400,{score:5,putts:2,fp:2.5,teeLie:'rough',teeDist:165,atg:true,atgLie:'sand',atgDist:8}),
  ex(11,3,140,{score:3,putts:2,fp:9}),
  ex(12,5,495,{score:6,putts:3,fp:15,teeLie:'fairway',teeDist:245}),
  ex(13,4,355,{score:3,putts:1,fp:3,teeLie:'fairway',teeDist:125}),
  ex(14,4,420,{score:6,putts:2,fp:3,teeLie:'recovery',teeDist:190,atg:true,atgLie:'rough',atgDist:18}),
  ex(15,4,330,{score:4,putts:2,fp:7,teeLie:'fairway',teeDist:110}),
  ex(16,3,185,{score:4,putts:2,fp:2,atg:true,atgLie:'rough',atgDist:10}),
  ex(17,5,470,{score:5,putts:2,fp:10,teeLie:'fairway',teeDist:225}),
  ex(18,4,385,{score:5,putts:1,fp:1,teeLie:'rough',teeDist:160,atg:true,atgLie:'fairway',atgDist:15})
]};

function lsGet(k,d){ try{ const v=localStorage.getItem(k); return v==null?d:JSON.parse(v);}catch(e){return d;} }
function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }

const S={
  view:'home', tab:'home',
  mode:lsGet('sg.mode','quick'), putUnit:lsGet('sg.putunit','m'), fullUnit:lsGet('sg.fullunit','m'),
  smart:lsGet('sg.smart',true), clubs:lsGet('sg.clubs',false), assumeOn:lsGet('sg.assumeOn',true),
  bag:lsGet('sg.bag',{}), goals:lsGet('sg.goals',{sets:[],focus:[]}), plan:lsGet('sg.plan',{mins:45,places:['range','green']}), toughOut:lsGet('sg.toughOut',false), statsWho:'me', statsTab:'overview', planSeed:lsGet('sg.planSeed',1),
  hcp:lsGet('sg.hcp',null), goal:lsGet('sg.goal',null),
  base:(b=>['me','goal','0','tour'].includes(b)?b:'me')(lsGet('sg.base','me')),
  rounds:lsGet('sg.rounds',[]), courses:lsGet('sg.courses',[]),
  round:lsGet('sg.draft',null), idx:0, openExact:{}, talk:lsGet('sg.talk',''), busy:false, talkErr:'',
  setup:null, confirmDel:false, viewing:null, saveMsg:'', editHole:false, scrollTo:null,
  statsCourse:null, mates:null, matesState:'idle', sharing:false, names:{}, shareImg:null, shareMsg:'',
  cad:{blob:null,url:null,dist:'',note:'',busy:false,res:null,err:''}
};
// Web build: Supabase holds accounts and data; Claude features are off until an API backend exists.
let sb=null, uid=null, me={email:'',name:''}, sample=null, dict=null, downloads=null, listening=false, partial='';
const CONFIGURED=!!(window.SG_CONFIG&&/^https:\/\//.test(window.SG_CONFIG.supabaseUrl||'')&&window.SG_CONFIG.supabaseAnonKey&&!/YOUR_/.test(window.SG_CONFIG.supabaseAnonKey));

// ================= helpers =================
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f1=v=>(v>0.049?'+':v<-0.049?'−':'')+Math.abs(v).toFixed(1);
const f2=v=>(v>0.004?'+':v<-0.004?'−':'')+Math.abs(v).toFixed(2);
const cls=v=>v>0.05?'pos':v<-0.05?'neg':'';
const fmtDate=d=>{ try{ return new Date(d+'T12:00:00').toLocaleDateString('en-AU',{day:'numeric',month:'short',year:'numeric'});}catch(e){return d;} };
const shortDate=d=>{ try{ return new Date(d+'T12:00:00').toLocaleDateString('en-AU',{day:'numeric',month:'short'});}catch(e){return d;} };
const today=()=>{ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
const hole=()=>S.round.holes[S.idx];
function saveDraft(){ lsSet('sg.draft',S.round); lsSet('sg.draftAt',Date.now()); }
const realRounds=()=>S.rounds.filter(r=>!r.example);
function allRounds(){ const list=[...realRounds()]; list.sort((a,b)=>(b.date||'').localeCompare(a.date||'')||(b.id||'').localeCompare(a.id||'')); return list.length?list:[EXAMPLE_ROUND]; }
const chrono=rs=>[...rs].sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.id||'').localeCompare(b.id||''));

// ----- units: everything is stored in metres; feet and yards are display and entry choices -----
const isYd=()=>S.fullUnit==='yd', isFt=()=>S.putUnit==='ft';
const fullU=()=>isYd()?'yd':'m', puttU=()=>isFt()?'ft':'m';
function toShow(field,m){ if(m==null||m==='') return m; m=Number(m); if(field==='fp') return isFt()?Math.round(m/FT*10)/10:m; return isYd()?Math.round(m/YD):Math.round(m*10)/10; }
function toStore(field,v){ if(v==null||v==='') return null; v=Number(v); if(isNaN(v)) return null; if(field==='fp') return isFt()?Math.round(v*FT*100)/100:v; if(['teeDist','atgDist','len'].includes(field)) return isYd()?Math.round(v*YD*10)/10:v; return v; }
const lenShow=m=>isYd()?Math.round(Number(m)/YD):Math.round(Number(m));

// ----- handicaps: "+2.1" is stored as -2.1 -----
function parseHcp(v){ if(v==null) return null; v=String(v).trim(); if(!v) return null; const plus=v.startsWith('+'); const n=parseFloat(v.replace('+','')); if(isNaN(n)) return null; const h=plus?-Math.abs(n):n; return Math.max(-10,Math.min(54,Math.round(h*10)/10)); }
const fmtHcp=h=>h==null||h===''?'':(Number(h)<0?'+'+Math.abs(h).toFixed(1):Number(h).toFixed(1));
function myHcp(r){ return r&&r.hcp!=null&&!r.example ? r.hcp : (S.hcp!=null?S.hcp:10); }
function goalHcp(){ return S.goal!=null?S.goal:Math.round((S.hcp!=null?S.hcp:10)-2); }
function resolveBase(b,r){ if(b==='me') return String(myHcp(r)); if(b==='goal') return String(goalHcp()); return b; }
function baseText(b,r){ if(b==='me') return `your ${fmtHcp(myHcp(r))} handicap`; if(b==='goal') return `your goal of ${fmtHcp(goalHcp())}`; if(b==='tour') return 'the PGA Tour'; return 'a scratch golfer'; }
function baseShort(b,r){ return b==='me'?'your '+fmtHcp(myHcp(r)):b==='goal'?'goal '+fmtHcp(goalHcp()):b==='tour'?'PGA Tour':'scratch'; }
const rsg=(r,b)=>roundSG(r,resolveBase(b,r));
const hsg=h=>holeSG(assumeHole(h,myHcp(S.round)).h,resolveBase(S.base,S.round));
// For trends a fixed benchmark is used, so a falling handicap does not hide improvement.
const fixedBase=()=>S.base==='me'?String(myHcp(null)):resolveBase(S.base,null);

// ================= analysis =================
function puttBucket(m){ const [a,b]=isFt()?[6*FT,20*FT]:[2,6]; return m<a?'short':m<=b?'mid':'long'; }
function appBucket(m){ const t=isYd()?[100*YD,150*YD,200*YD]:[100,150,200]; return m<t[0]?'app-100':m<=t[1]?'app-150':m<=t[2]?'app-200':'app-200p'; }
function moverInfo(k){
  const u=fullU(), f=isFt();
  return {
    'putt-short':[f?'Putts inside 6 ft':'Putts inside 2 m',`Gate drill: two tees just wider than the ball, 50 putts from ${f?'3–6 ft':'1–2 m'} before each round.`],
    'putt-mid':[f?'Putts from 6–20 ft':'Putts from 2–6 m',`Ladder drill at ${f?'6, 12 and 18 ft':'2, 4 and 6 m'}. Commit to a start line and stay at each distance until you hole 7 of 10.`],
    'putt-long':[f?'Lag putts over 20 ft':'Lag putts over 6 m',`Speed work: putt from ${f?'30, 45 and 60 ft':'10, 15 and 20 m'} and try to finish every ball within ${f?'3 ft':'a metre'} past the hole.`],
    'app-100':[`Approaches inside 100 ${u}`,'Build a wedge chart: three swing lengths with each wedge, ten balls each, and write down the carries.'],
    'app-150':[`Approaches from 100–150 ${u}`,`On the range, call a target at 110, 130 or 150 ${u} before each ball and score how many finish within 10 ${u}.`],
    'app-200':[`Approaches from 150–200 ${u}`,'Aim at the middle of the green, not the flag, and take enough club to get there.'],
    'app-200p':[`Long approaches over 200 ${u}`,'Lay up to your favourite wedge distance instead of forcing a long club.'],
    'atg-sand':['Bunker shots','Line drill: draw a line in the sand and practise hitting the sand on or just behind it, 20 in a row.'],
    'atg-rough':['Chips from the rough','Pick a landing spot and use more loft; the ball will come out with less spin and run.'],
    'atg-fw':['Chips from the fringe and fairway','Putt or bump-and-run whenever you can, landing the ball just onto the green.'],
    'ott-pen':['Penalties off the tee','On tight holes hit the club that stays in play. A 3-wood in the fairway beats a driver out of bounds.'],
    'ott-trouble':['Tee shots into bunkers and trees','Pick a target line that keeps your usual miss away from trouble.'],
    'ott-rough':['Missed fairways','Range game: alternate between two fairway targets 30 m apart and count how many you hit.'],
    'ott-fw':['Driving distance','You find fairways but lose ground on length. Regular speed training adds distance over time.']
  }[k];
}
function needleMovers(rounds){
  const acc={}; let holes=0, total=0;
  const add=(k,v)=>{ acc[k]=acc[k]||{v:0,n:0}; acc[k].v+=v; acc[k].n++; };
  rounds.forEach(r=>{ const b=resolveBase('goal',r);
    r.holes.forEach(h=>{ const s=holeSG(h,b); if(!s.ok) return; holes++; total+=s.total; const par=Number(h.par);
      if(par>=4) add(h.teePen&&h.teePen!=='none'?'ott-pen':(h.teeLie==='sand'||h.teeLie==='recovery')?'ott-trouble':h.teeLie==='rough'?'ott-rough':'ott-fw', s.ott);
      if(s.nApp>0||Number(h.penOther)>0) add(appBucket(par===3?Number(h.len):(h.teeLie==='green'?0:Number(h.teeDist))), s.app);
      if(h.atg) add(h.atgLie==='sand'?'atg-sand':h.atgLie==='rough'?'atg-rough':'atg-fw', s.atg);
      if(Number(h.putts)>0) add('putt-'+puttBucket(Number(h.fp)), s.putt);
    });
  });
  const k=holes?18/holes:0;
  const list=Object.entries(acc).map(([key,o])=>{ const [title,tip]=moverInfo(key); return {k:key,title,tip,v:o.v*k,n:o.n*k}; }).filter(x=>x.v<-0.15).sort((a,b)=>a.v-b.v);
  const all={}; Object.entries(acc).forEach(([key,o])=>all[key]=o.v*k);
  return {gap:total*k,list,rounds:rounds.length,holes,all};
}
function famStats(rounds){
  let fwO=0,fw=0,gO=0,g=0,scO=0,sc=0,udO=0,ud=0,putts=0,three=0,pens=0,holes=0,score=0,par=0;
  rounds.forEach(r=>r.holes.forEach(h=>{ if(h.score==null) return; const p=Number(h.par),s=Number(h.score),pu=Number(h.putts||0);
    holes++; score+=s; par+=p; putts+=pu;
    if(p>=4&&h.teeLie){ fwO++; if((h.teeLie==='fairway'||h.teeLie==='green')&&(h.teePen||'none')==='none') fw++; }
    const gir = pu>0 ? (s-pu)<=p-2 : s<=p-2; gO++; if(gir) g++; else { scO++; if(s<=p) sc++; }
    if(h.atg){ udO++; if(Number(h.atgShots||1)===1&&pu<=1) ud++; }
    if(pu>=3) three++; pens+=(h.teePen&&h.teePen!=='none'?1:0)+Number(h.penOther||0);
  }));
  const k=holes?18/holes:0, pct=(a,b)=>b?Math.round(a/b*100):null;
  return {holes,toPar:(score-par)*k,putts:putts*k,three:three*k,pens:pens*k,fw:pct(fw,fwO),fwN:[fw,fwO],gir:pct(g,gO),girN:[g,gO],scr:pct(sc,scO),ud:pct(ud,udO),udN:[ud,udO]};
}
function tilesHtml(st,oneRound){
  const pc=v=>v==null?'–':v+'%';
  const n=v=>v.toFixed(1);
  const t=[
    ['Fairways',pc(st.fw),oneRound?`${st.fwN[0]} of ${st.fwN[1]}`:'hit off the tee'],
    ['Greens in reg.',pc(st.gir),oneRound?`${st.girN[0]} of ${st.girN[1]}`:'on in par minus 2'],
    ['Scrambling',pc(st.scr),'par or better after missing'],
    ['Up and down',pc(st.ud),oneRound?`${st.udN[0]} of ${st.udN[1]}`:'chip or splash, then 1 putt'],
    ['Putts',n(st.putts),oneRound?'this round':'per 18 holes'],
    ['3-putts',n(st.three),oneRound?'this round':'per 18 holes'],
    ['Penalties',n(st.pens),oneRound?'this round':'per 18 holes']
  ];
  return `<div class="tiles">${t.map(([l,v,s])=>`<div class="tile"><span>${l}</span><b>${v}</b><span>${s}</span></div>`).join('')}</div>`;
}
function insights(r,base){
  const {t,per}=roundSG(r,base);
  const out=[];
  const order=CATS.map(([k,l])=>({k,l,v:t[k]})).sort((a,b)=>a.v-b.v);
  const worst=order[0], best=order[order.length-1];
  const putts={short:[0,0],mid:[0,0],long:[0,0]}, app={};
  let fw=0,tees=0,pens=0;
  r.holes.forEach((h,i)=>{ const s=per[i]; if(!s.ok) return;
    if(Number(h.putts)>0){ const b=puttBucket(Number(h.fp)); putts[b][0]+=s.putt; putts[b][1]++; }
    if(s.nApp>0){ const b=appBucket(Number(h.par)===3?Number(h.len):(h.teeLie==='green'?0:Number(h.teeDist))); app[b]=app[b]||[0,0]; app[b][0]+=s.app; app[b][1]++; }
    if(Number(h.par)>=4){ tees++; if(h.teeLie==='fairway'||h.teeLie==='green') fw++; if(h.teePen&&h.teePen!=='none') pens++; }
  });
  let detail='';
  if(worst.k==='putt'){ const w=Object.entries(putts).filter(([,v])=>v[1]).sort((a,b)=>a[1][0]-b[1][0])[0]; if(w){ const [title,tip]=moverInfo('putt-'+w[0]); detail=`Most of it came from ${title.toLowerCase()} (${f1(w[1][0])} over ${w[1][1]} hole${w[1][1]>1?'s':''}). ${tip}`; } }
  else if(worst.k==='app'){ const w=Object.entries(app).sort((a,b)=>a[1][0]-b[1][0])[0]; if(w){ const [title,tip]=moverInfo(w[0]); detail=`The biggest loss was ${title.toLowerCase()} (${f1(w[1][0])} over ${w[1][1]} shot${w[1][1]>1?'s':''}). ${tip}`; } }
  else if(worst.k==='ott'){ detail=`You found ${fw} of ${tees} fairways${pens?` and took ${pens} penalt${pens>1?'ies':'y'} off the tee`:''}. ${pens?'Penalties are the most expensive mistake in golf, so a safer club on tight holes pays off.':'Keeping it in play matters more than extra distance.'}`; }
  else if(worst.k==='atg'){ detail='Chips and bunker shots are leaving you long putts. Practise landing the ball on a spot and letting it release.'; }
  if(worst.v<-0.2) out.push({leak:true,title:`Biggest leak: ${worst.l.toLowerCase()} (${f1(worst.v)})`,body:detail});
  if(best.v>0.2) out.push({leak:false,title:`Strength: ${best.l.toLowerCase()} (${f1(best.v)})`,body:'Keep doing what you are doing here.'});
  if(!out.length) out.push({leak:false,title:'Right on the level you are comparing against',body:'Try a lower handicap to see where the next shots will come from.'});
  return out;
}
function holeHistory(rounds,course,base){
  const rs=rounds.filter(r=>r.course===course), m={};
  rs.forEach(r=>r.holes.forEach(h=>{ const s=holeSG(h,base); if(!s.ok) return;
    const o=m[h.n]||(m[h.n]={n:h.n,par:h.par,plays:0,score:0,ott:0,app:0,atg:0,putt:0,total:0});
    o.plays++; o.score+=Number(h.score); CATS.forEach(([k])=>o[k]+=s[k]); o.total+=s.total; }));
  return {rounds:rs.length,holes:Object.values(m).sort((a,b)=>a.n-b.n).map(o=>{ const p=o.plays; const r={...o}; ['score','ott','app','atg','putt','total'].forEach(k=>r[k]=o[k]/p); return r; })};
}
function clubStats(rounds,base){
  const m={};
  rounds.forEach(r=>r.holes.forEach(h=>{ if(!h.teeClub||Number(h.par)<4) return; const s=holeSG(h,base); if(!s.ok) return;
    const o=m[h.teeClub]||(m[h.teeClub]={n:0,fw:0,sg:0,pen:0,dist:0}); o.n++; o.sg+=s.ott; o.dist+=Number(h.len)-(h.teeLie==='green'?0:Number(h.teeDist||0));
    if((h.teeLie==='fairway'||h.teeLie==='green')&&(h.teePen||'none')==='none') o.fw++; if(h.teePen&&h.teePen!=='none') o.pen++; }));
  return m;
}

// ================= charts =================
function lineChart(vals,labels,opts={}){
  const W=320,H=opts.h||150,L=32,R=8,T=10,B=22, n=vals.length;
  const lo=Math.min(0,...vals,...(opts.extra||[])), hi=Math.max(0,...vals,...(opts.extra||[]));
  const pad=(hi-lo)*0.12||1, y0=lo-pad, y1=hi+pad;
  const X=i=>L+(n<=1?(W-L-R)/2:i*(W-L-R)/(n-1)), Y=v=>opts.invert? T+(v-y0)/(y1-y0)*(H-T-B) : T+(y1-v)/(y1-y0)*(H-T-B);
  const step=niceStep((y1-y0)/4); let ticks=''; for(let v=Math.ceil(y0/step)*step; v<=y1; v+=step){ ticks+=`<line x1="${L}" x2="${W-R}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:var(--line)"/><text x="${L-5}" y="${Y(v)+3}" text-anchor="end">${opts.fmt?opts.fmt(v):(Math.abs(v)<1e-9?'0':(v>0&&!opts.plain?'+':'')+(+v.toFixed(1)))}</text>`; }
  const zero=opts.plain?'':`<line x1="${L}" x2="${W-R}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--muted);stroke-width:1"/>`;
  const path=vals.map((v,i)=>`${i?'L':'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join('');
  let avg='';
  if(opts.rolling&&n>=3){ const rv=vals.map((_,i)=>{ const s=vals.slice(Math.max(0,i-2),i+1); return s.reduce((a,b)=>a+b,0)/s.length; }); avg=`<path d="${rv.map((v,i)=>`${i?'L':'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join('')}" style="fill:none;stroke:var(--accent);stroke-width:3;stroke-linejoin:round;stroke-linecap:round"/>`; }
  const dots=vals.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="${i===n-1?4.5:3}" style="fill:${opts.plain?'var(--accent)':v>=0?'var(--pos)':'var(--neg)'}"/>`).join('');
  const xl=n?`<text x="${X(0)}" y="${H-6}" text-anchor="${n>1?'start':'middle'}">${esc(labels[0])}</text>${n>1?`<text x="${X(n-1)}" y="${H-6}" text-anchor="end">${esc(labels[n-1])}</text>`:''}`:'';
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.aria||'chart')}">${ticks}${zero}<path d="${path}" style="fill:none;stroke:var(--muted);stroke-width:1.2;opacity:.6"/>${avg}${dots}${xl}</svg>`;
}
function niceStep(x){ const p=Math.pow(10,Math.floor(Math.log10(x||1))); const f=x/p; return (f<=1?1:f<=2?2:f<=5?5:10)*p; }
function spark(vals){
  const W=140,H=40,n=vals.length; const m=Math.max(0.5,...vals.map(Math.abs));
  const X=i=>4+(n<=1?(W-8)/2:i*(W-8)/(n-1)), Y=v=>H/2-v/m*(H/2-4);
  const d=vals.map((v,i)=>`${i?'L':'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join('');
  const last=vals[n-1];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" aria-hidden="true"><line x1="0" x2="${W}" y1="${H/2}" y2="${H/2}" style="stroke:var(--line)"/><path d="${d}" style="fill:none;stroke:var(--accent);stroke-width:2;stroke-linejoin:round"/><circle cx="${X(n-1)}" cy="${Y(last)}" r="3.5" style="fill:${last>=0?'var(--pos)':'var(--neg)'}"/></svg>`;
}

// ================= smart assumptions =================
// When a detail is skipped, fill it with a sensible default and tag it, so logging never stalls.
// A wrong guess only moves strokes gained between parts of the game on that hole; the hole total is unchanged.
const statRounds=()=>realRounds().filter(r=>!(S.toughOut&&(r.cond||[]).length));
function typicalDrive(hcp){ return Math.round(Math.max(150,Math.min(260,245-4*Math.max(-4,Number(hcp)||0)))); }
function learnedClub(k){ // the golfer's own tee-shot length with a club, once there are 3 real ones
  const xs=[]; realRounds().forEach(r=>r.holes.forEach(h=>{ if(TEE_TO_BAG[h.teeClub]!==k||Number(h.par)<4||!h.teeLie||h.teeLie==='green'||(h.teePen||'none')!=='none'||h.teeDist==null||(h.assumed||[]).includes('teeDist')||(h.unsure||[]).includes('teeDist')) return; xs.push(Number(h.len)-Number(h.teeDist)); }));
  if(xs.length<3) return null; xs.sort((a,b)=>a-b); return Math.round(xs[Math.floor(xs.length/2)]);
}
function clubDist(k,hcp){ const b=Number(S.bag[k]); if(b>0) return {m:b,src:'bag'}; const l=learnedClub(k); if(l) return {m:l,src:'rounds'}; return {m:Math.round(typicalDrive(hcp)*(CLUB_RATIO[k]||.7)),src:'typical'}; }
function learnedRatio(kind){ // the golfer's own proximity, after about 5 rounds
  const rs=realRounds(); if(rs.length<5) return null; const xs=[];
  rs.forEach(r=>r.holes.forEach(h=>{ const a=[...(h.assumed||[]),...(h.unsure||[])]; if(h.fp==null||a.includes('fp')||!(Number(h.putts)>0)) return;
    if(kind==='chip'){ if(h.atg&&Number(h.atgShots||1)===1&&Number(h.atgDist)>0&&!a.includes('atgDist')) xs.push(h.fp/h.atgDist); }
    else if(!h.atg){ const d=Number(h.par)===3?Number(h.len):(h.teeLie&&h.teeLie!=='green'&&!a.includes('teeDist')?Number(h.teeDist):0); if(d>30) xs.push(h.fp/d); } }));
  if(xs.length<12) return null; xs.sort((a,b)=>a-b); return xs[Math.floor(xs.length/2)];
}
function assumeHole(h,hcp){
  const o=JSON.parse(JSON.stringify(h)), add=[];
  if(!S.assumeOn||o.score==null||o.score==='') return {h:o,add};
  const par=Number(o.par), score=Number(o.score), empty=v=>v==null||v==='';
  const set=(f,v)=>{ o[f]=v; add.push(f); };
  if(par>=4){
    if(!o.teeLie) set('teeLie','fairway');
    if(o.teeLie!=='green'&&empty(o.teeDist)) set('teeDist',Math.max(10,Math.round(Number(o.len)-clubDist(TEE_TO_BAG[o.teeClub]||'driver',hcp).m)));
  }
  if(o.atg){
    if(empty(o.atgDist)) set('atgDist',15);
    if(!o.atgLie) set('atgLie',Number(o.atgDist)<=10?'fairway':'rough');
    if(!o.atgShots) o.atgShots=1;
  }
  const before=()=>(par>=4?(o.teePen==='retee'?2:1)+(o.teePen&&o.teePen!=='none'?1:0):0)+(o.atg?Number(o.atgShots||1):0)+Number(o.penOther||0);
  const minApp=par>=4&&o.teeLie==='green'?0:1;
  if(empty(o.putts)) set('putts',Math.max(0,Math.min(2,score-before()-minApp)));
  if(Number(o.putts)>0&&empty(o.fp)){
    let fp;
    if(o.atg) fp=Math.max(1,Number(o.atgDist)*(learnedRatio('chip')||0.10));
    else { const d=par===3?Number(o.len):(o.teeLie==='green'?0:Number(o.teeDist)); fp=d?Math.min(20,Math.max(1.5,d*(learnedRatio('app')||0.07*(1+Math.max(0,Number(hcp)||0)/40)))):8; }
    if(Number(o.putts)===1) fp=Math.min(fp,2.5); if(Number(o.putts)>=3) fp=Math.max(fp,10);
    set('fp',Math.round(fp*10)/10);
  }
  // Score sense-check: the score wins. If assumed putts don't fit, trim them.
  if(add.includes('putts')){ while(Number(o.putts)>0&&score-Number(o.putts)-before()<minApp) o.putts=Number(o.putts)-1; if(!(Number(o.putts)>0)){ o.fp=null; const i=add.indexOf('fp'); if(i>=0) add.splice(i,1); } }
  return {h:o,add};
}
function commitAssumptions(h,hcp){
  if(!h||h.score==null||h.score==='') return;
  const {h:o,add}=assumeHole(h,hcp!=null?hcp:myHcp(S.round)); if(!add.length) return;
  add.forEach(f=>h[f]=o[f]); h.assumed=[...new Set([...(h.assumed||[]),...add])];
}
const ASSUME_DEPS={teeClub:['teeDist','fp'],teeLie:['teeDist','fp'],teeDist:['fp'],teePen:['putts','fp'],atg:['atgLie','atgDist','putts','fp'],atgDist:['atgLie','fp'],atgLie:[],atgShots:['putts','fp'],score:['putts','fp'],putts:['fp'],penOther:['putts','fp']};
function assumeHint(h,f){
  if(!S.assumeOn||h.score==null||h.score==='') return '';
  const {h:o,add}=assumeHole(h,myHcp(S.round)); if(!add.includes(f)) return '';
  const v=o[f], u=fullU();
  const txt=f==='teeLie'?(LIES_TEE.find(x=>x[0]===v)||[,'Fairway'])[1].toLowerCase():f==='atgLie'?(LIES_ATG.find(x=>x[0]===v)||[,''])[1].toLowerCase()
    :f==='fp'?`${toShow('fp',v)} ${puttU()}`:f==='putts'?`${v} putt${v===1?'':'s'}`:`${toShow(f,v)} ${u}`;
  return `<span class="small muted hint">Skip it and we'll assume ${esc(txt)}${f==='teeDist'?' left':''}.</span>`;
}
const asm=(h,fields)=>fields.some(f=>(h.assumed||[]).includes(f))?' assumed':'';
// Profile (handicap, goal, bag, preferences) follows the golfer between phones.
let profTimer=null;
function saveProfile(){ lsSet('sg.profileAt',Date.now()); clearTimeout(profTimer); profTimer=setTimeout(()=>{ if(sb&&uid) sb.from('profiles').update({data:{hcp:S.hcp,goal:S.goal,bag:S.bag,assumeOn:S.assumeOn,goals:S.goals,plan:S.plan,at:Date.now()}}).eq('id',uid).then(()=>{},()=>{}); },800); }

// ================= goals, practice plans, bounce-back, achievements =================
const GOAL_EVERY=3;
// A new set of suggested goals arrives every 3 rounds, built from the biggest shot losses in the last 6.
function ensureGoals(){
  const rs=chrono(realRounds()), want=Math.floor(rs.length/GOAL_EVERY); let changed=false;
  while(S.goals.sets.length<want){
    const k=S.goals.sets.length, upto=rs.slice(0,(k+1)*GOAL_EVERY), recent=upto.slice(-6);
    const nm=needleMovers(recent);
    const items=nm.list.slice(0,3).map(x=>({k:x.k,title:x.title,base:+x.v.toFixed(2),target:+(x.v*0.5).toFixed(2)}));
    S.goals.sets.push({n:upto.length,date:upto[upto.length-1].date,items});
    S.goals.focus=items.slice(0,2).map(x=>x.k); changed=true;
  }
  if(changed){ lsSet('sg.goals',S.goals); saveProfile(); }
}
function moverValue(rounds,key){ const nm=needleMovers(rounds); const all=nm.all||{}; return all[key]!=null?all[key]:0; }
function goalRows(){
  const set=S.goals.sets[S.goals.sets.length-1]; if(!set) return null;
  const rs=chrono(realRounds()), after=rs.slice(set.n);
  return {set,after:after.length,items:set.items.map(g=>{ const cur=after.length?moverValue(after,g.k):null;
    const pct=cur==null?0:Math.max(0,Math.min(1,(cur-g.base)/((g.target-g.base)||-1)));
    return {...g,cur,pct,done:cur!=null&&cur>=g.target,focus:S.goals.focus.includes(g.k)}; })};
}
const PLACES=[['range','Range'],['green','Putting green'],['short','Chipping and bunker area'],['home','Home']];
// Drill library. Each drill says which shot losses it fixes (0–1), where it can be done, how long it suits and what kind it is.
// The plan picks the best mix for the golfer's focus goals, time and places, and the Shuffle button swaps in alternatives.
const D=(id,t,areas,places,min,max,type,how,score)=>({id,t,areas,places,min,max,type,how,score});
const DRILL_LIB=[
  Object.assign(D('tee12','12-tee drill',{'putt-short':1,'putt-mid':.6},['green'],10,20,'Pressure','Twelve tees around one hole: four at each of three distances, on four sides. Hole every putt, ring by ring.','Clear all 12. Count how many putts it took.'),{art:()=>tee12Art(),
    steps:()=>{ const d=isFt()?['3 ft','6 ft','9 ft']:['1 m','2 m','3 m']; return [`Pick a hole with some slope and push in 12 tees: four at ${d[0]}, four at ${d[1]} and four at ${d[2]}, one on each side of the hole.`,`Putt from the four ${d[0]} tees, then the ${d[1]} ring, then ${d[2]}. Read each one, as every side breaks differently.`,`Miss and you go back to the first tee of that ring.`,`Clear all 12 and note how many putts it took. Beat it next time.`]; }}),
  D('gate','Gate drill',{'putt-short':1},['green','home'],5,15,'Technique','Two tees just wider than the ball, a metre out. Roll every putt through the gate and into the hole.','Makes out of 30.'),
  D('clock','Clock drill',{'putt-short':1},['green'],10,15,'Pressure','Six balls round the hole at a metre, then a metre and a half. Miss one and restart that ring.','Longest run of makes.'),
  D('fifty','50 in a row',{'putt-short':1},['green'],10,20,'Pressure','Hole 50 putts in a row from a metre. Miss and you start again from zero.','Best run.'),
  D('coin','Coin start line',{'putt-short':.6,'putt-mid':.6},['green','home'],5,10,'Technique','Place a coin 30 cm in front of the ball on your line. Roll every putt over the coin.','Over the coin, out of 20.'),
  D('ladder','Ladder',{'putt-mid':1},['green'],10,20,'Skill','Putts from 2, 4 and 6 m. Stay at each distance until you hole 3 of 10, reading every putt.','Balls needed to finish.'),
  D('circle','Three-metre game',{'putt-mid':1},['green'],10,15,'Game','Ten different 3 m putts around the green, full routine each time. Tour players hole about 4 in 10.','Makes out of 10.'),
  D('readroll','Read and roll',{'putt-mid':.8,'putt-long':.3},['green'],10,15,'Skill','Pick a breaking 4 m putt. Hit it from above and below the hole and watch how the break changes with speed.','Makes out of 10.'),
  D('fringe','Fringe finish',{'putt-long':1},['green'],10,20,'Skill','From 10, 15 and 20 m, stop every ball between the hole and one putter length past.','Out of 15.'),
  D('lag9','Lag nine',{'putt-long':1,'putt-mid':.4},['green'],15,25,'Game','Play nine holes on the practice green, each from 10–20 m. Two putts is par.','Score against 18.'),
  D('eyes','Eyes-closed lag',{'putt-long':.9},['green'],5,10,'Technique','Hit long putts with your eyes closed and call long or short before you look.','Correct calls out of 10.'),
  D('hall','Hallway speed',{'putt-long':.7},['home'],5,15,'Skill','Putt down the hallway and stop the ball within a putter length of the far wall without touching it.','Out of 10.'),
  D('line','Line drill',{'atg-sand':1},['short'],10,15,'Technique','Draw a line in the sand and hit the sand on or just behind it, stepping forward each swing.','Clean splashes in a row.'),
  D('bunker5','Bunker up-and-down',{'atg-sand':1,'putt-short':.3},['short'],10,20,'Game','Five balls in the bunker, each played out until it is holed.','Total shots, par 15.'),
  D('spot','Landing spot',{'atg-rough':1,'atg-fw':.4},['short'],10,15,'Skill','Land the ball on a spot a pace onto the green and let it release to the hole.','Inside 2 m, out of 15.'),
  D('badlie','Worst lie',{'atg-rough':1},['short'],10,15,'Skill','Chip from five deliberately bad lies: down in the rough, on a slope, against the collar.','Inside 2 m, out of 15.'),
  D('bump','Bump and run',{'atg-fw':1},['short'],10,15,'Skill','Off the fringe with an 8 iron. Land it just on and let it run like a putt.','Inside a metre, out of 15.'),
  D('fputt','Putt from the fringe',{'atg-fw':.8},['green'],5,10,'Skill','Putt from just off the green. When you can putt it, putt it.','Inside a metre, out of 10.'),
  D('ud9','Up-and-down nine',{'atg-fw':.7,'atg-rough':.7,'putt-short':.4},['short'],20,30,'Pressure','Drop a ball at nine spots around the green and get each one up and down.','Target 5 of 9.'),
  D('basket','Basket chips',{'atg-rough':.6,'atg-fw':.6},['home'],5,15,'Skill','Chip foam balls into a laundry basket from 5 m, changing your lie each time.','Out of 20.'),
  D('chipladder','Chip ladder',{'atg-fw':.8,'atg-rough':.5},['short'],10,15,'Technique','With one club, land balls 3, 6 and 9 paces onto the green by changing only swing length.','Inside a club length, out of 15.'),
  D('wclock','Wedge clock',{'app-100':1},['range'],15,25,'Technique','Three swing lengths with each wedge, five balls each. Write down every carry.','Your wedge chart, saved in your phone.'),
  D('towel','Landing towel',{'app-100':.9},['short','range'],10,15,'Skill','Lay a towel 30–60 m away and land wedges on it with different swing lengths.','Towel hits out of 20.'),
  D('rand3','Random three',{'app-100':1},['range'],10,20,'Pressure','Call 40, 60 or 80 m at random before every ball, never the same twice in a row.','Within 5 m, out of 15.'),
  D('callit','Call it',{'app-150':1},['range'],10,20,'Game','Call a target at 110, 130 or 150 m before each ball and change it every shot.','Within 10 m, out of 15.'),
  D('nine','Nine-ball flight',{'app-150':.6,'app-200':.5},['range'],15,20,'Skill','Low, middle and high, each as a draw, straight and fade. Nine balls, nine shots.','Shots that came off, out of 9.'),
  D('middle','Middle of the green',{'app-200':1,'app-200p':.3},['range'],10,15,'Skill','With a 5 or 6 iron, aim at the biggest target on the range. The green, not the flag.','Within 15 m, out of 10.'),
  D('playcourse','Play Glenelg on the range',{'app-150':.6,'app-200':.6,'ott-rough':.6},['range'],25,40,'Game','Play the first nine on the range: tee club to a fairway, then the approach club to a green-sized target.','Fairways and greens out of 9 each.'),
  D('layup','Layup ladder',{'app-200p':1},['range'],10,15,'Skill','Alternate one long club with a layup to your favourite wedge distance and compare where they finish.','Layups inside your wedge window, out of 10.'),
  D('hyb','Hybrid vs long iron',{'app-200':.7,'app-200p':.8},['range'],10,20,'Skill','Ten balls each at a 200 m target. Keep the club that finishes closer more often.','Within 20 m, out of 10 each.'),
  D('gates','Fairway gates',{'ott-rough':1,'ott-trouble':.5},['range'],10,20,'Game','Pick two targets 30 m apart and alternate drives between them, like a real round.','Fairways out of 14.'),
  D('safe','Safe club',{'ott-pen':1,'ott-trouble':.6},['range'],10,15,'Skill','Picture your three tightest holes. Hit the club you would play there at a 30 m gate.','Fairways out of 12.'),
  D('missside','Pick your miss side',{'ott-trouble':1,'ott-pen':.6},['range'],10,15,'Skill','Picture trouble on your usual miss side and aim so that miss still finishes safe.','Safe shots out of 12.'),
  D('tee3','Name it tee test',{'ott-rough':.7,'ott-pen':.7},['range'],10,15,'Pressure','Before each drive, say the target, shape and club out loud, then commit.','Fairway 2, rough 1, trouble 0. Out of 20.'),
  D('speed','Speed sets',{'ott-fw':1},['range','home'],10,15,'Technique','Three sets of five swings at full speed with a driver or alignment stick, resting between sets.','Feel faster each set.'),
  D('strike','Strike check',{'ott-fw':.6,'ott-rough':.5},['range'],10,15,'Technique','Spray foot powder on the driver face and hit ten. Find the centre and keep it there.','Centre strikes out of 10.')
];
const WARMUPS={range:'Wedges up to driver, a few balls each, easy tempo.',green:'Short putts first, then a few long ones to feel the speed.',short:'A few easy chips and pitches to wake the hands up.',home:'Some easy swings and short putts on the carpet.'};
function rng(seed){ let x=seed*9301+49297; return ()=>{ x=(x*9301+49297)%233280; return x/233280; }; }
function focusAreas(){
  const g=goalRows();
  let areas=g?g.items.filter(x=>x.focus).map(x=>({k:x.k,title:x.title,w:Math.abs(x.cur!=null?x.cur:x.base)||0.3})):[];
  if(!areas.length){ const rs=realRounds(); areas=needleMovers(rs.length?chrono(rs).slice(-6):[EXAMPLE_ROUND]).list.slice(0,3).map(x=>({k:x.k,title:x.title,w:Math.abs(x.v)})); }
  return areas;
}
const CAT_OF=k=>k.split('-')[0]; // ott, app, atg, putt
function lossMap(){ const rs=realRounds(); return needleMovers(rs.length?chrono(rs).slice(-6):[EXAMPLE_ROUND]).all||{}; }
function practicePlan(){
  const mins=Number(S.plan.mins)||45, places=S.plan.places||[], extra=S.plan.extra||[], rand=rng(S.planSeed||1);
  const loss=lossMap(), titleOf=k=>(moverInfo(k)||[k])[0];
  // Focus goals first, then any extra parts of the game the golfer ticked.
  const areas=focusAreas().map(a=>({...a,why:'focus'}));
  extra.forEach(c=>{ if(areas.some(a=>CAT_OF(a.k)===c)) return;
    const keys=Object.keys(DRILL_LIB.reduce((o,d)=>{ Object.keys(d.areas).forEach(k=>{ if(CAT_OF(k)===c) o[k]=1; }); return o; },{}));
    keys.sort((x,y)=>(loss[x]||0)-(loss[y]||0)); const k=keys[0];
    if(k) areas.push({k,title:titleOf(k),w:Math.max(0.3,Math.abs(Math.min(0,loss[k]||0)))*0.7,why:'extra'}); });
  const warmAt=places.find(p=>WARMUPS[p]), warm=warmAt&&mins>=30?(mins>=75?10:5):0;
  let budget=mins-warm; const W={}, target={}, got={};
  const setW=()=>{ const tw=areas.reduce((t,a)=>t+a.w,0)||1; areas.forEach(a=>{ W[a.k]=a.w; target[a.k]=budget*a.w/tw; if(got[a.k]==null) got[a.k]=0; }); };
  setW();
  const pool=DRILL_LIB.filter(d=>d.places.some(p=>places.includes(p)));
  const picked=[]; let left=budget;
  const usedPlaces=()=>new Set(picked.map(x=>x.at));
  const choose=(k,prefer,onlyAt)=>{ let best=null;
    for(const d of pool){ if(picked.some(x=>x.d.id===d.id)||d.min>left||(d.areas[k]||0)<0.5) continue;
      const at=onlyAt?(d.places.includes(onlyAt)?onlyAt:null):(d.places.find(p=>places.includes(p)&&!usedPlaces().has(p))||d.places.find(p=>places.includes(p)));
      if(!at) continue;
      let sc=0; for(const a in d.areas) sc+=(W[a]||0)*d.areas[a];
      if(!usedPlaces().has(at)) sc*=1.2; if(prefer&&prefer.includes(d.type)) sc*=1.5; sc*=0.7+0.6*rand();
      if(!best||sc>best.sc) best={d,sc,at}; }
    return best; };
  const add=(c,k)=>{ picked.push({d:c.d,m:c.d.min,k,at:c.at}); left-=c.d.min; got[k]=(got[k]||0)+c.d.min; };
  // 1. One drill for each focus or extra area, biggest shot loss first.
  [...areas].sort((x,y)=>y.w-x.w).forEach(a=>{ const c=choose(a.k); if(c) add(c,a.k); });
  // 2. Every place they ticked gets at least one drill, aimed at their biggest loss that can be practised there.
  for(const pl of places){
    if(usedPlaces().has(pl)||!pool.some(d=>d.places.includes(pl))) continue;
    const keys=Object.keys(DRILL_LIB.filter(d=>d.places.includes(pl)).reduce((o,d)=>{ Object.keys(d.areas).forEach(k=>{ if(d.areas[k]>=0.5) o[k]=1; }); return o; },{})).sort((x,y)=>(loss[x]||0)-(loss[y]||0));
    for(const k of keys){
      if(!areas.some(a=>a.k===k)){ areas.push({k,title:titleOf(k),w:Math.max(0.25,Math.abs(Math.min(0,loss[k]||0)))*0.6,why:'place'}); setW(); }
      let c=choose(k,null,pl);
      while(!c&&picked.length>1){ // make room by dropping the smallest-loss drill that isn't the only one at its place
        const drop=[...picked].filter(x=>picked.filter(y=>y.at===x.at).length>1||x.at!==pl).sort((a,b)=>(W[a.k]||0)-(W[b.k]||0))[0]; if(!drop) break;
        picked.splice(picked.indexOf(drop),1); left+=drop.m; got[drop.k]-=drop.m; c=choose(k,null,pl); }
      if(c){ add(c,k); break; }
    }
  }
  // 3. Share the remaining time by how many shots each area costs: lengthen a drill, or add a game or pressure test.
  const done=new Set(); let guard=0;
  while(left>=5&&guard++<60){
    const live=areas.filter(a=>!done.has(a.k)&&picked.some(x=>x.k===a.k)).sort((x,y)=>(target[y.k]-got[y.k])-(target[x.k]-got[x.k]));
    if(!live.length) break;
    const k=live[0].k, mine=picked.filter(x=>x.k===k), deficit=target[k]-got[k];
    const grow=mine.filter(x=>x.m<x.d.max).sort((a,b)=>a.m-b.m)[0];
    const fresh=(deficit>=10||!grow)?choose(k,['Game','Pressure']):null;
    if(fresh){ add(fresh,k); continue; }
    if(grow){ grow.m+=5; left-=5; got[k]+=5; continue; }
    done.add(k);
  }
  const order={Technique:0,Skill:1,Game:2,Pressure:3};
  picked.sort((a,b)=>places.indexOf(a.at)-places.indexOf(b.at)||order[a.d.type]-order[b.d.type]);
  picked.forEach(x=>{ x.fixes=Object.keys(x.d.areas).filter(k=>W[k]&&x.d.areas[k]>=0.5).map(k=>areas.find(a=>a.k===k)).filter(Boolean); x.why=(areas.find(a=>a.k===x.k)||{}).why; });
  const covered=new Set(picked.map(x=>x.k));
  return {warm,warmText:warm?WARMUPS[warmAt]:'',items:picked,missing:areas.filter(a=>a.why==='focus'&&!covered.has(a.k)),mins,spare:left,areas:areas.filter(a=>a.why==='focus')};
}
function bounceBack(rounds){
  let blow=0, ok=0, bird=0, bogeys=0, spiral=0;
  rounds.forEach(r=>{ const hc=myHcp(r); const okMax=hc>18?2:1;
    r.holes.forEach((h,i)=>{ const nx=r.holes[i+1]; if(h.score==null) return; const d=Number(h.score)-Number(h.par);
      if(d>=1&&nx&&nx.score!=null){ bogeys++; if(Number(nx.score)<Number(nx.par)) bird++; }
      if(d>=2&&nx&&nx.score!=null){ blow++; const nd=Number(nx.score)-Number(nx.par); if(nd<=okMax) ok++; if(nd>=2) spiral++; } }); });
  return {blow,ok,bird,bogeys,spiral};
}
function roundFacts(r){
  const f={score:0,par:0,holes:0,three:0,fw:0,gir:0,ud:0,pens:0,birdies:0,bogeyFreeRun:0,longMake:0}; let run=0;
  const sg=roundSG(r,String(myHcp(r)));
  r.holes.forEach((h,i)=>{ if(h.score==null) return; const p=Number(h.par),s=Number(h.score),pu=Number(h.putts||0); f.holes++; f.score+=s; f.par+=p;
    if(pu>=3) f.three++; if(p>=4&&(h.teeLie==='fairway'||h.teeLie==='green')&&(h.teePen||'none')==='none') f.fw++;
    if(pu>0?(s-pu)<=p-2:s<=p-2) f.gir++; if(h.atg&&Number(h.atgShots||1)===1&&pu<=1) f.ud++;
    f.pens+=(h.teePen&&h.teePen!=='none'?1:0)+Number(h.penOther||0); if(s<p) f.birdies++;
    run=s<=p?run+1:0; f.bogeyFreeRun=Math.max(f.bogeyFreeRun,run);
    if(pu===1&&Number(h.fp)>f.longMake&&!(h.assumed||[]).includes('fp')) f.longMake=Number(h.fp); });
  f.sg=sg.t; return f;
}
function achievements(){
  const rs=chrono(realRounds()); const facts=rs.map(r=>({r,f:roundFacts(r)})); const full=facts.filter(x=>x.f.holes>=18);
  const first=(test)=>{ const x=facts.find(test); return x?x.r.date:null; };
  let streak=0,best=0; full.forEach(x=>{ streak=x.f.three===0?streak+1:0; best=Math.max(best,streak); });
  const bb=bounceBack(rs);
  const low=full.length?Math.min(...full.map(x=>x.f.score-x.f.par)):null;
  const list=[
    ['Lag master','A full round without a 3-putt',first(x=>x.f.holes>=18&&x.f.three===0)],
    ['Steady hands','5 rounds in a row without a 3-putt',best>=5?'done':null,`Best run: ${best} of 5`],
    ['Birdie hunter','3 birdies in one round',first(x=>x.f.birdies>=3)],
    ['Bogey-free nine','9 holes in a row at par or better',first(x=>x.f.bogeyFreeRun>=9),`Best run: ${Math.max(0,...facts.map(x=>x.f.bogeyFreeRun))} holes`],
    ['Fairway finder','10 fairways in a round',first(x=>x.f.fw>=10)],
    ['Flag hunter','12 greens in regulation in a round',first(x=>x.f.gir>=12)],
    ['Clean card','A full round with no penalty shots',first(x=>x.f.holes>=18&&x.f.pens===0)],
    ['Scrambler','3 up-and-downs in one round',first(x=>x.f.ud>=3)],
    ['Bounce-back birdie','A birdie straight after a bogey or worse',bb.bird?'done':null],
    ['Beat your number','Gain strokes against your own handicap in a round',first(x=>x.f.holes>=18&&x.f.sg.total>0)],
    ['All-rounder','Gain strokes in all four parts of the game in one round',first(x=>x.f.holes>=18&&x.f.sg.ott>0&&x.f.sg.app>0&&x.f.sg.atg>0&&x.f.sg.putt>0)],
    ['Downtown','Hole a putt from over 8 m',first(x=>x.f.longMake>8)]
  ];
  return {list:list.map(([t,d,when,prog])=>({t,d,when,prog})),low};
}
function funStats(){
  const rs=realRounds(); const out=[]; if(!rs.length) return out;
  let pens=0,one=0,putted=0,made=0,longest=0,longR=null; const byPar={3:[0,0],4:[0,0],5:[0,0]}; const counts={}; const fb=[[0,0],[0,0]];
  rs.forEach(r=>{ const f=roundFacts(r); pens+=f.pens; if(f.longMake>longest){ longest=f.longMake; longR=r; }
    r.holes.forEach((h,i)=>{ if(h.score==null) return; const p=Number(h.par),s=Number(h.score),pu=Number(h.putts||0); byPar[p]&&(byPar[p][0]+=s-p,byPar[p][1]++);
      const d=s-p; const nm=d<=-2?'Eagle or better':d===-1?'Birdie':d===0?'Par':d===1?'Bogey':d===2?'Double':'Triple or worse'; counts[nm]=(counts[nm]||0)+1;
      if(pu>0){ putted++; if(pu===1){ one++; if(!(h.assumed||[]).includes('fp')) made+=Number(h.fp||0); } }
      if(r.holes.length===18){ const half=i<9?0:1; fb[half][0]+=d; fb[half][1]++; } }); });
  const common=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  const pu=m=>isFt()?`${Math.round(m/FT)} ft`:`${m.toFixed(1)} m`;
  out.push(['Shots lost to penalties',String(pens),`across ${rs.length} round${rs.length>1?'s':''}`]);
  if(longest) out.push(['Longest putt holed',pu(longest),longR?`${shortDate(longR.date)}, ${esc(longR.course)}`:'']);
  out.push(['Putts holed in one',`${isFt()?Math.round(made/FT):Math.round(made)} ${isFt()?'ft':'m'}`,'total length of your one-putts']);
  out.push(['One-putt rate',putted?Math.round(one/putted*100)+'%':'–','of greens you putted on']);
  [3,4,5].forEach(p=>{ if(byPar[p][1]) out.push([`Par ${p}s`,`${byPar[p][0]/byPar[p][1]>=0?'+':''}${(byPar[p][0]/byPar[p][1]).toFixed(2)}`,'average to par']); });
  if(fb[0][1]&&fb[1][1]) out.push(['Front vs back',`${(fb[0][0]/fb[0][1]*9).toFixed(1)} / ${(fb[1][0]/fb[1][1]*9).toFixed(1)}`,'average to par per nine']);
  if(common) out.push(['Most common score',common[0],`${common[1]} times`]);
  return out;
}

// ================= render =================
const ICONS={
  improve:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  mygolf:'<circle cx="12" cy="8" r="3.6"/><path d="M4.5 21c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5"/>',
  learn:'<path d="M4 5.5A1.5 1.5 0 015.5 4H11v16H5.5A1.5 1.5 0 014 18.5z"/><path d="M20 5.5A1.5 1.5 0 0018.5 4H13v16h5.5a1.5 1.5 0 001.5-1.5z"/>',
  home:'<path d="M6 21V4l10 4-10 4"/><path d="M3 21h18"/>',
  stats:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  mates:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2c2.9.4 5 2.8 5 5.8"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1"/>'
};
function render(){
  const app=document.getElementById('app'), strip=document.getElementById('strip'), tabs=document.getElementById('tabs');
  const tabViews=['home','stats','improve','mygolf'], TABL={home:'Rounds',stats:'Stats',improve:'Improve',mygolf:'My golf'};
  if(S.view==='learn') S.view='improve'; if(S.view==='settings') S.view='mygolf'; if(S.view==='mates'){ S.view='stats'; S.statsTab='mates'; }
  strip.hidden=S.view!=='hole'; tabs.hidden=!tabViews.includes(S.view);
  document.body.classList.toggle('holeview',S.view==='hole');
  const v={home:vHome,stats:vStats,mygolf:vMyGolf,improve:vImprove,auth:vAuth,setup:vSetup,hole:vHole,talk:vTalk,results:vResults,share:vShare}[S.view];
  app.innerHTML=v();
  if(S.view==='hole') strip.innerHTML=vStrip();
  let md=document.getElementById('modal'); if(!md){ md=document.createElement('div'); md.id='modal'; document.body.appendChild(md); }
  const dr=S.drillOpen&&drillById(S.drillOpen);
  if(dr){ if(md.dataset.id!==dr.id){ md.innerHTML=drillModalHtml(dr); md.dataset.id=dr.id; document.body.classList.add('noscroll'); startAnim(dr); const c=md.querySelector('.modal button'); if(c) c.focus(); } }
  else if(md.dataset.id){ stopAnim(); md.innerHTML=''; md.dataset.id=''; document.body.classList.remove('noscroll'); }
  if(!tabs.hidden) tabs.innerHTML=`<div class="in">${tabViews.map(t=>`<button class="${S.view===t?'on':''}" data-act="tab" data-val="${t}" aria-label="${t}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[t]}</svg>${TABL[t]}</button>`).join('')}</div>`;
  if(S.scrollTo){ const el=document.getElementById(S.scrollTo); S.scrollTo=null; if(el){ const rm=matchMedia('(prefers-reduced-motion: reduce)').matches; el.scrollIntoView({block:'nearest',behavior:rm?'auto':'smooth'}); } }
}
function baseChips(r){
  const opts=[['me','Me',fmtHcp(myHcp(r))],['goal','Goal',fmtHcp(goalHcp())],['0','Scratch','0.0'],['tour','PGA Tour','pro']];
  return `<div class="seg" role="group" aria-label="Compare against">${opts.map(([k,l,sub])=>`<button class="${S.base===k?'on':''}" data-act="base" data-val="${k}">${l}<span style="display:block;font-size:.72rem;font-weight:500;opacity:.8">${sub}</span></button>`).join('')}</div>`;
}
function bars(v){
  const max=Math.max(2,...CATS.map(([k])=>Math.abs(v[k])));
  return `<div class="bars">${CATS.map(([k,l])=>{ const w=Math.min(50,Math.abs(v[k])/max*50); const pos=v[k]>=0;
    return `<div class="bar"><span class="small">${l}</span><div class="track"><div class="fill" style="${pos?'left:50%':'right:50%'};width:${w}%;background:var(--${pos?'pos':'neg'})"></div></div><span class="val ${cls(v[k])}">${f1(v[k])}</span></div>`; }).join('')}</div>`;
}
// Section heading: a heavy rule and big title so each part of a tab stands on its own.
const secHead=(title,sub,right,first)=>`<div class="sechead${first?' first':''}"><div><h2>${title}</h2>${sub?`<p>${sub}</p>`:''}</div>${right||''}</div>`;
const subTabs=(act,cur,opts)=>`<div class="subtabs" role="tablist">${opts.map(([k,l])=>`<button role="tab" aria-selected="${cur===k}" class="${cur===k?'on':''}" data-act="${act}" data-val="${k}">${l}</button>`).join('')}</div>`;
const sampleTag=on=>on?'<span class="tag">Sample data</span>':'';

// ----- home -----
function vHome(){
  const real=statRounds(), showing=real.length?real:[EXAMPLE_ROUND];
  const avg={ott:0,app:0,atg:0,putt:0,total:0};
  showing.forEach(r=>{ const {t}=rsg(r,S.base); CATS.forEach(([k])=>avg[k]+=t[k]); avg.total+=t.total; });
  Object.keys(avg).forEach(k=>avg[k]/=showing.length);
  const draft=S.round&&!S.round.saved;
  return `
  <div class="top"><span class="brand">Strokes Gained</span><span class="muted small">${uid?'Synced':'Saved on this phone'}</span></div>
  <div class="stack">
    <h1>Where your shots go</h1>
    <div class="small muted">Handicap <b class="num">${S.hcp!=null?esc(fmtHcp(S.hcp)):'not set'}</b> · Goal <b class="num">${esc(fmtHcp(goalHcp()))}</b> · <button class="linkbtn" data-act="tab" data-val="mygolf">Change</button></div>
    ${draft?`<button class="btn big primary" data-act="resume">Resume round · ${esc(S.round.course)} · hole ${S.idx+1}</button>`:''}
    <button class="btn big ${draft?'':'primary'}" data-act="newround">Start a new round</button>
    ${secHead('Your game',real.length?`Average of your ${real.length} round${real.length>1?'s':''}`:'An example round until you save your own',sampleTag(!real.length))}
    <div class="card stack">
      <div class="small muted">Compared with ${esc(baseText(S.base,real.length?null:EXAMPLE_ROUND))}${S.base==='me'&&real.length?' (each round uses the handicap you had that day)':''}</div>
      ${baseChips(null)}
      ${bars(avg)}
      <div class="row between"><span class="muted">Total strokes gained per round</span><b class="bigsg ${cls(avg.total)}" style="font-size:2rem">${f1(avg.total)}</b></div>
    </div>
    ${secHead('Rounds','Tap a round for the full breakdown')}
    <div class="stack">${allRounds().map(r=>{ const {t}=rsg(r,S.base); return `<button class="roundrow" data-act="open" data-id="${esc(r.id)}"><span><b>${esc(r.course)}</b>${r.example?' <span class="tag">Example</span>':''}${r.demo?' <span class="tag">Sample</span>':''}${condTags(r)}<br><span class="small muted">${fmtDate(r.date)} · ${r.holes.length} holes · shot ${t.score}</span></span><span class="bigsg ${cls(t.total)}" style="font-size:1.6rem">${f1(t.total)}</span></button>`; }).join('')}</div>
  </div>`;
}
function vPath(rounds,isExample){
  const p=needleMovers(rounds), g=fmtHcp(goalHcp());
  const top=p.list.slice(0,4), max=Math.max(0.5,...top.map(x=>-x.v));
  const head = p.gap<-0.1 ? `You're losing about <b class="num neg">${Math.abs(p.gap).toFixed(1)}</b> shots a round to a ${esc(g)} golfer. Here's where they are.`
    : `You're already playing to ${esc(g)} or better across these rounds. Set a lower goal in My golf to find your next shots.`;
  return `<div class="card stack">
    <div class="row between"><h2>Path to ${esc(g)}</h2>${sampleTag(isExample)}</div>
    <p style="margin:0">${head}</p>
    ${top.length?`<ol class="movers">${top.map(x=>`<li>
      <div class="row between" style="flex-wrap:nowrap"><b>${esc(x.title)}</b><span class="val num neg">${f1(x.v)}</span></div>
      <div class="mtrack"><div style="width:${Math.round(-x.v/max*100)}%"></div></div>
      <span class="small muted">About ${x.n<1?'1 every '+Math.max(2,Math.round(1/x.n))+' rounds':Math.round(x.n)+' a round'}. ${esc(x.tip)}</span>
    </li>`).join('')}</ol>`:''}
    <span class="small muted">Based on ${p.rounds} round${p.rounds===1?'':'s'}, scaled to 18 holes.${p.rounds<5&&!isExample?' The picture sharpens after about 5 rounds.':''}</span>
  </div>`;
}

// ----- stats -----
const statsTabs=()=>subTabs('statstab',S.statsTab,[['overview','Overview'],['detail','Deep dive'],['badges','Badges'],['mates','Mates']]);
const whoSeg=statsTabs;
function bounceHtml(rs){
  const bb=bounceBack(rs), pct=bb.blow?Math.round(bb.ok/bb.blow*100):null;
  return `<div class="card stack">${bb.blow?`<div class="row between" style="flex-wrap:nowrap"><span>After a double or worse, you made ${myHcp(null)>18?'double':'bogey'} or better on the next hole</span><b class="bigsg ${pct>=60?'pos':pct<40?'neg':''}" style="font-size:2.4rem">${pct}%</b></div>
      <span class="small muted">${bb.ok} of ${bb.blow} times. ${bb.spiral?`${bb.spiral} time${bb.spiral>1?'s':''} one big number turned into another.`:'No blow-up has turned into two yet.'}${bb.bird?` ${bb.bird} bounce-back birdie${bb.bird>1?'s':''}.`:''}</span>`:`<span class="muted">No doubles yet, so nothing to bounce back from.</span>`}</div>`;
}
function badgesHtml(){
  const A=achievements(), fs=funStats(), got=A.list.filter(a=>a.when);
  return `${secHead('Achievements',`${got.length} of ${A.list.length} earned`,'',true)}
    <div class="badges">${A.list.map(a=>`<div class="badge ${a.when?'on':''}"><b>${esc(a.t)}</b><span class="small muted">${esc(a.d)}</span><span class="small ${a.when?'pos':'muted'}">${a.when?(a.when==='done'?'Earned':'Earned '+esc(shortDate(a.when))):esc(a.prog||'Not yet')}</span></div>`).join('')}</div>
    ${fs.length?`${secHead('Fun stats','The numbers worth bragging (or groaning) about')}<div class="tiles">${fs.map(([l,v,sub])=>`<div class="tile"><span>${l}</span><b>${v}</b><span>${sub}</span></div>`).join('')}</div>`:''}`;
}
const condTags=r=>(r.cond||[]).map(c=>` <span class="tag soft">${esc((CONDS.find(x=>x[0]===c)||[,c])[1])}</span>`).join('');
function vStats(){
  if(S.statsTab==='mates') return vMates();
  const real=statRounds(), anyCond=realRounds().some(r=>(r.cond||[]).length), rs=real.length?chrono(real):[EXAMPLE_ROUND], ex=!real.length;
  const top=`<div class="top"><span class="brand">Stats</span>${sampleTag(ex)}</div>${statsTabs()}`;
  const tough=anyCond?`<div class="card"><div class="setrow"><div>Leave out windy, wet or cold rounds<div class="small muted">So tough days don't drag your numbers down.</div></div><button class="switch ${S.toughOut?'on':''}" data-act="toggle" data-val="toughOut" aria-label="Leave out tough-condition rounds" aria-pressed="${S.toughOut}"></button></div></div>`:'';
  if(S.statsTab==='badges') return `${top}<div class="stack">${ex?`<div class="card muted">Badges and fun stats start once you've saved a round.</div>`:badgesHtml()}</div>`;
  const base=fixedBase();
  if(S.statsTab==='detail'){
    const courses=[...new Set(rs.map(r=>r.course))];
    const course=courses.includes(S.statsCourse)?S.statsCourse:courses[0];
    const hh=holeHistory(rs,course,base);
    const costly=[...hh.holes].sort((a,b)=>a.total-b.total).slice(0,3).filter(h=>h.total<-0.15);
    const catName={ott:'tee shots',app:'approaches',atg:'chips and bunker shots',putt:'putting'};
    const cs=clubStats(rs,base), clubKeys=CLUBS.filter(([k])=>cs[k]);
    return `${top}<div class="stack">
    ${secHead(`Path to ${esc(fmtHcp(goalHcp()))}`,'Where the shots between you and your goal are going','',true)}
    ${vPath(rs,ex)}
    ${secHead('Hole by hole',`${esc(course)} · ${hh.rounds} round${hh.rounds>1?'s':''}`)}
    <div class="card stack">
      ${courses.length>1?`<div class="chips wide">${courses.map(c=>`<button class="chip ${c===course?'on':''}" data-act="statscourse" data-val="${esc(c)}">${esc(c)}</button>`).join('')}</div>`:''}
      ${costly.length?costly.map(h=>{ const w=CATS.map(([k])=>[k,h[k]]).sort((a,b)=>a[1]-b[1])[0]; return `<div class="insight leak"><b>The ${ordinal(h.n)} costs you ${Math.abs(h.total).toFixed(1)} a round</b><div class="muted">Mostly ${catName[w[0]]} (${f1(w[1])}). Averaging ${h.score.toFixed(1)} on a par ${h.par}.</div></div>`; }).join(''):`<span class="muted">No hole stands out as costly yet.</span>`}
      <div class="tbl"><table><thead><tr><th>Hole</th><th>Par</th><th>Avg</th><th>Tee</th><th>Appr</th><th>Short</th><th>Putt</th><th>Total</th></tr></thead><tbody>
      ${hh.holes.map(h=>`<tr><td>${h.n}</td><td>${h.par}</td><td>${h.score.toFixed(1)}</td>${Number(h.par)>=4?`<td class="${cls(h.ott)}">${f1(h.ott)}</td>`:'<td class="muted">·</td>'}<td class="${cls(h.app)}">${f1(h.app)}</td><td class="${cls(h.atg)}">${f1(h.atg)}</td><td class="${cls(h.putt)}">${f1(h.putt)}</td><td class="${cls(h.total)}"><b>${f1(h.total)}</b></td></tr>`).join('')}
      </tbody></table></div>
    </div>
    ${ex?'':`${secHead('Bounce-back','How you recover after a big number')}${bounceHtml(rs)}`}
    ${clubKeys.length?`${secHead('Off the tee by club','')}<div class="card stack"><div class="tbl"><table><thead><tr><th>Club</th><th>Shots</th><th>Fairway</th><th>Avg length</th><th>Penalties</th><th>SG / shot</th></tr></thead><tbody>
      ${clubKeys.map(([k,l])=>{ const o=cs[k]; const sgs=o.sg/o.n; return `<tr><td>${l}</td><td>${o.n}</td><td>${Math.round(o.fw/o.n*100)}%</td><td>${lenShow(o.dist/o.n)} ${fullU()}</td><td>${o.pen}</td><td class="${cls(sgs)}">${f2(sgs)}</td></tr>`; }).join('')}
      </tbody></table></div><span class="small muted">Average length is worked out from the hole length minus the distance left.</span></div>`:''}
    </div>`;
  }
  const sg=rs.map(r=>roundSG(r,base).t);
  const per18=(t,k)=>t.holes?t[k]*18/t.holes:0;
  const labels=rs.map(r=>shortDate(r.date));
  const hc=rs.filter(r=>r.hcp!=null);
  return `${top}<div class="stack">
    ${secHead('Progress',`Strokes gained per 18 holes vs ${esc(S.base==='me'?`your current ${fmtHcp(myHcp(null))} handicap`:baseText(S.base,null))}`,'',true)}
    ${tough}
    <div class="card stack">
      ${baseChips(null)}
      ${rs.length>=2?lineChart(sg.map(t=>per18(t,'total')),labels,{rolling:true,aria:'Total strokes gained by round'}):`<div class="flagnote">Your progress chart appears once you've saved 2 rounds.</div>`}
      <span class="small muted">The green line is your 3-round average.</span>
      ${rs.length>=2?`<div class="sparks">${CATS.map(([k,l])=>{ const vals=sg.map(t=>per18(t,k)); const last3=vals.slice(-3).reduce((a,b)=>a+b,0)/Math.min(3,vals.length); return `<div class="spark"><div class="row"><span class="small">${l}</span><b class="num ${cls(last3)}">${f1(last3)}</b></div>${spark(vals)}<span class="small muted">last 3 avg</span></div>`; }).join('')}</div>`:''}
    </div>
    ${hc.length>=2?`${secHead('Handicap','Lower is better, so the line climbs as you improve')}<div class="card">${lineChart(hc.map(r=>r.hcp),hc.map(r=>shortDate(r.date)),{plain:true,invert:true,h:120,fmt:v=>fmtHcp(v),aria:'Handicap by round'})}</div>`:''}
    ${secHead('The usual stats',real.length?`Across ${rs.length} round${rs.length>1?'s':''}`:'From the example round')}
    ${tilesHtml(famStats(rs),false)}
    <button class="btn big" data-act="statstab" data-val="detail">Deep dive: path to goal, hole by hole, bounce-back →</button>
  </div>`;
}
const ordinal=n=>n+(n%100>=11&&n%100<=13?'th':({1:'st',2:'nd',3:'rd'}[n%10]||'th'));

// ----- mates -----
function playerDoc(){
  const rs=chrono(realRounds().filter(r=>!r.demo)).slice(-30);
  const pick=t=>({ott:+t.ott.toFixed(2),app:+t.app.toFixed(2),atg:+t.atg.toFixed(2),putt:+t.putt.toFixed(2),total:+t.total.toFixed(2)});
  return {hcp:S.hcp, updated:Date.now(), rounds:rs.map(r=>{ const a=roundSG(r,'0').t, b=roundSG(r,String(myHcp(r))).t; return {id:r.id,date:r.date,course:String(r.course).slice(0,80),score:a.score,par:a.par,holes:a.holes,hcp:r.hcp??null,s0:pick(a),sm:pick(b)}; })};
}
let publishing=false, publishAgain=false;
async function publishMe(){
  if(!sb||!uid||!S.sharing) return;
  if(publishing){ publishAgain=true; return; }
  publishing=true;
  try{ await sb.from('players').upsert({user_id:uid,display_name:me.name||'',data:playerDoc(),updated_at:new Date().toISOString()}); }catch(e){}
  publishing=false; if(publishAgain){ publishAgain=false; publishMe(); }
}
function mateRows(){
  return (S.mates||[]).map(p=>{ const rs=(Array.isArray(p.rounds)?p.rounds:[]).slice(-10).filter(r=>r&&r.s0&&Number(r.holes)>0);
    const k=r=>18/Number(r.holes);
    const avg=key=>rs.length?rs.reduce((a,r)=>a+Number(r.s0[key]||0)*k(r),0)/rs.length:null;
    return {id:p._id, me:p._id===uid, hcp:p.hcp, n:(p.rounds||[]).length, rs, all:Array.isArray(p.rounds)?p.rounds:[], total:avg('total'), ott:avg('ott'), app:avg('app'), atg:avg('atg'), putt:avg('putt')}; }).filter(x=>x.rs.length);
}
const nameOf=id=>id===uid?'You':(S.names[id]||'A mate');
function vMates(){
  if(!uid) return `<div class="top"><span class="brand">Stats</span></div><div class="stack">${whoSeg()}<div class="card stack"><h2>Compare with your mates</h2><p class="muted" style="margin:0">Sign in to compare with your mates. Your rounds still save on this phone.</p></div></div>`;
  const rows=mateRows().sort((a,b)=>b.total-a.total);
  const crowns=CATS.map(([k,l])=>{ const best=[...rows].sort((a,b)=>b[k]-a[k])[0]; return best?{l:{ott:'Best driver',app:'Best iron player',atg:'Best short game',putt:'Best putter'}[k],who:nameOf(best.id),v:best[k]}:null; }).filter(Boolean);
  const weekAgo=new Date(Date.now()-7*864e5).toISOString().slice(0,10);
  let rotw=null; (S.mates||[]).forEach(p=>(Array.isArray(p.rounds)?p.rounds:[]).forEach(r=>{ if(r&&r.sm&&String(r.date)>=weekAgo&&Number(r.holes)>0){ const v=Number(r.sm.total)*18/Number(r.holes); if(!rotw||v>rotw.v) rotw={id:p._id,v,r}; } }));
  return `
  <div class="top"><span class="brand">Stats</span><span class="small muted">${S.matesState==='loading'?'<span class="spinner"></span> Loading':S.matesState==='slow'?'Can\'t reach the group right now':'<button class="btn ghost small" data-act="refreshmates">Refresh</button>'}</span></div>
  <div class="stack">
    ${whoSeg()}
    <div class="card"><div class="setrow"><div><b>Share my stats with the group</b><div class="small muted">Everyone signed in to the app sees your rounds' strokes gained, not your hole-by-hole detail.</div></div><button class="switch ${S.sharing?'on':''}" data-act="sharing" aria-label="Share my stats" aria-pressed="${S.sharing}"></button></div></div>
    ${rotw?`<div class="card stack"><h3>Round of the week</h3><div class="row between"><div><b>${esc(nameOf(rotw.id))}</b><div class="small muted">${esc(rotw.r.course)} · ${esc(shortDate(rotw.r.date))} · shot ${Number(rotw.r.score)}</div></div><b class="bigsg ${cls(rotw.v)}" style="font-size:2rem">${f1(rotw.v)}</b></div><span class="small muted">Most strokes gained against their own handicap in the last 7 days, so it's a fair fight.</span></div>`:''}
    ${rows.length?`<div class="card stack"><h2>Leaderboard</h2><span class="small muted">Average strokes gained per 18 vs a scratch golfer, last 10 rounds each.</span>
      <div class="tbl"><table><thead><tr><th>Player</th><th>Hcp</th><th>Rounds</th><th>Tee</th><th>Appr</th><th>Short</th><th>Putt</th><th>Total</th></tr></thead><tbody>
      ${rows.map(r=>`<tr class="${r.me?'me':''}"><td>${esc(nameOf(r.id))}</td><td>${esc(fmtHcp(r.hcp))||'–'}</td><td>${r.n}</td>${['ott','app','atg','putt'].map(k=>`<td class="${cls(r[k])}">${f1(r[k])}</td>`).join('')}<td class="${cls(r.total)}"><b>${f1(r.total)}</b></td></tr>`).join('')}
      </tbody></table></div></div>
      <div class="crowns">${crowns.map(c=>`<div class="crown"><span class="small muted">${c.l}</span><div class="who">${esc(c.who)}</div><span class="small num ${cls(c.v)}">${f1(c.v)} per round</span></div>`).join('')}</div>`
    :`<div class="card stack"><h2>No one's sharing yet</h2><p class="muted" style="margin:0">Turn on sharing above once you've saved a round. Your mates do the same and the leaderboard fills in.</p></div>`}
    <div class="card small muted">To bring mates in, send them the app's link. They create an account, turn on sharing here, and they're on the leaderboard.</div>
  </div>`;
}

// ----- settings -----
function seg(act,cur,opts){ return `<div class="seg">${opts.map(([k,l])=>`<button class="${cur===k?'on':''}" data-act="${act}" data-val="${k}">${l}</button>`).join('')}</div>`; }
function vMyGolf(){
  const hc=S.hcp!=null?S.hcp:10, u=fullU();
  return `
  <div class="top"><span class="brand">My golf</span></div>
  <div class="stack">
    <div class="card stack">
      <h3>My game</h3>
      <div class="row" style="flex-wrap:nowrap">
        <div style="flex:1"><label class="small muted" for="myhcp">Handicap</label><input id="myhcp" class="field num" inputmode="decimal" data-hcp="hcp" value="${esc(fmtHcp(S.hcp))}" placeholder="e.g. 8.3 or +1.2"></div>
        <div style="flex:1"><label class="small muted" for="goalhcp">Goal handicap</label><input id="goalhcp" class="field num" inputmode="decimal" data-hcp="goal" value="${esc(fmtHcp(S.goal))}" placeholder="${esc(fmtHcp(goalHcp()))}"></div>
      </div>
      <span class="small muted">Every tenth counts. Each round remembers the handicap you had that day, so old rounds stay fair as you improve.</span>
    </div>
    <div class="card stack">
      <h3>My bag</h3>
      <span class="small muted">How far each club goes for you, carry plus roll, in ${isYd()?'yards':'metres'}. It fills in distances you skip, and later helps the caddie. Leave a club blank and the app uses your rounds or a typical number for your handicap.</span>
      <div class="baggrid">${BAG.map(([k,l])=>{ const lr=learnedClub(k); return `<label for="bag_${k}">${l}</label><input id="bag_${k}" class="field num" type="number" inputmode="numeric" data-bag="${k}" value="${S.bag[k]?lenShow(S.bag[k]):''}" placeholder="${lenShow(lr||Math.round(typicalDrive(hc)*(CLUB_RATIO[k]||.7)))}"><span class="small muted">${lr?'from rounds':S.bag[k]?'':'typical'}</span>`; }).join('')}</div>
    </div>
    <div class="card stack">
      <div class="setrow"><div><b>Fill in skipped details</b><div class="small muted">Skip something and the app makes a sensible guess, tagged on the hole so you can fix it. A wrong guess only shifts strokes gained between parts of your game on that hole, never your total.</div></div><button class="switch ${S.assumeOn?'on':''}" data-act="toggle" data-val="assumeOn" aria-label="Fill in skipped details" aria-pressed="${S.assumeOn}"></button></div>
      <details class="assume"><summary>What gets assumed</summary><ul class="small">
        <li><b>Tee shot finish:</b> fairway.</li>
        <li><b>Distance left after the tee shot:</b> hole length minus that club's distance from My bag (driver if no club), so ${lenShow(clubDist('driver',hc).m)} ${u} with the driver.</li>
        <li><b>Penalties:</b> none.</li>
        <li><b>Chip or bunker shot, no distance:</b> ${lenShow(15)} ${u}; from the fringe inside ${lenShow(10)} ${u}, otherwise the rough. One shot.</li>
        <li><b>Putts:</b> 2, unless the score only allows fewer.</li>
        <li><b>First putt after an approach:</b> about 7% of the approach distance for your handicap (from ${lenShow(85)} ${u}, about ${toShow('fp',Math.round(85*0.07*(1+Math.max(0,hc)/40)*10)/10)} ${puttU()}).</li>
        <li><b>First putt after a chip:</b> about 10% of the chip distance, at least ${toShow('fp',1)} ${puttU()}.</li>
        <li><b>The score always wins.</b> If the shots don't add up, the hole is flagged for you to check.</li>
        <li>After about 5 rounds, putt and chip guesses switch to your own averages.</li>
      </ul></details>
    </div>
    <div class="card">
      <h3>Units</h3>
      <div class="setrow"><span>Tee and approach distances</span>${seg('fullunit',S.fullUnit,[['m','Metres'],['yd','Yards']])}</div>
      <div class="setrow"><span>Putt lengths</span>${seg('putunit',S.putUnit,[['m','Metres'],['ft','Feet']])}</div>
    </div>
    <div class="card">
      <h3>Entering a round</h3>
      <div class="setrow"><div>Distances<div class="small muted">Ranges are quicker. You can still type an exact number on any distance.</div></div>${seg('mode',S.mode,[['quick','Ranges'],['exact','Exact']])}</div>
      <div class="setrow"><div>Smart entry<div class="small muted">Assumes 2 putts once you pick a score and scrolls you to the next question.</div></div><button class="switch ${S.smart?'on':''}" data-act="toggle" data-val="smart" aria-label="Smart entry" aria-pressed="${S.smart}"></button></div>
      <div class="setrow"><div>Track tee club<div class="small muted">Adds a club pick to each tee shot and a by-club table in Stats.</div></div><button class="switch ${S.clubs?'on':''}" data-act="toggle" data-val="clubs" aria-label="Track tee club" aria-pressed="${S.clubs}"></button></div>
    </div>
    <div class="card stack">
      <h3>Account</h3>
      ${uid?`<div><label class="small muted" for="myname">Your name (shown to your mates)</label><input id="myname" class="field" data-me="1" value="${esc(me.name)}"></div><div class="row between"><span class="small muted">${esc(me.email)}</span><button class="btn" data-act="signout">Sign out</button></div>`:CONFIGURED?`<div class="row between"><span class="small muted">Not signed in. Rounds stay on this phone.</span><button class="btn primary" data-act="signin">Sign in</button></div>`:`<span class="small muted">Accounts aren't set up yet, so rounds stay on this phone.</span>`}
    </div>
    ${S.rounds.some(r=>r.demo)?`<div class="card stack"><h3>Sample rounds</h3><span class="small muted">${S.rounds.filter(r=>r.demo).length} made-up rounds at Glenelg are in your history so you can see goals, practice plans and achievements working. Removing them also resets your goals.</span>${S.confirmDemo?`<button class="btn danger" data-act="cleardemo">Tap again to remove them</button>`:`<button class="btn" data-act="askdemo">Remove sample rounds</button>`}</div>`:''}
    <p class="small muted">Tour figures follow published PGA Tour benchmarks. Handicap baselines slide smoothly from any handicap; for now they are an early estimate and will be replaced with researched amateur data.</p>
  </div>`;
}


// ----- learn: lessons and the photo caddie -----
const LESSONS=[{title:'Where should you miss?',sub:'Smart misses · Lesson 1 · 35 s',url:'https://claude.ai/artifact/YMVSvQpgDAYigq4TFHDe8W',body:'A par 4 with trees left and water right. See what each miss costs, and what it adds up to over a season.'}];
let imgCaps=null;
function goalsHtml(){
  ensureGoals(); const g=goalRows(), n=realRounds().length;
  if(!g) return `${secHead('Your goals','',  '',true)}<div class="card stack"><p class="muted" style="margin:0">Save ${GOAL_EVERY-n} more round${GOAL_EVERY-n===1?'':'s'} and the app will suggest your first goals from where you're losing the most shots.</p></div>`;
  const next=GOAL_EVERY-(n-g.set.n);
  const row=x=>`<div class="goal ${x.focus?'focus':''}">
      <div class="row between" style="flex-wrap:nowrap"><b>${esc(x.title)}</b><button class="chip ${x.focus?'on':''}" style="flex:0 0 auto;padding:5px 10px" data-act="focusgoal" data-val="${x.k}">${x.focus?'Focusing':'Focus'}</button></div>
      <span class="small muted">Losing <b class="num neg">${Math.abs(x.base).toFixed(1)}</b> shots a round. Target: <b class="num">${Math.abs(x.target).toFixed(1)}</b> or less.</span>
      <div class="mtrack goaltrack"><div style="width:${Math.round(x.pct*100)}%"></div></div>
      <span class="small ${x.done?'pos':'muted'}">${x.cur==null?'Tracking starts with your next round.':x.done?(x.cur>-0.05?'Done: no shots lost here since this goal was set.':`Done: losing ${Math.abs(x.cur).toFixed(1)} a round since this goal was set.`):`Since this goal was set: losing ${Math.abs(x.cur).toFixed(1)} a round.`}</span>
    </div>`;
  return `${secHead('Your goals',`New set in ${next} round${next===1?'':'s'} · picked from your last ${Math.min(6,g.set.n)} rounds vs a ${esc(fmtHcp(goalHcp()))} golfer`,'',true)}
  <div class="card stack">
    <span class="small muted">Tap Focus on the ones you want to work on. Your practice plan is built around them.</span>
    ${g.items.length?g.items.map(row).join(''):'<span class="muted">Nothing is costing you shots against your goal right now. Try a lower goal handicap in My golf.</span>'}
  </div>`;
}
// ----- drill pop-up: steps, scoring and (for some drills) a looping top-down animation -----
const drillById=id=>DRILL_LIB.find(d=>d.id===id);
function drillModalHtml(d){
  const steps=d.steps?d.steps():[d.how], placeName=k=>(PLACES.find(x=>x[0]===k)||[,k])[1];
  return `<div class="modalback" data-act="closedrill"></div>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="drilltitle">
    <div class="row between" style="flex-wrap:nowrap"><h2 id="drilltitle">${esc(d.t)}</h2><button class="btn ghost" data-act="closedrill" aria-label="Close">✕</button></div>
    <div class="row" style="gap:6px"><span class="tag soft">${esc(d.type)}</span><span class="small muted">${d.min}–${d.max} min · ${d.places.map(placeName).join(' or ')}</span></div>
    ${d.art?`<div class="drillart">${d.art()}</div>`:''}
    <ol class="steps">${steps.map(t=>`<li>${esc(t)}</li>`).join('')}${d.steps?'':`<li>${esc(d.score)}</li>`}</ol>
  </div>`;
}
function stopAnim(){} function startAnim(){}
function tee12Art(){
  const C=160, R=[42,84,126], lab=isFt()?['3 ft','6 ft','9 ft']:['1 m','2 m','3 m'], col=['#FFD23F','#FF9F1C','#F25C3B'];
  const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
  const tee=(x,y,c)=>`<g><ellipse cx="${x+1.6}" cy="${y+2.2}" rx="6" ry="4.6" fill="rgba(0,0,0,.28)"/><circle cx="${x}" cy="${y}" r="5.6" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="1"/><circle cx="${x-1.6}" cy="${y-1.8}" r="1.8" fill="rgba(255,255,255,.7)"/></g>`;
  const rings=R.map((r,i)=>`<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.2" stroke-dasharray="1.5 5" stroke-linecap="round"/>`).join('');
  const tees=R.map((r,i)=>dirs.map(([dx,dy])=>tee(C+dx*r,C+dy*r,col[i])).join('')).join('');
  const pills=R.map((r,i)=>{ const x=C+r*0.707, y=C+r*0.707; return `<g transform="translate(${x} ${y})"><rect x="-21" y="-10.5" width="42" height="21" rx="10.5" fill="#fff"/><circle cx="-11" cy="0" r="3.8" fill="${col[i]}"/><text x="5" y="4" text-anchor="middle" font-size="10.5" font-weight="700" font-family="Inter,system-ui,sans-serif" fill="#111814">${lab[i]}</text></g>`; }).join('');
  const bx=C+R[1], by=C;
  return `<svg viewBox="0 0 320 320" role="img" aria-label="Twelve tees around a hole: four each at ${lab.join(', ')}, on four sides">
    <defs>
      <radialGradient id="gg" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="#5DBB7E"/><stop offset="1" stop-color="#2C7A4B"/></radialGradient>
      <pattern id="mow" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="14" height="28" fill="rgba(255,255,255,.07)"/></pattern>
      <clipPath id="gc"><circle cx="${C}" cy="${C}" r="146"/></clipPath>
    </defs>
    <circle cx="${C}" cy="${C}" r="156" fill="#3F8E5E"/>
    <circle cx="${C}" cy="${C}" r="146" fill="url(#gg)"/>
    <rect width="320" height="320" fill="url(#mow)" clip-path="url(#gc)"/>
    ${rings}
    <path d="M${bx-21} ${by+1} C ${C+50} ${C+26}, ${C+18} ${C+18}, ${C+5} ${C+3}" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="2 4" stroke-linecap="round" opacity=".9"/>
    <ellipse cx="${C+1.5}" cy="${C+2}" rx="9" ry="8" fill="rgba(0,0,0,.25)"/>
    <circle cx="${C}" cy="${C}" r="8" fill="#0E1A13" stroke="#E9F2EC" stroke-width="1.6"/>
    ${tees}
    <ellipse cx="${bx-13}" cy="${by+3}" rx="6.5" ry="5" fill="rgba(0,0,0,.3)"/><circle cx="${bx-14.5}" cy="${by}" r="6.2" fill="#fff"/><circle cx="${bx-16.5}" cy="${by-2}" r="2" fill="rgba(0,0,0,.08)"/>
    ${pills}
  </svg>`;
}
function libraryHtml(){
  const groups=[['putt','Putting'],['atg','Chipping and bunkers'],['app','Approach'],['ott','Driving']];
  return `<details class="card library"><summary><b>Browse all ${DRILL_LIB.length} drills</b><span class="small muted">Tap any drill to see how it works</span></summary>
    ${groups.map(([c,l])=>{ const ds=DRILL_LIB.filter(d=>Object.keys(d.areas).some(k=>CAT_OF(k)===c&&d.areas[k]>=0.5)); return `<h3 style="margin-top:12px">${l}</h3><div class="liblist">${ds.map(d=>`<button class="libitem" data-act="drill" data-val="${d.id}"><span><b>${esc(d.t)}</b>${d.art?' <span class="tag soft">Picture</span>':''}<br><span class="small muted">${esc(d.type)} · ${d.min}–${d.max} min</span></span><span class="muted">›</span></button>`).join('')}</div>`; }).join('')}
  </details>`;
}
function planHtml(){
  const P=practicePlan(), placeName=k=>(PLACES.find(x=>x[0]===k)||[,k])[1];
  return `${secHead("Today's practice",`Built for your focus: ${P.areas.map(a=>esc(a.title.toLowerCase())).join(', ')||'your biggest losses'}`)}
  <div class="card stack">
    <span class="small muted">How long have you got?</span>
    <div class="chips">${[20,30,45,60,90].map(m=>`<button class="chip ${Number(S.plan.mins)===m?'on':''}" data-act="planmins" data-val="${m}">${m}<span class="sub">min</span></button>`).join('')}</div>
    <span class="small muted">Where are you practising?</span>
    <div class="chips wide">${PLACES.map(([k,l])=>`<button class="chip ${(S.plan.places||[]).includes(k)?'on':''}" data-act="planplace" data-val="${k}">${l}</button>`).join('')}</div>
    <span class="small muted">Also work on (optional)</span>
    <div class="chips wide">${CATS.map(([k,l])=>`<button class="chip ${(S.plan.extra||[]).includes(k)?'on':''}" data-act="planextra" data-val="${k}">${l}</button>`).join('')}</div>
  </div>
  ${P.items.length?`<div class="card stack plancard">
    <div class="row between"><div><b class="planmins">${P.mins} min</b><div class="small muted">${P.items.length} drill${P.items.length>1?'s':''}${P.warm?' plus a warm-up':''}${P.spare>=5?` · ${P.spare} min spare to repeat your favourite`:''}</div></div><button class="btn" data-act="planshuffle">Shuffle drills</button></div>
    <ol class="plan">
      ${P.warm?`<li><div class="row between"><b>Warm up</b><span class="pill">${P.warm} min</span></div><span class="small muted">${esc(P.warmText)}</span></li>`:''}
      ${P.items.map(x=>`<li><button class="drillbtn" data-act="drill" data-val="${x.d.id}"><div class="row between" style="flex-wrap:nowrap"><b>${esc(x.d.t)}</b><span class="pill">${x.m} min</span></div>
        <div class="row" style="gap:6px"><span class="tag soft">${esc(x.d.type)}</span>${x.why!=='focus'?'<span class="tag extra">Extra</span>':''}${x.fixes.map(f=>`<span class="small muted">${esc(f.title)}</span>`).join('<span class="small muted">·</span>')}<span class="small muted">· ${esc(placeName(x.at))}</span></div>
        <span class="small">${esc(x.d.how)}</span><span class="small link">${x.d.art?'See how it works ›':'See the steps ›'}</span></button></li>`).join('')}
    </ol>
    ${P.missing.length?`<span class="small muted">Not covered at ${(S.plan.places||[]).map(placeName).join(' or ').toLowerCase()||'these places'}: ${P.missing.map(x=>esc(x.title.toLowerCase())).join(', ')}. Add another place to include ${P.missing.length>1?'them':'it'}.</span>`:''}
  </div>`:`<div class="flagnote">${(S.plan.places||[]).length?'None of your focus areas can be practised there. Add another place above.':'Pick where you are practising.'}</div>`}`;
}
function vImprove(){
  const c=S.cad, r=c.res, real=statRounds();
  return `
  <div class="top"><span class="brand">Improve</span></div>
  <div class="stack">
    ${goalsHtml()}
    ${planHtml()}
    ${libraryHtml()}
    ${secHead('Learn','Short lessons on playing smarter')}
    ${sample?'':'<!--'}<div class="card stack">
      <h2>Where should I miss?</h2>
      <p class="muted" style="margin:0">Take a photo of the shot in front of you. Claude looks at the hazards and tells you where to aim and which side is the safe miss.</p>
      ${!sample?`<div class="flagnote">This needs Claude, which this view can't reach. Open the app in Claude to use it.</div>`:!imgCaps?`<div class="flagnote">Photos can't be sent from this view. Open the app in the Claude app or a browser to use it.</div>`:`
      <label class="btn big ${c.blob?'':'primary'}" for="cadphoto" style="text-align:center;cursor:pointer">${c.blob?'Retake photo':'Take a photo of the shot'}</label>
      <input id="cadphoto" type="file" accept="image/*" capture="environment" style="position:absolute;width:1px;height:1px;opacity:0">
      ${c.url?`<img src="${c.url}" alt="Your photo of the shot" style="width:100%;border-radius:12px;border:1px solid var(--line)">`:''}
      <div class="row" style="flex-wrap:nowrap">
        <div style="flex:1"><label class="small muted" for="caddist">Distance to the flag (${fullU()})</label><input id="caddist" class="field num" type="number" inputmode="numeric" data-cad="dist" value="${esc(c.dist)}" placeholder="e.g. 145"></div>
      </div>
      <div><label class="small muted" for="cadnote">Anything else? (optional)</label><input id="cadnote" class="field" data-cad="note" value="${esc(c.note)}" placeholder="e.g. par 3, wind into us, flag back right"></div>
      <button class="btn big primary" data-act="caddie" ${!c.blob||c.busy?'disabled':''}>${c.busy?'<span class="spinner"></span> Reading the hole…':'Where should I miss?'}</button>
      ${c.err?`<div class="err">${esc(c.err)}</div>`:''}
      ${r?vCaddie(r):''}`}
    </div>${sample?'':'-->'}
    ${LESSONS.map(l=>`<a class="roundrow" href="${l.url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><span><b>${esc(l.title)}</b><br><span class="small muted">${esc(l.sub)}</span><br><span class="small">${esc(l.body)}</span></span><span class="btn primary" style="white-space:nowrap">Watch</span></a>`).join('')}
    <p class="small muted">More lessons are on the way.</p>
  </div>`;
}
function vCaddie(r){
  const row=(l,v)=>v?`<div class="setrow"><span class="small muted" style="min-width:90px">${l}</span><span style="text-align:right;flex:1">${esc(v)}</span></div>`:'';
  if(r.seeHole===false) return `<div class="flagnote">${esc(r.summary||"I can't make out the hole in that photo. Try again standing behind the ball, looking at the target.")}</div>`;
  return `<div class="card stack" style="background:var(--accent-soft);border-color:var(--accent)">
    <span class="small muted">The plan</span>
    <b style="font-size:1.15rem;line-height:1.35">${esc(r.summary||'')}</b>
    <div>${row('Aim',r.aim)}${row('Safe miss',r.safeMiss)}${row('Avoid',r.avoid)}</div>
    ${r.why?`<span class="small">${esc(r.why)}</span>`:''}
    ${Array.isArray(r.hazards)&&r.hazards.length?`<span class="small muted">Spotted: ${esc(r.hazards.map(h=>(h&&h.what?h.what:'')+(h&&h.where?' ('+h.where+')':'')).filter(Boolean).join(', '))}</span>`:''}
    <span class="small muted">Read from your photo${r.confidence?' · confidence '+esc(r.confidence):''}. Check your yardages and the conditions.</span>
  </div>`;
}
async function askCaddie(){
  const c=S.cad; if(!sample||!c.blob||c.busy) return;
  c.busy=true; c.err=''; c.res=null; render();
  const pv=needleMovers(realRounds().length?realRounds():[EXAMPLE_ROUND]);
  const leaks=pv.list.slice(0,2).map(x=>x.title).join('; ');
  const prompt=`You are a calm, practical golf caddie who thinks in strokes gained. The attached photo is the golfer's view of the shot in front of them.

Golfer: handicap ${fmtHcp(myHcp(null))}.${c.dist?` Distance to the flag: ${c.dist} ${isYd()?'yards':'metres'}.`:''}${c.note?` They add: "${String(c.note).slice(0,200)}".`:''}${leaks?` Their biggest leaks lately: ${leaks}.`:''}

Look for water, bunkers, out of bounds, trees, steep slopes, and where the flag sits on the green. Then give a plan for an amateur of this handicap, whose shots spread much wider than a pro's:
- where to aim (a specific, visible target, e.g. "middle of the green", "left edge of the bunker"),
- the safe side to miss and the side to avoid,
- one short reason in shots gained terms, e.g. a penalty costs over a shot while a miss into light rough costs a fraction.
Prefer the centre of the green or the fat side over a tucked flag. Use plain golfer language, no jargon. If the photo isn't a golf shot or you can't tell where the target is, set seeHole to false and say what photo would help.

Reply with only JSON:
{"seeHole":true,"summary":"one sentence plan","aim":"...","safeMiss":"...","avoid":"...","why":"one or two sentences","hazards":[{"what":"water","where":"short right"}],"confidence":"high|medium|low"}`;
  try{
    const res=await sample.json(prompt,{images:[c.blob],modelTier:'default'});
    c.res=res&&typeof res==='object'?res:null; if(!c.res) c.err="Couldn't read that. Try another photo.";
  }catch(e){
    c.err= e&&e.code==='not_granted'?'Claude access was declined for this app.':e&&e.code==='rate_limited'?'Claude is busy. Try again in a minute.':e&&e.code==='image_rejected'?"That photo couldn't be used. Try another.":"Couldn't read that photo. Try again.";
  }
  c.busy=false; render();
}

// ----- course setup -----
function vSetup(){
  const st=S.setup, u=fullU();
  return `
  <div class="top"><button class="btn ghost" data-act="home">← Back</button><span class="brand">New round</span><span></span></div>
  <div class="stack">
    ${S.courses.length?`<div class="card stack"><h3>Your courses</h3><div class="chips wide">${S.courses.map((c,i)=>`<button class="chip ${st.courseId===c.id?'on':''}" data-act="pickcourse" data-i="${i}">${esc(c.name)}<span class="sub">${c.holes.length} holes · par ${c.holes.reduce((a,h)=>a+Number(h.par),0)}</span></button>`).join('')}</div></div>`:''}
    <div class="card stack">
      <label for="cname"><h3>Course</h3></label>
      <input id="cname" class="field" data-setup="name" value="${esc(st.name)}" placeholder="e.g. Royal Adelaide, Blue course">
      <div class="row"><label class="small muted" for="rdate">Date</label><input id="rdate" type="date" class="field" style="max-width:170px" data-setup="date" value="${esc(st.date)}">
        <label class="small muted" for="rhcp">Handicap today</label><input id="rhcp" class="field num" style="max-width:90px" inputmode="decimal" data-setup="hcp" value="${esc(st.hcp)}" placeholder="8.3"></div>
      <span class="small muted">Conditions (optional)</span><div class="chips wide">${CONDS.map(([k,l])=>`<button class="chip ${(st.cond||[]).includes(k)?'on':''}" data-act="scond" data-val="${k}">${l}</button>`).join('')}</div>
      <div class="seg"><button class="${st.holes.length===18?'on':''}" data-act="nholes" data-val="18">18 holes</button><button class="${st.holes.length===9?'on':''}" data-act="nholes" data-val="9">9 holes</button></div>
      <p class="small muted" style="margin:0">Pars and lengths are saved with the course, so you only enter them once. No lengths handy? Leave the typical ones and fix them later.</p>
      <div class="coursegrid">
        <span class="small muted">Hole</span><span class="small muted">Par</span><span class="small muted">Length (${u})</span>
        ${st.holes.map((h,i)=>`<b class="num">${i+1}</b>
          <div class="seg">${[3,4,5].map(p=>`<button class="${h.par===p?'on':''}" data-act="cpar" data-i="${i}" data-val="${p}" aria-label="Hole ${i+1} par ${p}">${p}</button>`).join('')}</div>
          <input class="field num" id="len${i}" type="number" inputmode="numeric" min="40" max="800" data-clen="${i}" value="${h.len===''?'':lenShow(h.len)}" aria-label="Hole ${i+1} length in ${u}">`).join('')}
      </div>
      <span class="muted small" id="ctot">${setupTotals()}</span>
    </div>
    ${sample?'<h3>How do you want to enter this round?</h3>':''}
    <button class="btn big primary" data-act="startholes">Hole by hole<span class="small" style="display:block;font-weight:500;opacity:.85">Tap it in as you go, about 10 seconds a hole</span></button>
    ${sample?'':'<!--'}<button class="btn big" data-act="starttalk">Talk it through afterwards<span class="small muted" style="display:block;font-weight:500">Describe your round and Claude fills in the card for you to check</span></button>${sample?'':'-->'}
  </div>`;
}
const setupTotals=()=>`Par ${S.setup.holes.reduce((a,h)=>a+h.par,0)} · ${lenShow(S.setup.holes.reduce((a,h)=>a+Number(h.len||0),0)).toLocaleString()} ${fullU()}`;

// ----- hole entry -----
function chip(field,val,label,on,sub){ return `<button class="chip ${on?'on':''}" data-act="set" data-field="${field}" data-val="${esc(val)}">${label}${sub?`<span class="sub">${sub}</span>`:''}</button>`; }
function distField(field,choices,unit,val,label){
  const id='in_'+field;
  if(S.mode==='exact'||S.openExact[field]){
    return `<div class="exact"><input id="${id}" class="field num" type="number" inputmode="decimal" step="any" min="0" data-num="${field}" value="${val??''}" placeholder="0" aria-label="${esc(label)}"><span class="muted">${unit}</span>${S.mode==='quick'?`<button class="btn ghost small" data-act="closeexact" data-field="${field}">Use ranges</button>`:''}</div>`;
  }
  const conv=(field==='fp'&&isFt())||(field!=='fp'&&isYd());
  const tol=conv?0.6:0.001, has=val!=null&&val!=='', same=c=>has&&Math.abs(Number(c)-Number(val))<tol, inList=choices.some(same);
  return `<div class="chips">${choices.map(c=>chip(field,c,c+'',same(c))).join('')}
    <button class="chip ${has&&!inList?'on':''}" data-act="openexact" data-field="${field}">${has&&!inList?esc(val):'Exact'}<span class="sub">${has&&!inList?unit:'type it'}</span></button></div>`;
}
function stepper(field,val){ return `<div class="stepper"><button data-act="step" data-field="${field}" data-d="-1" aria-label="Fewer">−</button><span class="v num">${val}</span><button data-act="step" data-field="${field}" data-d="1" aria-label="More">+</button></div>`; }
const uns=(h,fields)=>fields.some(f=>(h.unsure||[]).includes(f))?' unsure':'';
function teeChoices(lenM){ const max=Math.min(toShow('teeDist',lenM)-20,isYd()?360:340); const out=[]; for(let d=20; d<=max; d+= d<200?20:30) out.push(d); return out; }

function vHole(){
  const r=S.round, h=hole(), par=Number(h.par), N=r.holes.length, u=fullU();
  const sg=hsg(h);
  const scores=[]; for(let s=Math.max(1,par-2); s<=par+4; s++) scores.push(s);
  const names={'-2':'Eagle','-1':'Birdie','0':'Par','1':'Bogey','2':'Double','3':'Triple','4':'+4'};
  return `
  <div class="top"><button class="btn ghost" data-act="home">← Rounds</button><span class="muted small">${esc(r.course)}</span>${sample?'<button class="btn ghost small" data-act="talkfrom">Talk it</button>':'<span></span>'}</div>
  <div class="stack">
    <div class="holehead"><span class="holenum num">${h.n}</span><div style="flex:1"><h2>Par ${par} · ${lenShow(h.len)} ${u}</h2><span class="muted small">Hole ${S.idx+1} of ${N}</span></div><button class="btn ghost small" data-act="edithole">${S.editHole?'Done':'Edit hole'}</button></div>
    ${S.editHole?`<div class="sec"><div class="holeedit"><span class="small muted">Par</span>${seg('hpar',String(par),[['3','3'],['4','4'],['5','5']])}<label class="small muted" for="hlen">Length</label><input id="hlen" class="field num" type="number" inputmode="numeric" data-hlen="1" value="${lenShow(h.len)}"><span class="muted">${u}</span></div><span class="small muted">Saved to the course for next time too.</span></div>`:''}
    <div class="dots">${r.holes.map((x,i)=>`<button class="dot ${i===S.idx?'cur':''} ${(x.unsure||[]).length?'unsure':''} ${(x.assumed||[]).length?'assumed':''} ${x.score!=null&&i!==S.idx?'done':''}" data-act="goto" data-i="${i}" aria-label="Go to hole ${x.n}">${x.n}</button>`).join('')}</div>
    ${(h.assumed||[]).length?`<div class="assumenote">The dashed parts were filled in for you. Tap the right answer if a guess is off.</div>`:''}
    ${(h.unsure||[]).length?`<div class="flagnote">Claude had to guess the highlighted parts of this hole. Tap the right answer to confirm.</div>`:''}

    <section id="sec-score" class="sec${uns(h,['score'])}"><div class="lab"><h3>Score</h3>${h.score!=null?`<span class="muted small">${names[String(h.score-par)]||''}</span>`:''}</div>
      <div class="chips">${scores.map(s=>chip('score',s,s,Number(h.score)===s,names[String(s-par)])).join('')}${chip('score',par+5,(par+5)+'',Number(h.score)>=par+5,'or more')}</div>
      ${Number(h.score)>=par+5?stepper('score',h.score):''}
    </section>

    ${par>=4?`
    <section id="sec-tee" class="sec${uns(h,['teeLie','teeDist','teePen'])}${asm(h,['teeLie','teeDist'])}"><div class="lab"><h3>${S.clubs?'Tee shot':'Tee shot finished in'}</h3></div>
      ${S.clubs?`<span class="small muted">Club</span><div class="chips wide">${CLUBS.map(([k,l])=>chip('teeClub',k,l,h.teeClub===k)).join('')}</div><span class="small muted">Finished in</span>`:''}
      <div class="chips wide">${LIES_TEE.map(([k,l])=>chip('teeLie',k,l,h.teeLie===k)).join('')}</div>${assumeHint(h,'teeLie')}
      <div class="seg">${[['none','No penalty'],['drop','Penalty drop'],['retee','OB, re-teed']].map(([k,l])=>`<button class="${(h.teePen||'none')===k?'on':''}" data-act="set" data-field="teePen" data-val="${k}">${l}</button>`).join('')}</div>
      ${h.teeLie&&h.teeLie!=='green'?`<div class="lab"><span class="small muted">${h.teePen==='drop'?'Distance to the hole from your drop':h.teePen==='retee'?'Distance left after your second tee shot':'Distance left to the hole'}</span><span class="small muted">${isYd()?'yards':'metres'}</span></div>
      ${distField('teeDist',teeChoices(h.len),u,toShow('teeDist',h.teeDist),'Distance left after tee shot')}${assumeHint(h,'teeDist')}`:h.teeLie?'':assumeHint(h,'teeDist')}
      ${h.teeLie==='green'?`<span class="small muted">Drove the green. Your first putt below covers it.</span>`:''}
    </section>`:''}

    <section id="sec-atg" class="sec${uns(h,['atg','atgLie','atgDist','atgShots'])}${asm(h,['atgLie','atgDist'])}"><div class="lab"><h3>Chip, pitch or bunker shot</h3><span class="small muted">within 30 ${u}, off the green</span></div>
      <div class="seg"><button class="${!h.atg?'on':''}" data-act="set" data-field="atg" data-val="0">None</button><button class="${h.atg?'on':''}" data-act="set" data-field="atg" data-val="1">Yes, I had one</button></div>
      ${h.atg?`<span class="small muted">Where was the first one from?</span>
        <div class="chips wide">${LIES_ATG.map(([k,l])=>chip('atgLie',k,l,h.atgLie===k)).join('')}</div>${assumeHint(h,'atgLie')}
        <div class="lab"><span class="small muted">Distance to the hole</span><span class="small muted">${isYd()?'yards':'metres'}</span></div>
        ${distField('atgDist',ATG_CH,u,toShow('atgDist',h.atgDist),'Short game distance')}${assumeHint(h,'atgDist')}
        <div class="row between"><span class="small muted">How many short-game shots before you were on the green?</span>${stepper('atgShots',h.atgShots||1)}</div>`:''}
    </section>

    <section id="sec-putt" class="sec${uns(h,['putts','fp'])}${asm(h,['putts','fp'])}"><div class="lab"><h3>Putting</h3></div>
      <div class="chips">${[0,1,2,3,4].map(p=>chip('putts',p,p,Number(h.putts)===p&&h.putts!=null,p===0?'holed off green':p===1?'putt':'putts')).join('')}</div>
      ${Number(h.putts)>0?`<div class="lab"><span class="small muted">First putt length (a pace is about ${isFt()?'3 feet':'a metre'})</span><span class="small muted">${isFt()?'feet':'metres'}</span></div>${distField('fp',isFt()?PUTT_FT:PUTT_M,puttU(),toShow('fp',h.fp),'First putt length')}${assumeHint(h,'fp')}`:''}${h.putts==null?assumeHint(h,'putts'):''}
    </section>

    <section id="sec-pen" class="sec${uns(h,['penOther'])}"><div class="row between"><div><h3>Other penalty strokes</h3><span class="small muted">Water, OB or unplayable after the tee shot</span></div>${stepper('penOther',h.penOther||0)}</div></section>

    ${sg.err&&h.score!=null?`<div class="err">${esc(sg.err)}</div>`:''}
  </div>`;
}
function vStrip(){
  const h=hole(), sg=hsg(h), last=S.idx===S.round.holes.length-1;
  const cell=(l,v,show)=>`<div>${l}<b class="${show?cls(v):''}">${show?f2(v):'–'}</b></div>`;
  return `<div class="in">
    <div class="sgcells">${cell('Tee',sg.ott,sg.ok&&h.par>=4)}${cell('Appr',sg.app,sg.ok)}${cell('Short',sg.atg,sg.ok)}${cell('Putt',sg.putt,sg.ok)}${cell('Hole',sg.total,sg.ok)}</div>
    <span class="small muted">${sg.ok?`${sg.nApp} approach shot${sg.nApp===1?'':'s'} · vs ${esc(baseShort(S.base,S.round))}`:'Strokes gained vs '+esc(baseShort(S.base,S.round))}</span>
    <div class="row" style="flex-wrap:nowrap"><button class="btn" style="flex:1" data-act="prev" ${S.idx===0?'disabled':''}>Previous</button><button class="btn primary ${sg.ok&&S.smart?'ready':''}" style="flex:2" data-act="${last?'finish':'next'}">${last?'See my round':'Next hole'}</button></div>
  </div>`;
}

// ----- talk it through -----
function vTalk(){
  return `
  <div class="top"><button class="btn ghost" data-act="home">← Rounds</button><span class="brand">Talk it through</span><span></span></div>
  <div class="stack">
    <h2>${esc(S.round.course)}</h2>
    <p class="muted" style="margin:0">Go hole by hole in your own words. Mention where each tee shot finished and how far you had left, any chips or bunker shots, how long your first putt was and how many putts. Claude fills in the card and highlights anything it had to guess.</p>
    ${dict?`<button class="btn mic ${listening?'on':''}" data-act="mic"><span class="dotrec"></span>${listening?'Stop recording':'Record my round'}</button><span class="small muted" id="partial">${esc(partial)}</span>`:`<span class="small muted">Tip: tap the microphone on your phone keyboard to speak instead of typing.</span>`}
    <label for="talk" class="small muted">Your round</label>
    <textarea id="talk" class="field" placeholder="1st, driver down the left side of the fairway, about 140 left. Hit it to ${isFt()?'25 feet':'8 metres'} and two-putted for par.&#10;2nd, par 3, missed short in the bunker about 12 out, splashed to ${isFt()?'10 feet':'3 metres'}, two putts, bogey.&#10;3rd ...">${esc(S.talk)}</textarea>
    ${S.talkErr?`<div class="err">${esc(S.talkErr)}</div>`:''}
    ${sample?`<button class="btn big primary" data-act="parse" ${S.busy?'disabled':''}>${S.busy?'<span class="spinner"></span> Building your scorecard…':'Build my scorecard'}</button>`:`<div class="flagnote">Turning a description into a scorecard needs Claude, which this view can't reach. Open the app in Claude to use it, or enter hole by hole.</div>`}
    <button class="btn" data-act="toholes">Enter hole by hole instead</button>
  </div>`;
}

// ----- results -----
function recapHtml(r,per){
  const base=resolveBase(S.base,r), {t}=roundSG(r,base);
  if(!t.holes) return '';
  const c={b:0,p:0,bo:0,d:0}; r.holes.forEach((h,i)=>{ if(!per[i].ok) return; const d=Number(h.score)-Number(h.par); if(d<0)c.b++; else if(d===0)c.p++; else if(d===1)c.bo++; else c.d++; });
  const pl=(n,w,ws)=>n?`${n} ${n===1?w:ws}`:'';
  const line=[pl(c.b,'birdie or better','birdies or better'),pl(c.p,'par','pars'),pl(c.bo,'bogey','bogeys'),pl(c.d,'double or worse','doubles or worse')].filter(Boolean).join(' · ');
  const order=CATS.map(([k,l])=>({k,l,v:t[k]})).filter(x=>x.k!=='ott'||r.holes.some(h=>Number(h.par)>=4)).sort((a,b)=>b.v-a.v);
  const best=order[0], worst=order[order.length-1];
  const leak=insights(r,base).find(i=>i.leak), mv=needleMovers([r]).list[0];
  const vs=esc(baseShort(S.base,r));
  return `<div class="card stack recap">
    <h2>Round recap</h2>
    <span class="small muted">${line}${condTags(r)}</span>
    <div class="recaprow"><span class="small muted">Best part</span><div><b>${esc(best.l)}</b> <span class="num ${cls(best.v)}">${f1(best.v)}</span><div class="small muted">${best.v>0.05?`Better than ${vs} here.`:`Your least costly area against ${vs}.`}</div></div></div>
    <div class="recaprow"><span class="small muted">Biggest leak</span><div><b>${esc(worst.l)}</b> <span class="num ${cls(worst.v)}">${f1(worst.v)}</span>${leak&&leak.body&&leak.body.replace(mv?mv.tip:'\u0000','').trim()?`<div class="small muted">${esc(leak.body.replace(mv?mv.tip:'\u0000','').trim())}</div>`:''}</div></div>
    <div class="recaprow"><span class="small muted">Work on</span><div>${mv?`<b>${esc(mv.title)}</b><div class="small muted">${esc(mv.tip)}</div>`:`<b>Nothing stood out</b><div class="small muted">You matched your goal handicap across the board. Keep it going.</div>`}</div></div>
    ${r.example?'':`<button class="btn" data-act="tab" data-val="improve">See your path to ${esc(fmtHcp(goalHcp()))}</button>`}
  </div>`;
}
function checkHtml(r,per){
  if(r.example) return '';
  const bad=r.holes.map((h,i)=>({h,i,s:per[i]})).filter(x=>x.h.score!=null&&x.h.score!==''&&!x.s.ok);
  const nAss=r.holes.reduce((a,h)=>a+(h.assumed||[]).length,0);
  return `${bad.length?`<div class="card stack"><h3>Check ${bad.length===1?'this hole':'these holes'}</h3>${bad.map(x=>`<button class="roundrow" data-act="fixhole" data-i="${x.i}"><span><b>Hole ${x.h.n}</b><br><span class="small muted">${esc(x.s.err)}</span></span><span class="btn small">Fix</span></button>`).join('')}</div>`:''}
  ${nAss?`<span class="small muted">${nAss} detail${nAss>1?'s were':' was'} filled in for you. Tap Edit holes to check them.</span>`:''}
  <div class="row"><span class="small muted">Conditions</span>${CONDS.map(([k,l])=>`<button class="chip ${(r.cond||[]).includes(k)?'on':''}" style="flex:0 0 auto;padding:6px 12px" data-act="rcond" data-val="${k}">${l}</button>`).join('')}</div>`;
}
function vResults(){
  const r=S.viewing||S.round, {t,per}=rsg(r,S.base), tour=roundSG(r,'tour').t;
  const unsaved=!S.viewing&&!r.saved;
  return `
  <div class="top"><button class="btn ghost" data-act="home">← Rounds</button><span class="brand">Round</span><span></span></div>
  <div class="stack">
    <div><h1>${esc(r.course)}</h1><span class="muted">${fmtDate(r.date)} · shot ${t.score} (${t.score-t.par>=0?'+':''}${t.score-t.par}) over ${t.holes} holes ${r.example?'<span class="tag">Example</span>':''}</span></div>
    ${!t.complete?`<div class="flagnote">${r.holes.length-t.holes} hole${r.holes.length-t.holes>1?'s are':' is'} incomplete and left out of the totals.</div>`:''}
    ${checkHtml(r,per)}
    <div class="card stack">
      <span class="small muted">Compared with ${esc(baseText(S.base,r))}</span>
      ${baseChips(r)}
      <div class="row between"><span class="bigsg ${cls(t.total)}">${f1(t.total)}</span><span class="small muted" style="text-align:right">strokes gained<br>${S.base==='tour'?'':`vs PGA Tour: <b class="num">${f1(tour.total)}</b>`}</span></div>
      ${bars(t)}
    </div>
    ${recapHtml(r,per)}
    ${secHead('The usual stats','')}
    ${tilesHtml(famStats([r]),true)}
    ${secHead('Hole by hole','Strokes gained on every hole')}
    <div class="card tbl"><table>
      <thead><tr><th>Hole</th><th>Par</th><th>Score</th><th>Tee</th><th>Appr</th><th>Short</th><th>Putt</th><th>Total</th></tr></thead>
      <tbody>${r.holes.map((h,i)=>{ const s=per[i]; const c=v=>s.ok?`<td class="${cls(v)}">${f2(v)}</td>`:'<td>–</td>'; return `<tr><td>${h.n}</td><td>${h.par}</td><td>${h.score??'–'}</td>${Number(h.par)>=4?c(s.ott):'<td class="muted">·</td>'}${c(s.app)}${c(s.atg)}${c(s.putt)}${c(s.total)}</tr>`; }).join('')}
      <tr class="tot"><td>Total</td><td>${t.par}</td><td>${t.score}</td><td class="${cls(t.ott)}">${f1(t.ott)}</td><td class="${cls(t.app)}">${f1(t.app)}</td><td class="${cls(t.atg)}">${f1(t.atg)}</td><td class="${cls(t.putt)}">${f1(t.putt)}</td><td class="${cls(t.total)}">${f1(t.total)}</td></tr></tbody>
    </table></div>
    <div class="row">
      ${unsaved?`<button class="btn primary" data-act="save">Save round</button>`:''}
      <button class="btn ${unsaved?'':'primary'}" data-act="sharecard">Share card</button>
      ${r.example?'':`<button class="btn" data-act="edit">Edit holes</button>
      ${S.confirmDel?`<button class="btn danger" data-act="del">Tap again to delete</button>`:`<button class="btn ghost danger" data-act="askdel">Delete round</button>`}`}
    </div>
    ${S.saveMsg?`<span class="small muted">${esc(S.saveMsg)}</span>`:''}
  </div>`;
}

// ----- share card -----
function vShare(){
  return `
  <div class="top"><button class="btn ghost" data-act="backresults">← Round</button><span class="brand">Share card</span><span></span></div>
  <div class="stack sharecard">
    ${S.shareImg?`<img src="${S.shareImg}" alt="Round summary card">`:'<div class="card"><span class="spinner"></span> Drawing your card…</div>'}
    <div class="row">${downloads?`<button class="btn primary" data-act="savecard">Save image</button>`:''}<button class="btn" data-act="copysummary">Copy summary text</button></div>
    <span class="small muted">${S.shareMsg?esc(S.shareMsg):downloads?'Save it, then post it in the group chat.':'On your phone, press and hold the image to save or share it.'}</span>
  </div>`;
}
function roundSummaryText(r){
  const {t}=rsg(r,S.base);
  return `${r.course}, ${fmtDate(r.date)}: shot ${t.score} (${t.score-t.par>=0?'+':''}${t.score-t.par}). Strokes gained vs ${baseText(S.base,r)}: ${f1(t.total)}. Tee ${f1(t.ott)} · Approach ${f1(t.app)} · Short game ${f1(t.atg)} · Putting ${f1(t.putt)}.`;
}
async function drawCard(){
  const r=S.viewing||S.round, {t}=rsg(r,S.base), st=famStats([r]);
  try{ await document.fonts.ready; }catch(e){}
  const c=document.createElement('canvas'); c.width=1080; c.height=1350; const g=c.getContext('2d');
  const D='"Barlow Condensed", "Arial Narrow", sans-serif', B='Barlow, system-ui, sans-serif';
  g.fillStyle='#13281c'; g.fillRect(0,0,1080,1350);
  g.fillStyle='#1c5a39'; g.fillRect(0,0,1080,14);
  g.fillStyle='#e2b21c'; g.font=`700 34px ${D}`; g.fillText('STROKES GAINED',80,110);
  g.fillStyle='#ffffff'; g.font=`700 76px ${D}`; wrapText(g,r.course,80,200,920,80);
  g.fillStyle='#a9c2b2'; g.font=`500 36px ${B}`; g.fillText(`${fmtDate(r.date)} · shot ${t.score} (${t.score-t.par>=0?'+':''}${t.score-t.par})`,80,300);
  g.fillStyle=t.total>=0?'#4cc27a':'#f06b5b'; g.font=`700 200px ${D}`; g.fillText(f1(t.total),70,500);
  g.fillStyle='#a9c2b2'; g.font=`500 34px ${B}`; g.fillText(`strokes gained vs ${baseText(S.base,r)}`,80,560);
  const max=Math.max(2,...CATS.map(([k])=>Math.abs(t[k])));
  CATS.forEach(([k,l],i)=>{ const y=660+i*105, cx=640, half=230, w=Math.abs(t[k])/max*half;
    g.fillStyle='#ffffff'; g.font=`500 38px ${B}`; g.fillText(l,80,y+14);
    g.fillStyle='#1f3a2b'; g.fillRect(cx-half,y-12,half*2,30);
    g.fillStyle=t[k]>=0?'#4cc27a':'#f06b5b'; g.fillRect(t[k]>=0?cx:cx-w,y-12,w,30);
    g.fillStyle='#a9c2b2'; g.fillRect(cx-1,y-20,2,46);
    g.fillStyle=t[k]>=0?'#4cc27a':'#f06b5b'; g.font=`700 48px ${D}`; g.textAlign='right'; g.fillText(f1(t[k]),1000,y+16); g.textAlign='left'; });
  const tiles=[['Fairways',st.fw==null?'–':st.fw+'%'],['Greens',st.gir==null?'–':st.gir+'%'],['Putts',String(Math.round(st.putts*st.holes/18))]];
  tiles.forEach(([l,v],i)=>{ const x=80+i*320; g.fillStyle='#1f3a2b'; roundRect(g,x,1110,290,150,18); g.fillStyle='#a9c2b2'; g.font=`500 30px ${B}`; g.fillText(l,x+28,1160); g.fillStyle='#ffffff'; g.font=`700 64px ${D}`; g.fillText(v,x+28,1232); });
  return c.toDataURL('image/png');
}
function wrapText(g,text,x,y,maxW,lh){ const words=String(text).split(/\s+/); const lines=['']; for(const w of words){ const cur=lines[lines.length-1]; const test=cur?cur+' '+w:w; if(g.measureText(test).width>maxW&&cur){ if(lines.length===2){ lines[1]=cur+'…'; break; } lines.push(w); } else lines[lines.length-1]=test; } lines.forEach((l,i)=>g.fillText(l,x,y+i*lh)); }
function roundRect(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); g.fill(); }

// ================= actions =================
function newSetup(){ S.setup={name:'',cond:[],date:today(),hcp:fmtHcp(S.hcp),courseId:null,holes:Array.from({length:18},(_,i)=>({par:PARS9[i%9],len:TYPICAL_LEN[PARS9[i%9]]}))}; }
function startRound(){
  const st=S.setup; const name=st.name.trim()||'Unnamed course';
  const h=parseHcp(st.hcp); if(h!=null&&h!==S.hcp){ S.hcp=h; lsSet('sg.hcp',h); }
  S.round={id:'r'+Date.now(),date:st.date||today(),course:name,hcp:h!=null?h:S.hcp,cond:[...(st.cond||[])],saved:false,holes:st.holes.map((x,i)=>ex(i+1,x.par,Number(x.len)||TYPICAL_LEN[x.par]))};
  S.idx=0; S.editHole=false; saveDraft(); saveCourse(name,st.holes,st.courseId);
}
async function saveCourse(name,holes,id){
  const course={id:id||('c'+Date.now()),name,holes:holes.map(h=>({par:Number(h.par),len:Number(h.len)||TYPICAL_LEN[h.par]}))};
  const i=S.courses.findIndex(c=>c.id===course.id||c.name.toLowerCase()===name.toLowerCase());
  if(i>=0){ course.id=S.courses[i].id; S.courses[i]=course; } else S.courses.push(course);
  lsSet('sg.courses',S.courses);
  let ok=false;
  if(sb&&uid){ try{ const r=await sb.from('courses').upsert({id:course.id,name:course.name,holes:course.holes,created_by:uid}); ok=!r.error; }catch(e){} }
  if(!ok){ course.pending=true; lsSet('sg.courses',S.courses); }
}
let courseTimer=null;
function saveRoundCourse(){ clearTimeout(courseTimer); const r=S.round; if(!r) return; const name=r.course, holes=r.holes.map(h=>({par:h.par,len:h.len})); courseTimer=setTimeout(()=>saveCourse(name,holes,null),800); }
async function persistRound(r){
  const idx=S.rounds.findIndex(x=>x.id===r.id); const copy=JSON.parse(JSON.stringify(r)); copy.saved=true;
  if(idx>=0) S.rounds[idx]=copy; else S.rounds.push(copy);
  lsSet('sg.rounds',S.rounds);
  publishMe();
  if(sb&&uid){ const {error}=await sb.from('rounds').upsert({id:copy.id,user_id:uid,date:copy.date,data:copy,updated_at:new Date().toISOString()}); return error?'Saved on this phone. It will sync next time you have signal.':'Saved.'; }
  return 'Saved on this phone.';
}
const NEXT_SEC={score:p=>p>=4?'sec-tee':'sec-atg',teeDist:()=>'sec-atg',atg0:()=>'sec-putt',atgDist:()=>'sec-atg',putts0:()=>'sec-pen',fp:()=>'sec-pen',teeLieGreen:()=>'sec-putt'};
function setField(f,raw){
  const h=hole(); let v=raw;
  if(['score','putts','atgShots','penOther'].includes(f)) v=raw===''||raw==null?null:Number(raw);
  if(['fp','teeDist','atgDist'].includes(f)) v=toStore(f,raw);
  if(f==='atg') v=raw==='1'||raw===true;
  const wasPutts=h.putts;
  h[f]=v;
  h.unsure=(h.unsure||[]).filter(x=>x!==f);
  if(h.assumed){ h.assumed=h.assumed.filter(x=>x!==f); (ASSUME_DEPS[f]||[]).forEach(d=>{ if(h.assumed.includes(d)){ h[d]=null; h.assumed=h.assumed.filter(x=>x!==d); } }); if(!h.assumed.length) delete h.assumed; }
  if(f==='teeLie'||f==='teeDist'){ // tee shot finished inside 30 m off the green: that is where the short game starts
    if(h.teeLie&&h.teeLie!=='green'&&h.teeDist!=null&&h.teeDist<=30){ h.atg=true; h.atgLie=h.teeLie==='recovery'?'rough':h.teeLie; h.atgDist=h.teeDist; }
  }
  if(f==='atg'&&v&&!h.atgShots) h.atgShots=1;
  if(S.smart){
    if(f==='score'&&wasPutts==null) h.putts=2;
    const p=Number(h.par);
    S.scrollTo= f==='score'?NEXT_SEC.score(p) : f==='teeDist'?'sec-atg' : (f==='teeLie'&&v==='green')?'sec-putt' : (f==='atg'&&!v)?'sec-putt' : f==='fp'?'sec-pen' : (f==='putts'&&v===0)?'sec-pen' : null;
  }
  saveDraft();
}
async function syncDraftToDb(){ if(sb&&uid&&S.round){ try{ await sb.from('drafts').upsert({user_id:uid,data:{round:S.round,idx:S.idx},updated_at:new Date().toISOString()}); }catch(e){} } }

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]'); if(!b) return;
  const a=b.dataset.act, val=b.dataset.val;
  if(a!=='askdel'&&a!=='del') S.confirmDel=false;
  if(a!=='askdemo'&&a!=='cleardemo') S.confirmDemo=false;
  if(S.view==='hole'&&S.round&&['prev','next','goto','finish','home','talkfrom'].includes(a)){ commitAssumptions(hole()); saveDraft(); }
  switch(a){
    case 'tab': if(val==='stats'&&S.view==='stats') S.statsTab='overview'; S.view=val; S.viewing=null; S.saveMsg=''; window.scrollTo(0,0); break;
    case 'home': S.view='home'; S.viewing=null; S.saveMsg=''; S.editHole=false; window.scrollTo(0,0); break;
    case 'base': S.base=val; lsSet('sg.base',val); break;
    case 'mode': S.mode=val; S.openExact={}; lsSet('sg.mode',val); break;
    case 'putunit': S.putUnit=val; lsSet('sg.putunit',val); break;
    case 'fullunit': S.fullUnit=val; lsSet('sg.fullunit',val); break;
    case 'toggle': S[val]=!S[val]; lsSet('sg.'+val,S[val]); if(val==='assumeOn') saveProfile(); break;
    case 'focusgoal': { const f=S.goals.focus, i=f.indexOf(val); if(i>=0) f.splice(i,1); else f.push(val); lsSet('sg.goals',S.goals); saveProfile(); break; }
    case 'drill': S.drillOpen=val; break;
    case 'closedrill': S.drillOpen=null; break;
    case 'planshuffle': S.planSeed=(S.planSeed||1)+1; lsSet('sg.planSeed',S.planSeed); break;
    case 'planextra': { const e=S.plan.extra||(S.plan.extra=[]), i=e.indexOf(val); if(i>=0) e.splice(i,1); else e.push(val); lsSet('sg.plan',S.plan); saveProfile(); break; }
    case 'planmins': S.plan.mins=Number(val); lsSet('sg.plan',S.plan); saveProfile(); break;
    case 'planplace': { const pl=S.plan.places||(S.plan.places=[]), i=pl.indexOf(val); if(i>=0) pl.splice(i,1); else pl.push(val); lsSet('sg.plan',S.plan); saveProfile(); break; }
    case 'cleardemo': { const ids=S.rounds.filter(r=>r.demo).map(r=>r.id); S.rounds=S.rounds.filter(r=>!r.demo); lsSet('sg.rounds',S.rounds); S.goals={sets:[],focus:[]}; lsSet('sg.goals',S.goals); saveProfile(); if(sb&&uid&&ids.length) sb.from('rounds').delete().in('id',ids).then(()=>{},()=>{}); S.confirmDemo=false; break; }
    case 'askdemo': S.confirmDemo=true; break;
    case 'statswho': case 'statstab': S.statsTab=val; if(val==='mates'&&uid&&!S.mates) loadMates(); window.scrollTo(0,0); break;
    case 'scond': { const c=S.setup.cond||(S.setup.cond=[]); const i=c.indexOf(val); if(i>=0) c.splice(i,1); else c.push(val); break; }
    case 'rcond': { const r=S.viewing||S.round; const c=r.cond||(r.cond=[]); const i=c.indexOf(val); if(i>=0) c.splice(i,1); else c.push(val); if(S.viewing){ persistRound(r).then(()=>{ S.viewing=S.rounds.find(x=>x.id===r.id)||r; render(); }); } else saveDraft(); break; }
    case 'fixhole': { if(S.viewing){ S.round=JSON.parse(JSON.stringify(S.viewing)); S.viewing=null; } S.idx=Number(b.dataset.i); S.openExact={}; S.editHole=false; saveDraft(); S.view='hole'; window.scrollTo(0,0); break; }
    case 'newround': newSetup(); S.view='setup'; window.scrollTo(0,0); break;
    case 'resume': S.view='hole'; break;
    case 'pickcourse': { const c=S.courses[Number(b.dataset.i)]; S.setup.courseId=c.id; S.setup.name=c.name; S.setup.holes=c.holes.map(h=>({par:h.par,len:h.len})); break; }
    case 'nholes': { const n=Number(val); const hs=S.setup.holes; if(n<hs.length) S.setup.holes=hs.slice(0,n); else while(S.setup.holes.length<n){ const p=PARS9[S.setup.holes.length%9]; S.setup.holes.push({par:p,len:TYPICAL_LEN[p]}); } break; }
    case 'cpar': { const h=S.setup.holes[Number(b.dataset.i)]; const p=Number(val); if(Number(h.len)===TYPICAL_LEN[h.par]) h.len=TYPICAL_LEN[p]; h.par=p; break; }
    case 'startholes': startRound(); S.view='hole'; window.scrollTo(0,0); break;
    case 'starttalk': startRound(); S.view='talk'; window.scrollTo(0,0); break;
    case 'toholes': S.view='hole'; break;
    case 'talkfrom': S.view='talk'; break;
    case 'edithole': S.editHole=!S.editHole; break;
    case 'hpar': { const h=hole(); h.par=Number(val); saveDraft(); saveRoundCourse(); break; }
    case 'set': setField(b.dataset.field,val); break;
    case 'step': { const f=b.dataset.field, h=hole(); const min=f==='atgShots'||f==='score'?1:0; setField(f,Math.max(min,Number(h[f]||0)+Number(b.dataset.d))); S.scrollTo=null; break; }
    case 'openexact': S.openExact[b.dataset.field]=true; render(); { const el=document.getElementById('in_'+b.dataset.field); if(el) el.focus(); } return;
    case 'closeexact': S.openExact[b.dataset.field]=false; break;
    case 'goto': S.idx=Number(b.dataset.i); S.openExact={}; S.editHole=false; saveDraft(); window.scrollTo(0,0); break;
    case 'prev': if(S.idx>0){ S.idx--; S.openExact={}; S.editHole=false; window.scrollTo(0,0);} break;
    case 'next': S.idx++; S.openExact={}; S.editHole=false; window.scrollTo(0,0); syncDraftToDb(); break;
    case 'finish': S.round.holes.forEach(h=>commitAssumptions(h)); saveDraft(); S.view='results'; S.viewing=null; window.scrollTo(0,0); break;
    case 'open': { const r=allRounds().find(x=>x.id===b.dataset.id); S.viewing=r; S.view='results'; window.scrollTo(0,0); break; }
    case 'edit': { const r=S.viewing||S.round; S.round=JSON.parse(JSON.stringify(r)); S.viewing=null; S.idx=0; saveDraft(); S.view='hole'; break; }
    case 'save': { const r=S.round; S.saveMsg='Saving…'; render(); persistRound(r).then(msg=>{ S.round=null; lsSet('sg.draft',null); S.viewing=S.rounds.find(x=>x.id===r.id); S.saveMsg=msg; if(sb&&uid) sb.from('drafts').delete().eq('user_id',uid).then(()=>{},()=>{}); render(); }); return; }
    case 'askdel': S.confirmDel=true; break;
    case 'del': { const r=S.viewing||S.round; S.rounds=S.rounds.filter(x=>x.id!==r.id); lsSet('sg.rounds',S.rounds); if(sb&&uid) sb.from('rounds').delete().eq('id',r.id).then(()=>{},()=>{}); if(S.round&&S.round.id===r.id){S.round=null; lsSet('sg.draft',null);} S.viewing=null; S.view='home'; S.confirmDel=false; publishMe(); break; }
    case 'statscourse': S.statsCourse=val; break;
    case 'authmode': S.auth.mode=S.auth.mode==='up'?'in':'up'; S.auth.err=''; S.auth.msg=''; break;
    case 'offline': lsSet('sg.offline',true); S.view='home'; break;
    case 'signin': lsSet('sg.offline',false); S.view='auth'; break;
    case 'signout': if(sb) sb.auth.signOut(); uid=null; S.mates=null; S.sharing=false; lsSet('sg.offline',false); S.view='auth'; break;
    case 'refreshmates': loadMates(); return;
    case 'caddie': askCaddie(); return;
    case 'sharing': toggleSharing(); return;
    case 'sharecard': S.shareFrom=S.viewing; S.view='share'; S.shareImg=null; S.shareMsg=''; render(); drawCard().then(u=>{ S.shareImg=u; if(S.view==='share') render(); }).catch(()=>{ S.shareMsg="Couldn't draw the card. Use Copy summary text instead."; render(); }); window.scrollTo(0,0); return;
    case 'backresults': S.view='results'; S.viewing=S.shareFrom||null; break;
    case 'savecard': if(downloads&&S.shareImg){ const r=S.viewing||S.round; fetch(S.shareImg).then(x=>x.blob()).then(blob=>downloads.save({filename:`round-${(r.date||'')}.png`,data:blob})).then(()=>{ S.shareMsg='Saved.'; render(); }).catch(()=>{ S.shareMsg='Not saved. On your phone, press and hold the image instead.'; render(); }); } return;
    case 'copysummary': { const r=S.viewing||S.round; navigator.clipboard.writeText(roundSummaryText(r)).then(()=>{ S.shareMsg='Copied. Paste it into the group chat.'; render(); }).catch(()=>{ S.shareMsg="Couldn't copy here. "+roundSummaryText(r); render(); }); return; }
    case 'mic': toggleMic(); return;
    case 'parse': parseTalk(); return;
  }
  render();
});
// Inputs update state as you type without redrawing, so a tap on the next button is never lost.
document.addEventListener('change',e=>{ const el=e.target; if(el.id==='cadphoto'&&el.files&&el.files[0]){ const f=el.files[0]; if(S.cad.url) URL.revokeObjectURL(S.cad.url); S.cad.blob=f; S.cad.url=URL.createObjectURL(f); S.cad.res=null; S.cad.err=''; render(); } });
document.addEventListener('input',e=>{
  const el=e.target;
  if(el.dataset.cad){ S.cad[el.dataset.cad]=el.value; return; }
  if(el.dataset.auth){ S.auth[el.dataset.auth]=el.value; return; }
  if(el.dataset.me){ me.name=el.value; clearTimeout(window.__nm); window.__nm=setTimeout(()=>{ if(sb&&uid){ sb.from('profiles').upsert({id:uid,display_name:me.name}); publishMe(); } },800); return; }
  if(el.id==='talk'){ S.talk=el.value; lsSet('sg.talk',S.talk); return; }
  if(el.dataset.num){ setField(el.dataset.num,el.value); S.scrollTo=null; const st=document.getElementById('strip'); if(!st.hidden) st.innerHTML=vStrip(); return; }
  if(el.dataset.clen!=null){ S.setup.holes[Number(el.dataset.clen)].len=el.value===''?'':toStore('len',el.value); const t=document.getElementById('ctot'); if(t) t.textContent=setupTotals(); return; }
  if(el.dataset.hlen){ const v=toStore('len',el.value); if(v){ hole().len=v; saveDraft(); saveRoundCourse(); const st=document.getElementById('strip'); if(!st.hidden) st.innerHTML=vStrip(); } return; }
  if(el.dataset.hcp){ const v=parseHcp(el.value); S[el.dataset.hcp]=v; lsSet('sg.'+el.dataset.hcp,v); if(el.dataset.hcp==='hcp') publishMe(); saveProfile(); return; }
  if(el.dataset.bag){ const v=toStore('len',el.value); if(v>0) S.bag[el.dataset.bag]=v; else delete S.bag[el.dataset.bag]; lsSet('sg.bag',S.bag); saveProfile(); return; }
  if(el.dataset.setup){ S.setup[el.dataset.setup]=el.value; if(el.dataset.setup==='name') S.setup.courseId=null; return; }
});
// Redraw after leaving a box, unless focus moved to a button (that tap redraws anyway).
document.addEventListener('focusout',e=>{ const d=e.target.dataset||{}; if(d.hcp!=null||d.hlen||d.num||d.bag){ const to=e.relatedTarget; if(!(to&&to.closest&&to.closest('[data-act]'))) render(); } });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&S.drillOpen){ S.drillOpen=null; render(); return; } if(e.key==='Enter'&&e.target.dataset&&(e.target.dataset.num||e.target.dataset.hcp!=null)) e.target.blur(); });

async function toggleSharing(){
  if(!sb||!uid) return;
  S.sharing=!S.sharing; render();
  try{ const r= S.sharing ? await sb.from('players').upsert({user_id:uid,display_name:me.name||'',data:playerDoc(),updated_at:new Date().toISOString()}) : await sb.from('players').delete().eq('user_id',uid); if(r.error) throw r.error; loadMates(); }
  catch(e){ S.sharing=!S.sharing; render(); }
}

// ----- talk-through -----
function toggleMic(){
  if(!dict) return;
  if(listening){ dict.stop().catch(()=>{}); return; }
  dict.start().catch(err=>{ S.talkErr= err&&err.code==='not_granted'?'Microphone access was declined. You can still type, or use the mic on your keyboard.':''; render(); });
}
async function parseTalk(){
  if(!sample||S.busy) return;
  const text=(document.getElementById('talk')||{}).value||S.talk;
  if(text.trim().length<15){ S.talkErr='Describe at least a hole or two first.'; render(); return; }
  S.busy=true; S.talkErr=''; render();
  const holes=S.round.holes.map(h=>({hole:h.n,par:h.par,lengthM:Math.round(h.len)}));
  const prompt=`You turn a golfer's own description of their round into structured strokes-gained data. Reply with JSON only.

Course holes: ${JSON.stringify(holes)}

For every hole the golfer describes, return an object with:
- hole (number)
- score (total strokes including penalties; work it out from par/bogey/birdie words if needed)
- putts (0 if holed from off the green)
- firstPuttM (length of first putt in metres; null if putts is 0)
- teeLie (par 4 and 5 only: where the tee shot finished: "fairway", "rough", "sand", "recovery" for trees/punch-outs, or "green"; null on par 3s)
- teeDistM (par 4/5 only: metres left to the hole after the tee shot; if they took a penalty drop, the distance from the drop; if they re-teed after OB, where the second tee ball finished)
- teePenalty ("none", "drop", or "retee")
- shortGame (true if they played a chip, pitch or bunker shot from within 30 m of the hole but off the green)
- atgLie ("fairway" for fringe/fairway, "rough" or "sand"; for the FIRST such shot)
- atgDistM (metres from the hole for the FIRST such shot)
- atgShots (number of short-game shots before reaching the green, usually 1)
- otherPenalties (penalty strokes not from the tee shot)
- unsure (array of the field names above that you had to guess or infer)

Units: this golfer usually measures full shots in ${isYd()?'yards':'metres'} and putts in ${isFt()?'feet':'metres'}; assume those unless they say otherwise. Convert everything to metres: yards x 0.914, feet x 0.305, one pace is about 0.9 m.
Check that score adds up: tee shot(s) + approach shots + short-game shots + putts + penalties. If something is missing, make a sensible guess and list it in unsure.
Leave out holes they do not mention.

Reply exactly as: {"holes":[...],"notes":"one short sentence about anything ambiguous, or empty"}

The golfer's description:
"""
${text}
"""`;
  try{
    let res;
    if(typeof sample.json==='function') res=await sample.json(prompt,{modelTier:'default'});
    else { const o=await sample(prompt,{modelTier:'default'}); const m=(o.text||'').match(/\{[\s\S]*\}/); res=JSON.parse(m?m[0]:'{}'); }
    const list=(res&&Array.isArray(res.holes))?res.holes:[];
    if(!list.length) throw {message:'No holes found'};
    const map={score:'score',putts:'putts',firstPuttM:'fp',teeLie:'teeLie',teeDistM:'teeDist',teePenalty:'teePen',shortGame:'atg',atgLie:'atgLie',atgDistM:'atgDist',atgShots:'atgShots',otherPenalties:'penOther'};
    const okLie=['fairway','rough','sand','recovery','green'];
    let first=null;
    list.forEach(x=>{ const h=S.round.holes.find(y=>y.n===Number(x.hole)); if(!h) return; if(first==null) first=S.round.holes.indexOf(h);
      const num=v=>v==null||v===''||isNaN(Number(v))?null:Math.round(Number(v)*10)/10;
      h.score=num(x.score); h.putts=num(x.putts); h.fp=num(x.firstPuttM);
      if(h.par>=4){ h.teeLie=okLie.includes(x.teeLie)?x.teeLie:null; h.teeDist=h.teeLie==='green'?null:num(x.teeDistM); h.teePen=['drop','retee'].includes(x.teePenalty)?x.teePenalty:'none'; }
      h.atg=!!x.shortGame; h.atgLie=h.atg&&['fairway','rough','sand'].includes(x.atgLie)?x.atgLie:(h.atg?'rough':null); h.atgDist=h.atg?num(x.atgDistM):null; h.atgShots=h.atg?(num(x.atgShots)||1):1;
      h.penOther=num(x.otherPenalties)||0;
      h.unsure=(Array.isArray(x.unsure)?x.unsure:[]).map(k=>map[k]).filter(Boolean);
      if(!hsg(h).ok && !h.unsure.length) h.unsure=['score'];
    });
    S.busy=false; S.idx=first||0; saveDraft(); S.view='hole'; window.scrollTo(0,0); render();
  }catch(err){
    S.busy=false;
    S.talkErr= err&&err.code==='not_granted'?'Claude access was declined for this page. Enter hole by hole instead.':err&&err.code==='rate_limited'?'Claude is busy right now. Wait a minute and try again.':"Couldn't turn that into a scorecard. Try naming each hole, e.g. \"1st:\", \"2nd:\".";
    render();
  }
}

// ================= boot =================
if(S.round&&!S.round.saved){ S.idx=Math.max(0,S.round.holes.findIndex(h=>h.score==null)); }
render();
// ----- accounts and sync (Supabase) -----
async function loadAll(){
  if(!sb||!uid) return;
  const [rs,dr,cs,pr]=await Promise.all([
    sb.from('rounds').select('data').eq('user_id',uid),
    sb.from('drafts').select('data,updated_at').eq('user_id',uid).maybeSingle(),
    sb.from('courses').select('id,name,holes'),
    sb.from('profiles').select('display_name,data').eq('id',uid).maybeSingle()
  ]);
  if(pr.data&&pr.data.display_name) me.name=pr.data.display_name;
  const pd=pr.data&&pr.data.data;
  if(pd&&pd.at&&pd.at>lsGet('sg.profileAt',0)){ if(pd.hcp!==undefined){ S.hcp=pd.hcp; lsSet('sg.hcp',S.hcp); } if(pd.goal!==undefined){ S.goal=pd.goal; lsSet('sg.goal',S.goal); } if(pd.bag){ S.bag=pd.bag; lsSet('sg.bag',S.bag); } if(pd.assumeOn!=null){ S.assumeOn=pd.assumeOn; lsSet('sg.assumeOn',S.assumeOn); } if(pd.goals){ S.goals=pd.goals; lsSet('sg.goals',S.goals); } if(pd.plan){ S.plan=pd.plan; lsSet('sg.plan',S.plan); } lsSet('sg.profileAt',pd.at); }
  else if(!pd||!pd.at) saveProfile();
  if(!rs.error){
    const remote=(rs.data||[]).map(x=>x.data).filter(r=>r&&r.id&&Array.isArray(r.holes));
    const ids=new Set(remote.map(r=>r.id));
    const localOnly=S.rounds.filter(r=>!ids.has(r.id)&&!r.example);
    S.rounds=[...remote,...localOnly]; lsSet('sg.rounds',S.rounds);
    for(const r of localOnly){ await sb.from('rounds').upsert({id:r.id,user_id:uid,date:r.date,data:r,updated_at:new Date().toISOString()}); }
  }
  // In-progress round: whichever copy (this phone or the server) was changed most recently wins.
  const srv=dr.data&&dr.data.data&&dr.data.data.round?dr.data.data:null;
  const srvAt=srv?Date.parse(dr.data.updated_at)||0:0, locAt=lsGet('sg.draftAt',0);
  const localDraft=S.round&&!S.round.saved;
  if(srv&&(!localDraft||srvAt>locAt)){ S.round=srv.round; S.idx=srv.idx||0; lsSet('sg.draft',S.round); lsSet('sg.draftAt',srvAt); }
  else if(localDraft&&locAt>srvAt){ syncDraftToDb(); }
  if(!cs.error){ const remoteC=(cs.data||[]).filter(c=>c&&c.id&&c.name&&Array.isArray(c.holes)); const cids=new Set(remoteC.map(c=>c.id)); const pend=S.courses.filter(c=>!cids.has(c.id)&&c.pending); for(const c of pend){ const r=await sb.from('courses').upsert({id:c.id,name:c.name,holes:c.holes,created_by:uid}); if(!r.error) delete c.pending; } S.courses=[...remoteC,...pend]; lsSet('sg.courses',S.courses); }
  await loadMates();
  render();
}
async function loadMates(){
  if(!sb||!uid) return;
  S.matesState='loading'; if(S.view==='stats'&&S.statsTab==='mates') render();
  const {data,error}=await sb.from('players').select('user_id,display_name,data');
  if(error){ S.matesState='slow'; if(S.view==='stats'&&S.statsTab==='mates') render(); return; }
  S.mates=(data||[]).map(p=>({...(p.data||{}),_id:p.user_id}));
  (data||[]).forEach(p=>{ S.names[p.user_id]=p.display_name||''; });
  S.sharing=S.mates.some(p=>p._id===uid);
  S.matesState='ok';
  if(S.sharing&&!S.pubOnce){ S.pubOnce=true; publishMe(); }
  if(S.view==='stats'||S.view==='home') render();
}
S.auth={mode:'in',email:'',password:'',name:'',busy:false,err:'',msg:''};
function vAuth(){
  const A=S.auth, up=A.mode==='up';
  return `<div class="stack" style="padding-top:40px">
    <div><span class="brand">Strokes Gained</span><h1 style="margin-top:8px">${up?'Create your account':'Welcome back'}</h1></div>
    <p class="muted" style="margin:0">${up?'Your rounds sync to your account, and you can compare with your mates.':'Sign in to pick up your rounds on this phone.'}</p>
    <form class="card stack" data-form="auth">
      ${up?`<div><label class="small muted" for="aname">Your name (shown to your mates)</label><input id="aname" class="field" autocomplete="name" data-auth="name" value="${esc(A.name)}" required></div>`:''}
      <div><label class="small muted" for="aemail">Email</label><input id="aemail" class="field" type="email" autocomplete="email" inputmode="email" data-auth="email" value="${esc(A.email)}" required></div>
      <div><label class="small muted" for="apass">Password</label><input id="apass" class="field" type="password" autocomplete="${up?'new-password':'current-password'}" minlength="6" data-auth="password" value="${esc(A.password)}" required></div>
      ${A.err?`<div class="err">${esc(A.err)}</div>`:''}${A.msg?`<div class="flagnote">${esc(A.msg)}</div>`:''}
      <button class="btn big primary" type="submit" ${A.busy?'disabled':''}>${A.busy?'<span class="spinner"></span> One moment…':up?'Create account':'Sign in'}</button>
    </form>
    <button class="btn ghost" data-act="authmode">${up?'Already have an account? Sign in':'New here? Create an account'}</button>
    <button class="btn ghost small" data-act="offline">Use without an account on this phone</button>
  </div>`;
}
document.addEventListener('submit',async e=>{
  if(!e.target.dataset||e.target.dataset.form!=='auth') return;
  e.preventDefault();
  const A=S.auth; A.busy=true; A.err=''; A.msg=''; render();
  try{
    if(A.mode==='up'){
      const {data,error}=await sb.auth.signUp({email:A.email.trim(),password:A.password,options:{data:{display_name:A.name.trim()}}});
      if(error) throw error;
      if(!data.session){ A.msg='Check your email to confirm your account, then sign in.'; A.mode='in'; }
    } else {
      const {error}=await sb.auth.signInWithPassword({email:A.email.trim(),password:A.password});
      if(error) throw error;
    }
  }catch(err){ A.err=(err&&err.message)||'Something went wrong. Try again.'; }
  A.busy=false; A.password=''; render();
});
async function onSession(session){
  uid=session&&session.user?session.user.id:null;
  me.email=session&&session.user?session.user.email:'';
  me.name=session&&session.user&&session.user.user_metadata?(session.user.user_metadata.display_name||''):'';
  if(uid){ if(S.view==='auth'){ S.view='home'; } render(); loadAll(); }
  else if(CONFIGURED&&!lsGet('sg.offline',false)){ S.view='auth'; render(); }
}
if(CONFIGURED&&window.supabase){
  sb=window.supabase.createClient(window.SG_CONFIG.supabaseUrl,window.SG_CONFIG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}});
  sb.auth.getSession().then(({data})=>onSession(data.session));
  sb.auth.onAuthStateChange((ev,session)=>{ if(ev==='SIGNED_IN'||ev==='SIGNED_OUT') onSession(session); });
}
window.addEventListener('online',()=>{ if(uid) loadAll(); });
if('serviceWorker' in navigator&&location.protocol==='https:') navigator.serviceWorker.register('sw.js').catch(()=>{});
