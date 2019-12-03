export default class Storage {
	constructor (args = {}) {

	}
	save (data) {
		const dataArray = this.read() || []
		// console.log('прочитали ил памяти', dataArray)

		if (data.workerName) {
			console.log(dataArray)
			let weeksArray
			for (let i = 0; i < dataArray.length; i++) {
				if (dataArray[i].name === data.workerName) {
					weeksArray = dataArray[i].weeks
					console.log(weeksArray)
					weeksArray.push({weekNumber: data.inputValue, weekItems: []})
					dataArray[i].weeks = weeksArray
				}
			}

		} else {

			dataArray.push({
				name: data.inputValue, 
				weeks: []
			})
		}

		localStorage.setItem('bella-workers', JSON.stringify(dataArray))
		// console.log('сохранено', dataArray)
	}
	read (page) {
		const data = JSON.parse(localStorage.getItem('bella-workers'))
		// console.log('прочитал', data)
		return data || []
	}

	// загрузка недель по имени работника
	getWorkerWeeks(name) {
		const dataArray = this.read()
		// console.log(dataArray)
		for(let i = 0; i < dataArray.length; i++) {
			if (dataArray[i].name === name) {
				console.log( dataArray)
				return dataArray[i] || 'empty'
			}
		}
	}
}
// localStorage.setItem('bellaPlus', JSON.stringify(data))
// JSON.parse(localStorage.getItem('bellaPlus'))