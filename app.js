import * as T from './three.module.js';
const $=s=>document.querySelector(s), scene=new T.Scene();scene.background=new T.Color('#b5c9ce');scene.fog=new T.Fog('#b5c9ce',100,390);
const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;$('#world').append(renderer.domElement);
const camera=new T.PerspectiveCamera(65,innerWidth/innerHeight,.1,700);camera.rotation.order='YXZ';scene.add(new T.HemisphereLight(0xd5e5ee,0x806e55,2.3));const sun=new T.DirectionalLight(0xffedcc,3);sun.position.set(-60,110,60);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-185,right:185,top:150,bottom:-150,far:350});sun.shadow.bias=-.0006;scene.add(sun);
const origin=[-75.15285,39.94305],c=Math.cos(.17),s=Math.sin(.17);function project([lng,lat]){let x=(lng-origin[0])*85320,z=-(lat-origin[1])*111320;return new T.Vector2(x*c-z*s,x*s+z*c)}
function texture(wood=false){const cv=document.createElement('canvas');cv.width=cv.height=256;const ctx=cv.getContext('2d');ctx.fillStyle=wood?'#827462':'#b09a82';ctx.fillRect(0,0,256,256);let seed=7;const rand=()=>((seed=seed*16807%2147483647)/2147483647);for(let y=0;y<256;y+=wood?25:16)for(let x=-32;x<256;x+=wood?300:64){let k=rand();ctx.fillStyle=wood?`rgb(${120+k*25},${107+k*22},${89+k*20})`:`rgb(${132+k*42},${68+k*28},${48+k*22})`;ctx.fillRect(x+(wood?0:(y/16%2)*32)+1,y+1,wood?298:62,wood?23:14)}const t=new T.CanvasTexture(cv);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(.85,.85);t.colorSpace=T.SRGBColorSpace;return t}
const brick=new T.MeshStandardMaterial({map:texture(),roughness:.95}),wood=new T.MeshStandardMaterial({map:texture(true),roughness:1}),unknown=new T.MeshStandardMaterial({color:0x8a8980}),roof=new T.MeshStandardMaterial({color:0x454b49,roughness:1,side:T.DoubleSide}),glass=new T.MeshStandardMaterial({color:0x34494b,roughness:.36}),trim=new T.MeshStandardMaterial({color:0xd5c9aa}),shutter=new T.MeshStandardMaterial({color:0x384e49}),door=new T.MeshStandardMaterial({color:0x354642}),stone=new T.MeshStandardMaterial({color:0x928d7e,roughness:1});
const brickVariants=[0xffffff,0xc6a08b,0xdfb9a2,0xb7a39a,0xf1d3b5].map(color=>{const m=brick.clone();m.color.setHex(color);return m});
const awnings=[0x425346,0x784b3d,0x9e8c66].map(color=>new T.MeshStandardMaterial({color,roughness:1,side:T.DoubleSide}));
const buckets=new Map();function box(mat,x,y,z,w,h,d,angle=0){if(!buckets.has(mat))buckets.set(mat,[]);const o=new T.Object3D();o.position.set(x,y,z);o.scale.set(w,h,d);o.rotation.y=angle;o.updateMatrix();buckets.get(mat).push(o.matrix.clone())}
// World-space paving textures keep individual stones at walking scale.
function paving(kind){
 const cv=document.createElement('canvas');cv.width=cv.height=512;const ctx=cv.getContext('2d');let seed=kind==='cobble'?41:93;const rand=()=>((seed=seed*16807%2147483647)/2147483647);
 ctx.fillStyle=kind==='dirt'?'#776950':'#655e50';ctx.fillRect(0,0,512,512);
 if(kind!=='dirt'){const rows=kind==='cobble'?14:4,cols=kind==='cobble'?10:4,hh=512/rows,ww=512/cols;
 for(let row=-1;row<=rows;row++)for(let col=-1;col<=cols;col++){const x=col*ww+(row%2)*ww*.5,y=row*hh,k=rand(),margin=kind==='cobble'?2.5:1.4;
 const tone=kind==='cobble'?98+k*49:132+k*30;ctx.fillStyle=`rgb(${tone+12},${tone+7},${tone-4})`;ctx.beginPath();ctx.moveTo(x+margin+rand()*3,y+margin);ctx.lineTo(x+ww-margin,y+margin+rand()*2);ctx.lineTo(x+ww-margin-1,y+hh-margin);ctx.lineTo(x+margin,y+hh-margin-rand()*2);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(40,31,22,.35)';ctx.lineWidth=2;ctx.stroke();ctx.strokeStyle='rgba(244,231,203,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+5,y+4);ctx.lineTo(x+ww-5,y+4);ctx.stroke();
 }}
 for(let i=0;i<20000;i++){let k=rand();ctx.fillStyle=k>.5?'rgba(255,240,215,.055)':'rgba(25,22,17,.075)';ctx.fillRect(rand()*512,rand()*512,1+rand()*3,1+rand()*2)}
 const map=new T.CanvasTexture(cv);map.wrapS=map.wrapT=T.RepeatWrapping;map.colorSpace=T.SRGBColorSpace;map.anisotropy=renderer.capabilities.getMaxAnisotropy();const bump=map.clone();bump.colorSpace=T.NoColorSpace;bump.needsUpdate=true;
 return new T.MeshStandardMaterial({map,bumpMap:bump,bumpScale:kind==='cobble'?.065:.025,roughness:.94})
}
const earth=paving('dirt'),cobbles=paving('cobble'),flags=paving('flags'),curbMat=new T.MeshStandardMaterial({color:0xada28b,roughness:.96});
const groundGeo=new T.PlaneGeometry(850,850);groundGeo.attributes.uv.array.forEach((v,i,arr)=>arr[i]=v*180);const ground=new T.Mesh(groundGeo,earth);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const streetAngle=.34,streetCos=Math.cos(streetAngle),streetSin=Math.sin(streetAngle);
const streetWorld=(u,v)=>new T.Vector2(u*streetCos-v*streetSin,u*streetSin+v*streetCos);
const streetLocal=(x,z)=>new T.Vector2(x*streetCos+z*streetSin,-x*streetSin+z*streetCos);
// Approximate street corridors inferred from the open bands between footprints.
const streets=[{axis:'u',at:-6,from:-185,to:177,half:4.5,walk:3.6,name:'Lombard Street'},{axis:'u',at:-55.5,from:-66,to:51,half:2.2,walk:1.9,name:'Minster Street'},{axis:'u',at:71,from:-180,to:53,half:3,walk:2.4,name:'St. Mary Street'},{axis:'u',at:-109,from:-180,to:177,half:4.5,walk:2.7,name:'Pine Street'},{axis:'u',at:108,from:-180,to:177,half:4.5,walk:2.8,name:'South Street'},{axis:'v',at:-73,from:-120,to:115,half:4.1,walk:3.1,name:'Seventh Street'},{axis:'v',at:61,from:-120,to:115,half:4.4,walk:3.1,name:'Sixth Street'}];
function surface(u,v){let walk=false;for(const r of streets){let along=r.axis==='u'?u:v,across=r.axis==='u'?v:u;if(along<r.from||along>r.to)continue;const d=Math.abs(across-r.at);if(d<=r.half)return 1;if(d<=r.half+r.walk)walk=true}return walk?2:0}
const buildings=[],wallMeshes=[];let overhead=false,yaw=0,pitch=0;const keys={};let drag=false,last=[0,0];
function inside(x,z,pts){let hit=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){let a=pts[i],b=pts[j];if((a.y>z)!=(b.y>z)&&x<(b.x-a.x)*(z-a.y)/(b.y-a.y)+a.x)hit=!hit}return hit}
function blocked(x,z,exclude){return buildings.some(b=>b!==exclude&&x>=b.minX-.3&&x<=b.maxX+.3&&z>=b.minZ-.3&&z<=b.maxZ+.3&&inside(x,z,b.pts))}
try{
const data=await(await fetch('./buildings.geojson')).json();for(const f of data.features)for(const poly of f.geometry.coordinates){const pts=poly[0].slice(0,-1).map(project),p=f.properties;buildings.push({pts,p,h:p.height*.3048,minX:Math.min(...pts.map(v=>v.x)),maxX:Math.max(...pts.map(v=>v.x)),minZ:Math.min(...pts.map(v=>v.y)),maxZ:Math.max(...pts.map(v=>v.y))})}
// Lay paving only in street corridors; yards retain earth.
const surfaces=[null,{p:[],uv:[],mat:cobbles},{p:[],uv:[],mat:flags}],step=.65;
for(let u=-185;u<178;u+=step)for(let v=-120;v<116;v+=step){const type=surface(u+step/2,v+step/2);if(!type)continue;const center=streetWorld(u+step/2,v+step/2);if(blocked(center.x,center.y))continue;const record=surfaces[type],height=type===2?.18:.025,quad=[[u,v],[u,v+step],[u+step,v+step],[u+step,v]];
 for(const i of [0,1,2,0,2,3]){const [a,b]=quad[i],w=streetWorld(a,b);record.p.push(w.x,height,w.y);record.uv.push(a/(type===1?2.8:3.2),b/(type===1?2.8:3.2))}
 if(type===2)for(const [du,dv] of [[1,0],[-1,0],[0,1],[0,-1]]){if(surface(u+step/2+du*step,v+step/2+dv*step)!==1)continue;const q=streetWorld(u+step/2+du*step/2,v+step/2+dv*step/2);box(curbMat,q.x,.09,q.y,du?.12:step,.18,du?step:.12,-streetAngle)}
}
for(const record of surfaces.slice(1)){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(record.p,3));geo.setAttribute('uv',new T.Float32BufferAttribute(record.uv,2));geo.computeVertexNormals();const m=new T.Mesh(geo,record.mat);m.receiveShadow=true;scene.add(m)}
for(const b of buildings){const {pts,p,h}=b,shape=new T.Shape(pts.map(v=>new T.Vector2(v.x,-v.y))),g=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);const mesh=new T.Mesh(g,p.material==='wood'?wood:p.material==='brick'?brickVariants[p.id%brickVariants.length]:unknown);mesh.castShadow=mesh.receiveShadow=true;mesh.userData.building=b;scene.add(mesh);wallMeshes.push(mesh);
const cx=(b.minX+b.maxX)/2,cz=(b.minZ+b.maxZ)/2,w=b.maxX-b.minX,d=b.maxZ-b.minZ;
// Fit roof axes to the building edges, not the world-coordinate bounding box.
if(p.type!=='wall'){
let fit=null;
for(let i=0;i<pts.length;i++){
 const edge=pts[(i+1)%pts.length].clone().sub(pts[i]);if(edge.length()<.5)continue;edge.normalize();
 const normal=new T.Vector2(-edge.y,edge.x),us=pts.map(v=>v.dot(edge)),vs=pts.map(v=>v.dot(normal));
 const u0=Math.min(...us),u1=Math.max(...us),v0=Math.min(...vs),v1=Math.max(...vs),area=(u1-u0)*(v1-v0);
 if(!fit||area<fit.area)fit={edge,normal,u0,u1,v0,v1,area};
}
if(fit){
 const {edge,normal,u0,u1,v0,v1}=fit;
 const local=pts.map(v=>new T.Vector2(v.dot(edge),v.dot(normal)));
 const acrossU=u1-u0<v1-v0,lo=acrossU?u0:v0,hi=acrossU?u1:v1,mid=(lo+hi)/2,span=hi-lo;
 const area=Math.abs(T.ShapeUtils.area(local)),regular=area/fit.area>.86;
 // Low provisional pitches keep unverified roofs subordinate to the street façades.
 const rise=Math.min(span*.12,p.type==='church'?1.5:.85);
 const height=v=>regular?h+rise*Math.max(0,1-Math.abs((acrossU?v.x:v.y)-mid)/(span/2)):h+.12+rise*((acrossU?v.x:v.y)-lo)/span;
 const world=v=>edge.clone().multiplyScalar(v.x).addScaledVector(normal,v.y);
 const positions=[],ends=[];
 const pieces=regular?[-1,1]:[0];
 for(const side of pieces){let clipped=[];
  if(!side)clipped=local;
  else for(let i=0;i<local.length;i++){const a=local[i],q=local[(i+1)%local.length],av=(acrossU?a.x:a.y)-mid,bv=(acrossU?q.x:q.y)-mid;if(av*side>=-1e-8)clipped.push(a.clone());if(av*bv<0)clipped.push(a.clone().lerp(q,av/(av-bv)))}
  if(clipped.length<3)continue;
  for(const tri of T.ShapeUtils.triangulateShape(clipped,[]))for(const j of tri){const v=clipped[j],w=world(v);positions.push(w.x,height(v),w.y)}
 }
 for(let i=0;i<local.length;i++){const a=local[i],q=local[(i+1)%local.length],av=(acrossU?a.x:a.y)-mid,bv=(acrossU?q.x:q.y)-mid,chain=[a];if(regular&&av*bv<0)chain.push(a.clone().lerp(q,av/(av-bv)));chain.push(q);
  for(let j=0;j<chain.length-1;j++){const v=chain[j],u=chain[j+1],vw=world(v),uw=world(u);ends.push(vw.x,h,vw.y,uw.x,h,uw.y,vw.x,height(v),vw.y,uw.x,h,uw.y,uw.x,height(u),uw.y,vw.x,height(v),vw.y)}
 }
 function roofMesh(vertices,material){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));const uv=[];for(let i=0;i<vertices.length;i+=3)uv.push((vertices[i]+vertices[i+2])*.5,vertices[i+1]);geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.computeVertexNormals();const m=new T.Mesh(geo,material);m.castShadow=m.receiveShadow=true;scene.add(m)}
 roofMesh(positions,roof);roofMesh(ends,p.material==='wood'?wood:p.material==='brick'?brick:unknown);
 // Locate chimneys on the footprint rather than outside concave rear wings.
 const candidate=new T.Vector2(u0+(u1-u0)*.3,v0+(v1-v0)*.3),wp=world(candidate);
 if(span>2.5&&inside(wp.x,wp.y,pts))box(brick,wp.x,height(candidate)+.5,wp.y,.55,1.2,.7,Math.atan2(-edge.y,edge.x));
}
}
if(p.type==='wall')continue;
let area=0;for(let i=0;i<pts.length;i++){let a=pts[i],q=pts[(i+1)%pts.length];area+=a.x*q.y-q.x*a.y}
let entrance=false;for(let i=0;i<pts.length;i++){const a=pts[i],q=pts[(i+1)%pts.length],dx=q.x-a.x,dz=q.y-a.y,len=Math.hypot(dx,dz);if(len<2.4)continue;const ux=dx/len,uz=dz/len,sign=area>0?1:-1,nx=uz*sign,nz=-ux*sign,mx=(a.x+q.x)/2,mz=(a.y+q.y)/2;if(blocked(mx+nx*.7,mz+nz*.7,b))continue;const angle=Math.atan2(-uz,ux),n=Math.max(1,Math.floor(len/2.5)),floors=Math.max(1,Math.round(p.height/12));
const put=(mat,t,y,ww,hh,dd,off=.06)=>box(mat,a.x+ux*t+nx*off,y,a.y+uz*t+nz*off,ww,hh,dd,angle);
for(let j=0;j<n;j++){let t=len*(j+.5)/n;if(blocked(a.x+ux*t+nx*.8,a.y+uz*t+nz*.8,b))continue;for(let f=0;f<floors;f++){let yy=f*3.6576+2.0,wh=f===floors-1?1.32:1.65,ww=Math.min(1.0,len/n*.5);const isDoor=f===0&&j===0&&len<15;const shop=f===0&&p.type.includes('store')&&!isDoor;if(isDoor){put(trim,t,1.45,1.25,2.7,.18);put(door,t,1.35,1,2.45,.2,.18);put(glass,t,2.55,.9,.3,.22,.19);put(stone,t,.15,1.45,.3,.9,.4);entrance=true;continue}if(shop){ww=Math.min(1.7,len/n*.8);wh=2.2;yy=1.8;
 const where=streetLocal(a.x+ux*t+nx*1.2,a.y+uz*t+nz*1.2);
 if(surface(where.x,where.y)>0){const cloth=awnings[p.id%awnings.length],positions=[];for(const [side,out,y] of [[-1,.12,3.1],[-1,1.15,2.7],[1,1.15,2.7],[-1,.12,3.1],[1,1.15,2.7],[1,.12,3.1]])positions.push(a.x+ux*(t+side*(ww+.35)/2)+nx*out,y,a.y+uz*(t+side*(ww+.35)/2)+nz*out);const canopyGeo=new T.BufferGeometry();canopyGeo.setAttribute('position',new T.Float32BufferAttribute(positions,3));canopyGeo.computeVertexNormals();const canopy=new T.Mesh(canopyGeo,cloth);canopy.castShadow=true;scene.add(canopy);put(cloth,t,2.62,ww+.35,.16,.05,1.15);put(door,t,3.26,ww+.5,.22,.17,.12)}
 }put(trim,t,yy,ww+.2,wh+.18,.13);put(glass,t,yy,ww,wh,.17,.13);put(trim,t,yy,.045,wh,.2,.19);put(trim,t,yy,ww,.045,.2,.19);if(!shop){put(shutter,t-ww*.78,yy,ww*.43,wh,.15);put(shutter,t+ww*.78,yy,ww*.43,wh,.15)}}}put(trim,len/2,h-.16,len,.23,.3);}
}
for(const [mat,matrices] of buckets){const inst=new T.InstancedMesh(new T.BoxGeometry(1,1,1),mat,matrices.length);matrices.forEach((m,i)=>inst.setMatrixAt(i,m));inst.castShadow=inst.receiveShadow=true;scene.add(inst)}
function reset(){overhead=false;$('#overview').textContent='View from above';const v=streetWorld(-52,-6);camera.position.set(v.x,1.7,v.y);if(blocked(v.x,v.y)){for(let z=-20;z<30;z+=1){if(!blocked(v.x,z)){camera.position.z=z;break}}}yaw=-Math.PI/2-streetAngle;pitch=-.035;camera.rotation.set(pitch,yaw,0);$('#location').textContent='Lombard Street';}
reset();$('#loading').remove();$('#reset').onclick=reset;$('#overview').onclick=()=>{overhead=!overhead;if(overhead){camera.position.set(10,230,120);camera.lookAt(0,0,0);$('#overview').textContent='Back to street';$('#location').textContent='Neighborhood overview'}else reset()};
$('#walk').onclick=()=>{if(overhead)reset();renderer.domElement.requestPointerLock?.()};document.addEventListener('pointerlockchange',()=>{$('#walk').textContent=document.pointerLockElement?'Esc to release':'Walk here'});$('#about').onclick=()=>{$('#info').hidden=!$('#info').hidden};$('#close').onclick=()=>$('#info').hidden=true;
renderer.domElement.addEventListener('pointerdown',e=>{drag=true;last=[e.clientX,e.clientY];renderer.domElement.setPointerCapture(e.pointerId)});renderer.domElement.addEventListener('pointerup',()=>drag=false);document.addEventListener('pointermove',e=>{if(overhead)return;if(document.pointerLockElement||drag){let dx=document.pointerLockElement?e.movementX:e.clientX-last[0],dy=document.pointerLockElement?e.movementY:e.clientY-last[1];yaw-=dx*.003;pitch=Math.max(-1.2,Math.min(1.2,pitch-dy*.003));camera.rotation.set(pitch,yaw,0);last=[e.clientX,e.clientY]}});
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();keys[e.code]=true});addEventListener('keyup',e=>keys[e.code]=false);addEventListener('blur',()=>{for(let k in keys)keys[k]=false;drag=false});document.querySelectorAll('[data-key]').forEach(el=>{el.onpointerdown=e=>{el.setPointerCapture(e.pointerId);keys[el.dataset.key]=true};el.onpointerup=el.onpointercancel=()=>keys[el.dataset.key]=false});
const map=$('#map'),ctx=map.getContext('2d'),ray=new T.Raycaster();let lastTime=performance.now(),tick=0;
function render(now){requestAnimationFrame(render);const dt=Math.min((now-lastTime)/1000,.04);lastTime=now;if(!overhead){let forward=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),side=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),speed=(keys.ShiftLeft?5:2.5)*dt/Math.max(1,Math.hypot(forward,side));let dx=(-Math.sin(yaw)*forward+Math.cos(yaw)*side)*speed,dz=(-Math.cos(yaw)*forward-Math.sin(yaw)*side)*speed;let x=camera.position.x,z=camera.position.z;if(Math.abs(x+dx)<200&&!blocked(x+dx+Math.sign(dx)*.3,z))camera.position.x+=dx;if(Math.abs(z+dz)<160&&!blocked(camera.position.x,z+dz+Math.sign(dz)*.3))camera.position.z+=dz;}
if(!overhead){const local=streetLocal(camera.position.x,camera.position.z);const target=surface(local.x,local.y)===2?1.88:1.725;camera.position.y+=(target-camera.position.y)*Math.min(1,dt*12);let closest=null;for(const road of streets){const along=road.axis==='u'?local.x:local.y,d=Math.abs((road.axis==='u'?local.y:local.x)-road.at);if(along>=road.from&&along<=road.to&&d<road.half+road.walk&&(!closest||d<closest.d))closest={d,name:road.name}}$('#location').textContent=closest?.name||'Neighborhood passage';}if(tick++%15===0){ray.setFromCamera(new T.Vector2(0,0),camera);const hit=ray.intersectObjects(wallMeshes)[0];let b=hit?.object.userData.building;$('#focus').hidden=!b||hit.distance>24||overhead;if(b&&hit.distance<24){$('#focus').textContent=(b.p.name||b.p.type+' · Building '+b.p.id)+' — '+b.p.height+' ft to roofline';}ctx.clearRect(0,0,200,150);for(const b of buildings){ctx.beginPath();b.pts.forEach((p,i)=>ctx[i?'lineTo':'moveTo'](100+p.x*.48,75+p.y*.48));ctx.closePath();ctx.fillStyle=b.p.material==='wood'?'#aa9973':'#d1b79b';ctx.fill()}ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(100+camera.position.x*.48,75+camera.position.z*.48,3,0,Math.PI*2);ctx.fill();}
renderer.render(scene,camera)}requestAnimationFrame(render);
// A small structured navigation tool for accessible agent-assisted exploration.
if(document.modelContext?.registerTool)document.modelContext.registerTool({name:'return_to_lombard',description:'Return the walking view to its starting point on Lombard Street.',inputSchema:{type:'object',properties:{}},execute:async()=>{reset();return {content:[{type:'text',text:'Returned to Lombard Street.'}]}}});
}catch(e){console.error(e);$('#loading').textContent='The neighborhood could not load. Please reload the page.'}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
