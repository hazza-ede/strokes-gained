
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

// Stroke index for clubs we know (men's card, same across the men's tees)
const KNOWN_SI={'glenelg':[17,1,8,14,16,2,9,4,12,5,6,18,10,15,7,13,3,11]};
function knownSI(name){ const c=String(name||'').toLowerCase(); const k=Object.keys(KNOWN_SI).find(x=>c.includes(x)); return k?KNOWN_SI[k]:null; }
function fillSI(holes,name){ const si=knownSI(name); if(!si||!holes||holes.length!==18) return false; let ch=false; holes.forEach((h,i)=>{ if(h.si==null||h.si===''){ h.si=si[i]; ch=true; } }); return ch; }
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
  smart:lsGet('sg.smart',true), clubs:lsGet('sg.clubs',false), assumeOn:false,
  bag:lsGet('sg.bag',{}), goals:lsGet('sg.goals',{sets:[],focus:[]}), plan:lsGet('sg.plan',{mins:45,places:['range','green']}), toughOut:lsGet('sg.toughOut',false), block:lsGet('sg.block',null), statsWho:'me', statsTab:'overview', planSeed:lsGet('sg.planSeed',1),
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
const isYd=()=>S.fullUnit==='yd', isFt=()=>true; // putts are always in feet
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
// First-putt buckets follow the PGA Tour's ShotLink putting ranges: inside 3 ft, 3–5, 5–10, 10–15, 15–20, 20–25, over 25 ft
// (metres: 1, 1.5, 3, 4.5, 6, 7.5).
const PUTT_BK=['3','5','10','15','20','25','long'];
function puttBucket(m){ const t=isFt()?[3*FT,5*FT,10*FT,15*FT,20*FT,25*FT]:[1,1.5,3,4.5,6,7.5]; const i=t.findIndex(x=>m<x); return PUTT_BK[i<0?6:i]; }
function appBucket(m){ const t=isYd()?[100*YD,150*YD,200*YD]:[100,150,200]; return m<t[0]?'app-100':m<=t[1]?'app-150':m<=t[2]?'app-200':'app-200p'; }
function moverInfo(k){
  const u=fullU(), f=isFt();
  return {
    'putt-3':[f?'Putts inside 3 ft':'Putts inside 1 m',`Tap-in range. Hole 50 in a row from ${f?'2 ft':'60 cm'}, then ${f?'3 ft':'1 m'}, and keep the same routine on the course.`],
    'putt-5':[f?'Putts from 3–5 ft':'Putts from 1–1.5 m',`Gate drill from ${f?'4 ft':'1.2 m'}: two tees just wider than the ball. Hole 20 in a row before you leave.`],
    'putt-10':[f?'Putts from 5–10 ft':'Putts from 1.5–3 m',`Clock drill at ${f?'6 and 8 ft':'2 and 2.5 m'}: six balls round the hole, full routine each one. Tour players hole about half from 8 ft.`],
    'putt-15':[f?'Putts from 10–15 ft':'Putts from 3–4.5 m',`Read and roll from ${f?'10–15 ft':'3–4.5 m'}: commit to a start line and get the speed to finish just past the hole.`],
    'putt-20':[f?'Putts from 15–20 ft':'Putts from 4.5–6 m',`Ladder from ${f?'15 and 20 ft':'4.5 and 6 m'}: every putt has to finish within ${f?'2 ft':'60 cm'} past the hole if it misses.`],
    'putt-25':[f?'Putts from 20–25 ft':'Putts from 6–7.5 m',`Two-putt game from ${f?'20–25 ft':'6–7.5 m'}: every first putt has to finish inside ${f?'3 ft':'a metre'}.`],
    'putt-short':[f?'Putts inside 6 ft':'Putts inside 2 m',`Gate drill: two tees just wider than the ball, 50 putts from ${f?'3–6 ft':'1–2 m'} before each round.`],
    'putt-mid':[f?'Putts from 6–20 ft':'Putts from 2–6 m',`Ladder drill at ${f?'6, 12 and 18 ft':'2, 4 and 6 m'}. Commit to a start line and stay at each distance until you hole 7 of 10.`],
    'putt-long':[f?'Lag putts over 25 ft':'Lag putts over 7.5 m',`Speed work: putt from ${f?'30, 45 and 60 ft':'10, 15 and 20 m'} and try to finish every ball within ${f?'3 ft':'a metre'} past the hole.`],
    'app-100':[`Approaches inside 100 ${u}`,'Build a wedge chart: three swing lengths with each wedge, ten balls each, and write down the carries.'],
    'app-150':[`Approaches from 100–150 ${u}`,`On the range, call a target at 110, 130 or 150 ${u} before each ball and score how many finish within 10 ${u}.`],
    'app-200':[`Approaches from 150–200 ${u}`,'Aim at the middle of the green, not the flag, and take enough club to get there.'],
    'app-recovery':['Recovery shots','From the trees or after a big miss, take the safe way back to the fairway. One shot to escape beats two at a hero gap.'],
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
// recovery: tee shot into trees, or more shots than a normal approach needs with no chip to explain them
function isRecovery(h){
  const par=Number(h.par); if(h.score==null||h.score==='') return false;
  if(par>=4&&h.teeLie==='recovery') return true;
  const P=shotParts(h); const normal=par===5?2:1;
  return !h.atg&&P.nApp>normal+1;
}
function needleMovers(rounds){
  const acc={}; let holes=0, total=0;
  const add=(k,v)=>{ acc[k]=acc[k]||{v:0,n:0}; acc[k].v+=v; acc[k].n++; };
  rounds.forEach(r=>{ const b=resolveBase('goal',r);
    r.holes.forEach(h=>{ const s=holeSG(h,b); if(!s.ok) return; holes++; total+=s.total; const par=Number(h.par);
      if(par>=4) add(h.teePen&&h.teePen!=='none'?'ott-pen':(h.teeLie==='sand'||h.teeLie==='recovery')?'ott-trouble':h.teeLie==='rough'?'ott-rough':'ott-fw', s.ott);
      if(s.nApp>0||Number(h.penOther)>0) add(isRecovery(h)?'app-recovery':appBucket(par===3?Number(h.len):(h.teeLie==='green'?0:Number(h.teeDist))), s.app);
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
  let fwO=0,fw=0,gO=0,g=0,scO=0,sc=0,udO=0,ud=0,sdO=0,sd=0,rec=0,putts=0,three=0,pens=0,holes=0,score=0,par=0;
  rounds.forEach(r=>r.holes.forEach(h=>{ if(h.score==null) return; const p=Number(h.par),s=h.pickup?netDouble(h,r.hcp):Number(h.score),pu=Number(h.putts||0);
    holes++; score+=s; par+=p; putts+=pu;
    if(p>=4&&h.teeLie){ fwO++; if((h.teeLie==='fairway'||h.teeLie==='green')&&(h.teePen||'none')==='none') fw++; }
    const gir = pu>0 ? (s-pu)<=p-2 : s<=p-2; gO++; if(gir) g++; else { scO++; if(s<=p) sc++; }
    if(h.atg){ udO++; if(Number(h.atgShots||1)===1&&pu<=1) ud++; if(h.atgLie==='sand'){ sdO++; if(Number(h.atgShots||1)===1&&pu<=1) sd++; } }
    if(isRecovery(h)) rec++;
    if(pu>=3) three++; pens+=(h.teePen&&h.teePen!=='none'?1:0)+Number(h.penOther||0);
  }));
  const k=holes?18/holes:0, pct=(a,b)=>b?Math.round(a/b*100):null;
  return {holes,toPar:(score-par)*k,putts:putts*k,three:three*k,pens:pens*k,fw:pct(fw,fwO),fwN:[fw,fwO],gir:pct(g,gO),girN:[g,gO],scr:pct(sc,scO),ud:pct(ud,udO),udN:[ud,udO],sand:pct(sd,sdO),sandN:[sd,sdO],rec:rec*k,recN:rec};
}
function tilesHtml(st,oneRound){
  const pc=v=>v==null?'–':v+'%';
  const n=v=>v.toFixed(1);
  const t=[
    ['Fairways',pc(st.fw),oneRound?`${st.fwN[0]} of ${st.fwN[1]}`:'hit off the tee'],
    ['Greens in reg.',pc(st.gir),oneRound?`${st.girN[0]} of ${st.girN[1]}`:'on in par minus 2'],
    ['Scrambling',pc(st.scr),'par or better after missing'],
    ['Up and down',pc(st.ud),oneRound?`${st.udN[0]} of ${st.udN[1]}`:'chip or splash, then 1 putt'],
    ['Sand saves',pc(st.sand),oneRound?`${st.sandN[0]} of ${st.sandN[1]}`:'out of the bunker, then 1 putt'],
    ['Trouble holes',oneRound?String(st.recN):n(st.rec),oneRound?'recovery shots, kept apart from approach ranges':'per 18, kept apart from approach ranges'],
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
  const putts={}, app={};
  let fw=0,tees=0,pens=0;
  r.holes.forEach((h,i)=>{ const s=per[i]; if(!s.ok) return;
    if(Number(h.putts)>0){ const b=puttBucket(Number(h.fp)); putts[b]=putts[b]||[0,0]; putts[b][0]+=s.putt; putts[b][1]++; }
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
// A golfer can leave any round out of their stats (unwell, tired, a write-off). Weather tags can also be left out from My golf.
const countedRounds=()=>realRounds().filter(r=>!r.excluded);
const statRounds=()=>countedRounds().filter(r=>!(S.toughOut&&(r.cond||[]).length));
const LEAVE_WHY=[['weather','Bad weather'],['offday','Just a bad day'],['unwell','Unwell'],['other','Other']];
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
  const rs=chrono(countedRounds()), want=Math.floor(rs.length/GOAL_EVERY); let changed=false;
  // Putting used to have three wide ranges; rebuild goals made with them so they use the finer buckets.
  if(S.goals.sets.some(x=>x.items.some(g=>/^putt-/.test(g.k)&&!x.v3))){ S.goals={sets:[],focus:[]}; changed=true; }
  while(S.goals.sets.length<want){
    const k=S.goals.sets.length, upto=rs.slice(0,(k+1)*GOAL_EVERY), recent=upto.slice(-6);
    const nm=needleMovers(recent);
    const items=nm.list.slice(0,3).map(x=>({k:x.k,title:x.title,base:+x.v.toFixed(2),target:+(x.v*0.5).toFixed(2)}));
    S.goals.sets.push({n:upto.length,date:upto[upto.length-1].date,items,v3:1});
    S.goals.focus=items.slice(0,2).map(x=>x.k); changed=true;
  }
  if(changed){ lsSet('sg.goals',S.goals); saveProfile(); }
}
function moverValue(rounds,key){ const nm=needleMovers(rounds); const all=nm.all||{}; return all[key]!=null?all[key]:0; }
function goalRows(){
  const set=S.goals.sets[S.goals.sets.length-1]; if(!set) return null;
  const rs=chrono(countedRounds()), after=rs.slice(set.n);
  return {set,after:after.length,items:set.items.map(g=>{ const cur=after.length?moverValue(after,g.k):null;
    const pct=cur==null?0:Math.max(0,Math.min(1,(cur-g.base)/((g.target-g.base)||-1)));
    return {...g,cur,pct,done:cur!=null&&cur>=g.target,focus:S.goals.focus.includes(g.k)}; })};
}
const PLACES=[['range','Range'],['green','Putting green'],['short','Chipping and bunker area'],['home','Home']];
// Drill library. Each drill says which shot losses it fixes (0–1), where it can be done, how long it suits and what kind it is.
// The plan picks the best mix for the golfer's focus goals, time and places, and the Shuffle button swaps in alternatives.
// ----- Drill pictures (style D): every scene sits on the same floating island, viewed three-quarter on, with timber tees, white balls,
// a red flag, dotted white shot lines and dark pill labels. Built as inline SVG so they load instantly and work offline.
const DRILL_ART=(()=>{

const K={bg:'#F4F1EA',g0:'#8CC48F',g1:'#6DAE74',g2:'#57985F',fringe:'#4C8655',rough:'#3F7A4A',rough2:'#4A8957',sand0:'#F1E3BE',sand1:'#E2CD98',sandLip:'#C9AE73',
  peg:'#D9B888',pegTop:'#E8CDA3',pegLine:'#9C7A4A',shadow:'rgba(20,40,20,.25)',cupRim:'#2A3A2C',cup:'#121A13',line:'rgba(255,255,255,.92)',stick:'#FFFFFF',flag:'#C2402F',pill:'rgba(20,60,30,.62)',
  floor:'#D9C9AB',floorRim:'#B9A47F',wall:'#EDE6D8',water:'#6FA8C9',water2:'#8BBCD8',tree:'#2F6339',tree2:'#3D7A47'};
let _n=0;
const defs=id=>`<defs><radialGradient id="g${id}" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="${K.g0}"/><stop offset=".7" stop-color="${K.g1}"/><stop offset="1" stop-color="${K.g2}"/></radialGradient>
 <radialGradient id="b${id}" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#DDE3DF"/></radialGradient>
 <linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${K.sand1}"/><stop offset=".35" stop-color="${K.sand0}"/><stop offset="1" stop-color="${K.sand0}"/></linearGradient>
 <linearGradient id="f${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${K.g2}"/><stop offset="1" stop-color="${K.g0}"/></linearGradient></defs>`;
const svg=(id,inner)=>`<svg viewBox="0 0 340 236" width="340" height="236">${defs(id)}${inner}</svg>`;
const island=(fill,rim)=>`<ellipse cx="170" cy="136" rx="164" ry="88" fill="${rim}"/><ellipse cx="170" cy="131" rx="158" ry="83" fill="${fill}"/>`;
const greenIsland=id=>island(`url(#g${id})`,K.fringe);
const tee=(x,y)=>`<g><ellipse cx="${x+3}" cy="${y+1}" rx="4.5" ry="1.6" fill="${K.shadow}"/><path d="M${x-1.3} ${y} L${x-1.6} ${y-9} L${x+1.6} ${y-9} L${x+1.3} ${y} Z" fill="${K.peg}" stroke="${K.pegLine}" stroke-width=".6"/><ellipse cx="${x}" cy="${y-9.2}" rx="3.6" ry="1.5" fill="${K.pegTop}" stroke="${K.pegLine}" stroke-width=".6"/></g>`;
const ball=(id,x,y,r=4.6,c)=>`<ellipse cx="${x+2.5}" cy="${y+1.3}" rx="${r+1.3}" ry="${r*.42}" fill="${K.shadow}"/><circle cx="${x}" cy="${y-r+.8}" r="${r}" fill="${c||`url(#b${id})`}" stroke="#C3CBC6" stroke-width=".5"/>`;
const hole=(x,y,h=84,s=1)=>`<ellipse cx="${x}" cy="${y}" rx="${7.5*s}" ry="${3.8*s}" fill="${K.cupRim}"/><ellipse cx="${x}" cy="${y+.6}" rx="${6*s}" ry="${2.6*s}" fill="${K.cup}"/>${h?`<line x1="${x-1}" y1="${y}" x2="${x-36*s}" y2="${y+9*s}" stroke="${K.shadow}" stroke-width="2" stroke-linecap="round"/><line x1="${x}" y1="${y-1}" x2="${x}" y2="${y-h}" stroke="${K.stick}" stroke-width="${2.2*s}" stroke-linecap="round"/><path d="M${x+1} ${y-h} L${x+30*s} ${y-h+7*s} L${x+1} ${y-h+15*s} Z" fill="${K.flag}"/>`:''}`;
const rflag=(x,y,s=1)=>`<ellipse cx="${x+2}" cy="${y}" rx="${4*s}" ry="${1.4*s}" fill="${K.shadow}"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y-30*s}" stroke="#fff" stroke-width="${1.8*s}"/><path d="M${x+.5} ${y-30*s} l${16*s} ${4.5*s} l${-16*s} ${4.5*s}z" fill="${K.flag}"/>`;
const pill=(x,y,t)=>{ const w=Math.max(30,t.length*6+16); x=Math.min(318-w/2,Math.max(22+w/2,x)); return `<g transform="translate(${x} ${y})"><rect x="${-w/2}" y="-8.5" width="${w}" height="17" rx="8.5" fill="${K.pill}"/><text text-anchor="middle" y="3.6" font-size="9.5" font-weight="700" font-family="Inter,system-ui,sans-serif" fill="#fff">${t}</text></g>`; };
const path=(d,dash='1 4',w=1.3,c=K.line)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round"/>`;
const blades=pts=>pts.map(([x,y])=>`<path d="M${x} ${y} l1.5 -6 M${x+3} ${y+1} l-.5 -5.5 M${x+5} ${y} l2 -5" stroke="#2F6339" stroke-width="1" stroke-linecap="round"/>`).join('');
const ring=(cx,cy,r,o=.45)=>`<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r/2}" fill="none" stroke="rgba(255,255,255,${o})" stroke-width=".9"/>`;
const zone=(cx,cy,rx,ry)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgba(255,255,255,.22)" stroke="#fff" stroke-width="1.2" stroke-dasharray="3 3"/>`;
const mat=(x=170,y=210)=>`<path d="M${x-24} ${y-6} L${x+24} ${y-6} L${x+28} ${y+6} L${x-28} ${y+6} Z" fill="#2F6B3B"/><path d="M${x-20} ${y-5} L${x+20} ${y-5} L${x+23} ${y+4} L${x-23} ${y+4} Z" fill="#3C8048"/>`;
const rangeIsland=id=>island(K.rough2,K.rough)+`<path d="M128 52 C 150 48, 190 48, 212 52 L304 168 C 252 214, 88 214, 36 168 Z" fill="url(#f${id})"/>`+blades([[30,140],[44,160],[296,150],[312,132],[60,120],[280,118]])+mat();
const homeIsland=()=>island(K.floor,K.floorRim)+Array.from({length:7},(_,i)=>`<line x1="${30+i*44}" y1="${60+Math.abs(3-i)*8}" x2="${10+i*50}" y2="${212-Math.abs(3-i)*8}" stroke="rgba(120,90,50,.15)" stroke-width="1"/>`).join('');
const bunker=(id,cx,cy,rx,ry)=>`<ellipse cx="${cx}" cy="${cy-2}" rx="${rx+6}" ry="${ry+5}" fill="${K.sandLip}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#s${id})"/>`;
const greenOn=(id,cx,cy,rx,ry)=>`<ellipse cx="${cx}" cy="${cy+3}" rx="${rx+7}" ry="${ry+5}" fill="${K.fringe}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#g${id})"/>`;
const water=(d)=>`<path d="${d}" fill="${K.water}"/><path d="${d}" fill="none" stroke="${K.water2}" stroke-width="2" opacity=".6"/>`;
const trees=pts=>pts.map(([x,y,s=1])=>`<ellipse cx="${x+4}" cy="${y+2}" rx="${10*s}" ry="${3.5*s}" fill="${K.shadow}"/><circle cx="${x}" cy="${y-10*s}" r="${10*s}" fill="${K.tree}"/><circle cx="${x-3*s}" cy="${y-13*s}" r="${6*s}" fill="${K.tree2}"/>`).join('');
const A={}, IDS=["tee12", "gate", "clock", "fifty", "coin", "ladder", "circle", "readroll", "fringe", "lag9", "eyes", "hall", "line", "bunker5", "spot", "badlie", "bump", "fputt", "ud9", "basket", "chipladder", "wclock", "towel", "rand3", "callit", "nine", "middle", "playcourse", "layup", "hyb", "gates", "safe", "missside", "tee3", "speed", "strike"]; let ai=0; const add=(t,type,mins,where,fn)=>{ const k=IDS[ai++]; A[k]=()=>svg('d'+k,fn('d'+k)); };

// ===== Putting =====
add('12-tee drill','Pressure','10–20','Putting green',id=>{ const cx=170,cy=132,R=[44,88,132],k=.5,ang=[1,3,5,7].map(i=>i*Math.PI/4); const pts=[]; R.forEach(r=>ang.forEach(a=>pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)*k]))); pts.sort((a,b)=>a[1]-b[1]);
  const [bx,by]=[cx+88*Math.cos(ang[0]),cy+88*Math.sin(ang[0])*k];
  return greenIsland(id)+R.map(r=>ring(cx,cy,r)).join('')+pts.filter(p=>p[1]<=cy).map(p=>tee(...p)).join('')+hole(cx,cy)+path(`M${bx-7} ${by-3} C ${bx-30} ${by-2}, ${cx+30} ${cy+20}, ${cx+7} ${cy+3}`)+pts.filter(p=>p[1]>cy).map(p=>tee(...p)).join('')+ball(id,bx-7,by)+R.map((r,i)=>pill(cx+r-6,cy,['1 m','2 m','3 m'][i])).join(''); });
add('Gate drill','Technique','5–15','Putting green or home',id=>{ const hx=178,hy=82,bx=162,by=194,gx=bx+(hx-bx)*.3,gy=by+(hy-by)*.3;
  return greenIsland(id)+hole(hx,hy)+path(`M${bx} ${by-4} L${hx} ${hy+2}`)+tee(gx-12,gy)+tee(gx+12,gy)+ball(id,bx,by,5)+pill(gx+48,gy-2,'Gate')+pill(hx+42,hy+30,'1 m'); });
add('Clock drill','Pressure','10–15','Putting green',id=>{ const cx=170,cy=136,r=58; const pts=[0,1,2,3,4,5].map(i=>{ const a=-Math.PI/2+i*Math.PI/3; return [cx+r*Math.cos(a),cy+r*Math.sin(a)/2]; }).sort((a,b)=>a[1]-b[1]);
  return greenIsland(id)+ring(cx,cy,r)+pts.filter(p=>p[1]<=cy).map(p=>ball(id,...p)).join('')+hole(cx,cy)+path(`M${pts[4][0]} ${pts[4][1]-4} L${cx+3} ${cy+2}`)+pts.filter(p=>p[1]>cy).map(p=>ball(id,...p)).join('')+pill(cx+r+28,cy,'1 m'); });
add('50 in a row','Pressure','10–20','Putting green',id=>{ const hx=170,hy=96,bx=170,by=170;
  const pile=[[118,196],[128,200],[110,204],[122,208],[134,206],[104,196],[140,198],[116,214],[130,214],[144,210],[98,206],[108,214]];
  return greenIsland(id)+hole(hx,hy)+path(`M${bx} ${by-4} L${hx} ${hy+2}`)+pile.sort((a,b)=>a[1]-b[1]).map(p=>ball(id,...p,3.8)).join('')+ball(id,bx,by,5)+pill(206,134,'1 m')+pill(122,180,'50 in a row'); });
add('Coin start line','Technique','5–10','Putting green or home',id=>{ const hx=176,hy=80,bx=164,by=192,cx2=bx+(hx-bx)*.22,cy2=by+(hy-by)*.22;
  return greenIsland(id)+hole(hx,hy)+path(`M${bx} ${by-4} L${hx} ${hy+2}`)+`<ellipse cx="${cx2+1}" cy="${cy2+1}" rx="5.5" ry="2.4" fill="${K.shadow}"/><ellipse cx="${cx2}" cy="${cy2}" rx="5" ry="2.2" fill="#E3B341" stroke="#A97E1C" stroke-width=".7"/>`+ball(id,bx,by,5)+pill(cx2+46,cy2,'Coin, 30 cm')+pill(hx+46,hy+26,'Roll over it'); });
add('Ladder','Skill','10–20','Putting green',id=>{ const hx=176,hy=66; const B=[[172,118],[168,160],[163,200]];
  return greenIsland(id)+hole(hx,hy,60)+path(`M${B[2][0]} ${B[2][1]-4} L${hx} ${hy+2}`)+B.map(p=>ball(id,...p)).join('')+B.map((p,i)=>pill(p[0]+44,p[1]-3,['2 m','4 m','6 m'][i])).join('')+pill(92,150,'3 of 10 to move on'); });
add('Three-metre game','Game','10–15','Putting green',id=>{ const cx=170,cy=128,r=100; const A=[-150,-118,-70,-30,10,40,80,115,150,185].map(d=>d*Math.PI/180); const pts=A.map(a=>[cx+r*Math.cos(a),cy+r*Math.sin(a)/2]).sort((a,b)=>a[1]-b[1]);
  return greenIsland(id)+ring(cx,cy,r,.35)+pts.filter(p=>p[1]<=cy).map(p=>ball(id,...p,4)).join('')+hole(cx,cy)+pts.filter(p=>p[1]>cy).map(p=>ball(id,...p,4)).join('')+pill(cx+r+2,cy+16,'3 m')+pill(cx,cy+76,'10 different putts'); });
add('Read and roll','Skill','10–15','Putting green',id=>{ const hx=170,hy=100, a=[86,170], b=[254,170];
  return greenIsland(id)+`<path d="M60 70 L104 70" stroke="#fff" stroke-width="1.6" marker-end="url(#ar${id})"/><defs><marker id="ar${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#fff"/></marker></defs>`
   +hole(hx,hy)+path(`M${a[0]+4} ${a[1]-6} C ${a[0]+10} ${a[1]-50}, ${hx-60} ${hy+30}, ${hx-6} ${hy+2}`)+path(`M${b[0]-4} ${b[1]-6} C ${b[0]-40} ${b[1]-10}, ${hx+10} ${hy+40}, ${hx+5} ${hy+3}`)
   +ball(id,...a)+ball(id,...b)+pill(82,56,'Slope')+pill(86,194,'From above')+pill(254,194,'From below')+pill(hx+56,hy+28,'4 m'); });
add('Fringe finish','Skill','10–20','Putting green',id=>{ const hx=176,hy=88,bx=150,by=204;
  return greenIsland(id)+zone(hx+4,hy-10,26,8)+hole(hx,hy)+path(`M${bx} ${by-4} L${hx+3} ${hy-8}`)+ball(id,bx,by)+[[110,196],[196,206]].map(p=>ball(id,...p,4)).join('')+pill(hx+70,hy-10,'Finish zone')+pill(98,168,'10, 15, 20 m'); });
add('Lag nine','Game','15–25','Putting green',id=>{ const H=[[96,84],[176,64],[256,92],[128,140],[230,150]];
  return greenIsland(id)+H.map(([x,y])=>hole(x,y,32,.55)).join('')+path(`M150 206 L230 152`)+path(`M110 200 L130 142`)+ball(id,150,206)+ball(id,110,200)+pill(170,186,'9 holes · 10–20 m')+pill(270,178,'Par 2 each'); });
add('Eyes-closed lag','Technique','5–10','Putting green',id=>{ const hx=180,hy=80,bx=160,by=200;
  return greenIsland(id)+hole(hx,hy)+path(`M${bx} ${by-4} L${hx-3} ${hy+22}`)+ball(id,bx,by)+`<circle cx="${hx-3}" cy="${hy+22}" r="4.2" fill="none" stroke="#fff" stroke-width="1.2" stroke-dasharray="2 2"/>`+pill(hx+40,hy+30,'Long or short?')+pill(bx-62,by-14,'Eyes closed'); });
add('Hallway speed','Skill','5–15','Home',id=>homeIsland()+`<path d="M118 50 L222 50 L222 92 L118 92 Z" fill="${K.wall}" stroke="#CFC4AE"/><path d="M118 92 L222 92" stroke="#B9A47F" stroke-width="2"/>`
   +`<path d="M128 94 L212 94 L248 210 L92 210 Z" fill="#C9A97A" opacity=".55"/>`+zone(170,104,40,7)+path(`M168 198 L170 106`)+ball(id,168,200)+pill(170,128,'Stop within a putter length')+pill(170,40+12,'Wall'));

// ===== Chipping and bunkers =====
add('Line drill','Technique','10–15','Bunker',id=>greenIsland(id)+`<ellipse cx="226" cy="84" rx="74" ry="24" fill="${K.g0}" opacity=".7"/>`+hole(240,84,54,.75)+bunker(id,166,155,120,45)
   +`<path d="M72 168 L262 140" stroke="#7A5E2E" stroke-width="2.2" stroke-linecap="round" opacity=".75"/>`+[[96,164],[134,158],[172,153],[210,147]].map(([x,y])=>`<ellipse cx="${x-5}" cy="${y+4}" rx="9" ry="2.8" fill="rgba(122,94,46,.2)"/>`).join('')
   +[[118,176],[156,170],[194,164]].map(([x,y])=>`<path d="M${x} ${y} l6 -1 l-3 -3" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".85"/>`).join('')+pill(170,198,'Hit the line, step forward'));
add('Bunker up-and-down','Game','10–20','Bunker',id=>{ const B=[[110,166],[140,174],[170,168],[200,176],[228,166]];
  return island(K.rough2,K.rough)+greenOn(id,174,84,100,32)+hole(188,80,58,.8)+bunker(id,170,166,118,40)+B.map(p=>ball(id,...p,4.2)).join('')+path(`M170 162 Q 186 110, 200 84`,'2 4')+pill(170,204,'5 balls, hole each one')+pill(282,128,'Par 15'); });
add('Landing spot','Skill','10–15','Chipping area',id=>{ const bx=86,by=178,sx=168,sy=138,hx=248,hy=100;
  return island(K.rough2,K.rough)+greenOn(id,206,108,100,44)+blades([[40,150],[58,168],[70,196],[100,200],[124,186],[46,186],[140,204],[84,152],[110,160]])+hole(hx,hy,70,.9)
   +`<ellipse cx="${sx}" cy="${sy}" rx="10" ry="4.2" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="2 2.5"/>`+path(`M${bx+2} ${by-9} Q ${bx+30} ${by-96}, ${sx-2} ${sy-3}`,'2 4')+path(`M${sx+6} ${sy-2} L${hx-6} ${hy+2}`)+ball(id,bx,by)+pill(sx+2,sy+20,'Land here')+pill(226,128,'Let it roll'); });
add('Worst lie','Skill','10–15','Chipping area',id=>{ const hx=230,hy=92;
  return island(K.rough2,K.rough)+greenOn(id,208,104,100,42)+hole(hx,hy,64,.85)+`<path d="M64 160 Q 98 126, 132 160" fill="${K.rough}" opacity=".8"/>`
   +blades([[74,176],[82,180],[90,176],[78,184]])+ball(id,84,186,4.2)+ball(id,98,150,4.2)+ball(id,112,112,4.2)+blades([[40,196],[150,200],[120,196]])
   +pill(84,206,'Down in the rough')+pill(60,134,'On a slope')+pill(112,90,'Against the collar')+pill(246,180,'5 bad lies'); });
add('Bump and run','Skill','10–15','Chipping area',id=>{ const bx=70,by=164,lx=130,ly=136,hx=262,hy=100;
  return island(K.rough2,K.rough)+greenOn(id,200,112,108,48)+hole(hx,hy,70,.9)+path(`M${bx+2} ${by-8} Q ${bx+18} ${by-36}, ${lx} ${ly-2}`,'2 4')+path(`M${lx+4} ${ly-2} L${hx-6} ${hy+2}`)
   +`<ellipse cx="${lx}" cy="${ly}" rx="8" ry="3.4" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="2 2.5"/>`+ball(id,bx,by)+pill(86,190,'8 iron off the fringe')+pill(214,146,'Runs like a putt')+pill(118,112,'Land just on'); });
add('Putt from the fringe','Skill','5–10','Putting green',id=>{ const bx=92,by=150,hx=230,hy=104;
  return island(K.rough2,K.rough)+greenOn(id,196,116,108,50)+hole(hx,hy)+path(`M${bx+4} ${by-5} L${hx-6} ${hy+2}`)+ball(id,bx,by)+pill(92,174,'On the fringe')+pill(214,152,'Putt it when you can'); });
add('Up-and-down nine','Pressure','20–30','Chipping area',id=>{ const cx=170,cy=118; const S=[...Array(9)].map((_,i)=>{ const a=(-160+i*40)*Math.PI/180; return [cx+142*Math.cos(a),cy+66*Math.sin(a)+10]; }).sort((a,b)=>a[1]-b[1]);
  return island(K.rough2,K.rough)+greenOn(id,cx,cy,92,40)+S.filter(p=>p[1]<=cy).map(p=>ball(id,...p,4.2)).join('')+hole(cx-22,cy-2,56,.85)+S.filter(p=>p[1]>cy).map(p=>ball(id,...p,4.2)).join('')+pill(cx,cy+30,'9 spots · target 5'); });
add('Basket chips','Skill','5–15','Home',id=>{ const kx=214,ky=104;
  return homeIsland()+`<ellipse cx="${kx+4}" cy="${ky+30}" rx="30" ry="7" fill="rgba(80,60,30,.2)"/><path d="M${kx-28} ${ky} L${kx+28} ${ky} L${kx+22} ${ky+30} L${kx-22} ${ky+30} Z" fill="#EFE7D6" stroke="#B9A47F"/><ellipse cx="${kx}" cy="${ky}" rx="28" ry="7" fill="#D9CDB4" stroke="#B9A47F"/>`
   +[0,1,2,3].map(i=>`<line x1="${kx-24+i*16}" y1="${ky+4}" x2="${kx-19+i*13}" y2="${ky+29}" stroke="#CDBF9F"/>`).join('')+path(`M110 186 Q 150 60, ${kx-4} ${ky-2}`,'2 4',1.4,'#8A6E44')+ball(id,110,190,4.6,'#F6E58D')+ball(id,92,198,4.2,'#F6E58D')+ball(id,126,202,4.2,'#F6E58D')+pill(110,166,'5 m')+pill(kx+2,ky+48,'Foam balls'); });
add('Chip ladder','Technique','10–15','Chipping area',id=>{ const bx=70,by=182, L=[[128,152],[176,128],[224,104]], hx=262,hy=90;
  return island(K.rough2,K.rough)+greenOn(id,196,114,106,48)+hole(hx,hy,60,.8)+L.map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="9" ry="3.8" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="2 2.5"/>`).join('')
   +L.map(([x,y],i)=>path(`M${bx+2} ${by-8} Q ${(bx+x)/2} ${by-40-i*22}, ${x} ${y-2}`,'2 4')).join('')+ball(id,bx,by)+L.map(([x,y],i)=>pill(x+4,y+18,['3 paces','6','9'][i])).join('')+pill(76,206,'One club'); });

// ===== Approach (range) =====
add('Wedge clock','Technique','15–25','Range',id=>rangeIsland(id)+[[150,150,.6],[176,112,.75],[198,76,.9]].map(([x,y,s])=>rflag(x,y,s)).join('')+[[150,152],[176,114],[198,78]].map(([x,y],i)=>path(`M170 202 Q ${(170+x)/2-10} ${y-30-i*10}, ${x} ${y}`,'2 4')).join('')+pill(110,152,'Short')+pill(126,112,'Half')+pill(150,72,'Full')+pill(250,180,'Note every carry'));
add('Landing towel','Skill','10–15','Range or chipping area',id=>rangeIsland(id)+`<path d="M152 120 L194 120 L198 134 L148 134 Z" fill="#FFFFFF" stroke="#D9D9D0"/><path d="M152 124 L194 124" stroke="#E7A8A0" stroke-width="2"/>`+path(`M170 202 Q 150 100, 168 126`,'2 4')+path(`M170 202 Q 196 112, 180 128`,'2 4')+pill(170,150,'Towel, 30–60 m')+pill(260,182,'Land it on the towel'));
add('Random three','Pressure','10–20','Range',id=>rangeIsland(id)+rflag(132,150,.6)+rflag(206,110,.75)+rflag(160,76,.9)+path(`M170 202 Q 220 140, 206 112`,'2 4')+pill(100,152,'40 m')+pill(244,112,'60 m')+pill(120,72,'80 m')+pill(250,184,'Random order'));
add('Call it','Game','10–20','Range',id=>rangeIsland(id)+rflag(140,130,.65)+rflag(202,96,.8)+rflag(162,68,.9)+path(`M170 202 Q 210 120, 202 98`,'2 4')+pill(106,132,'110 m')+pill(240,98,'130 m')+pill(124,66,'150 m')+pill(250,184,'Call it before you hit'));
add('Nine-ball flight','Skill','15–20','Range',id=>rangeIsland(id)+rflag(170,80,.9)+[-1,0,1].map(c=>[0,1,2].map(h=>path(`M170 202 Q ${170+c*55} ${170-h*45}, 170 82`,'1 3',1.1)).join('')).join('')+pill(90,140,'Draw')+pill(250,140,'Fade')+pill(170,60,'Low · mid · high'));
add('Middle of the green','Skill','10–15','Range',id=>rangeIsland(id)+greenOn(id,170,92,52,16)+rflag(206,92,.8)+zone(170,92,12,5)+path(`M170 202 L170 94`)+pill(128,120,'Aim here')+pill(240,112,'Not the flag')+pill(250,184,'5 or 6 iron'));
add('Play Glenelg on the range','Game','25–40','Range',id=>rangeIsland(id)+zone(150,130,30,10)+greenOn(id,200,76,30,10)+rflag(204,76,.7)+path(`M170 202 Q 140 150, 150 132`,'2 4')+path(`M150 130 Q 180 80, 200 78`,'2 4')+pill(100,136,'Tee shot')+pill(254,82,'Approach')+pill(250,184,'Hole 1 of 9'));
add('Layup ladder','Skill','10–15','Range',id=>rangeIsland(id)+rflag(170,70,.9)+zone(146,124,22,7)+path(`M170 202 Q 200 110, 172 72`,'2 4')+path(`M170 202 Q 140 150, 146 126`,'2 4')+pill(228,94,'Long club')+pill(96,128,'Layup')+pill(250,184,'Compare the finish'));
add('Hybrid vs long iron','Skill','10–20','Range',id=>rangeIsland(id)+rflag(170,72,.9)+path(`M170 202 Q 150 100, 164 76`,'2 4')+path(`M170 202 Q 204 110, 180 78`,'2 4',1.3,'#F3D9A4')+pill(110,110,'Hybrid')+pill(234,110,'Long iron')+pill(214,64,'200 m'));

// ===== Driving =====
add('Fairway gates','Game','10–20','Range',id=>island(K.rough2,K.rough)+`<path d="M128 56 C 150 52, 190 52, 212 56 L300 170 C 250 214, 90 214, 40 170 Z" fill="url(#f${id})"/>`+blades([[30,140],[44,160],[296,150],[312,132],[60,120],[280,118]])+mat()
   +rflag(118,84)+rflag(222,84)+path(`M168 202 Q 138 120, 120 88`,'2 4')+path(`M172 202 Q 204 120, 220 88`,'2 4')+tee(170,212)+ball(id,170,205,4)+pill(118,104,'Target 1')+pill(222,104,'Target 2')+pill(170,70,'30 m apart'));
add('Safe club','Skill','10–15','Range',id=>island(K.rough2,K.rough)+`<path d="M140 50 C 160 46, 186 46, 204 50 L262 170 C 228 212, 112 212, 78 170 Z" fill="url(#f${id})"/>`+water(`M228 60 C 270 70, 300 110, 300 150 C 286 160, 262 150, 250 120 C 240 96, 226 80, 228 60 Z`)+trees([[60,110],[48,140,1.1],[74,90,.9]])+mat()
   +`<line x1="140" y1="104" x2="140" y2="88" stroke="#fff" stroke-width="2"/><line x1="200" y1="104" x2="200" y2="88" stroke="#fff" stroke-width="2"/>`+path(`M170 202 Q 160 140, 168 100`,'2 4')+tee(170,212)+ball(id,170,205,4)+pill(170,120,'30 m gate')+pill(110,184,'3 wood or hybrid')+pill(276,186,'Water'));
add('Pick your miss side','Skill','10–15','Range',id=>island(K.rough2,K.rough)+`<path d="M130 50 C 152 46, 188 46, 210 50 L290 170 C 246 212, 94 212, 50 170 Z" fill="url(#f${id})"/>`+water(`M232 56 C 280 64, 310 110, 314 150 C 296 160, 270 150, 258 118 C 248 94, 234 76, 232 56 Z`)+mat()
   +`<path d="M170 204 L104 86 L176 80 Z" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.5)" stroke-dasharray="3 3"/>`+path(`M170 204 L136 84`)+tee(170,212)+ball(id,170,205,4)+pill(126,70,'Aim left of centre')+pill(196,130,'Your miss stays dry')+pill(280,188,'Water right'));
add('Name it tee test','Pressure','10–15','Range',id=>rangeIsland(id)+rflag(186,84,.85)+path(`M170 202 Q 150 120, 184 86`,'2 4')+tee(170,212)+ball(id,170,205,4)+`<g transform="translate(110 150)"><rect x="-58" y="-18" width="116" height="30" rx="12" fill="#fff"/><path d="M30 12 l14 12 l-2 -12z" fill="#fff"/><text text-anchor="middle" y="1" font-size="10" font-weight="700" font-family="Inter,system-ui,sans-serif" fill="#1E3B29">Target · shape · club</text></g>`+pill(250,184,'Say it, then commit'));
add('Speed sets','Technique','10–15','Range or home',id=>rangeIsland(id)+`<g transform="translate(170 196)">${[0,1,2,3,4].map(i=>`<path d="M${-70+i*4} ${-20-i*12} A 80 70 0 0 0 ${70-i*4} ${-20-i*12}" fill="none" stroke="#fff" stroke-width="${2.6-i*.4}" opacity="${.85-i*.15}" stroke-linecap="round"/>`).join('')}</g>`+tee(170,212)+ball(id,170,205,4)+pill(170,96,'Full speed')+pill(90,186,'3 × 5 swings')+pill(250,186,'Rest between sets'));
add('Strike check','Technique','10–15','Range',id=>`<rect width="340" height="236" fill="none"/><ellipse cx="174" cy="132" rx="128" ry="76" fill="rgba(20,40,20,.12)"/><path d="M56 120 C 60 66, 150 46, 230 56 C 300 64, 318 116, 300 160 C 284 198, 200 206, 130 198 C 72 192, 52 160, 56 120 Z" fill="#2C2F33"/><path d="M70 122 C 74 76, 150 60, 226 68 C 290 76, 304 116, 290 154 C 276 186, 200 192, 134 186 C 84 180, 66 156, 70 122 Z" fill="#3A3E43"/>`
   +[0,1,2,3,4,5,6].map(i=>`<line x1="${92}" y1="${88+i*14}" x2="${282}" y2="${88+i*14}" stroke="rgba(255,255,255,.08)" stroke-width="1.4"/>`).join('')+`<ellipse cx="184" cy="128" rx="30" ry="22" fill="rgba(255,255,255,.08)" stroke="#fff" stroke-dasharray="3 3"/>`
   +[[176,124],[190,132],[168,138],[214,110],[150,150]].map(([x,y],i)=>`<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="rgba(255,255,255,${i<3?.75:.45})"/>`).join('')+pill(184,172,'Centre strikes')+pill(250,92,'Foot spray on the face')+pill(110,212,'10 drives'));

return A;
})();
const DRILL_STEPS={
 gate:['Find a straight putt about 1 m from the hole.','Push two tees in just wider than a ball, about 30 cm in front of it.','Roll every putt through the gate and into the hole. Clip a tee and your start line was off.','Score: makes out of 30.'],
 clock:['Place six balls in a circle 1 m from the hole, like the numbers on a clock.','Hole all six, then move the circle out to 1.5 m.','Miss one and start that circle again.','Score: the longest run of makes.'],
 fifty:['Find a straight 1 m putt and tip out a pile of balls beside you.','Hole 50 in a row with your full routine on every putt.','Miss one and the count goes back to zero.','Score: your best run. Keep going until you hit 50 or your time is up.'],
 coin:['Set up a straight 2–3 m putt. Place a coin on your line about 30 cm in front of the ball.','Roll every putt over the coin. Ignore the hole and focus on the start line.','At home, putt along the carpet towards a target with the coin in the same spot.','Score: putts over the coin, out of 20.'],
 ladder:['Line up balls at 2, 4 and 6 m from one hole.','Start at 2 m and stay there until you hole 3 out of 10.','Move back to 4 m, then 6 m. Read every putt as if it counts.','Score: the total number of balls it took to finish the ladder.'],
 circle:['Pick ten different 3 m putts around the practice green: uphill, downhill and breaking both ways.','Play each one with your full routine, one ball only.','Tour players hole about 4 in 10 from this distance.','Score: makes out of 10.'],
 readroll:['Find a 4 m putt with plenty of break.','Hit balls from above the hole, then from below it, and watch how the line changes.','Try one firm and one dying at the hole from each side to see how speed changes break.','Score: makes out of 10.'],
 fringe:['Pick a hole and putt from 10, 15 and 20 m.','Your target is to finish every ball between the hole and one putter length past it.','Short counts as a miss, even if it is close.','Score: balls in the finish zone, out of 15.'],
 lag9:['Pick nine holes on the practice green, each 10–20 m from the last.','Play them like a round: one ball, putt out every hole.','Two putts is par on each hole.','Score: your total against 18.'],
 eyes:['Set up a long putt, 10 m or more.','Look at the hole, then close your eyes and make your stroke.','Before you open them, call long, short or good.','Score: correct calls out of 10. It trains your feel for distance.'],
 hall:['Find a hallway or long room with a wall at the end.','Putt towards the wall and try to stop the ball within a putter length of it.','Touching the wall counts as a miss.','Score: out of 10.'],
 line:['Draw a straight line in the sand across your stance.','Hit the sand on the line or just behind it. No ball needed to start.','Step forward along the line after each swing, then add a ball once you are hitting it every time.','Score: clean splashes in a row.'],
 bunker5:['Drop five balls in a greenside bunker.','Play each one out and putt it into the hole.','Count every shot, splash and putt.','Score: total shots. Par is 15.'],
 spot:['Drop balls in the rough near the green.','Pick a landing spot one pace onto the green, then let the ball roll out to the hole.','Use more loft than you think. Out of the rough the ball comes out with less spin.','Score: balls finishing inside 2 m, out of 15.'],
 badlie:['Drop five balls in tough spots: down in the rough, on a slope, against the collar.','Chip each one to the same hole.','Work out the shot that gets each one closest, not the prettiest one.','Score: balls inside 2 m, out of 15.'],
 bump:['Set up just off the green on the fringe or short grass.','Use an 8 iron and a putting-style stroke.','Land the ball just onto the green and let it run like a putt.','Score: balls inside a metre, out of 15.'],
 fputt:['Set up a few balls just off the edge of the green.','Putt them instead of chipping. When you can putt it, putt it.','Hit it a touch firmer to get through the fringe.','Score: balls inside a metre, out of 10.'],
 ud9:['Drop a ball at nine different spots around the green: rough, fringe and bunker.','From each spot, chip and putt until the ball is in the hole.','Getting down in two is an up-and-down.','Score: up-and-downs out of 9. The target is 5.'],
 basket:['Put a laundry basket 5 m away on the floor.','Chip foam balls into it, changing your lie and the distance each time.','Use your normal chipping action and a soft landing.','Score: balls in the basket, out of 20.'],
 chipladder:['Take one club, like a 9 iron, to the edge of the green.','Land a ball 3 paces onto the green, then 6, then 9.','Change only the length of your swing, not your grip or setup.','Score: balls landing within a club length of each spot, out of 15.'],
 wclock:['Take each of your wedges to the range.','Hit five balls each with a short, half and full swing.','Write down the carry of every swing in your phone.','Score: a full wedge chart. Add the numbers to My bag.'],
 towel:['Lay a towel on the range or practice ground 30–60 m away.','Land wedges on the towel, changing your swing length to change the distance.','Move the towel every ten balls.','Score: towel hits out of 20.'],
 rand3:['Pick targets at 40, 60 and 80 m.','Before every ball, pick one of them at random, never the same one twice in a row.','Go through your full routine every time, like on the course.','Score: balls within 5 m of the target, out of 15.'],
 callit:['Pick targets at 110, 130 and 150 m.','Say the target out loud before each ball, then change it every shot.','Pick the club for each one as you would on the course.','Score: balls within 10 m, out of 15.'],
 nine:['Pick one target in the middle of the range.','Hit nine shots: low, medium and high, each one a draw, straight and a fade.','Say the shot before you hit it.','Score: shots that did what you called, out of 9.'],
 middle:['Take a 5 or 6 iron and find the biggest green or target on the range.','Aim at the middle of it every time, not at the flag.','Notice how many would have found the green even when you missed your line.','Score: balls within 15 m of the middle, out of 10.'],
 playcourse:['Play the first nine at Glenelg in your head on the range.','For each hole, hit your tee club to a fairway-wide target, then your approach club to a green-sized target.','Use the club you would really use, and play a recovery if the tee shot misses.','Score: fairways and greens hit, out of 9 each.'],
 layup:['Pick a target too far for your wedges.','Hit one long club at it, then one layup to your favourite wedge distance.','Alternate ten times and compare where each finishes.','Score: layups that finish in your wedge window, out of 10.'],
 hyb:['Pick a target about 200 m away.','Hit ten balls with your hybrid and ten with your long iron.','Keep the club that finishes closer more often in the bag for that distance.','Score: balls within 20 m with each club, out of 10.'],
 gates:['Pick two targets on the range about 30 m apart, like two fairways.','Alternate drives between them, changing your aim every ball.','Go through your full routine every time.','Score: fairways hit, out of 14.'],
 safe:['Think of your three tightest tee shots at your course.','Pick a 30 m wide gate on the range and hit the club you would use on those holes.','Pick the club that keeps it in play, not the one that goes furthest.','Score: balls inside the gate, out of 12.'],
 missside:['Think about where your misses usually go.','Picture trouble on that side, like water right if you usually miss right.','Aim so that your normal miss still finishes safe.','Score: balls that finish safe, out of 12.'],
 tee3:['Before each drive, say out loud your target, the shape of the shot and the club.','Then commit fully and hit it.','Rate each drive: fairway 2 points, rough 1, trouble 0.','Score: points out of 20.'],
 speed:['Take your driver, or an alignment stick at home.','Make five swings as fast as you can, then rest for 30 seconds.','Do three sets. Speed comes from practising swinging fast.','Score: try to feel faster in each set.'],
 strike:['Spray foot powder or dry shampoo on the face of your driver.','Hit ten drives and check where each one marked the face.','Adjust your tee height and ball position until the marks are in the centre.','Score: centre strikes out of 10.']
};
const D=(id,t,areas,places,min,max,type,how,score)=>({id,t,areas,places,min,max,type,how,score});
const DRILL_LIB=[
  Object.assign(D('tee12','12-tee drill',{'putt-short':1,'putt-mid':.6},['green'],10,20,'Pressure','Twelve tees around one hole: four at each of three distances, on four sides. Hole every putt, ring by ring.','Clear all 12. Count how many putts it took.'),{
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
// Drills were written for three putting ranges; spread them over the finer buckets.
const PUTT_SPREAD={'putt-short':{'putt-3':1,'putt-5':1,'putt-10':.6},'putt-mid':{'putt-10':1,'putt-15':1,'putt-20':1,'putt-25':.5},'putt-long':{'putt-20':.5,'putt-25':1,'putt-long':1}};
DRILL_LIB.forEach(d=>{ Object.entries(d.areas).forEach(([k,v])=>{ const sp=PUTT_SPREAD[k]; if(sp) Object.entries(sp).forEach(([nk,w])=>{ d.areas[nk]=Math.max(d.areas[nk]||0,v*w); }); }); Object.keys(PUTT_SPREAD).forEach(k=>delete d.areas[k]); });

DRILL_LIB.forEach(d=>{ if(DRILL_ART[d.id]) d.art=DRILL_ART[d.id]; if(!d.steps&&DRILL_STEPS[d.id]){ const st=DRILL_STEPS[d.id]; d.steps=()=>st; } });
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
  const f={score:0,par:0,holes:0,three:0,fw:0,gir:0,ud:0,pens:0,birdies:0,bogeyFreeRun:0,longMake:0,putts:0,one:0,dbl:0,trip:0,pars:0,parRun:0,birdRun:0,eagle:0,ace:0,backDbl:0,front:0,back:0,fNine:[0,0],bNine:[0,0]}; let run=0,prun=0,brun=0;
  const sg=roundSG(r,String(myHcp(r)));
  r.holes.forEach((h,i)=>{ if(h.score==null) return; const p=Number(h.par),s=h.pickup?netDouble(h,r.hcp):Number(h.score),pu=Number(h.putts||0); f.holes++; f.score+=s; f.par+=p;
    if(pu>=3) f.three++; if(p>=4&&(h.teeLie==='fairway'||h.teeLie==='green')&&(h.teePen||'none')==='none') f.fw++;
    if(pu>0?(s-pu)<=p-2:s<=p-2) f.gir++; if(h.atg&&Number(h.atgShots||1)===1&&pu<=1) f.ud++;
    f.pens+=(h.teePen&&h.teePen!=='none'?1:0)+Number(h.penOther||0); if(s<p) f.birdies++;
    run=s<=p?run+1:0; f.bogeyFreeRun=Math.max(f.bogeyFreeRun,run);
    f.putts+=pu; if(pu===1) f.one++; if(s-p>=2) f.dbl++; if(s-p>=3) f.trip++; if(s<=p) f.pars++;
    prun=s<=p?prun+1:0; f.parRun=Math.max(f.parRun,prun); brun=s<p?brun+1:0; f.birdRun=Math.max(f.birdRun,brun);
    if(s<=p-2) f.eagle++; if(s===1) f.ace++; if(i>=9&&s-p>=2) f.backDbl++;
    const nine=i<9?f.fNine:f.bNine; nine[0]++; if(s<=p+1) nine[1]++;
    if(pu===1&&Number(h.fp)>f.longMake&&!(h.assumed||[]).includes('fp')) f.longMake=Number(h.fp); });
  f.bogeyNine=(f.fNine[0]===9&&f.fNine[1]===9)||(f.bNine[0]===9&&f.bNine[1]===9);
  f.sg=sg.t; return f;
}
// ---- achievements: levels follow your handicap ----
const LEVELS=[{n:1,name:'20+',lo:20,next:'15',nextTxt:'15 handicap'},{n:2,name:'15–20',lo:15,next:'10',nextTxt:'10 handicap'},{n:3,name:'10–15',lo:10,next:'5',nextTxt:'5 handicap'},{n:4,name:'5–10',lo:5,next:'0',nextTxt:'scratch golfer'},{n:5,name:'Under 5',lo:-99,next:'0',nextTxt:'scratch golfer'}];
const levelOf=h=>LEVELS.find(l=>Number(h)>=l.lo)||LEVELS[4];
const SG_AREAS=[['ott','Off the tee'],['app','Approach'],['atg','Short game'],['putt','Putting']];
// [id, area, title, unit, fact, lowerIsBetter, targets Lv1..Lv5]
const STAT_BADGES=[
  ['putts','Putting','Tidy putter','putts in a round','putts',1,[32,31,30,29,28]],
  ['three','Putting','No-drama greens','3-putts in a round','three',1,[2,1,1,0,0]],
  ['one','Putting','One and done','one-putts in a round','one',0,[4,5,6,7,8]],
  ['fw','Off the tee','Fairway finder','fairways hit','fw',0,[6,7,8,9,10]],
  ['pens','Off the tee','Clean sheet','penalty shots','pens',1,[2,1,1,0,0]],
  ['gir','Approach','Flag hunter','greens in regulation','gir',0,[4,6,8,10,12]],
  ['ud','Short game','Scrambler','up and downs','ud',0,[2,2,3,3,4]],
  ['dbl','Scoring','Damage control','doubles or worse','dbl',1,[4,3,2,1,0]]];
const tgtTxt=(lower,t,unit)=>lower?(t===0?`No ${unit}`:`${t} or fewer ${unit}`):`${t}+ ${unit}`;
const MILESTONES={
  1:[['Broke 100','Under 100 strokes',f=>f.score<100],['Broke 95','Under 95 strokes',f=>f.score<95],['Par train','3 pars in a row',f=>f.parRun>=3],['Par express','4 pars in a row',f=>f.parRun>=4],['Six pack','6 pars or better in a round',f=>f.pars>=6],['No big numbers','No triple bogeys or worse',f=>f.trip===0],['Bogey nine','A nine at bogey or better',f=>f.bogeyNine]],
  2:[['Broke 90','Under 90 strokes',f=>f.score<90],['Par express','4 pars in a row',f=>f.parRun>=4],['Eight is great','8 pars or better in a round',f=>f.pars>=8],['Strong finish','No doubles on the back nine',f=>f.backDbl===0],['First birdie','Make a birdie',f=>f.birdies>=1]],
  3:[['Broke 85','Under 85 strokes',f=>f.score<85],['Broke 80','Under 80 strokes',f=>f.score<80],['Par streak','5 pars in a row',f=>f.parRun>=5],['Double figures','10 pars or better in a round',f=>f.pars>=10],['Birdie pair','2 birdies in a round',f=>f.birdies>=2],['Bogey-free nine','9 holes in a row at par or better',f=>f.bogeyFreeRun>=9]],
  4:[['Broke 80','Under 80 strokes',f=>f.score<80],['Broke 75','Under 75 strokes',f=>f.score<75],['Birdie hunter','3 birdies in a round',f=>f.birdies>=3],['Par machine','12 pars or better in a round',f=>f.pars>=12],['Bogey-free nine','9 holes in a row at par or better',f=>f.bogeyFreeRun>=9],['No doubles','A full round without a double',f=>f.dbl===0]],
  5:[['Level best','Even par or better',f=>f.score<=f.par],['Bogey-free','A full round at par or better on every hole',f=>f.bogeyFreeRun>=18],['Birdie hunter','3 birdies in a round',f=>f.birdies>=3],['Birdie blitz','4+ birdies in a round',f=>f.birdies>=4],['Back to back','2 birdies in a row',f=>f.birdRun>=2],['Hat-trick','3 birdies in a row',f=>f.birdRun>=3],['Fourteen','14 pars or better in a round',f=>f.pars>=14]]};
function achievements(view){
  const rs=chrono(countedRounds()); const facts=rs.map(r=>({r,f:roundFacts(r),lv:levelOf(myHcp(r)).n})); const full=facts.filter(x=>x.f.holes>=18);
  const cur=levelOf(S.hcp!=null?S.hcp:10); const vn=view||cur.n;
  // stat badges: a level counts once you've reached it, from a round played at that level or better
  const stats=STAT_BADGES.map(([id,area,t,unit,k,lower,tg])=>{
    const meets=(v,L)=>lower?v<=tg[L-1]:v>=tg[L-1];
    const levels=tg.map((x,i)=>{ const L=i+1; const hit=full.find(y=>y.lv>=L&&meets(y.f[k],L)); return {L,target:x,when:hit?hit.r.date:null,locked:L>cur.n}; });
    const mine=full.filter(y=>y.lv>=cur.n); const vals=mine.map(y=>y.f[k]); const best=vals.length?(lower?Math.min(...vals):Math.max(...vals)):null;
    const bestR=best==null?null:mine.find(y=>y.f[k]===best);
    const now=levels[vn-1]; const gap=best==null?null:Math.abs(best-now.target);
    return {id,area,t,unit,lower,levels,now,best,bestR,gap,desc:tgtTxt(lower,now.target,unit)};
  });
  // strokes-gained badges (measured against your own handicap, so they scale on their own)
  const sgs=full.map(x=>({...x,me:x.f.sg,up:roundSG(x.r,levelOf(myHcp(x.r)).next).t}));
  const firstWhere=fn=>{ const x=sgs.find(fn); return x?x.r.date:null; };
  const upAreas=SG_AREAS.map(([k,l])=>{ const x=sgs.find(y=>y.up[k]>=0); return {k,l,when:x?x.r.date:null}; });
  let fixed=null; for(let i=3;i<sgs.length&&!fixed;i++){ const prev=sgs.slice(i-3,i); const avg=k=>prev.reduce((a,y)=>a+y.me[k],0)/3; const weak=SG_AREAS.map(a=>a[0]).sort((a,b)=>avg(a)-avg(b))[0]; if(sgs[i].me[weak]>0) fixed={when:sgs[i].r.date,area:SG_AREAS.find(a=>a[0]===weak)[1]}; }
  let cons=null,consBest={n:0,l:''}; SG_AREAS.forEach(([k,l])=>{ let run=0; sgs.forEach(y=>{ run=y.me[k]>0?run+1:0; if(run>consBest.n) consBest={n:run,l}; if(run>=3&&!cons) cons={when:y.r.date,area:l}; }); });
  const big=SG_AREAS.map(([k,l])=>{ const x=sgs.find(y=>y.me[k]>=2); return x?{when:x.r.date,area:l}:null; }).filter(Boolean).sort((a,b)=>a.when<b.when?-1:1)[0];
  const pb=SG_AREAS.map(([k,l])=>{ if(!sgs.length) return {k,l,v:null}; const x=sgs.reduce((a,y)=>y.me[k]>a.me[k]?y:a); return {k,l,v:x.me[k],r:x.r}; });
  const sg=[
    {id:'up',t:'Punching above',d:`Play a part of your game like a ${cur.nextTxt}`,when:upAreas.filter(a=>a.when).map(a=>a.when).sort()[0]||null,areas:upAreas},
    {id:'big',t:'Big day',d:'Gain 2+ strokes on your handicap in one area',when:big&&big.when,note:big&&big.area},
    {id:'fix',t:'Weakness fixed',d:'Gain strokes in your biggest leak from the last 3 rounds',when:fixed&&fixed.when,note:fixed&&fixed.area},
    {id:'cons',t:'Locked in',d:'Gain strokes in the same area 3 rounds running',when:cons&&cons.when,note:cons?cons.area:(consBest.n?`Best run: ${consBest.n} of 3 (${consBest.l})`:'')},
    {id:'all',t:'Complete game',d:'Gain strokes in all four areas in one round',when:firstWhere(y=>SG_AREAS.every(([k])=>y.me[k]>0))},
    {id:'beat',t:'Beat your number',d:'Gain strokes on your handicap over a full round',when:firstWhere(y=>y.me.total>0)}];
  const ms=(MILESTONES[vn]||[]).map(([t,d,fn])=>{ const x=vn>cur.n?null:full.find(y=>y.lv>=vn&&fn(y.f)); return {t,d,when:x?x.r.date:null}; });
  const own=new Set(ms.map(x=>x.t)), seen=new Set(own), catchUp=[], along=[];
  for(let L=cur.n-1;L>=1;L--) (MILESTONES[L]||[]).forEach(([t,d,fn])=>{ if(seen.has(t)) return; seen.add(t); const x=full.find(y=>y.lv>=L&&fn(y.f)); (x?along:catchUp).push({t,d,band:LEVELS[L-1].name,when:x?x.r.date:null}); });
  const bb=bounceBack(rs); const n=realRounds().length;
  const every=[
    {t:'Regular',d:'Log 10 rounds',when:n>=10?'done':null,prog:`${n} of 10`},
    {t:'Bounce-back',d:'Par or better straight after a double or worse',when:facts.some(x=>x.r.holes.some((h,i)=>{ const nx=x.r.holes[i+1]; return h.score!=null&&nx&&nx.score!=null&&h.score-h.par>=2&&nx.score<=nx.par; }))?'done':null},
    {t:'Eagle',d:'Two under on a hole',when:(facts.find(x=>x.f.eagle)||{r:{}}).r.date||null},
    {t:'Hole in one',d:'The big one',when:(facts.find(x=>x.f.ace)||{r:{}}).r.date||null}];
  const all=[...stats.map(x=>x.now.when),...sg.map(x=>x.when),...ms.map(x=>x.when)];
  return {cur,vn,stats,sg,pb,ms,every,catchUp,along,earned:all.filter(Boolean).length,total:all.length};
}
function funStats(){
  const rs=realRounds(); const out=[]; if(!rs.length) return out;
  let pens=0,one=0,putted=0,made=0,longest=0,longR=null; const byPar={3:[0,0],4:[0,0],5:[0,0]}; const counts={}; const fb=[[0,0],[0,0]];
  rs.forEach(r=>{ const f=roundFacts(r); pens+=f.pens; if(f.longMake>longest){ longest=f.longMake; longR=r; }
    r.holes.forEach((h,i)=>{ if(h.score==null) return; const p=Number(h.par),s=h.pickup?netDouble(h,r.hcp):Number(h.score),pu=Number(h.putts||0); byPar[p]&&(byPar[p][0]+=s-p,byPar[p][1]++);
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
  [S.round,...(S.rounds||[])].forEach(r=>{ if(r&&!r._si){ fillSI(r.holes,r.course); r._si=1; } });
  const app=document.getElementById('app'), strip=document.getElementById('strip'), tabs=document.getElementById('tabs');
  const tabViews=['home','stats','improve','learn','mygolf'], TABL={home:'Rounds',stats:'Stats',improve:'Improve',learn:'Learn',mygolf:'My golf'};
  if(S.view==='settings') S.view='mygolf'; if(S.view==='mates'){ S.view='mygolf'; S.myTab='mates'; } if(S.statsTab==='mates'){ S.statsTab='overview'; S.view==='stats'&&(S.view='mygolf',S.myTab='mates'); }
  strip.hidden=S.view!=='hole'; tabs.hidden=!tabViews.includes(S.view);
  document.body.classList.toggle('holeview',S.view==='hole');
  const v={home:vHome,stats:vStats,mygolf:vMyGolf,improve:vImprove,learn:vLearn,auth:vAuth,setup:vSetup,hole:vHole,review:vReview,planwiz:vPlanWiz,compplay:vCompPlay,talk:vTalk,results:vResults,share:vShare}[S.view];
  app.innerHTML=v();
  if(S.view==='hole') strip.innerHTML=vStrip();
  let md=document.getElementById('modal'); if(!md){ md=document.createElement('div'); md.id='modal'; document.body.appendChild(md); }
  const dr=S.drillOpen&&drillById(S.drillOpen);
  if(dr){ if(md.dataset.id!==dr.id){ md.innerHTML=drillModalHtml(dr); md.dataset.id=dr.id; document.body.classList.add('noscroll'); startAnim(dr); const c=md.querySelector('.modal button'); if(c) c.focus(); } }
  else if(S.askNotif&&!S.celebrate){ if(md.dataset.id!=='notif'){ md.innerHTML=askNotifHtml(); md.dataset.id='notif'; document.body.classList.add('noscroll'); } }
  else if(S.celebrate){ if(md.dataset.id!=='cele'){ md.innerHTML=celebrateHtml(S.celebrate); md.dataset.id='cele'; document.body.classList.add('noscroll'); } }
  else if(S.badgeOpen){ const A=achievements(), x=A.stats.find(y=>y.id===S.badgeOpen); if(x&&md.dataset.id!=='b-'+x.id){ md.innerHTML=badgeModalHtml(x,A.cur); md.dataset.id='b-'+x.id; document.body.classList.add('noscroll'); } }
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
// ----- Headline insights: plain-English summaries at the top of each tab -----
const PLAIN={ott:'Off the tee',app:'Into the green',atg:'Around the green',putt:'On the green'}, SAY={ott:'driving',app:'approach play',atg:'chipping',putt:'putting'}, Cap=t=>t[0].toUpperCase()+t.slice(1);
const heroMode=()=>S.base==='goal'?'goal':'me';
const gl=(v,dp=1)=>Math.abs(v)<0.05?'Even':`${v>0?'Gained':'Lost'} ${Math.abs(v).toFixed(dp)}`; // plain words instead of +/−
const heroToggle=()=>`<div class="herotog" role="group" aria-label="Compare with"><button class="${heroMode()==='me'?'on':''}" data-act="base" data-val="me">vs my handicap ${esc(fmtHcp(S.hcp!=null?S.hcp:10))}</button><button class="${heroMode()==='goal'?'on':''}" data-act="base" data-val="goal">vs my goal ${esc(fmtHcp(goalHcp()))}</button></div>`;
function snap(rs,mode){ // per-18 strokes gained by part of the game vs the handicap ('me', each round's own) or the goal, plus scoring
  mode=mode||'goal'; const o={ott:0,app:0,atg:0,putt:0,total:0,score:0,n:0};
  rs.forEach(r=>{ const {t}=roundSG(r,resolveBase(mode,r)); if(!t.holes) return; const k=18/t.holes; CATS.forEach(([c])=>o[c]+=t[c]*k); o.total+=t.total*k; o.score+=t.score*k; o.n++; });
  if(o.n) ['ott','app','atg','putt','total','score'].forEach(c=>o[c]/=o.n); return o;
}
const hcpDrop=shots=>shots*0.9; // roughly: a shot a round saved takes about 0.9 off a handicap index
function heroRows(o){
  const order=CATS.map(([k])=>({k,v:o[k]})), worst=[...order].sort((a,b)=>a.v-b.v)[0], max=Math.max(1,...order.map(x=>Math.abs(x.v)));
  const word=x=>x.k===worst.k&&x.v<-0.3?['Biggest leak','bad']:x.v<=-0.3?['Losing shots','warn']:x.v>=0.3?['Strength','good']:['On track','ok'];
  return `<div class="herorows">${order.map(x=>{ const [w,c]=word(x); const pct=Math.round(Math.abs(x.v)/max*50); return `<div class="herorow"><span>${PLAIN[x.k]}</span><span class="hw ${c}">${w}</span><div class="hbar"><i style="${x.v<0?`right:50%;width:${pct}%`:`left:50%;width:${pct}%`}" class="${x.v<0?'neg':'pos'}"></i></div><b class="num ${x.v>0.05?'gpos':x.v<-0.05?'gneg':''}">${gl(x.v)}</b></div>`; }).join('')}</div>`;
}
function heroHome(){
  const rs=chrono(statRounds()).slice(-10); if(!rs.length) return '';
  const mode=heroMode(), o=snap(rs,mode), parts=CATS.map(([k])=>({k,v:o[k]})), worst=[...parts].sort((a,b)=>a.v-b.v)[0], best=[...parts].sort((a,b)=>b.v-a.v)[0];
  const h=S.hcp!=null?S.hcp:10, g=esc(fmtHcp(goalHcp())), fix=Math.abs(Math.min(0,worst.v)), playing=Math.max(-5,h-hcpDrop(o.total));
  let head;
  if(mode==='me') head = o.total>=0.5?`You're playing better than your handicap.`:o.total<=-0.5?`You're a little off your handicap lately.`:`You're playing right to your handicap.`;
  else head = worst.v<-0.3?`${Cap(SAY[worst.k])} is what's standing between you and ${g}.`:`You're already playing like a ${g} golfer.`;
  return `<div class="hero">
    ${heroToggle()}
    <span class="eyebrow">Your game in 10 seconds · last ${rs.length} round${rs.length>1?'s':''}</span>
    <h2 class="herohead">${head}</h2>
    ${mode==='me'?`<div class="herostat"><b class="num">${fmtHcp(Math.round(playing*10)/10)}</b><span>is the handicap you've been playing to.<br>${o.total>=0.05?`That's <b>${o.total.toFixed(1)} shots a round better</b> than your ${fmtHcp(h)}.`:o.total<=-0.05?`That's <b>${Math.abs(o.total).toFixed(1)} shots a round</b> off your ${fmtHcp(h)}.`:`Right on your ${fmtHcp(h)}.`}</span></div>`:''}
    ${heroRows(o)}
    ${fix>=0.3?`<div class="herofix"><span>Fix your ${SAY[worst.k]} and you'd average</span><b class="num">${Math.round(o.score-fix)}</b><span>instead of <b class="num">${Math.round(o.score)}</b>${mode==='goal'?`. That's about <b>${hcpDrop(fix).toFixed(1)}</b> off your handicap.`:'.'}</span></div>`:''}
    ${best.v>=0.3?`<span class="herofoot">Your ${SAY[best.k]} is your strength: you gain ${best.v.toFixed(1)} a round there.</span>`:''}
  </div>`;
}
function heroRound(r){
  const mode=heroMode(), base=resolveBase(mode,r), {t}=roundSG(r,base); if(!t.holes||r.example) return '';
  const k=18/t.holes, o={total:t.total}; CATS.forEach(([c])=>o[c]=t[c]); const who=mode==='me'?`your ${fmtHcp(myHcp(r))} handicap`:`a ${fmtHcp(goalHcp())} golfer`;
  const tot=t.total, head=tot>=0.5?`You played <span class="hl">${tot.toFixed(1)} shots better</span> than ${who}.`:tot<=-0.5?`You were <span class="hl">${Math.abs(tot).toFixed(1)} shots</span> off ${who}.`:`You played right to ${who}.`;
  return `<div class="hero">
    ${heroToggle()}
    <span class="eyebrow">How you played${t.holes<18?` · ${t.holes} holes`:''}</span>
    <h2 class="herohead">${head}</h2>
    ${heroRows(o)}
  </div>`;
}
function heroStats(){
  const rs=chrono(statRounds()); if(!rs.length) return '';
  const g=esc(fmtHcp(goalHcp()));
  if(rs.length<4){ const o=snap(rs); return `<div class="hero"><span class="eyebrow">Your scoring · ${rs.length} round${rs.length>1?'s':''}</span><h2 class="herohead">You're averaging ${Math.round(o.score)} and your best is ${Math.min(...rs.map(r=>roundSG(r,'0').t.score))}.</h2><span class="herofoot">Play ${4-rs.length} more round${4-rs.length>1?'s':''} and this will show what's getting better and what's slipping.</span></div>`; }
  const recent=snap(rs.slice(-3)), before=snap(rs.slice(0,-3));
  const ch=CATS.map(([k])=>({k,d:recent[k]-before[k]})).sort((a,b)=>b.d-a.d), up=ch[0], down=ch[ch.length-1], sd=recent.score-before.score;
  return `<div class="hero">
    <span class="eyebrow">What's changing · last 3 rounds vs the ${rs.length-3} before</span>
    <h2 class="herohead">${sd<=-0.5?`You're scoring ${Math.abs(sd).toFixed(1)} shots better lately.`:sd>=0.5?`Your scores are up ${sd.toFixed(1)} shots lately.`:`Your scoring is steady.`}</h2>
    <div class="herochg">
      ${up.d>=0.2?`<div><span class="arrow good">▲</span><span><b>${Cap(SAY[up.k])}</b> is improving: ${f1(up.d)} a round</span></div>`:''}
      ${down.d<=-0.2?`<div><span class="arrow bad">▼</span><span><b>${Cap(SAY[down.k])}</b> has slipped: ${f1(down.d)} a round</span></div>`:''}
    </div>
    <span class="herofoot">Averaging ${Math.round(recent.score)} over your last 3 rounds.</span>
  </div>`;
}
function heroImprove(){
  const rs=chrono(statRounds()).slice(-10); if(!rs.length) return '';
  const nm=needleMovers(rs).list; if(!nm.length) return '';
  const top=nm[0], next=nm[1], shots=Math.abs(top.v), half=shots/2;
  return `<div class="hero">
    <span class="eyebrow">Your biggest win on the way to ${esc(fmtHcp(goalHcp()))}</span>
    <h2 class="herohead">${esc(top.title)} cost you <span class="hl">${shots.toFixed(1)} shots</span> a round.</h2>
    <div class="herogrid">
      <div><b class="num">${half.toFixed(1)}</b><span>shots a round if you halve it</span></div>
      <div><b class="num">${hcpDrop(half).toFixed(1)}</b><span>off your handicap</span></div>
      <div><b class="num">${Math.round(half*20)}</b><span>shots saved over a 20-round season</span></div>
    </div>
    ${next?`<span class="herofoot">Next biggest: ${esc(next.title.toLowerCase())}, ${Math.abs(next.v).toFixed(1)} a round.</span>`:''}
  </div>`;
}
// Home: one number, four tiles, one takeaway.
function heroHome2(){
  const rs=chrono(statRounds()).slice(-10); if(!rs.length) return '';
  // Each round is measured against the handicap the golfer had that day, so "playing to" uses the average of those.
  const mode=heroMode(), o=snap(rs,mode), me_=mode==='me'?o:snap(rs,'me'), h=Math.round(rs.reduce((a,r)=>a+Number(myHcp(r)),0)/rs.length*10)/10, playing=Math.max(-5,h-hcpDrop(me_.total));
  const parts=CATS.map(([k])=>({k,v:o[k]})), worst=[...parts].sort((a,b)=>a.v-b.v)[0];
  const tot=o.total, who=mode==='me'?`your ${fmtHcp(h)}`:`a ${fmtHcp(goalHcp())} golfer`;
  const line=Math.abs(tot)<0.05?`Right on ${who}`:`${Math.abs(tot).toFixed(1)} shots a round ${tot>0?'better than':'off'} ${who}`;
  const short={ott:'Driving',app:'Approach',atg:'Short game',putt:'Putting'};
  return `<div class="hero homehero">${heroToggle()}
    <span class="eyebrow">Playing to · last ${rs.length} round${rs.length>1?'s':''}</span>
    <b class="homebig num">${fmtHcp(Math.round(playing*10)/10)}</b>
    <span class="homesub">${line}</span>
    <div class="quad">${parts.map(x=>`<div class="${x.v<=-0.3?'bad':x.v>=0.3?'good':''} ${x.k===worst.k&&x.v<-0.3?'worst':''}"><b class="num">${f1(x.v)}</b><span>${short[x.k]}</span></div>`).join('')}</div>
  </div>`;
}
function homeLeak(){
  const rs=chrono(statRounds()).slice(-10); if(!rs.length) return '';
  const o=snap(rs,heroMode()), parts=CATS.map(([k])=>({k,v:o[k]})), worst=[...parts].sort((a,b)=>a.v-b.v)[0], best=[...parts].sort((a,b)=>b.v-a.v)[0], fix=Math.abs(Math.min(0,worst.v));
  if(fix>=0.3) return `<button class="leakcard" data-act="imptab" data-val="overview"><span class="ic" aria-hidden="true">⛳</span><span><b>${Cap(SAY[worst.k])} is your biggest leak</b><span class="small muted">Fix it and you'd average ${Math.round(o.score-fix)}, not ${Math.round(o.score)}</span></span><i aria-hidden="true">›</i></button>`;
  return best.v>=0.3?`<button class="leakcard" data-act="tab" data-val="stats"><span class="ic" aria-hidden="true">💪</span><span><b>${Cap(SAY[best.k])} is your strength</b><span class="small muted">You gain ${best.v.toFixed(1)} a round there</span></span><i aria-hidden="true">›</i></button>`:'';
}
function homeTiles(){
  const B=S.block, cur=B&&B.sessions.find(x=>!x.done);
  const plan=cur?`<button class="hometile" data-act="imptab" data-val="plan"><span class="eb">Next practice</span><b>${esc(moverTitle(cur.k))}</b><span class="small muted">${cur.day?dayName(cur.day)+' · ':''}${B.mins} min</span></button>`
    :`<button class="hometile" data-act="${blockLeaks().length?'wizopen':'imptab'}" data-val="plan"><span class="eb">4-week plan</span><b>Build a plan around your leaks</b><span class="small muted">Drills, tests and targets</span></button>`;
  let comp=`<button class="hometile" data-act="imptab" data-val="compete"><span class="eb">This week's challenge</span><b>Weekly tests</b><span class="small muted">See how you compare</span></button>`;
  if(uid&&S.comp.state==='idle') setTimeout(()=>loadComp(),0);
  if(uid&&S.comp.state==='ok'&&S.comp.tests.length){ const f=featuredFor(thisWeek()), band=myBand(), all=bestBy(S.comp.week.filter(r=>r.test_id===f.id&&(!r.flagged||r.user_id===uid))), mine=all.find(r=>r.user_id===uid), br=all.filter(r=>levelOf(r.hcp??30).name===band), bi=br.findIndex(r=>r.user_id===uid);
    comp=`<button class="hometile" data-act="imptab" data-val="compete"><span class="eb">This week's challenge</span><b>${esc(f.name)}</b><span class="small muted">${mine?(bi>=0&&br.length>1?`You're top ${Math.max(1,Math.round((bi+1)/br.length*100))}% · ${mine.points} pts`:`Your best: ${mine.points} pts`):'Not played yet'}</span></button>`; }
  return `<div class="hometiles">${plan}${comp}</div>`;
}
function vHome(){
  const real=statRounds(), showing=real.length?real:[EXAMPLE_ROUND];
  const avg={ott:0,app:0,atg:0,putt:0,total:0};
  showing.forEach(r=>{ const {t}=rsg(r,S.base); CATS.forEach(([k])=>avg[k]+=t[k]); avg.total+=t.total; });
  Object.keys(avg).forEach(k=>avg[k]/=showing.length);
  const draft=S.round&&!S.round.saved, rounds=allRounds(), shown=S.homeAll?rounds:rounds.slice(0,3);
  return `
  <div class="top"><span class="brand">Strokes Gained</span><span class="muted small">${uid?'Synced':'Saved on this phone'}</span></div>
  <div class="stack" style="gap:14px">
    ${draft?`<button class="btn big primary" data-act="resume">Resume round · ${esc(S.round.course)} · hole ${S.idx+1}</button>`:''}
    <button class="btn big ${draft?'':'primary'}" data-act="newround">Start a new round</button>
    ${heroHome2()}
    ${homeLeak()}
    ${homeTiles()}
    <div class="row between" style="margin-top:4px"><h3>${real.length?'Recent rounds':'Example round'}</h3>${rounds.length>3?`<button class="linkbtn small" data-act="homeall">${S.homeAll?'Show less':`See all ${rounds.length}`}</button>`:''}</div>
    <div class="card homerounds">${shown.map(r=>{ const {t}=rsg(r,S.base); return `<button class="hrr" data-act="open" data-id="${esc(r.id)}"><span><b>${esc(r.course.replace(/ – .*$/,''))}</b>${r.example?' <span class="tag">Example</span>':''}${r.demo?' <span class="tag">Sample</span>':''}${r.excluded?' <span class="tag out">Left out</span>':''}<br><span class="small muted">${fmtDate(r.date)} · shot ${t.score}</span></span><b class="num ${cls(t.total)}">${f1(t.total)}</b></button>`; }).join('')}</div>
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
const statsTabs=()=>subTabs('statstab',S.statsTab,[['overview','Overview'],['disp','Dispersion'],['detail','Deep dive'],['badges','Badges']]);
const whoSeg=()=>subTabs('mytab',S.myTab||'me',[['me','My game'],['mates','Friends']]);
function bounceHtml(rs){
  const bb=bounceBack(rs), pct=bb.blow?Math.round(bb.ok/bb.blow*100):null;
  return `<div class="card stack">${bb.blow?`<div class="row between" style="flex-wrap:nowrap"><span>After a double or worse, you made ${myHcp(null)>18?'double':'bogey'} or better on the next hole</span><b class="bigsg ${pct>=60?'pos':pct<40?'neg':''}" style="font-size:2.4rem">${pct}%</b></div>
      <span class="small muted">${bb.ok} of ${bb.blow} times. ${bb.spiral?`${bb.spiral} time${bb.spiral>1?'s':''} one big number turned into another.`:'No blow-up has turned into two yet.'}${bb.bird?` ${bb.bird} bounce-back birdie${bb.bird>1?'s':''}.`:''}</span>`:`<span class="muted">No doubles yet, so nothing to bounce back from.</span>`}</div>`;
}
const earnedTxt=w=>w==='done'?'Earned':'Earned '+esc(shortDate(w));
function badgeCard(t,d,when,note,extra=''){ return `<div class="badge ${when?'on':''}">${when?'<i class="bk">✓</i>':''}<b>${esc(t)}</b><span class="small muted">${esc(d)}</span>${extra}<span class="small ${when?'pos':'muted'}">${when?earnedTxt(when):'Not yet'}${note?` · ${esc(note)}`:''}</span></div>`; }
function levelCard(A){
  const c=A.cur;
  return `<div class="hero lvhero"><span class="eyebrow">Your badges · ${esc(c.name)} handicap</span>
    <p class="herofix">${c.n===5?`You're in the lowest band. These targets are built for low single-figure golfers.`:`Targets are set for ${esc(c.name)} handicaps. Next band: under ${c.lo}. Dropping a band usually takes a season or more of steady work, so these are for the good rounds along the way.`}</p>
    <div class="herostat"><b>${A.earned}</b><span>of ${A.total} badges earned at your handicap${A.catchUp.length?`, plus ${A.catchUp.length} still to tick off from easier bands`:''}.</span></div></div>`;
}
function statBadge(x,mode){
  const lv=x.levels.map(l=>`<i class="${l.when?'on':''} ${l.locked?'lk':''}"></i>`).join('');
  const prog=mode!=='own'||x.now.when||x.best==null?'':`<div class="bprog"><div style="width:${Math.max(8,Math.min(100,x.lower?(x.now.target+1)/(x.best+1)*100:x.best/x.now.target*100))}%"></div></div><span class="small muted">Your best: ${x.best} · ${x.gap} to go</span>`;
  const tail=mode==='ahead'?`<span class="small muted">🔒 Locked</span>`:x.now.when?`<span class="small pos">${earnedTxt(x.now.when)}</span>`:mode==='past'?`<span class="small muted">Not earned</span>`:'';
  return `<button class="badge stat ${x.now.when?'on':''} ${mode==='ahead'?'locked':''}" data-act="badge" data-val="${x.id}">${x.now.when?'<i class="bk">✓</i>':''}<span class="barea">${esc(x.area)}</span><b>${esc(x.t)}</b><span class="small muted">${esc(x.desc)}</span>${prog}${mode==='own'?`<span class="lvdots" aria-label="bands cleared">${lv}</span>`:''}${tail}</button>`;
}
function badgeModalHtml(x,cur){
  return `<div class="modalback" data-act="closebadge"></div><div class="modal" role="dialog" aria-modal="true">
    <div class="row between" style="flex-wrap:nowrap"><div><span class="barea">${esc(x.area)}</span><h2>${esc(x.t)}</h2></div><button class="btn ghost" data-act="closebadge" aria-label="Close">✕</button></div>
    <p class="muted" style="margin:0">Your target is set a little better than a typical round at your handicap. Easier targets sit below it.</p>
    <div class="ladder">${x.levels.filter(l=>l.L<=cur.n).reverse().map(l=>`<div class="rung ${l.L===cur.n?'now':''} ${l.locked?'lk':''} ${l.when?'on':''}"><span class="rl">${esc(LEVELS[l.L-1].name)}<small>handicap</small></span><b>${tgtTxt(x.lower,l.target,x.unit)}</b><span class="rs">${l.when?'✓ '+esc(shortDate(l.when)):l.locked?'Locked':l.L===cur.n?'Your band':''}</span></div>`).join('')}</div>
    ${x.best!=null?`<div class="card" style="margin:0"><span class="small muted">Your best at your handicap</span><div style="font-size:1.3rem;font-weight:700">${x.best} ${esc(x.unit)}</div><span class="small muted">${x.bestR?esc(shortDate(x.bestR.r.date))+', '+esc(x.bestR.r.course):''}</span></div>`:''}</div>`;
}
// ---- celebration after saving a round ----
function earnedMap(){
  const A=achievements(), m={};
  A.stats.forEach(x=>{ if(x.now.when) m['s:'+x.id]={t:x.t,d:x.desc,tag:x.area}; });
  A.sg.forEach(x=>{ if(x.when) m['g:'+x.id]={t:x.t,d:x.d+(x.note&&!/Best run/.test(x.note)?` (${x.note.toLowerCase()})`:''),tag:'Strokes gained'}; });
  A.ms.forEach(x=>{ if(x.when) m['m:'+x.t]={t:x.t,d:x.d,tag:'Milestone'}; });
  A.along.forEach(x=>{ m['m:'+x.t]={t:x.t,d:x.d,tag:'Ticked off · '+x.band+' band'}; });
  A.every.forEach(x=>{ if(x.when) m['e:'+x.t]={t:x.t,d:x.d,tag:'Any handicap'}; });
  const near=A.stats.filter(x=>!x.now.when&&x.gap===1).map(x=>({t:x.t,d:x.desc}));
  return {m,near};
}
function celebrateDiff(before,r){
  const after=earnedMap(); const fresh=Object.keys(after.m).filter(k=>!before.m[k]).map(k=>after.m[k]);
  if(fresh.length) S.celebrate={items:fresh,near:after.near.slice(0,2),course:r&&r.course,date:r&&r.date};
}
const MEDAL='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M16 4h6l4 12h-6z" fill="#2E7D57"/><path d="M32 4h-6l-4 12h6z" fill="#17804A"/><circle cx="24" cy="29" r="14" fill="#F2C14E"/><circle cx="24" cy="29" r="10.5" fill="none" stroke="#C99520" stroke-width="2"/><path d="M24 22.5l2 4.2 4.6.6-3.3 3.2.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.3-3.2 4.6-.6z" fill="#fff"/></svg>';
function celebrateHtml(c){
  const cols=['#FFD36E','#9BEBB6','#FFFFFF','#F2C14E','#7FD1A8','#FFB3A6'];
  const bits=Array.from({length:34},(_,i)=>`<i style="left:${(i*29)%100}%;background:${cols[i%6]};animation-delay:${-((i*37)%100)/50}s;animation-duration:${2.2+((i*13)%10)/10}s;transform:rotate(${i*47}deg)"></i>`).join('');
  const n=c.items.length;
  return `<div class="modalback" data-act="closecele"></div><div class="modal cele" role="dialog" aria-modal="true" aria-labelledby="celetitle">
    <div class="celetop"><div class="confetti" aria-hidden="true">${bits}</div><div class="bigmedal">${MEDAL}</div>
      <h2 id="celetitle">${n===1?'New badge!':`${n} new badges!`}</h2><span class="celesub">${c.course?`From your round at ${esc(c.course.replace(/ –.*$/,''))}${c.date?', '+esc(shortDate(c.date)):''}`:'From your latest round'}</span></div>
    <div class="celelist">${c.items.map((x,i)=>`<div class="celeitem" style="animation-delay:${.15+i*.12}s"><span class="cm">${MEDAL}</span><div><span class="barea">${esc(x.tag)}</span><b>${esc(x.t)}</b><span class="small muted">${esc(x.d)}</span></div></div>`).join('')}</div>
    ${c.near&&c.near.length?`<div class="celenear"><b>So close</b>${c.near.map(x=>`<span class="small">${esc(x.t)}: ${esc(x.d.toLowerCase())}. One away.</span>`).join('')}</div>`:''}
    <div class="row" style="gap:8px;flex-wrap:nowrap"><button class="btn big primary" data-act="closecele" style="flex:1">Done</button><button class="btn ghost" data-act="celebadges">See all badges</button></div></div>`;
}
function badgesHtml(){
  const A=achievements(), fs=funStats(), band=A.cur.name;
  return `${levelCard(A)}
    ${secHead('Strokes gained','Measured against your own handicap')}
    <div class="badges">${A.sg.map(x=>x.id==='up'?badgeCard(x.t,x.d,x.when,'',`<span class="achips">${x.areas.map(a=>`<em class="${a.when?'on':''}">${a.when?'✓ ':''}${esc(a.l)}</em>`).join('')}</span>`):badgeCard(x.t,x.d,x.when,x.note)).join('')}</div>
    <div class="tiles pbs">${A.pb.map(p=>`<div class="tile"><span>Best ${esc(p.l.toLowerCase())}</span><b class="${p.v>0?'pos':p.v<0?'neg':''}">${p.v==null?'–':gl(p.v)}</b><span>${p.r?esc(shortDate(p.r.date)):''}</span></div>`).join('')}</div>
    ${secHead(`Targets for ${band} handicaps`,'Tap a badge to see your best and the easier targets you\'ve cleared')}
    <div class="badges">${A.stats.map(x=>statBadge(x,'own')).join('')}</div>
    ${secHead(`Milestones for ${band} handicaps`,'')}
    <div class="badges">${A.ms.map(x=>badgeCard(x.t,x.d,x.when)).join('')}</div>
    ${A.catchUp.length?`${secHead('Still to tick off','From easier bands. Very doable at your handicap.')}
    <div class="badges">${A.catchUp.map(x=>badgeCard(x.t,x.d,null,'',`<span class="bfrom">${esc(x.band)} band</span>`)).join('')}</div>`:''}
    ${A.along.length?`<details class="along"><summary>Earned along the way <b>${A.along.length}</b></summary><div class="badges">${A.along.map(x=>badgeCard(x.t,x.d,x.when,'',`<span class="bfrom">${esc(x.band)} band</span>`)).join('')}</div></details>`:''}
    ${secHead('Any handicap','')}
    <div class="badges">${A.every.map(x=>badgeCard(x.t,x.d,x.when,x.when?'':x.prog)).join('')}</div>
    ${fs.length?`${secHead('Fun stats','The numbers worth bragging (or groaning) about')}<div class="tiles">${fs.map(([l,v,sub])=>`<div class="tile"><span>${l}</span><b>${v}</b><span>${sub}</span></div>`).join('')}</div>`:''}`;
}
const condTags=r=>(r.cond||[]).map(c=>` <span class="tag soft">${esc((CONDS.find(x=>x[0]===c)||[,c])[1])}</span>`).join('');
// ================= dispersion: where tee shots and approaches finish =================
const jit=(i,a)=>((i*37+11)%17/16-.5)*a;
function vDispersion(rs){
  const kind=S.dispKind||'tee';
  return `<div class="seg libseg">${[['tee','Tee shots'],['app','Approaches']].map(([k,l])=>`<button class="${kind===k?'on':''}" data-act="dispkind" data-val="${k}">${l}</button>`).join('')}</div>${kind==='tee'?teeDisp(rs):appDisp(rs)}`;
}
const dispEmpty=w=>`<div class="card stack"><b>Not enough ${w} yet</b><span class="muted">Every ${w==='tee shots'?'tee shot':'approach'} you tap on the hole screen adds a dot here. After about 3 rounds you'll see your pattern.</span></div>`;
function teeDisp(rs){
  const all=[]; rs.forEach(r=>r.holes.forEach(h=>{ if(Number(h.par)<4||h.teeLie==='green'||h.teeDist==null||!h.len||h.teePen==='retee') return; if(h.teeLie!=='fairway'&&!h.teeSide) return; all.push({h,drive:Number(h.len)-Number(h.teeDist)}); }));
  const clubs=CLUBS.filter(([k])=>all.some(x=>x.h.teeClub===k)), club=clubs.some(c=>c[0]===S.dispClub)?S.dispClub:'all';
  const pts=all.filter(x=>club==='all'||x.h.teeClub===club);
  const chips=clubs.length?`<div class="chips hscroll">${[['all','All clubs'],...clubs].map(([k,l])=>`<button class="chip ${club===k?'on':''}" data-act="dispclub" data-val="${k}">${l}</button>`).join('')}</div>`:'';
  if(pts.length<3) return chips+dispEmpty('tee shots');
  const u=fullU(), conv=v=>toShow('teeDist',v), ys=pts.map(p=>conv(p.drive));
  const lo=Math.floor((Math.min(...ys)-10)/10)*10, hi=Math.ceil((Math.max(...ys)+10)/10)*10;
  const W=358,H=380,x0=W/2, SX=2.85, X=x=>x0+x*SX, Y=y=>H-(y-lo)/(hi-lo)*H;
  // Left/right: fairway hits spread inside the fairway; misses sit past the fairway edge by the distance tapped.
  const xy=pts.map((p,i)=>{ const h=p.h, side=h.teeSide==='left'?-1:1, x=h.teeLie==='fairway'?jit(i,2*FW_HALF-4):side*(FW_HALF+(h.teeOff!=null?toShow('teeDist',h.teeOff):10)+jit(i,3)); return [x,conv(p.drive)]; });
  const n=xy.length, mx=xy.reduce((a,p)=>a+p[0],0)/n, my=xy.reduce((a,p)=>a+p[1],0)/n; let sxx=0,syy=0,sxy=0; xy.forEach(([x,y])=>{ sxx+=(x-mx)**2; syy+=(y-my)**2; sxy+=(x-mx)*(y-my); }); sxx/=n; syy/=n; sxy/=n;
  // ellipse in screen space
  const ax=SX, ay=H/(hi-lo), a=sxx*ax*ax, c2=syy*ay*ay, b2=-sxy*ax*ay, t=(a+c2)/2, d=Math.sqrt(((a-c2)/2)**2+b2*b2), l1=t+d, l2=Math.max(t-d,4), ang=Math.atan2(l1-a,b2||1e-6)*180/Math.PI;
  const step=(hi-lo)>60?20:10, arcs=[]; for(let v=lo+step;v<hi;v+=step) arcs.push(`<path d="M -20 ${Y(v)+14} Q ${x0} ${Y(v)-14} ${W+20} ${Y(v)+14}" stroke="rgba(255,255,255,.7)" stroke-width="1.3" fill="none"/><text x="${x0+6}" y="${Y(v)-4}" fill="#fff" font-size="13" font-family="Inter,system-ui">${v}</text>`);
  const fwN=pts.filter(p=>p.h.teeLie==='fairway').length, L=pts.filter(p=>p.h.teeSide==='left'&&p.h.teeLie!=='fairway').length, R=pts.filter(p=>p.h.teeSide==='right'&&p.h.teeLie!=='fairway').length, bad=pts.filter(p=>p.h.teeLie==='recovery'||p.h.teePen==='drop').length;
  const miss=L+R, side=R>L?'right':'left', big=Math.max(L,R);
  const say=miss<2?'You\'re keeping it in play. Keep doing what you\'re doing.':big/miss>=.65?`Most of your misses go ${side}${bad?`, and ${bad} ended in trees or a penalty`:''}. Aim down the ${side==='right'?'left':'right'} side of the fairway.`:`Your misses are split both ways, so it's a strike or start-line issue more than an aim one.`;
  return `${chips}<div class="dispbox grass"><svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block" role="img" aria-label="Tee shot dispersion: ${n} shots">
    <rect x="${X(-FW_HALF)}" y="0" width="${X(FW_HALF)-X(-FW_HALF)}" height="${H}" fill="rgba(255,255,255,.12)"/>${[-45,-35,-25,25,35,45].map(v=>`<line x1="${X(v)}" y1="22" x2="${X(v)}" y2="${H}" stroke="rgba(255,255,255,.22)" stroke-dasharray="3 5"/><text x="${X(v)}" y="${H-24}" text-anchor="middle" fill="#fff" font-size="11" font-family="Inter,system-ui" opacity=".85">${Math.abs(v)-FW_HALF}</text>`).join('')}<line x1="${x0}" y1="0" x2="${x0}" y2="${H}" stroke="rgba(255,255,255,.85)" stroke-width="1.4"/>${arcs.join('')}
    ${n>=4?`<ellipse cx="${X(mx)}" cy="${Y(my)}" rx="${2*Math.sqrt(l1)}" ry="${2*Math.sqrt(l2)}" transform="rotate(${-ang} ${X(mx)} ${Y(my)})" stroke="#fff" stroke-width="2" fill="rgba(255,255,255,.08)"/>`:''}
    ${xy.map(([x,y])=>`<circle cx="${X(x)}" cy="${Y(y)}" r="5.5" fill="#fff"/>`).join('')}
    <text x="10" y="${H-8}" fill="#fff" font-size="11" font-family="Inter,system-ui" opacity=".85">← LEFT</text><text x="${x0}" y="${H-8}" text-anchor="middle" fill="#fff" font-size="10" font-family="Inter,system-ui" opacity=".75">${u} past the fairway edge (approx.)</text><text x="${W-10}" y="${H-8}" text-anchor="end" fill="#fff" font-size="11" font-family="Inter,system-ui" opacity=".85">RIGHT →</text><text x="${x0}" y="16" text-anchor="middle" fill="#fff" font-size="11" font-family="Inter,system-ui" opacity=".85">FAIRWAY</text></svg></div>
    <div class="dstat"><div><b class="num">${Math.round(my)} ${u}</b><span>Average drive</span></div><div><b class="num">${Math.round(fwN/n*100)}%</b><span>Fairways hit</span></div><div><b class="${miss&&big/miss>=.65?'neg':''}">${miss?`${big} of ${miss} ${side}`:'None'}</b><span>Misses</span></div></div>
    <div class="card stack" style="gap:6px"><b>What it means</b><span class="small muted">${say}</span><span class="small muted">${n} tee shot${n===1?'':'s'}. Distances past the fairway edge come from where you tapped, so they're approximate.</span></div>`;
}
function appDisp(rs){
  const u=fullU(), all=[]; rs.forEach(r=>r.holes.forEach(h=>{ if(!h.appCell&&!h.appMiss) return; const par=Number(h.par); const dist=par===3?Number(h.len):(h.teeLie==='green'?null:h.teeDist); if(dist==null) return; all.push({h,dist:toShow('teeDist',dist)}); }));
  const bands=isYd()?[['all','All'],['b1','Under 100'],['b2','100–150 yd'],['b3','150–200 yd'],['b4','200+ yd']]:[['all','All'],['b1','Under 100'],['b2','100–150 m'],['b3','150–200 m'],['b4','200+ m']];
  const inB=(d,k)=>k==='all'||(k==='b1'&&d<100)||(k==='b2'&&d>=100&&d<150)||(k==='b3'&&d>=150&&d<200)||(k==='b4'&&d>=200);
  const band=S.dispBand||'all', pts=all.filter(p=>inB(p.dist,band));
  const chips=`<div class="chips hscroll">${bands.filter(([k])=>k==='all'||all.some(p=>inB(p.dist,k))).map(([k,l])=>`<button class="chip ${band===k?'on':''}" data-act="dispband" data-val="${k}">${l}</button>`).join('')}</div>`;
  if(pts.length<3) return chips+dispEmpty('approaches');
  const S2=340,c=S2/2,R=160,r=100, maxFt=isFt()?40:12;
  const on=pts.filter(p=>p.h.appCell), miss=pts.filter(p=>p.h.appMiss);
  const dots=on.map((p,i)=>{ const [ri,cj]=p.h.appCell.split('-').map(Number); let dx=cj-1, dy=ri-1; const fp=p.h.fp!=null?toShow('fp',p.h.fp):maxFt/3; const n=Math.hypot(dx,dy);
    if(!n){ const a=i*2.4; dx=Math.cos(a); dy=Math.sin(a); } else { const a=Math.atan2(dy,dx)+jit(i,.5); dx=Math.cos(a); dy=Math.sin(a); } const rad=Math.min(1,fp/maxFt)*(r-8)*(n?1:.35);
    return `<circle cx="${c+dx*rad+jit(i,6)}" cy="${c+dy*rad+jit(i+3,6)}" r="5.5" fill="#fff"/>`; }).join('');
  const cnt={}; miss.forEach(p=>cnt[p.h.appMiss]=(cnt[p.h.appMiss]||0)+1);
  const P=(a,rad)=>[c+rad*Math.cos(a*Math.PI/180),c+rad*Math.sin(a*Math.PI/180)];
  const ring=MISS8.map(([k],i)=>{ const a0=-112.5+i*45,a1=a0+45,[x1,y1]=P(a0,R),[x2,y2]=P(a1,R),[x3,y3]=P(a1,r+6),[x4,y4]=P(a0,r+6),[lx,ly]=P((a0+a1)/2,(R+r)/2+3), v=cnt[k]||0, pc=miss.length?Math.round(v/miss.length*100):0;
    return `<path d="M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r+6} ${r+6} 0 0 0 ${x4} ${y4} Z" fill="${v?`rgba(194,64,47,${.25+.6*v/Math.max(...Object.values(cnt))})`:'#4a7a38'}" stroke="#fff" stroke-width="3"/><text x="${lx}" y="${ly+5}" text-anchor="middle" fill="#fff" font-size="13" font-weight="700" font-family="Inter,system-ui">${v?pc+'%':''}</text>`; }).join('');
  const rings=[maxFt/2,maxFt].map(v=>`<circle cx="${c}" cy="${c}" r="${v/maxFt*(r-8)}" fill="none" stroke="rgba(255,255,255,.5)" stroke-dasharray="4 5"/><text x="${c+v/maxFt*(r-8)*.7+3}" y="${c-v/maxFt*(r-8)*.7}" fill="#fff" font-size="11" font-family="Inter,system-ui">${v} ${puttU()}</text>`).join('');
  const isLong=p=>p.h.appCell?p.h.appCell[0]==='0':/^long/.test(p.h.appMiss), isShort=p=>p.h.appCell?p.h.appCell[0]==='2':/^short/.test(p.h.appMiss);
  const nL=pts.filter(isLong).length, nS=pts.filter(isShort).length, gir=Math.round(on.length/pts.length*100);
  const fps=on.map(p=>p.h.fp).filter(v=>v!=null), avgFp=fps.length?toShow('fp',fps.reduce((a,b)=>a+b,0)/fps.length):null;
  const lr=nS+nL, say=lr>=3&&nS/lr>=.65?`You finish short of the flag ${Math.round(nS/lr*100)}% of the time when you're not pin-high. Take one more club.`:lr>=3&&nL/lr>=.65?`You go long more often than short. Club down or swing smoother.`:`Your distance control is balanced. Work on start line to tighten the spread.`;
  return `${chips}<div class="dispbox greenbg"><svg viewBox="0 0 ${S2} ${S2}" width="100%" style="display:block;max-width:420px;margin:0 auto" role="img" aria-label="Approach dispersion around the flag: ${pts.length} shots">${ring}<circle cx="${c}" cy="${c}" r="${r}" fill="#86c766" stroke="#fff" stroke-width="2.5"/>${rings}
    <line x1="${c}" y1="${c}" x2="${c}" y2="${c-26}" stroke="#fff" stroke-width="2"/><path d="M ${c} ${c-26} l 14 5 l -14 5 z" fill="#FFD36E"/><circle cx="${c}" cy="${c}" r="3.5" fill="#111"/>${dots}
    <text x="${c}" y="${c-r+16}" text-anchor="middle" fill="#fff" font-size="10" font-family="Inter,system-ui" opacity=".85">PAST THE FLAG</text><text x="${c}" y="${c+r-8}" text-anchor="middle" fill="#fff" font-size="10" font-family="Inter,system-ui" opacity=".85">SHORT</text></svg>
    <span class="small" style="color:#fff;opacity:.85;text-align:center">Dots: greens hit, placed by direction and first-putt length. Ring: where you missed.</span></div>
    <div class="dstat"><div><b class="num">${gir}%</b><span>Greens hit</span></div><div><b class="num">${avgFp!=null?`${avgFp.toFixed(isFt()?0:1)} ${puttU()}`:'–'}</b><span>Average first putt on greens hit</span></div><div><b class="${lr&&nS/lr>=.65?'neg':''}">${lr?`${Math.round(nS/lr*100)}% short`:'–'}</b><span>When not pin-high</span></div></div>
    <div class="card stack" style="gap:6px"><b>What it means</b><span class="small muted">${say}</span><span class="small muted">${pts.length} approach${pts.length===1?'':'es'}.</span></div>
    ${shortSidedCard(rs)}`;
}
// Short-sided misses: how often, and what the chip costs compared with a normal miss.
function shortSidedCard(rs){
  const ms=[]; rs.forEach(r=>{ const b=resolveBase('me',r); r.holes.forEach(h=>{ if(!h.appMiss) return; const g=holeSG(h,b); if(g.ok) ms.push({ss:!!h.shortSided,atg:g.atg}); }); });
  if(ms.length<3) return '';
  const ss=ms.filter(m=>m.ss), ok=ms.filter(m=>!m.ss), avg=a=>a.length?a.reduce((t,m)=>t+m.atg,0)/a.length:null, a1=avg(ss), a2=avg(ok), pc=Math.round(ss.length/ms.length*100);
  const tip=!ss.length?'None of your missed greens were short-sided. Nice course management.':pc>=35?`That's a lot. When the flag is tucked, aim for the middle of the green so you miss where there's room.`:a1!=null&&a2!=null&&a1<a2-0.15?`Your short-sided chips cost you more, but your normal chips hold up. That points to where you're missing, not how you chip.`:`Short-siding isn't a big problem for you.`;
  return `<div class="card stack" style="gap:8px"><b>Short-sided misses</b>
    <div class="dstat"><div><b class="num ${pc>=35?'neg':''}">${pc}%</b><span>Of missed greens</span></div><div><b class="num ${a1!=null?cls(a1):''}">${a1!=null?f1(a1):'–'}</b><span>Chip strokes gained, short-sided</span></div><div><b class="num ${a2!=null?cls(a2):''}">${a2!=null?f1(a2):'–'}</b><span>Chip strokes gained, normal miss</span></div></div>
    <span class="small muted">${tip}</span></div>`;
}
function vStats(){
  const real=statRounds(), anyCond=realRounds().some(r=>(r.cond||[]).length), rs=real.length?chrono(real):[EXAMPLE_ROUND], ex=!real.length;
  const top=`<div class="top"><span class="brand">Stats</span>${sampleTag(ex)}</div>${statsTabs()}`;
  const nOut=realRounds().length-real.length, tough=nOut?`<span class="small muted">${nOut} round${nOut>1?'s':''} left out of these numbers. Open a round to change it.</span>`:'';
  if(S.statsTab==='disp') return `${top}<div class="stack">${vDispersion(ex?[]:rs)}</div>`;
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
    ${heroStats()}
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
  const rs=chrono(realRounds().filter(r=>!r.demo&&!r.excluded)).slice(-30);
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
const nameOf=id=>id===uid?'You':(S.names[id]||'A friend');
function vMates(){
  if(!uid) return `<div class="top"><span class="brand">My golf</span></div><div class="stack">${whoSeg()}<div class="card stack"><h2>Compare with your friends</h2><p class="muted" style="margin:0">Sign in to compare with your friends. Your rounds still save on this phone.</p></div></div>`;
  const rows=mateRows().sort((a,b)=>b.total-a.total);
  const crowns=CATS.map(([k,l])=>{ const best=[...rows].sort((a,b)=>b[k]-a[k])[0]; return best?{l:{ott:'Best driver',app:'Best iron player',atg:'Best short game',putt:'Best putter'}[k],who:nameOf(best.id),v:best[k]}:null; }).filter(Boolean);
  const weekAgo=new Date(Date.now()-7*864e5).toISOString().slice(0,10);
  let rotw=null; (S.mates||[]).forEach(p=>(Array.isArray(p.rounds)?p.rounds:[]).forEach(r=>{ if(r&&r.sm&&String(r.date)>=weekAgo&&Number(r.holes)>0){ const v=Number(r.sm.total)*18/Number(r.holes); if(!rotw||v>rotw.v) rotw={id:p._id,v,r}; } }));
  return `
  <div class="top"><span class="brand">My golf</span><span class="small muted">${S.matesState==='loading'?'<span class="spinner"></span> Loading':S.matesState==='slow'?'Can\'t reach the group right now':'<button class="btn ghost small" data-act="refreshmates">Refresh</button>'}</span></div>
  <div class="stack">
    ${whoSeg()}
    <div class="card"><div class="setrow"><div><b>Share my stats with the group</b><div class="small muted">Everyone signed in to the app sees your rounds' strokes gained, not your hole-by-hole detail.</div></div><button class="switch ${S.sharing?'on':''}" data-act="sharing" aria-label="Share my stats" aria-pressed="${S.sharing}"></button></div></div>
    ${rotw?`<div class="card stack"><h3>Round of the week</h3><div class="row between"><div><b>${esc(nameOf(rotw.id))}</b><div class="small muted">${esc(rotw.r.course)} · ${esc(shortDate(rotw.r.date))} · shot ${Number(rotw.r.score)}</div></div><b class="bigsg ${cls(rotw.v)}" style="font-size:2rem">${f1(rotw.v)}</b></div><span class="small muted">Most strokes gained against their own handicap in the last 7 days, so it's a fair fight.</span></div>`:''}
    ${rows.length?`<div class="card stack"><h2>Leaderboard</h2><span class="small muted">Average strokes gained per 18 vs a scratch golfer, last 10 rounds each.</span>
      <div class="tbl"><table><thead><tr><th>Player</th><th>Hcp</th><th>Rounds</th><th>Tee</th><th>Appr</th><th>Short</th><th>Putt</th><th>Total</th></tr></thead><tbody>
      ${rows.map(r=>`<tr class="${r.me?'me':''}"><td>${esc(nameOf(r.id))}</td><td>${esc(fmtHcp(r.hcp))||'–'}</td><td>${r.n}</td>${['ott','app','atg','putt'].map(k=>`<td class="${cls(r[k])}">${f1(r[k])}</td>`).join('')}<td class="${cls(r.total)}"><b>${f1(r.total)}</b></td></tr>`).join('')}
      </tbody></table></div></div>
      <div class="crowns">${crowns.map(c=>`<div class="crown"><span class="small muted">${c.l}</span><div class="who">${esc(c.who)}</div><span class="small num ${cls(c.v)}">${f1(c.v)} per round</span></div>`).join('')}</div>`
    :`<div class="card stack"><h2>No one's sharing yet</h2><p class="muted" style="margin:0">Turn on sharing above once you've saved a round. Your friends do the same and the leaderboard fills in.</p></div>`}
    <div class="card small muted">To bring friends in, send them the app's link. They create an account, turn on sharing here, and they're on the leaderboard.</div>
  </div>`;
}

// ----- settings -----
function seg(act,cur,opts){ return `<div class="seg">${opts.map(([k,l])=>`<button class="${cur===k?'on':''}" data-act="${act}" data-val="${k}">${l}</button>`).join('')}</div>`; }
function vMyGolf(){
  const hc=S.hcp!=null?S.hcp:10, u=fullU();
  if(S.myTab==='mates') return vMates();
  return `
  <div class="top"><span class="brand">My golf</span></div>
  <div class="stack">
    ${whoSeg()}
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
      <span class="small muted">How far each club goes for you, carry plus roll, in ${isYd()?'yards':'metres'}. It helps the caddie suggest clubs. Leave a club blank and the app uses your rounds or a typical number for your handicap.</span>
      <div class="baggrid">${BAG.map(([k,l])=>{ const lr=learnedClub(k); return `<label for="bag_${k}">${l}</label><input id="bag_${k}" class="field num" type="number" inputmode="numeric" data-bag="${k}" value="${S.bag[k]?lenShow(S.bag[k]):''}" placeholder="${lenShow(lr||Math.round(typicalDrive(hc)*(CLUB_RATIO[k]||.7)))}"><span class="small muted">${lr?'from rounds':S.bag[k]?'':'typical'}</span>`; }).join('')}</div>
    </div>
    <div class="card">
      <h3>Units</h3>
      <div class="setrow"><span>Tee and approach distances</span>${seg('fullunit',S.fullUnit,[['m','Metres'],['yd','Yards']])}</div>
      <div class="setrow"><span>Putt lengths</span><span class="muted">Always in feet</span></div>
    </div>
    <div class="card">
      <h3>Entering a round</h3>
      <div class="setrow"><div>Distances<div class="small muted">Ranges are quicker. You can still type an exact number on any distance.</div></div>${seg('mode',S.mode,[['quick','Ranges'],['exact','Exact']])}</div>
      <div class="setrow"><div>Smart entry<div class="small muted">Assumes 2 putts once you pick a score and scrolls you to the next question.</div></div><button class="switch ${S.smart?'on':''}" data-act="toggle" data-val="smart" aria-label="Smart entry" aria-pressed="${S.smart}"></button></div>
      <div class="setrow"><div>Track tee club<div class="small muted">Adds a club pick to each tee shot and a by-club table in Stats.</div></div><button class="switch ${S.clubs?'on':''}" data-act="toggle" data-val="clubs" aria-label="Track tee club" aria-pressed="${S.clubs}"></button></div>
      <div class="setrow"><div>Leave out windy, wet or cold rounds<div class="small muted">Rounds you tagged with tough weather when you started them won't count in your averages and trends.</div></div><button class="switch ${S.toughOut?'on':''}" data-act="toggle" data-val="toughOut" aria-label="Leave out tough-weather rounds" aria-pressed="${S.toughOut}"></button></div>
    </div>
    <div class="card stack">
      <h3>Account</h3>
      ${uid?`<div><label class="small muted" for="myname">Your name (shown to your friends)</label><input id="myname" class="field" data-me="1" value="${esc(me.name)}"></div><div class="row between"><span class="small muted">${esc(me.email)}</span><button class="btn" data-act="signout">Sign out</button></div>`:CONFIGURED?`<div class="row between"><span class="small muted">Not signed in. Rounds stay on this phone.</span><button class="btn primary" data-act="signin">Sign in</button></div>`:`<span class="small muted">Accounts aren't set up yet, so rounds stay on this phone.</span>`}
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
  // A calm three-quarter view of the green: soft sage surface, fine distance rings, standing tees and a flagstick.
  const cx=170, cy=132, R=[44,88,132], k=0.5, lab=isFt()?['3 ft','6 ft','9 ft']:['1 m','2 m','3 m'];
  const ang=[Math.PI/4,3*Math.PI/4,5*Math.PI/4,7*Math.PI/4], pt=(r,d)=>[cx+r*Math.cos(ang[d]),cy+r*Math.sin(ang[d])*k];
  const peg=([x,y])=>`<g><ellipse cx="${x+3}" cy="${y+1}" rx="4.5" ry="1.6" fill="rgba(20,50,35,.18)"/><path d="M${x-1.3} ${y} L${x-1.6} ${y-9} L${x+1.6} ${y-9} L${x+1.3} ${y} Z" fill="#FBFAF6" stroke="#9AA79F" stroke-width=".6"/><ellipse cx="${x}" cy="${y-9.2}" rx="3.6" ry="1.5" fill="#FFFFFF" stroke="#9AA79F" stroke-width=".6"/></g>`;
  const all=[]; R.forEach(r=>[0,1,2,3].forEach(d=>all.push(pt(r,d)))); all.sort((p,q)=>p[1]-q[1]);
  const back=all.filter(p=>p[1]<=cy), front=all.filter(p=>p[1]>cy);
  const [bx,by]=pt(R[1],0);
  return `<svg viewBox="0 0 340 236" role="img" aria-label="Twelve tees around a hole: four each at ${lab.join(', ')}, on four sides">
    <defs>
      <radialGradient id="g12" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#DCEBDF"/><stop offset=".7" stop-color="#C6DDCB"/><stop offset="1" stop-color="#B3D0BA"/></radialGradient>
      <radialGradient id="b12" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DDE3DF"/></radialGradient>
    </defs>
    <ellipse cx="${cx}" cy="${cy+4}" rx="164" ry="86" fill="#EEF3EF"/>
    <ellipse cx="${cx}" cy="${cy}" rx="160" ry="82" fill="url(#g12)"/>
    ${R.map(r=>`<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r*k}" fill="none" stroke="#7FA38A" stroke-width=".8" stroke-opacity=".55"/>`).join('')}
    ${back.map(peg).join('')}
    <ellipse cx="${cx}" cy="${cy}" rx="7.5" ry="3.8" fill="#24352B"/>
    <ellipse cx="${cx}" cy="${cy+.6}" rx="6" ry="2.6" fill="#101A14"/>
    <line x1="${cx+1}" y1="${cy}" x2="${cx-36}" y2="${cy+9}" stroke="rgba(20,50,35,.16)" stroke-width="2" stroke-linecap="round"/>
    <path d="M${bx-7} ${by-3} C ${bx-30} ${by-2}, ${cx+30} ${cy+20}, ${cx+7} ${cy+3}" fill="none" stroke="#0E3B2C" stroke-width="1.1" stroke-dasharray="1 4" stroke-linecap="round" opacity=".7"/>
    <line x1="${cx}" y1="${cy-1}" x2="${cx}" y2="${cy-84}" stroke="#F7F7F4" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="${cx+.8}" y1="${cy-1}" x2="${cx+.8}" y2="${cy-84}" stroke="#C9CFCB" stroke-width=".7"/>
    <path d="M${cx+1} ${cy-84} L${cx+30} ${cy-77} L${cx+1} ${cy-69} Z" fill="#0E3B2C"/>
    ${front.map(peg).join('')}
    <ellipse cx="${bx-4}" cy="${by+1.5}" rx="6" ry="2" fill="rgba(20,50,35,.2)"/><circle cx="${bx-7}" cy="${by-3.6}" r="4.6" fill="url(#b12)" stroke="#C3CBC6" stroke-width=".5"/>
    ${R.map((r,i)=>`<text text-anchor="middle" x="${cx+r-6}" y="${cy+4}" font-size="10" font-weight="600" letter-spacing=".02em" font-family="Inter,system-ui,sans-serif" fill="#3E5A48">${lab[i]}</text>`).join('')}
  </svg>`;
}
function libraryHtml(){
  const groups=[['putt','Putting'],['atg','Short game'],['app','Approach'],['ott','Tee shots']], c=S.libCat||'putt';
  const ds=DRILL_LIB.filter(d=>Object.keys(d.areas).some(k=>CAT_OF(k)===c&&d.areas[k]>=0.5));
  return `${secHead('Drill library','Tap any drill to see how it works')}
  <div class="seg libseg" role="tablist" aria-label="Drill type">${groups.map(([k,l])=>`<button role="tab" aria-selected="${c===k}" class="${c===k?'on':''}" data-act="libcat" data-val="${k}">${l}</button>`).join('')}</div>
  <div class="card"><div class="liblist">${ds.map(d=>`<button class="libitem" data-act="drill" data-val="${d.id}"><span><b>${esc(d.t)}</b><br><span class="small muted">${esc(d.type)} · ${d.min}–${d.max} min</span></span><span class="muted">›</span></button>`).join('')}</div>
  <span class="small muted">${ds.length} ${groups.find(g=>g[0]===c)[1].toLowerCase()} drill${ds.length===1?'':'s'}</span></div>`;
}
// ================= Compete: weekly practice tests, leaderboards and leagues =================
S.comp={state:'idle',tests:[],week:[],leagues:[],members:{},season:{},screen:'list',test:null,board:'all',band:null,league:null,form:{code:'',name:''},msg:'',play:null};
const COMP_PTS=[10,8,6,5,4,3,2,1];
function weekStart(d){ const x=d?new Date(d+'T00:00:00'):new Date(); x.setHours(0,0,0,0); x.setDate(x.getDate()-((x.getDay()+6)%7)); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`; }
const thisWeek=()=>weekStart();
// The featured test for a week: one set to that week in Supabase, otherwise the active tests take turns.
function featuredFor(wk){
  const ts=S.comp.tests; if(!ts.length) return null;
  const set=ts.find(t=>t.week_of===wk); if(set) return set;
  const n=Math.round((new Date(wk+'T00:00:00')-new Date('2026-01-05T00:00:00'))/(7*864e5));
  return ts[((n%ts.length)+ts.length)%ts.length];
}
const compMax=t=>t.shots.length*Math.max(...t.scale.map(x=>x.p));
const compName=()=>{ const p=(me.name||'').trim().split(/\s+/); return p[0]?(p[0]+(p[1]?' '+p[1][0].toUpperCase()+'.':'')):'Golfer'; };
const shotLabel=s=>{ if(s.d==null) return s.t; const d=s.u==='ft'?(isFt()?`${s.d} ft`:`${String(+(s.d*FT).toFixed(1))} m`):(isYd()?`${s.d} yd`:`${Math.round(s.d*YD)} m`); return `${s.t}, ${d}`; };
const scaleLabel=x=>isFt()?x.l:(x.lm||x.l);
const catName=c=>({putt:'Putting',atg:'Short game',app:'Approach',ott:'Tee shots'})[c]||c;
// Best score per player from a list of score rows (later rows don't replace an equal earlier best).
function bestBy(rows){ const m={}; rows.forEach(r=>{ const k=r.user_id; if(!m[k]||r.points>m[k].points) m[k]={...r,goes:(m[k]?m[k].goes:0)+1}; else m[k].goes++; }); return Object.values(m).sort((a,b)=>b.points-a.points||String(a.created_at).localeCompare(String(b.created_at))); }
async function loadComp(force){
  if(!sb||!uid) return; if(S.comp.state==='loading'||(S.comp.state==='ok'&&!force)) return;
  S.comp.state='loading'; render();
  try{
    const wk=thisWeek();
    const [t,w,m]=await Promise.all([
      sb.from('comp_tests').select('*').eq('active',true).order('sort'),
      sb.from('comp_scores').select('user_id,test_id,points,hcp,name,flagged,created_at').eq('week',wk).limit(5000),
      sb.from('comp_members').select('league_id').eq('user_id',uid)]);
    if(t.error) throw t.error;
    S.comp.tests=t.data||[]; S.comp.week=w.data||[];
    const ids=(m.data||[]).map(x=>x.league_id);
    S.comp.leagues=ids.length?((await sb.from('comp_leagues').select('*').in('id',ids)).data||[]).sort((a,b)=>a.name.localeCompare(b.name)):[];
    if(!S.mates) loadMates();
    S.comp.state='ok';
  }catch(e){ S.comp.state='err'; }
  render();
}
async function loadLeague(id){
  const L=S.comp.leagues.find(l=>l.id===id); if(!L) return;
  const mem=(await sb.from('comp_members').select('user_id,name').eq('league_id',id)).data||[];
  S.comp.members[id]=mem;
  const since=weekStart(String(L.created_at).slice(0,10));
  const sc=mem.length?((await sb.from('comp_scores').select('user_id,test_id,week,points,name,created_at').in('user_id',mem.map(x=>x.user_id)).gte('week',since).limit(5000)).data||[]):[];
  // Season table: each finished or current week, rank members on that week's featured test and hand out points.
  const tbl={}; mem.forEach(x=>tbl[x.user_id]={name:x.name,pts:0,wins:0});
  [...new Set(sc.map(r=>r.week))].forEach(wk=>{ const f=featuredFor(wk); if(!f) return;
    bestBy(sc.filter(r=>r.week===wk&&r.test_id===f.id)).forEach((r,i)=>{ if(!tbl[r.user_id]) return; tbl[r.user_id].pts+=COMP_PTS[i]||1; if(i===0) tbl[r.user_id].wins++; }); });
  S.comp.season[id]={weeks:Math.max(1,Math.round((new Date(thisWeek())-new Date(since))/(7*864e5))+1),rows:Object.entries(tbl).map(([k,v])=>({user_id:k,...v})).sort((a,b)=>b.pts-a.pts)};
  render();
}
function compRows(test,board){
  const rows=S.comp.week.filter(r=>r.test_id===test.id);
  if(board==='friends'){ const ids=new Set([uid,...(S.mates||[]).map(p=>p._id)]); return bestBy(rows.filter(r=>ids.has(r.user_id))); }
  if(board==='league'){ const mem=S.comp.members[S.comp.league]||[]; const ids=new Set(mem.map(x=>x.user_id)); return bestBy(rows.filter(r=>ids.has(r.user_id))); }
  const band=S.comp.band;
  return bestBy(rows.filter(r=>(!r.flagged||r.user_id===uid)&&(!band||band==='all'||levelOf(r.hcp??30).name===band)));
}
function myBand(){ return levelOf(S.hcp!=null?S.hcp:20).name; }
function lbTable(rows){
  if(!rows.length) return `<div class="card muted">No scores yet this week. Post the first one.</div>`;
  const me_i=rows.findIndex(r=>r.user_id===uid);
  const row=(r,i)=>`<div class="lbr ${r.user_id===uid?'me':''}"><span class="n">${i+1}</span><span>${esc(r.user_id===uid?'You':r.name||'Golfer')}${r.goes>1&&S.comp.board==='league'?` <span class="small muted">· ${r.goes} goes</span>`:''}</span><span class="h">${r.hcp==null?'':fmtHcp(r.hcp)}</span><span class="s">${r.points}</span></div>`;
  let body;
  if(rows.length<=12) body=rows.map(row).join('');
  else { const top=rows.slice(0,5).map((r,i)=>row(r,i)).join(''); const from=Math.max(5,me_i-2), to=me_i<0?5:Math.min(rows.length,me_i+3);
    body=top+(me_i>=5?`${from>5?'<div class="lbgap">⋯</div>':''}${rows.slice(from,to).map((r,j)=>row(r,from+j)).join('')}`:'')+`<div class="lbgap">${rows.length} golfers</div>`; }
  return `<div class="lb"><div class="lbr head"><span>#</span><span>Player</span><span style="text-align:right">Hcp</span><span style="text-align:right">Pts</span></div>${body}</div>`;
}
const median=a=>{ if(!a.length) return null; const s=[...a].sort((x,y)=>x-y), m=s.length>>1; return s.length%2?s[m]:Math.round((s[m-1]+s[m])/2); };
function compHero(test,rows){
  const mine=rows.find(r=>r.user_id===uid), wk=S.comp.week.filter(r=>r.test_id===test.id);
  if(S.comp.board==='league'){ const L=S.comp.leagues.find(l=>l.id===S.comp.league); if(!L) return '';
    const i=rows.findIndex(r=>r.user_id===uid), s=S.comp.season[L.id], si=s?s.rows.findIndex(r=>r.user_id===uid):-1;
    const head=i===0&&rows[1]?`You lead this week by <span class="hl">${rows[0].points-rows[1].points} point${rows[0].points-rows[1].points===1?'':'s'}</span>.`:i===0?`You're <span class="hl">top</span> this week.`:i>0?`You're <span class="hl">${ordinal(i+1)}</span> this week, ${rows[0].points-rows[i].points} behind.`:`Post a score to get on the board.`;
    return `<div class="hero" style="gap:8px"><span class="eyebrow">${esc(L.name)} · ${(S.comp.members[L.id]||[]).length} players · code ${esc(L.code)}</span><h2 class="herohead">${head}</h2>${s&&si>=0?`<span class="small" style="opacity:.8">Season: ${ordinal(si+1)} of ${s.rows.length} after ${s.weeks} week${s.weeks===1?'':'s'}${si>0?`, ${s.rows[0].pts-s.rows[si].pts} points behind ${esc((s.rows[0].name||'the leader').replace(/\.$/,''))}`:''}.</span>`:''}</div>`; }
  const pts=rows.map(r=>r.points), max=compMax(test), lab=S.comp.board==='friends'?'your friends':S.comp.band&&S.comp.band!=='all'?`${S.comp.band} handicaps`:'everyone';
  if(!mine) return `<div class="hero" style="gap:8px"><span class="eyebrow">This week · ${rows.length} score${rows.length===1?'':'s'}</span><h2 class="herohead">Post a score to see how you compare with ${esc(lab)}.</h2></div>`;
  const beat=rows.length>1?Math.round(rows.filter(r=>r.points<mine.points).length/(rows.length-1)*100):100;
  const bins=10, hist=Array(bins).fill(0); pts.forEach(p=>hist[Math.min(bins-1,Math.max(0,Math.floor((p/max)*bins)))]++); const hm=Math.max(1,...hist), mb=Math.min(bins-1,Math.max(0,Math.floor(mine.points/max*bins)));
  const typ=median(pts), u5=median(bestBy(wk.filter(r=>!r.flagged&&levelOf(r.hcp??30).n===5)).map(r=>r.points));
  return `<div class="hero" style="gap:8px"><span class="eyebrow">Your best · ${mine.points} points</span>
    <h2 class="herohead">${rows.length>1?`Better than <span class="hl">${beat}%</span> of ${esc(lab)}`:`You're the first on this board`}</h2>
    ${rows.length>2?`<div class="dist">${hist.map((v,i)=>`<i class="${i===mb?'you':''}" style="height:${Math.max(4,v/hm*100)}%"></i>`).join('')}</div>`:''}
    <div class="row between small" style="opacity:.8"><span>Typical: ${typ}</span>${u5!=null?`<span>Under 5 average: ${u5}</span>`:''}</div></div>`;
}
function vCompete(){
  if(!uid) return `<div class="card stack"><b>Sign in to compete</b><span class="muted">Weekly tests and leaderboards need an account so your scores can be compared.</span></div>`;
  const C=S.comp; if(C.state==='idle'){ setTimeout(()=>loadComp(),0); }
  if(C.state!=='ok') return C.state==='err'?`<div class="card stack"><span class="muted">Couldn't load the tests.</span><button class="btn" data-act="compreload">Try again</button></div>`:`<div class="card muted"><span class="spinner"></span> Loading this week's tests…</div>`;
  if(!C.tests.length) return `<div class="card muted">No tests are set up yet.</div>`;
  if(C.screen==='join') return compJoinHtml();
  const t=C.tests.find(x=>x.id===C.test);
  if(C.screen==='board'&&t) return compBoardHtml(t);
  const f=featuredFor(thisWeek()), band=myBand();
  const stat=x=>{ const all=bestBy(S.comp.week.filter(r=>r.test_id===x.id&&(!r.flagged||r.user_id===uid))), mine=all.find(r=>r.user_id===uid), bandRows=all.filter(r=>levelOf(r.hcp??30).name===band), bi=bandRows.findIndex(r=>r.user_id===uid);
    return {all,mine,top:bi>=0&&bandRows.length>1?Math.max(1,Math.round((bi+1)/bandRows.length*100)):null,rank:all.findIndex(r=>r.user_id===uid)+1}; };
  const fs=stat(f);
  return `<div class="hero"><span class="eyebrow">This week's challenge · ends Sunday</span>
    <h2 class="herohead">${esc(f.name)}${fs.mine?(fs.top?`: you're in the <span class="hl">top ${fs.top}%</span> of ${esc(band)} handicaps.`:`: your best is <span class="hl">${fs.mine.points}</span>.`):`. Can you top the board?`}</h2>
    <span class="small" style="opacity:.8">${esc(f.blurb||'')}${fs.all.length?` · ${fs.all.length} golfer${fs.all.length===1?' has':'s have'} posted a score.`:''}</span>
    <div class="row" style="gap:8px;flex-wrap:nowrap"><button class="btn gold" style="flex:1" data-act="compplay" data-val="${f.id}">${fs.mine?'Post a new score':'Play it'}</button><button class="btn ghost" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.4)" data-act="comptest" data-val="${f.id}">Leaderboard</button></div></div>
    <div class="row between"><h3>All tests</h3><button class="linkbtn small" data-act="compjoinform">${C.leagues.length?'Leagues':'Join or create a league'}</button></div>
    ${C.tests.map(x=>{ const s=stat(x); return `<button class="ch" data-act="comptest" data-val="${x.id}"><div class="top2"><b>${esc(x.name)}${x.id===f.id?' <span class="pill2 gold">This week</span>':''}</b><span class="pill2">${catName(x.cat)}</span></div><span class="small muted">${esc(x.blurb||'')}</span><div class="meta small">${s.mine?`<b>You: ${s.mine.points} pts</b><span class="muted">#${s.rank} of ${s.all.length}</span>${s.top?`<span class="pill2 gold">Top ${s.top}% of ${esc(band)}s</span>`:''}`:`<span class="muted">${s.all.length?`${s.all.length} score${s.all.length===1?'':'s'} this week`:'No scores yet this week'}</span><span class="pill2">Play it</span>`}</div></button>`; }).join('')}
    <span class="small muted">Boards reset every Monday. Your best score each week counts.</span>`;
}
function compBoardHtml(t){
  const C=S.comp; if(C.board==='league'&&!C.league&&C.leagues[0]) C.league=C.leagues[0].id;
  if(C.board==='league'&&C.league&&!C.members[C.league]) setTimeout(()=>loadLeague(C.league),0);
  if(C.band==null) C.band=myBand();
  const rows=C.board==='league'&&!C.leagues.length?[]:compRows(t,C.board);
  const chips=(items,cur,act)=>`<div class="chips hscroll">${items.map(([k,l])=>`<button class="chip ${cur===k?'on':''}" data-act="${act}" data-val="${k}">${esc(l)}</button>`).join('')}</div>`;
  const s=C.board==='league'&&C.league&&C.season[C.league];
  return `<div class="row between"><button class="linkbtn" data-act="compback">‹ All tests</button><span class="small muted">This week · ends Sunday</span></div>
  <h2>${esc(t.name)}</h2>
  <div class="seg libseg">${[['all','Everyone'],['friends','Friends'],['league','Leagues']].map(([k,l])=>`<button class="${C.board===k?'on':''}" data-act="compboard" data-val="${k}">${l}</button>`).join('')}</div>
  ${C.board==='all'?chips([['all','All'],[myBand(),`Your band: ${myBand()}`],...LEVELS.slice().reverse().filter(l=>l.name!==myBand()).map(l=>[l.name,l.name])],C.band,'compband'):''}
  ${C.board==='league'?chips([...C.leagues.map(l=>[l.id,l.name]),['+','+ Join or create']],C.league,'compleague'):''}
  ${C.board==='league'&&!C.leagues.length?`<div class="card stack"><b>You're not in a league yet</b><span class="muted">Start one with your mates or join one with a code.</span><button class="btn primary" data-act="compjoinform">Join or create a league</button></div>`:`${compHero(t,rows)}${C.board==='league'&&C.league&&!C.members[C.league]?'<div class="card muted"><span class="spinner"></span> Loading league…</div>':lbTable(rows)}`}
  ${s&&s.rows.length?`<div class="card stack" style="gap:0"><b style="margin-bottom:4px">Season standings</b>${s.rows.map((r,i)=>`<div class="stn"><span>${i+1}. ${esc(r.user_id===uid?'You':r.name||'Golfer')}${r.wins?` <span class="small muted">· ${r.wins} win${r.wins>1?'s':''}</span>`:''}</span><b>${r.pts} pts</b></div>`).join('')}<span class="small muted" style="margin-top:6px">Each week's featured test: 10 points for 1st, 8 for 2nd, 6 for 3rd, then 5, 4, 3, 2, 1.</span></div>`:''}
  <button class="btn big primary" data-act="compplay" data-val="${t.id}">Post a new score</button>`;
}
function compJoinHtml(){
  const F=S.comp.form;
  return `<div class="row between"><button class="linkbtn" data-act="compback">‹ Back</button></div><h2>Leagues</h2>
  ${S.comp.leagues.length?`<div class="card stack" style="gap:0">${S.comp.leagues.map(l=>`<div class="stn"><span><b>${esc(l.name)}</b><br><span class="small muted">Code ${esc(l.code)}</span></span><button class="linkbtn small" data-act="compleave" data-val="${l.id}">Leave</button></div>`).join('')}</div>`:''}
  <div class="card stack"><b>Join with a code</b><span class="small muted">Ask whoever set up the league for its code.</span><input class="field" data-cf="code" value="${esc(F.code)}" placeholder="e.g. TUE-4821" autocapitalize="characters"><button class="btn primary" data-act="compjoin">Join league</button></div>
  <div class="card stack"><b>Create a league</b><input class="field" data-cf="name" value="${esc(F.name)}" placeholder="League name, e.g. Tuesday Crew"><span class="small muted">You'll get a code to share. Everyone plays the same weekly test and the season table builds up week by week.</span><button class="btn ghost" data-act="compcreate">Create league</button></div>
  ${S.comp.msg?`<div class="flagnote">${esc(S.comp.msg)}</div>`:''}`;
}
async function compJoin(){
  const code=S.comp.form.code.trim().toUpperCase(); if(!code){ S.comp.msg='Type the league code first.'; return render(); }
  const {data}=await sb.from('comp_leagues').select('*').eq('code',code).maybeSingle();
  if(!data){ S.comp.msg=`No league found with code ${code}.`; return render(); }
  const r=await sb.from('comp_members').upsert({league_id:data.id,user_id:uid,name:compName()});
  if(r.error){ S.comp.msg='Couldn\'t join. Try again.'; return render(); }
  S.comp.leagues=[...S.comp.leagues.filter(l=>l.id!==data.id),data]; S.comp.form.code=''; S.comp.msg=`You're in ${data.name}.`; S.comp.league=data.id; delete S.comp.members[data.id]; render();
}
async function compCreate(){
  const name=S.comp.form.name.trim(); if(!name){ S.comp.msg='Give the league a name first.'; return render(); }
  const pre=(name.replace(/[^A-Za-z]/g,'').toUpperCase()+'LGE').slice(0,3);
  for(let k=0;k<5;k++){ const code=`${pre}-${1000+Math.floor(Math.random()*9000)}`;
    const {data,error}=await sb.from('comp_leagues').insert({name,code}).select().single();
    if(!error&&data){ await sb.from('comp_members').insert({league_id:data.id,user_id:uid,name:compName()}); S.comp.leagues=[...S.comp.leagues,data]; S.comp.form.name=''; S.comp.msg=`${name} is set up. Share the code ${code} so others can join.`; S.comp.league=data.id; return render(); } }
  S.comp.msg='Couldn\'t create the league. Try again.'; render();
}
// ---- playing a test, shot by shot ----
function vCompPlay(){
  const P=S.comp.play, t=P&&S.comp.tests.find(x=>x.id===P.test); if(!t){ S.view='improve'; return vImprove(); }
  const n=t.shots.length, i=P.i, total=P.ans.reduce((a,v)=>a+(v==null?0:t.scale[v].p),0), done=i>=n;
  const list=`<div class="card"><div class="small muted" style="margin-bottom:4px">So far · ${total} pts</div>${t.shots.map((s,k)=>`<div class="stn"><span>${esc(shotLabel(s))}</span><b>${P.ans[k]==null?'–':t.scale[P.ans[k]].p+' pt'+(Math.abs(t.scale[P.ans[k]].p)===1?'':'s')}</b></div>`).join('')}</div>`;
  return `<div class="wiz"><div class="wiztop"><button class="linkbtn" data-act="compcancel">Cancel</button><span class="small muted">${done?'Finished':`Shot ${i+1} of ${n}`}</span></div>
    <div class="wizbar" style="grid-template-columns:repeat(${n},1fr);gap:3px">${t.shots.map((_,k)=>`<i class="${P.ans[k]!=null?'on':''}"></i>`).join('')}</div>
    <h1 class="wizh">${esc(t.name)}</h1>
    ${done?`<div class="hero" style="gap:6px"><span class="eyebrow">Your score</span><h2 class="herohead"><span class="hl">${total}</span> points out of ${compMax(t)}</h2><span class="small" style="opacity:.8">It goes on the boards with your ${fmtHcp(S.hcp!=null?S.hcp:'')} handicap.</span></div>`
    :`<div class="card stack"><b>Shot ${i+1}: ${esc(shotLabel(t.shots[i]))}</b><span class="small muted">Where did it finish?</span>
      <div class="chips wide">${t.scale.map((x,k)=>`<button class="chip ${P.ans[i]===k?'on':''}" data-act="compans" data-val="${k}">${esc(scaleLabel(x))}<span class="sub">${x.p>0?x.p+' pt'+(x.p>1?'s':''):x.p===0?'0':'−'+Math.abs(x.p)}</span></button>`).join('')}</div></div>`}
    ${list}
    ${S.comp.msg&&done?`<div class="flagnote">${esc(S.comp.msg)}</div>`:''}
    <div class="wizfoot">${i>0?`<button class="btn ghost" data-act="compprev">Back</button>`:''}${done?`<button class="btn big primary" data-act="compsave" ${P.busy?'disabled':''}>${P.busy?'<span class="spinner"></span> Saving…':'Save score'}</button>`:''}</div></div>`;
}
async function compSave(){
  const P=S.comp.play, t=S.comp.tests.find(x=>x.id===P.test); if(!t||P.busy) return;
  const pts=P.ans.reduce((a,v)=>a+(v==null?0:t.scale[v].p),0), max=compMax(t), h=S.hcp!=null?Number(S.hcp):null;
  // Hold back scores far beyond what's realistic for the handicap from the public board (friends and leagues still see them).
  const flagged=h!=null&&((h>=15&&pts>=.75*max)||(h>=8&&pts>=.9*max));
  P.busy=true; render();
  const row={test_id:t.id,week:thisWeek(),points:pts,hcp:h,name:compName(),shots:P.ans,flagged};
  const r=await sb.from('comp_scores').insert(row);
  if(r.error){ P.busy=false; S.comp.msg='Couldn\'t save your score. Check your connection and try again.'; return render(); }
  S.comp.week.push({...row,user_id:uid,created_at:new Date().toISOString()});
  if(S.comp.board==='league'&&S.comp.league) delete S.comp.members[S.comp.league];
  S.comp.play=null; S.comp.msg=''; S.view='improve'; S.impTab='compete'; S.comp.screen='board'; S.comp.test=t.id; window.scrollTo(0,0); render();
}
// ================= 4-week program =================
const TESTS={
  putt:{t:'Putting test',how:()=>`Ten putts, two each from ${isFt()?'3, 6, 9, 12 and 20 ft':'1, 2, 3, 4 and 6 m'}. Count how many you hole.`,max:10,band:[3,4,5,6,7]},
  atg:{t:'Short game test',how:()=>`Nine shots from around the green: three off the fringe, three from the rough, three from a bunker. Count how many finish inside ${isFt()?'6 ft':'2 m'}.`,max:9,band:[2,3,4,5,6]},
  app:{t:'Approach test',how:()=>`Nine balls, three each at ${isYd()?'55, 110 and 165 yd':'50, 100 and 150 m'}. Count how many finish within a tenth of the distance.`,max:9,band:[2,3,4,5,6]},
  ott:{t:'Driving test',how:()=>`Fourteen drives, one per fairway on your course, between two targets 30 m apart. Count how many finish inside.`,max:14,band:[5,6,7,8,9]}
};
const catOf=k=>String(k).split('-')[0];
const WEEK_TYPES=[['Technique','Skill'],['Skill','Game'],['Game','Pressure'],['Pressure','Game']];
const WEEK_NAMES=['Groove it','Build it','Test it under pressure','Prove it'];
const outOf=d=>{ const m=String(d.score||'').match(/out of (\d+)/i); return m?Number(m[1]):null; };
function drillTarget(d,week){ const N=outOf(d); if(!N) return null; const lv=levelOf(S.hcp!=null?S.hcp:10).n; const pct=Math.min(.95,[.4,.5,.6,.7,.8][lv-1]+(week-1)*.05); return Math.max(1,Math.round(N*pct)); }
function blockLeaks(){ const nm=needleMovers(statRounds()); return nm.list.filter(x=>DRILL_LIB.some(d=>d.areas[x.k]>=.5)).slice(0,4); }
const DAYS=[['mon','Mon'],['tue','Tue'],['wed','Wed'],['thu','Thu'],['fri','Fri'],['sat','Sat'],['sun','Sun']];
const dayName=k=>(DAYS.find(d=>d[0]===k)||[,k])[1];
// Strokes gained per round in each part of the game over the last 10 rounds, against the golfer's goal.
function catSG(){ const rs=chrono(statRounds()).slice(-10), t={ott:0,app:0,atg:0,putt:0}; let holes=0;
  rs.forEach(r=>{ const b=resolveBase('goal',r); r.holes.forEach(h=>{ const s=holeSG(h,b); if(!s.ok) return; holes++; for(const c in t) t[c]+=s[c]||0; }); });
  for(const c in t) t[c]=holes?t[c]*18/holes:0; return t; }
const CAT_WORD={ott:'driving',app:'approach play',atg:'short game',putt:'putting'};
const CAT_PLACE={ott:'the range',app:'the range',atg:'a chipping area',putt:'a putting green'};
// The golfer's strengths outside what the plan focuses on, best first; up to two that can be practised where they've ticked.
function strengths(focus,places){
  const fc=new Set(focus.map(catOf)), sg=catSG();
  const all=['ott','app','atg','putt'].filter(c=>!fc.has(c)).sort((a,b)=>sg[b]-sg[a]);
  const can=c=>DRILL_LIB.some(d=>d.places.some(p=>places.includes(p))&&Object.keys(d.areas).some(k=>catOf(k)===c&&d.areas[k]>=.6));
  const ok=all.filter(can), use=ok.slice(0,1); if(ok[1]&&(sg[ok[1]]>0||sg[ok[1]]>=sg[ok[0]]-.5)) use.push(ok[1]);
  return {use,missed:all.slice(0,2).filter(c=>!can(c)),sg};
}
const sharpMinsOf=m=>m>=60?20:m>=45?15:10;
function sharpText(o,sel){
  const st=strengths(sel,o.places), names=st.use.map(c=>CAT_WORD[c]);
  if(!names.length) return `Nowhere you've ticked covers your strengths${st.missed.length?` (${st.missed.map(c=>CAT_WORD[c]).join(' and ')}). Add ${CAT_PLACE[st.missed[0]]} to include them`:''}.`;
  return `Adds ${sharpMinsOf(o.mins)} minutes on your strengths, ${names.join(' and ')}, to ${o.mins>=45?'every session':'every second session'}, so they don't slip while you fix the leak.`;
}
function blockOpts(){ const o=S.blockOpt||{}; return {days:o.days||['wed','sat'],mins:o.mins||45,places:o.places||(S.plan.places&&S.plan.places.length?S.plan.places:['range','green','short']),sharp:o.sharp!==false}; }
function buildBlock(focus,opt){
  const rand=rng(Date.now()%9973), {days,mins,places,sharp}=opt, sessions=[];
  const fits=d=>d.places.some(p=>places.includes(p));
  const pool=k=>DRILL_LIB.filter(d=>(d.areas[k]||0)>=.5&&fits(d));
  const cats=[...new Set(focus.map(catOf))];
  // keep-sharp pool: long game first (needs the range), then any other part of the game not in focus
  const otherCats=['ott','app','atg','putt'].filter(c=>!cats.includes(c));
  // Strengths first: alternate between the golfer's best one or two parts of the game outside the focus.
  const strong=strengths(focus,places).use;
  const sharpPool=strong.map(c=>DRILL_LIB.filter(d=>fits(d)&&Object.keys(d.areas).some(k=>catOf(k)===c&&d.areas[k]>=.6)).map(d=>({d,c})));
  const longFirst=[], rest=[]; const longest=Math.max(0,...sharpPool.map(a=>a.length));
  for(let i=0;i<longest;i++) sharpPool.forEach(a=>{ if(a[i]) longFirst.push(a[i]); });
  let si=0;
  for(let w=1;w<=4;w++) days.forEach((day,n)=>{
    const idx=(w-1)*days.length+n, k=focus[idx%focus.length], types=WEEK_TYPES[w-1], items=[];
    const test=(w===1&&n===0)?{kind:'base',cats}:(w===4&&n===days.length-1)?{kind:'re',cats}:null;
    let left=mins-(test?10*cats.length:0);
    const wantSharp=sharp&&(longFirst.length||rest.length)&&(mins>=45||idx%2===1)&&left>=25;
    const sharpMins=wantSharp?sharpMinsOf(mins):0;
    left-=sharpMins;
    const cands=[...pool(k),...focus.filter(x=>x!==k).flatMap(pool)].filter((d,i,a)=>a.indexOf(d)===i);
    const ranked=cands.map(d=>({d,sc:(types.includes(d.type)?2:0)+(d.areas[k]||0)+rand()})).sort((a,b)=>b.sc-a.sc);
    for(const {d} of ranked){ if(left<d.min) continue; items.push({id:d.id,mins:d.min,target:drillTarget(d,w),max:outOf(d)}); left-=d.min; if(items.length>=3) break; }
    if(wantSharp){ const src=longFirst.length?longFirst:rest; const pick=src[(si++)%src.length]; if(pick) items.push({id:pick.d.id,mins:sharpMins,target:drillTarget(pick.d,w),max:outOf(pick.d),sharp:pick.c}); }
    sessions.push({w,n:n+1,day,k,items,test,done:false});
  });
  const missing=focus.filter(k=>!pool(k).length);
  return {start:today(),focus,days:days.length,dayList:days,mins,places,sharp,sessions,scores:{},tests:{base:{},re:{}},missing};
}
const saveBlock=()=>{ lsSet('sg.block',S.block); };
function moverTitle(k){ return (moverInfo(k)||[k])[0]; }
function planCta(){
  if(S.block){ const B=S.block, cur=B.sessions.find(x=>!x.done); return cur?`<button class="card ctacard" data-act="imptab" data-val="plan"><span><span class="eyebrow">Your 4-week plan · week ${cur.w}</span><b>Next: ${esc(moverTitle(cur.k))}${cur.day?` · ${dayName(cur.day)}`:''}</b></span><i>›</i></button>`:''; }
  if(!blockLeaks().length) return '';
  return `<button class="card ctacard new" data-act="wizopen"><span><span class="eyebrow">New</span><b>Build a 4-week plan around your leaks</b><span class="small muted">Drills, tests and targets for your handicap</span></span><i>›</i></button>`;
}
function planIntro(){
  const leaks=blockLeaks();
  if(!leaks.length) return `<div class="card muted">Save a couple of rounds and your 4-week plan is built from where you lose the most shots.</div>`;
  return `<div class="hero planintro"><span class="eyebrow">4-week plan</span><h2 class="herohead">Fix your biggest leak in <span class="hl">4 weeks</span>.</h2>
    <div class="stack" style="gap:10px">${[['1','Pick what to work on','From where your rounds are losing shots'],['2','Choose your days and time','1 to 7 sessions a week'],['3','Test, train, re-test','A test in week 1 and again in week 4 shows what changed']].map(([n,t,d])=>`<div class="introstep"><span class="stepn">${n}</span><span><b>${t}</b><span class="small">${d}</span></span></div>`).join('')}</div>
    <button class="btn big gold" data-act="wizopen">Create my plan</button></div>`;
}
const WIZ=['What to work on','When you can practise','Where you can practise','Check your plan'];
function vPlanWiz(){
  const st=S.wiz||0, leaks=blockLeaks(), sel=S.blockFocus||leaks.slice(0,2).map(x=>x.k), o=blockOpts();
  const ok=[sel.length>0,o.days.length>0,o.places.length>0,true][st];
  let body='';
  if(st===0) body=`<p class="muted">Your biggest leaks from your last rounds. Pick one or two.</p>
    <div class="stack" style="gap:8px">${leaks.map(x=>`<button class="leakpick ${sel.includes(x.k)?'on':''}" data-act="blockfocus" data-val="${x.k}"><span><b>${esc(x.title)}</b><span class="small muted">Costing you ${(-x.v).toFixed(1)} shots a round</span></span><i>${sel.includes(x.k)?'✓':''}</i></button>`).join('')}</div>`;
  if(st===1) body=`<p class="muted">Tap the days you can practise.</p>
    <div class="daychips">${DAYS.map(([k,l])=>`<button class="${o.days.includes(k)?'on':''}" data-act="blockday" data-val="${k}">${l}</button>`).join('')}</div>
    <span class="small muted">${o.days.length} session${o.days.length===1?'':'s'} a week · ${o.days.length*4} over the 4 weeks</span>
    <h3 style="margin-top:14px">Time per session</h3><div class="chips">${[30,45,60,90].map(v=>`<button class="chip ${o.mins===v?'on':''}" data-act="blockmins" data-val="${v}">${v}<span class="sub">min</span></button>`).join('')}</div>`;
  if(st===2){ const noRange=!o.places.includes('range');
    body=`<p class="muted">Tick everywhere you can get to.</p>
    <div class="chips wide">${PLACES.map(([k,l])=>`<button class="chip ${o.places.includes(k)?'on':''}" data-act="blockplace" data-val="${k}">${l}</button>`).join('')}</div>
    ${wizMissing(sel,o)}
    <div class="card setrow" style="margin-top:14px"><div><b>Keep my strengths sharp</b><div class="small muted">${sharpText(o,sel)}</div></div><button class="switch ${o.sharp?'on':''}" data-act="blocksharp" aria-label="Keep my strengths sharp" aria-pressed="${o.sharp}"></button></div>`; }
  if(st===3){ const pl=o.places.map(k=>(PLACES.find(x=>x[0]===k)||[,k])[1]).join(', ');
    const row=(l,v,step)=>`<div class="sumrow"><span class="small muted">${l}</span><b>${v}</b><button class="linkbtn small" data-act="wizgo" data-val="${step}">Change</button></div>`;
    body=`<div class="card stack" style="gap:0">${row('Working on',sel.map(k=>esc(moverTitle(k))).join(' and '),0)}${row('Days',o.days.map(dayName).join(', '),1)}${row('Each session',o.mins+' min',1)}${row('Where',esc(pl),2)}${row('Keep strengths sharp',o.sharp?(strengths(sel,o.places).use.map(c=>CAT_WORD[c]).join(' and ').replace(/^./,m=>m.toUpperCase())||'Yes'):'No',2)}</div>
    ${wizMissing(sel,o)}
    <p class="small muted">${o.days.length*4} sessions. Week 1 starts with a short test, and week 4 ends with the same test so you can see what changed.</p>`; }
  return `<div class="wiz">
    <div class="wiztop"><button class="linkbtn" data-act="wizclose">Cancel</button><span class="small muted">Step ${st+1} of 4</span></div>
    <div class="wizbar">${WIZ.map((_,i)=>`<i class="${i<=st?'on':''}"></i>`).join('')}</div>
    <h1 class="wizh">${WIZ[st]}</h1>
    <div class="stack">${body}</div>
    <div class="wizfoot">${st?`<button class="btn ghost" data-act="wizgo" data-val="${st-1}">Back</button>`:''}${st<3?`<button class="btn big primary" data-act="wizgo" data-val="${st+1}" ${ok?'':'disabled'}>Next</button>`:`<button class="btn big primary" data-act="blockstart">Confirm plan</button>`}</div>
  </div>`;
}
// Inline version of the missing-place question, shown while setting up.
function wizMissing(sel,o){
  const miss=sel.filter(k=>!DRILL_LIB.some(d=>(d.areas[k]||0)>=.5&&d.places.some(p=>o.places.includes(p)))); if(!miss.length) return '';
  const need=[...new Set(miss.flatMap(k=>DRILL_LIB.filter(d=>(d.areas[k]||0)>=.5).flatMap(d=>d.places)))];
  const add=['green','short','range','home'].find(p=>need.includes(p)); if(!add) return '';
  const area={putt:'putting',atg:'chipping',app:'approach shots',ott:'driving'}[catOf(miss[0])]||'this';
  const place=({green:'a putting green',short:'a chipping area',range:'the range',home:'practice at home'})[add];
  return `<div class="flagnote stack" style="gap:10px"><b>Add ${area} to your plan?</b><span class="small">${esc(miss.map((k,i)=>i?moverTitle(k).toLowerCase():moverTitle(k)).join(' and '))} ${miss.length>1?'are':'is'} costing you shots, but nowhere you've ticked can work on ${miss.length>1?'them':'it'}.</span><button class="btn primary" data-act="blockplace" data-val="${add}">Add ${place}</button></div>`;
}
function blockSetupHtml(){
  const leaks=blockLeaks(), sel=S.blockFocus||leaks.slice(0,2).map(x=>x.k), o=blockOpts();
  if(!leaks.length) return `<div class="card muted">Save a couple of rounds and your 4-week plan is built from where you lose the most shots.</div>`;
  const noRange=!o.places.includes('range');
  return `<div class="card stack blocksetup">
    <div class="setstep"><span class="stepn">1</span><b>What to work on</b></div>
    <span class="small muted">Your biggest leaks from your last rounds. Pick one or two.</span>
    <div class="stack" style="gap:8px">${leaks.map(x=>`<button class="leakpick ${sel.includes(x.k)?'on':''}" data-act="blockfocus" data-val="${x.k}"><span><b>${esc(x.title)}</b><span class="small muted">Costing you ${(-x.v).toFixed(1)} shots a round</span></span><i>${sel.includes(x.k)?'✓':''}</i></button>`).join('')}</div>
    <div class="setstep"><span class="stepn">2</span><b>When you can practise</b></div>
    <div class="daychips">${DAYS.map(([k,l])=>`<button class="${o.days.includes(k)?'on':''}" data-act="blockday" data-val="${k}">${l}</button>`).join('')}</div>
    <span class="small muted">${o.days.length} session${o.days.length===1?'':'s'} a week · ${o.days.length*4} over the 4 weeks</span>
    <span class="small muted">Time per session</span><div class="chips">${[30,45,60,90].map(v=>`<button class="chip ${o.mins===v?'on':''}" data-act="blockmins" data-val="${v}">${v}<span class="sub">min</span></button>`).join('')}</div>
    <div class="setstep"><span class="stepn">3</span><b>Where you can practise</b></div>
    <div class="chips wide">${PLACES.map(([k,l])=>`<button class="chip ${o.places.includes(k)?'on':''}" data-act="blockplace" data-val="${k}">${l}</button>`).join('')}</div>
    <div class="setrow"><div><b>Keep the rest of my game sharp</b><div class="small muted">${noRange?'Adds a short block for the parts of your game you\'re not focusing on. Tick the range to include driving and irons.':`Adds ${o.mins>=60?20:o.mins>=45?15:10} minutes of long game to ${o.mins>=45?'every session':'every second session'}, so your strengths don't slip while you fix the leak.`}</div></div><button class="switch ${o.sharp?'on':''}" data-act="blocksharp" aria-label="Keep the rest of my game sharp" aria-pressed="${o.sharp}"></button></div>
    <button class="btn big primary" data-act="blockstart" ${sel.length&&o.days.length&&o.places.length?'':'disabled'}>Build my 4 weeks</button>
  </div>`;
}
function testCard(B,si,cat,kind){
  const T=TESTS[cat], lv=levelOf(S.hcp!=null?S.hcp:10), v=B.tests[kind][cat], base=B.tests.base[cat];
  return `<div class="testcard"><div class="row between" style="flex-wrap:nowrap"><b>${kind==='base'?'Starting test':'Re-test'}: ${esc(T.t)}</b><span class="pill">10 min</span></div>
    <span class="small">${esc(T.how())}</span>
    <div class="scorerow"><span class="small muted">Your score</span>${scoreStep(`t:${kind}:${cat}`,v,T.max)}<span class="small muted">Typical for ${esc(lv.name)}: <b>${T.band[lv.n-1]}/${T.max}</b>${kind==='re'&&base!=null?` · start: <b>${base}</b>`:''}</span></div></div>`;
}
function scoreStep(key,v,max){ return `<div class="sstep"><button data-act="bscore" data-key="${esc(key)}" data-d="-1" aria-label="Down">−</button><b>${v??'–'}</b><button data-act="bscore" data-key="${esc(key)}" data-d="1" aria-label="Up">+</button>${max?`<span class="small muted">/${max}</span>`:''}</div>`; }
// ---- practice-day reminders (web push) ----
const VAPID_PUBLIC='BDifWHTXp_GCdhJ3pQ7d8G9CDsUSntrgtL6eXSHnCTnEDg_Hzcf7gkH4pSqK65pqGXh7Mjr2veMjOkARBj-G5PU';
const pushSupported=()=>'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
function b64u(s){ const p='='.repeat((4-s.length%4)%4), b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/')); return Uint8Array.from(b,c=>c.charCodeAt(0)); }
function sessionDates(B){
  const map={}, start=new Date(B.start+'T00:00:00'), dow=['sun','mon','tue','wed','thu','fri','sat'];
  B.sessions.forEach(x=>{ if(!x.day) return; const d=new Date(start); let k=0; while(dow[d.getDay()]!==x.day&&k<7){ d.setDate(d.getDate()+1); k++; } d.setDate(d.getDate()+7*(x.w-1)); const iso=d.toISOString().slice(0,10); x.date=iso; map[iso]=moverTitle(x.k); });
  return map;
}
async function savePushRow(sub){
  const B=S.block; if(!sb||!uid||!B) return 'Sign in to get reminders.';
  const map=sessionDates(B), ends=Object.keys(map).sort().pop()||null, tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'Australia/Adelaide';
  const cur=await sb.from('push_reminders').select('subs').eq('user_id',uid).maybeSingle();
  const subs=((cur.data&&cur.data.subs)||[]).filter(x=>!sub||x.endpoint!==sub.endpoint); if(sub) subs.push(sub.toJSON?sub.toJSON():sub);
  const r=await sb.from('push_reminders').upsert({user_id:uid,subs,days:B.dayList||[],remind_at:(B.remindAt||'07:30')+':00',tz,plan:{focus:B.focus.map(moverTitle).join(' and '),mins:B.mins,sessions:map},ends_on:ends,enabled:B.remind===true,updated_at:new Date().toISOString()});
  return r.error?'Couldn\'t save reminders. Try again.':null;
}
// Where notifications stand on this device: on, ask (never asked), blocked, install (iPhone not on Home Screen), none.
function notifState(){
  if(!pushSupported()) return isIOS()&&!isStandalone()?'install':'none';
  return Notification.permission==='granted'?'on':Notification.permission==='denied'?'blocked':'ask';
}
// Ask for notifications (must start from a tap), subscribe, and save the plan's reminder days if there is a plan.
async function turnOnReminders(quiet){
  const B=S.block, wasDenied=pushSupported()&&Notification.permission==='denied'; S.remindMsg='';
  if(!uid||!pushSupported()) return render();
  const perm=Notification.permission==='granted'?'granted':quiet?Notification.permission:await Notification.requestPermission();
  if(perm!=='granted'){ if(!quiet&&wasDenied) S.remindMsg='Still blocked. Follow the steps above, then tap the button again.'; return render(); }
  try{
    const reg=await navigator.serviceWorker.ready;
    const sub=(await reg.pushManager.getSubscription())||await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(VAPID_PUBLIC)});
    if(B&&B.remind!=='off'){ B.remind=true; saveBlock(); const e=await savePushRow(sub); if(!quiet) S.remindMsg=e||''; }
  }catch(e){ if(!quiet) S.remindMsg='Couldn\'t turn on notifications on this device.'; }
  render();
}
function askNotifHtml(){
  return `<div class="modalback" data-act="notifno"></div><div class="modal cele" role="dialog" aria-modal="true" aria-labelledby="ntitle">
    <div class="celetop"><div class="bigmedal" style="font-size:3rem;line-height:1">🔔</div><h2 id="ntitle">Never miss a practice day</h2><span class="celesub">Turn on notifications for a gentle nudge on your practice days</span></div>
    <div class="stack" style="gap:8px"><button class="btn big primary" data-act="notifyes">Allow notifications</button><button class="btn ghost" data-act="notifno">Not now</button></div></div>`;
}
const fmtTime=t=>{ const [h,m]=t.split(':').map(Number); return `${(h%12)||12}:${String(m).padStart(2,'0')} ${h<12?'am':'pm'}`; };
function reminderCard(){
  const B=S.block; if(!B||!B.dayList) return '';
  const st=notifState();
  const msg=S.remindMsg?`<span class="small muted">${esc(S.remindMsg)}</span>`:'';
  if(st==='on'&&B.remind===true) return `<div class="card remindcard on"><div><b>🔔 Reminders on</b><div class="small muted">A gentle nudge on your practice days</div></div><button class="linkbtn small" data-act="remindoff">Stop</button>${msg}</div>`;
  if(st==='on') return `<div class="card stack remindcard"><b>🔔 Reminders are off for this plan</b><div class="small muted">Get a gentle nudge on your practice days.</div><button class="btn primary" data-act="remindon">Turn reminders back on</button>${msg}</div>`;
  if(st==='ask') return `<div class="card stack remindcard"><b>🔔 Don't miss your practice days</b><div class="small muted">Allow notifications for a gentle nudge on your practice days.</div><button class="btn primary" data-act="remindon">Allow notifications</button>${msg}</div>`;
  if(st==='blocked') return `<div class="card stack remindcard"><b>🔔 Notifications are blocked</b><div class="small muted">To get a nudge on your practice days, turn them on:</div>
    <ol class="small remindsteps">${isIOS()?'<li>Open your phone\'s <b>Settings</b> → <b>Notifications</b></li><li>Find <b>Strokes Gained</b> and turn on <b>Allow Notifications</b></li>':'<li>Tap the <b>⋮</b> menu or long-press the app icon → <b>App info</b></li><li>Tap <b>Notifications</b> and turn them on</li>'}<li>Come back here and tap the button below</li></ol>
    <button class="btn ghost" data-act="remindon">I've turned them on</button>${msg}</div>`;
  if(st==='install') return `<div class="card stack remindcard"><b>🔔 Get practice-day reminders</b><div class="small muted">On iPhone, add the app to your Home Screen first: Share → Add to Home Screen. Then open it from there.</div></div>`;
  return '';
}
// Plan built without the place a focus area needs (e.g. putting with no putting green ticked): say what's missing, offer to add it.
function missingNote(B){
  const miss=(B.missing||[]).filter(k=>!(B.missDismissed||[]).includes(k)); if(!miss.length) return '';
  const started=B.sessions.some(x=>x.done)||Object.keys(B.scores||{}).length; if(started) return '';
  const need=[...new Set(miss.flatMap(k=>DRILL_LIB.filter(d=>(d.areas[k]||0)>=.5).flatMap(d=>d.places)))].filter(p=>!(B.places||[]).includes(p));
  const add=['green','short','range','home'].find(p=>need.includes(p)); if(!add) return '';
  const area={putt:'putting',atg:'chipping',app:'approach shots',ott:'driving'}[catOf(miss[0])]||'this';
  const place=({green:'a putting green',short:'a chipping area',range:'the range',home:'practice at home'})[add];
  return `<div class="flagnote stack" style="gap:10px"><b>Add ${area} to your plan?</b><span class="small">${esc(miss.map((k,i)=>i?moverTitle(k).toLowerCase():moverTitle(k)).join(' and '))} ${miss.length>1?'are':'is'} costing you shots, but your plan has nowhere to work on ${miss.length>1?'them':'it'}.</span>
    <div class="row" style="gap:8px;flex-wrap:nowrap"><button class="btn primary" style="flex:1" data-act="blockaddplace" data-val="${add}">Add ${place}</button><button class="btn ghost" data-act="blockmissno">No thanks</button></div></div>`;
}
function blockHtml(){
  const B=S.block; if(!B) return planIntro();
  const total=B.sessions.length, done=B.sessions.filter(x=>x.done).length, cur=B.sessions.findIndex(x=>!x.done), curS=B.sessions[cur]||B.sessions[total-1], week=curS.w;
  const nm=needleMovers(statRounds()).all||{};
  const fx=B.focus.map(k=>{ const v=nm[k]||0; return `<div class="blockgoal"><b>${esc(moverTitle(k))}</b><span>Costing you <b class="neg">${Math.abs(v).toFixed(1)}</b> a round. Target by week 4: <b class="pos">${(Math.abs(v)/2).toFixed(1)}</b></span></div>`; }).join('');
  const wk=B.sessions.map((x,i)=>({x,i})).filter(o=>o.x.w===week);
  const lib=id=>DRILL_LIB.find(d=>d.id===id)||{t:id};
  const sessHtml=({x,i})=>{ const open=i===cur;
    return `<div class="card sesscard ${x.done?'done':''} ${open?'open':''}"><div class="row between" style="flex-wrap:nowrap"><div><span class="small muted">Week ${x.w} · ${x.day?dayName(x.day):'Session '+x.n}</span><div class="sesstitle">${esc(moverTitle(x.k))}</div></div>${x.done?'<span class="pill ok">✓ Done</span>':`<span class="pill">${B.mins} min</span>`}</div>
      ${open?`${x.test&&x.test.kind==='base'?x.test.cats.map(c=>testCard(B,i,c,'base')).join(''):''}
      ${x.items.map(it=>{ const d=lib(it.id), key=`d:${i}:${it.id}`, v=B.scores[key], hit=it.target!=null&&v!=null&&v>=it.target; return `<div class="sessdrill ${hit?'hit':''} ${it.sharp?'sharp':''}">${it.sharp?`<span class="sharptag">Strength · ${esc((CATS.find(c=>c[0]===it.sharp)||[,''])[1])}</span>`:''}<button class="linkish" data-act="drill" data-val="${it.id}"><b>${esc(d.t)}</b> <span class="small muted">${it.mins} min · ${esc(d.type||'')}</span></button>
        <div class="scorerow">${it.target!=null?`<span class="small">Target <b>${it.target}${it.max?'/'+it.max:''}</b></span>`:`<span class="small muted">${esc(d.score||'Beat your last go')}</span>`}${scoreStep(key,v,it.max)}${hit?'<span class="small pos">✓ Hit it</span>':''}</div></div>`; }).join('')}
      ${x.test&&x.test.kind==='re'?x.test.cats.map(c=>testCard(B,i,c,'re')).join(''):''}
      <button class="btn primary" data-act="blockdone" data-val="${i}">Session done</button>`:''}
    </div>`; };
  const cats=Object.keys(TESTS).filter(c=>B.tests.base[c]!=null);
  return `<div class="hero blockhero"><span class="eyebrow">Week ${week}: ${WEEK_NAMES[week-1]} · ${B.dayList?B.dayList.map(dayName).join(', '):B.days+' a week'}</span>
    <div class="weekbar">${[1,2,3,4].map(w=>{ const ss=B.sessions.filter(x=>x.w===w), dn=ss.filter(x=>x.done).length; return `<div class="${w<week?'past':w===week?'now':''}"><span>Week ${w}</span><i style="--p:${dn/ss.length}"></i></div>`; }).join('')}</div>
    ${fx}
    <span class="small" style="opacity:.8">${done} of ${total} sessions done</span></div>
  ${missingNote(B)}
  ${reminderCard()}
  ${wk.map(sessHtml).join('')}
  ${cats.length?`<div class="card stack"><h3>Your tests</h3>${cats.map(c=>{ const b=B.tests.base[c], r=B.tests.re[c], T=TESTS[c], lv=levelOf(S.hcp!=null?S.hcp:10); return `<div class="testrow"><span><b>${esc(T.t)}</b><span class="small muted">Typical for ${esc(lv.name)}: ${T.band[lv.n-1]}/${T.max}</span></span><span class="tbars"><i style="width:${b/T.max*100}%"></i>${r!=null?`<i class="re" style="width:${r/T.max*100}%"></i>`:''}</span><span class="small"><b>${b}</b>${r!=null?` → <b class="${r>b?'pos':r<b?'neg':''}">${r}</b>`:' → re-test in week 4'}</span></div>`; }).join('')}</div>`:''}
  <button class="btn ghost" data-act="wizopen">Start a new 4-week plan</button>`;
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
// ================= Learn tab =================
const learnTabs=()=>subTabs('learntab',S.learnTab||'sg',[['sg','Strokes gained'],['videos','Videos'],['app','Using the app']]);
function lcard(title,body,extra=''){ return `<div class="card stack lcard"><h3>${title}</h3>${body}${extra}</div>`; }
function learnSG(){
  const hc=S.hcp!=null?S.hcp:15, b=String(Math.round(hc)), u=fullU(), d=isYd()?160:150, dM=isYd()?d*YD:d;
  const e0=E('fairway',dM,b), e1=E('green',4,b), sg=e0-e1-1, e2=E('rough',dM,b);
  const n=v=>v.toFixed(1);
  return `
  ${lcard('Strokes gained in 30 seconds',`<p>From any spot on the course, golfers like you take a predictable number of shots to hole out. Strokes gained compares each shot you hit with that number.</p>
    <p><b>Leave yourself somewhere better than expected and you gain shots. Leave it somewhere worse and you lose them.</b> Add every shot up and you can see exactly where your score comes from.</p>`)}
  ${lcard('A worked example',`<div class="sgsteps">
      <div><span class="small muted">You're in the fairway</span><b>${d} ${u} out</b><span class="small">A ${fmtHcp(hc)} handicapper takes <b>${n(e0)}</b> shots from here</span></div>
      <div class="arrow">↓ one shot</div>
      <div><span class="small muted">You hit it to</span><b>4 m from the hole</b><span class="small">From there it takes <b>${n(e1)}</b></span></div>
    </div>
    <div class="sgcalc">${n(e0)} − ${n(e1)} − 1 shot = <b class="${sg>=0?'pos':'neg'}">${sg>=0?'+':''}${sg.toFixed(2)}</b></div>
    <p class="small muted" style="margin:0">That approach gained ${Math.abs(sg).toFixed(2)} of a shot. From the rough at the same distance you'd expect ${n(e2)}, so the same result would gain more. Strokes gained gives credit for how hard the shot was.</p>`)}
  ${lcard('Your game in four parts',`<div class="fourparts">
      ${[['Driving','Tee shots on par 4s and 5s. Distance, accuracy and staying out of trouble.'],['Approach','Shots into the green from outside 30 m, plus recovery shots.'],['Short game','Chips, pitches and bunker shots inside 30 m.'],['Putting','Every putt, measured by how far away it started.']].map(([t,x])=>`<div><b>${t}</b><span class="small muted">${x}</span></div>`).join('')}</div>
    <p class="small muted" style="margin:0">Your round adds up across the four. The part with the biggest minus is your biggest leak, and that's what Improve builds your practice around.</p>`)}
  ${lcard('Why not just count putts and fairways?',`<ul class="lbul">
      <li><b>Putts per round lies.</b> Miss greens and chip close and you'll take fewer putts, even if your putting is average.</li>
      <li><b>Fairways treat every miss the same.</b> A yard in the first cut and a ball in the trees both count as a miss.</li>
      <li><b>Greens in regulation hides your irons.</b> 3 m and 15 m from the hole both count as a hit.</li>
      <li><b>Strokes gained puts every shot in the same unit</b>, so you can see whether your driving or your putting costs you more.</li></ul>`)}
  ${lcard('Who you\'re compared with',`<p>Shots gained depends on who you're measured against. You can switch on any round or stats screen:</p>
    <div class="cmpgrid"><div><b>Your handicap</b><span class="small muted">The default. Plus means better than you usually play.</span></div><div><b>Your goal</b><span class="small muted">What it takes to get to the handicap you want.</span></div><div><b>Scratch</b><span class="small muted">A 0 handicapper.</span></div><div><b>PGA Tour</b><span class="small muted">The best in the world, for fun.</span></div></div>`)}
  ${lcard('Reading the numbers',`<div class="readnums"><div><b class="pos">Gained 1.2</b><span class="small muted">You beat the comparison by 1.2 shots</span></div><div><b class="neg">Lost 2.0</b><span class="small muted">That part cost you 2 shots</span></div><div><b>Even</b><span class="small muted">Right on par for the comparison</span></div></div>
    <p class="small muted" style="margin:0">A whole shot a round is a lot. Fixing a 2-shot leak is often the quickest way to drop your handicap by 2 or 3.</p>`)}`;
}
function learnVideos(){
  const soon=[['Strokes gained in 60 seconds','The idea behind every number in the app.'],['Reading your round','What to look at first after you save a round.'],['Practice that actually sticks','Why scores and tests beat hitting balls.'],['Course strategy for 15 handicaps','Where to aim to stop losing shots off the tee.']];
  return `${LESSONS.map(l=>`<a class="card vidcard" href="${l.url}" target="_blank" rel="noopener"><span class="vthumb">▶</span><span><b>${esc(l.title)}</b><span class="small muted">${esc(l.sub)}</span><span class="small">${esc(l.body)}</span></span></a>`).join('')}
    ${secHead('Coming soon','')}
    ${soon.map(([t,x])=>`<div class="card vidcard soon"><span class="vthumb">▶</span><span><b>${esc(t)}</b><span class="small muted">${esc(x)}</span></span></div>`).join('')}`;
}
function learnApp(){
  const steps=[
    ['Enter a round in a couple of minutes','Tap the score, then only what was different from a normal hole. The app works out the rest, like 1 putt when the score leaves no room for two. Picked up? Tap "Picked up?" and say where you were.','home'],
    ['Check it before you save','After the last hole, "Check round" lists anything that doesn\'t add up or is missing. Tap the answer on each card. One tap each, no going back into holes.','home'],
    ['Read the headline first','The card at the top of each tab tells you in plain words how you went and where the shots went. Deep dive has the detail.','stats'],
    ['Find your biggest leak','Improve shows what each part of your game costs you and what fixing it is worth.','improve'],
    ['Run a 4-week plan','Pick a leak, your days and facilities. Log drill scores, take the test in week 1 and again in week 4, and watch the number move.','improve'],
    ['Earn badges for your handicap','Targets are set for your handicap band, so they mean something at your level.','stats'],
    ['Compare with friends','Turn on sharing under My golf → Friends. Everyone is measured against their own handicap, so it\'s a fair fight.','mygolf'],
    ['Put it on your home screen','Add the app to your home screen to use it like a normal app and get practice-day reminders. iPhone: Share → Add to Home Screen. Android: menu → Install app.',null]];
  return `<div class="stack">${steps.map(([t,x,tab],i)=>`<div class="card appstep"><span class="stepn">${i+1}</span><div><b>${esc(t)}</b><span class="small muted">${esc(x)}</span>${tab?`<button class="linkbtn small" data-act="tab" data-val="${tab}">Show me</button>`:''}</div></div>`).join('')}</div>`;
}
function vLearn(){
  const t=S.learnTab||'sg';
  return `<div class="top"><span class="brand">Learn</span></div>
  <div class="stack">${learnTabs()}${t==='sg'?learnSG():t==='videos'?learnVideos():learnApp()}</div>`;
}
function vImprove(){
  const c=S.cad, r=c.res, real=statRounds();
  return `
  <div class="top"><span class="brand">Improve</span></div>
  <div class="stack">
    ${subTabs('imptab',S.impTab||'overview',[['overview','Overview'],['plan','4-week plan'],['drills','Drills'],['compete','Compete']])}
    ${(S.impTab||'overview')==='overview'?`${heroImprove()}${planCta()}${goalsHtml()}`:''}
    ${S.impTab==='plan'?blockHtml():''}
    ${S.impTab==='drills'?`${S.block?'':planHtml()}${libraryHtml()}`:''}
    ${S.impTab==='compete'?vCompete():''}
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
// course picker: one row per club, tees open underneath
const splitCourse=n=>{ const m=String(n).split(/\s+[–—-]\s+|,\s*/); return m.length>1?{club:m[0].trim(),tee:m.slice(1).join(' – ').trim()}:{club:String(n).trim(),tee:''}; };
function clubGroups(){
  const g=new Map(); S.courses.forEach((c,i)=>{ const {club,tee}=splitCourse(c.name); const k=club.toLowerCase(); if(!g.has(k)) g.set(k,{club,tees:[]}); g.get(k).tees.push({c,i,tee:tee||'Standard'}); });
  return [...g.values()].sort((a,b)=>a.club.localeCompare(b.club));
}
function clubListHtml(){
  const st=S.setup, q=(S.clubQ||'').trim().toLowerCase();
  const gs=clubGroups().filter(g=>!q||g.club.toLowerCase().includes(q));
  if(!gs.length) return `<span class="small muted">No saved course matches. Type it in below and it's saved for next time.</span>`;
  const selClub=st.courseId?splitCourse((S.courses.find(c=>c.id===st.courseId)||{}).name||'').club.toLowerCase():null;
  return gs.map(g=>{ const k=g.club.toLowerCase(), open=S.clubOpen===k||(!S.clubOpen&&selClub===k)||(q&&gs.length===1);
    const sel=g.tees.find(t=>t.c.id===st.courseId);
    return `<div class="clubrow ${open?'open':''}">${g.tees.length===1?`<button class="clubhead ${sel?'picked':''}" data-act="pickcourse" data-i="${g.tees[0].i}"><span><b>${esc(g.club)}</b><span class="small muted">${g.tees[0].c.holes.length} holes · par ${g.tees[0].c.holes.reduce((a,h)=>a+Number(h.par),0)}</span></span><span class="chev">${sel?'✓':''}</span></button>`:`<button class="clubhead" data-act="openclub" data-val="${esc(k)}" aria-expanded="${open}"><span><b>${esc(g.club)}</b><span class="small muted">${sel?esc(sel.tee):`${g.tees.length} tees`}</span></span><span class="chev">${open?'▴':'▾'}</span></button>`}
      ${open&&g.tees.length>1?`<div class="chips wide teechips">${g.tees.map(t=>`<button class="chip ${st.courseId===t.c.id?'on':''}" data-act="pickcourse" data-i="${t.i}">${esc(t.tee)}<span class="sub">${t.c.holes.length} holes · par ${t.c.holes.reduce((a,h)=>a+Number(h.par),0)} · ${lenShow(t.c.holes.reduce((a,h)=>a+Number(h.len||0),0)).toLocaleString()} ${fullU()}</span></button>`).join('')}</div>`:''}</div>`; }).join('');
}
function vSetup(){
  const st=S.setup, u=fullU();
  return `
  <div class="top"><button class="btn ghost" data-act="home">← Back</button><span class="brand">New round</span><span></span></div>
  <div class="stack">
    ${S.courses.length?`<div class="card stack"><h3>Your courses</h3>${clubGroups().length>5?`<input class="field" data-clubq="1" value="${esc(S.clubQ||'')}" placeholder="Search courses" aria-label="Search courses">`:''}<div id="clublist" class="clublist">${clubListHtml()}</div></div>`:''}
    <div class="card stack">
      <label for="cname"><h3>Course</h3></label>
      <input id="cname" class="field" data-setup="name" value="${esc(st.name)}" placeholder="e.g. Royal Adelaide, Blue course">
      <div class="row"><label class="small muted" for="rdate">Date</label><input id="rdate" type="date" class="field" style="max-width:170px" data-setup="date" value="${esc(st.date)}">
        <label class="small muted" for="rhcp">Handicap today</label><input id="rhcp" class="field num" style="max-width:90px" inputmode="decimal" data-setup="hcp" value="${esc(st.hcp)}" placeholder="8.3"></div>
      <span class="small muted">Weather (optional)</span><div class="chips wide">${CONDS.map(([k,l])=>`<button class="chip ${(st.cond||[]).includes(k)?'on':''}" data-act="scond" data-val="${k}">${l}</button>`).join('')}</div>
      <div class="seg"><button class="${st.holes.length===18?'on':''}" data-act="nholes" data-val="18">18 holes</button><button class="${st.holes.length===9?'on':''}" data-act="nholes" data-val="9">9 holes</button></div>
      <p class="small muted" style="margin:0">Pars, lengths and stroke index are saved with the course, so you only enter them once. Index is the hole's handicap ranking on the card, used when you pick up. No lengths handy? Leave the typical ones and fix them later.</p>
      <div class="coursegrid">
        <span class="small muted">Hole</span><span class="small muted">Par</span><span class="small muted">Length (${u})</span><span class="small muted">Index</span>
        ${st.holes.map((h,i)=>`<b class="num">${i+1}</b>
          <div class="seg">${[3,4,5].map(p=>`<button class="${h.par===p?'on':''}" data-act="cpar" data-i="${i}" data-val="${p}" aria-label="Hole ${i+1} par ${p}">${p}</button>`).join('')}</div>
          <input class="field num" id="len${i}" type="number" inputmode="numeric" min="40" max="800" data-clen="${i}" value="${h.len===''?'':lenShow(h.len)}" aria-label="Hole ${i+1} length in ${u}">
          <input class="field num" type="number" inputmode="numeric" min="1" max="18" data-csi="${i}" value="${h.si??''}" placeholder="–" aria-label="Hole ${i+1} stroke index">`).join('')}
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
// First putts use the PGA Tour's putting ranges, in feet. Each range is stored at a typical length inside it.
const PUTT_BANDS=[[0,3,2],[3,5,4],[5,10,7],[10,15,12],[15,20,17],[20,25,22],[25,35,30],[35,50,42],[50,null,60]];
function puttBands(h){
  const ft=h.fp!=null?h.fp/FT:null, inB=([lo,hi])=>ft!=null&&ft>=lo-0.01&&(hi==null||ft<hi-0.01);
  return `<div class="ftnote"><b>FEET</b> First putt length is in feet, not metres</div>
  <div class="pbands">${PUTT_BANDS.map(b=>`<button class="chip ${inB(b)?'on':''}" data-act="set" data-field="fp" data-val="${b[2]}">${b[1]==null?`${b[0]}+`:`${b[0]}–${b[1]}`}<span class="sub">ft</span></button>`).join('')}</div>`;
}
const uns=(h,fields)=>fields.some(f=>(h.unsure||[]).includes(f))?' unsure':'';
function teeChoices(lenM){ const max=Math.min(toShow('teeDist',lenM)-20,isYd()?360:340); const out=[]; for(let d=20; d<=max; d+= d<200?20:30) out.push(d); return out; }

// ---- tap targets for the tee shot and approach, with a pop-up panel for the follow-up questions ----
const MISS8=[['long','Long'],['longright','Long right'],['right','Right'],['shortright','Short right'],['short','Short'],['shortleft','Short left'],['left','Left'],['longleft','Long left']];
const CELL_NAMES=[['Long left of the flag','Long of the flag','Long right of the flag'],['Left of the flag','At the flag','Right of the flag'],['Short left of the flag','Short of the flag','Short right of the flag']];
const TEE_LIE_WORD={rough:'Rough',sand:'Bunker',recovery:'Trees',fairway:'Fairway',green:'Green'};
const tickSvg=(x,y)=>`<circle cx="${x}" cy="${y}" r="13" fill="#0E3B2C"/><path d="M${x-6} ${y} l4 4 l8 -9" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
// Tee target. Where you tap across a miss zone records roughly how far past the fairway edge it finished:
// five equal bands, 0-5, 5-10, 10-20, 20-30 and 30+ (in your distance unit).
const OFF_EDGES=[0,5,10,20,30,45], TEE_W=330, TEE_MISS=110, FW_HALF=15;
const offFromFrac=f=>{ f=Math.max(0,Math.min(1,f)); const seg=Math.min(4,Math.floor(f*5)), t=f*5-seg; return Math.round(OFF_EDGES[seg]+t*(OFF_EDGES[seg+1]-OFF_EDGES[seg])); };
const fracFromOff=v=>{ for(let i=0;i<5;i++) if(v<=OFF_EDGES[i+1]) return (i+(v-OFF_EDGES[i])/(OFF_EDGES[i+1]-OFF_EDGES[i]))/5; return 1; };
function teeTarget(h){
  const W=TEE_W,H=180, M=TEE_MISS, sel=h.teeLie==='fairway'?'fw':h.teeSide||null, off=h.teeOff!=null?toShow('teeDist',h.teeOff):null;
  const ticks=(side)=>[5,10,20,30].map((v,i)=>{ const f=(i+1)/5, x=side==='left'?M-f*M:W-M+f*M; return `<line x1="${x}" y1="${H-26}" x2="${x}" y2="${H-18}" stroke="rgba(255,255,255,.6)" pointer-events="none"/><text class="tlbl" x="${x}" y="${H-6}" text-anchor="middle" style="font-size:10px">${v}${v===30?'+':''}</text>`; }).join('');
  const zone=(k,x0,x1,label)=>{ const on=sel===k, miss=k!=='fw';
    return `<g class="tz" data-act="teezone" data-val="${k}" role="button" aria-label="${miss?label+' miss':'Fairway'}" aria-pressed="${on}"><rect x="${x0}" y="0" width="${x1-x0}" height="${H}" rx="14" fill="${miss?`url(#tg${k})`:'#86c766'}"/>
      ${on?`<rect x="${x0+3}" y="3" width="${x1-x0-6}" height="${H-6}" rx="12" fill="none" stroke="#0E3B2C" stroke-width="5" pointer-events="none"/>`:''}
      ${miss?`<text class="tlbl" x="${(x0+x1)/2}" y="20" text-anchor="middle">${label.toUpperCase()} MISS</text><text class="tlbl" x="${(x0+x1)/2}" y="36" text-anchor="middle" style="font-size:10px;opacity:.75">${k==='left'?'← further off':'further off →'}</text>${ticks(k)}`:`<text class="tlbl" x="${(x0+x1)/2}" y="${H/2+4}" text-anchor="middle" style="font-size:12px">FAIRWAY</text>`}
      ${on&&!miss?`<g pointer-events="none">${tickSvg((x0+x1)/2,H/2+34)}</g>`:''}</g>`; };
  const dot=sel&&sel!=='fw'&&off!=null?(()=>{ const f=fracFromOff(off), x=sel==='left'?M-f*M:W-M+f*M; return `<circle cx="${Math.max(12,Math.min(W-12,x))}" cy="${H/2}" r="11" fill="#fff" stroke="#0E3B2C" stroke-width="4" pointer-events="none"/>`; })():'';
  return `<div class="tgt"><svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;max-width:420px" role="group" aria-label="Where the tee shot finished">
    <defs><linearGradient id="tgleft" x1="1" x2="0"><stop offset="0" stop-color="#4f8040"/><stop offset="1" stop-color="#335c27"/></linearGradient><linearGradient id="tgright" x1="0" x2="1"><stop offset="0" stop-color="#4f8040"/><stop offset="1" stop-color="#335c27"/></linearGradient></defs>
    ${zone('left',0,M,'Left')}${zone('fw',M+6,W-M-6,'Fairway')}${zone('right',W-M,W,'Right')}${dot}</svg></div>`;
}
function appTarget(h){
  const S2=320,c=S2/2,R=158,r=104, P=(a,rad)=>[c+rad*Math.cos(a*Math.PI/180),c+rad*Math.sin(a*Math.PI/180)];
  const ring=MISS8.map(([k,l],i)=>{ const a0=-112.5+i*45, a1=a0+45; const [x1,y1]=P(a0,R),[x2,y2]=P(a1,R),[x3,y3]=P(a1,r+6),[x4,y4]=P(a0,r+6),[lx,ly]=P((a0+a1)/2,(R+r)/2+3), on=h.appMiss===k, ls=l.toUpperCase().split(' ');
    return `<g class="tz" data-act="appzone" data-val="m-${k}" role="button" aria-label="Missed ${l.toLowerCase()}" aria-pressed="${on}"><path d="M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r+6} ${r+6} 0 0 0 ${x4} ${y4} Z" fill="#4a7a38" stroke="${on?'#0E3B2C':'#fff'}" stroke-width="${on?5:3}"/>${on?tickSvg(lx,ly):ls.map((t,j)=>`<text class="tlbl" x="${lx}" y="${ly+4+(j-(ls.length-1)/2)*12}" text-anchor="middle">${t}</text>`).join('')}</g>`; }).join('');
  const cell=2*r/3; let grid='', mark='';
  for(let i=0;i<3;i++) for(let j=0;j<3;j++){ const x=c-r+j*cell, y=c-r+i*cell, on=h.appCell===`${i}-${j}`;
    grid+=`<rect class="tz" data-act="appzone" data-val="g-${i}-${j}" role="button" aria-label="On the green, ${CELL_NAMES[i][j].toLowerCase()}" x="${x}" y="${y}" width="${cell}" height="${cell}" fill="transparent" stroke="rgba(255,255,255,.55)" stroke-width="1.5"/>`;
    if(on) mark=`<rect x="${x+3}" y="${y+3}" width="${cell-6}" height="${cell-6}" rx="6" fill="none" stroke="#0E3B2C" stroke-width="4" pointer-events="none"/>${i===1&&j===1?'':`<g pointer-events="none">${tickSvg(x+cell/2,y+cell/2)}</g>`}`; }
  return `<div class="tgt"><svg viewBox="0 0 ${S2} ${S2}" width="100%" style="max-width:380px;display:block" role="group" aria-label="Where the approach finished">${ring}<defs><clipPath id="appclip"><circle cx="${c}" cy="${c}" r="${r}"/></clipPath></defs><circle cx="${c}" cy="${c}" r="${r}" fill="#86c766"/><g clip-path="url(#appclip)">${grid}${mark}</g><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#fff" stroke-width="2.5" pointer-events="none"/>
    <g pointer-events="none"><line x1="${c}" y1="${c+6}" x2="${c}" y2="${c-22}" stroke="#fff" stroke-width="2.2"/><path d="M ${c} ${c-22} l 14 5 l -14 5 z" fill="#FFD36E"/><circle cx="${c}" cy="${c+6}" r="3.5" fill="#111"/></g></svg></div>`;
}
const teeDone=h=>h.teeLie==='green'||(!!h.teeLie&&h.teeDist!=null);
function teeSummary(h){ const club=(CLUBS.find(c=>c[0]===h.teeClub)||[])[1]; const where=h.teeLie==='green'?'Drove the green':h.teeLie==='fairway'?'Fairway':`${h.teeSide?Cap(h.teeSide)+' miss'+(h.teeOff!=null?` (about ${toShow('teeDist',h.teeOff)} ${fullU()} off)`:'')+' · ':''}${TEE_LIE_WORD[h.teeLie]||h.teeLie}`;
  const pen=h.teePen==='drop'?' · penalty drop':h.teePen==='retee'?' · OB, re-teed':''; return [club,where+pen,h.teeLie!=='green'&&h.teeDist!=null?`${toShow('teeDist',h.teeDist)} ${fullU()} left`:null].filter(Boolean).join(' · '); }
const appDone=h=>Number(h.putts)===0&&!h.atg?!!h.appCell:(h.appCell&&h.fp!=null)||(h.appMiss&&h.atgLie&&h.atgDist!=null&&(h.fp!=null||Number(h.putts)===0));
function fpBandText(fp){ const ft=fp/FT, b=PUTT_BANDS.find(([lo,hi])=>ft>=lo-0.01&&(hi==null||ft<hi-0.01)); return b?(b[1]==null?`${b[0]}+ ft`:`${b[0]}–${b[1]} ft`):`${Math.round(ft)} ft`; }
function appSummary(h){ const fp=h.fp!=null?`${fpBandText(h.fp)} first putt`:Number(h.putts)===0?'holed it':null;
  if(h.appCell){ const [i,j]=h.appCell.split('-').map(Number); return [`On the green · ${CELL_NAMES[i][j].toLowerCase()}`,fp].filter(Boolean).join(' · '); }
  return [`Missed ${(MISS8.find(m=>m[0]===h.appMiss)||[,''])[1].toLowerCase()}`,h.shortSided?'short-sided':null,(LIES_ATG.find(l=>l[0]===h.atgLie)||[,''])[1],h.atgDist!=null?`${toShow('atgDist',h.atgDist)} ${fullU()}`:null,Number(h.atgShots||1)>1?`${h.atgShots} shots on`:null,fp].filter(Boolean).join(' · '); }
// The pop-up asks one question at a time. Answers build up as tags you can tap to go back.
function sheetSteps(k){ return k==='miss'?['lie','dist','putt']:k==='putt'?['putt']:['tee']; }
function holeSheet(h){
  const k=S.sheet; if(!k) return '';
  const steps=sheetSteps(k), st=Math.min(S.sheetStep||0,steps.length-1), step=steps[st];
  const anim=S.sheetAnim?' anim':''; S.sheetAnim=false;
  const title=k==='tee'?`Missed ${h.teeSide}`:k==='putt'?(()=>{ const [i,j]=(h.appCell||'1-1').split('-').map(Number); return `On the green · ${CELL_NAMES[i][j].toLowerCase()}`; })():`Missed ${(MISS8.find(m=>m[0]===h.appMiss)||[,''])[1].toLowerCase()}`;
  const crumbs=k==='miss'?[[0,h.atgLie?(LIES_ATG.find(l=>l[0]===h.atgLie)||[,''])[1].replace(' / fairway',''):null],[1,h.atgDist!=null?`${toShow('atgDist',h.atgDist)} ${fullU()}`:null],[1,h.shortSided?'Short-sided':null]].filter(([i,t])=>t&&i<st):[];
  let q='', body='', next=false;
  if(step==='tee'){ q='Where was it?'; body=`<div class="big3">${[['rough','Rough'],['sand','Bunker'],['recovery','Trees']].map(([v,l])=>`<button class="chip ${h.teeLie===v&&!S.sheetPen&&h.teePen!=='drop'&&h.teePen!=='retee'?'on':''}" data-act="teelie" data-val="${v}">${l}</button>`).join('')}</div>
    <button class="chip ${S.sheetPen||h.teePen==='drop'||h.teePen==='retee'?'on':''}" data-act="teelie" data-val="pen">Penalty</button>
    ${S.sheetPen||h.teePen==='drop'||h.teePen==='retee'?`<div class="big2"><button class="chip ${h.teePen==='drop'?'on':''}" data-act="teepen" data-val="drop">Penalty drop</button><button class="chip ${h.teePen==='retee'?'on':''}" data-act="teepen" data-val="retee">OB, re-teed</button></div>`:''}`; }
  if(step==='lie'){ q='Where was it?'; body=`<div class="big3">${[['fairway','Fairway'],['rough','Rough'],['sand','Bunker']].map(([v,l])=>chip('atgLie',v,l,h.atgLie===v)).join('')}</div>`; next=!!h.atgLie; }
  if(step==='dist'){ q='How far from the flag?'; body=`<button class="sstog" data-act="shortsided" aria-pressed="${!!h.shortSided}"><span><b>Short-sided?</b><span class="small muted">Not much green between you and the flag</span></span><i class="tog ${h.shortSided?'on':''}"><i></i></i></button>
    ${distField('atgDist',ATG_CH,fullU(),toShow('atgDist',h.atgDist),'Distance to the flag')}`; next=h.atgDist!=null; }
  if(step==='putt'){ q='How long was your first putt?'; body=`${puttBands(h)}
    ${k==='miss'?`<div class="row between"><span class="small muted">Shots to get on the green</span>${stepper('atgShots',h.atgShots||1)}</div><button class="linkbtn small" style="justify-self:start" data-act="holedout">Holed it from off the green</button>`:'<span class="small muted">Putts are worked out from your score.</span>'}`; next=h.fp!=null; }
  return `<div class="sheetback" data-act="sheetclose"></div><div class="sheet${anim}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><span class="grab"></span>
    <div class="row between"><b class="stitle">${esc(title)}</b>${steps.length>1?`<span class="sdots" aria-hidden="true">${steps.map((_,i)=>`<i class="${i<=st?'on':''}"></i>`).join('')}</span>`:''}</div>
    ${crumbs.length?`<div class="crumbs">${crumbs.map(([i,t])=>`<button data-act="sheetstep" data-val="${i}">${esc(t)} ✎</button>`).join('')}</div>`:''}
    <div class="qh">${q}</div>${body}
    <div class="row between"><button class="linkbtn small" data-act="${st?'sheetstep':'sheetchange'}" data-val="${st-1}">${st?'‹ Back':'Change'}</button>${next?`<button class="btn primary small" data-act="sheetnext">${st<steps.length-1?'Next ›':'Done'}</button>`:steps.length>1?`<span class="small muted">Step ${st+1} of ${steps.length}</span>`:''}</div></div>`;
}
// After an answer, move to the next question, or close once the last one is answered.
function sheetAdvance(field){
  const h=hole(), k=S.sheet; if(!k) return;
  const steps=sheetSteps(k), st=S.sheetStep||0, step=steps[st];
  const done=(step==='lie'&&field==='atgLie')||(step==='dist'&&field==='atgDist')||(step==='putt'&&(field==='fp'||field==='putts'));
  if(!done) return;
  if(st<steps.length-1){ S.sheetStep=st+1; } else closeSheet();
}
function closeSheet(){ S.sheet=null; S.sheetStep=0; S.sheetPen=false; }
function sheetAutoClose(){
  const h=hole(), k=S.sheet; if(!k) return;
  if(k==='tee'&&h.teeLie&&h.teeLie!=='fairway'&&(!S.sheetPen||h.teePen==='drop'||h.teePen==='retee')) closeSheet();
}
function vHole(){
  const r=S.round, h=hole(), par=Number(h.par), N=r.holes.length, u=fullU();
  const sg=hsg(h);
  const scores=[]; for(let s=Math.max(1,par-2); s<=par+4; s++) scores.push(s);
  const names={'-2':'Eagle','-1':'Birdie','0':'Par','1':'Bogey','2':'Double','3':'Triple','4':'+4'};
  return `
  <div class="top"><button class="btn ghost" data-act="home">← Rounds</button><span class="muted small">${esc(r.course)}</span>${sample?'<button class="btn ghost small" data-act="talkfrom">Talk it</button>':'<span></span>'}</div>
  <div class="stack">
    <div class="holehead"><span class="holenum num">${h.n}</span><div style="flex:1"><h2>Par ${par} · ${lenShow(h.len)} ${u}</h2><span class="muted small">Hole ${S.idx+1} of ${N}${h.si?` · Index ${h.si}`:''}</span></div><button class="btn ghost small" data-act="edithole">${S.editHole?'Done':'Edit hole'}</button></div>
    ${S.editHole?`<div class="sec"><div class="holeedit"><span class="small muted">Par</span>${seg('hpar',String(par),[['3','3'],['4','4'],['5','5']])}<label class="small muted" for="hlen">Length</label><input id="hlen" class="field num" type="number" inputmode="numeric" data-hlen="1" value="${lenShow(h.len)}"><span class="muted">${u}</span></div><span class="small muted">Saved to the course for next time too.</span></div>`:''}
    <div class="dots">${r.holes.map((x,i)=>`<button class="dot ${i===S.idx?'cur':''} ${(x.unsure||[]).length?'unsure':''} ${(x.assumed||[]).length?'assumed':''} ${x.score!=null&&i!==S.idx?'done':''}" data-act="goto" data-i="${i}" aria-label="Go to hole ${x.n}">${x.n}</button>`).join('')}</div>
    ${(h.assumed||[]).length?`<div class="assumenote">The dashed parts were filled in for you. Tap the right answer if a guess is off.</div>`:''}
    ${(h.unsure||[]).length?`<div class="flagnote">Claude had to guess the highlighted parts of this hole. Tap the right answer to confirm.</div>`:''}

    <section id="sec-score" class="sec${uns(h,['score'])}${h.pickup?' pickedup':''}"><div class="lab"><h3>${h.pickup?'Shots before you picked up':'Score'}</h3>${h.pickup?`<span class="small pickcard">P · ${netDouble(h,r.hcp)} on your card</span>`:h.score!=null?`<span class="muted small">${names[String(h.score-par)]||''}</span>`:''}</div>
      ${h.pickup?`<div class="chips">${Array.from({length:par+4},(_,i)=>i+1).map(s=>chip('score',s,s,Number(h.score)===s)).join('')}</div>
      <span class="small muted">Your card gets net double bogey. Strokes gained counts the shots you played, right up to where you picked up.</span>`
      :`<div class="chips">${scores.map(s=>chip('score',s,s,Number(h.score)===s,names[String(s-par)])).join('')}${chip('score',par+5,(par+5)+'',Number(h.score)>=par+5,'or more')}</div>
      ${Number(h.score)>=par+5?stepper('score',h.score):''}`}
      <button class="pickbtn ${h.pickup?'on':''}" data-act="set" data-field="pickup" data-val="${h.pickup?'0':'1'}">${h.pickup?'✓ Picked up · tap to undo':'Picked up?'}</button>
    </section>

    ${par>=4?`
    <section id="sec-tee" class="sec${uns(h,['teeLie','teeDist','teePen'])}${asm(h,['teeLie','teeDist'])}"><div class="lab"><h3>Tee shot</h3></div>
      ${teeDone(h)&&S.editSec!=='tee'?`<button class="sumpill" data-act="editsec" data-val="tee"><span>${esc(teeSummary(h))}</span><u>Edit</u></button>`:`
      ${S.clubs?`<span class="small muted">Club</span><div class="chips wide">${CLUBS.map(([k,l])=>chip('teeClub',k,l,h.teeClub===k)).join('')}</div>`:''}
      <span class="small muted">Tap the fairway, or the side you missed.</span>
      ${teeTarget(h)}
      ${h.teeLie==='green'?((h.derived||{}).teeLie?derivedNote(h,'teeLie'):`<span class="small muted">Drove the green. Your first putt below covers it.</span>`):`<button class="linkbtn small" style="justify-self:start" data-act="set" data-field="teeLie" data-val="green">Drove the green?</button>`}
      ${assumeHint(h,'teeLie')}
      ${h.teeLie&&h.teeLie!=='green'?`<div class="lab"><span class="small muted">${h.teePen==='drop'?'Distance to the hole from your drop':h.teePen==='retee'?'Distance left after your second tee shot':'Distance left to the hole'}</span><span class="small muted">${isYd()?'yards':'metres'}</span></div>
      ${distField('teeDist',teeChoices(h.len),u,toShow('teeDist',h.teeDist),'Distance left after tee shot')}${assumeHint(h,'teeDist')}`:''}
      ${S.editSec==='tee'&&teeDone(h)?`<button class="btn small" style="justify-self:start" data-act="editsec" data-val="">Done</button>`:''}`}
    </section>`:''}

    ${par>=4&&h.teeLie==='green'?'':`<section id="sec-atg" class="sec${uns(h,['atg','atgLie','atgDist','atgShots'])}${asm(h,['atgLie','atgDist'])}"><div class="lab"><h3>${par===3?'Tee shot: where did it finish?':'Approach: where did it finish?'}</h3></div>
      ${appDone(h)&&S.editSec!=='app'?`<button class="sumpill" data-act="editsec" data-val="app"><span>${esc(appSummary(h))}</span><u>Edit</u></button>`:`
      ${par===3&&S.clubs?`<span class="small muted">Club</span><div class="chips wide">${BAG.filter(([k])=>!['driver','3wood','lw'].includes(k)).map(([k,l])=>chip('teeClub',k,l,h.teeClub===k)).join('')}</div>`:''}
      <span class="tnote">⛳ The flag is always in the middle</span>
      ${appTarget(h)}
      ${S.editSec==='app'&&appDone(h)?`<button class="btn small" style="justify-self:start" data-act="editsec" data-val="">Done</button>`:''}`}
    </section>`}

    <section id="sec-putt" class="sec${uns(h,['putts','fp'])}${asm(h,['putts','fp'])}"><div class="lab"><h3>Putting</h3></div>
      <div class="chips">${[0,1,2,3,4].map(p=>chip('putts',p,p,Number(h.putts)===p&&h.putts!=null,p===0?(h.pickup?'none':'holed off green'):p===1?'putt':'putts')).join('')}</div>${derivedNote(h,'putts')}${h.atg&&Number(h.atgShots||1)===1&&h.putts!=null&&Number(h.putts)<=1?`<span class="savepill">✓ ${h.atgLie==='sand'?'Sand save':'Up and down'}</span>`:''}
      ${Number(h.putts)>0?`<span class="small muted">First putt length (a pace is about 3 feet)</span>${puttBands(h)}${assumeHint(h,'fp')}`:''}${h.putts==null?assumeHint(h,'putts'):''}
    </section>

    ${h.pickup?`<section id="sec-pick" class="sec pickedup"><div class="lab"><h3>Where you picked up</h3></div>
      <div class="chips wide">${[['fairway','Fairway'],['rough','Rough'],['sand','Bunker'],['recovery','Trees'],['green','Green']].map(([k,l])=>chip('pickLie',k,l,h.pickLie===k)).join('')}</div>
      ${h.pickLie?`<div class="lab"><span class="small muted">Distance to the hole</span><span class="small muted">${h.pickLie==='green'?(isFt()?'feet':'metres'):(isYd()?'yards':'metres')}</span></div>
      <div class="chips">${(h.pickLie==='green'?(isFt()?[3,6,10,15,20,30,40,60]:[1,2,3,5,8,10,15,20]):[5,10,20,30,50,75,100,125,150,200]).map(v=>chip('pickDist',v,v,h.pickDist!=null&&Math.abs((h.pickLie==='green'?toShow('fp',h.pickDist):toShow('teeDist',h.pickDist))-v)<0.01)).join('')}</div>`:''}
    </section>`:''}
    <section id="sec-pen" class="sec${uns(h,['penOther'])}"><div class="row between"><div><h3>Other penalty strokes</h3><span class="small muted">Water, OB or unplayable after the tee shot</span></div>${stepper('penOther',h.penOther||0)}</div></section>
    ${holeSheet(h)}

  </div>`;
}
function vStrip(){
  const h=hole(), sg=hsg(h), last=S.idx===S.round.holes.length-1;
  const cell=(l,v,show)=>`<div>${l}<b class="${show?cls(v):''}">${show?f2(v):'–'}</b></div>`;
  return `<div class="in">
    <div class="sgcells">${cell('Tee',sg.ott,sg.ok&&h.par>=4)}${cell('Appr',sg.app,sg.ok)}${cell('Short',sg.atg,sg.ok)}${cell('Putt',sg.putt,sg.ok)}${cell('Hole',sg.total,sg.ok)}</div>
    <span class="small muted">${sg.ok?`${sg.nApp} approach shot${sg.nApp===1?'':'s'} · vs ${esc(baseShort(S.base,S.round))}`:'Strokes gained vs '+esc(baseShort(S.base,S.round))}</span>
    <div class="row" style="flex-wrap:nowrap"><button class="btn" style="flex:1" data-act="prev" ${S.idx===0?'disabled':''}>Previous</button><button class="btn primary ${sg.ok&&S.smart?'ready':''}" style="flex:2" data-act="${last?'finish':'next'}">${last?'Review round':'Next hole'}</button></div>
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
  <div class="card stack leaveout ${r.excluded?'on':''}">
    <div class="setrow"><div><b>Leave this round out of my stats</b><div class="small muted">${r.excluded?'It stays in your history, but your averages, trends, goals and the friends leaderboard ignore it.':'Feeling crook or just a write-off? It stays in your history either way.'}</div></div><button class="switch ${r.excluded?'on':''}" data-act="rexclude" aria-label="Leave this round out of my stats" aria-pressed="${!!r.excluded}"></button></div>
    ${r.excluded?`<span class="small muted">Why? (optional, just for you)</span><div class="chips wide">${LEAVE_WHY.map(([k,l])=>`<button class="chip ${r.excludeWhy===k?'on':''}" data-act="rwhy" data-val="${k}">${l}</button>`).join('')}</div>`:''}
  </div>`;
}
// ---- end-of-round review: collect anything that doesn't add up, fix with one tap ----
const dM=m=>`${lenShow(m)} ${fullU()}`, pM=m=>`${toShow('fp',m)} ${puttU()}`;
function shotParts(h){
  const par=Number(h.par), putts=Number(h.putts||0);
  const ott=par>=4?(h.teePen==='retee'?2:1):0, penTee=par>=4&&(h.teePen==='drop'||h.teePen==='retee')?1:0;
  const atg=h.atg?Number(h.atgShots||1):0, pen=Number(h.penOther||0);
  const minApp=par>=4&&h.teeLie==='green'?0:1;
  const before=ott+penTee+atg+pen;
  return {par,putts,ott,penTee,atg,pen,minApp,before,logged:before+minApp+putts,nApp:Number(h.score)-putts-before};
}
function usualDrive(r){
  const ds=[]; realRounds().filter(x=>x.id!==r.id&&!x.excluded).forEach(x=>x.holes.forEach(h=>{
    if(Number(h.par)<4||(h.teePen&&h.teePen!=='none')||h.teeLie==='green'||h.teeDist==null||(h.assumed||[]).includes('teeDist')) return;
    const d=Number(h.len)-Number(h.teeDist); if(d>80&&d<400) ds.push(d); }));
  if(ds.length<8) return null; ds.sort((a,b)=>a-b); return Math.round(ds[Math.floor(ds.length/2)]);
}
function roundFlags(r){
  const out=[], ok=new Set(r.flagOk||[]), drive=usualDrive(r);
  const anyScore=r.holes.some(h=>h.score!=null&&h.score!=='');
  r.holes.forEach((h,i)=>{
    const n=h.n, par=Number(h.par);
    const add=(kind,type,text,fixes,missing)=>{ const key=i+':'+kind; if(missing||!ok.has(key)) out.push({key,i,n,type,text,fixes,missing}); };
    const set=(o)=>()=>{ Object.assign(h,o); if(h.assumed){ h.assumed=h.assumed.filter(f=>!(f in o)); if(!h.assumed.length) delete h.assumed; } if(h.derived) Object.keys(o).forEach(f=>{ delete h.derived[f]; }); deriveHoleFor(h); };
    const ask=(kind,text,opts)=>add(kind,'Missing',text,opts.map(([l,o])=>({l,f:set(o),chip:true})),true);
    // blanks: answered right here on the card
    if(h.score==null||h.score===''){ if(anyScore) ask('noscore','No score yet.',[par-1,par,par+1,par+2,par+3].map(v=>[String(v),{score:v}])); return; }
    if(h.pickup){
      let m=false;
      if(par>=4&&!h.teeLie&&Number(h.score)>1){ ask('teeLie','Where did the tee shot finish?',LIES_TEE.map(([k,l])=>[l,{teeLie:k}])); m=true; }
      if(!h.pickLie){ ask('pickLie','Where were you when you picked up?',[['fairway','Fairway'],['rough','Rough'],['sand','Bunker'],['recovery','Trees'],['green','Green']].map(([k,l])=>[l,{pickLie:k}])); m=true; }
      else if(h.pickDist==null||h.pickDist===''){ const g=h.pickLie==='green'; ask('pickDist',`How far from the hole when you picked up? (${g?puttU():fullU()})`,(g?(isFt()?[3,6,10,15,20,30,40,60]:[1,2,3,5,8,10,15,20]):[5,10,20,30,50,75,100,125,150,200]).map(v=>[String(v),{pickDist:toStore(g?'fp':'teeDist',v)}])); m=true; }
      if(m) return;
      const sg=holeSG(h,String(myHcp(r))); if(!sg.ok&&sg.err) add('err','Missing detail',sg.err,[{l:'Open hole',go:i}]);
      return;
    }
    let miss=false;
    if(par>=4&&!h.teeLie){ ask('teeLie','Where did the tee shot finish?',LIES_TEE.map(([k,l])=>[l,{teeLie:k}])); miss=true; }
    else if(par>=4&&h.teeLie!=='green'&&(h.teeDist==null||h.teeDist==='')){ ask('teeDist',`How far was left after the tee shot? (${fullU()})`,teeChoices(h.len).map(v=>[String(v),{teeDist:toStore('teeDist',v)}])); miss=true; }
    if(h.atg&&!h.atgLie){ ask('atgLie','Where was the chip or bunker shot from?',LIES_ATG.map(([k,l])=>[l,{atgLie:k}])); miss=true; }
    else if(h.atg&&(h.atgDist==null||h.atgDist==='')){ ask('atgDist',`How far was the chip or bunker shot? (${fullU()})`,ATG_CH.map(v=>[String(v),{atgDist:toStore('atgDist',v)}])); miss=true; }
    if(h.putts==null||h.putts===''){ ask('putts','How many putts?',[0,1,2,3,4].map(v=>[String(v),{putts:v}])); miss=true; }
    else if(Number(h.putts)>0&&(h.fp==null||h.fp==='')){ ask('fp',`How long was the first putt? (${puttU()})`,(isFt()?PUTT_FT:PUTT_M).map(v=>[String(v),{fp:toStore('fp',v)}])); miss=true; }
    if(miss) return;
    const P=shotParts(h), s=Number(h.score);
    const plural=(k,w)=>`${k} ${w}${k===1?'':'s'}`;
    // 1. shots don't add up
    if(s<P.logged){
      const parts=[P.ott?plural(P.ott,'tee shot'):'',P.penTee?plural(P.penTee,'penalty'):'',P.minApp&&P.par>=4?'an approach':P.minApp?'a tee shot':'',P.atg?plural(P.atg,'chip'):'',P.pen?plural(P.pen,'penalty'):'',plural(P.putts,'putt')].filter(Boolean);
      const fx=[{l:`Change score to ${P.logged}`,f:set({score:P.logged})}];
      if(P.putts>=2&&P.logged-1<=s) fx.push({l:'Take off a putt',f:set({putts:P.putts-1})});
      add('sum','Shots don\'t add up',`Score is ${s}, but ${P.logged} shots are logged (${parts.join(', ')}).`,fx);
      return;
    }
    if(P.par>=4&&h.teeLie==='green'&&s>P.logged){
      add('sum','Shots don\'t add up',`Score is ${s}, but only ${P.logged} shots are logged.`,[{l:'Add a putt',f:set({putts:P.putts+1})},{l:`Change score to ${P.logged}`,f:set({score:P.logged})}]);
      return;
    }
    const sg=holeSG(h,String(myHcp(r)));
    if(!sg.ok&&sg.err){ add('err','Missing detail',sg.err,[{l:'Open hole',go:i}]); return; }
    const appD=P.par===3?Number(h.len):(h.teeLie==='green'?0:Number(h.teeDist));
    // 2. impossible combos
    if(P.par>=4&&h.teeLie!=='green'&&h.teeDist!=null&&Number(h.teeDist)>Number(h.len)){
      const fixTo=Math.max(30,Number(h.len)-(drive||200));
      add('dist','Doesn\'t look right',`${dM(h.teeDist)} left after the tee shot, but the hole is only ${dM(h.len)}.`,[{l:`Change to ${dM(fixTo)} left`,f:set({teeDist:fixTo})}]);
    }
    if(!h.atg&&P.putts>0&&P.nApp===1&&appD>230&&P.par<=4){
      const fx=P.nApp>=2?[{l:'I missed the green',f:set({atg:true,atgLie:'rough',atgDist:10,atgShots:1})}]:[{l:`Add a chip (score ${s+1})`,f:set({atg:true,atgLie:'rough',atgDist:10,atgShots:1,score:s+1})}];
      add('gir','Doesn\'t look right',`On the green in one shot from ${dM(appD)}${P.par===3?' on a par 3':''}.`,fx);
    }
    if(!h.atg&&P.nApp>=3&&appD>0){
      add('many','Worth a check',`${P.nApp} shots to reach the green from ${dM(appD)}, with no chip logged. Trouble or recovery shots?`,[{l:'Make one a chip',f:set({atg:true,atgLie:'rough',atgDist:15,atgShots:1})}]);
    }
    // 3. odd putting
    if(P.putts===1&&Number(h.fp)>=12) add('long1','Odd putting',`Holed a ${pM(h.fp)} first putt.`,[{l:P.nApp>=2?'Make it 2 putts':`Make it 2 putts (score ${s+1})`,f:set(P.nApp>=2?{putts:2}:{putts:2,score:s+1})}]);
    if(P.putts>=3&&h.fp!=null&&Number(h.fp)<=1.5) add('short3','Odd putting',`${P.putts} putts from ${pM(h.fp)}.`,[{l:`Make it ${P.putts-1} putts (score ${s-1})`,f:set({putts:P.putts-1,score:s-1})}]);
    if(P.putts===0) add('holed','Worth a check',`No putts, so you holed out from off the green${h.atg?' with a chip':` from ${dM(appD)}`}.`,[{l:P.nApp>=2||h.atg?'Add a putt':`Add a putt (score ${s+1})`,f:set(P.nApp>=2||h.atg?{putts:1,fp:1}:{putts:1,fp:1,score:s+1})}]);
    // 4. outliers against their own history
    if(drive&&P.par>=4&&(h.teePen||'none')==='none'&&h.teeLie!=='green'&&h.teeDist!=null){
      const d=Number(h.len)-Number(h.teeDist);
      if(d>drive+60&&d>drive*1.25) add('drive','Longer than usual',`A ${dM(d)} drive. You usually hit about ${dM(drive)}.`,[{l:`Make it ${dM(drive)}`,f:set({teeDist:Math.max(10,Number(h.len)-drive)})}]);
    }
  });
  return out;
}
function vReview(){
  const r=S.round; if(!r){ S.view='home'; return vHome(); }
  const fl=roundFlags(r); S._fx=[];
  const done=r.holes.filter(h=>h.score!=null&&h.score!=='');
  const score=done.reduce((a,h)=>a+(h.pickup?netDouble(h,r.hcp):Number(h.score)),0), par=done.reduce((a,h)=>a+Number(h.par),0), tp=score-par;
  const n=fl.length, nMiss=fl.filter(f=>f.missing).length, resolved=(r.flagOk||[]).length+(r.flagFixed||0);
  return `<div class="top"><button class="btn ghost" data-act="backholes">← Holes</button><span class="brand">Check round</span><span></span></div>
  <div class="stack">
    <div class="hero revhero"><span class="eyebrow">${esc(r.course)} · ${fmtDate(r.date)}</span>
      <div class="row between" style="flex-wrap:nowrap;align-items:flex-end"><div><div class="revscore">${score}</div><span class="small" style="opacity:.8">${tp===0?'Level par':tp>0?'+'+tp:tp} · ${done.length} hole${done.length===1?'':'s'}</span></div>
      <div class="revcount ${n?'':'ok'}">${n?`<b>${n}</b><span>thing${n===1?'':'s'} to check<br>before saving</span>`:`<b>✓</b><span>Everything<br>adds up</span>`}</div></div>
    </div>
    ${n?`<span class="small muted">${nMiss?'Tap the answer on each card. ':''}${n>nMiss?`Tap a fix and it's done. If something odd really happened, tap "It's correct".`:''}</span>`:resolved?`<span class="small muted">All sorted. Your strokes gained will be spot on.</span>`:''}
    ${fl.map(f=>{ const btns=f.fixes.map(x=>{ if(x.go!=null) return `<button class="btn small" data-act="fixhole" data-i="${x.go}">${esc(x.l)}</button>`; S._fx.push({f:x.f,key:f.key}); return x.chip?`<button class="chip small" data-act="flagfix" data-val="${S._fx.length-1}">${esc(x.l)}</button>`:`<button class="btn small primary" data-act="flagfix" data-val="${S._fx.length-1}">${esc(x.l)}</button>`; }).join('');
      if(f.missing) return `<div class="card flagcard missing"><div><span class="flagtype">Missing</span><b class="flagtxt">Hole ${f.n}: ${esc(f.text)}</b></div><div class="chips wide fixchips">${btns}</div></div>`;
      return `<div class="card flagcard"><div class="row between" style="flex-wrap:nowrap;align-items:flex-start;gap:10px"><div><span class="flagtype">${esc(f.type)}</span><b class="flagtxt">Hole ${f.n}: ${esc(f.text)}</b></div></div>
        <div class="row" style="gap:8px;align-items:center">${btns}<button class="linkbtn" data-act="flagok" data-val="${esc(f.key)}">It's correct</button></div></div>`; }).join('')}
    <button class="btn big primary" data-act="savereview" ${n?'disabled':''}>${n?`Save round (${n} to check)`:'Save round'}</button>
    ${S.saveMsg?`<span class="small muted">${esc(S.saveMsg)}</span>`:''}
  </div>`;
}
function vResults(){
  const r=S.viewing||S.round, {t,per}=rsg(r,S.base), tour=roundSG(r,'tour').t;
  const unsaved=!S.viewing&&!r.saved;
  return `
  <div class="top"><button class="btn ghost" data-act="home">← Rounds</button><span class="brand">Round</span><span></span></div>
  <div class="stack">
    <div><h1>${esc(r.course)}</h1><span class="muted">${fmtDate(r.date)} · shot ${t.score} (${t.score-t.par>=0?'+':''}${t.score-t.par}) over ${t.holes} holes ${r.example?'<span class="tag">Example</span>':''}</span></div>
    ${heroRound(r)}
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
      <tbody>${r.holes.map((h,i)=>{ const s=per[i]; const c=v=>s.ok?`<td class="${cls(v)}">${f2(v)}</td>`:'<td>–</td>'; return `<tr><td>${h.n}</td><td>${h.par}</td><td>${h.pickup?`<b class="pk">P</b> ${netDouble(h,r.hcp)}`:h.score??'–'}</td>${Number(h.par)>=4?c(s.ott):'<td class="muted">·</td>'}${c(s.app)}${c(s.atg)}${c(s.putt)}${c(s.total)}</tr>`; }).join('')}
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
function newSetup(){ S.clubOpen=null; S.clubQ=''; S.setup={name:'',cond:[],date:today(),hcp:fmtHcp(S.hcp),courseId:null,holes:Array.from({length:18},(_,i)=>({par:PARS9[i%9],len:TYPICAL_LEN[PARS9[i%9]]}))}; }
function startRound(){
  const st=S.setup; const name=st.name.trim()||'Unnamed course';
  const h=parseHcp(st.hcp); if(h!=null&&h!==S.hcp){ S.hcp=h; lsSet('sg.hcp',h); }
  S.round={id:'r'+Date.now(),date:st.date||today(),course:name,hcp:h!=null?h:S.hcp,cond:[...(st.cond||[])],saved:false,holes:st.holes.map((x,i)=>ex(i+1,x.par,Number(x.len)||TYPICAL_LEN[x.par],x.si?{si:Number(x.si)}:{}))};
  fillSI(S.round.holes,name);
  S.idx=0; S.editHole=false; saveDraft(); saveCourse(name,st.holes,st.courseId);
}
async function saveCourse(name,holes,id){
  const course={id:id||('c'+Date.now()),name,holes:holes.map(h=>({par:Number(h.par),len:Number(h.len)||TYPICAL_LEN[h.par],...(h.si?{si:Number(h.si)}:{})}))}; fillSI(course.holes,name);
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
// ---- work out what the score already tells us, live as you tap ----
// 'calc' = the only way the numbers add up; 'typical' = the usual case, easy to change
function deriveHole(h){
  const was=h.derived||{};
  Object.keys(was).forEach(f=>{ if(f==='atg'){ h.atg=false; h.atgShots=1; ['atgLie','atgDist'].forEach(x=>{ if((h.assumed||[]).includes(x)){ h[x]=null; } }); } else h[f]=null; });
  delete h.derived;
  if(h.score==null||h.score===''||h.pickup) return;
  const d={}, par=Number(h.par), score=Number(h.score);
  const parts=()=>{ const ott=par>=4?(h.teePen==='retee'?2:1):0, penTee=par>=4&&(h.teePen==='drop'||h.teePen==='retee')?1:0;
    return ott+penTee+(h.atg?Number(h.atgShots||1):0)+Number(h.penOther||0); };
  // putts given, tee result not: no room left for an approach means the drive found the green
  if(par>=4&&!h.teeLie&&h.putts!=null&&score-parts()-Number(h.putts)===0){ h.teeLie='green'; d.teeLie='calc'; }
  if(h.putts==null){
    const minApp=par>=4&&h.teeLie==='green'?0:1, rem=score-parts()-minApp;
    if(rem===0||rem===1){ h.putts=rem; d.putts='calc'; if(rem===0) h.fp=null; }
    else if(rem>=2&&S.smart){ h.putts=2; d.putts='typical'; }
  } else if(!h.atgSet&&!h.atg&&!was.putts&&h.putts!=null&&!d.putts){
    // you told us the putts: two or more shots still to place usually means a missed green and a chip
    const nApp=score-parts()-Number(h.putts), dist=par===3?Number(h.len):(h.teeLie==='green'?0:Number(h.teeDist||0));
    if(nApp>=2&&(dist===0||dist>40)&&!(par>=4&&h.teeLie==='green')){ h.atg=true; h.atgShots=1; d.atg='typical'; }
  }
  if(Object.keys(d).length) h.derived=d;
}
function deriveHoleFor(h){ deriveHole(h); }
function derivedNote(h,f){
  const k=(h.derived||{})[f]; if(!k) return '';
  const sc=Number(h.score), par=Number(h.par), names={'-3':'an albatross','-2':'an eagle','-1':'a birdie','0':'par','1':'a bogey','2':'a double'};
  const nm=names[String(sc-par)]||`a ${sc}`;
  const t=f==='putts'?(k==='calc'?(h.putts===0?`No putts: ${nm} means you holed it from off the green.`:`1 putt: anything more and it wouldn't be ${nm}.`):`2 putts for now. Tap if it was different.`)
    :f==='teeLie'?`On the green off the tee: it's the only way ${nm} adds up with those putts.`
    :f==='atg'?`${nm[0].toUpperCase()+nm.slice(1)} with ${h.putts} putt${h.putts===1?'':'s'} usually means a missed green and a chip. Tap None if not.`:'';
  return `<span class="small derivednote ${k}">${k==='calc'?'✓ ':''}${esc(t)}</span>`;
}
function setField(f,raw){
  const h=hole(); let v=raw;
  if(['score','putts','atgShots','penOther'].includes(f)) v=raw===''||raw==null?null:Number(raw);
  if(['fp','teeDist','atgDist'].includes(f)) v=toStore(f,raw);
  if(f==='atg'||f==='pickup') v=raw==='1'||raw===true;
  if(f==='pickDist') v=h.pickLie==='green'?toStore('fp',raw):toStore('teeDist',raw);
  if(f==='pickLie'&&h.pickLie!==raw) h.pickDist=null;
  if(h.derived&&h.derived[f]){ delete h.derived[f]; if(!Object.keys(h.derived).length) delete h.derived; }
  if(f==='atg') h.atgSet=true;
  h[f]=v;
  h.unsure=(h.unsure||[]).filter(x=>x!==f);
  if(h.assumed){ h.assumed=h.assumed.filter(x=>x!==f); (ASSUME_DEPS[f]||[]).forEach(d=>{ if(h.assumed.includes(d)){ h[d]=null; h.assumed=h.assumed.filter(x=>x!==d); } }); if(!h.assumed.length) delete h.assumed; }
  if(f==='teeLie'||f==='teeDist'){ // tee shot finished inside 30 m off the green: that is where the short game starts
    if(h.teeLie&&h.teeLie!=='green'&&h.teeDist!=null&&h.teeDist<=30){ h.atg=true; h.atgLie=h.teeLie==='recovery'?'rough':h.teeLie; h.atgDist=h.teeDist; }
  }
  if(f==='atg'&&v&&!h.atgShots) h.atgShots=1;
  if(f==='pickup'&&v&&(h.putts==null||(h.derived||{}).putts)){ if(h.derived) delete h.derived.putts; h.putts=0; }
  if(f==='pickup'&&!v){ h.pickLie=null; h.pickDist=null; }
  deriveHole(h);
  if(S.smart){
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
    case 'badge': S.badgeOpen=val; break;
    case 'blockfocus': { const sel=S.blockFocus||blockLeaks().slice(0,2).map(x=>x.k); S.blockFocus=sel.includes(val)?sel.filter(x=>x!==val):[...sel,val].slice(-2); break; }
    case 'blockday': { const o=blockOpts(); const d=o.days.includes(val)?o.days.filter(x=>x!==val):[...o.days,val]; S.blockOpt={...o,days:DAYS.map(x=>x[0]).filter(x=>d.includes(x))}; break; }
    case 'blockmins': S.blockOpt={...blockOpts(),mins:Number(val)}; break;
    case 'blockmissno': S.block.missDismissed=[...(S.block.missing||[])]; saveBlock(); break;
    case 'blockaddplace': { const B=S.block, rem=B.remind; S.block=buildBlock(B.focus,{days:B.dayList,mins:B.mins,places:[...B.places,val],sharp:B.sharp}); S.block.remind=rem; saveBlock(); S.blockOpt={...blockOpts(),places:S.block.places}; if(rem===true&&notifState()==='on') turnOnReminders(true); break; }
    case 'blockplace': { const o=blockOpts(); S.blockOpt={...o,places:o.places.includes(val)?o.places.filter(x=>x!==val):[...o.places,val]}; break; }
    case 'blocksharp': { const o=blockOpts(); S.blockOpt={...o,sharp:!o.sharp}; break; }
    case 'blockstart': { const f=S.blockFocus||blockLeaks().slice(0,2).map(x=>x.k); if(f.length){ if(S.block&&S.block.remind===true&&sb&&uid) sb.from('push_reminders').update({enabled:false}).eq('user_id',uid).then(()=>{},()=>{}); S.block=buildBlock(f,blockOpts()); S.block.remind=true; saveBlock(); S.view='improve'; S.impTab='plan'; S.wiz=0; window.scrollTo(0,0); if(notifState()==='on'||notifState()==='ask'){ turnOnReminders(); return; } } break; }
    case 'wizopen': S.view='planwiz'; S.wiz=0; S.blockFocus=null; window.scrollTo(0,0); break;
    case 'wizclose': S.view='improve'; S.impTab='plan'; window.scrollTo(0,0); break;
    case 'wizgo': S.wiz=Number(val); window.scrollTo(0,0); break;
    case 'libcat': S.libCat=val; break;
    case 'homeall': S.homeAll=!S.homeAll; break;
    case 'dispkind': S.dispKind=val; break;
    case 'dispclub': S.dispClub=val; break;
    case 'dispband': S.dispBand=val; break;
    case 'compreload': loadComp(true); return;
    case 'comptest': S.comp.screen='board'; S.comp.test=val; S.comp.msg=''; window.scrollTo(0,0); break;
    case 'compback': S.comp.screen='list'; S.comp.msg=''; window.scrollTo(0,0); break;
    case 'compboard': S.comp.board=val; if(val==='league'&&!S.comp.league&&S.comp.leagues[0]) S.comp.league=S.comp.leagues[0].id; if(val==='friends'&&!S.mates) loadMates(); break;
    case 'compband': S.comp.band=val; break;
    case 'compleague': if(val==='+'){ S.comp.screen='join'; S.comp.msg=''; } else { S.comp.league=val; } break;
    case 'compjoinform': S.comp.screen='join'; S.comp.msg=''; window.scrollTo(0,0); break;
    case 'compjoin': compJoin(); return;
    case 'compcreate': compCreate(); return;
    case 'compleave': if(sb&&uid) sb.from('comp_members').delete().eq('league_id',val).eq('user_id',uid).then(()=>{}); S.comp.leagues=S.comp.leagues.filter(l=>l.id!==val); if(S.comp.league===val) S.comp.league=null; S.comp.msg='You left the league.'; break;
    case 'compplay': S.comp.play={test:val,i:0,ans:[]}; S.comp.msg=''; S.view='compplay'; window.scrollTo(0,0); break;
    case 'compans': { const P=S.comp.play, t=S.comp.tests.find(x=>x.id===P.test); P.ans[P.i]=Number(val); P.i=Math.min(t.shots.length,P.i+1); break; }
    case 'compprev': S.comp.play.i=Math.max(0,S.comp.play.i-1); break;
    case 'compsave': compSave(); return;
    case 'compcancel': S.comp.play=null; S.view='improve'; S.impTab='compete'; window.scrollTo(0,0); break;
    case 'imptab': S.view='improve'; S.impTab=val; window.scrollTo(0,0); break;
    case 'blockreset': if(S.block&&S.block.remind&&sb&&uid) sb.from('push_reminders').update({enabled:false}).eq('user_id',uid).then(()=>{},()=>{}); S.block=null; saveBlock(); break;
    case 'remindoff': S.block.remind='off'; saveBlock(); S.remindMsg=''; savePushRow(null); break;
    case 'remindon': if(S.block) S.block.remind=true; turnOnReminders(); return;
    case 'notifyes': S.askNotif=false; lsSet('sg.notifAsked',true); turnOnReminders(); return;
    case 'notifno': S.askNotif=false; lsSet('sg.notifAsked',true); break;
    case 'remindat': S.block.remindAt=val; saveBlock(); if(S.block.remind){ S.remindMsg=`Reminders moved to ${fmtTime(val)}.`; savePushRow(null); } break;
    case 'blockdone': { const x=S.block.sessions[Number(val)]; x.done=true; saveBlock(); window.scrollTo(0,0); break; }
    case 'bscore': { const k=b.dataset.key, d=Number(b.dataset.d); const store=k.startsWith('t:')?(()=>{ const [,kind,cat]=k.split(':'); return [S.block.tests[kind],cat,TESTS[cat].max]; })():[S.block.scores,k,(()=>{ const id=k.split(':')[2]; return outOf(DRILL_LIB.find(x=>x.id===id)||{})||99; })()];
      const [obj,key,max]=store; const cur=obj[key]; const start=cur==null?(k.startsWith('d:')?((S.block.sessions[Number(k.split(':')[1])].items.find(it=>it.id===k.split(':')[2])||{}).target||0):Math.round(max/2)):cur;
      obj[key]=Math.max(0,Math.min(max,cur==null?start:start+d)); saveBlock(); break; }
    case 'closecele': S.celebrate=null; break;
    case 'celebadges': S.celebrate=null; S.view='stats'; S.statsTab='badges'; window.scrollTo(0,0); break;
    case 'closebadge': S.badgeOpen=null; break;
    case 'planshuffle': S.planSeed=(S.planSeed||1)+1; lsSet('sg.planSeed',S.planSeed); break;
    case 'planextra': { const e=S.plan.extra||(S.plan.extra=[]), i=e.indexOf(val); if(i>=0) e.splice(i,1); else e.push(val); lsSet('sg.plan',S.plan); saveProfile(); break; }
    case 'planmins': S.plan.mins=Number(val); lsSet('sg.plan',S.plan); saveProfile(); break;
    case 'planplace': { const pl=S.plan.places||(S.plan.places=[]), i=pl.indexOf(val); if(i>=0) pl.splice(i,1); else pl.push(val); lsSet('sg.plan',S.plan); saveProfile(); break; }
    case 'cleardemo': { const ids=S.rounds.filter(r=>r.demo).map(r=>r.id); S.rounds=S.rounds.filter(r=>!r.demo); lsSet('sg.rounds',S.rounds); S.goals={sets:[],focus:[]}; lsSet('sg.goals',S.goals); saveProfile(); if(sb&&uid&&ids.length) sb.from('rounds').delete().in('id',ids).then(()=>{},()=>{}); S.confirmDemo=false; break; }
    case 'askdemo': S.confirmDemo=true; break;
    case 'statswho': case 'statstab': S.statsTab=val; window.scrollTo(0,0); break;
    case 'learntab': S.learnTab=val; window.scrollTo(0,0); break;
    case 'mytab': S.myTab=val; if(val==='mates'&&uid&&!S.mates) loadMates(); window.scrollTo(0,0); break;
    case 'scond': { const c=S.setup.cond||(S.setup.cond=[]); const i=c.indexOf(val); if(i>=0) c.splice(i,1); else c.push(val); break; }
    case 'rexclude': case 'rwhy': { const r=S.viewing||S.round; if(a==='rexclude'){ r.excluded=!r.excluded; if(!r.excluded) delete r.excludeWhy; } else r.excludeWhy=r.excludeWhy===val?undefined:val; if(S.viewing){ persistRound(r).then(()=>{ S.viewing=S.rounds.find(x=>x.id===r.id)||r; render(); }); } else saveDraft(); break; }
    case 'rcond': { const r=S.viewing||S.round; const c=r.cond||(r.cond=[]); const i=c.indexOf(val); if(i>=0) c.splice(i,1); else c.push(val); if(S.viewing){ persistRound(r).then(()=>{ S.viewing=S.rounds.find(x=>x.id===r.id)||r; render(); }); } else saveDraft(); break; }
    case 'fixhole': { if(S.viewing){ S.round=JSON.parse(JSON.stringify(S.viewing)); S.viewing=null; } S.idx=Number(b.dataset.i); S.openExact={}; S.editHole=false; saveDraft(); S.view='hole'; window.scrollTo(0,0); break; }
    case 'newround': newSetup(); S.view='setup'; window.scrollTo(0,0); break;
    case 'resume': S.view='hole'; break;
    case 'openclub': S.clubOpen=S.clubOpen===val?'__none':val; break;
    case 'pickcourse': { const c=S.courses[Number(b.dataset.i)]; S.setup.courseId=c.id; S.setup.name=c.name; S.setup.holes=c.holes.map(h=>({par:h.par,len:h.len,si:h.si??null})); fillSI(S.setup.holes,c.name); break; }
    case 'nholes': { const n=Number(val); const hs=S.setup.holes; if(n<hs.length) S.setup.holes=hs.slice(0,n); else while(S.setup.holes.length<n){ const p=PARS9[S.setup.holes.length%9]; S.setup.holes.push({par:p,len:TYPICAL_LEN[p]}); } break; }
    case 'cpar': { const h=S.setup.holes[Number(b.dataset.i)]; const p=Number(val); if(Number(h.len)===TYPICAL_LEN[h.par]) h.len=TYPICAL_LEN[p]; h.par=p; break; }
    case 'startholes': startRound(); S.view='hole'; window.scrollTo(0,0); break;
    case 'starttalk': startRound(); S.view='talk'; window.scrollTo(0,0); break;
    case 'toholes': S.view='hole'; break;
    case 'talkfrom': S.view='talk'; break;
    case 'edithole': S.editHole=!S.editHole; break;
    case 'hpar': { const h=hole(); h.par=Number(val); saveDraft(); saveRoundCourse(); break; }
    case 'set': setField(b.dataset.field,val); if(S.sheet) sheetAdvance(b.dataset.field); break;
    case 'sheetstep': S.sheetStep=Math.max(0,Number(val)); break;
    case 'sheetnext': { const st=S.sheetStep||0; if(st<sheetSteps(S.sheet).length-1) S.sheetStep=st+1; else closeSheet(); break; }
    case 'shortsided': { const h=hole(); h.shortSided=!h.shortSided; saveDraft(); break; }
    case 'teezone': { const h=hole();
      if(val!=='fw'){ const svg=b.ownerSVGElement||b.closest('svg'), rc=svg.getBoundingClientRect(), x=(e.clientX-rc.left)/rc.width*TEE_W, f=val==='left'?(TEE_MISS-x)/TEE_MISS:(x-(TEE_W-TEE_MISS))/TEE_MISS; h.teeOff=toStore('teeDist',offFromFrac(f)); } else h.teeOff=null;
      if(val==='fw'){ h.teeSide=null; if(h.teePen==='drop'||h.teePen==='retee') setField('teePen','none'); setField('teeLie','fairway'); S.sheet=null; }
      else { h.teeSide=val; S.sheet='tee'; S.sheetStep=0; S.sheetAnim=true; S.sheetPen=h.teePen==='drop'||h.teePen==='retee'; if(h.teeLie==='fairway'||h.teeLie==='green') h.teeLie=null; saveDraft(); }
      break; }
    case 'teelie': { const h=hole(); if(val==='pen'){ S.sheetPen=true; if(!h.teeLie||h.teeLie==='fairway') setField('teeLie','rough'); } else { S.sheetPen=false; if(h.teePen==='drop'||h.teePen==='retee') setField('teePen','none'); setField('teeLie',val); } sheetAutoClose(); break; }
    case 'teepen': setField('teePen',val); sheetAutoClose(); break;
    case 'appzone': { const h=hole();
      if(val.startsWith('g-')){ h.appCell=val.slice(2); h.appMiss=null; h.shortSided=false; setField('atg','0'); S.sheet='putt'; }
      else { h.appMiss=val.slice(2); h.appCell=null; if(!h.atg) setField('atg','1'); else saveDraft(); S.sheet='miss'; }
      S.sheetStep=0; S.sheetAnim=true;
      S.editSec=null; break; }
    case 'holedout': setField('putts','0'); closeSheet(); break;
    case 'sheetclose': closeSheet(); break;
    case 'sheetchange': { const h=hole(); if(S.sheet==='tee') h.teeSide=null; else { h.appCell=null; h.appMiss=null; } closeSheet(); saveDraft(); break; }
    case 'editsec': S.editSec=val||null; break;
    case 'step': { const f=b.dataset.field, h=hole(); const min=f==='atgShots'||f==='score'?1:0; setField(f,Math.max(min,Number(h[f]||0)+Number(b.dataset.d))); S.scrollTo=null; break; }
    case 'openexact': S.openExact[b.dataset.field]=true; render(); { const el=document.getElementById('in_'+b.dataset.field); if(el) el.focus(); } return;
    case 'closeexact': S.openExact[b.dataset.field]=false; break;
    case 'goto': S.sheet=null; S.editSec=null; S.idx=Number(b.dataset.i); S.openExact={}; S.editHole=false; saveDraft(); window.scrollTo(0,0); break;
    case 'prev': S.sheet=null; S.editSec=null; if(S.idx>0){ S.idx--; S.openExact={}; S.editHole=false; window.scrollTo(0,0);} break;
    case 'next': S.sheet=null; S.editSec=null; S.idx++; S.openExact={}; S.editHole=false; window.scrollTo(0,0); syncDraftToDb(); break;
    case 'finish': S.round.holes.forEach(h=>commitAssumptions(h)); S.round.flagFixed=0; saveDraft(); S.view='review'; S.viewing=null; S.saveMsg=''; window.scrollTo(0,0); break;
    case 'backholes': S.view='hole'; window.scrollTo(0,0); break;
    case 'flagfix': { const x=(S._fx||[])[Number(val)]; if(x){ x.f(); S.round.flagFixed=(S.round.flagFixed||0)+1; saveDraft(); } break; }
    case 'flagok': { const r=S.round; r.flagOk=[...new Set([...(r.flagOk||[]),val])]; saveDraft(); break; }
    case 'savereview': { if(roundFlags(S.round).length) break; const r=S.round, before=earnedMap(); S.saveMsg='Saving…'; render(); persistRound(r).then(msg=>{ celebrateDiff(before,r); S.round=null; lsSet('sg.draft',null); S.viewing=S.rounds.find(x=>x.id===r.id); S.view='results'; S.saveMsg=msg; window.scrollTo(0,0); if(sb&&uid) sb.from('drafts').delete().eq('user_id',uid).then(()=>{},()=>{}); render(); }); return; }
    case 'open': { const r=allRounds().find(x=>x.id===b.dataset.id); S.viewing=r; S.view='results'; window.scrollTo(0,0); break; }
    case 'edit': { const r=S.viewing||S.round; S.round=JSON.parse(JSON.stringify(r)); S.viewing=null; S.idx=0; saveDraft(); S.view='hole'; break; }
    case 'save': { const r=S.round, before=earnedMap(); S.saveMsg='Saving…'; render(); persistRound(r).then(msg=>{ celebrateDiff(before,r); S.round=null; lsSet('sg.draft',null); S.viewing=S.rounds.find(x=>x.id===r.id); S.saveMsg=msg; if(sb&&uid) sb.from('drafts').delete().eq('user_id',uid).then(()=>{},()=>{}); render(); }); return; }
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
document.addEventListener('toggle',e=>{ const t=e.target; if(t.classList&&t.classList.contains('library')) S.libOpen=t.open; },true);
// Inputs update state as you type without redrawing, so a tap on the next button is never lost.
document.addEventListener('change',e=>{ const el=e.target; if(el.id==='cadphoto'&&el.files&&el.files[0]){ const f=el.files[0]; if(S.cad.url) URL.revokeObjectURL(S.cad.url); S.cad.blob=f; S.cad.url=URL.createObjectURL(f); S.cad.res=null; S.cad.err=''; render(); } });
document.addEventListener('input',e=>{
  const el=e.target;
  if(el.dataset.cad){ S.cad[el.dataset.cad]=el.value; return; }
  if(el.dataset.cf){ S.comp.form[el.dataset.cf]=el.value; return; }
  if(el.dataset.clubq){ S.clubQ=el.value; const l=document.getElementById('clublist'); if(l) l.innerHTML=clubListHtml(); return; }
  if(el.dataset.auth){ S.auth[el.dataset.auth]=el.value; return; }
  if(el.dataset.me){ me.name=el.value; clearTimeout(window.__nm); window.__nm=setTimeout(()=>{ if(sb&&uid){ sb.from('profiles').upsert({id:uid,display_name:me.name}); publishMe(); } },800); return; }
  if(el.id==='talk'){ S.talk=el.value; lsSet('sg.talk',S.talk); return; }
  if(el.dataset.num){ setField(el.dataset.num,el.value); S.scrollTo=null; const st=document.getElementById('strip'); if(!st.hidden) st.innerHTML=vStrip(); return; }
  if(el.dataset.csi!=null){ const v=parseInt(el.value,10); S.setup.holes[Number(el.dataset.csi)].si=v>=1&&v<=18?v:null; return; }
  if(el.dataset.clen!=null){ S.setup.holes[Number(el.dataset.clen)].len=el.value===''?'':toStore('len',el.value); const t=document.getElementById('ctot'); if(t) t.textContent=setupTotals(); return; }
  if(el.dataset.hlen){ const v=toStore('len',el.value); if(v){ hole().len=v; saveDraft(); saveRoundCourse(); const st=document.getElementById('strip'); if(!st.hidden) st.innerHTML=vStrip(); } return; }
  if(el.dataset.hcp){ const v=parseHcp(el.value); S[el.dataset.hcp]=v; lsSet('sg.'+el.dataset.hcp,v); if(el.dataset.hcp==='hcp') publishMe(); saveProfile(); return; }
  if(el.dataset.bag){ const v=toStore('len',el.value); if(v>0) S.bag[el.dataset.bag]=v; else delete S.bag[el.dataset.bag]; lsSet('sg.bag',S.bag); saveProfile(); return; }
  if(el.dataset.setup){ S.setup[el.dataset.setup]=el.value; if(el.dataset.setup==='name') S.setup.courseId=null; return; }
});
// Redraw after leaving a box, unless focus moved to a button (that tap redraws anyway).
document.addEventListener('focusout',e=>{ const d=e.target.dataset||{}; if(d.hcp!=null||d.hlen||d.num||d.bag){ const to=e.relatedTarget; if(!(to&&to.closest&&to.closest('[data-act]'))) render(); } });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&(S.drillOpen||S.badgeOpen||S.celebrate)){ S.drillOpen=null; S.badgeOpen=null; S.celebrate=null; render(); return; } if(e.key==='Enter'&&e.target.dataset&&(e.target.dataset.num||e.target.dataset.hcp!=null)) e.target.blur(); });

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
  if(pd&&pd.at&&pd.at>lsGet('sg.profileAt',0)){ if(pd.hcp!==undefined){ S.hcp=pd.hcp; lsSet('sg.hcp',S.hcp); } if(pd.goal!==undefined){ S.goal=pd.goal; lsSet('sg.goal',S.goal); } if(pd.bag){ S.bag=pd.bag; lsSet('sg.bag',S.bag); }  if(pd.goals){ S.goals=pd.goals; lsSet('sg.goals',S.goals); } if(pd.plan){ S.plan=pd.plan; lsSet('sg.plan',S.plan); } lsSet('sg.profileAt',pd.at); }
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
  S.matesState='loading'; if(S.view==='mygolf'&&S.myTab==='mates') render();
  const {data,error}=await sb.from('players').select('user_id,display_name,data');
  if(error){ S.matesState='slow'; if(S.view==='mygolf'&&S.myTab==='mates') render(); return; }
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
    <p class="muted" style="margin:0">${up?'Your rounds sync to your account, and you can compare with your friends.':'Sign in to pick up your rounds on this phone.'}</p>
    <form class="card stack" data-form="auth">
      ${up?`<div><label class="small muted" for="aname">Your name (shown to your friends)</label><input id="aname" class="field" autocomplete="name" data-auth="name" value="${esc(A.name)}" required></div>`:''}
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
  if(uid){ if(S.view==='auth'){ S.view='home'; }
    if(notifState()==='ask'&&isStandalone()&&!lsGet('sg.notifAsked',false)) S.askNotif=true;
    render(); loadAll();
    if(notifState()==='on'&&S.block&&S.block.remind!=='off') turnOnReminders(true); }
  else if(CONFIGURED&&!lsGet('sg.offline',false)){ S.view='auth'; render(); }
}
if(CONFIGURED&&window.supabase){
  sb=window.supabase.createClient(window.SG_CONFIG.supabaseUrl,window.SG_CONFIG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}});
  sb.auth.getSession().then(({data})=>onSession(data.session));
  sb.auth.onAuthStateChange((ev,session)=>{ if(ev==='SIGNED_IN'||ev==='SIGNED_OUT') onSession(session); });
}
window.addEventListener('online',()=>{ if(uid) loadAll(); });
if('serviceWorker' in navigator&&location.protocol==='https:') navigator.serviceWorker.register('sw.js').catch(()=>{});
if(/[?&]view=improve/.test(location.search)){ S.view='improve'; S.impTab='plan'; history.replaceState(null,'',location.pathname); }
// Lock the screen to app-style behaviour: no pinch or double-tap zoom, only scrolling and taps.
['gesturestart','gesturechange','gestureend'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
document.addEventListener('touchmove',e=>{ if(e.touches&&e.touches.length>1) e.preventDefault(); },{passive:false});
