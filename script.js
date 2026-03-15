const sheetURL = "https://opensheet.elk.sh/15VmVU4c4awO3rbVCv2PgqpoZb_CT-nlXRDxzuqBAiiQ/Feuille%201";

function convexHull(points){

    if(points.length < 3) return points;

    points.sort((a,b)=> a.x===b.x ? a.y-b.y : a.x-b.x);

    const cross = (o,a,b)=> (a.x-o.x)*(b.y-o.y)-(a.y-o.y)*(b.x-o.x);

    const lower=[];
    for(const p of points){
        while(lower.length>=2 && cross(lower[lower.length-2],lower[lower.length-1],p)<=0){
            lower.pop();
        }
        lower.push(p);
    }

    const upper=[];
    for(let i=points.length-1;i>=0;i--){
        const p=points[i];
        while(upper.length>=2 && cross(upper[upper.length-2],upper[upper.length-1],p)<=0){
            upper.pop();
        }
        upper.push(p);
    }

    upper.pop();
    lower.pop();

    return lower.concat(upper);

}

function loadSectors(data){

    const layer = document.getElementById("sectors-layer");
    layer.innerHTML = "";

    const sectors = {};

    data.forEach(p => {

        if(!p.X || !p.Y || !p.Secteur) return;

        const x = parseFloat(String(p.X).replace(",", "."));
        const y = parseFloat(String(p.Y).replace(",", "."));

        if(!sectors[p.Secteur]){

            sectors[p.Secteur] = {

                points:[],
                faction:p.Faction || "inconnue"

            };

        }

        sectors[p.Secteur].points.push({x,y});

    });

    Object.values(sectors).forEach(sec => {

    let hull = convexHull(sec.points);

        const minSize = 0.01;

if(sec.points.length <= 3){

    const cx = sec.points.reduce((a,p)=>a+p.x,0)/sec.points.length;
    const cy = sec.points.reduce((a,p)=>a+p.y,0)/sec.points.length;

    hull = [
        {x:cx-minSize,y:cy-minSize},
        {x:cx+minSize,y:cy-minSize},
        {x:cx+minSize,y:cy+minSize},
        {x:cx-minSize,y:cy+minSize}
    ];

}

const expand = 0.015;

if(hull.length < 3){

    const p1 = hull[0];
    const p2 = hull[1] || {x:p1.x+0.03,y:p1.y};

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    const length = Math.sqrt(dx*dx + dy*dy) || 0.01;

    const nx = -dy / length;
    const ny = dx / length;

    const midx = (p1.x + p2.x) / 2;
    const midy = (p1.y + p2.y) / 2;

    const size = 0.02;

    hull = [
        p1,
        p2,
        {
            x: midx + nx * size,
            y: midy + ny * size
        }
    ];

}

    const div = document.createElement("div");

    const factionClass = "faction-" + sec.faction.toLowerCase().replaceAll(" ","-");

    div.className = "sector " + factionClass;

    let polygon = "";

    hull.forEach(p=>{

        const cx = hull.reduce((a,p)=>a+p.x,0)/hull.length;
        const cy = hull.reduce((a,p)=>a+p.y,0)/hull.length;

        const dx = p.x - cx;
        const dy = p.y - cy;

        const x = p.x + dx * expand;
        const y = p.y + dy * expand;

        polygon += (x*100) + "% " + (y*100) + "%,";
    });

    polygon = polygon.slice(0,-1);

    div.style.left = "0";
    div.style.top = "0";
    div.style.width = "100%";
    div.style.height = "100%";

    div.style.clipPath = "polygon(" + polygon + ")";

    layer.appendChild(div);

});

}

async function loadPlanets(){

    const response = await fetch(sheetURL);
    const data = await response.json();

    loadSectors(data);

    console.log("Planets loaded:", data);

    const layer = document.getElementById("planets-layer");

    layer.innerHTML = "";

    data.forEach(planet => {

        if(!planet.X || !planet.Y) return;

        const div = document.createElement("div");
        div.className = "planet";

        const x = parseFloat(String(planet.X).replace(",", "."));
        const y = parseFloat(String(planet.Y).replace(",", "."));

        div.style.left = (x * 100) + "%";
        div.style.top = (y * 100) + "%";

        const img = document.createElement("img");
        img.src = "planet.png";

        const label = document.createElement("div");
        label.className = "planet-label";
        label.innerText = planet.Planète;

        div.appendChild(img);
        div.appendChild(label);

        layer.appendChild(div);

    });

}

loadPlanets();
setInterval(loadPlanets, 30000);
