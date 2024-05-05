let fs = require('fs')

const args = {
	jsonFile: process.argv[2] ?? 'dataset-1',
	chartType: process.argv[3] ?? 'vertical',
	normalizationValue: process.argv[4],
	barWidth: process.argv[5] ?? 10
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

	if (args.chartType !== 'vertical' && args.chartType !== 'horizontal') {
		console.error(
			'Invalid chart type. Please provide "vertical" or "horizontal".'
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

const plotVerticalChart = (data) => {
	console.log('Vertical Chart:')

	let lineValues = []

	if (data.maxPositiveValue > 0) {
		//First top values
		lineValues = data.chartValues.map((value) => {
			const isValueMax = value === data.maxPositiveValue
			if (isValueMax) return value.toFixed(2).toString().padEnd(args.barWidth)
			else return ' '.repeat(args.barWidth)
		})

		console.log(...lineValues)

		// Positive Bars
		for (let i = data.normalizedPositiveValue; i >= 1; i--) {
			lineValues = []

			data.linesByBar.forEach((value, index) => {
				const isTopLineBar = Math.ceil(value) === i
				const differenceBetweenValueAndI = 1 - Math.abs(value - i)
				const shouldFormatLine = value % 1 !== 0 && isTopLineBar
				const shouldAddTopValue = Math.ceil(value) + 1 === i

				if (shouldAddTopValue && value > 0)
					lineValues.push(
						data.chartValues[index].toFixed(2).toString().padEnd(args.barWidth)
					)
				else if (shouldFormatLine)
					lineValues.push(
						'.'
							.repeat(
								args.barWidth * differenceBetweenValueAndI >= 1
									? args.barWidth * differenceBetweenValueAndI
									: 1
							)
							.padEnd(args.barWidth)
					)
				else if (value >= i) lineValues.push('.'.repeat(args.barWidth))
				else lineValues.push(' '.repeat(args.barWidth))
			})

			console.log(...lineValues)
		}
	}

	// Bar labels
	console.log(...data.barLabels)

	if (data.minNegativeValue >= 0) return

	// Negative Bars
	for (let i = -1; i >= data.normalizedNegativeValue; i--) {
		lineValues = []

		data.linesByBar.forEach((value, index) => {
			const isBottomLineBar = Math.floor(value) === i
			const differenceBetweenValueAndI = 1 - Math.abs(value - i)
			const shouldFormatLine = value % 1 !== 0 && isBottomLineBar
			const shouldAddBottomValue = Math.floor(value) - 1 === i

			if (shouldAddBottomValue)
				lineValues.push(
					data.chartValues[index].toFixed(2).toString().padEnd(args.barWidth)
				)
			else if (shouldFormatLine)
				lineValues.push(
					'.'
						.repeat(
							args.barWidth * differenceBetweenValueAndI >= 1
								? args.barWidth * differenceBetweenValueAndI
								: 1
						)
						.padEnd(args.barWidth)
				)
			else if (value <= i) lineValues.push('.'.repeat(args.barWidth))
			else lineValues.push(' '.repeat(args.barWidth))
		})

		console.log(...lineValues)
	}

	//Last bottom values
	lineValues = data.chartValues.map((value) => {
		const isValueMin = value === data.minNegativeValue
		if (isValueMin) return value.toFixed(2).toString().padEnd(args.barWidth)
		else return ' '.repeat(args.barWidth)
	})

	console.log(...lineValues)
}

const plotHorizontalChart = (data) => {
	console.log('Horizontal Chart:')
	const existLeftValues = data.chartValues.some((value) => value < 0)
	const existRightValues = data.chartValues.some((value) => value >= 0)

	data.linesByBar.forEach((value, index) => {
		value = Math.round(Math.abs(value))
		const existLeftValue = data.chartValues[index] < 0
		const leftLabel = existLeftValue ? data.chartValues[index] : ''
		const leftLines = existLeftValue ? '|'.repeat(value) : ' '.repeat(value)
		const leftChartSide = `${leftLabel} ${leftLines} - `.padStart(
			Math.abs(data.normalizedNegativeValue) + 10
		)
		const label = `${data.barLabels[index].padEnd(args.barWidth)}`
		const existRightValue = data.chartValues[index] >= 0
		const rightLabel = existRightValue ? data.chartValues[index] : ''
		const rightLines = existRightValue ? '|'.repeat(value) : ' '.repeat(value)
		const rightChartSide = ` - ${rightLines} ${rightLabel}`.padEnd(
			data.normalizedPositiveValue
		)

		console.log(
			existLeftValues ? leftChartSide : '',
			label,
			existRightValues ? rightChartSide : ''
		)
	})
}

const plotHandlers = {
	vertical: plotVerticalChart,
	horizontal: plotHorizontalChart
}

const normalizeChartData = (chartData) => {
	const chartValues = Object.values(chartData)
	const barLabels = Object.keys(chartData).map((label) => label.padEnd(10))
	const maxPositiveValue = Math.max(...chartValues)
	const minNegativeValue = Math.min(...chartValues)
	const maxValue = Math.max(maxPositiveValue, Math.abs(minNegativeValue))
	const normalizedMaxValue = args.normalizationValue ?? maxValue
	const normalizedPositiveValue =
		maxValue === maxPositiveValue
			? args.normalizationValue ?? maxValue
			: (maxPositiveValue * normalizedMaxValue) / maxValue

	const normalizedNegativeValue =
		maxValue === Math.abs(minNegativeValue)
			? (args.normalizationValue ?? maxValue) * -1
			: (minNegativeValue * normalizedMaxValue) / maxValue
	const linesByBar = chartValues.map(
		(value) => (value * normalizedMaxValue) / maxValue
	)

	return {
		chartValues,
		barLabels,
		maxPositiveValue,
		minNegativeValue,
		maxValue,
		normalizedMaxValue,
		normalizedPositiveValue,
		normalizedNegativeValue,
		linesByBar
	}
}

validateArgs()
const chartData = readJsonFile(args.jsonFile)
const normalizedChartData = normalizeChartData(chartData)
plotHandlers[args.chartType](normalizedChartData)
