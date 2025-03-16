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
				scores: [],
			})
			this.newName = ""
		},

		_updateUsers() {
			this._updateTotalScores()
			this._updateRanks()
		},

		_updateTotalScores() {
			this.users.forEach((user) => {
				user.totalScore = 0
				user.scores.forEach((score) => {
					user.totalScore += score
				})
			})
		},

		_updateRanks() {
			//sort total scores
			//larger first
			let totalScores = []
			this.users.forEach((user) => {
				totalScores.push(user.totalScore)
			})
			totalScores.sort((a, b) => b - a)

			// create totalScore -> rank dictionary
			let scoreToRank = {}
			for (let cnt = 0; cnt < totalScores.length; cnt++) {
				if (scoreToRank[totalScores[cnt]] === undefined) {
					scoreToRank[totalScores[cnt]] = cnt + 1
				}
			}

			// assign rank
			this.users.forEach((user) => {
				user.rank = scoreToRank[user.totalScore]
			})
		},
	},

	watch: {
		users: {
			handler() {
				this._updateUsers()
			},
			deep: true,
		},
	},
}
</script>
