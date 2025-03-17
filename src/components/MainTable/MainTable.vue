<template>
	<div class="MainTable">
		<table>
			<tr>
				<th class="Fixed Delete"></th>
				<th class="Fixed Name">
					{{ $t("MainTable.name") }}
				</th>
				<th class="Fixed Rank">
					{{ $t("MainTable.rank") }}
				</th>
				<th class="Fixed TotalScore">
					{{ $t("MainTable.totalScore") }}
				</th>

				<th class="Score" v-for="cnt in scoreNums" :key="cnt">
					{{ cnt }}
				</th>
			</tr>
			<tr v-for="user in users">
				<td class="Fixed Delete">
					<img src="/src/assets/delete.svg" @click="deleteUser(user)" />
				</td>
				<td class="Fixed Name">
					{{ user.name }}
				</td>
				<td class="Fixed Rank">
					{{ user.rank }}
				</td>
				<td class="Fixed TotalScore">
					{{ user.totalScore / 10 }}
				</td>
				<td class="Score" v-for="(score, cnt) in user.scores">
					<ScoreCell
						:scoreX10="score"
						@scoreX10Updated="(score) => _onScoreUpdated(user, cnt, score)"
					/>
				</td>
			</tr>
			<tr class="AddingRow">
				<td class="Fixed Delete"></td>
				<td class="Fixed Name">
					<input type="text" v-model="newName" />
				</td>
				<td class="Fixed Rank">
					<button @click="addUser">
						{{ $t("MainTable.addUser") }}
					</button>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
import ScoreCell from "./ScoreCell.vue"

export default {
	name: "MainTable",
	components: {
		ScoreCell,
	},
	data() {
		return {
			newName: "",
			users: [],
			scoreNums: 0,
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

			this._onUserNumsChanged()
		},

		deleteUser(user) {
			this.users = this.users.filter((u) => u !== user)

			this._onUserNumsChanged()
		},

		_onUserNumsChanged() {
			this.scoreNums = 2 * (this.users.length - 1) + 10
			this._updateUsers()
		},

		_updateUsers() {
			this._updateTotalScores()
			this._updateRanks()
			this._fillEmptyScores()
		},

		_updateTotalScores() {
			this.users.forEach((user) => {
				user.totalScore = 0
				user.scores.forEach((score) => {
					//exclude unentered scores
					if (score != -1) {
						user.totalScore += score
					}
				})
			})
		},

		_fillEmptyScores() {
			this.users.forEach((user) => {
				while (user.scores.length < this.scoreNums) {
					user.scores.push(-1)
				}
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

		_onScoreUpdated(user, cnt, score) {
			user.scores[cnt] = score
			this._updateUsers()
		},
	},
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
}
</script>

<style scoped>
.MainTable {
	overflow-x: auto;
	width: 100%;
}

table {
	table-layout: fixed;

	width: 100%;
	border-collapse: collapse;
	margin: 25px 0;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

th,
td {
	border-right: 1px solid #8a8a8a;
}

table tr:nth-child(odd):not(.AddingRow) td {
	background-color: #dadada;
}

th.Score {
	background-color: #c4e7ff;
}

.Score {
	width: 100px;
}

.Fixed {
	position: sticky;
}

th.Fixed {
	background-color: rgb(204, 248, 233);
}

td.Fixed {
	background-color: rgb(255, 255, 255);
}

.Delete {
	width: 50px;
	left: 0;
}

.Name {
	width: 200px;
	left: 50px;
}

.Rank {
	width: 50px;
	left: 250px;
}

.TotalScore {
	width: 50px;
	left: 300px;
}

.AddingRow {
	background-color: #ffb7b7;
	td {
		background-color: #ffb7b7;
		border-right: none;
	}
}
</style>
