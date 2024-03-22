
function main() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, 2, 0.1, 50000);
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector('#canvas1') 
    });

    const arjs = new THREEx.LocationBased(scene, camera);

    // You can change the minimum GPS accuracy needed to register a position - by default 1000m
    //const arjs = new THREEx.LocationBased(scene, camera. { gpsMinAccuracy: 30 } );
    const cam = new THREEx.WebcamRenderer(renderer, '#video1');

    const mouseStep = THREE.MathUtils.degToRad(5);


    let orientationControls = new THREEx.DeviceOrientationControls(camera);
    

    let fake = null;
    let first = true;

    arjs.on("gpsupdate", pos => {
        if(first) {
            setupObjects(pos.coords.longitude, pos.coords.latitude);
            first = false;
        }
    });

    arjs.on("gpserror", code => {
        alert(`GPS error: code ${code}`);
    });

    // Uncomment to use a fake GPS location
    //fake = { lat: 51.05, lon : -0.72 };
    if(fake) {
        arjs.fakeGps(fake.lon, fake.lat);
    } else {
        arjs.startGps();
    } 

    function render(time) {
        resizeUpdate();
        if(orientationControls) orientationControls.update();
        cam.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function resizeUpdate() {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth, height = canvas.clientHeight;
        if(width != canvas.width || height != canvas.height) {
            renderer.setSize(width, height, false);
        }
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    function setupObjects(longitude, latitude) {
        // Use position of first GPS update (fake or real)
        const loader = new THREE.GLTFLoader();
        const car = new THREE.Object3D();
        loader.load(
            "./assets/porsche_gt3_rs/scene.gltf",
            function(gltf){
                car.add(gltf.scene);
                car.scale.set( 5 , 5 , 5 );
                arjs.add(car, 73.70972854625062, 18.5990511789582);
                console.log(car);
            }
        )
    }

    requestAnimationFrame(render);
}

main();
