const sheetURL = "https://opensheet.elk.sh/15VmVU4c4awO3rbVCv2PgqpoZb_CT-nlXRDxzuqBAiiQ/Feuille%201";

function openPlanetPopup(planet, element){
    document.querySelectorAll(".planet").forEach(p => {
    p.classList.remove("selected");
    });
    element.classList.add("selected");

    const uiLayer = document.getElementById("ui-layer");
    uiLayer.innerHTML = "";

    const popup = document.createElement("div");
    popup.className = "planet-popup";

    const factionSlug = (planet.Faction || "neutre")
    .toLowerCase()
    .replaceAll(" ","-")
    .replaceAll("'","-");

    popup.innerHTML = `
        <div class="popup-header">
            <div class="popup-title-group">
                <img src="${factionSlug}.png" class="faction-icon">
                <span class="popup-title">${planet.Planète || "Inconnue"}</span>
            </div>
            <span class="popup-close">✖</span>
        </div>

        <div class="popup-body">
            <div><b>Faction :</b> ${planet.Faction || "Neutre"}</div>
            <div><b>Niveau :</b> ${planet.Niveau || "?"}</div>
            <div><b>PC :</b> ${(planet.Niveau || 1) * 100}</div>
            <div><b>Modificateurs planétaires :</b> ${
                planet["Modificateurs Planètaires"] || "Aucun"
            }</div>

            ${
                planet.Modificateurs
                ? `<div><b>Modificateurs :</b> ${planet.Modificateurs}</div>`
                : ""
            }

            ${
                planet.Objectifs
                ? `<div><b>Objectifs spéciaux :</b> ${planet.Objectifs}</div>`
                : ""
            }
        </div>
    `;

    const rect = element.getBoundingClientRect();
const container = document.getElementById("map-container").getBoundingClientRect();

let x = rect.left - container.left + rect.width / 2;
let y = rect.top - container.top;

uiLayer.appendChild(popup);

// taille du popup (approx ou réelle après insertion)
const popupWidth = popup.offsetWidth;
const popupHeight = popup.offsetHeight;

// --- gestion verticale ---
let finalY = y - 10; // au-dessus par défaut
let transformY = "-100%";

// si ça dépasse en haut → on met en dessous
if(finalY - popupHeight < 0){
    finalY = y + rect.height + 10;
    transformY = "0%";
}

// --- gestion horizontale ---
let finalX = x;

// marge écran
const margin = 10;

if(finalX - popupWidth/2 < margin){
    finalX = popupWidth/2 + margin;
}

if(finalX + popupWidth/2 > container.width - margin){
    finalX = container.width - popupWidth/2 - margin;
}

// application
popup.style.left = finalX + "px";
popup.style.top = finalY + "px";
popup.style.transform = `translate(-50%, ${transformY})`;
popup.style.transformOrigin = "center";
if(transformY === "0%"){
    popup.classList.add("below");
}

    const factionClass = "faction-" + factionSlug;
    popup.classList.add(factionClass);

    popup.querySelector(".popup-close").onclick = () => {
        popup.classList.remove("show");
        popup.classList.add("hide");

        setTimeout(() => {
            uiLayer.innerHTML = "";
        }, 200);
    };

    setTimeout(() => {
        popup.classList.add("show");
    }, 10);
}

function loadSectors(data){

    const layer = document.getElementById("sectors-layer");
    layer.innerHTML = "";

    const points = [];
    const factions = [];

    data.forEach(p => {
        const hasModifier = (p.Modificateurs || "").trim() !== "";

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
        div.dataset.name = planet.Planète || "";
        div.dataset.faction = planet.Faction || "";
        div.dataset.modifiers = planet.Modificateurs || "";
        const factionSlug = (planet.Faction || "neutre")
        .toLowerCase()
        .replaceAll(" ","-")
        .replaceAll("'","-");

    div.className = "planet faction-" + factionSlug;
        div.addEventListener("mouseenter", () => {
        div.classList.add("hovered");
        });

        div.addEventListener("mouseleave", () => {
        div.classList.remove("hovered");
        });

        div.addEventListener("click", (e) => {
        e.stopPropagation();
        openPlanetPopup(planet, div);
        });
    
        const x = parseFloat(String(planet.X).replace(",", "."));
        const y = parseFloat(String(planet.Y).replace(",", "."));

        div.style.left = (x * 100) + "%";
        div.style.top = (y * 100) + "%";

        const img = document.createElement("img");
        const isCapital = (planet.Capitale || "")
        .trim()
        .toLowerCase() === "oui";
        console.log(planet.Planète, "Capitale =", planet.Capitale);
        const hasModifier = (planet.Modificateurs || "").trim() !== "";
        if(hasModifier){

        const modIcon = document.createElement("img");
        modIcon.src = "modificateur.png";
        modIcon.className = "modifier-icon";

        div.appendChild(modIcon);
    }
        const climate = (planet.Climat || "rocheuse")
        .toLowerCase()
        .replaceAll(" ","-");

        const possible = [
        "rocheuse",
        "gazeuse",
        "océanique",
        "végétation-dense",
        "chaleur-ardente",
        "chaleur-intense",
        "froid-intense",
        "trou-noir",
        "aucun-modificateur",
        "terraformation-chimérique",
        "artificielle"
        ];

        img.src = possible.includes(climate) ? climate + ".png" : "rocheuse.png";
        const label = document.createElement("div");
        label.className = "planet-label";
        label.innerText = planet.Planète;

        div.appendChild(img);
        div.appendChild(label);
        if(isCapital){

        const capitalIcon = document.createElement("img");
        capitalIcon.src = "capitale.png";
        capitalIcon.className = "capital-icon";

    div.appendChild(capitalIcon);
    }
    layer.appendChild(div);
    });

}

loadPlanets();
setInterval(loadPlanets, 30000);
