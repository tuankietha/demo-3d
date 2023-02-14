<template>
	<v-layout
		id="player3d"
		ref="player3d"
		v-resize="onWindowResize"
		:style="`height: 100%; width: 100%; border-radius: ${borderRadius ? borderRadius : '0px'}`"
		@click="toggleClick($event)"
	/>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "../node_modules/three/examples/jsm/controls/TransformControls.js";
import { RoomEnvironment } from "../node_modules/three/examples/jsm/environments/RoomEnvironment.js";
class Asset {
	constructor (meshes) {
		this.meshes = meshes;
	}
}
export default {
	props: {
		borderRadius: {
			type: String,
			default: undefined
		},
		src: {
			type: String,
			default: undefined
		}
	},
	data: function () {
		return {
			camera: null,
			scene: null,
			renderer: null,
			gltf: null,
			orbitControls: null,
			transformControls: null,
			assets: [],
			gltfName: "",
			objectMesh: null,
			box: null,
			mesh: undefined
		};
	},
	mounted () {
		const container = this.$refs.player3d;

		this.camera = new THREE.PerspectiveCamera(
			45,
			this.$refs.player3d.clientWidth / this.$refs.player3d.clientHeight,
			0.01,
			2000
		);

		this.camera.focus = 100;
		this.camera.position.set(0, 2, 2);

		this.scene = new THREE.Scene();

		const color = 0xFFFFFF;
		const intensity = 1;
		const light = new THREE.PointLight(color, intensity);

		light.position.set(0, 10, 0);
		this.scene.add(light);

		const lightAmbient = new THREE.AmbientLight(0xFFFFFF); // soft white light

		this.scene.add(lightAmbient);

		const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);

		this.scene.add(directionalLight);

		this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
		this.renderer.setClearColor("#ffffff");
		this.renderer.setSize(
			this.$refs.player3d.clientWidth,
			this.$refs.player3d.clientHeight
		);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.toneMapping = THREE.ReinhardToneMapping;
		this.renderer.gammaFactor = 1.5;
		this.renderer.gammaOutput = true;
		this.renderer.setClearColor(0xFFFFFF, 1);

		const pmremGenerator = new THREE.PMREMGenerator(this.renderer);

		this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

		container.appendChild(this.renderer.domElement);

		this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
		this.orbitControls.addEventListener("change", () =>
			this.renderer.render(this.scene, this.camera)
		);

		this.transformControls = new TransformControls(
			this.camera,
			this.renderer.domElement
		);
		this.scene.add(this.transformControls);

		this.loadGLTF(this.src);
		this.animate();

		this.$refs.player3d.children[0].style.borderRadius = this.borderRadius || "0px";
		
		const raycaster = new THREE.Raycaster();
		const clickMouse = new THREE.Vector2();
		
		// window.addEventListener('click',event =>{
		// 	clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		// 	clickMouse.y = -(event.clientX / window.innerHeight) * 2 + 1;
		// 	raycaster.setFromCamera( clickMouse, this.camera);
		// 	const find = raycaster.intersectObjects(this.scene.children);
			
		// 	console.log(find.length);
			
		// })
	},

	methods: {
		toggleClick (event) {
			const raycaster = new THREE.Raycaster();
			const mouse = new THREE.Vector2();

			event.preventDefault();

			mouse.x =
				((event.clientX - this.$refs.player3d.getBoundingClientRect().x) /
					this.$refs.player3d.clientWidth) *
					2 -
				1;
			mouse.y =
				-(
					(event.clientY - this.$refs.player3d.getBoundingClientRect().y) /
					this.$refs.player3d.clientHeight
				) *
					2 +
				1;

			raycaster.setFromCamera(mouse, this.camera);

			const meshes = this.assets
				.map((asset) => {
					return asset.meshes;
				})
				.flat();

			const intersects = raycaster.intersectObjects(meshes, true);
			 
			if (intersects[0] !== undefined) {
				this.objectMesh = intersects[0];
				// this.transformControls.attach(intersects[0].object);
				intersects[0].object.traverseAncestors((ancestors) => {
					if (ancestors.userData.asset !== undefined) {
						this.objectMesh = ancestors.userData.asset.meshes[0].children[0].children;

						this.gltfName = ancestors.userData.asset.name;
					}
				});
			}

			intersects.forEach(item =>{
				this.mesh = item.object.name
				// console.log(item.object.name)
			})
		},
		loadGLTF (gltfArrayBuffer) {
			const loader = new GLTFLoader();

			loader.load(
				gltfArrayBuffer,
				gltf => this.loadfile(gltf),
				function (xhr) {},
				function (error) {
					// eslint-disable-next-line no-console
					console.log("An error happened" + error);
				}
			);
		},
		loadfile (gltf) {
			this.scene.remove(this.scene.getObjectByName("New"));
			// eslint-disable-next-line array-callback-return
			gltf.scenes.map((scene) => {
				this.scene.name = "New";
				this.scene.add(scene);
				const asset = new Asset(gltf.scene.children);

				this.assets.push(asset);

				scene.children.forEach((mesh) => {
					mesh.userData = { ...mesh.userData, asset };
				});

				// this.transformControls.attach(scene);
				this.fitCameraToCenteredObject(scene, 1);
				this.renderer.render(this.scene, this.camera);
			});

			this.animate();
		},

		animate () {
			requestAnimationFrame(this.animate);
			this.renderer.render(this.scene, this.camera);
		},
		fitCameraToCenteredObject (object, offset) {
			const boundingBox = new THREE.Box3();

			boundingBox.setFromObject(object);
			const middle = new THREE.Vector3();
			const size = new THREE.Vector3();

			boundingBox.getSize(size);
			boundingBox.getCenter(middle);

			const fov = this.camera.fov * (Math.PI / 180);
			const fovh = 2 * Math.atan(Math.tan(fov / 2) * this.camera.aspect);
			const dx = size.z / 2 + Math.abs(size.x / 2 / Math.tan(fovh / 2));
			const dy = size.z / 2 + Math.abs(size.y / 2 / Math.tan(fov / 2));
			let cameraZ = Math.max(dx, dy);

			// offset the camera, if desired (to avoid filling the whole canvas)
			if (offset !== undefined && offset !== 0) { cameraZ *= offset; }

			this.camera.position.set(-cameraZ, cameraZ, cameraZ);

			// set the far plane of the camera so that it easily encompasses the whole object
			const minZ = boundingBox.min.z;
			const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;

			this.camera.far = cameraToFarEdge * 3;
			this.camera.lookAt(middle.x, middle.y, middle.z);
			if (cameraZ > 10000) {
				this.camera.near = 10;
				this.camera.far = 100000;
			}
			this.camera.updateProjectionMatrix();
			if (this.orbitControls !== undefined) {
				// set camera to rotate around the center
				this.orbitControls.target = new THREE.Vector3(middle.x, middle.y, middle.z);

				// prevent camera from zooming out far enough to create far plane cutoff
				this.orbitControls.maxDistance = cameraToFarEdge * 2;
			}
		},
		onWindowResize () {
			// updateCameraAspect
			this.$nextTick(function () {
				if (this.camera) {
					this.camera.aspect = this.$refs.player3d.clientWidth / this.$refs.player3d.clientHeight;
					this.camera.updateProjectionMatrix();
				}
				// updateRenderSize
				if (this.renderer) {
					this.renderer.setSize(
						this.$refs.player3d.clientWidth,
						this.$refs.player3d.clientHeight
					);
				}
			});
		}
	}
};
</script>
