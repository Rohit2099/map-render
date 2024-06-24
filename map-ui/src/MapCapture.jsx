import { useRef, useCallback, useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    DrawingManager,
    StandaloneSearchBox,
    LoadScript,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const REACT_APP_GOOGLE_MAPS_API_KEY = "AIzaSyBPNDwcXIX6yYDnl3cELoFg9qzhdUW3NMs";

const MapCapture = () => {
    const mapContainerStyle = {
        height: "80vh",
        width: "100vw",
    };

    const center = {
        lat: 40.75378,
        lng: -73.55658,
    };

    const zoom = 10;

    const searchBoxRef = useRef(null);
    const selectedPosition = useRef(center);

    const [map, setMap] = useState(null);
    const zoomRef = useState(8);

    const mapRef = useRef();

    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const onSearchBoxLoad = (ref) => (searchBoxRef.current = ref);
    const onPlacesChanged = () => {
        const places = searchBoxRef.current.getPlaces();
        const place = places[0];

        if (place) {
            const { geometry } = place;
            const location = geometry.location;
            selectedPosition.current = {
                lat: location.lat(),
                lng: location.lng(),
            };
            if (geometry.viewport) {
                mapRef.current.fitBounds(geometry.viewport);
            } else {
                mapRef.current.setCenter(geometry.location);
                mapRef.current.setZoom(14);
                zoomRef.current = 14;
            }
        }
    };

    const navigate = useNavigate();

    const onMapLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        mapRef.current = map;

        map.fitBounds(bounds);
        setMap(map);
        console.log(map);
    }, []);

    const onClick = (e) => {
        console.log("onClick args: ", e, { map });
        console.log(e.latLng.lat() + ", " + e.latLng.lng());
    };

    const captureMapImage = async () => {
        const map = mapRef.current;
        const center = map.getCenter();
        const zoom = map.getZoom();
        const size = mapContainerStyle;
    
        const image = `https://maps.googleapis.com/maps/api/staticmap?center=${selectedPosition.current.lat},${selectedPosition.current.lng}&zoom=${mapRef.current.zoom}&size=600x400&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`;
    
        try {
    
          await axios.post('http://localhost:5000/api/captures/upload', {
            latitude: center.lat(),
            longitude: center.lng(),
            zoom: zoom,
            imagePath: image
          });
    
          navigate('/render3d', { state: { image } });
        } catch (error) {
          console.error('Error capturing map image:', error);
        }
      };


    if (!isLoaded) return "Loading Maps";

    return (
        <div className="map-container">
            <div>
                {isLoaded && (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={zoom}
                        center={center}
                        onLoad={onMapLoad}
                        onClick={onClick}
                    >
                        <StandaloneSearchBox
                            onLoad={onSearchBoxLoad}
                            onPlacesChanged={onPlacesChanged}
                        >
                            <input
                                type="text"
                                placeholder="Enter your location"
                                style={{
                                    boxSizing: `border-box`,
                                    border: `1px solid transparent`,
                                    width: `240px`,
                                    height: `32px`,
                                    padding: `0 12px`,
                                    borderRadius: `3px`,
                                    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                                    fontSize: `14px`,
                                    outline: `none`,
                                    textOverflow: `ellipses`,
                                    position: "absolute",
                                    left: "50%",
                                    marginLeft: "-120px",
                                }}
                            />
                        </StandaloneSearchBox>
                    </GoogleMap>
                )}
                <button onClick={captureMapImage}>Capture Region</button>
            </div>
        </div>
    );
};

export default MapCapture;
