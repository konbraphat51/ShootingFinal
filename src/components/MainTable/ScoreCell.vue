<template>
	<div v-if="isInputing">
		<input type="number" />
		<button @click="isInputing = false">
			{{ $t("ScoreCell.done") }}
		</button>
	</div>
	<div v-else @click="isInputing = true">
		{{ scoreX10 / 10 }}
	</div>
</template>

<script>
export default {
	name: "ScoreCell",
	props: {
		scoreX10: Number,
	},
	data() {
		return {
			isInputing: false,
		}
	},
	methods: {},
	i18n: {
		messages: {
			en: {
				ScoreCell: {
					done: "Done",
				},
			},
			ja: {
				ScoreCell: {
					done: "完了",
				},
			},
		},
	},
}
</script>
