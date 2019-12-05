export default class Storage {
	constructor (args = {}) {

	}
	save (data) {
		const dataArray = this.read() || []
		// console.log('прочитали ил памяти', dataArray)

		// if (data.workerName) {
			console.log('data приходит в сторадж', data)
		if (data.weekNumber) {
			// console.log(dataArray)
			let weeksArray
			for (let i = 0; i < dataArray.length; i++) {
				// если имя работника в массиве из памяти и из формы совпадают
				if (dataArray[i].workerName === data.workerName) {
					// проверка на существование номера недели
					console.log('dataArray[i]', dataArray[i])
					console.log('data', data)
					for (let j = 0; j < dataArray[i].weeks.length; j++) {
						if (dataArray[i].weeks[j].weekNumber === data.weekNumber) {
							console.log('exist')
							return false
						}
					}
					weeksArray = dataArray[i].weeks
					// console.log(weeksArray)
					weeksArray.push({weekNumber: data.weekNumber, weekItems: []})
					dataArray[i].weeks = weeksArray
					break
				}
			}
			

		} 
		else if (data.workerName){

			// проверка на существование имени
			for (let i = 0; i < dataArray.length; i++) {
				if (dataArray[i].workerName === data.workerName) {
					console.log('exist name')
					return false
				}
			}

			dataArray.push({
				workerName: data.workerName, 
				weeks: []
			})
		}

		console.log('в память идёт', dataArray)
		localStorage.setItem('bella-workers', JSON.stringify(dataArray))
		// console.log('сохранено', dataArray)
		return true
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