<template>
	<div v-if="isInputing">
		<input
			type="number"
			ref="input"
			:value="scoreX10 / 10"
			@input="updateScore"
		/>
		<button @click="updateScore">
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
	methods: {
		updateScore() {
			// switch mode
			this.isInputing = false

			// update score
			this.$emit("scoreX10Updated", this.$refs.input.value * 10)
		},
	},
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
