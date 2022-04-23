function drawHeatmap() {

    document.getElementById("menuContainer").style.display = 'block';

    // read map styles
    mapTilesTerrain = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 50,
            continuousWorld: false,
            noWrap: true
    });
    mapTilesLight = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 28,
        continuousWorld: false,
        noWrap: true
    });
    mapTilesDark = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        maxZoom: 28,
        continuousWorld: false,
        noWrap: true
    });

    var map = L.map('map', {minZoom:3, maxZoom:25, maxBoundsViscosity:1});
    map.setMaxBounds([[-90,-180], [90,180]]);
    map.addLayer(mapTilesLight);

    // icon allowing users to download screenshots
    L.control.bigImage().addTo(map);

    var gpxFileNames = [
        'Mayor Taylor Trail',
        'Cal Sag Trail ',
        'Des Plaines River Trail'
    ];
    gpxFileNames.forEach(gpx => {
        new L.GPX('data/' + gpx + '.gpx', {
            async: true,
            marker_options: {
                startIconUrl: null,
                endIconUrl: null,
                shadowUrl: null,
                wptIconUrls: {
                    '': null
                },
            },
            polyline_options: {
                color: 'blue',
                opacity: 1,
                weight: 3,
                lineCap: 'round'
            }
        })
        .on('loaded', function(e) {
            // hover over any path to highlight it
            d3.selectAll("path").on("mouseover", function() {
                d3.select(this).style('stroke', 'red');
                d3.select(this).style('opacity', 1);
                d3.select(this).raise();
            })
            .on("mouseout", function() {
                d3.select(this).style('stroke', this.getAttribute("lineColor") ? this.getAttribute("lineColor") : document.getElementById("lineColor").value);
                d3.select(this).style('opacity', $('#alphaSlider').slider("option", "value"));
            });
        })
        .addTo(map)
        .bindTooltip(gpx, {sticky: true, className: 'tooltipClass'});
    });

    map.setView([41.895168, -87.752793], 9);

    // customization menu item - switch tooltip to show miles vs km
    // document.getElementById("metric").addEventListener("click", function() { 
    //     data.forEach(d => {
    //         paths[d.id].setTooltipContent(d.name + "<br>" + d.miles + " miles<br>" + d.start_date_local.split("T")[0]);
    //     });
    // });
    // document.getElementById("imperial").addEventListener("click", function() { 
    //     data.forEach(d => {
    //         paths[d.id].setTooltipContent(d.name + "<br>" + d.km + " km<br>" + d.start_date_local.split("T")[0]);
    //     });
    // });

    // customization menu item - click radio buttons to turn map tiles on/off
    document.getElementById("noMapButton").addEventListener("click", function() { 
        // remove leaflet map tiles
        map.removeLayer(mapTilesDark);
        map.removeLayer(mapTilesLight);
        map.removeLayer(mapTilesTerrain);
        document.getElementById("backgroundColorPicker").style.display = "table-row";
    });
    document.getElementById("lightMapButton").addEventListener("click", function() { 
        // add leaflet map tiles
        map.removeLayer(mapTilesDark);
        map.removeLayer(mapTilesTerrain);
        map.addLayer(mapTilesLight);
        document.getElementById("backgroundColorPicker").style.display = "none";
    });
    document.getElementById("darkMapButton").addEventListener("click", function() { 
        // add leaflet map tiles
        map.removeLayer(mapTilesLight);
        map.removeLayer(mapTilesTerrain);
        map.addLayer(mapTilesDark);
        document.getElementById("backgroundColorPicker").style.display = "none";
    });
    document.getElementById("terrainMapButton").addEventListener("click", function() { 
        // add leaflet map tiles
        map.removeLayer(mapTilesLight);
        map.removeLayer(mapTilesDark);
        map.addLayer(mapTilesTerrain);
        document.getElementById("backgroundColorPicker").style.display = "none";
    });
}

// click divs to show / hide menus
document.getElementById("menuHeaderContainer3").addEventListener("click", function() {
    if (document.getElementById("customizeMenuTable").style.display == "table"){
        document.getElementById("customizeMenuTable").style.display = "none";
        document.getElementById("menuButton3").innerHTML = "+";
    }
    else{
       document.getElementById("customizeMenuTable").style.display = "table";
       document.getElementById("menuButton3").innerHTML = "-";
    }
});


// customization menu item - background color
document.getElementById("backgroundColor").addEventListener("input", function() { 
    document.getElementById("map").style.background = this.value;
    document.getElementsByTagName("body")[0].style.backgroundColor = this.value;
});

// customization menu item - line color
document.getElementById("lineColor").addEventListener("input", function() { 
    var allColor = this.value;
    d3.selectAll("path").style("stroke",allColor); // update frontend color
    var lines = d3.selectAll("path");
    lines._groups[0].forEach(function(d){ // update lineColor attribute for proper highlighting and returning to color
        d.setAttribute("lineColor",allColor);
    });
});

// customization menu - line thickness
$(function() {
    $("#thicknessSlider").slider({
        range: false,
        min: 1,
        max: 4,
        step: 0.5,
        value: 3,
        slide: function(e, ui) {
            d3.selectAll("path").style("stroke-width",ui.value+"px")
        }
    });
});

// customization menu - line opacity
$(function() {
    $("#alphaSlider").slider({
        range: false,
        min: 0.3,
        max: 1,
        step: 0.1,
        value: 1,
        slide: function(e, ui) {
            d3.selectAll("path").style("opacity",ui.value);
        }
    });
});

document.getElementById("printModal").addEventListener("click", function(){
    document.getElementById("printModal").style.display = 'none';
});
// for some fun flair...
document.getElementById("normalResolutionButton").addEventListener("mouseenter", function(){
    document.getElementById("downloadButton1").classList.toggle('rotated');
});
document.getElementById("highResolutionButton").addEventListener("mouseenter", function(){
    document.getElementById("downloadButton2").classList.toggle('rotated');
});

drawHeatmap();