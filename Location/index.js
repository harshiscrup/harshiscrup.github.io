
function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#canvas1')
    });

    // const geom = new THREE.BoxGeometry(20, 20, 20);

    const arjs = new THREEx.LocationBased(scene, camera);

    // You can change the minimum GPS accuracy needed to register a position - by default 1000m
    //const arjs = new THREEx.LocationBased(scene, camera. { gpsMinAccuracy: 30 } );
    const cam = new THREEx.WebcamRenderer(renderer, '#video1');

    const mouseStep = THREE.MathUtils.degToRad(5);


    let orientationControls;

    // Orientation controls only work on mobile device
    if (isMobile()) {
        orientationControls = new THREEx.DeviceOrientationControls(camera);
    }

    let fake = null;
    let first = true;

    arjs.on("gpsupdate", pos => {
        if (first) {
            setupObjects(pos.coords.longitude, pos.coords.latitude);
            first = false;
            console.log(pos.coords.longitude, pos.coords.latitude)
        }
    });

    arjs.on("gpserror", code => {
        alert(`GPS error: code ${code}`);
    });

    // Uncomment to use a fake GPS location
    //fake = { lat: 51.05, lon : -0.72 };
    if (fake) {
        arjs.fakeGps(fake.lon, fake.lat);
        console.log("fake")
    } else {
        arjs.startGps();
        console.log("og")
    }


    let mousedown = false, lastX = 0;

    // Mouse events for testing on desktop machine
    if (!isMobile()) {
        window.addEventListener("mousedown", e => {
            mousedown = true;
        });

        window.addEventListener("mouseup", e => {
            mousedown = false;
        });

        window.addEventListener("mousemove", e => {
            if (!mousedown) return;
            if (e.clientX < lastX) {
                camera.rotation.y += mouseStep;
                if (camera.rotation.y < 0) {
                    camera.rotation.y += 2 * Math.PI;
                }
            } else if (e.clientX > lastX) {
                camera.rotation.y -= mouseStep;
                if (camera.rotation.y > 2 * Math.PI) {
                    camera.rotation.y -= 2 * Math.PI;
                }
            }
            lastX = e.clientX;
        });
    }

    function isMobile() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // true for mobile device
            return true;
        }
        return false;
    }

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
        // Use position of first GPS update (fake or real)
        // const material = new THREE.MeshBasicMaterial({color: 0xff0000});
        // const material2 = new THREE.MeshBasicMaterial({color: 0xffff00});
        // const material3 = new THREE.MeshBasicMaterial({color: 0x0000ff});
        // const material4 = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const loader = new THREE.GLTFLoader();
        const car = new THREE.Object3D();
        // Load a glTF resource 
        loader.load(
            // resource URL
            'assets/McLaren.glb',
            // called when the resource is loaded
            function (gltf) {
                car.add(gltf.scene);
                // arjs.add(gltf.arjs); // slightly north
                car.scale.set(10, 10, 10);
                // car.position.set(longitude, latitude + 0.001)
<<<<<<< HEAD
                arjs.add(car, longitude, latitude + 0.001);
=======
                arjs.add(car, 73.70989299972658, 18.599066083161183)
>>>>>>> c35687458d0a95ab40c1b5fd59c9518091c68f69
                // arjs.add(gltf.arjs, longitude, latitude - 0.001); // slightly south
                // arjs.add(gltf.arjs, longitude - 0.001, latitude); // slightly west
                // arjs.add(gltf.arjs, longitude + 0.001, latitude); // slightly east
                console.log(car);
            },
        )
        console.log(car);

    }

    requestAnimationFrame(render);
}

main();
