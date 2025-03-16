<template>
	<div class="MainTable">
		<tr>
			<th>
				{{ $t("MainTable.name") }}
			</th>
			<th>
				{{ $t("MainTable.rank") }}
			</th>
			<th>
				{{ $t("MainTable.totalScore") }}
			</th>
		</tr>
		<tr v-for="user in users" :key="cnt">
			<td>
				{{ user.name }}
			</td>
			<td>
				{{ user.rank }}
			</td>
			<td>
				{{ user.totalScore }}
			</td>
		</tr>
		<tr class="AddingRow">
			<td>
				<input type="text" v-model="newName" />
			</td>
			<td>
				<button @click="addUser">
					{{ $t("MainTable.addUser") }}
				</button>
			</td>
		</tr>
	</div>
</template>

<script>
export default {
	name: "MainTable",
	i18n: {
		messages: {
			en: {
				MainTable: {
					name: "Name",
					rank: "Rank",
					totalScore: "Total Score",
					addUser: "Add",
				},
			},
			ja: {
				MainTable: {
					name: "名前",
					rank: "順位",
					totalScore: "合計",
					addUser: "追加",
				},
			},
		},
	},
	data() {
		return {
			newName: "",
			users: [],
		}
	},
	methods: {
		addUser() {
			this.users.push({
				name: this.newName,
				rank: 0,
				totalScore: 0,
			})
			this.newName = ""
		},
	},
}
</script>
