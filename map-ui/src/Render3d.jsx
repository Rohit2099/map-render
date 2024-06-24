import { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    MeshBuilder,
    StandardMaterial,
    Texture,
    HemisphericLight,
    Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { AuthContext } from "./AuthContext";

const Render3D = () => {
    const location = useLocation();
    const { image } = location.state || {};
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!image) return;

        const canvas = document.getElementById("renderCanvas");
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);

        const camera = new ArcRotateCamera(
            "Camera",
            Math.PI / 2,
            Math.PI / 2,
            5,
            Vector3.Zero(),
            scene
        );
        camera.attachControl(canvas, true);

        const light = new HemisphericLight(
            "light",
            new Vector3(1, 1, 0),
            scene
        );

        const box = MeshBuilder.CreateBox(
            "box",
            { height: 2, width: 3, depth: 1 },
            scene
        );
        const material = new StandardMaterial("material", scene);
        const texture = new Texture(image, scene);
        texture.url = image;

        material.diffuseTexture = texture;
        box.material = material;

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", () => {
            engine.resize();
        });

        return () => {
            engine.dispose();
        };
    }, [image]);

    if (!token) {
        return (
            <label className="block text-sm font-medium text-gray-700 text-center">
                Login to continue
            </label>
        );
    }

    return (
        <div>
            {image ? (
                <canvas
                    id="renderCanvas"
                    style={{ width: "100%", height: "100vh" }}
                ></canvas>
            ) : (
                <div>No image data provided</div>
            )}
        </div>
    );
};

export default Render3D;
