const sheetURL =
"https://docs.google.com/spreadsheets/d/15VmVU4c4awO3rbVCv2PgqpoZb_CT-nlXRDxzuqBAiiQ/edit?usp=sharing"

const planetsContainer =
document.getElementById("planets")

fetch(sheetURL)

.then(res => res.json())

.then(data => {

data.forEach(planet => {

let p = document.createElement("div")

p.className = "planet"

p.style.left =
(planet["X%"] * 100) + "%"

p.style.top =
(planet["Y%"] * 100) + "%"

p.innerHTML =
'<img src="assets/planet.png">'

p.onclick = () => showPopup(planet)

planetsContainer.appendChild(p)

})

})

function showPopup(planet){

const popup =
document.getElementById("popup")

popup.classList.remove("hidden")

popup.innerHTML =

`<h2>${planet["Planète"]}</h2>

Faction : ${planet["Faction"]}<br>

Niveau : ${planet["Niveau"]}<br>

PV : ${planet["PV"]}

`

}
