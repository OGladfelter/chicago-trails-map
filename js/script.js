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
            map.fitBounds(e.target.getBounds());
        })
        .addTo(map)
        .bindTooltip(gpx, {sticky: true, className: 'tooltipClass'});
    });

    map.setView([41.895168, -87.752793], 13);
        
  

        // paths[data[i].id] = L.polyline(
        //     coordinates,
        //     {
        //         color: 'rgb(0,224,224)',
        //         weight: 2,
        //         opacity: 1,
        //         lineJoin: 'round',
        //         name: data[i].name,
        //         activity: data[i].type,
        //         id: data[i].id
        //     },
        // )
        // .on('click', function() { 
        //     if (Number(this.options.id) > 1000) { // don't activate on demo or manual file upload (assuming no one manually uploads 1k+ files)
        //         var url = "https://www.strava.com/activities/" + this.options.id;
        //         window.open(url, '_blank').focus();
        //     }
        // })
        // .addTo(map)
        // .bindTooltip(data[i].name + "<br>" + data[i].miles + " miles<br>" + data[i].start_date_local.split("T")[0], {sticky: true, className: 'myCSSClass'});

    // hover over any path to highlight it
    d3.selectAll("path").on("mouseover", function() {
        d3.select(this).style('stroke', 'yellow');
        d3.select(this).style('opacity', 1);
        d3.select(this).raise();
    })
    .on("mouseout", function() {
        d3.select(this).style('stroke', this.getAttribute("lineColor") ? this.getAttribute("lineColor") : document.getElementById("lineColor").value);
        d3.select(this).style('opacity', $('#alphaSlider').slider("option", "value"));
    });

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

drawHeatmap();