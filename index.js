let fs = require('fs')

const args = {
	jsonFile: process.argv[2] ?? 'dataset-1',
	barWidth: process.argv[3] ?? 10,
	normalizationValue: process.argv[4]
}

const validateArgs = () => {
	const parsedBarWidth = Number(args.barWidth)
	const parsedNormalizationValue = Number(args.normalizationValue)

	if (isNaN(parsedBarWidth) || parsedBarWidth <= 0) {
		console.error('Invalid bar width. Please provide a positive number.')
		process.exit(1)
	}

	if (
		args.normalizationValue &&
		(isNaN(parsedNormalizationValue) || parsedNormalizationValue <= 0)
	) {
		console.error(
			'Invalid normalization value. Please provide a positive number.'
		)
		process.exit(1)
	}
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
	const normalizedMaxValue = args.normalizationValue ?? maxValue
	const linesByBar = chartValues.map((value) =>
		customRound((value * normalizedMaxValue) / maxValue)
	)

	let lineValues = []

	//First top values
	lineValues = chartValues.map((value) => {
		const isValueMax = value === maxValue
		if (isValueMax) return value.toFixed(2).toString().padEnd(args.barWidth)
		else return ' '.repeat(args.barWidth)
	})

	console.log(...lineValues)

	for (let i = normalizedMaxValue; i >= 1; i--) {
		lineValues = []

		linesByBar.forEach((value, index) => {
			const isTopLineBar = Math.ceil(value) === i
			const differenceBetweenValueAndI = 1 - Math.abs(value - i)
			const shouldFormatLine = value % 1 !== 0 && isTopLineBar
			const shouldAddTopValue = Math.ceil(value) + 1 === i

			if (shouldAddTopValue)
				lineValues.push(
					chartValues[index].toFixed(2).toString().padEnd(args.barWidth)
				)
			else if (shouldFormatLine)
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

validateArgs()
const chartData = readJsonFile(args.jsonFile)
plot(chartData)
