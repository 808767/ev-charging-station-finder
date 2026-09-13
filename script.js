document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       GET HTML ELEMENTS
    ========================================= */

    const locationBtn = document.getElementById("locationBtn");
    const findBtn = document.getElementById("findBtn");

    const locationStatus = document.getElementById("locationStatus");

    const latitudeElement = document.getElementById("latitude");
    const longitudeElement = document.getElementById("longitude");

    const mapLink = document.getElementById("mapLink");

    const stationList = document.getElementById("stationList");


    /* =========================================
       CURRENT LOCATION VARIABLES
    ========================================= */

    let currentLatitude = null;
    let currentLongitude = null;


    /* =========================================
       CHECK GEOLOCATION
    ========================================= */

    function checkLocationSupport() {

        if (!navigator.geolocation) {

            if (locationStatus) {
                locationStatus.textContent =
                    "❌ Your browser does not support location services.";
            }

            return false;
        }

        return true;
    }


    /* =========================================
       GET CURRENT LOCATION
    ========================================= */

    function getCurrentLocation(callback) {

        if (!checkLocationSupport()) {
            return;
        }


        if (locationStatus) {
            locationStatus.textContent =
                "📍 Getting your current location...";
        }


        navigator.geolocation.getCurrentPosition(

            function (position) {

                currentLatitude =
                    position.coords.latitude;

                currentLongitude =
                    position.coords.longitude;


                /* UPDATE LATITUDE */

                if (latitudeElement) {

                    latitudeElement.textContent =
                        currentLatitude.toFixed(6);
                }


                /* UPDATE LONGITUDE */

                if (longitudeElement) {

                    longitudeElement.textContent =
                        currentLongitude.toFixed(6);
                }


                /* GOOGLE MAPS LINK */

                const googleMapsLocation =
                    "https://www.google.com/maps/search/?api=1&query=" +
                    currentLatitude +
                    "," +
                    currentLongitude;


                if (mapLink) {

                    mapLink.href =
                        googleMapsLocation;

                    mapLink.style.display =
                        "inline-block";
                }


                /* STATUS */

                if (locationStatus) {

                    locationStatus.textContent =
                        "✅ Location detected successfully!";
                }


                /* RUN CALLBACK */

                if (typeof callback === "function") {

                    callback();
                }

            },


            function (error) {

                let message =
                    "❌ Unable to get your location.";


                if (error.code === 1) {

                    message =
                        "❌ Location permission denied. Please allow location access.";
                }

                else if (error.code === 2) {

                    message =
                        "❌ Location unavailable. Please try again.";
                }

                else if (error.code === 3) {

                    message =
                        "❌ Location request timed out. Please try again.";
                }


                if (locationStatus) {

                    locationStatus.textContent =
                        message;
                }


                if (stationList) {

                    stationList.innerHTML = `

                        <div class="empty-message">

                            <div class="empty-icon">
                                ⚠️
                            </div>

                            <h3>
                                Location Access Required
                            </h3>

                            <p>
                                Please allow location permission
                                and try again.
                            </p>

                        </div>

                    `;
                }

            },


            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }

        );
    }


    /* =========================================
       USE MY CURRENT LOCATION BUTTON
    ========================================= */

    if (locationBtn) {

        locationBtn.addEventListener(
            "click",
            function () {

                getCurrentLocation();

            }
        );

    }


    /* =========================================
       FIND NEARBY EV STATIONS
    ========================================= */

    if (findBtn) {

        findBtn.addEventListener(
            "click",
            function () {

                /* SHOW LOADING */

                if (stationList) {

                    stationList.innerHTML = `

                        <div class="empty-message">

                            <div class="empty-icon">
                                ⚡
                            </div>

                            <h3>
                                Finding Nearby EV Stations...
                            </h3>

                            <p>
                                Please wait while we find charging stations near you.
                            </p>

                        </div>

                    `;

                }


                /* IF LOCATION ALREADY AVAILABLE */

                if (
                    currentLatitude !== null &&
                    currentLongitude !== null
                ) {

                    showNearbyStations();

                    return;
                }


                /* OTHERWISE GET LOCATION FIRST */

                getCurrentLocation(
                    function () {

                        showNearbyStations();

                    }
                );

            }
        );

    }


    /* =========================================
       SHOW NEARBY STATIONS
    ========================================= */

    function showNearbyStations() {

        if (
            currentLatitude === null ||
            currentLongitude === null
        ) {

            return;
        }


        /* GOOGLE MAPS SEARCH */

        const googleMapsURL =
            "https://www.google.com/maps/search/EV+charging+stations/@" +
            currentLatitude +
            "," +
            currentLongitude +
            ",14z";


        /* DISPLAY RESULT */

        if (stationList) {

            stationList.innerHTML = `

                <div class="station-card">

                    <h3>
                        ⚡ EV Charging Stations Near You
                    </h3>

                    <p>
                        📍 Your current location has been detected.
                    </p>

                    <p>
                        Latitude:
                        <strong>
                            ${currentLatitude.toFixed(6)}
                        </strong>
                    </p>

                    <p>
                        Longitude:
                        <strong>
                            ${currentLongitude.toFixed(6)}
                        </strong>
                    </p>

                    <p>
                        🔋 Find charging stations around your location
                        using Google Maps.
                    </p>

                    <a
                        href="${googleMapsURL}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🔎 View Nearby EV Charging Stations
                    </a>

                </div>

            `;

        }

    }


    /* =========================================
       MAP LINK DEFAULT STATE
    ========================================= */

    if (mapLink) {

        mapLink.style.display =
            "none";
    }


    /* =========================================
       INITIAL LOCATION STATUS
    ========================================= */

    if (locationStatus) {

        locationStatus.textContent =
            "📍 Click the button to detect your location.";

    }

});
