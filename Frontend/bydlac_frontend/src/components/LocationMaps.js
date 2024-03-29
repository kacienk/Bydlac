import React, {useCallback, useMemo, useState} from "react";
import {GoogleMap, useJsApiLoader, Marker} from "@react-google-maps/api";

import "./LocationMaps.css";

//require("dotenv").config();

const containerStyle = {
    width: '100%',
    height: '100%'
};

/**
 * Custom Component which represents Google Maps popup and lets User choose location to send
 * @param handleMapsPopup function to close popup
 * @param setLocation function to set location in parent Component
 * @param submitLocation function to submit location in parent Component
 * @param markerPosition marker position
 * @param markerVisibility marker visibility
 * @returns {JSX.Element} popup which represents maps and buttons to submit location (if needed) and close popup
 */
const LocationMaps = ({handleMapsPopup, setLocation, submitLocation, markerPosition, markerVisibility}) => {
    const center = useMemo(() => ({
        lat: 50.06238352015929,
        lng: 19.934045851482864
    }), []);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    })

    const [map, setMap] = useState(null)
    const onLoad = useCallback((map) => { setMap(map) }, [])
    const onUnmount = useCallback(() => { setMap(null) }, [])

    const [position, setPosition] = useState(markerPosition)
    const [visible, setVisible] = useState(markerVisibility)
    const addPlace = (position) => {
        setPosition({lat: position.latLng.lat(), lng: position.latLng.lng()})
        setVisible(true)
    }

    return isLoaded ? (
            <div id="mapsPopupBackground">
                <div id="mapsPopup">
                    <button id="closePopupButton"
                            onClick={ handleMapsPopup }>
                        X
                    </button>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={13}
                        onLoad={onLoad}
                        onClick={(pos) => {
                            if (setLocation !== null) {
                                addPlace(pos)
                                setLocation({lat: pos.latLng.lat(), lng: pos.latLng.lng()})
                            }
                        }}
                        onUnmount={onUnmount} >
                        <Marker
                            position={position}
                            visible={visible} />
                    </GoogleMap>
                    { setLocation !== null ?
                        <button className="submitLocation"
                            onClick={() => {
                                submitLocation()
                            }}>
                            Potwierdź
                        </button> : null }
                </div>
            </div>
    ) : <></>
}

export default LocationMaps;

