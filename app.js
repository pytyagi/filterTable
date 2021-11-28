let cafeData;
let placesData;

// Get Data from endpoints
async function getData(url) {
    let response = await fetch(url);
    let data = await response.json(); // read response body and parse as JSON
    return data;
}

// This will render table when window is loaded for the firtstime
window.onload = async function () {
    let cafeUrl ="https://raw.githubusercontent.com/debojyoti/places-fake-rest-api/master/cafes.json";

    let cafeResp = await getData(cafeUrl);
    cafeData = cafeResp.cafes;
    let placesUrl ="https://raw.githubusercontent.com/debojyoti/places-fake-rest-api/master/places.json";

    let placesResp = await getData(placesUrl);
    placesData = placesResp.places;

    if (cafeData.length > 0 && placesData.length > 0) {
        let cafeAndPlacesDetails = cafeDetails(cafeData, placesData);
        renderTable(cafeAndPlacesDetails);
    }
    
};

// Render table 
function renderTable(tabelData) {
    let table = document.getElementById("info-table");
    tabelData.forEach(function ({ name, locality, postal_code, lat, long },i) {
        // Create an empty <tr> element and add it to the 1st position of the table:
        let row = table.insertRow(i + 1);

        if (i % 2 == 1) {
            row.style.background = "#e9ecef";
        }
        let cell1 = row.insertCell(0);
        cell1.innerHTML = i + 1;
        let cell2 = row.insertCell(1);
        cell2.innerHTML = name;
        let cell3 = row.insertCell(2);
        cell3.innerHTML = locality;
        let cell4 = row.insertCell(3);
        cell4.innerHTML = postal_code;
        let cell5 = row.insertCell(4);
        cell5.innerHTML = lat;
        let cell6 = row.insertCell(5);
        cell6.innerHTML = long;
    });
}

// Filter table rows based on user input
function filterTableRows(input) {
    let filter = input.toUpperCase();
    let table = document.getElementById("info-table");
    let tr = table.getElementsByTagName("tr");
    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td")[1];
            if (td) {
                let textVal = td.textContent || td.innerText;
                if (textVal.toUpperCase().indexOf(filter) == -1) {
                   tr[i].style.display = "none";
                }
                else {
                    tr[i].style.display = "";
                }
            }
    }
}

// Get CafeDetails and create a list
function cafeDetails(cafes, places) {
    let res = [];
    cafes.forEach(function (cafe) {
        let filterVal = places.filter((place) => cafe.location_id == place.id)
        let { id,lat, locality, long, postal_code, street_no } = filterVal[0];
        lat = lat.split(" ")[0];
        long = long.split(" ")[0];
        let obj = {
            name: cafe.name,
            id,
            lat,
            locality,
            long,
            postal_code,
            street_no,
        };
        res.push(obj);
    }) 
    return res;
}

var input = document.getElementById("search");
input.addEventListener("input", function (e) {
    filterTableRows((e.target.value));
});
