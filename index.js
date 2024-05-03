let fs = require('fs')

const args = {
	jsonFile: process.argv[2] ?? 'dataset-1',
	barWidth: 10
}

const readJsonFile = (jsonFile) => {
	try {
		const data = fs.readFileSync(`data/${jsonFile}.json`, 'utf8')
		const parsedData = JSON.parse(data)
		return parsedData
	} catch (err) {
		console.error(err)
	}
}

const plot = (chartData) => {
	console.log('Plotting chart...')
	const chartValues = Object.values(chartData)
	const barLabels = Object.keys(chartData).map((label) => label.padEnd(10))
	const maxValue = Math.max(...chartValues)
	const normalizedMaxValue = Math.ceil(maxValue / 10) * 10
	const linesByBar = chartValues.map((value) =>
		customRound((value * normalizedMaxValue) / maxValue)
	)

	for (let i = normalizedMaxValue; i >= 1; i--) {
		const lineValues = []

		linesByBar.forEach((value) => {
			const differenceBetweenValueAndI = 1 - Math.abs(value - i)
			const shouldFormatLine = value % 1 !== 0 && i === Math.ceil(value)

			if (shouldFormatLine)
				lineValues.push(
					'.'
						.repeat(args.barWidth * differenceBetweenValueAndI)
						.padEnd(args.barWidth)
				)
			else if (value >= i) lineValues.push('.'.repeat(args.barWidth))
			else lineValues.push(' '.repeat(args.barWidth))
		})

		console.log(...lineValues)
	}
	console.log(...barLabels)
}

// 4.9 => 5
// 4.123 => 4.1
// 4.567 => 4.5
const customRound = (value) => {
	const decimalPart = value % 1
	if (decimalPart >= 0.9) return Math.ceil(value)
	else return Math.round(value * 10) / 10
}

const chartData = readJsonFile(args.jsonFile)
plot(chartData)
