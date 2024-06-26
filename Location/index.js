
function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50000);
    const ambientLight = new THREE.AmbientLight(4);
    scene.add(ambientLight);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#canvas1')
    });

    const arjs = new THREEx.LocationBased(scene, camera, { gpsMinAccuracy: 5 });
    const cam = new THREEx.WebcamRenderer(renderer, '#video1');

    let orientationControls = new THREEx.DeviceOrientationControls(camera);

    let first = true;
    arjs.on("gpsupdate", pos => {
        if (first) {
            setupObjects(pos.coords.longitude, pos.coords.latitude);
            first = false;
            console.log(pos.coords.longitude, pos.coords.latitude);
        }
    });

    arjs.startGps();

    function render(time) {
        resizeUpdate();
        if (orientationControls) orientationControls.update();
        cam.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function resizeUpdate() {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth, height = canvas.clientHeight;
        if (width != canvas.width || height != canvas.height) {
            renderer.setSize(width, height, false);
        }
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    function setupObjects(longitude, latitude) {
        const loader = new THREE.GLTFLoader();
        const car = new THREE.Object3D();
        // Load a glTF resource 
        loader.load(
            // resource URL
            './assets/porsche_gt3_rs/scene.gltf',
            // called when the resource is loaded
            function (gltf) {
                car.add(gltf.scene);
                car.scale.set(5, 5, 5);
                arjs.add(car, 73.70964976378225, 18.598778400398864);
                console.log(car);
            },
        )
    }

    requestAnimationFrame(render);
}

main();
