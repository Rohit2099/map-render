import { useRef, useCallback, useState, useContext } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    StandaloneSearchBox,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext.jsx";

const REACT_APP_GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MapCapture = () => {
    const mapContainerStyle = {
        width: '100%',
        height: '600px'
    };
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const center = {
        lat: 20.5937,
        lng: 78.9629,
    };

    const zoom = 10;

    const searchBoxRef = useRef(null);
    const selectedPosition = useRef(center);

    const [map, setMap] = useState(null);

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
            }
        }
    };

    const onMapLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        mapRef.current = map;

        map.fitBounds(bounds);
        setMap(map);
        console.log(map);
    }, [center]);

    const captureMapImage = async () => {
        const map = mapRef.current;
        const center = map.getCenter();
        const zoom = map.getZoom();
        const details = {
            lat: selectedPosition.current.lat,
            lng: selectedPosition.current.lng,
            zoom: mapRef.current.zoom
        };

        const imageNor= 'https://maps.googleapis.com/maps/api/staticmap?center=${details.lat},${details.lng}&zoom=${details.zoom}&size=600x400&key=${REACT_APP_GOOGLE_MAPS_API_KEY}';
        let image = eval('`'+imageNor+'`');
        try {
            await axios.post(
                "http://localhost:5000/api/captures/upload",
                {
                    latitude: Math.floor(center.lat()),
                    longitude: Math.floor(center.lng()),
                    zoom: zoom,
                    imageUrl: imageNor,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate("/render3d", { state: { image } });
        } catch (error) {
            console.error("Error capturing map image:", error);
        }
    };

    if (!isLoaded) return "Loading Maps";

    if(!token) {
        return (
            <label className="block text-sm font-medium text-gray-700 text-center">Login to continue</label>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center mb-6 text-blue-600">
                    Capture Map
                </h2>
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
                                    className="block w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                    <button
                        onClick={captureMapImage}
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Capture Region
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapCapture;
