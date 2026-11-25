/*ENGINE-START*/
// Expected strokes to hole out. Tour values follow the published PGA Tour benchmarks
// (distances in yards, putts in feet). Amateur baselines add a handicap-scaled extra on top.
const T = {
  tee:[[100,2.92],[120,2.99],[140,2.97],[160,2.99],[180,3.05],[200,3.12],[220,3.17],[240,3.25],[260,3.45],[280,3.65],[300,3.71],[320,3.79],[340,3.86],[360,3.92],[380,3.96],[400,3.99],[420,4.02],[440,4.08],[460,4.17],[480,4.28],[500,4.41],[520,4.54],[540,4.65],[560,4.74],[580,4.79],[600,4.82],[650,4.95]],
  fairway:[[1,1.95],[5,2.10],[10,2.18],[20,2.40],[40,2.60],[60,2.70],[80,2.75],[100,2.80],[120,2.85],[140,2.91],[160,2.98],[180,3.08],[200,3.19],[220,3.32],[240,3.45],[260,3.58],[280,3.69],[300,3.78],[350,3.95],[400,4.05],[500,4.40]],
  rough:[[1,2.05],[5,2.20],[10,2.34],[20,2.59],[40,2.78],[60,2.91],[80,2.96],[100,3.02],[120,3.08],[140,3.15],[160,3.23],[180,3.31],[200,3.42],[220,3.53],[240,3.64],[260,3.74],[280,3.83],[300,3.90],[350,4.05],[400,4.15],[500,4.50]],
  sand:[[1,2.20],[5,2.35],[10,2.43],[20,2.53],[40,2.82],[60,3.15],[80,3.24],[100,3.23],[120,3.21],[140,3.22],[160,3.28],[180,3.40],[200,3.55],[220,3.70],[240,3.84],[260,3.93],[280,4.00],[300,4.04],[400,4.30],[500,4.60]],
  recovery:[[10,3.00],[50,3.60],[100,3.80],[120,3.78],[140,3.80],[160,3.81],[180,3.82],[200,3.87],[220,3.92],[240,3.97],[260,4.03],[280,4.10],[300,4.20],[400,4.40],[500,4.70]],
  green:[[0,1.00],[1,1.00],[2,1.01],[3,1.04],[4,1.13],[5,1.23],[6,1.34],[7,1.42],[8,1.50],[9,1.56],[10,1.61],[15,1.78],[20,1.87],[30,1.98],[40,2.06],[50,2.14],[60,2.21],[90,2.40],[120,2.60]]
};
function interp(tab,x){
  if(x<=tab[0][0]) return tab[0][1];
  for(let i=1;i<tab.length;i++){ if(x<=tab[i][0]){ const [x0,y0]=tab[i-1],[x1,y1]=tab[i]; return y0+(y1-y0)*(x-x0)/(x1-x0);} }
  const n=tab.length, [xa,ya]=tab[n-2],[xb,yb]=tab[n-1]; return yb+(yb-ya)*(x-xb)/(xb-xa);
}
function hcpScale(base){ return base==='tour'?0:(Number(base)+3)/13; }
function ext(yd){ return yd<=250 ? 0.20+0.0016*yd : 0.6+0.0008*(yd-250); }
const LIE_MULT={fairway:1,rough:1.2,sand:1.45,recovery:1.15};
// m = metres to the hole. par only matters for tee shots.
function E(lie,m,base,par){
  if(m==null||m==='') return NaN; m=Number(m); if(isNaN(m)) return NaN;
  const s=hcpScale(base);
  if(lie==='holed') return 0;
  if(lie==='green'){ const ft=m*3.281; return interp(T.green,ft)+s*0.22*Math.pow(Math.min(1,Math.max(0,ft-1)/39),0.6); }
  const yd=m*1.0936;
  if(lie==='tee'){ const extra=(par||4)>=4 ? 0.20+ext(Math.max(0,yd-230))*1.05 : ext(yd)*0.9; return interp(T.tee,yd)+s*extra; }
  return interp(T[lie]||T.fairway,yd)+s*ext(yd)*(LIE_MULT[lie]||1);
}
// Strokes gained for one hole from its checkpoints. Shots between checkpoints cancel out,
// so only the hand-over points between categories are needed.
function holeSG(h,base){
  const out={ott:0,app:0,atg:0,putt:0,total:0,nApp:0,ok:false,err:null};
  if(h.score==null||h.score===''){ out.err='Pick a score'; return out; }
  const score=Number(h.score), putts=Number(h.putts??0), par=Number(h.par);
  if(putts>0 && (h.fp==null||h.fp==='')){ out.err='Add your first putt distance'; return out; }
  const Eg = putts>0 ? E('green',h.fp,base) : 0;
  const E0 = E('tee',h.len,base,par);
  let ottShots=0, penTee=0, startApp=E0;
  if(par>=4){
    if(!h.teeLie){ out.err='Add where your tee shot finished'; return out; }
    ottShots = h.teePen==='retee'?2:1;
    penTee = (h.teePen==='drop'||h.teePen==='retee')?1:0;
    let Et;
    if(h.teeLie==='green') Et = Eg;
    else { if(h.teeDist==null||h.teeDist===''){ out.err='Add the distance left after your tee shot'; return out; } Et = E(h.teeLie,h.teeDist,base); }
    out.ott = E0-Et-ottShots-penTee; startApp = Et;
  }
  let Ea=null, nAtg=0;
  if(h.atg){
    if(!h.atgLie||h.atgDist==null||h.atgDist===''){ out.err='Add where your short-game shot was from'; return out; }
    Ea=E(h.atgLie,h.atgDist,base); nAtg=Number(h.atgShots||1);
  }
  const penOther=Number(h.penOther||0);
  const nApp = score-putts-nAtg-ottShots-penTee-penOther;
  out.nApp=nApp;
  if(nApp<0){ out.err="The shots don't add up to your score. Check score, putts and short-game shots."; return out; }
  const endApp = Ea!=null?Ea:Eg;
  if(nApp===0 && Math.abs(startApp-endApp)>0.02 && !(par>=4 && h.atg && h.teeLie===h.atgLie && Number(h.teeDist)===Number(h.atgDist))){
    out.err="That leaves no approach shot, but the ball moved. Check score, putts and short-game shots."; return out;
  }
  out.app = nApp>0 ? startApp-endApp-nApp-penOther : -penOther;
  if(Ea!=null) out.atg = Ea-Eg-nAtg;
  out.putt = putts>0 ? Eg-putts : 0;
  out.total = out.ott+out.app+out.atg+out.putt;
  out.ok=true; return out;
}
function roundSG(r,base){
  const t={ott:0,app:0,atg:0,putt:0,total:0,holes:0,score:0,par:0,complete:true};
  const per=r.holes.map(h=>holeSG(h,base));
  per.forEach((s,i)=>{ if(s.ok){ t.ott+=s.ott;t.app+=s.app;t.atg+=s.atg;t.putt+=s.putt;t.total+=s.total;t.holes++;t.score+=Number(r.holes[i].score);t.par+=Number(r.holes[i].par);} else t.complete=false; });
  return {t,per};
}
/*ENGINE-END*/