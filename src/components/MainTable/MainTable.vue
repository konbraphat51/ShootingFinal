<template>
	<div class="MainTable">
		<SortSelector @sortChanged="onSortTypeChanged" />
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
				<th class="Fixed Diff">
					{{ $t("MainTable.diff") }}
				</th>

				<th
					class="Score"
					v-for="cnt in scoreNums"
					:key="cnt"
					:class="{Filled: columnFilleds[cnt - 1]}"
				>
					{{ cnt }}
				</th>
			</tr>
			<tr class="Highscore">
				<td class="Fixed Delete"></td>
				<td class="Fixed Name">
					{{ $t("MainTable.highscore") }}
				</td>
				<td class="Fixed Rank"></td>
				<td class="Fixed TotalScore">
					{{
						// find the first user with rank 1 and return their totalScore
						(() => {
							for (let cnt = 0; cnt < this.users.length; cnt++) {
								if (this.users[cnt].rank === 1) {
									return (this.users[cnt].totalScore / 10).toFixed(1)
								}
							}
							return "-"
						})()
					}}
				</td>
				<td class="Fixed Diff"></td>

				<td class="Score" v-for="cnt in scoreNums" :key="cnt">
					{{
						columnHighscores[cnt - 1] === -1
							? "-"
							: (columnHighscores[cnt - 1] / 10).toFixed(1)
					}}
				</td>
			</tr>
			<tr v-for="user in users" :class="{Disqualified: user.disqualified}">
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
					{{ (user.totalScore / 10).toFixed(1) }}
				</td>
				<td class="Fixed Diff">
					{{
						user.scoreDiff === undefined
							? "-"
							: (user.scoreDiff / 10).toFixed(1)
					}}
				</td>
				<td class="Score" v-for="cnt in scoreNums" :key="cnt">
					<ScoreCell
						:scoreX10="user.scores[cnt - 1]"
						@scoreX10Updated="(score) => onScoreUpdated(user, cnt - 1, score)"
					/>
				</td>
			</tr>
			<tr class="AddingRow">
				<td class="Fixed Delete"></td>
				<td class="Fixed Name">
					<input type="text" v-model="newName" @keydown.enter="addUser" />
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
import SortSelector from "./SortSelector.vue"

export default {
	name: "MainTable",
	components: {
		ScoreCell,
		SortSelector,
	},
	data() {
		return {
			newName: "",
			users: [],
			scoreNums: 0,
			columnFilleds: [],
			columnHighscores: [],
			sortType: "RANK", // added sortType to track the current sorting method
		}
	},
	methods: {
		addUser() {
			this.users.push(
				//user class
				{
					name: this.newName,
					rank: 0,
					totalScore: 0,
					scores: [],
					disqualified: false,
					scoreDiff: undefined,
				},
			)
			this.newName = ""

			this.onUserNumsChanged()
		},

		deleteUser(user) {
			this.users = this.users.filter((u) => u !== user)

			this.onUserNumsChanged()
		},

		onUserNumsChanged() {
			this.scoreNums = 2 * (this.users.length - 1) + 10
			this.updateUsers()

			while (this.columnFilleds.length < this.scoreNums) {
				this.columnFilleds.push(false)
			}
		},

		updateUsers() {
			this.updateTotalScores()
			this.updateRanks()
			this.fillEmptyScores()
			this.updateDisqualifications()
			this.sortUsers()
			this.updateScoreDiff()
			this.updateColumnHighscores()
		},

		updateTotalScores() {
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

		fillEmptyScores() {
			this.users.forEach((user) => {
				while (user.scores.length < this.scoreNums) {
					user.scores.push(-1)
				}
			})
		},

		updateRanks() {
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

		updateDisqualifications() {
			//calculate current round
			let currentRound = 0
			for (let cnt = 0; cnt < this.scoreNums; cnt++) {
				if (this.columnFilleds[cnt]) {
					currentRound = cnt + 1
				} else {
					break
				}
			}

			//calculate number of disqualified users
			let disqualifiedNum = 0
			if (currentRound >= 12) {
				disqualifiedNum = parseInt((currentRound - 10) / 2)
			}

			//disqualify users
			const disqualifiedRank = this.users.length - (disqualifiedNum - 1)
			this.users.forEach((user) => {
				user.disqualified = user.rank >= disqualifiedRank
			})
		},

		onScoreUpdated(user, cnt, score) {
			user.scores[cnt] = score

			//updateScoreColumn() needs to proceed updateUsers()
			this.updateScoreColumn()
			this.updateUsers()
		},

		updateScoreColumn() {
			for (let column = 0; column < this.scoreNums; column++) {
				let isFilled = true
				for (let user of this.users) {
					//if qualified user has not entered score...
					if (user.scores[column] === -1 && !user.disqualified) {
						isFilled = false
						break
					}
				}
				this.columnFilleds[column] = isFilled
			}
		},

		onSortTypeChanged(sortType) {
			this.sortType = sortType
			this.sortUsers()
		},

		sortUsers() {
			if (this.sortType === "RANK") {
				this.sortUsersByRank()
			} else if (this.sortType === "NAME") {
				this.sortUsersByName()
			} else {
				console.error("Unknown sort type:", this.sortType)
			}
		},

		sortUsersByRank() {
			this.users.sort((a, b) => a.rank - b.rank)
		},
		sortUsersByName() {
			this.users.sort((a, b) => a.name.localeCompare(b.name))
		},

		updateScoreDiff() {
			const usersSortedByRank = [...this.users].sort((a, b) => a.rank - b.rank)

			//first is empty
			if (usersSortedByRank.length > 0) {
				usersSortedByRank[0].scoreDiff = undefined
			}

			for (let cnt = 1; cnt < usersSortedByRank.length; cnt++) {
				const prevUser = usersSortedByRank[cnt - 1]
				const currentUser = usersSortedByRank[cnt]

				if (prevUser.totalScore === currentUser.totalScore) {
					currentUser.scoreDiff = prevUser.scoreDiff
				} else {
					currentUser.scoreDiff = prevUser.totalScore - currentUser.totalScore
				}
			}
		},

		updateColumnHighscores() {
			this.columnHighscores = []
			for (let column = 0; column < this.scoreNums; column++) {
				let maxScore = -1
				for (let user of this.users) {
					if (user.scores[column] > maxScore) {
						maxScore = user.scores[column]
					}
				}
				this.columnHighscores.push(maxScore)
			}
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
					diff: "Score Diff",
					highscore: "Highscore",
				},
			},
			ja: {
				MainTable: {
					name: "名前",
					rank: "順位",
					totalScore: "合計",
					addUser: "追加",
					diff: "点数差",
					highscore: "最高得点",
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

table tr:nth-child(even):not(.AddingRow):not(.Disqualified):not(.Highscore) td {
	background-color: #dadada;
}

th.Score {
	background-color: #c4e7ff;
}

th.Score.Filled {
	background-color: #fdff8d;
}

tr.Highscore {
	td {
		background-color: #fff4c5;
	}
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

.Diff {
	width: 50px;
	left: 350px;
}

.AddingRow {
	background-color: #ffb7b7;
	td {
		background-color: #ffb7b7;
		border-right: none;
	}
}

tr.Disqualified {
	td {
		background-color: #ff0000;
	}
}
</style>
