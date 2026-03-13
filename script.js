const sheetURL = "https://opensheet.elk.sh/15VmVU4c4awO3rbVCv2PgqpoZb_CT-nlXRDxzuqBAiiQ/Feuille%201";

function loadSectors(data){

    const layer = document.getElementById("sectors-layer");
    layer.innerHTML = "";

    const sectors = {};

    data.forEach(planet => {

        if(!planet.X || !planet.Y || !planet.Secteur) return;

        const x = parseFloat(String(planet.X).replace(",", "."));
        const y = parseFloat(String(planet.Y).replace(",", "."));

        if(!sectors[planet.Secteur]){
            sectors[planet.Secteur] = {
                xTotal:0,
                yTotal:0,
                count:0,
                faction:planet.Faction || "inconnue"
            };
        }

        sectors[planet.Secteur].xTotal += x;
        sectors[planet.Secteur].yTotal += y;
        sectors[planet.Secteur].count++;

    });

    Object.values(sectors).forEach(sector => {

        const x = sector.xTotal / sector.count;
        const y = sector.yTotal / sector.count;

        const div = document.createElement("div");

        const factionClass = "faction-" + sector.faction.toLowerCase();

        div.className = "sector " + factionClass;

        div.style.left = (x * 100) + "%";
        div.style.top = (y * 100) + "%";

        div.style.width = "220px";
        div.style.height = "220px";

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
