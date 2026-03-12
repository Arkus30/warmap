const sheetURL = "https://opensheet.elk.sh/15VmVU4c4awO3rbVCv2PgqpoZb_CT-nlXRDxzuqBAiiQ/Sheet1";

async function loadPlanets() {

    const response = await fetch(sheetURL);
    const data = await response.json();

    const map = document.getElementById("map-container");

    // supprimer anciennes planètes
    document.querySelectorAll(".planet").forEach(p => p.remove());

    data.forEach(planet => {

        const p = document.createElement("div");
        p.className = "planet";

        p.style.left = planet.x + "%";
        p.style.top = planet.y + "%";

        const img = document.createElement("img");
        img.src = "planet.png";

        p.appendChild(img);

        map.appendChild(p);

    });

}

loadPlanets();
setInterval(loadPlanets, 30000);
