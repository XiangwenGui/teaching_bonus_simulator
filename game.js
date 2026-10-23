// A local visual teaching-bonus calculator. No payroll data is stored or sent.
const ROOM={width:1080,height:660};
const SEATS=[];
function configureRoom(){
 const phone=window.matchMedia('(max-width:760px)').matches;
 ROOM.height=phone?1000:660;
 const rows=phone?[245,395,545,695,845]:[235,345,455,565];
 const columns=phone?[230,440,650,860]:[195,355,515,675,835];
 SEATS.splice(0,SEATS.length,...rows.flatMap(y=>columns.map(x=>({x,y}))));
 document.documentElement.style.setProperty('--room-ratio',`1080 / ${ROOM.height}`);
}
configureRoom();
const COLORS=[0xd89070,0x879eae,0xa2ab75,0xbd94a7,0xd7b15d,0x8db7a3];
const TEACHER_FACTORS=[.8,1,1.2,1.4,1.5,1.6];
const COURSES=[
 {id:'exp',name:'Exp',factor:3,threshold:4,art:'sun'},
 {id:'fnd',name:'Fnd',factor:2.4,threshold:5,art:'mountain'},
 {id:'adv',name:'Adv',factor:2.25,threshold:5,art:'landscape'},
 {id:'d1',name:'Digital 1',factor:2.625,threshold:4,art:'tablet'},
 {id:'d2',name:'Digital 2',factor:2.625,threshold:5,art:'tablet'},
 {id:'digital',name:'Digital',factor:2.25,threshold:5,art:'character'},
 {id:'sketch',name:'Sket / Draw',factor:2.25,threshold:5,art:'sketch'},
 {id:'painting',name:'Painting',factor:3,threshold:5,art:'vase'},
 {id:'elite',name:'Elite',factor:3.375,threshold:5,art:'hill'},
 {id:'portfolio',name:'AP / PD / DPD',factor:3.75,threshold:5,art:'portfolio'}
];
const selection={teacher:1,course:'exp',digital:'d1',students:0};
function calculateBonus(teacher,courseId,students,digital='d1'){
 const course=COURSES.find(c=>c.id===courseId);
 const threshold=course.threshold;
 const counted=Math.max(0,students-threshold+1);
 const standardCount=Math.max(0,Math.min(students,9)-threshold+1);
 const extraCount=Math.max(0,students-9);
 const weightedCount=standardCount+extraCount*1.5;
 const factor=TEACHER_FACTORS[teacher-1];
 const amount=weightedCount*factor*course.factor;
 return {course,threshold,counted,standardCount,extraCount,weightedCount,factor,amount,annual:amount*37};
}
// Tiny SVG pictograms use the same shapes and colors as the classroom.
function icon(kind){
 const sun='<circle cx="25" cy="20" r="7" fill="#dfb367"/>';
 const mountain='<path d="M17 49L37 22L57 49Z" fill="#91a282"/>';
 const leaf=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="7" ry="4" fill="#92a77a"/>`;
 let art='';
 if(/^t[1-6]$/.test(kind)){
  const n=Number(kind.slice(1));
  art='<circle cx="36" cy="34" r="28" fill="#c4ae88"/><circle cx="36" cy="34" r="25" fill="#f7eed8"/>';
  if(n===1)art+='<ellipse cx="36" cy="35" rx="7" ry="11" fill="#aa8960"/><path d="M33 42L39 28" stroke="#d8c29c"/>';
  else if(n===6){
   art+='<path d="M36 54V37" stroke="#83966f" stroke-width="3"/>'+leaf(28,46)+leaf(44,43);
   for(let i=0;i<8;i++){const angle=i*45;art+=`<ellipse cx="36" cy="17" rx="4.5" ry="8" fill="#d7ad58" transform="rotate(${angle} 36 29)"/>`;}
   art+='<circle cx="36" cy="29" r="9" fill="#9c7845"/><circle cx="33" cy="27" r="1" fill="#cdb17d"/><circle cx="39" cy="27" r="1" fill="#cdb17d"/><circle cx="36" cy="32" r="1" fill="#cdb17d"/>';
  }
  else{art+='<path d="M36 51V26" stroke="#83966f" stroke-width="3"/>'+leaf(29,38)+leaf(43,32);if(n>=3)art+=leaf(29,27);if(n===4)art+='<ellipse cx="36" cy="20" rx="5" ry="8" fill="#d49e83"/>';if(n===5){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;art+=`<circle cx="${36+Math.sin(a)*7}" cy="${20+Math.cos(a)*7}" r="5" fill="#dfbc72"/>`;}art+='<circle cx="36" cy="20" r="4" fill="#b78f4c"/>';}}
 }else{
  const tablet=['tablet','character'].includes(kind);
  art=`<rect x="7" y="8" width="58" height="49" rx="${tablet?5:2}" fill="${tablet?'#627b80':'#c7ac85'}"/><rect x="12" y="13" width="48" height="39" fill="${tablet?'#d4e3df':'#fff9e9'}"/>`;
  if(['sun','mountain','landscape','tablet','hill'].includes(kind))art+=sun;
  if(['mountain','landscape','tablet','hill'].includes(kind))art+=mountain;
  if(['landscape','tablet'].includes(kind))art+='<path d="M28 49L49 28L60 49Z" fill="#708f87"/>';
  if(kind==='hill')art+='<path d="M12 46Q26 38 42 46T60 45V52H12Z" fill="#b6bb83"/>';
  if(kind==='character')art+='<path d="M19 50Q19 41 29 38H43Q53 41 53 50Z" fill="#839e9b"/><path d="M29 35H43V42L36 46L29 42Z" fill="#e6bd9b"/><path d="M21 31V24Q21 14 36 14Q51 14 51 25V37L45 42V30H27V41L21 37Z" fill="#66554e"/><path d="M25 25Q25 18 36 18Q47 18 47 25V32Q46 40 36 42Q26 39 25 32Z" fill="#efc8a7"/><path d="M23 25Q22 13 36 14Q49 13 50 26L43 23L39 18L36 26L32 21L27 27Z" fill="#66554e"/><path d="M28 30Q31 27 33 30M39 30Q42 27 44 30" fill="none" stroke="#574c49" stroke-width="1.5" stroke-linecap="round"/><ellipse cx="31" cy="32" rx="1.8" ry="2.5" fill="#637f83"/><ellipse cx="41" cy="32" rx="1.8" ry="2.5" fill="#637f83"/><circle cx="31.5" cy="31" r=".7" fill="#fff9ed"/><circle cx="41.5" cy="31" r=".7" fill="#fff9ed"/><path d="M34 37Q36 39 39 36" fill="none" stroke="#bb816e" stroke-width="1"/>';

  if(kind==='sketch')art+='<path d="M25 49V45Q25 39 32 37V33Q27 30 28 23Q28 15 36 15Q44 15 44 23Q45 29 40 33V37Q48 39 48 45V49Z" fill="#d6d5cb" stroke="#aaa99e" stroke-width="1"/><path d="M36 17Q29 21 32 28L36 31V38L31 42H39V48H47V44Q46 39 39 37V32Q44 28 42 22Z" fill="#b9bcb1"/><path d="M37 23L35 28H38M33 31H38" fill="none" stroke="#8d948a" stroke-width="1"/><path d="M24 49H49V53H24Z" fill="#aaaE9f"/><path d="M62 18L55 50" stroke="#b8955f" stroke-width="3"/><path d="M55 50L54 55L57 51" fill="#665f50"/>';
  if(kind==='vase')art+='<path d="M23 20H36L34 29Q46 46 33 48H24Q13 46 25 29Z" fill="#7d9d99"/><ellipse cx="54" cy="45" rx="14" ry="10" fill="#d5b37c" stroke="#ac8e5f" stroke-width="1"/><circle cx="48" cy="42" r="3" fill="#809a8c"/><circle cx="56" cy="40" r="3" fill="#bf896d"/><circle cx="61" cy="46" r="3" fill="#ddb85e"/><ellipse cx="49" cy="49" rx="3" ry="2" fill="#f9f4e4"/><path d="M48 57L63 30" stroke="#8d795e" stroke-width="3"/><path d="M62 32L66 25L66 34Z" fill="#647d79"/>';
  if(kind==='portfolio')art+='<path d="M9 49V22H15V14H37V22H43V52H9Z" fill="#668580" stroke="#4f6f6c" stroke-width="1.5"/><path d="M20 14V10H31V14" stroke="#577570" stroke-width="3" fill="none"/><rect x="14" y="27" width="17" height="7" rx="1" fill="#e2d3af"/><path d="M30 19L52 15L60 48L38 53Z" fill="#e7d7b4" stroke="#bda57b"/><path d="M38 19L61 24L55 55L32 50Z" fill="#fff9e9" stroke="#bda57b"/><circle cx="48" cy="31" r="5" fill="#dfb56b"/><path d="M35 46L46 36L53 49Z" fill="#91a282"/>';
  if(tablet)art+='<circle cx="36" cy="54.5" r="2" fill="#fffaf0"/><path d="M68 15L66 47" stroke="#f9f5e8" stroke-width="3" stroke-linecap="round"/><path d="M66 47L65 51L68 48Z" fill="#7c8580"/>';

 }
 return `<svg xmlns="http://www.w3.org/2000/svg" width="288" height="264" viewBox="0 0 72 66" aria-hidden="true">${art}</svg>`;
}
class Studio extends Phaser.Scene{
 preload(){
  // One source of artwork for both the HTML choices and the classroom.
  const kinds=[...new Set([...COURSES.map(c=>c.art),...TEACHER_FACTORS.map((_,i)=>'t'+(i+1))])];
  kinds.forEach(kind=>this.load.svg(kind,'data:image/svg+xml;base64,'+btoa(icon(kind)),{width:288,height:264}));
 }
 create(){
  document.querySelector('.studio-loading')?.remove();
  this.cameras.main.setBackgroundColor('#e8decd');
  this.solids=[];this.students=[];this.dynamic=[];this.badgeParts=null;
  this.drawRoom();SEATS.forEach((p,i)=>this.drawDesk(p,i));

  this.refresh();
 }
 refresh(){
  this.dynamic.forEach(g=>g.destroy());this.dynamic=[];
  this.students.forEach(s=>s.destroy());this.students=[];
  const result=calculateBonus(selection.teacher,selection.course,selection.students,selection.digital);
  this.setProfessionalLevel(selection.teacher);
  // The wall always previews the selected course; only occupied desks have work.
  const backing=this.add.graphics();backing.fillStyle(0xf9efd8);backing.fillRect(528,48,104,80);
  this.dynamic.push(backing,this.add.image(580,87,result.course.art).setDisplaySize(104,80));
  SEATS.forEach((p,i)=>{
   if(i<selection.students){
    this.drawCourse(p,result.course.art);
    const earns=i>=result.threshold-1;
    if(earns){const halo=this.add.graphics();halo.fillStyle(0xe0bd6d,.38);halo.fillEllipse(p.x,p.y+(ROOM.height>660?51:37),ROOM.height>660?72:44,ROOM.height>660?27:16);halo.lineStyle(ROOM.height>660?3:1.5,0xcba044,.9);halo.strokeEllipse(p.x,p.y+(ROOM.height>660?51:37),ROOM.height>660?72:44,ROOM.height>660?27:16);this.dynamic.push(halo);}
    this.students.push(this.person(p.x,p.y+(ROOM.height>660?49:35),COLORS[i%COLORS.length]).setScale(ROOM.height>660?1:.7).setDepth(500));
   }
  });
 }
 drawCourse(p,kind){
  const artwork=this.add.image(p.x,p.y-(ROOM.height>660?33:23),kind).setDisplaySize(ROOM.height>660?88:62,ROOM.height>660?73:51);
  this.dynamic.push(artwork);
 }
  // 所有装饰都用游戏内矢量绘制，无需维护外部美术素材。
  drawRoom(){
    const g=this.add.graphics();
    g.fillStyle(0xcfc2a9);g.fillRoundedRect(111,39,917,ROOM.height-63,16);
    g.fillStyle(0xf0dfbd);g.fillRoundedRect(103,28,917,ROOM.height-63,12);
    g.fillStyle(0xf9efd8);g.fillRoundedRect(103,28,917,135,12);
    g.fillStyle(0xe9d4b0);g.fillRect(103,150,917,ROOM.height-192);
    for(let row=0;row<Math.floor((ROOM.height-192)/44);row++){const y=151+row*44;g.lineStyle(1,0xc6a679,.35);g.lineBetween(104,y,1019,y);for(let col=0;col<7;col++){const x=104+col*150+(row%2)*75;g.lineBetween(x,y,x,y+44);} }
    g.fillStyle(0xdec49a);g.fillRect(103,145,917,12);g.lineStyle(2,0xc2a580);g.lineBetween(103,157,1020,157);
    // 阳光窗户和柔和的光斑。
    [305,753].forEach(x=>{g.fillStyle(0xd7c39e);g.fillRoundedRect(x-7,48,150,84,8);g.fillStyle(0xe7f0dd);g.fillRect(x,54,136,68);g.fillStyle(0xc4d2ab);g.fillEllipse(x+35,112,68,30);g.fillEllipse(x+100,112,67,35);g.lineStyle(5,0xfff8e6);g.lineBetween(x+68,54,x+68,122);g.lineBetween(x,88,x+136,88);g.fillStyle(0xfffae8);g.fillRoundedRect(x-12,123,160,10,3);g.fillStyle(0xfff4cc,.22);g.fillPoints([{x:x,y:163},{x:x+136,y:163},{x:x+225,y:315},{x:x+20,y:315}],true);});
    // 地毯。
    g.fillStyle(0xd7d6b2,.6);g.fillRoundedRect(137,170,766,ROOM.height-215,25);g.lineStyle(2,0xf5ebd0,.7);g.strokeRoundedRect(147,180,746,ROOM.height-235,20);
    // 后墙的画与小柜。
    g.fillStyle(0xb59673);g.fillRoundedRect(533,57,92,69,3);g.fillStyle(0xfff8e6);g.fillRect(539,63,80,57);g.fillStyle(0xe7bf77);g.fillCircle(592,78,11);g.fillStyle(0xa5b493);g.fillTriangle(541,117,567,83,593,117);g.fillStyle(0x879a83);g.fillTriangle(568,117,595,91,617,117);
    this.text(580,139,'make a little magic',9,'#a29277');
    g.fillStyle(0xbda17e);g.fillRoundedRect(925,177,62,129,7);g.fillStyle(0xe0c7a0);g.fillRoundedRect(929,177,54,119,5);[215,255].forEach(y=>{g.lineStyle(2,0xbda17e);g.lineBetween(931,y,981,y);g.fillStyle(0xa58863);g.fillCircle(956,y+18,2);});
    [936,948,962].forEach((x,i)=>{g.fillStyle(COLORS[i]);g.fillRect(x,160-i*4,10,17+i*4);});
    this.solids.push({x:921,y:170,w:73,h:138});
    this.plant(904,140);this.plant(965,ROOM.height-84);
    // 徽章在每节课开始时更新。

  }
  // 专业等级仅改变墙上徽章，不改变人数门槛或计算 Bonus 金额。
  // professionalLevel: 1 种子、2 嫩芽、3 叶子、4 花、5 金色麦穗。
  setProfessionalLevel(level){
    // 仅替换徽章，不重画房间，也不影响 Bonus 门槛。
    this.badgeParts?.forEach(part=>part.destroy());
    const before=new Set(this.children.list);
    this.professionalLevel=level;
    this.drawProfessionalBadge(219,87,level);
    this.badgeParts=this.children.list.filter(part=>!before.has(part));
  }
  drawProfessionalBadge(x,y,level){
    const g=this.add.graphics();
    g.lineStyle(2,0xbba887);g.lineBetween(x-18,y-25,x,y-43);g.lineBetween(x,y-43,x+18,y-25);
    this.add.image(x,y,'t'+level).setDisplaySize(80,74);
    this.text(x,y+45,`T${level}`,17,'#877453');
  }
  text(x,y,s,size=12,color='#756b57'){return this.add.text(x,y,s,{fontFamily:'Georgia, "PingFang SC", serif',fontSize:size,color,align:'center',lineSpacing:5}).setOrigin(.5);}
  plant(x,y){const g=this.add.graphics();g.fillStyle(0x765e44,.1);g.fillEllipse(x,y+14,44,12);g.fillStyle(0xc79472);g.fillRoundedRect(x-13,y-7,26,25,5);g.lineStyle(3,0x7e9369);g.lineBetween(x,y,x,y-39);g.fillStyle(0x94a77e);g.fillEllipse(x-9,y-25,22,12);g.fillEllipse(x+9,y-37,24,13);g.fillStyle(0xa9b58b);g.fillEllipse(x-9,y-47,20,12);}
  drawDesk(p,i){
    const before=new Set(this.children.list);
    this.drawDeskNative({x:0,y:0},i);
    const parts=this.children.list.filter(part=>!before.has(part));
    this.add.container(p.x,p.y,parts).setScale(ROOM.height>660?1:.7);
  }
  drawDeskNative(p,i){
    const g=this.add.graphics();
    g.fillStyle(0x8f7451,.12);g.fillEllipse(p.x,p.y+8,99,30);
    g.lineStyle(5,0xb19469);[-35,35].forEach(dx=>g.lineBetween(p.x+dx,p.y-9,p.x+dx,p.y+16));
    g.fillStyle(0xb89d75);g.fillRoundedRect(p.x-46,p.y-60,92,65,8);
    g.fillStyle(i===9?0xe6d8b9:0xeed9b6);g.fillRoundedRect(p.x-46,p.y-65,92,62,8);
    g.lineStyle(1,0xc6aa82);g.strokeRoundedRect(p.x-46,p.y-65,92,62,8);
    g.fillStyle(0xfffbeb);g.fillRoundedRect(p.x-31,p.y-56,58,40,2);
    g.fillStyle(COLORS[i%COLORS.length]);g.fillCircle(p.x+35,p.y-40,5);
    g.lineStyle(2,0x968367);g.lineBetween(p.x+34,p.y-44,p.x+37,p.y-57);
    // 每张桌子配一张小圆凳。
    g.fillStyle(0xbda17a);g.fillRoundedRect(p.x-12,p.y+33,24,17,5);
    g.fillStyle(i===9?0xc3c4a3:0xc8b58f);g.fillEllipse(p.x,p.y+33,33,17);
    this.text(p.x,p.y-7,String(i+1).padStart(2,'0'),9,'#9c896c');
    this.solids.push({x:p.x-46,y:p.y-65,w:92,h:67});
  }
  person(x,y,color,isTeacher=false){const c=this.add.container(x,y),g=this.add.graphics();g.fillStyle(0x75634a,.15);g.fillEllipse(0,8,30,11);g.lineStyle(6,0x786958);g.lineBetween(-6,-4,-7,5);g.lineBetween(6,-4,7,5);g.fillStyle(color);g.fillRoundedRect(-14,-27,28,27,9);if(isTeacher){g.fillStyle(0xf2e6c9);g.fillRect(-8,-20,16,18);g.lineStyle(2,0xf2e6c9);g.lineBetween(-7,-25,-5,-12);g.lineBetween(7,-25,5,-12);g.fillStyle(0xce9875);g.fillCircle(3,-10,2);}g.lineStyle(5,0xe5b996);g.lineBetween(-15,-20,-17,-8);g.lineBetween(15,-20,17,-8);g.fillStyle(0x695246);g.fillCircle(0,-39,15);g.fillStyle(0xf0c9a7);g.fillEllipse(0,-35,24,25);g.fillStyle(0x695246);g.fillEllipse(-2,-47,27,14);if(isTeacher)g.fillCircle(12,-49,8);g.fillStyle(0x675348);g.fillCircle(-4,-36,1.4);g.fillCircle(5,-36,1.4);g.lineStyle(1,0xb67b65);g.lineBetween(-2,-30,3,-30);c.add(g);if(isTeacher){c.add(this.text(0,24,'You',11,'#657456'));}return c;}

}
function renderControls(){
 document.querySelector('#teacher-options').innerHTML=TEACHER_FACTORS.map((f,i)=>`<button data-teacher="${i+1}" aria-pressed="${selection.teacher===i+1}">${icon('t'+(i+1))}<strong>T${i+1}</strong><small>×${f.toFixed(1)}</small></button>`).join('');
 document.querySelector('#course-options').innerHTML=COURSES.map(c=>`<button data-course="${c.id}" aria-pressed="${selection.course===c.id}">${icon(c.art)}<strong>${c.name}</strong><small>×${c.factor}</small><small class="start-label">Bonus from student ${c.threshold}</small></button>`).join('');
 document.querySelector('#student-options').innerHTML=Array.from({length:21},(_,n)=>`<button data-students="${n}" aria-pressed="${selection.students===n}">${n}</button>`).join('');
}
function refreshUI(){
 const r=calculateBonus(selection.teacher,selection.course,selection.students,selection.digital);
 document.querySelectorAll('[data-teacher]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.teacher)===selection.teacher));
 document.querySelectorAll('[data-course]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.course===selection.course));
 document.querySelectorAll('[data-students]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.students)===selection.students));
 document.querySelectorAll('[data-digital]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.digital===selection.digital));
 document.querySelector('#digital-choice').hidden=selection.course!=='digital12';
 const name=r.course.name;
 document.querySelector('#room-label').textContent=`T${selection.teacher} · ${name} · ${selection.students} students`;
 document.querySelector('#threshold').textContent=`Bonus starts with student ${r.threshold}`;
 document.querySelector('#count-note').textContent=`${r.counted} ${r.counted===1?'student counts':'students count'} toward your bonus`;
 document.querySelector('#amount').textContent=r.amount.toFixed(2);
 document.querySelector('#mobile-amount').textContent=r.amount.toFixed(2);
 document.querySelector('#mobile-teacher').textContent='T'+selection.teacher;
 document.querySelector('#mobile-course').textContent=name;
 document.querySelector('#mobile-students').textContent=selection.students;
 document.querySelector('#both-classes').textContent=(r.amount*2).toFixed(2);
 document.querySelector('#one-class').textContent=r.amount.toFixed(2);
 document.querySelector('#annual-total').textContent=r.annual.toFixed(2);
 document.querySelector('#annual-formula').textContent=`${r.amount.toFixed(2)} per class × 37 weekly classes. Calculated before display rounding.`;
 document.querySelector('#formula').innerHTML=`<div><b>${r.weightedCount}</b><span>weighted students</span><small>${r.standardCount} × 1 + ${r.extraCount} × 1.5</small></div><i>×</i><div><b>${r.factor.toFixed(1)}</b><span>T${selection.teacher} factor</span></div><i>×</i><div><b>${r.course.factor}</b><span>${name} factor</span></div><i>=</i><div class="formula-total"><b>${r.amount.toFixed(2)}</b><span>this class</span></div>`;
 document.querySelector('#eligibility').textContent=r.counted?`Golden circles mark counted students. ${r.extraCount?`${r.extraCount} students beyond 9 receive the ×1.5 factor.`:'Students beyond 9 receive a ×1.5 factor.'}`:`Add ${r.threshold-selection.students} more ${r.threshold-selection.students===1?'student':'students'} to reach the bonus starting point.`;
 window.studioScene?.refresh();
}
renderControls();
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.teacher)selection.teacher=Number(b.dataset.teacher);
 else if(b.dataset.course){selection.course=b.dataset.course;selection.students=0;}
 else if(b.dataset.students!==undefined)selection.students=Number(b.dataset.students);
 else if(b.dataset.digital){selection.digital=b.dataset.digital;selection.students=0;}
 else return;
 refreshUI();
 mobileSelection(b);
});
refreshUI();
if(typeof Phaser==='undefined')document.querySelector('#error').hidden=false;
else new Phaser.Game({type:Phaser.AUTO,parent:'game',width:ROOM.width,height:ROOM.height,scene:class extends Studio{create(){window.studioScene=this;super.create();}},render:{antialias:true},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},banner:false});

// Mobile reuses the existing controls and calculation, without duplicate state.
const mobileMedia=window.matchMedia('(max-width:760px)');
const sheet=document.querySelector('#mobile-sheet');
const choiceHome=document.querySelector('.choices');
const choiceSections=Array.from(choiceHome.children);
let activePanel=-1,lastPanelButton=null;
function closeSheet(){
 if(sheet.open)sheet.close();
 choiceSections.forEach(section=>choiceHome.append(section));
 activePanel=-1;
}
function openSheet(index,button){
 closeSheet();
 document.body.classList.remove('show-bonus-details');
 restoreStudioSize();
 document.querySelector('#show-details').setAttribute('aria-expanded','false');
 document.querySelector('#show-details').textContent='How it adds up ↓';
 activePanel=index;lastPanelButton=button;
 document.querySelector('#sheet-title').textContent=['Choose your teaching level','Choose your class level','Students in your class'][index];
 document.querySelector('#sheet-content').append(choiceSections[index]);
 sheet.showModal();
}
document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>openSheet(Number(b.dataset.panel),b)));
document.querySelector('#sheet-close').onclick=closeSheet;
sheet.addEventListener('cancel',e=>{e.preventDefault();closeSheet()});
sheet.addEventListener('click',e=>{if(e.target===sheet){const r=sheet.getBoundingClientRect();if(e.clientY<r.top||e.clientX<r.left||e.clientX>r.right)closeSheet()}});
mobileMedia.addEventListener('change',()=>{
 closeSheet();document.body.classList.remove('show-bonus-details');configureRoom();
 if(window.studioScene){window.studioScene.scale.resize(ROOM.width,ROOM.height);window.studioScene.scene.restart();}
 restoreStudioSize();
});
document.querySelector('#show-details').onclick=()=>{
 const open=document.body.classList.toggle('show-bonus-details');
 document.querySelector('#show-details').setAttribute('aria-expanded',open);
 document.querySelector('#show-details').textContent=open?'Back to studio ↑':'How it adds up ↓';
 if(!open)restoreStudioSize();
};
function mobileSelection(button){
 if(!mobileMedia.matches||!sheet.open)return;
 // Keep the shared Digital 1/2 card open until a subtype is selected.
 if(button.dataset.course==='digital12')return;
 const rank=!!button.dataset.teacher;
 const svg=button.querySelector('svg')||((button.dataset.digital)?document.querySelector('[data-course="digital12"] svg'):null);
 const from=button.getBoundingClientRect();
 closeSheet();
 if(!svg||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const flying=document.createElement('div');flying.className='flying-choice';flying.innerHTML=svg.outerHTML;
 flying.style.left=(from.left+from.width/2-28)+'px';flying.style.top=(from.top+from.height/2-28)+'px';document.body.append(flying);
 const room=document.querySelector('#game canvas').getBoundingClientRect();
 const x=room.left+room.width*(rank?219:580)/ROOM.width;
 const y=room.top+room.height*87/ROOM.height;
 flying.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${x-from.left-from.width/2}px,${y-from.top-from.height/2}px) scale(.55)`,opacity:1}],{duration:560,easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>{flying.remove();document.querySelector('#game').animate([{filter:'brightness(1.08)'},{filter:'brightness(1)'}],{duration:350})};
}

// Cache only the pinned engine. HTML, rule code and CSS stay on the normal network path.
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('engine-cache-sw.js').catch(()=>{});});}

// Wait for the restored panel to participate in layout before Phaser measures it.
function restoreStudioSize(){
 requestAnimationFrame(()=>requestAnimationFrame(()=>window.studioScene?.scale.refresh()));
}
