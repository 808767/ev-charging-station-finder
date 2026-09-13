document.addEventListener("DOMContentLoaded", function () {

    const locationBtn = document.getElementById("locationBtn");
    const findBtn = document.getElementById("findBtn");

    const locationStatus = document.getElementById("locationStatus");
    const latitude = document.getElementById("latitude");
    const longitude = document.getElementById("longitude");
    const mapLink = document.getElementById("mapLink");
    const stationList = document.getElementById("stationList");

    let currentLatitude = null;
    let currentLongitude = null;


    // GET USER LOCATION
    function getLocation() {

        if (!navigator.geolocation) {
            locationStatus.textContent =
                "❌ Geolocation is not supported by your browser.";
            return;
        }

        locationStatus.textContent =
            "📍 Getting your location...";

        navigator.geolocation.getCurrentPosition(

            function (position) {

                currentLatitude = position.coords.latitude;
                currentLongitude = position.coords.longitude;

                latitude.textContent =
                    currentLatitude.toFixed(6);

                longitude.textContent =
                    currentLongitude.toFixed(6);

                mapLink.href =
                    "https://www.google.com/maps/search/?api=1&query=" +
                    currentLatitude + "," + currentLongitude;

                mapLink.style.display = "inline-block";

                locationStatus.textContent =
                    "✅ Location detected successfully!";

            },

            function (error) {

                if (error.code === 1) {
                    locationStatus.textContent =
                        "❌ Location permission denied. Please allow location access.";
                }
                else if (error.code === 2) {
                    locationStatus.textContent =
                        "❌ Location unavailable. Please try again.";
                }
                else if (error.code === 3) {
                    locationStatus.textContent =
                        "❌ Location request timed out. Please try again.";
                }
                else {
                    locationStatus.textContent =
                        "❌ Unable to get your location.";
                }
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }


    // USE MY CURRENT LOCATION BUTTON
    if (locationBtn) {
        locationBtn.addEventListener("click", function () {
            getLocation();
        });
    }


    // FIND NEARBY EV STATIONS
    if (findBtn) {

        findBtn.addEventListener("click", function () {

            stationList.innerHTML = `
                <div class="empty-message">
                    <div class="empty-icon">📍</div>
                    <h3>Finding nearby EV charging stations...</h3>
                    <p>Please wait a moment.</p>
                </div>
            `;

            if (currentLatitude === null || currentLongitude === null) {

                if (!navigator.geolocation) {

                    stationList.innerHTML = `
                        <div class="empty-message">
                            <div class="empty-icon">❌</div>
                            <h3>Location not supported</h3>
                            <p>Your browser does not support location services.</p>
                        </div>
                    `;

                    return;
                }

                navigator.geolocation.getCurrentPosition(

                    function (position) {

                        currentLatitude =
                            position.coords.latitude;

                        currentLongitude =
                            position.coords.longitude;

                        latitude.textContent =
                            currentLatitude.toFixed(6);

                        longitude.textContent =
                            currentLongitude.toFixed(6);

                        mapLink.href =
                            "https://www.google.com/maps/search/?api=1&query=" +
                            currentLatitude + "," +
                            currentLongitude;

                        mapLink.style.display = "inline-block";

                        locationStatus.textContent =
                            "✅ Location detected successfully!";

                        showStations();

                    },

                    function () {

                        stationList.innerHTML = `
                            <div class="empty-message">
                                <div class="empty-icon">⚠️</div>
                                <h3>Location permission required</h3>
                                <p>Please allow location access and try again.</p>
                            </div>
                        `;
                    },

                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );

            } else {

                showStations();

            }
        });
    }


    // SHOW STATIONS
    function showStations() {

        const googleMapsURL =
            "https://www.google.com/maps/search/EV+charging+stations/@" +
            currentLatitude + "," +
            currentLongitude + ",14z";

        stationList.innerHTML = `

            <div class="station-card">

                <h3>⚡ Nearby EV Charging Stations</h3>

                <p>
                    We found EV charging stations around your current location.
                </p>

                <p>
                    📍 Latitude:
                    ${currentLatitude.toFixed(6)}
                </p>

                <p>
                    📍 Longitude:
                    ${currentLongitude.toFixed(6)}
                </p>

                <a href="${googleMapsURL}"
                   target="_blank"
                   rel="noopener noreferrer">

                    🔎 View Charging Stations on Google Maps

                </a>

            </div>

        `;
    }

});
