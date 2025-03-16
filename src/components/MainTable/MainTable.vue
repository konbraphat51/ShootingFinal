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

			<th v-for="cnt in scoreNums" :key="cnt">
				{{ cnt }}
			</th>
		</tr>
		<tr v-for="user in users">
			<td>
				{{ user.name }}
			</td>
			<td>
				{{ user.rank }}
			</td>
			<td>
				{{ user.totalScore }}
			</td>
			<td v-for="(score, cnt) in user.scores">
				<ScoreCell
					:scoreX10="score"
					@scoreX10Updated="(score) => _onScoreUpdated(user, cnt, score)"
				/>
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
					user.totalScore += score
				})
			})
		},

		_fillEmptyScores() {
			this.users.forEach((user) => {
				while (user.scores.length < this.scoreNums) {
					user.scores.push(0)
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
