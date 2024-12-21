// Debugging function
function debugLog(message) {
    console.log(`[Elevation Map Debug] ${message}`);
}

// Wait for OpenLayers to be loaded
document.addEventListener('DOMContentLoaded', () => {
    debugLog('DOM Loaded');

    // Ensure OpenLayers is available
    if (typeof ol === 'undefined') {
        debugLog('OpenLayers not found. Attempting dynamic load.');
        
        const olCss = document.createElement('link');
        olCss.rel = 'stylesheet';
        olCss.href = 'https://cdn.jsdelivr.net/npm/ol@v8.2.0/ol.css';
        document.head.appendChild(olCss);

        const olScript = document.createElement('script');
        olScript.src = 'https://cdn.jsdelivr.net/npm/ol@v8.2.0/dist/ol.js';
        olScript.onload = () => {
            debugLog('OpenLayers script loaded successfully');
            initializeMap();
        };
        olScript.onerror = () => {
            debugLog('Failed to load OpenLayers library');
        };
        document.head.appendChild(olScript);
    } else {
        debugLog('OpenLayers already available');
        initializeMap();
    }
});

function initializeMap() {
    debugLog('Initializing map');

    // Ensure the map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        debugLog('ERROR: Map container not found');
        return;
    }

    debugLog('Map container found');

    try {
        // Create default controls manually
        const controls = [
            new ol.control.Zoom(),
            new ol.control.Attribution(),
            new ol.control.FullScreen(),
            new ol.control.ScaleLine()
        ];

        // Initialize OpenLayers map
        const map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            controls: new ol.Collection(controls),
            view: new ol.View({
                center: ol.proj.fromLonLat([117.5241, 4.5039]), // Kapilit Palm Oil Mill coordinates
                zoom: 13
            })
        });

        debugLog('Map initialized successfully');

        // Add terrain layer using OpenTopoMap
        const terrainLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
                attributions: 'Terrain data &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
            }),
            visible: false
        });
        map.addLayer(terrainLayer);

        // Add initial marker for Kapilit Palm Oil Mill
        const kapilitCoords = ol.proj.fromLonLat([117.5241, 4.5039]);
        const kapilitMarkerSource = new ol.source.Vector();
        const kapilitMarkerLayer = new ol.layer.Vector({
            source: kapilitMarkerSource,
            style: (feature) => {
                return new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="%23FF0000">' +
                             '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>' +
                             '</svg>'
                    }),
                    text: new ol.style.Text({
                        text: 'Kapilit Palm Oil Mill',
                        font: 'bold 12px Arial',
                        fill: new ol.style.Fill({ color: '#000' }),
                        stroke: new ol.style.Stroke({ color: '#FFF', width: 3 }),
                        offsetY: -15,
                        textAlign: 'center'
                    })
                });
            }
        });
        map.addLayer(kapilitMarkerLayer);

        // Create marker feature
        const kapilitMarkerFeature = new ol.Feature({
            geometry: new ol.geom.Point(kapilitCoords)
        });
        kapilitMarkerSource.addFeature(kapilitMarkerFeature);

        // Line of Sight Functionality
        const lineOfSightSource = new ol.source.Vector();
        const lineOfSightLayer = new ol.layer.Vector({
            source: lineOfSightSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 0, 0, 0.7)',
                    width: 3
                })
            })
        });
        map.addLayer(lineOfSightLayer);

        // Point markers for line of sight
        const lineOfSightPointsSource = new ol.source.Vector();
        const lineOfSightPointsLayer = new ol.layer.Vector({
            source: lineOfSightPointsSource,
            style: function(feature) {
                const pointIndex = feature.get('pointIndex');
                return createLoRaWANMarkerStyle(pointIndex);
            }
        });
        map.addLayer(lineOfSightPointsLayer);

        // Modify interaction for dragging points
        const modifyInteraction = new ol.interaction.Modify({
            source: lineOfSightPointsSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(255, 0, 0, 0.7)',
                    width: 3
                })
            })
        });
        map.addInteraction(modifyInteraction);

        let lineOfSightInteraction = null;
        let lineOfSightPoints = [];

        // Initialize Line of Sight button
        const lineOfSightBtn = document.getElementById('lineOfSightBtn');
        if (lineOfSightBtn) {
            lineOfSightBtn.addEventListener('click', () => {
                // Toggle active state
                const isActive = lineOfSightBtn.getAttribute('data-active') === 'true';
                
                if (!isActive) {
                    // Activate Line of Sight mode
                    lineOfSightBtn.setAttribute('data-active', 'true');
                    lineOfSightBtn.classList.remove('bg-primary');
                    lineOfSightBtn.classList.add('bg-green-500');
                    
                    // Setup line of sight interaction
                    setupLineOfSightInteraction();
                } else {
                    // Deactivate Line of Sight mode
                    lineOfSightBtn.setAttribute('data-active', 'false');
                    lineOfSightBtn.classList.remove('bg-green-500');
                    lineOfSightBtn.classList.add('bg-primary');
                    
                    // Remove any existing interaction
                    if (lineOfSightInteraction) {
                        map.removeInteraction(lineOfSightInteraction);
                        lineOfSightInteraction = null;
                    }
                }
            });
        }

        // Custom style for LoRaWAN device and gateway markers
        function createLoRaWANMarkerStyle(pointIndex) {
            // Define colors and labels
            const pointStyles = [
                {
                    color: '#4CAF50',  // Green
                    text: 'End Device',
                    radius: 10
                },
                {
                    color: '#2196F3',  // Blue
                    text: 'Gateway',
                    radius: 10
                }
            ];

            // Get style for the specific point index
            const style = pointStyles[pointIndex] || pointStyles[0];

            // Return OpenLayers style with a colored circle marker
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: style.radius,
                    fill: new ol.style.Fill({
                        color: style.color
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'white',
                        width: 2
                    })
                }),
                text: new ol.style.Text({
                    text: style.text,
                    font: '12px Arial',
                    fill: new ol.style.Fill({color: 'white'}),
                    stroke: new ol.style.Stroke({color: 'black', width: 2}),
                    offsetY: -15
                })
            });
        }

        // Modify Line of Sight interaction to handle button state
        function setupLineOfSightInteraction() {
            // Remove any existing interaction
            if (lineOfSightInteraction) {
                map.removeInteraction(lineOfSightInteraction);
            }

            // Reset points
            lineOfSightPoints = [];
            lineOfSightSource.clear();
            lineOfSightPointsSource.clear();

            // Create new draw interaction
            lineOfSightInteraction = new ol.interaction.Draw({
                source: lineOfSightSource,
                type: 'LineString',
                maxPoints: 2,
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'rgba(255, 0, 0, 0.7)',
                        width: 3
                    })
                })
            });

            // Add point markers when drawing
            lineOfSightInteraction.on('drawstart', (e) => {
                // Reset previous points
                lineOfSightPoints = [];
                lineOfSightSource.clear();
                lineOfSightPointsSource.clear();
            });

            lineOfSightInteraction.on('drawend', (e) => {
                const feature = e.feature;
                const coordinates = feature.getGeometry().getCoordinates();

                // Create point markers for start and end
                coordinates.forEach((coord, index) => {
                    const pointFeature = new ol.Feature({
                        geometry: new ol.geom.Point(coord)
                    });
                    
                    // Set custom style based on point index
                    pointFeature.setStyle(createLoRaWANMarkerStyle(index));
                    
                    // Add custom property to identify point
                    pointFeature.set('pointIndex', index);
                    lineOfSightPointsSource.addFeature(pointFeature);

                    // Store the point features
                    const pointLayer = new ol.layer.Vector({
                        source: new ol.source.Vector({
                            features: [pointFeature]
                        })
                    });
                    map.addLayer(pointLayer);
                    lineOfSightPoints.push(pointLayer);
                });

                // Update elevation profile
                updateElevationProfile();

                // Reset button state
                const lineOfSightBtn = document.getElementById('lineOfSightBtn');
                lineOfSightBtn.setAttribute('data-active', 'false');
                lineOfSightBtn.classList.remove('bg-green-500');
                lineOfSightBtn.classList.add('bg-primary');

                // Remove draw interaction
                map.removeInteraction(lineOfSightInteraction);
                lineOfSightInteraction = null;
            });

            map.addInteraction(lineOfSightInteraction);
        }

        // Elevation Profile UI
        const elevationProfile = document.getElementById('elevationProfile');
        const closeElevationProfile = document.getElementById('closeElevationProfile');
        const blueAntennaHeight = document.getElementById('blueAntennaHeight');
        const greenAntennaHeight = document.getElementById('greenAntennaHeight');
        let chart = null;

        if (closeElevationProfile) {
            closeElevationProfile.addEventListener('click', () => {
                const elevationProfileDiv = document.getElementById('elevationProfile');
                elevationProfileDiv.classList.add('hidden');
                
                // Clear line of sight points if needed
                if (lineOfSightPoints.length > 0) {
                    lineOfSightPoints.forEach(point => map.removeLayer(point));
                    lineOfSightPoints = [];
                }
                
                // Clear line of sight source and points source
                lineOfSightSource.clear();
                lineOfSightPointsSource.clear();
                
                // Clear any existing line of sight interaction
                if (lineOfSightInteraction) {
                    map.removeInteraction(lineOfSightInteraction);
                    lineOfSightInteraction = null;
                }

                // Reset Line of Sight button state
                const lineOfSightBtn = document.getElementById('lineOfSightBtn');
                if (lineOfSightBtn) {
                    lineOfSightBtn.setAttribute('data-active', 'false');
                    lineOfSightBtn.classList.remove('bg-green-500');
                    lineOfSightBtn.classList.add('bg-primary');
                }
            });
        }

        // Update elevation profile when antenna heights change
        [blueAntennaHeight, greenAntennaHeight].forEach(input => {
            if (input) {
                input.addEventListener('change', () => {
                    updateElevationProfile();
                });
            }
        });

        // Function to fetch elevation data
        async function getElevationData(lon, lat) {
            try {
                // Use SRTM (Shuttle Radar Topography Mission) elevation API
                const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`);
                
                if (!response.ok) {
                    console.error('Elevation API request failed');
                    return 0;
                }
                
                const data = await response.json();
                
                if (data.results && data.results.length > 0) {
                    return data.results[0].elevation;
                }
                
                console.error('No elevation data found');
                return 0;
            } catch (error) {
                console.error('Error fetching elevation:', error);
                return 0;
            }
        }

        // Fallback elevation method using OpenLayers
        function getLocalElevation(coordinates) {
            try {
                // Find terrain or elevation layer
                const elevationLayer = map.getLayers().getArray().find(layer => 
                    layer.get('type') === 'elevation' || 
                    layer.get('name') === 'elevation'
                );

                if (!elevationLayer) {
                    console.warn('No elevation layer found');
                    return 0;
                }

                // If the layer has a specific elevation method
                if (elevationLayer.getSource && typeof elevationLayer.getSource().getElevation === 'function') {
                    const pixel = map.getPixelFromCoordinate(coordinates);
                    return elevationLayer.getSource().getElevation(pixel);
                }

                return 0;
            } catch (error) {
                console.error('Local elevation retrieval error:', error);
                return 0;
            }
        }

        // Updated elevation profile calculation with progress tracking
        async function updateElevationProfile() {
            if (!chart || lineOfSightPointsSource.getFeatures().length !== 2) {
                console.error('Not enough points for line of sight');
                return;
            }

            // Show progress bar
            const progressBar = document.getElementById('elevationProfileProgress');
            const progressBarFill = document.getElementById('elevationProfileProgressBar');
            progressBar.classList.remove('hidden');
            progressBarFill.style.width = '0%';

            const elevationProfileDiv = document.getElementById('elevationProfile');
            elevationProfileDiv.classList.remove('hidden');

            const pointFeatures = lineOfSightPointsSource.getFeatures();
            const point1 = pointFeatures[0].getGeometry().getCoordinates();
            const point2 = pointFeatures[1].getGeometry().getCoordinates();
            
            // Convert to lat/lon
            const lonLat1 = ol.proj.transform(point1, 'EPSG:3857', 'EPSG:4326');
            const lonLat2 = ol.proj.transform(point2, 'EPSG:3857', 'EPSG:4326');

            // Get antenna heights
            const blueAntennaHeight = parseFloat(document.getElementById('blueAntennaHeight').value) || 30;
            const greenAntennaHeight = parseFloat(document.getElementById('greenAntennaHeight').value) || 30;

            // Prepare data arrays
            const elevationData = [];
            const losData = [];
            const numPoints = 100;

            // Async elevation fetching with progress
            async function fetchElevationWithProgress(lon, lat, index) {
                try {
                    // Update progress bar
                    const progress = Math.round((index / numPoints) * 100);
                    progressBarFill.style.width = `${progress}%`;

                    // Fetch elevation (replace with your preferred method)
                    const elevation = await getElevationData(lon, lat) || 0;
                    return elevation;
                } catch (error) {
                    console.error('Elevation fetch error:', error);
                    return 0;
                }
            }

            // Calculate distance
            const distance = ol.sphere.getDistance(lonLat1, lonLat2);
            const distanceKm = Math.round(distance / 1000 * 100) / 100;

            // Fetch point elevations
            const point1Elevation = await fetchElevationWithProgress(lonLat1[0], lonLat1[1], 0) || 0;
            const point2Elevation = await fetchElevationWithProgress(lonLat2[0], lonLat2[1], numPoints) || 0;

            // Generate elevation data with progress
            for (let i = 0; i <= numPoints; i++) {
                const fraction = i / numPoints;
                
                // Interpolate coordinates
                const interpLon = lonLat1[0] + (lonLat2[0] - lonLat1[0]) * fraction;
                const interpLat = lonLat1[1] + (lonLat2[1] - lonLat1[1]) * fraction;

                // Fetch elevation for interpolated point
                const pointElevation = await fetchElevationWithProgress(interpLon, interpLat, i);

                // Calculate line of sight height
                const lineOfSightHeight = 
                    point1Elevation + 
                    blueAntennaHeight + 
                    (point2Elevation - point1Elevation + greenAntennaHeight - blueAntennaHeight) * fraction;

                elevationData.push([distanceKm * fraction, pointElevation]);
                losData.push([distanceKm * fraction, lineOfSightHeight]);
            }

            // Hide progress bar
            progressBar.classList.add('hidden');

            // Update display
            document.getElementById('point1Coords').textContent = 
                `Coordinates: ${lonLat1[1].toFixed(6)}°N, ${lonLat1[0].toFixed(6)}°E`;
            document.getElementById('point2Coords').textContent = 
                `Coordinates: ${lonLat2[1].toFixed(6)}°N, ${lonLat2[0].toFixed(6)}°E`;
            document.getElementById('point1Elevation').textContent = 
                `Elevation: ${Math.round(point1Elevation)} m`;
            document.getElementById('point2Elevation').textContent = 
                `Elevation: ${Math.round(point2Elevation)} m`;
            document.getElementById('pathDistance').textContent = 
                `Distance: ${distanceKm} km`;

            // Update chart
            chart.series[0].setData(elevationData);
            chart.series[1].setData(losData);

            console.log('Elevation Profile Updated', {
                point1: { coords: lonLat1, elevation: point1Elevation },
                point2: { coords: lonLat2, elevation: point2Elevation },
                distance: distanceKm
            });
        }

        // Initialize Highcharts
        function initializeChart() {
            return Highcharts.chart('elevationChart', {
                chart: {
                    type: 'area',
                    zoomType: 'x',
                    backgroundColor: '#f9fafb',
                    height: 300
                },
                title: {
                    text: null
                },
                xAxis: {
                    title: {
                        text: 'Distance (km)'
                    },
                    minPadding: 0,
                    maxPadding: 0,
                    startOnTick: false,
                    endOnTick: false
                },
                yAxis: {
                    title: {
                        text: 'Elevation (m)'
                    },
                    min: 0
                },
                tooltip: {
                    shared: true,
                    formatter: function() {
                        return `Distance: ${this.x.toFixed(2)} km<br>Elevation: ${this.y.toFixed(0)} m`;
                    }
                },
                legend: {
                    enabled: true,
                    align: 'right',
                    verticalAlign: 'top',
                    layout: 'vertical'
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.color('#cccccc').setOpacity(0.6).get('rgba')],
                                [1, Highcharts.color('#cccccc').setOpacity(0.1).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },
                series: [{
                    name: 'Terrain',
                    color: '#666666',
                    data: []
                }, {
                    name: 'Line of Sight',
                    type: 'line',
                    color: '#ff0000',
                    dashStyle: 'shortdot',
                    data: [],
                    marker: {
                        enabled: false
                    }
                }]
            });
        }

        // Initialize chart if not already done
        if (!chart) {
            chart = initializeChart();
        }

        // Toggle terrain button functionality
        const toggleTerrainBtn = document.getElementById('toggleTerrain');
        if (toggleTerrainBtn) {
            toggleTerrainBtn.addEventListener('click', () => {
                const isVisible = terrainLayer.getVisible();
                terrainLayer.setVisible(!isVisible);
                
                // Update button visual state
                if (isVisible) {
                    toggleTerrainBtn.classList.remove('bg-green-500');
                    toggleTerrainBtn.classList.add('bg-primary');
                    toggleTerrainBtn.textContent = 'Toggle Terrain';
                } else {
                    toggleTerrainBtn.classList.remove('bg-primary');
                    toggleTerrainBtn.classList.add('bg-green-500');
                    toggleTerrainBtn.textContent = 'Terrain Visible';
                }
            });
        }

        // Estate link interactions with enhanced pin and label functionality
        const estateLinks = document.querySelectorAll('.estate-link');
        estateLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const coordsStr = link.getAttribute('data-coords');
                const coords = JSON.parse(coordsStr);
                const estateName = link.textContent.trim();
                
                // Convert to map projection
                const transformedCoords = ol.proj.fromLonLat(coords);
                
                // Create a vector source for estate markers
                const estateMarkerSource = new ol.source.Vector();
                const estateMarkerLayer = new ol.layer.Vector({
                    source: estateMarkerSource,
                    style: (feature) => {
                        // Pin style
                        const pinStyle = new ol.style.Style({
                            image: new ol.style.Icon({
                                anchor: [0.5, 1],
                                src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="%23FF0000">' +
                                     '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>' +
                                     '</svg>'
                            }),
                            text: new ol.style.Text({
                                text: estateName,
                                font: 'bold 12px Arial',
                                fill: new ol.style.Fill({ color: '#000' }),
                                stroke: new ol.style.Stroke({ color: '#FFF', width: 3 }),
                                offsetY: -15,
                                textAlign: 'center'
                            })
                        });
                        return pinStyle;
                    }
                });
                map.addLayer(estateMarkerLayer);

                // Clear previous markers
                estateMarkerSource.clear();

                // Create marker feature
                const markerFeature = new ol.Feature({
                    geometry: new ol.geom.Point(transformedCoords)
                });
                estateMarkerSource.addFeature(markerFeature);
                
                // Zoom and center
                map.getView().animate({
                    center: transformedCoords,
                    zoom: 13,
                    duration: 1000
                });
            });
        });

        // Distance measurement functionality
        let measureDraw;
        let measuring = false;

        const measureSource = new ol.source.Vector();
        const measureLayer = new ol.layer.Vector({
            source: measureSource,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });
        map.addLayer(measureLayer);

        // Clear Measurements Button
        const clearMeasurementsBtn = document.getElementById('clearMeasurementsBtn');
        if (clearMeasurementsBtn) {
            clearMeasurementsBtn.addEventListener('click', () => {
                // Clear measurement layer
                measureSource.clear();
                
                // Clear line of sight layer
                lineOfSightSource.clear();
                
                // Reset measurement interaction if active
                if (measuring) {
                    map.removeInteraction(measureDraw);
                    measuring = false;
                    document.getElementById('measureDistance').textContent = 'Measure Distance';
                }
                
                // Reset line of sight interaction
                if (lineOfSightInteraction) {
                    map.removeInteraction(lineOfSightInteraction);
                    lineOfSightInteraction = null;
                    document.getElementById('lineOfSightBtn').textContent = 'Line of Sight';
                }
            });
        }

        const measureDistanceBtn = document.getElementById('measureDistance');
        if (measureDistanceBtn) {
            measureDistanceBtn.addEventListener('click', () => {
                if (measuring) {
                    map.removeInteraction(measureDraw);
                    measuring = false;
                    measureDistanceBtn.textContent = 'Measure Distance';
                } else {
                    measureDraw = new ol.interaction.Draw({
                        source: measureSource,
                        type: 'LineString',
                        style: new ol.style.Style({
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 255, 0.2)'
                            }),
                            stroke: new ol.style.Stroke({
                                color: 'rgba(0, 0, 0, 0.5)',
                                lineDash: [10, 10],
                                width: 2
                            }),
                            image: new ol.style.Circle({
                                radius: 5,
                                stroke: new ol.style.Stroke({
                                    color: 'rgba(0, 0, 0, 0.7)'
                                }),
                                fill: new ol.style.Fill({
                                    color: 'rgba(255, 255, 255, 0.2)'
                                })
                            })
                        })
                    });
                    map.addInteraction(measureDraw);
                    measuring = true;
                    measureDistanceBtn.textContent = 'Stop Measuring';

                    measureDraw.on('drawend', (evt) => {
                        const line = evt.feature.getGeometry();
                        const length = ol.sphere.getLength(line);
                        const formattedLength = length > 1000 ? 
                            Math.round(length / 1000 * 100) / 100 + ' km' : 
                            Math.round(length * 100) / 100 + ' m';
                        
                        const coordinates = line.getCoordinates();
                        const endPoint = coordinates[coordinates.length - 1];
                        
                        // Add distance label
                        const feature = new ol.Feature({
                            geometry: new ol.geom.Point(endPoint),
                            name: formattedLength
                        });
                        
                        feature.setStyle(new ol.style.Style({
                            text: new ol.style.Text({
                                text: formattedLength,
                                fill: new ol.style.Fill({
                                    color: '#000'
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#fff',
                                    width: 3
                                }),
                                offsetY: -15
                            })
                        }));
                        
                        measureSource.addFeature(feature);
                    });
                }
            });
        }

        // Create elevation scale
        const elevationScale = document.getElementById('elevation-scale');
        if (elevationScale) {
            const elevations = [0, 250, 500, 750, 1000];
            const colors = ['#008f68', '#6fb98f', '#b4c6a6', '#c5d5cb', '#fff'];
            
            elevations.forEach((elevation, i) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.marginBottom = '5px';
                
                const color = document.createElement('div');
                color.style.width = '20px';
                color.style.height = '20px';
                color.style.backgroundColor = colors[i];
                color.style.marginRight = '5px';
                
                const label = document.createElement('span');
                label.textContent = `${elevation}m`;
                
                row.appendChild(color);
                row.appendChild(label);
                elevationScale.appendChild(row);
            });
        }

        debugLog('Map initialization complete');
    } catch (error) {
        debugLog(`ERROR during map initialization: ${error.message}`);
        console.error(error);
    }
}
