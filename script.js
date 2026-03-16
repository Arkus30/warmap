const sheetURL = "https://opensheet.elk.sh/15VmVU4c4awO3rbVCv2PgqpoZb_CT-nlXRDxzuqBAiiQ/Feuille%201";

function loadSectors(data){

    const layer = document.getElementById("sectors-layer");
    layer.innerHTML = "";

    const points = [];
    const factions = [];

    data.forEach(p => {

        if(!p.X || !p.Y || !p.Secteur) return;

        const x = parseFloat(String(p.X).replace(",", "."));
        const y = parseFloat(String(p.Y).replace(",", "."));

        points.push([x,y]);

        factions.push({
            faction:p.Faction || "inconnue",
            secteur:p.Secteur
        });

    });

    if(points.length === 0) return;

    const delaunay = d3.Delaunay.from(points);
    const voronoi = delaunay.voronoi([0,0,1,1]);

    for(let i=0;i<points.length;i++){

        const polygon = voronoi.cellPolygon(i);
        if(!polygon) continue;

        const div = document.createElement("div");

        const factionClass = "faction-" + factions[i].faction
        .toLowerCase()
        .replaceAll(" ","-")
        .replaceAll("'","-");

        div.className = "sector " + factionClass;

        let clip = "";

        polygon.forEach(p => {

            clip += (p[0]*100)+"% "+(p[1]*100)+"%,";

        });

        clip = clip.slice(0,-1);

        div.style.left = "0";
        div.style.top = "0";
        div.style.width = "100%";
        div.style.height = "100%";

        div.style.clipPath = "polygon(" + clip + ")";

        layer.appendChild(div);

    }

}

function drawFactionBorders(data){

    const layer = document.getElementById("faction-borders");
    layer.innerHTML = "";

    const factions = {};

    data.forEach(p=>{

        if(!p.X || !p.Y || !p.Faction) return;

        const x = parseFloat(String(p.X).replace(",", "."));
        const y = parseFloat(String(p.Y).replace(",", "."));

        if(!factions[p.Faction]){
            factions[p.Faction] = [];
        }

        factions[p.Faction].push([x,y]);

    });

    Object.entries(factions).forEach(([faction,points])=>{

        if(points.length < 3) return;

        const delaunay = d3.Delaunay.from(points);
        const hull = delaunay.hull;

        let polygon = "";

        hull.forEach(i=>{
            const p = points[i];
            polygon += (p[0]*100)+"% "+(p[1]*100)+"%,";
        });

        polygon = polygon.slice(0,-1);

        const div = document.createElement("div");

        div.className = "faction-border faction-" + faction
        .toLowerCase()
        .replaceAll(" ","-")
        .replaceAll("'","-");

        div.style.clipPath = "polygon("+polygon+")";
        div.style.border = "4px solid white";

        layer.appendChild(div);

    });

}

async function loadPlanets(){

    const response = await fetch(sheetURL);
    const data = await response.json();

    loadSectors(data);
    drawFactionBorders(data);

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
