const sheetURL = "https://opensheet.elk.sh/15VmVU4c4awO3rbVCv2PgqpoZb_CT-nlXRDxzuqBAiiQ/Feuille%201";

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

                minX:x,
                maxX:x,
                minY:y,
                maxY:y,
                faction:p.Faction || "inconnue"

            };

        }else{

            sectors[p.Secteur].minX = Math.min(sectors[p.Secteur].minX,x);
            sectors[p.Secteur].maxX = Math.max(sectors[p.Secteur].maxX,x);
            sectors[p.Secteur].minY = Math.min(sectors[p.Secteur].minY,y);
            sectors[p.Secteur].maxY = Math.max(sectors[p.Secteur].maxY,y);

        }

    });

    Object.values(sectors).forEach(sec => {

        const div = document.createElement("div");

        const factionClass = "faction-" + sec.faction.toLowerCase().replaceAll(" ","-");

        div.className = "sector " + factionClass;

        div.style.left = (sec.minX * 100) + "%";
        div.style.top = (sec.minY * 100) + "%";

        div.style.width = ((sec.maxX-sec.minX)*100) + "%";
        div.style.height = ((sec.maxY-sec.minY)*100) + "%";

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
