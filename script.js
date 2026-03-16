const sheetURL = "https://opensheet.elk.sh/15VmVU4c4awO3rbVCv2PgqpoZb_CT-nlXRDxzuqBAiiQ/Feuille%201";

function loadSectors(data){

    const layer = document.getElementById("sectors-layer");
    layer.innerHTML = "";

    const points = [];
    const meta = [];

    data.forEach(p => {

        if(!p.X || !p.Y || !p.Secteur) return;

        const x = parseFloat(String(p.X).replace(",", "."));
        const y = parseFloat(String(p.Y).replace(",", "."));

        points.push([x,y]);

        meta.push({
            secteur:p.Secteur,
            faction:p.Faction || "inconnue"
        });

    });

    const delaunay = d3.Delaunay.from(points);
    const voronoi = delaunay.voronoi([0,0,1,1]);

    const sectors = {};

    for(let i=0;i<points.length;i++){

        const polygon = voronoi.cellPolygon(i);
        if(!polygon) continue;

        const secteur = meta[i].secteur;

        if(!sectors[secteur]){

            sectors[secteur] = {
                faction:meta[i].faction,
                cells:[]
            };

        }

        sectors[secteur].cells.push(polygon);

    }

    Object.values(sectors).forEach(sec => {

        const div = document.createElement("div");

        const factionClass = "faction-" + sec.faction.toLowerCase().replaceAll(" ","-");

        div.className = "sector " + factionClass;

        let clip = "";

        sec.cells.forEach(cell => {

            cell.forEach(p => {

                clip += (p[0]*100)+"% "+(p[1]*100)+"%,";

            });

        });

        clip = clip.slice(0,-1);

        div.style.left = "0";
        div.style.top = "0";
        div.style.width = "100%";
        div.style.height = "100%";

        div.style.clipPath = "polygon(" + clip + ")";

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
