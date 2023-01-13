import React, {useCallback, useMemo, useState} from "react";
import {GoogleMap, useJsApiLoader, Marker} from "@react-google-maps/api";
import "./LocationMaps.css";

const containerStyle = {
    width: '100%',
    height: '100%'
};



const LocationMaps = ({handleMapsPopup, setLocation, submitLocation, markerPosition, markerVisibility}) => {
    const center = useMemo(() => ({
        lat: 50.06238352015929,
        lng: 19.934045851482864
    }), []);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDn3aelRR6FsVFR6qmS13J4yEl8qUsVt_A"
        /** This key is going to be changed after I finish working on this part */
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
                        onClick={addPlace}
                        onUnmount={onUnmount}
                    >
                        <Marker
                            position={position}
                            visible={visible} />
                    </GoogleMap>
                    <button
                        onClick={ () => {
                            if (setLocation !== null)
                                setLocation(position)
                            submitLocation()} } >
                        Potwierdź
                    </button>
                </div>
            </div>
    ) : <></>
}

export default LocationMaps;

