<template>
	<div v-if="isInputing">
		<input
			type="number"
			ref="input"
			:value="scoreX10 / 10"
			@keydown.enter="updateScore"
			max="10.9"
			min="0"
			step="0.1"
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

			//value control
			let inputScore = parseInt(this.$refs.input.value * 10)
			if (inputScore < 0) {
				inputScore = 0
			} else if (inputScore > 109) {
				inputScore = 109
			}

			// update score
			this.$emit("scoreX10Updated", inputScore)
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
