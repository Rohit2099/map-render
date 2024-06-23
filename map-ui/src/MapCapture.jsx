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
    const [map, setMap] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const onSearchBoxLoad = (ref) => (searchBoxRef.current = ref);
    const onPlacesChanged = () => {
        const location = searchBoxRef.current.getPlaces()[0].geometry.location;
        const bounds = new window.google.maps.LatLngBounds(location.toJSON());
        setMap(map.fitBounds(bounds));
        console.log(bounds);
    };

    const navigate = useNavigate();

    const onMapLoad = useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map);
        console.log(map);
    }, []);

    const onClick = (e) => {
        console.log("onClick args: ", e, { map });
        console.log(e.latLng.lat() + ", " + e.latLng.lng());
    };

    // const captureRegionImage = async () => {
    //     if (!selectedRegion) return;

    //     const ne = selectedRegion.getNorthEast();
    //     const sw = selectedRegion.getSouthWest();

    //     const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&maptype=roadmap&path=enc:${encodeURI(
    //         `via:${ne.lat()},${ne.lng()}|via:${sw.lat()},${sw.lng()}`
    //     )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;

    //     try {
    //         const response = await axios.post(
    //             "http://localhost:5000/api/captures/upload",
    //             {
    //                 image: staticMapUrl,
    //                 region: selectedRegion.toUrlValue(),
    //             }
    //         );

    //         navigate("/render3d", { state: { staticMapUrl } });
    //     } catch (error) {
    //         console.error("Error capturing region image:", error);
    //     }
    // };

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
        <div className="App">
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
        </div>
    );
};

export default MapCapture;
