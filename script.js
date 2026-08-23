function findLocation() {

    const result = document.getElementById("result");

    if (!navigator.geolocation) {

        result.innerHTML = `
            <div class="card">
                ❌ Location is not supported by your browser.
            </div>
        `;

        return;
    }

    result.innerHTML = `
        <div class="card">
            📍 Getting your location...
        </div>
    `;

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const mapURL =
                `https://www.google.com/maps?q=${latitude},${longitude}`;

            result.innerHTML = `
                <div class="card">

                    <h2>📍 Your Current Location</h2>

                    <p>Latitude: ${latitude}</p>

                    <p>Longitude: ${longitude}</p>

                    <a href="${mapURL}" target="_blank">
                        🗺️ Open My Location
                    </a>

                </div>
            `;
        },

        function(error) {

            result.innerHTML = `
                <div class="card">
                    ❌ Please allow location access and try again.
                </div>
            `;

            console.log(error);
        }
    );
}


function findStations() {

    const stations = document.getElementById("stations");

    if (!navigator.geolocation) {

        stations.innerHTML = `
            <div class="card">
                ❌ Location is not supported.
            </div>
        `;

        return;
    }

    stations.innerHTML = `
        <div class="card">
            📍 Finding EV charging stations near you...
        </div>
    `;

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const mapURL =
                `https://www.google.com/maps/search/EV+charging+stations/@${latitude},${longitude},14z`;

            stations.innerHTML = `
                <div class="card">

                    <h2>⚡ Nearby EV Charging Stations</h2>

                    <p>
                        Find charging stations near your current location.
                    </p>

                    <a href="${mapURL}" target="_blank">
                        🗺️ View Nearby Stations
                    </a>

                </div>
            `;
        },

        function(error) {

            stations.innerHTML = `
                <div class="card">
                    ❌ Please allow location access to find nearby stations.
                </div>
            `;

            console.log(error);
        }
    );
}