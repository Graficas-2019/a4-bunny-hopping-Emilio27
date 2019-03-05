var renderer = null,
    scene = null,
    camera = null,
    root = null,
    group = null,
    conejo = null,
    directionalLight = null;
    duration = 10,
    crateAnimator = null,
    lightAnimator = null,
    loopAnimation = true,
    objLoader = null;
    
var animateCrate = true,
    nowTime = Date.now(),
    index = [17];


function loadObj() {
    if (!objLoader)
        objLoader = new THREE.OBJLoader();

    objLoader.load(
        'Stanford_Bunny_OBJ-JPG/20180310_KickAir8P_UVUnwrapped_Stanford_Bunny.obj',

        function (object) {
            var texture = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_g005c.jpg');
            var normalMap = new THREE.TextureLoader().load('Stanford_Bunny_OBJ-JPG/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    child.material.normalMap = normalMap;
                }
            });

            conejo = object;
            conejo.scale.set(3, 3, 3);
            conejo.position.z = 0;
            conejo.position.x = 0;
            conejo.rotation.x = 0;
            conejo.rotation.y = Math.PI / 2;
            group.add(conejo);
        },
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        });
}

function run() {
    requestAnimationFrame(function () { run(); });

    // Render the scene
    renderer.render(scene, camera);

    // Update the animations
    KF.update();

    // Update the camera controller
    orbitControls.update();
}

function createScene(canvas) {

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera.position.set(20, 10, 0);
    scene.add(camera);

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    // Create and add all the lights
    directionalLight.position.set(0, 1, 2);
    root.add(directionalLight);

    ambientLight = new THREE.AmbientLight(0x888888);
    root.add(ambientLight);

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create grass texture map
    var pastoM = new THREE.TextureLoader().load("img/pasto.jpg");
    pastoM.wrapS = pastoM.wrapT = THREE.RepeatWrapping;
    pastoM.repeat.set(5, 5);

    var color = 0xffffff;
    var ambient = 0x888888;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var pasto2 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, map: pastoM, side: THREE.DoubleSide }));
    pasto2.rotation.x = -Math.PI / 2;

    // Add the mesh to our group
    scene.add(pasto2);

    loadObj();
    scene.add(root);

}

function playAnimations() {

    // position animation
    if (crateAnimator)
        crateAnimator.stop();

    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);

    if (animateCrate) {

        crateAnimator = new KF.KeyFrameAnimator;
        crateAnimator.init({
            interps:
                [
                    {
                        keys: [0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375,1],
                        values: [

                            { x: 0, y: 0, z: 0 },
                            { x: 1, y: 1, z: Math.PI * 0.47 },
                            { x: 2, y: 0, z: Math.PI * 0.64 },
                            { x: 3, y: 1, z: Math.PI * 0.47 },
                            { x: 4, y: 0, z: 0 },
                            { x: 3, y: 1, z: Math.PI * (-0.47) },
                            { x: 2, y: 0, z: Math.PI * (-0.64) },
                            { x: 1, y: 1, z: Math.PI * (-0.47) },
                            { x: 0, y: 0, z: 0 },
                            { x: -1, y: 1, z: Math.PI * 0.47 },
                            { x: -2, y: 0, z: Math.PI * 0.64 },
                            { x: -3, y: 1, z: Math.PI * 0.47 },
                            { x: -4, y: 0, z: 0 },
                            { x: -3, y: 1, z: Math.PI * (-0.47) },
                            { x: -2, y: 0, z: Math.PI * (-0.64) },
                            { x: -1, y: 1, z: Math.PI * (-0.47) },
                            { x: 0, y: 0, z: 0 },

                        ],
                        target: group.position
                    },
                    {
                        keys: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                        values: [

                            { y: 0 },
                            { y: Math.PI / 2 },
                            { y: 2 * Math.PI / 2 },
                            { y: 3 * Math.PI / 2 },
                            { y: 4 * Math.PI / 2 },
                            { y: 3 * Math.PI / 2 },
                            { y: 2 * Math.PI / 2 },
                            { y: 1 * Math.PI / 2 },
                            { y: 0 * Math.PI / 2 },
                        ],
                        target: group.rotation
                    }
                ],

            loop: loopAnimation,
            duration: duration * 1000,
            easing: TWEEN.Easing.Linear.None,
        });
        crateAnimator.start();

    }

}