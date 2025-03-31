<template>
	<select @change="onChanged" ref="selector">
		<option value="RANK" selected="selected">
			{{ $t("SortSelector.sortByRank") }}
		</option>
		<option value="NAME">{{ $t("SortSelector.sortByName") }}</option>
	</select>
</template>

<script>
export default {
	name: "SortSelector",
	onMounted() {
		// set initial value
		this.onChanged()
	},
	methods: {
		changeSorting(sortingType) {
			if (sortingType === "RANK") {
				this.$emit("sortChanged", "RANK")
			} else if (sortingType === "NAME") {
				this.$emit("sortChanged", "NAME")
			}
		},

		onChanged(event) {
			const sortingType = this.$refs.selector.value
			this.changeSorting(sortingType)
		},
	},
	i18n: {
		messages: {
			en: {
				SortSelector: {
					sortByRank: "Sort by Rank",
					sortByName: "Sort by Name",
				},
			},
			ja: {
				SortSelector: {
					sortByRank: "順位順",
					sortByName: "名前順",
				},
			},
		},
	},
}
</script>
