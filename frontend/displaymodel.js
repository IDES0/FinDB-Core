data = JSON.parse(document.currentScript.getAttribute('data'));

tableElement = document.getElementById(document.currentScript.getAttribute('idname'));

//displays the column names
theadElement = document.createElement("thead");
trElement = document.createElement("tr");

tableIndexHeader = document.createElement("th");
tableIndexHeader.setAttribute("scope", "col");
tableIndexHeader.innerText = "#";
trElement.appendChild(tableIndexHeader);

for (let key in data[0]) {
    thElement = document.createElement("th");
    thElement.setAttribute("scope", "col");
    thElement.innerText = key;
    trElement.appendChild(thElement);
    theadElement.appendChild(trElement);
}
tableElement.appendChild(theadElement);

//displays the information
tbodyElement = document.createElement("tbody");
for (let i = 0; i < data.length; i++) {
    trElement = document.createElement("tr");
    tableIndex = document.createElement("th");
    tableIndex.setAttribute("scope", "row");
    index = i + 1
    tableIndex.innerText = index.toString();
    trElement.appendChild(tableIndex);
    for (let key in data[i]) {
        tdElement = document.createElement("td");
        tdElement.setAttribute("style", "word-wrap: break-word; min-width: 160px; max-width: 160px;")
        tdElement.innerText = data[i][key];
        trElement.appendChild(tdElement);
    }
    tbodyElement.appendChild(trElement);
}

tableElement.appendChild(tbodyElement);
