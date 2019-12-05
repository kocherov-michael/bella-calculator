export default class Storage {
	constructor (args = {}) {

	}
	save (data) {
		const dataArray = Storage.read() || []
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
					// console.log('dataArray[i]', dataArray[i])
					// console.log('data', data)
					for (let j = 0; j < dataArray[i].weeks.length; j++) {
						if (dataArray[i].weeks[j].weekNumber === data.weekNumber) {
							console.log('exist week')
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
	static read (page) {
		const data = JSON.parse(localStorage.getItem('bella-workers'))
		// console.log('прочитал', data)
		return data || []
	}

	// загрузка недель по имени работника
	static getWorkerWeeks(name) {
		const dataArray = Storage.read()
		// console.log(dataArray)
		// console.log(name)
		for(let i = 0; i < dataArray.length; i++) {
			if (dataArray[i].workerName === name) {
				// console.log( dataArray)
				return dataArray[i] || 'empty'
			}
		}
	}

	static getOneWeek(name, weekNumber) {
		console.log('static', weekNumber)
		const dataArray = Storage.read()

		for(let i = 0; i < dataArray.length; i++) {
			// если имя совпадает
			if (dataArray[i].workerName === name) {
				console.log('here', dataArray[i].weeks)
				for(let j = 0; j < dataArray[i].weeks.length; j++) {
					// если номер недели совпадает
					if(dataArray[i].weeks.weekNumber === weekNumber) {
						// возвращаем елементы внутри недели
						return dataArray[i].weeks.weekItems || 'empty'
					}
				}
			}
		}
	}
}
// localStorage.setItem('bellaPlus', JSON.stringify(data))
// JSON.parse(localStorage.getItem('bellaPlus'))