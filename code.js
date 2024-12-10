// Initialize map variable
let map;

// Function to initialize and show the map
function showMap() {
    // Show the map div
    const mapDiv = document.getElementById('map');
    mapDiv.style.display = 'block';

    // Get the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Initialize the map centered at the user's location
            map = L.map('map').setView([userLat, userLng], 15);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add a marker for the user's location
            const userMarker = L.marker([userLat, userLng], {icon: greenIcon}).addTo(map);
            userMarker.bindPopup("You are here!").openPopup();

            // Fetch nearby restaurants using Overpass API
            const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=restaurant](around:1500,${userLat},${userLng});out;`;

            fetch(overpassUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.elements.length > 0) {
                        data.elements.forEach(restaurant => {
                            const { lat, lon, tags } = restaurant;
                            const restaurantName = tags.name || "Unnamed Restaurant";

                            // Add a marker for each restaurant
                            const marker = L.marker([lat, lon]).addTo(map);
                            marker.bindPopup(`<b>${restaurantName}</b>`);
                        });
                    } else {
                        alert("No nearby restaurants found.");
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch restaurants:", err);
                });
        }, () => {
            alert("Could not retrieve your location. Please ensure location services are enabled.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }

    const showMapButton = document.getElementById('show-map-btn');
    showMapButton.style.display = 'none';
}

// Add event listener to the button
document.getElementById('show-map-btn').addEventListener('click', showMap);

var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
