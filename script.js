const sheetURL = "https://opensheet.elk.sh/15VmVU4c4awO3rbVCv2PgqpoZb_CT-nlXRDxzuqBAiiQ/Feuille%201";

async function loadPlanets(){

    const response = await fetch(sheetURL);
    const data = await response.json();

    console.log("Planets loaded:", data);

    const layer = document.getElementById("planets-layer");

    layer.innerHTML = "";

    data.forEach(planet => {

        if(!planet.X || !planet.Y) return;

        const div = document.createElement("div");
        div.className = "planet";

        div.style.left = (planet.X * 100) + "%";
        div.style.top = (planet.Y * 100) + "%";

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
