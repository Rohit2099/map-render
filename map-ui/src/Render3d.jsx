import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    MeshBuilder,
    StandardMaterial,
    Texture,
    HemisphericLight,
    Vector3,
    SpotLight,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import { AuthContext } from "./AuthContext";

const Render3D = () => {
    const location = useLocation();
    const { image } = location.state || {};
    const { token } = useContext(AuthContext);

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
        light.intensity = 0.7;

        const light2 = new HemisphericLight(
            "light",
            new Vector3(-1,-1, 0),
            scene
        );
        light2.intensity = 0.7;

        const spotLight = new SpotLight(
            "spotLight",
            new Vector3(2, 2, 2),
            new Vector3(-1, -1, -1),
            Math.PI / 3,
            2,
            scene
        );
        spotLight.intensity = 0.5;

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

    if (!image) {
        return (
            <label className="block text-sm font-medium text-gray-700 text-center">
                Image invalid
            </label>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
                Map Renderer
            </h2>
            <canvas id="renderCanvas" className="w-full h-96"></canvas>
        </div>
    );
};

export default Render3D;
