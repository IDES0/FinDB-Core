data = JSON.parse(document.currentScript.getAttribute('data'));

tableName = document.currentScript.getAttribute('idname')
tableElement = document.getElementById(tableName);

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
    if (tableName === "stock-model") {
        if (key === "Sector Key") {
            thElement.innerHTML = "<a href='sector-model.html'>" + key + "</a>"
        }
        if(key === "Top 10 Indexes") {
            thElement.innerHTML = "<a href='index-model.html' style='display:block;'>" + key + "</a>"
        }
    } else if (tableName === "sector-model") {
        if (key === "largest_companies") {
            thElement.innerHTML = "<a href='stock-model.html' style='display:block;'>" + key + "</a>"
        }
        if (key === "etf_opportunities") {
            thElement.innerHTML = "<a href='index-model.html' style='display:block;'>" + key + "</a>"
        }
    } else if(tableName === "index-model") {
        if(key === "Top Ten Holdings") {
            thElement.innerHTML = "<a href='stock-model.html' style='display:block;'>" + key + "</a>"
        }
        if(key === "Top Sectors") {
            thElement.innerHTML = "<a href='sector-model.html' style='display:block;'>" + key + "</a>"
        }
    }
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
        tdElement.setAttribute("style", "word-wrap: break-word; max-width: 160px;")
        tdElement.innerText = data[i][key];
        trElement.appendChild(tdElement);
    }
    tbodyElement.appendChild(trElement);
}

tableElement.appendChild(tbodyElement);
