(function($) {
    // function to remove duplicate
    $.fn.removeDuplicate=function(){var seen={};this.each(function(){var txt=$(this).text();if(seen[txt]){$(this).remove()}else{seen[txt]=true}})};
    // function to sort elements alphabetically
    $.fn.sortAlpha=function(){var $opt=this;var arr=$opt.map(function(_,o){return{t:$(o).text(),v:o.value}}).get();arr.sort(function(o1,o2){return o1.t.toLowerCase()>o2.t.toLowerCase()?1:o1.t.toLowerCase()<o2.t.toLowerCase()?-1:0});$opt.each(function(i,o){o.value=arr[i].v;$(o).text(arr[i].t)})};
    // function to reorder layers when an overlay is selected through the control panel layer
    function onOverlayAdd(e){if(map.hasLayer(myOpenSpaceLayer)){myOpenSpaceLayer.bringToBack()}else{}if(map.hasLayer(myNbhdLayer)){myNbhdLayer.bringToBack()}else{}if(map.hasLayer(myBos_openSpace)){myBos_openSpace.bringToBack()}else{}if(map.hasLayer(myBos_nbhd)){myBos_nbhd.bringToBack()}else{}if(map.hasLayer(bikeTrails)){bikeTrails.bringToFront()}else{}};
    // initialize the map
    var map=L.map("map",{zoomControl:false}).setView([42.31250108313083,-71.05701449023424],12);
    /*!
    *   Tile Layers
    *   ===========
    *   ===========
    */
    //  |   Mass
    //  |   ----
    var mapc=L.tileLayer("http://tiles.mapc.org/basemap/{z}/{x}/{y}.png",{attribution:'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',maxZoom:17,minZoom:11}).addTo(map);
    //  |   Open Street Map
    //  |   ---------------
    var OpenStreetMap_Mapnik=L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});var OpenStreetMap_BlackAndWhite=L.tileLayer("http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",{maxZoom:18,attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});
    //  |   ESRI
    //  |   ----
    var Esri_WorldStreetMap=L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"});var Esri_WorldTopoMap=L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"});var Esri_NatGeoWorldMap=L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",maxZoom:16});
    //  |   Bing
    //  |   ----
    var BING_KEY="Atgl8hUwAtp6pgQ8B3ydX0M0P3VYedjKRR_6mvJ4iYpJo4vNgm--_aXG7g1z6b8S";var bingLayerRoad=new L.BingLayer(BING_KEY,{type:"Road"});var bingLayerAerial=new L.BingLayer(BING_KEY,{type:"Aerial"});var bingLayerAerialWithLabels=new L.BingLayer(BING_KEY,{type:"AerialWithLabels"});
    /*!
    *   Overlays
    *   ========
    *   ========
    *
    *   |   Neighborhoods
    *   |   =============
    *   |   |   deselected
    *   |   |   ----------
    */
    // on each feature
    function $nbhdDeselectedOnEachFeature(feature,layer){if(feature.properties&&feature.properties.Name){$("#Bos_nbhdSelect").append($("<option>",{value:feature.properties.Name,text:feature.properties.Name}))}else{}if(feature.properties){var popupText="";if(feature.properties.Name){popupText+="<span class='nbhdTitle'><strong>"+feature.properties.Name+"</strong></span><br>";popupText+="<a class='selectNbhdLink' href='#'>Select</a>";layer.bindPopup(popupText)}else{}}else{}};
    // style
    function $nbhdDeselectedStyle(feature){return{weight:4,opacity:0.1,color:"Red",fillOpacity:0.1}};
    // add layer to map
    var myBos_nbhd=L.geoJson().addTo(map);var nbhdDeselected=L.geoJson(Bos_nbhd,{onEachFeature:$nbhdDeselectedOnEachFeature,style:$nbhdDeselectedStyle});$("#Bos_nbhdSelect option").sortAlpha();$("#Bos_nbhdSelect").trigger("chosen:updated");nbhdDeselected.addTo(myBos_nbhd);
    /*!
    *   |   |   selected
    *   |   |   --------
    */
    // on each feature
    function $nbhdSelectedOnEachFeature(feature,layer){if(feature.properties){var popupText="";if(feature.properties.Name){popupText+="<span class='nbhdTitle'><strong>"+feature.properties.Name+"</strong></span><br>";popupText+="<a class='deselectNbhdLink' href='#'>Deselect</a>";layer.bindPopup(popupText)}else{}}else{}};
    // style
    function $nbhdSelectedStyle(feature){return{color:"Red",weight:4,opacity:0.5,fillOpacity:0.25,className:feature.properties.Name.replace(/\s+/g,"")+" OBJECTID_"+feature.properties.OBJECTID+" nbhd-active"}};
    // style 2
    function $nbhdSelectedStyle2(feature){return{color:"IndianRed",weight:4,opacity:0.5,fillOpacity:0.25,className:feature.properties.Name.replace(/\s+/g,"")+" OBJECTID_"+feature.properties.OBJECTID+" nbhd-active"}};
    /*!
    *   |   Open Spaces
    *   |   ===========
    *   |   |   deselected
    *   |   |   ----------
    */
    // on each Feature
    function $openSpaceDeselectedOnEachFeature(feature,layer){if(feature.properties){var popupText="";if(feature.properties.SITE_NAME){$("#Bos_openSpaceSelect").append($("<option>",{value:feature.properties.SITE_NAME,text:feature.properties.SITE_NAME}));popupText+="<strong class='openSpacePopupTitle'>"+feature.properties.SITE_NAME+"</strong><br>"}else{}if(feature.properties.FEE_OWNER){popupText+="<strong>Owner:</strong> "+feature.properties.FEE_OWNER+"<br>"}else{}if(feature.properties.OWNER_TYPE){if(feature.properties.OWNER_TYPE==="F"){var ownerTypeText="Federal"}else{if(feature.properties.OWNER_TYPE==="S"){var ownerTypeText="State"}else{if(feature.properties.OWNER_TYPE==="C"){var ownerTypeText="County"}else{if(feature.properties.OWNER_TYPE==="M"){var ownerTypeText="Municipal"}else{if(feature.properties.OWNER_TYPE==="N"){var ownerTypeText="Private Nonprofit"}else{if(feature.properties.OWNER_TYPE==="P"){var ownerTypeText="Private for profit"}else{if(feature.properties.OWNER_TYPE==="B"){var ownerTypeText="Public Nonprofit"}else{if(feature.properties.OWNER_TYPE==="L"){var ownerTypeText="Land Trust"}else{if(feature.properties.OWNER_TYPE==="G"){var ownerTypeText="Conservation Organization"}else{if(feature.properties.OWNER_TYPE==="O"){var ownerTypeText="Undefined (e.g.joint ownership)"}else{if(feature.properties.OWNER_TYPE==="X"){var ownerTypeText="Unknown"}else{if(feature.properties.OWNER_TYPE==="I"){var ownerTypeText="Inholding (a piece of unprotected property surrounded on all sides by a protected property or a recreational facility)"}else{}}}}}}}}}}}}popupText+="<strong>Owner Type:</strong> "+ownerTypeText+"<br>"}else{}if(feature.properties.MANAGER){popupText+="<strong>Manager:</strong> "+feature.properties.MANAGER+"<br>"}else{}if(feature.properties.PUB_ACCESS){if(feature.properties.PUB_ACCESS==="Y"){var pubAccessText="Yes (open to public)"}else{if(feature.properties.PUB_ACCESS==="N"){var pubAccessText="No (not open to public)"}else{if(feature.properties.PUB_ACCESS==="L"){var pubAccessText="Limited (membership only)"}else{if(feature.properties.PUB_ACCESS==="X"){var pubAccessText="Unknown"}else{}}}}popupText+="<strong>Public Access:</strong> "+pubAccessText+"<br>"}else{}if(feature.properties.PRIM_PURP){if(feature.properties.PRIM_PURP==="R"){var pubAccessText="Recreation (activities are facility based)"}else{if(feature.properties.PRIM_PURP==="C"){var pubAccessText="Conservation (activities are non-facility based)"}else{if(feature.properties.PRIM_PURP==="B"){var pubAccessText="Recreation and Conservation"}else{if(feature.properties.PRIM_PURP==="H"){var pubAccessText="Historical/Cultural"}else{if(feature.properties.PRIM_PURP==="A"){var pubAccessText="Agriculture"}else{if(feature.properties.PRIM_PURP==="W"){var pubAccessText="Water Supply Protection"}else{if(feature.properties.PRIM_PURP==="S"){var pubAccessText="Scenic (official designation only)"}else{if(feature.properties.PRIM_PURP==="F"){var pubAccessText="Flood Control"}else{if(feature.properties.PRIM_PURP==="Q"){var pubAccessText="Habitat protection"}else{if(feature.properties.PRIM_PURP==="U"){var pubAccessText="Site is underwater"}else{if(feature.properties.PRIM_PURP==="O"){var pubAccessText="Undefined"}else{if(feature.properties.PRIM_PURP==="X"){var pubAccessText="Unknown"}else{}}}}}}}}}}}}popupText+="<strong>Primary Purpose:</strong> "+pubAccessText+"<br>"}else{}popupText+="<a class='selectOpenSpaceLink' href='#'>Select</a>";layer.bindPopup(popupText)}else{}};
    // style
    function $openSpaceDeselectedStyle(feature){if(feature.properties&&feature.properties.SITE_NAME&&feature.properties.NBHD){return{weight:1,opacity:0.1,color:"Green",fillOpacity:0.1,className:feature.properties.SITE_NAME.replace(/[^a-z0-9\s]/gi,"").replace(/\s+/g,"").replace(/\d+/g,"")+" "+feature.properties.NBHD}}else{}};
    // add open spaces layer to map
    var myBos_openSpace=L.geoJson().addTo(map);var openSpaceDeselected=L.geoJson(Bos_openSpace,{filter:function(feature,layer){if(feature.properties&&feature.properties.SITE_NAME){return true}else{return false}},onEachFeature:$openSpaceDeselectedOnEachFeature,style:$openSpaceDeselectedStyle});$("#Bos_openSpaceSelect option").removeDuplicate();$("#Bos_openSpaceSelect option").sortAlpha();$("#Bos_openSpaceSelect").trigger("chosen:updated");openSpaceDeselected.addTo(myBos_openSpace);
    /*!
    *   |   |   selected
    *   |   |   --------
    */
    // on each feature
    function $openSpaceSelectedOnEachFeature(feature,layer){if(feature.properties){var popupText="";if(feature.properties.SITE_NAME){popupText+="<strong class='openSpacePopupTitle'>"+feature.properties.SITE_NAME+"</strong><br>"}else{}if(feature.properties.FEE_OWNER){popupText+="<strong>Owner:</strong> "+feature.properties.FEE_OWNER+"<br>"}else{}if(feature.properties.OWNER_TYPE){if(feature.properties.OWNER_TYPE==="F"){var ownerTypeText="Federal"}else{if(feature.properties.OWNER_TYPE==="S"){var ownerTypeText="State"}else{if(feature.properties.OWNER_TYPE==="C"){var ownerTypeText="County"}else{if(feature.properties.OWNER_TYPE==="M"){var ownerTypeText="Municipal"}else{if(feature.properties.OWNER_TYPE==="N"){var ownerTypeText="Private Nonprofit"}else{if(feature.properties.OWNER_TYPE==="P"){var ownerTypeText="Private for profit"}else{if(feature.properties.OWNER_TYPE==="B"){var ownerTypeText="Public Nonprofit"}else{if(feature.properties.OWNER_TYPE==="L"){var ownerTypeText="Land Trust"}else{if(feature.properties.OWNER_TYPE==="G"){var ownerTypeText="Conservation Organization"}else{if(feature.properties.OWNER_TYPE==="O"){var ownerTypeText="Undefined (e.g.joint ownership)"}else{if(feature.properties.OWNER_TYPE==="X"){var ownerTypeText="Unknown"}else{if(feature.properties.OWNER_TYPE==="I"){var ownerTypeText="Inholding (a piece of unprotected property surrounded on all sides by a protected property or a recreational facility)"}else{}}}}}}}}}}}}popupText+="<strong>Owner Type:</strong> "+ownerTypeText+"<br>"}else{}if(feature.properties.MANAGER){popupText+="<strong>Manager:</strong> "+feature.properties.MANAGER+"<br>"}else{}if(feature.properties.PUB_ACCESS){if(feature.properties.PUB_ACCESS==="Y"){var pubAccessText="Yes (open to public)"}else{if(feature.properties.PUB_ACCESS==="N"){var pubAccessText="No (not open to public)"}else{if(feature.properties.PUB_ACCESS==="L"){var pubAccessText="Limited (membership only)"}else{if(feature.properties.PUB_ACCESS==="X"){var pubAccessText="Unknown"}else{}}}}popupText+="<strong>Public Access:</strong> "+pubAccessText+"<br>"}else{}if(feature.properties.PRIM_PURP){if(feature.properties.PRIM_PURP==="R"){var pubAccessText="Recreation (activities are facility based)"}else{if(feature.properties.PRIM_PURP==="C"){var pubAccessText="Conservation (activities are non-facility based)"}else{if(feature.properties.PRIM_PURP==="B"){var pubAccessText="Recreation and Conservation"}else{if(feature.properties.PRIM_PURP==="H"){var pubAccessText="Historical/Cultural"}else{if(feature.properties.PRIM_PURP==="A"){var pubAccessText="Agriculture"}else{if(feature.properties.PRIM_PURP==="W"){var pubAccessText="Water Supply Protection"}else{if(feature.properties.PRIM_PURP==="S"){var pubAccessText="Scenic (official designation only)"}else{if(feature.properties.PRIM_PURP==="F"){var pubAccessText="Flood Control"}else{if(feature.properties.PRIM_PURP==="Q"){var pubAccessText="Habitat protection"}else{if(feature.properties.PRIM_PURP==="U"){var pubAccessText="Site is underwater"}else{if(feature.properties.PRIM_PURP==="O"){var pubAccessText="Undefined"}else{if(feature.properties.PRIM_PURP==="X"){var pubAccessText="Unknown"}else{}}}}}}}}}}}}popupText+="<strong>Primary Purpose:</strong> "+pubAccessText+"<br>"}else{}popupText+="<a class='selectOpenSpaceLink' href='#'>Select</a>";layer.bindPopup(popupText)}else{}};
    // style
    function $openSpaceSelectedStyle(feature){if(feature.properties&&feature.properties.SITE_NAME){return{weight:1,color:"Green",fillColor:"Green",opacity:0.5,fillOpacity:0.25,className:feature.properties.SITE_NAME.replace(/[^a-z0-9\s]/gi,"").replace(/\s+/g,"").replace(/\d+/g,"")}}else{}};
    // style 2
    function $openSpaceSelectedStyle2(feature){if(feature.properties&&feature.properties.SITE_NAME){return{weight:0,color:"SeaGreen",fillColor:"SeaGreen",opacity:0.5,fillOpacity:0.25,className:feature.properties.SITE_NAME.replace(/[^a-z0-9\s]/gi,"").replace(/\s+/g,"").replace(/\d+/g,"")}}else{}};
    /*!
    *   |   Individual Open space
    *   |   =====================
    *   |   |   selected
    *   |   |   --------
    */
    // point inside polygon function
        // ray-casting algorithm based on
        // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    function inside(point,vs){var x=point[0],y=point[1];var inside=false;for(var i=0,j=vs.length-1;i<vs.length;j=i++){var xi=vs[i][0],yi=vs[i][1];var xj=vs[j][0],yj=vs[j][1];var intersect=((yi>y)!=(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi);if(intersect){inside=!inside}}return inside};
    //
    var intersectResults = [];
    // on each feature
    function $indivOpenSpaceOnEachFeature(feature,layer){var nbhdArray=[];var polygon=[];var markersArray=[];var recreationalActivitiesUrl="http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson";if(feature.properties){var popupText="";if(feature.properties.SITE_NAME){popupText+="<strong class='openSpacePopupTitle'>"+feature.properties.SITE_NAME+"</strong><br>"}else{}if(feature.properties.FEE_OWNER){popupText+="<strong>Owner:</strong> "+feature.properties.FEE_OWNER+"<br>"}else{}if(feature.properties.OWNER_TYPE){if(feature.properties.OWNER_TYPE==="F"){var ownerTypeText="Federal"}else{if(feature.properties.OWNER_TYPE==="S"){var ownerTypeText="State"}else{if(feature.properties.OWNER_TYPE==="C"){var ownerTypeText="County"}else{if(feature.properties.OWNER_TYPE==="M"){var ownerTypeText="Municipal"}else{if(feature.properties.OWNER_TYPE==="N"){var ownerTypeText="Private Nonprofit"}else{if(feature.properties.OWNER_TYPE==="P"){var ownerTypeText="Private for profit"}else{if(feature.properties.OWNER_TYPE==="B"){var ownerTypeText="Public Nonprofit"}else{if(feature.properties.OWNER_TYPE==="L"){var ownerTypeText="Land Trust"}else{if(feature.properties.OWNER_TYPE==="G"){var ownerTypeText="Conservation Organization"}else{if(feature.properties.OWNER_TYPE==="O"){var ownerTypeText="Undefined (e.g.joint ownership)"}else{if(feature.properties.OWNER_TYPE==="X"){var ownerTypeText="Unknown"}else{if(feature.properties.OWNER_TYPE==="I"){var ownerTypeText="Inholding (a piece of unprotected property surrounded on all sides by a protected property or a recreational facility)"}else{}}}}}}}}}}}}popupText+="<strong>Owner Type:</strong> "+ownerTypeText+"<br>"}else{}if(feature.properties.MANAGER){popupText+="<strong>Manager:</strong> "+feature.properties.MANAGER+"<br>"}else{}if(feature.properties.PUB_ACCESS){if(feature.properties.PUB_ACCESS==="Y"){var pubAccessText="Yes (open to public)"}else{if(feature.properties.PUB_ACCESS==="N"){var pubAccessText="No (not open to public)"}else{if(feature.properties.PUB_ACCESS==="L"){var pubAccessText="Limited (membership only)"}else{if(feature.properties.PUB_ACCESS==="X"){var pubAccessText="Unknown"}else{}}}}popupText+="<strong>Public Access:</strong> "+pubAccessText+"<br>"}else{}if(feature.properties.PRIM_PURP){if(feature.properties.PRIM_PURP==="R"){var pubAccessText="Recreation (activities are facility based)"}else{if(feature.properties.PRIM_PURP==="C"){var pubAccessText="Conservation (activities are non-facility based)"}else{if(feature.properties.PRIM_PURP==="B"){var pubAccessText="Recreation and Conservation"}else{if(feature.properties.PRIM_PURP==="H"){var pubAccessText="Historical/Cultural"}else{if(feature.properties.PRIM_PURP==="A"){var pubAccessText="Agriculture"}else{if(feature.properties.PRIM_PURP==="W"){var pubAccessText="Water Supply Protection"}else{if(feature.properties.PRIM_PURP==="S"){var pubAccessText="Scenic (official designation only)"}else{if(feature.properties.PRIM_PURP==="F"){var pubAccessText="Flood Control"}else{if(feature.properties.PRIM_PURP==="Q"){var pubAccessText="Habitat protection"}else{if(feature.properties.PRIM_PURP==="U"){var pubAccessText="Site is underwater"}else{if(feature.properties.PRIM_PURP==="O"){var pubAccessText="Undefined"}else{if(feature.properties.PRIM_PURP==="X"){var pubAccessText="Unknown"}else{}}}}}}}}}}}}popupText+="<strong>Primary Purpose:</strong> "+pubAccessText+"<br>"}else{}popupText+="<a class='deselectOpenSpaceLink' href='#'>Deselect</a>";layer.bindPopup(popupText)}else{}if(feature.properties&&feature.properties.SITE_NAME){if((feature.geometry.type==="MultiPolygon")||(feature.geometry.type==="Polygon")){for(var i=0;i<feature.geometry.coordinates.length;i++){var polygonStringArray=feature.geometry.coordinates[i][0];polygon.push(polygonStringArray);console.log(JSON.stringify(polygon[0]))}}else{}if(feature.properties.NBHD){nbhdString=feature.properties.NBHD.replace(/\s+/g,"");nbhdArray.push(nbhdString);console.log(nbhdArray);var recreationalActivities=L.geoJson.ajax(recreationalActivitiesUrl,{onEachFeature:function(feature,layer){if(feature.geometry.type==="Point"){markersArray.push(feature.geometry.coordinates);console.log([inside(feature.geometry.coordinates,polygon[0])]);if(inside(feature.geometry.coordinates,polygon[0])){intersectResults.push(feature);console.log(JSON.stringify(intersectResults));L.geoJson(feature,{pointToLayer:$activitiesPointToLayer,onEachFeature:$activitiesOnEachFeature}).addTo(myActivitiesMarkerClusterGroup)}else{}}else{}}});recreationalActivities.on("data:loaded",function(){map.addLayer(myActivitiesMarkerClusterGroup);myActivitiesMarkerClusterGroup.refreshClusters(recreationalActivities)})}else{}}else{}};
    // on each feature with filtered activities
    function $indivOpenSpaceOnEachFeatureActivitiesFiltered(feature,layer){var nbhdArray=[];var polygon=[];var markersArray=[];var selectedActivitiesText=$("#activitiesForm").find(".chosen-single").children("span").text();var recreationalActivitiesUrl="http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson";if(feature.properties){var popupText="";if(feature.properties.SITE_NAME){popupText+="<strong class='openSpacePopupTitle'>"+feature.properties.SITE_NAME+"</strong><br>"}else{}if(feature.properties.FEE_OWNER){popupText+="<strong>Owner:</strong> "+feature.properties.FEE_OWNER+"<br>"}else{}if(feature.properties.OWNER_TYPE){if(feature.properties.OWNER_TYPE==="F"){var ownerTypeText="Federal"}else{if(feature.properties.OWNER_TYPE==="S"){var ownerTypeText="State"}else{if(feature.properties.OWNER_TYPE==="C"){var ownerTypeText="County"}else{if(feature.properties.OWNER_TYPE==="M"){var ownerTypeText="Municipal"}else{if(feature.properties.OWNER_TYPE==="N"){var ownerTypeText="Private Nonprofit"}else{if(feature.properties.OWNER_TYPE==="P"){var ownerTypeText="Private for profit"}else{if(feature.properties.OWNER_TYPE==="B"){var ownerTypeText="Public Nonprofit"}else{if(feature.properties.OWNER_TYPE==="L"){var ownerTypeText="Land Trust"}else{if(feature.properties.OWNER_TYPE==="G"){var ownerTypeText="Conservation Organization"}else{if(feature.properties.OWNER_TYPE==="O"){var ownerTypeText="Undefined (e.g.joint ownership)"}else{if(feature.properties.OWNER_TYPE==="X"){var ownerTypeText="Unknown"}else{if(feature.properties.OWNER_TYPE==="I"){var ownerTypeText="Inholding (a piece of unprotected property surrounded on all sides by a protected property or a recreational facility)"}else{}}}}}}}}}}}}popupText+="<strong>Owner Type:</strong> "+ownerTypeText+"<br>"}else{}if(feature.properties.MANAGER){popupText+="<strong>Manager:</strong> "+feature.properties.MANAGER+"<br>"}else{}if(feature.properties.PUB_ACCESS){if(feature.properties.PUB_ACCESS==="Y"){var pubAccessText="Yes (open to public)"}else{if(feature.properties.PUB_ACCESS==="N"){var pubAccessText="No (not open to public)"}else{if(feature.properties.PUB_ACCESS==="L"){var pubAccessText="Limited (membership only)"}else{if(feature.properties.PUB_ACCESS==="X"){var pubAccessText="Unknown"}else{}}}}popupText+="<strong>Public Access:</strong> "+pubAccessText+"<br>"}else{}if(feature.properties.PRIM_PURP){if(feature.properties.PRIM_PURP==="R"){var pubAccessText="Recreation (activities are facility based)"}else{if(feature.properties.PRIM_PURP==="C"){var pubAccessText="Conservation (activities are non-facility based)"}else{if(feature.properties.PRIM_PURP==="B"){var pubAccessText="Recreation and Conservation"}else{if(feature.properties.PRIM_PURP==="H"){var pubAccessText="Historical/Cultural"}else{if(feature.properties.PRIM_PURP==="A"){var pubAccessText="Agriculture"}else{if(feature.properties.PRIM_PURP==="W"){var pubAccessText="Water Supply Protection"}else{if(feature.properties.PRIM_PURP==="S"){var pubAccessText="Scenic (official designation only)"}else{if(feature.properties.PRIM_PURP==="F"){var pubAccessText="Flood Control"}else{if(feature.properties.PRIM_PURP==="Q"){var pubAccessText="Habitat protection"}else{if(feature.properties.PRIM_PURP==="U"){var pubAccessText="Site is underwater"}else{if(feature.properties.PRIM_PURP==="O"){var pubAccessText="Undefined"}else{if(feature.properties.PRIM_PURP==="X"){var pubAccessText="Unknown"}else{}}}}}}}}}}}}popupText+="<strong>Primary Purpose:</strong> "+pubAccessText+"<br>"}else{}popupText+="<a class='deselectOpenSpaceLink' href='#'>Deselect</a>";layer.bindPopup(popupText)}else{}if(feature.properties&&feature.properties.SITE_NAME){if((feature.geometry.type==="MultiPolygon")||(feature.geometry.type==="Polygon")){for(var i=0;i<feature.geometry.coordinates.length;i++){var polygonStringArray=feature.geometry.coordinates[i][0];polygon.push(polygonStringArray);console.log(JSON.stringify(polygon[0]))}}else{}if(feature.properties.NBHD){nbhdString=feature.properties.NBHD.replace(/\s+/g,"");nbhdArray.push(nbhdString);console.log(nbhdArray);var selectedActivityMarkers=L.geoJson.ajax(recreationalActivitiesUrl,{onEachFeature:function(feature,layer){if(feature.geometry.type==="Point"){markersArray.push(feature.geometry.coordinates);console.log([inside(feature.geometry.coordinates,polygon[0])]);if(inside(feature.geometry.coordinates,polygon[0])){intersectResults.push(feature);console.log(JSON.stringify(intersectResults));L.geoJson(feature,{filter:function(feature,layer){if(feature.properties.Category===selectedActivitiesText){return true}if(feature.properties.Category_2===selectedActivitiesText){return true}if(feature.properties.Category_3===selectedActivitiesText){return true}else{return false}},pointToLayer:$activitiesPointToLayer,onEachFeature:$activitiesOnEachFeature}).addTo(myActivitiesMarkerClusterGroup)}else{}}else{}}});selectedActivityMarkers.on("data:loaded",function(){map.addLayer(myActivitiesMarkerClusterGroup);myActivitiesMarkerClusterGroup.refreshClusters(selectedActivityMarkers)})}else{}}else{}};
    // style
    function $indivOpenSpaceStyle(feature){if(feature.properties&&feature.properties.SITE_NAME){return{weight:1,color:"Olive",fillColor:"Olive",opacity:0.5,fillOpacity:0.5,className:feature.properties.SITE_NAME.replace(/[^a-z0-9\s]/gi,"").replace(/\s+/g,"").replace(/\d+/g,"")+" indiv-openSpace-active"}}else{}};
    /*!
    *		|		Bike Trails
    *		|		===========
    */
    // on each feature
    function $bikeTrailsOnEachFeature(feature,layer){if(feature.properties){var popupText="";if(feature.properties.TRAILNAME){popupText+='<strong class="bikeTrailsPopupTitle">'+feature.properties.TRAILNAME+"</strong><br>"}else{}if(feature.properties.TRAIL_STAT){if(feature.properties.TRAIL_STAT==="I"){popupText+="<strong>Trail Status:</strong> Existing<br>"}else{if(feature.properties.TRAIL_STAT==="E"){popupText+="<strong>Trail Status:</strong> Existing Unimproved<br>"}else{if(feature.properties.TRAIL_STAT==="R"){popupText+="<strong>Trail Status:</strong> On-Road Connection<br>"}else{if(feature.properties.TRAIL_STAT==="U"){popupText+="<strong>Trail Status:</strong> Underway<br>"}else{if(feature.properties.TRAIL_STAT==="C"){popupText+="<strong>Trail Status:</strong> Considered<br>"}else{if(feature.properties.TRAIL_STAT==="A"){popupText+="<strong>Trail Status:</strong> Potential<br>"}else{}}}}}}}else{}if(feature.properties.OWNER){var ownerName="<strong>Owner:</strong> "+feature.properties.OWNER;if(feature.properties.STATUS_OWN==="S"){popupText+=ownerName+" (State)<br>"}else{if(feature.properties.STATUS_OWN==="M"){popupText+=ownerName+" (Municipal)<br>"}else{if(feature.properties.STATUS_OWN==="F"){popupText+=ownerName+" (Federal)<br>"}else{if(feature.properties.STATUS_OWN==="P"){popupText+=ownerName+" (Private)<br>"}else{if(feature.properties.STATUS_OWN==="O"){popupText+=ownerName+" (Out-of-state)<br>"}else{popupText+=ownerName+"<br>"}}}}}}else{}if(feature.properties.MANAGER){var managerName="<strong>Manager:</strong> "+feature.properties.MANAGER;if(feature.properties.STATUS_MAN==="S"){popupText+=managerName+" (State)<br>"}else{if(feature.properties.STATUS_MAN==="M"){popupText+=managerName+" (Municipal)<br>"}else{if(feature.properties.STATUS_MAN==="F"){popupText+=managerName+" (Federal)<br>"}else{if(feature.properties.STATUS_MAN==="P"){popupText+=managerName+" (Private)<br>"}else{if(feature.properties.STATUS_MAN==="V"){popupText+=managerName+" (Volunteer/Non-Profit)<br>"}else{if(feature.properties.STATUS_MAN==="O"){popupText+=managerName+" (Out-of-state)<br>"}else{popupText+=managerName+"<br>"}}}}}}}else{}}else{}layer.bindPopup(popupText)};
    // style
    function $bikeTrailsStyle(feature) {
        if (feature.properties && feature.properties.TRAILNAME) {
            return {
                color: "DarkBlue",
                weight: 5,
                dashArray: "5, 5",
                lineCap: "butt",
                lineJoin: "round"
            }
        } else {}
    };
    // add layer
    var bikeTrailsUrl="http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/bikeTrails.geojson";var bikeTrails=new L.GeoJSON.AJAX(bikeTrailsUrl,{onEachFeature:$bikeTrailsOnEachFeature,style:$bikeTrailsStyle});
    /*!
    *		|		Recreational Activities
    *		|		=======================
    */
    // on each feature
    function $activitiesOnEachFeature(feature,layer){if(feature.properties){var popupText="";if(feature.properties.Name){popupText+="<strong class='openSpacePopupTitle'>"+feature.properties.Name+"</strong><br>"}else{}if(feature.properties.Type){popupText+="<strong class='openSpacePopupSubTitle'>"+feature.properties.Type+"</strong><br>"}else{}if(feature.properties.Address){popupText+='<i class="fa fa-map-marker"></i> '+feature.properties.Address+"<br>"}else{}if(feature.properties.Website){popupText+='<i class="fa fa-globe"></i> <a href='+feature.properties.Website+" target='_blank'>Website</a><br>"}else{}if(feature.properties.Link1){popupText+='<i class="fa fa-wikipedia-w"></i> <a href='+feature.properties.Link1+" target='_blank'>View on Wikipedia</a><br>"}else{}if(feature.properties.Link3){popupText+='<i class="fa fa-google"></i> <a href='+feature.properties.Link3+" target='_blank'>View in Google Street View</a><br>"}else{}if(feature.properties.Descr){popupText+="<em>"+feature.properties.Descr+"</em><br>"}else{}if(feature.properties.Activity){popupText+="<strong>Activities:</strong> "+feature.properties.Activity+"<br>"}else{}layer.bindPopup(popupText)}else{}if(feature.properties&&feature.properties.Category){$("#activitiesSelect").append($("<option>",{value:feature.properties.Category,text:feature.properties.Category}));$("#activitiesSelect option").removeDuplicate();$("#activitiesSelect option").sortAlpha();$("#activitiesSelect").trigger("chosen:updated")}else{}if(feature.properties&&feature.properties.Category_2){$("#activitiesSelect").append($("<option>",{value:feature.properties.Category_2,text:feature.properties.Category_2}));$("#activitiesSelect option").removeDuplicate();$("#activitiesSelect option").sortAlpha();$("#activitiesSelect").trigger("chosen:updated")}else{}if(feature.properties&&feature.properties.Category_3){$("#activitiesSelect").append($("<option>",{value:feature.properties.Category_3,text:feature.properties.Category_3}));$("#activitiesSelect option").removeDuplicate();$("#activitiesSelect option").sortAlpha();$("#activitiesSelect").trigger("chosen:updated")}else{}}function $activitiesOnEachFeaturePopup(feature,layer){if(feature.properties){var popupText="";if(feature.properties.Name){popupText+="<strong class='openSpacePopupTitle'>"+feature.properties.Name+"</strong><br>"}else{}if(feature.properties.Type){popupText+="<strong class='openSpacePopupSubTitle'>"+feature.properties.Type+"</strong><br>"}else{}if(feature.properties.Address){popupText+='<i class="fa fa-map-marker"></i> '+feature.properties.Address+"<br>"}else{}if(feature.properties.Website){popupText+='<i class="fa fa-globe"></i> <a href='+feature.properties.Website+" target='_blank'>Website</a><br>"}else{}if(feature.properties.Link1){popupText+='<i class="fa fa-wikipedia-w"></i> <a href='+feature.properties.Link1+" target='_blank'>View on Wikipedia</a><br>"}else{}if(feature.properties.Link3){popupText+='<i class="fa fa-google"></i> <a href='+feature.properties.Link3+" target='_blank'>View in Google Street View</a><br>"}else{}if(feature.properties.Descr){popupText+="<em>"+feature.properties.Descr+"</em><br>"}else{}if(feature.properties.Activity){popupText+="<strong>Activities:</strong> "+feature.properties.Activity+"<br>"}else{}layer.bindPopup(popupText)}else{}};
    // point to layer
    function $activitiesPointToLayer(feature,latlng){
        var parkIcon=L.ExtraMarkers.icon({icon:"flaticon-park13",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var cafeIcon=L.ExtraMarkers.icon({icon:"flaticon-hot-drink65",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var sailingIcon=L.ExtraMarkers.icon({icon:"flaticon-sailing-boat4",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var concertIcon=L.ExtraMarkers.icon({icon:"flaticon-musical200",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var playgroundIcon=L.ExtraMarkers.icon({icon:"flaticon-teeter",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var tourIcon=L.ExtraMarkers.icon({icon:"flaticon-touristic",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var baseballIcon=L.ExtraMarkers.icon({icon:"flaticon-baseball-ball",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var tennisIcon=L.ExtraMarkers.icon({icon:"flaticon-tennis2",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var pondIcon=L.ExtraMarkers.icon({icon:"flaticon-water110",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var govBuildingIcon=L.ExtraMarkers.icon({icon:"flaticon-government1",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var infoIcon=L.ExtraMarkers.icon({icon:"flaticon-help27",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var cemeteryIcon=L.ExtraMarkers.icon({icon:"flaticon-halloween286",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var parkDescriptionIcon=L.ExtraMarkers.icon({icon:"",markerColor:"green-light",iconColor:"white",shape:"star",prefix:""});var bicycleParkedIcon=L.ExtraMarkers.icon({icon:"flaticon-parking3",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var skatingIcon=L.ExtraMarkers.icon({icon:"flaticon-ice79",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var swimmingIcon=L.ExtraMarkers.icon({icon:"flaticon-silhouette66",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var athleticFieldIcon=L.ExtraMarkers.icon({icon:"flaticon-field1",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var bocceIcon=L.ExtraMarkers.icon({icon:"flaticon-pilates47",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var churchIcon=L.ExtraMarkers.icon({icon:"flaticon-christian52",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var museumIcon=L.ExtraMarkers.icon({icon:"flaticon-museum21",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var memorialIcon=L.ExtraMarkers.icon({icon:"flaticon-burning",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var carouselIcon=L.ExtraMarkers.icon({icon:"flaticon-horse1",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var benchIcon=L.ExtraMarkers.icon({icon:"flaticon-seat6",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var fountainIcon=L.ExtraMarkers.icon({icon:"flaticon-fountain3",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var historicalLandmarkIcon=L.ExtraMarkers.icon({icon:"flaticon-monument50",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var groupIcon=L.ExtraMarkers.icon({icon:"flaticon-group44",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var damIcon=L.ExtraMarkers.icon({icon:"flaticon-sea16",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var walkingIcon=L.ExtraMarkers.icon({icon:"flaticon-man-silhouette1",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var bridgeIcon=L.ExtraMarkers.icon({icon:"flaticon-bridge7",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var libraryIcon=L.ExtraMarkers.icon({icon:"flaticon-book313",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var canoeKayakIcon=L.ExtraMarkers.icon({icon:"flaticon-transport555",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var theaterIcon=L.ExtraMarkers.icon({icon:"flaticon-theater3",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var gardeningIcon=L.ExtraMarkers.icon({icon:"flaticon-gardening",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var basketballIcon=L.ExtraMarkers.icon({icon:"flaticon-basket32",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var rowingIcon=L.ExtraMarkers.icon({icon:"flaticon-oak",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var dogParkIcon=L.ExtraMarkers.icon({icon:"flaticon-walking12",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var golfIcon=L.ExtraMarkers.icon({icon:"flaticon-golf17",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var yachtIcon=L.ExtraMarkers.icon({icon:"flaticon-transport553",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var exercisingIcon=L.ExtraMarkers.icon({icon:"flaticon-exercise2",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});var bikingIcon=L.ExtraMarkers.icon({icon:".flaticon-cycling4",markerColor:"green",iconColor:"white",shape:"square",prefix:"flaticon"});
        if(feature.properties.Icon==="Park"){return L.marker(latlng,{icon:parkIcon})}else{if(feature.properties.Icon==="Cafe"){return L.marker(latlng,{icon:cafeIcon})}else{if(feature.properties.Icon==="Sailing"){return L.marker(latlng,{icon:sailingIcon})}else{if(feature.properties.Icon==="Concert"){return L.marker(latlng,{icon:concertIcon})}else{if(feature.properties.Icon==="Playground"){return L.marker(latlng,{icon:playgroundIcon})}else{if(feature.properties.Icon==="Tour"){return L.marker(latlng,{icon:tourIcon})}else{if(feature.properties.Icon==="Baseball"){return L.marker(latlng,{icon:baseballIcon})}else{if(feature.properties.Icon==="Tennis"){return L.marker(latlng,{icon:tennisIcon})}else{if(feature.properties.Icon==="Pond"){return L.marker(latlng,{icon:pondIcon})}else{if(feature.properties.Icon==="Gov Building"){return L.marker(latlng,{icon:govBuildingIcon})}else{if(feature.properties.Icon==="Info"){return L.marker(latlng,{icon:infoIcon})}else{if(feature.properties.Icon==="Cemetery"){return L.marker(latlng,{icon:cemeteryIcon})}else{if(feature.properties.Icon==="Park Description"){return L.marker(latlng,{icon:parkDescriptionIcon})}else{if(feature.properties.Icon==="Bicycle Parked"){return L.marker(latlng,{icon:bicycleParkedIcon})}else{if(feature.properties.Icon==="Skating"){return L.marker(latlng,{icon:skatingIcon})}else{if(feature.properties.Icon==="Swimming"){return L.marker(latlng,{icon:swimmingIcon})}else{if(feature.properties.Icon==="Athletic Field"){return L.marker(latlng,{icon:athleticFieldIcon})}else{if(feature.properties.Icon==="Bocce"){return L.marker(latlng,{icon:bocceIcon})}else{if(feature.properties.Icon==="Church"){return L.marker(latlng,{icon:churchIcon})}else{if(feature.properties.Icon==="Museum"){return L.marker(latlng,{icon:museumIcon})}else{if(feature.properties.Icon==="Memorial"){return L.marker(latlng,{icon:memorialIcon})}else{if(feature.properties.Icon==="Carousel"){return L.marker(latlng,{icon:carouselIcon})}else{if(feature.properties.Icon==="Bench"){return L.marker(latlng,{icon:benchIcon})}else{if(feature.properties.Icon==="Fountain"){return L.marker(latlng,{icon:fountainIcon})}else{if(feature.properties.Icon==="Historical Landmark"){return L.marker(latlng,{icon:historicalLandmarkIcon})}else{if(feature.properties.Icon==="Group"){return L.marker(latlng,{icon:groupIcon})}else{if(feature.properties.Icon==="Dam"){return L.marker(latlng,{icon:damIcon})}else{if(feature.properties.Icon==="Walking"){return L.marker(latlng,{icon:walkingIcon})}else{if(feature.properties.Icon==="Bridge"){return L.marker(latlng,{icon:bridgeIcon})}else{if(feature.properties.Icon==="Library"){return L.marker(latlng,{icon:libraryIcon})}else{if(feature.properties.Icon==="Canoe Kayak"){return L.marker(latlng,{icon:canoeKayakIcon})}else{if(feature.properties.Icon==="Theater"){return L.marker(latlng,{icon:theaterIcon})}else{if(feature.properties.Icon==="Gardening"){return L.marker(latlng,{icon:gardeningIcon})}else{if(feature.properties.Icon==="Basketball"){return L.marker(latlng,{icon:basketballIcon})}else{if(feature.properties.Icon==="Rowing"){return L.marker(latlng,{icon:rowingIcon})}else{if(feature.properties.Icon==="Dog Park"){return L.marker(latlng,{icon:dogParkIcon})}else{if(feature.properties.Icon==="Golf"){return L.marker(latlng,{icon:golfIcon})}else{if(feature.properties.Icon==="Yacht"){return L.marker(latlng,{icon:yachtIcon})}else{if(feature.properties.Icon==="Exercising"){return L.marker(latlng,{icon:exercisingIcon})}else{if(feature.properties.Icon==="Biking"){return L.marker(latlng,{icon:bikingIcon})}else{return L.marker(latlng)}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}if(feature.properties.Icon==="Walking"){return L.marker(latlng,{icon:walkingIcon})}else{if(feature.properties.Icon==="Bridge"){return L.marker(latlng,{icon:bridgeIcon})}}
    };
    /*!
    *		|   Farmers Markets
    *		|		===============
    */
    // on each feature
    function $farmersMarketsOnEachFeature(feature,layer){if(feature.properties){var popupText="";if(feature.properties.NAME){popupText+="<strong class='farmersMarketsPopupTitle'>"+feature.properties.NAME+"</strong><br>"}else{}if(feature.properties.TYPE){popupText+="<strong>Type:</strong> "+feature.properties.TYPE+"</strong><br>"}else{}if(feature.properties.ADDR_1){popupText+="<strong>Address:</strong> "+feature.properties.ADDR_1+"<br>"}else{}if(feature.properties.ADDR_2){popupText+=feature.properties.ADDR_2+"<br>"}else{}if(feature.properties.TOWN){popupText+="<strong>Town:</strong> "+feature.properties.TOWN+"<br>"}else{}if(feature.properties.ZIP_CODE){popupText+="<strong>Zip Code:</strong> "+feature.properties.ZIP_CODE+"<br>"}else{}if(feature.properties.DAY_TIME){popupText+="<strong>Days and hours of operation:</strong> "+feature.properties.DAY_TIME+"<br>"}else{}if(feature.properties.DATES){popupText+="<strong>Date range(s) within which the market expects to be open:</strong> "+feature.properties.DATES+"<br>"}else{}if(feature.properties.WEBSITE){popupText+='<i class="fa fa-globe"></i> <a href='+feature.properties.WEBSITE+" target='_blank'>Website</a><br>"}else{}layer.bindPopup(popupText)}else{}};
    // point to layer
    function $farmersMarketsPointToLayer(feature, latlng) {
        var farmersMarketsIcon = L.ExtraMarkers.icon({
            icon: "fa-shopping-basket",
            markerColor: "violet",
            iconColor: "white",
            shape: "circle",
            prefix: "fa"
        });
        if (feature.properties) {
            return L.marker(latlng, {
                icon: farmersMarketsIcon
            })
        }
    };
    // add layer
    var farmersMarketsUrl = "http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/farmersMarkets.geojson";
    var farmersMarkets = new L.GeoJSON.AJAX(farmersMarketsUrl, {
        onEachFeature: $farmersMarketsOnEachFeature,
        pointToLayer: $farmersMarketsPointToLayer
    });
    /*!
    *		|   Public Art
    *		|		===========
    */
    // on each feature
    function $publicArtOnEachFeature(feature, layer) {
        if (feature.properties) {
            var popupText = "";
            if (feature.properties.NAME) {
                popupText += "<strong class='publicArtPopupTitle'>" + feature.properties.NAME + "</strong><br>"
            } else {}
            if (feature.properties.WEBSITE) {
                popupText += '<i class="fa fa-globe"></i> <a href=' + feature.properties.WEBSITE + " target='_blank'>Website</a><br>"
            } else {}
            if (feature.properties.LINK1) {
                popupText += '<i class="fa fa-wikipedia-w"></i> <a href=' + feature.properties.LINK1 + " target='_blank'>View on Wikipedia</a><br>"
            } else {}
            if (feature.properties.LINK2) {
                popupText += '<i class="fa fa-wikipedia-w"></i> <a href=' + feature.properties.LINK2 + " target='_blank'>Search Wikimedia Commons</a><br>"
            } else {}
            if (feature.properties.LINK3) {
                popupText += '<i class="fa fa-google"></i> <a href=' + feature.properties.LINK3 + " target='_blank'>View in Google Street View</a><br>"
            } else {}
            if (feature.properties.LINK4) {
                popupText += '<i class="fa fa-flickr"></i> <a href=' + feature.properties.LINK4 + " target='_blank'>Search Flickr</a><br>"
            } else {}
            if (feature.properties.ARTIST) {
                popupText += "<strong>Artist:</strong> " + feature.properties.ARTIST + "<br>"
            } else {}
            if (feature.properties.LOCATION) {
                popupText += "<strong>Location:</strong> " + feature.properties.LOCATION + "<br>"
            } else {}
            if (feature.properties.TYPE) {
                popupText += "<strong>Type:</strong> " + feature.properties.TYPE + "<br>"
            } else {}
            if (feature.properties.YEAR) {
                popupText += "<strong>Year:</strong> " + feature.properties.YEAR + "<br>"
            } else {}
            if (feature.properties.MEDIUM) {
                popupText += "<strong>Medium:</strong> " + feature.properties.MEDIUM + "<br>"
            } else {}
            if (feature.properties.COLLECTION) {
                popupText += "<strong>Collection:</strong> " + feature.properties.COLLECTION + "<br>"
            } else {}
            if (feature.properties.FUNDERS) {
                popupText += "<strong>Funders:</strong> " + feature.properties.FUNDERS + "<br>"
            } else {}
            if (feature.properties.DESC) {
                popupText += "<strong>Description:</strong> " + feature.properties.DESC + "<br>"
            } else {}
            if (feature.properties.AUDIO_DESC) {
                popupText += '<i class="fa fa-file-audio-o"></i> <a href=' + feature.properties.AUDIO_DESC + " target='_blank'>Audio Description</a><br>"
            } else {}
            layer.bindPopup(popupText)
        } else {}
    };
    // point to layer
    function $publicArtPointToLayer(feature, latlng) {
        var publicArtIcon = L.ExtraMarkers.icon({
            icon: "fa-camera",
            markerColor: "orange",
            iconColor: "white",
            shape: "penta",
            prefix: "fa"
        });
        if (feature.properties) {
            return L.marker(latlng, {
                icon: publicArtIcon
            })
        }
    };
    // add layer
    var publicArtUrl = "http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/publicArt.geojson";
    var publicArt = new L.GeoJSON.AJAX(publicArtUrl, {
        onEachFeature: $publicArtOnEachFeature,
        pointToLayer: $publicArtPointToLayer
    });
    /*!
    *   Control
    *   =======
    *   =======
    *
    *   |   Zoom
    *   |   ====
    */
    L.control.zoom({position:'topright'}).addTo(map);
    /*!
    *   |   Layer
    *   |   =====
    */
    var myNbhdLayer = L.geoJson().addTo(map);
    var myOpenSpaceLayer = L.geoJson().addTo(map);
    var myIndivOpenSpaceLayer = L.geoJson().addTo(map);
    var myOverlayLayersGroup = L.layerGroup([myBos_nbhd, myBos_openSpace, myNbhdLayer, myOpenSpaceLayer, myIndivOpenSpaceLayer]).addTo(map);
    var myActivitiesMarkerClusterGroup = L.markerClusterGroup.layerSupport();
    myActivitiesMarkerClusterGroup.checkIn(farmersMarkets);
    myActivitiesMarkerClusterGroup.checkIn(publicArt);
    myActivitiesMarkerClusterGroup.addTo(map);
    var recreationalActivitiesUrl = "http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson";
    var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
        onEachFeature: $activitiesOnEachFeature,
        pointToLayer: $activitiesPointToLayer
    });
    recreationalActivities.on("data:loaded", function() {
        myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
        map.addLayer(myActivitiesMarkerClusterGroup)
    });
    var baseMaps = {
        "Mass GIS": mapc,
        "Open Street Map": OpenStreetMap_Mapnik,
        "Open Street Map (Black and White)": OpenStreetMap_BlackAndWhite,
        "ESRI Street": Esri_WorldStreetMap,
        "ESRI Topography": Esri_WorldTopoMap,
        "ESRI National Geographic": Esri_NatGeoWorldMap,
        "Bing Road": bingLayerRoad,
        "Bing Aerial": bingLayerAerial,
        "Bing Aerial with Labels": bingLayerAerialWithLabels
    };
    var overlays = {
        "Neighborhoods and Open Spaces": myOverlayLayersGroup,
        "Bike Trails": bikeTrails,
        "Farmers Markets": farmersMarkets,
        "Public Art": publicArt
    };
    ctrl = L.control.layers(baseMaps, overlays).addTo(map);
    /*!
    *   Selectors
    *   =========
    *   =========
    //
    *   |   Neighborhoods Select Menu
    *   |   ========================
    */
    $('#Bos_nbhdSelect').on('change', function(evt, params) {    
        var nbhdEach = $('#Bos_nbhdForm').find('.search-choice').children('span');
        var selectedOpenSpaceName = $('#Bos_openSpaceForm').find('.chosen-single').children('span').text();
        var openSpaceDataPlaceholder = $('#Bos_openSpaceSelect').attr('data-placeholder');
        var activitiesDataPlaceholder = $('#activitiesSelect').attr('data-placeholder');
        var selectedActivityText = $('#activitiesForm').find('.chosen-single').children('span').text();
        var recreationalActivitiesUrl = 'http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson';
        // clear layers
        myNbhdLayer.clearLayers();
        myOpenSpaceLayer.clearLayers();
        // params selected
        // ===============
        // if one or more neighborhoods are selected and no open space is selected
        if ((params.selected) && (selectedOpenSpaceName === openSpaceDataPlaceholder)) {
            alert('one or more neighborhoods are selected and no open space is selected');
            // clear layers
            myActivitiesMarkerClusterGroup.clearLayers();
            // reset activities menu
            $('#activitiesSelect option').slice(1).remove();
            $('#activitiesSelect').trigger('chosen:updated');
            // neighborhoods, open spaces, and recreational activities
            nbhdEach.each(function(index) {
                var text = $(this).text();
                // selected neighborhoods
                L.geoJson(Bos_nbhd, {
                    filter: function(feature, layer) {
                        return (feature.properties.Name === text);
                    },
                    onEachFeature: $nbhdSelectedOnEachFeature,
                    style: $nbhdSelectedStyle
                }).addTo(myNbhdLayer);
                // open spaces for selected neighborhoods
                L.geoJson(Bos_openSpace, {
                    filter: function(feature, layer) {
                        if ((feature.properties.SITE_NAME) && (feature.properties.NBHD === text)) {
                            return true;
                        } else {
                            return false;
                        };
                    },
                    onEachFeature: $openSpaceSelectedOnEachFeature,
                    style: $openSpaceSelectedStyle
                }).addTo(myOpenSpaceLayer);
                // recreational activities for selected neighborhoods
                var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
                    onEachFeature: $activitiesOnEachFeature,
                    pointToLayer: $activitiesPointToLayer,
                    filter: function(feature, layer) {
                        if (feature.properties.NBHD === text) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                });
                recreationalActivities.on('data:loaded', function () {
                        myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
                        map.addLayer(myActivitiesMarkerClusterGroup);
                });
                //
            });
            // add overlay layers if their checkbox is checked
            if(map.hasLayer(farmersMarkets)){farmersMarkets.addTo(myActivitiesMarkerClusterGroup)}else{}if(map.hasLayer(publicArt)){publicArt.addTo(myActivitiesMarkerClusterGroup)}else{};
            // reorder layers
            if (map.hasLayer(bikeTrails)) {
                bikeTrails.bringToFront();
            } else {};
            // set zoom
            map.fitBounds(myNbhdLayer.getBounds());
        }
        // if one or more neighborhoods are selected and an open space is selected
        else if ((params.selected) && (selectedOpenSpaceName != openSpaceDataPlaceholder)) {
            alert('one or more neighborhoods are selected and an open space is selected');
            // clear layers
            myActivitiesMarkerClusterGroup.clearLayers();
            myIndivOpenSpaceLayer.clearLayers();
            // update open space menu
            $("#Bos_openSpaceSelect").val('deselected').trigger("chosen:updated");
            // reset activities menu
            $('#activitiesSelect option').slice(1).remove();
            $('#activitiesSelect').trigger('chosen:updated');
            // neighborhoods, open spaces, and recreational activities
            nbhdEach.each(function(index) {
                var text = $(this).text();
                // selected neighborhoods
                L.geoJson(Bos_nbhd, {
                    filter: function(feature, layer) {
                        return (feature.properties.Name === text);
                    },
                    onEachFeature: $nbhdSelectedOnEachFeature,
                    style: $nbhdSelectedStyle
                }).addTo(myNbhdLayer);
                // open spaces for selected neighborhoods
                L.geoJson(Bos_openSpace, {
                    filter: function(feature, layer) {
                        if ((feature.properties.SITE_NAME) && (feature.properties.NBHD === text)) {
                            return true;
                        } else {
                            return false;
                        };
                    },
                    onEachFeature: $openSpaceSelectedOnEachFeature,
                    style: $openSpaceSelectedStyle
                }).addTo(myOpenSpaceLayer);
                // recreational activities for selected neighborhoods
                var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
                    onEachFeature: $activitiesOnEachFeature,
                    pointToLayer: $activitiesPointToLayer,
                    filter: function(feature, layer) {
                        if (feature.properties.NBHD === text) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                });
                recreationalActivities.on('data:loaded', function () {
                        myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
                        map.addLayer(myActivitiesMarkerClusterGroup);
                });
                //
            });
            // add overlay layers if their checkbox is checked
            if(map.hasLayer(farmersMarkets)){farmersMarkets.addTo(myActivitiesMarkerClusterGroup)}else{}if(map.hasLayer(publicArt)){publicArt.addTo(myActivitiesMarkerClusterGroup)}else{};
            // reorder layers
            if (map.hasLayer(bikeTrails)) {
                bikeTrails.bringToFront();
            } else {};
            // set zoom
            map.fitBounds(myNbhdLayer.getBounds());
        }
        // params deselected
        // =================
        // if a neighborhood is being deselected and no open space is selected
        else if ((params.deselected) && (selectedOpenSpaceName === openSpaceDataPlaceholder)) {
            alert('a neighborhood is being deselected and no open space is selected');
            // clear layers
            myActivitiesMarkerClusterGroup.clearLayers();
            // reset activities menu
            $('#activitiesSelect option').slice(1).remove();
            $('#activitiesSelect').trigger('chosen:updated');
            // neighborhoods, open spaces, and recreational activities
            nbhdEach.each(function(index) {
                var text = $(this).text();
                if (text != params.deselected) {
                    // selected neighborhoods
                    L.geoJson(Bos_nbhd, {
                        filter: function(feature, layer) {
                            return (feature.properties.Name === text);
                        },
                        onEachFeature: $nbhdSelectedOnEachFeature,
                        style: $nbhdSelectedStyle
                    }).addTo(myNbhdLayer);
                    // open spaces for selected neighborhoods
                    L.geoJson(Bos_openSpace, {
                        filter: function(feature, layer) {
                            if ((feature.properties.SITE_NAME) && (feature.properties.NBHD === text)) {
                                return true;
                            } else {
                                return false;
                            };
                        },
                        onEachFeature: $openSpaceSelectedOnEachFeature,
                        style: $openSpaceSelectedStyle
                    }).addTo(myOpenSpaceLayer);
                    // recreational activities for selected neighborhoods
                    var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
                        onEachFeature: $activitiesOnEachFeature,
                        pointToLayer: $activitiesPointToLayer,
                        filter: function(feature, layer) {
                            if (feature.properties.NBHD === text) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    });
                    recreationalActivities.on('data:loaded', function () {
                            myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
                            map.addLayer(myActivitiesMarkerClusterGroup);
                    });
                    //
                } else {};
            });
            // add overlay layers if their checkbox is checked
            if(map.hasLayer(farmersMarkets)){farmersMarkets.addTo(myActivitiesMarkerClusterGroup)}else{}if(map.hasLayer(publicArt)){publicArt.addTo(myActivitiesMarkerClusterGroup)}else{};
            // reorder layers
            if (map.hasLayer(bikeTrails)) {
                bikeTrails.bringToFront();
            } else {};
            // set zoom
            var text = $('#Bos_nbhdForm').find('.search-choice').children('span').text();
            if (text != params.deselected) {
                map.fitBounds(myNbhdLayer.getBounds());
            }
            else {
                var recreationalActivitiesUrl = 'http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson';
                var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
                    onEachFeature: $activitiesOnEachFeature,
                    pointToLayer: $activitiesPointToLayer
                });        
                recreationalActivities.on('data:loaded', function () {    
                myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
                map.addLayer(myActivitiesMarkerClusterGroup);
                });
                map.setView([42.312501083130833, -71.057014490234238], 12);
            };
            //
        }
        // if a neighborhood is being deselected and an open space is selected
        else if ((params.deselected) && (selectedOpenSpaceName != openSpaceDataPlaceholder)) {
            alert('a neighborhood is being deselected and an open space is selected');
            // neighborhoods and selected spaces
            nbhdEach.each(function(index) {
                var text = $(this).text();
                if (text != params.deselected) {
                    // selected neighborhoods
                    L.geoJson(Bos_nbhd, {
                        filter: function(feature, layer) {
                            return (feature.properties.Name === text);
                        },
                        onEachFeature: $nbhdSelectedOnEachFeature,
                        style: $nbhdSelectedStyle2
                    }).addTo(myNbhdLayer);
                    // open spaces for selected neighborhoods
                    L.geoJson(Bos_openSpace, {
                        filter: function(feature, layer) {
                            if ((feature.properties.SITE_NAME) && (feature.properties.NBHD === text)) {
                                return true;
                            } else {
                                return false;
                            };
                        },
                        onEachFeature: $openSpaceSelectedOnEachFeature,
                        style: $openSpaceSelectedStyle2
                    }).addTo(myOpenSpaceLayer);
                    //
                } else {};
            });
            // reorder layers
            myOpenSpaceLayer.bringToBack();
            myNbhdLayer.bringToBack();
            myBos_openSpace.bringToBack();
            myBos_nbhd.bringToBack();
            if (map.hasLayer(bikeTrails)) {
                bikeTrails.bringToFront();
            } else {};
            //
        } else {};
        //
    });
    /*!
     *		|		Neighborhood Popup
     *		|		==================
     *		|		|		select
     *		|		|		------
     */
    $('#map').on('click', '.selectNbhdLink', function(event) {
        event.preventDefault();
        var selectedOpenSpaceName = $('#Bos_openSpaceForm').find('.chosen-single').children('span').text();
        var openSpaceDataPlaceholder = $('#Bos_openSpaceSelect').attr('data-placeholder');
        var activitiesDataPlaceholder = $('#activitiesSelect').attr('data-placeholder');
        var selectedActivityText = $('#activitiesForm').find('.chosen-single').children('span').text();
        var recreationalActivitiesUrl = 'http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson';
        // clear layers
        myNbhdLayer.clearLayers();
        myOpenSpaceLayer.clearLayers();
        myActivitiesMarkerClusterGroup.clearLayers();
        // reset activities menu
        $('#activitiesSelect option').slice(1).remove();
        $('#activitiesSelect').trigger('chosen:updated');
        // update neighborhood select menu
        var nbhdValue = $('.nbhdTitle').text();
        var selected = $("#Bos_nbhdSelect option:selected").map(function() {
            return this.value
        }).get();
        selected.push(nbhdValue);
        console.log(selected);
        $('#Bos_nbhdSelect').val(selected).trigger("chosen:updated");
        map.closePopup();
        // update open space select menu
        var nbhdEach = $('#Bos_nbhdForm').find('.search-choice').children('span');
        // if one or more neighborhoods are selected and no open space is selected
        if (selectedOpenSpaceName === openSpaceDataPlaceholder) {
            alert('one or more neighborhoods are selected and no open space is selected');
            myActivitiesMarkerClusterGroup.clearLayers();
            // neighborhoods, open spaces, and recreational activities
            nbhdEach.each(function(index) {
                var text = $(this).text();
                // selected neighborhoods
                L.geoJson(Bos_nbhd, {
                    filter: function(feature, layer) {
                        return (feature.properties.Name === text);
                    },
                    onEachFeature: $nbhdSelectedOnEachFeature,
                    style: $nbhdSelectedStyle
                }).addTo(myNbhdLayer);
                // open spaces for selected neighborhoods
                L.geoJson(Bos_openSpace, {
                    filter: function(feature, layer) {
                        if ((feature.properties.SITE_NAME) && (feature.properties.NBHD === text)) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onEachFeature: $openSpaceSelectedOnEachFeature,
                    style: $openSpaceSelectedStyle
                }).addTo(myOpenSpaceLayer);
                // recreational activities for selected neighborhoods
                var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
                    onEachFeature: $activitiesOnEachFeature,
                    pointToLayer: $activitiesPointToLayer,
                    filter: function(feature, layer) {
                        if (feature.properties.NBHD === text) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                });
                recreationalActivities.on('data:loaded', function () {
                        myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
                        map.addLayer(myActivitiesMarkerClusterGroup);
                });
                //
            });
            // add overlay layers if their checkbox is checked
            if(map.hasLayer(farmersMarkets)){farmersMarkets.addTo(myActivitiesMarkerClusterGroup)}else{}if(map.hasLayer(publicArt)){publicArt.addTo(myActivitiesMarkerClusterGroup)}else{};
            // reorder layers
            if (map.hasLayer(bikeTrails)) {
                bikeTrails.bringToFront();
            } else {};
            // set zoom
            map.fitBounds(myNbhdLayer.getBounds());
        }
        // if one or more neighborhoods are selected and an open space is selected
        else if (selectedOpenSpaceName != openSpaceDataPlaceholder) {
            alert('one or more neighborhoods are selected and an open space is selected');
            // clear layers
            myIndivOpenSpaceLayer.clearLayers();
            // update open space menu
            $("#Bos_openSpaceSelect").val('deselected').trigger("chosen:updated");
            // neighborhoods and open spaces
            nbhdEach.each(function(index) {
                var text = $(this).text();
                // selected neighborhoods
                L.geoJson(Bos_nbhd, {
                    filter: function(feature, layer) {
                        return (feature.properties.Name === text);
                    },
                    onEachFeature: $nbhdSelectedOnEachFeature,
                    style: $nbhdSelectedStyle
                }).addTo(myNbhdLayer);
                // open spaces for selected neighborhoods
                L.geoJson(Bos_openSpace, {
                    filter: function(feature, layer) {
                        if ((feature.properties.SITE_NAME) && (feature.properties.NBHD === text)) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onEachFeature: $openSpaceSelectedOnEachFeature,
                    style: $openSpaceSelectedStyle
                }).addTo(myOpenSpaceLayer);
                // recreational activities for selected neighborhoods
                var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
                    onEachFeature: $activitiesOnEachFeature,
                    pointToLayer: $activitiesPointToLayer,
                    filter: function(feature, layer) {
                        if (feature.properties.NBHD === text) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                });
                recreationalActivities.on('data:loaded', function () {
                        myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
                        map.addLayer(myActivitiesMarkerClusterGroup);
                });
                //
            });
            // add overlay layers if their checkbox is checked
            if(map.hasLayer(farmersMarkets)){farmersMarkets.addTo(myActivitiesMarkerClusterGroup)}else{}if(map.hasLayer(publicArt)){publicArt.addTo(myActivitiesMarkerClusterGroup)}else{};
            // reorder layers
            if (map.hasLayer(bikeTrails)) {
                bikeTrails.bringToFront();
            } else {};
            // set zoom
            map.fitBounds(myNbhdLayer.getBounds());
        }
        //
    });
    /*!
     *		|		|		deselect
     *		|		|		--------
     */
    $('#map').on('click', '.deselectNbhdLink', function(event) {
        event.preventDefault();
        var nbhdValue = $('.nbhdTitle').text();
        var deselect = $("#Bos_nbhdForm").find(".search-choice").children("span").filter(function() {
            return $(this).text() === nbhdValue;
        });
        deselect.parent('.search-choice').find('.search-choice-close').click();
    });
    /*!
     *		|		Open Space Select Menu
     *		|		======================
     */
    $('#Bos_openSpaceSelect').on('change', function() {
        var openSpaceDataPlaceholder = $('#Bos_openSpaceSelect').attr('data-placeholder');
        var selectedOpenSpaceName = $('#Bos_openSpaceForm').find('.chosen-single').children('span').text();
        var selectedNbhds = $("#Bos_nbhdForm").find('.chosen-choices').children('.search-choice');
        var recreationalActivitiesUrl = 'http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson';
        // clear layers
        myIndivOpenSpaceLayer.clearLayers();
        myActivitiesMarkerClusterGroup.clearLayers();
        // add overlay layers if their checkbox is checked
        if(map.hasLayer(farmersMarkets)){farmersMarkets.addTo(myActivitiesMarkerClusterGroup)}else{}if(map.hasLayer(publicArt)){publicArt.addTo(myActivitiesMarkerClusterGroup)}else{};
        // reset activities menu
        $('#activitiesSelect option').slice(1).remove();
        $('#activitiesSelect').trigger('chosen:updated');
        // if an open space is being selected, and no neighborhood is selected
        if ((selectedOpenSpaceName != openSpaceDataPlaceholder) && (selectedNbhds.length == 0)) {
            alert('no neighborhoods are selected');
            // selected individual open space
            L.geoJson(Bos_openSpace, {
                filter: function(feature, layer) {
                    return (feature.properties.SITE_NAME === selectedOpenSpaceName);
                },
                onEachFeature: $indivOpenSpaceOnEachFeature,
                style: $indivOpenSpaceStyle
            }).addTo(myIndivOpenSpaceLayer);
            // reorder layers
            if (map.hasLayer(bikeTrails)) {
                bikeTrails.bringToFront();
            } else {};
            // set zoom
            map.fitBounds(myIndivOpenSpaceLayer.getBounds());
        }
        // if an open space is being selected, and one or more neighborhoods are selected
        else if ((selectedOpenSpaceName != openSpaceDataPlaceholder) && (selectedNbhds.length > 0)) {
            alert('one or more neighborhoods are selected');
            // clear layers
            myNbhdLayer.clearLayers();
            myOpenSpaceLayer.clearLayers();
            // neighborhoods and open spaces
            var nbhdEach = $('#Bos_nbhdForm').find('.search-choice').children('span');
            nbhdEach.each(function(index) {
                var text = $(this).text();
                // selected neighborhoods
                L.geoJson(Bos_nbhd, {
                    filter: function(feature, layer) {
                        return (feature.properties.Name === text);
                    },
                    onEachFeature: $nbhdSelectedOnEachFeature,
                    style: $nbhdSelectedStyle2
                }).addTo(myNbhdLayer);
                // open spaces for selected neighborhoods
                L.geoJson(Bos_openSpace, {
                    filter: function(feature, layer) {
                        if ((feature.properties.SITE_NAME) && (feature.properties.NBHD === text)) {
                            return true;
                        } else {
                            return false;
                        };
                    },
                    onEachFeature: $openSpaceSelectedOnEachFeature,
                    style: $openSpaceSelectedStyle2
                }).addTo(myOpenSpaceLayer);
                //
            });
            // selected individual open space
            L.geoJson(Bos_openSpace, {
                filter: function(feature, layer) {
                    return (feature.properties.SITE_NAME === selectedOpenSpaceName);
                },
                onEachFeature: $indivOpenSpaceOnEachFeature,
                style: $indivOpenSpaceStyle
            }).addTo(myIndivOpenSpaceLayer);
            // reorder layers
            if (map.hasLayer(bikeTrails)) {
                bikeTrails.bringToFront();
            } else {};
            // set zoom
            map.fitBounds(myIndivOpenSpaceLayer.getBounds());
        }
        // if an open space is being deselected, and no neighborhoods are selected
        else if ((selectedOpenSpaceName === openSpaceDataPlaceholder) && (selectedNbhds.length == 0)) {
            alert('open space is being deselected and no neighborhoods are selected');
            var recreationalActivitiesUrl = 'http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson';
            var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
                onEachFeature: $activitiesOnEachFeature,
                pointToLayer: $activitiesPointToLayer
            });        
            recreationalActivities.on('data:loaded', function () {    
            myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
            map.addLayer(myActivitiesMarkerClusterGroup);
            });
            //set zoom
            map.setView([42.312501083130833, -71.057014490234238], 12);
        }
        // if an open space is being deselected, and one or more neighborhoods are selected
        else if ((selectedOpenSpaceName === openSpaceDataPlaceholder) && (selectedNbhds.length > 0)) {
            alert('open space is being deselected and one or more neighborhoods are selected');
            // clear layers
            myNbhdLayer.clearLayers();
            myOpenSpaceLayer.clearLayers();
            // neighborhoods and open spaces
            var nbhdEach = $('#Bos_nbhdForm').find('.search-choice').children('span');
            nbhdEach.each(function(index) {
                var text = $(this).text();
                // selected neighborhoods
                L.geoJson(Bos_nbhd, {
                    filter: function(feature, layer) {
                        return (feature.properties.Name === text);
                    },
                    onEachFeature: $nbhdSelectedOnEachFeature,
                    style: $nbhdSelectedStyle
                }).addTo(myNbhdLayer);
                // open spaces for selected neighborhoods
                L.geoJson(Bos_openSpace, {
                    filter: function(feature, layer) {
                        if ((feature.properties.SITE_NAME) && (feature.properties.NBHD === text)) {
                            return true;
                        } else {
                            return false;
                        };
                    },
                    onEachFeature: $openSpaceSelectedOnEachFeature,
                    style: $openSpaceSelectedStyle
                }).addTo(myOpenSpaceLayer);
                // recreational activities for selected neighborhoods
                var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
                    onEachFeature: $activitiesOnEachFeature,
                    pointToLayer: $activitiesPointToLayer,
                    filter: function(feature, layer) {
                        if (feature.properties.NBHD === text) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                });
                recreationalActivities.on('data:loaded', function () {
                        myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
                        map.addLayer(myActivitiesMarkerClusterGroup);
                });
                //
            });
            // set zoom
            map.fitBounds(myNbhdLayer.getBounds());
        } else {};
    });    
    /*!
     *		|		Open Space Popup
     *		|		================
     *		|		|		select
     *		|		|		------
     */
    $('#map').on('click', '.selectOpenSpaceLink', function(event) {
        event.preventDefault();
        var openSpaceDataPlaceholder = $('#Bos_openSpaceSelect').attr('data-placeholder');
        var selectedOpenSpaceName = $('.openSpacePopupTitle').text();
        var selectedNbhds = $("#Bos_nbhdForm").find('.chosen-choices').children('.search-choice');
        // clear layers
        myIndivOpenSpaceLayer.clearLayers();
        myActivitiesMarkerClusterGroup.clearLayers();
        // add overlay layers if their checkbox is checked
        if(map.hasLayer(farmersMarkets)){farmersMarkets.addTo(myActivitiesMarkerClusterGroup)}else{}if(map.hasLayer(publicArt)){publicArt.addTo(myActivitiesMarkerClusterGroup)}else{};
        // reset activities menu
        $('#activitiesSelect option').slice(1).remove();
        $('#activitiesSelect').trigger('chosen:updated');
        // set open space menu selected option
        $('#Bos_openSpaceSelect').val(selectedOpenSpaceName).trigger("chosen:updated");
        map.closePopup();
        // if an open space is being selected, and no neighborhoods are selected
        if ((selectedOpenSpaceName != openSpaceDataPlaceholder) && (selectedNbhds.length == 0)) {
            alert('no neighborhoods are selected');
            // selected individual open space
            L.geoJson(Bos_openSpace, {
                filter: function(feature, layer) {
                    return (feature.properties.SITE_NAME === selectedOpenSpaceName);
                },
                onEachFeature: $indivOpenSpaceOnEachFeature,
                style: $indivOpenSpaceStyle
            }).addTo(myIndivOpenSpaceLayer);
            // reorder layers
            if (map.hasLayer(bikeTrails)) {
                bikeTrails.bringToFront();
            } else {};
            // set zoom
            map.fitBounds(myIndivOpenSpaceLayer.getBounds());
        }
        // if an open space is being selected, and one or more neighborhoods are selected
        else if ((selectedOpenSpaceName != openSpaceDataPlaceholder) && (selectedNbhds.length > 0)) {
            alert('one or more neighborhoods are selected');
            // clear layers
            myNbhdLayer.clearLayers();
            myOpenSpaceLayer.clearLayers();
            //
            var nbhdEach = $('#Bos_nbhdForm').find('.search-choice').children('span');
            nbhdEach.each(function(index) {
                var text = $(this).text();
                // selected neighborhoods
                L.geoJson(Bos_nbhd, {
                    filter: function(feature, layer) {
                        return (feature.properties.Name === text);
                    },
                    onEachFeature: $nbhdSelectedOnEachFeature,
                    style: $nbhdSelectedStyle2
                }).addTo(myNbhdLayer);
                // open spaces for selected neighborhoods
                L.geoJson(Bos_openSpace, {
                    filter: function(feature, layer) {
                        if ((feature.properties.SITE_NAME) && (feature.properties.NBHD === text)) {
                            return true;
                        } else {
                            return false;
                        };
                    },
                    onEachFeature: $openSpaceSelectedOnEachFeature,
                    style: $openSpaceSelectedStyle2
                }).addTo(myOpenSpaceLayer);
                //
            });
            // selected individual open space
            L.geoJson(Bos_openSpace, {
                filter: function(feature, layer) {
                    return (feature.properties.SITE_NAME === selectedOpenSpaceName);
                },
                onEachFeature: $indivOpenSpaceOnEachFeature,
                style: $indivOpenSpaceStyle
            }).addTo(myIndivOpenSpaceLayer);
            // reorder layers
            if (map.hasLayer(bikeTrails)) {
                bikeTrails.bringToFront();
            } else {};
            // set zoom
            map.fitBounds(myIndivOpenSpaceLayer.getBounds());
        } else {};
    });
    /*!
     *		|		|		deselect
     *		|		|		--------
     */
    $('#map').on('click', '.deselectOpenSpaceLink', function(event) {
        event.preventDefault();
        var selectedNbhds = $("#Bos_nbhdForm").find('.chosen-choices').children('.search-choice');
        var recreationalActivitiesUrl = 'http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson';
        // clear layers
        myIndivOpenSpaceLayer.clearLayers();
        myActivitiesMarkerClusterGroup.clearLayers();
        // add overlay layers if their checkbox is checked
        if(map.hasLayer(farmersMarkets)){farmersMarkets.addTo(myActivitiesMarkerClusterGroup)}else{}if(map.hasLayer(publicArt)){publicArt.addTo(myActivitiesMarkerClusterGroup)}else{};
        // reset activities menu
        $('#activitiesSelect option').slice(1).remove();
        $('#activitiesSelect').trigger('chosen:updated');
        // reset open space menu
        $('#Bos_openSpaceSelect').val('deselected').trigger("chosen:updated");
        // if one or more neighborhoods are selected
        if (selectedNbhds.length > 0) {
            alert('one or more neighborhoods are selected');
            // clear layers
            myNbhdLayer.clearLayers();
            myOpenSpaceLayer.clearLayers();
            // neighborhoods, open spaces and recreational activities
            var nbhdEach = $('#Bos_nbhdForm').find('.search-choice').children('span');
            nbhdEach.each(function(index) {
                var text = $(this).text();
                // selected neighborhoods
                L.geoJson(Bos_nbhd, {
                    filter: function(feature, layer) {
                        return (feature.properties.Name === text);
                    },
                    onEachFeature: $nbhdSelectedOnEachFeature,
                    style: $nbhdSelectedStyle
                }).addTo(myNbhdLayer);
                // open spaces for selected neighborhoods
                L.geoJson(Bos_openSpace, {
                    filter: function(feature, layer) {
                        if ((feature.properties.SITE_NAME) && (feature.properties.NBHD === text)) {
                            return true;
                        } else {
                            return false;
                        };
                    },
                    onEachFeature: $openSpaceSelectedOnEachFeature,
                    style: $openSpaceSelectedStyle
                }).addTo(myOpenSpaceLayer);
                // recreational activities for selected neighborhoods
                var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
                    onEachFeature: $activitiesOnEachFeature,
                    pointToLayer: $activitiesPointToLayer,
                    filter: function(feature, layer) {
                        if (feature.properties.NBHD === text) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                });
                recreationalActivities.on('data:loaded', function () {
                        myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
                        map.addLayer(myActivitiesMarkerClusterGroup);
                });
                //
            });
            // reorder layers
            if (map.hasLayer(bikeTrails)) {
                bikeTrails.bringToFront();
            } else {};
            // set zoom
            map.fitBounds(myNbhdLayer.getBounds());
        }
        // if no neighborhood is selected
        else {
            alert('no neighborhood is selected');
            var recreationalActivitiesUrl = 'http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson';
            var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
                onEachFeature: $activitiesOnEachFeature,
                pointToLayer: $activitiesPointToLayer
            });        
            recreationalActivities.on('data:loaded', function () {    
            myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
            map.addLayer(myActivitiesMarkerClusterGroup);
            });
            map.setView([42.312501083130833, -71.057014490234238], 12);
        };
        //
    });
    /*!
     *		|		Activities Menu
     *		|		===============
     */
     $('#activitiesSelect').on('change', function(evt, params) {
        // clear layers
        myActivitiesMarkerClusterGroup.clearLayers();
        // add overlay layers if their checkbox is checked
        if(map.hasLayer(farmersMarkets)){farmersMarkets.addTo(myActivitiesMarkerClusterGroup)}else{}if(map.hasLayer(publicArt)){publicArt.addTo(myActivitiesMarkerClusterGroup)}else{};
        //
        var activitiesDataPlaceholder = $('#activitiesSelect').attr('data-placeholder');
        var selectedActivityText = $('#activitiesForm').find('.chosen-single').children('span').text();
        var openSpaceDataPlaceholder = $('#Bos_openSpaceSelect').attr('data-placeholder');
        var selectedOpenSpaceName = $('#Bos_openSpaceForm').find('.chosen-single').children('span').text();
        var selectedNbhds = $("#Bos_nbhdForm").find('.chosen-choices').children('.search-choice');
        var nbhdEach = $('#Bos_nbhdForm').find('.search-choice').children('span');
        var recreationalActivitiesUrl = 'http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson';
        // if no neighborhood and no open space are selected
        if ((selectedNbhds.length == 0) && (selectedOpenSpaceName === openSpaceDataPlaceholder)) {
            // and an activity is being selected
            if (activitiesDataPlaceholder != selectedActivityText) {
                alert('an activity is being selected, and no neighborhood and no open space are selected');
                var recreationalActivitiesUrl = 'http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson';
                var selectedActivityMarkers = L.geoJson.ajax(recreationalActivitiesUrl, {
                    filter: function(feature, layer) {
                        if (feature.properties.Category === params.selected) {
                            return true;
                        }
                        if (feature.properties.Category_2 === params.selected) {
                            return true;
                        }
                        if (feature.properties.Category_3 === params.selected) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    onEachFeature: $activitiesOnEachFeaturePopup,
                    pointToLayer: $activitiesPointToLayer
                });
                selectedActivityMarkers.on('data:loaded', function () {
                    myActivitiesMarkerClusterGroup.addLayer(selectedActivityMarkers);
                    map.addLayer(myActivitiesMarkerClusterGroup);
                    myActivitiesMarkerClusterGroup.refreshClusters(selectedActivityMarkers);
                });
            }
            // and an activity is being deselected
            else {
                alert('an activity is being deselected, and no neighborhood and no open space are selected');
                var recreationalActivitiesUrl = 'http://rawgit.com/nbeaumont/bosOpenSpace-recreationActivity-map/master/_geoJson/recreationalActivities.geojson';
                var recreationalActivities = L.geoJson.ajax(recreationalActivitiesUrl, {
                    onEachFeature: $activitiesOnEachFeature,
                    pointToLayer: $activitiesPointToLayer
                });        
                recreationalActivities.on('data:loaded', function () {    
                myActivitiesMarkerClusterGroup.addLayer(recreationalActivities);
                map.addLayer(myActivitiesMarkerClusterGroup);
                });
                map.setView([42.312501083130833, -71.057014490234238], 12);
            };
        }
        // if one or more neighborhoods are selected, and no open space is selected
        else if ((selectedNbhds.length > 0) && (selectedOpenSpaceName === openSpaceDataPlaceholder)) {
            // and an activity is being selected
            if (activitiesDataPlaceholder != selectedActivityText) {
                alert('an activity is being selected and one or more neighborhoods are selected and no open space is selected');
                nbhdEach.each(function(index) {
                    var nbhdName = $(this).text();
                    var selectedActivityMarkers = L.geoJson.ajax(recreationalActivitiesUrl, {
                        filter: function(feature, layer) {
                            if ((feature.properties.NBHD === nbhdName) && (feature.properties.Category === params.selected)) {
                                return true;
                            }
                            if ((feature.properties.NBHD === nbhdName) && (feature.properties.Category_2 === params.selected)) {
                                return true;
                            }
                            if ((feature.properties.NBHD === nbhdName) && (feature.properties.Category_3 === params.selected)) {
                                return true;
                            } else {
                                return false;
                            }
                        },
                        onEachFeature: $activitiesOnEachFeaturePopup,
                        pointToLayer: $activitiesPointToLayer
                    });
                    selectedActivityMarkers.on('data:loaded', function () {
                        myActivitiesMarkerClusterGroup.addLayer(selectedActivityMarkers);
                        map.addLayer(myActivitiesMarkerClusterGroup);
                    });
                });
            }
            // and an activity is being deselected
            else {
                alert('an activity is being deselected and one or more neighborhoods are selected and no open space is selected');
                nbhdEach.each(function(index) {
                    var nbhdName = $(this).text();
                    var selectedActivityMarkers = L.geoJson.ajax(recreationalActivitiesUrl, {
                        filter: function(feature, layer) {
                            if (feature.properties.NBHD === nbhdName) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        },
                        onEachFeature: $activitiesOnEachFeaturePopup,
                        pointToLayer: $activitiesPointToLayer
                    });
                    selectedActivityMarkers.on('data:loaded', function () {
                        myActivitiesMarkerClusterGroup.addLayer(selectedActivityMarkers);
                        map.addLayer(myActivitiesMarkerClusterGroup);
                    });
                });
            };
        }
        // if zero or more neighborhood are selected, and an open space is selected
        else if (selectedOpenSpaceName != openSpaceDataPlaceholder) {
            // and an activity is being selected
            if (activitiesDataPlaceholder != selectedActivityText) {
                alert('an activity is being selected, zero or more neighborhoods are selected, and an open space is selected');
                var selectedActivityMarkers = L.geoJson(Bos_openSpace, {
                    filter: function(feature, layer) {
                        return (feature.properties.SITE_NAME === selectedOpenSpaceName);
                    },
                    onEachFeature: $indivOpenSpaceOnEachFeatureActivitiesFiltered,
                    style: $indivOpenSpaceStyle
                });
            }
            // and an activity is being deselected
            else {
                alert('an activity is being deselected, zero or more neighborhoods are selected, and an open space is selected');
                var selectedActivityMarkers = L.geoJson(Bos_openSpace, {
                    filter: function(feature, layer) {
                        return (feature.properties.SITE_NAME === selectedOpenSpaceName);
                    },
                    onEachFeature: $indivOpenSpaceOnEachFeature,
                    style: $indivOpenSpaceStyle
                });
            };
        } else {};
     });
    // reoder layers
    map.on('overlayadd', onOverlayAdd);
    // dropdown menu options
    var config = {
        '.chosen-select': {},
        '.chosen-select-deselect': {
            allow_single_deselect: true
        },
        '.chosen-select-no-single': {
            disable_search_threshold: 10
        },
        '.chosen-select-no-results': {
            no_results_text: 'Oops, nothing found!'
        },
        '.chosen-select-width': {
            width: "95%"
        }
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }
})
(jQuery);
