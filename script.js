const sheetURL = "https://opensheet.elk.sh/15VmVU4c4awO3rbVCv2PgqpoZb_CT-nlXRDxzuqBAiiQ/Sheet1";

async function loadPlanets(){

    const response = await fetch(sheetURL);
    const data = await response.json();

    const layer = document.getElementById("planets-layer");

    layer.innerHTML = "";

    data.forEach(planet => {

        const div = document.createElement("div");
        div.className = "planet";

        div.style.left = (planet.x_percent * 100) + "%";
        div.style.top = (planet.y_percent * 100) + "%";

        const img = document.createElement("img");
        img.src = "planet.png";

        div.appendChild(img);

        layer.appendChild(div);

    });

}

loadPlanets();
setInterval(loadPlanets, 30000);
