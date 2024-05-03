let fs = require('fs')

const jsonFile = process.argv[2] ?? 'dataset-1'

const readJsonFile = (jsonFile) => {
	try {
		const data = fs.readFileSync(`data/${jsonFile}.json`, 'utf8')
		const parsedData = JSON.parse(data)
		return parsedData
	} catch (err) {
		console.error(err)
	}
}

const chartData = readJsonFile(jsonFile)
