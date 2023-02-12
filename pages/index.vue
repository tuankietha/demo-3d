<template>
	<div style="height: 100vh; width: 100vw; position: relative">
		<v-sheet height="100%" width="100%" class="pa-10" color="black" style="position: absolute">
			<instruction-player ref="player" border-radius="50px" src="../mercedes_benz_sl-65_amg_-_low_poly.glb" />
		</v-sheet>
		<div style="height: 100%; width: 100%; position: absolute" class="pointer-events-none">
			<div class="d-flex flex-column justify-center pointer-events-none" style="height: 100%;">
				<v-card height="50px" width="50px" color="red" class="ma-2 pointer-events-auto" @click="red" />
				<v-card height="50px" width="50px" color="green" class="ma-2 pointer-events-auto" @click="greeen" />
				<v-card height="50px" width="50px" color="#f1c232" class="ma-2 pointer-events-auto" @click="yellow" />
				<v-card height="50px" width="50px" color="white" class="ma-2 pointer-events-auto" @click="white" />
				<v-card height="50px" width="50px" color="black" class="ma-2 pointer-events-auto" @click="black" />
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "IndexPage",
	methods: {
		red () {
			const mesh = this.$refs.player.scene.getObjectByName("Cylinder_34_0");

			mesh.material.color.r = 244;
			mesh.material.color.g = 1;
			mesh.material.color.b = 1;
			mesh.material.envMapIntensity = 0;
		},
		greeen () {
			const mesh = this.$refs.player.scene.getObjectByName("Cylinder_34_0");

			mesh.material.color.r = 1;
			mesh.material.color.g = 100;
			mesh.material.color.b = 5;
			mesh.material.envMapIntensity = 0;
		},
		white () {
			const mesh = this.$refs.player.scene.getObjectByName("Cylinder_34_0");

			mesh.material.color.r = 255;
			mesh.material.color.g = 255;
			mesh.material.color.b = 255;
			mesh.material.envMapIntensity = 0;
		},
		yellow () {
			const mesh = this.$refs.player.scene.getObjectByName("Cylinder_34_0");

			mesh.material.color.r = 100;
			mesh.material.color.g = 100;
			mesh.material.color.b = 1;
			mesh.material.envMapIntensity = 0;
		},
		black () {
			const mesh = this.$refs.player.scene.getObjectByName("Cylinder_34_0");

			mesh.material.color.r = 1;
			mesh.material.color.g = 1;
			mesh.material.color.b = 1;
			mesh.material.envMapIntensity = 1;
		}
	}
};
</script>
