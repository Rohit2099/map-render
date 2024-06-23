import { useRef, useCallback, useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    DrawingManager,
    StandaloneSearchBox,
    LoadScript,
} from "@react-google-maps/api";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

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

    const captureStreetViewImage = async () => {
        const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${selectedPosition.lat},${selectedPosition.lng}&fov=80&heading=70&pitch=0&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

        try {
            const response = await axios.post(
                "http://localhost:5000/api/captures/upload",
                {
                    image: streetViewUrl,
                    region: `${selectedPosition.lat},${selectedPosition.lng}`,
                }
            );

            navigate("/render3d", { state: { streetViewUrl } });
        } catch (error) {
            console.error("Error capturing Street View image:", error);
        }
    };

    // const [map, setMap] = useState(null);
    //
    // const onLoad = useCallback(function callback(map) {
    //     // This is just an example of getting and using the map instance!!! don't just blindly copy!
    //     const bounds = new window.google.maps.LatLngBounds(center);
    //     map.fitBounds(bounds);
    //     mapRef.current = map;

    //     setMap(map);
    // }, []);

    // const onUnmount = useCallback(function callback(map) {
    //     setMap(null);
    // }, []);

    // const captureMapImage = () => {
    //     const map = mapRef.current;
    //     // const center = map.getCenter();
    //     // const zoom = map.getZoom();
    //     // const size = { width: 640, height: 640 };
    //     // const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat()},${center.lng()}&zoom=${zoom}&size=${size.width}x${size.height}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`;
    //     const center = map.getCenter();
    //     const location = `${center.lat()},${center.lng()}`;
    //     const size = "600x400"; // Size for the static street view image
    //     const fov = 90; // Field of view
    //     const staticStreetViewUrl = `https://maps.googleapis.com/maps/api/streetview?location=${location}&size=${size}&fov=${fov}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`;

    //     const image = staticStreetViewUrl;
    //     // const image = canvas.toDataURL("image/png");

    //     // Send image to backend
    //     // const formData = new FormData();
    //     // formData.append('image', image);
    //     // formData.append('region', `${mapRef.current.getBounds().toUrlValue()}`);

    //     // axios.post('http://localhost:5000/api/captures/upload', formData)
    //     //   .then(response => console.log(response.data))
    //     //   .catch(error => console.error(error));

    //     navigate("/render3d", { state: { image } });
    // };

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
                <button onClick={captureStreetViewImage}>Capture Region</button>
            </div>
        </div>
    );
};

export default MapCapture;
