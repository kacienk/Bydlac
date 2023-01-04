import React, {useCallback, useState} from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const LocationMaps = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "API_KEY"
        /** Insert api key from https://console.cloud.google.com/apis/credentials/key - I'm not gonna put it on GitHub */
    })

    const [map, setMap] = useState(null)

    const onLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            { /* Child components, such as markers, info windows, etc. */ }
            <></>
        </GoogleMap>
    ) : <h1>Coś poszło nie tak :c</h1>
}

export default LocationMaps;

