document.addEventListener("DOMContentLoaded", function () {

    const locationBtn = document.getElementById("locationBtn");
    const findBtn = document.getElementById("findBtn");

    const reachBtn = document.getElementById("reachBtn");
    const ctaBtn = document.getElementById("ctaBtn");

    const locationStatus =
        document.getElementById("locationStatus");

    const latitudeElement =
        document.getElementById("latitude");

    const longitudeElement =
        document.getElementById("longitude");

    const mapLink =
        document.getElementById("mapLink");

    const stationList =
        document.getElementById("stationList");

    const reachResult =
        document.getElementById("reachResult");


    let currentLatitude = null;
    let currentLongitude = null;


    /* =========================
       LOCATION
    ========================= */

    function getCurrentLocation(callback) {

        if (!navigator.geolocation) {

            locationStatus.textContent =
                "❌ Your browser does not support location services.";

            return;
        }


        locationStatus.textContent =
            "📍 Getting your current location...";


        navigator.geolocation.getCurrentPosition(

            function (position) {

                currentLatitude =
                    position.coords.latitude;

                currentLongitude =
                    position.coords.longitude;


                latitudeElement.textContent =
                    currentLatitude.toFixed(6);

                longitudeElement.textContent =
                    currentLongitude.toFixed(6);


                const locationURL =
                    "https://www.google.com/maps/search/?api=1&query=" +
                    currentLatitude +
                    "," +
                    currentLongitude;


                mapLink.href = locationURL;

                mapLink.style.display =
                    "inline-block";


                locationStatus.textContent =
                    "✅ Location detected successfully!";


                if (typeof callback === "function") {

                    callback();

                }

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
                timeout: 15000,
                maximumAge: 0
            }

        );

    }


    /* =========================
       LOCATION BUTTON
    ========================= */

    locationBtn.addEventListener(
        "click",
        function () {

            getCurrentLocation();

        }
    );


    /* =========================
       FIND STATIONS
    ========================= */

    findBtn.addEventListener(
        "click",
        function () {

            stationList.innerHTML = `

                <div class="empty-message">

                    <div class="empty-icon">⚡</div>

                    <h3>
                        Finding Nearby EV Stations...
                    </h3>

                    <p>
                        Please wait...
                    </p>

                </div>
            `;


            if (
                currentLatitude !== null &&
                currentLongitude !== null
            ) {

                showStations();

            }

            else {

                getCurrentLocation(
                    function () {

                        showStations();

                    }
                );

            }

        }
    );


    /* =========================
       SHOW STATIONS
    ========================= */

    function showStations() {

        const googleMapsURL =
            "https://www.google.com/maps/search/EV+charging+stations/@" +
            currentLatitude +
            "," +
            currentLongitude +
            ",14z";


        const navigateURL =
            "https://www.google.com/maps/dir/?api=1&origin=" +
            currentLatitude +
            "," +
            currentLongitude +
            "&destination=EV+charging+station";


        stationList.innerHTML = `

            <div class="station-card">

                <h3>
                    ⚡ EV Charging Station
                </h3>

                <p>
                    📍 Nearby charging station search
                </p>

                <p>
                    📏 Distance:
                    <strong>
                        Search distance on Google Maps
                    </strong>
                </p>

                <p>
                    🔌 Charger:
                    <strong>
                        EV Charging Point
                    </strong>
                </p>

                <p>
                    ⚡ Charging Power:
                    <strong>
                        Check station details
                    </strong>
                </p>

                <span class="availability">
                    🟢 Check Charging Availability
                </span>

                <p>
                    🔋 Before travelling, check the
                    available chargers on the station page.
                </p>


                <div class="station-buttons">

                    <a
                        class="station-btn"
                        href="${googleMapsURL}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🔎 View Nearby Stations
                    </a>


                    <a
                        class="station-btn"
                        href="${navigateURL}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🚗 Navigate
                    </a>


                    <a
                        class="station-btn backup-btn"
                        href="${googleMapsURL}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🆘 Find Backup Station
                    </a>

                </div>

            </div>

        `;

    }


    /* =========================
       CAN I REACH?
    ========================= */

    reachBtn.addEventListener(
        "click",
        function () {

            const battery =
                parseFloat(
                    document.getElementById("battery").value
                );

            const fullRange =
                parseFloat(
                    document.getElementById("fullRange").value
                );

            const distance =
                parseFloat(
                    document.getElementById("distance").value
                );


            if (
                isNaN(battery) ||
                isNaN(fullRange) ||
                isNaN(distance)
            ) {

                reachResult.innerHTML = `
                    ⚠️ Please enter all EV details.
                `;

                return;
            }


            if (battery < 0 || battery > 100) {

                reachResult.innerHTML = `
                    ⚠️ Battery percentage must be between 0 and 100.
                `;

                return;
            }


            const availableRange =
                (battery / 100) * fullRange;


            const remainingRange =
                availableRange - distance;


            if (availableRange >= distance) {

                reachResult.innerHTML = `

                    <div style="font-size:40px;">
                        🟢
                    </div>

                    <h3>
                        YES! Your EV can reach the station.
                    </h3>

                    <p>
                        🔋 Available Range:
                        <strong>
                            ${availableRange.toFixed(1)} km
                        </strong>
                    </p>

                    <p>
                        📍 Station Distance:
                        <strong>
                            ${distance.toFixed(1)} km
                        </strong>
                    </p>

                    <p>
                        ✅ Remaining estimated range:
                        <strong>
                            ${remainingRange.toFixed(1)} km
                        </strong>
                    </p>

                `;

            }

            else {

                reachResult.innerHTML = `

                    <div style="font-size:40px;">
                        🔴
                    </div>

                    <h3>
                        NO! Your EV may not reach the station.
                    </h3>

                    <p>
                        🔋 Available Range:
                        <strong>
                            ${availableRange.toFixed(1)} km
                        </strong>
                    </p>

                    <p>
                        📍 Station Distance:
                        <strong>
                            ${distance.toFixed(1)} km
                        </strong>
                    </p>

                    <p>
                        ⚠️ You need approximately
                        <strong>
                            ${(distance - availableRange).toFixed(1)} km
                        </strong>
                        more range.
                    </p>

                    <br>

                    <button
                        onclick="findBackupStation()"
                        class="station-btn backup-btn"
                    >
                        🆘 Find Backup Station
                    </button>

                `;

            }

        }
    );


    /* =========================
       BACKUP STATION
    ========================= */

    window.findBackupStation =
        function () {

            if (
                currentLatitude === null ||
                currentLongitude === null
            ) {

                getCurrentLocation(
                    function () {

                        openBackup();

                    }
                );

            }

            else {

                openBackup();

            }

        };


    function openBackup() {

        const backupURL =
            "https://www.google.com/maps/search/EV+charging+stations/@" +
            currentLatitude +
            "," +
            currentLongitude +
            ",12z";


        window.open(
            backupURL,
            "_blank"
        );

    }


    /* =========================
       CTA
    ========================= */

    ctaBtn.addEventListener(
        "click",
        function () {

            document
                .querySelector(".journey-section")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


    /* =========================
       INITIAL SETTINGS
    ========================= */

    mapLink.style.display = "none";

});
