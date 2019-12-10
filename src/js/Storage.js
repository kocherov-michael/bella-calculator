export default class Storage {
	constructor (args = {}) {

	}
	save (data) {
		const dataArray = Storage.read() || []
		// console.log('прочитали ил памяти', dataArray)

		if (data.weekNumber) {
			let weeksArray
			for (let i = 0; i < dataArray.length; i++) {
				// если имя работника в массиве из памяти и из формы совпадают
				if (dataArray[i].workerName === data.workerName) {
					// проверка на существование номера недели
					for (let j = 0; j < dataArray[i].weeks.length; j++) {
						if (dataArray[i].weeks[j].weekNumber === data.weekNumber) {
							// console.log('exist week')
							return false
						}
					}
					weeksArray = dataArray[i].weeks
					weeksArray.push({weekNumber: data.weekNumber, weekItems: [], weekHandOver: []})
					dataArray[i].weeks = weeksArray
					break
				}
			}
			

		} 
		else if (data.workerName){

			// проверка на существование имени
			for (let i = 0; i < dataArray.length; i++) {
				if (dataArray[i].workerName === data.workerName) {
					// console.log('exist name')
					return false
				}
			}

			dataArray.push({
				workerName: data.workerName, 
				weeks: []
			})
		}

		Storage.save(dataArray)
		// console.log('в память идёт', dataArray)
		// localStorage.setItem('bella-workers', JSON.stringify(dataArray))
		// console.log('сохранено', dataArray)
		return true
	}
	// Получаем процент угара по названию плетения
	static getWeavingPercent (weavingName) {
		console.log('получаем процент угара плетения', weavingName)
		return 7
	}

	// получить цену на изделие
	static getChainPrice (weavingName, isChain) {
		if (isChain) {
			return 220
		}
		else {
			return 88
		}
	}

	// получаем вес с процентами по весу
	static getWeightWithPercent (weight, percent) {
		return Math.round(weight * 10000 + weight * percent * 10000 / 100) / 10000
	}
	

	// сохранить операцию сдачи
	static saveHandOverOperation (data) {
		const dataArray = Storage.read() || []
		// console.log(dataArray)
		// console.log(data)

		for (let i = 0; i < dataArray.length; i++) {
			// если имя работника в массиве из памяти и из формы совпадают
			if (dataArray[i].workerName === data.workerName) {
				// проверка на существование номера недели
				for (let j = 0; j < dataArray[i].weeks.length; j++) {
					if (dataArray[i].weeks[j].weekNumber === data.weekNumber) {
						// после релиза удалить следующие 4 строчки
						// if (!dataArray[i].weeks[j].weekHandOver) {
						// 	// console.log('создали массив для сдачи')
						// 	dataArray[i].weeks[j].weekHandOver = []
						// }
						
						const percent = Storage.getWeavingPercent(data.handOverOperation.weight) || 0
						const count = Math.floor(+data.handOverOperation.count)
						// console.log('исходный вес:', data.handOverOperation.weight)
						// console.log('процент:', percent)
						// console.log('итоговый вес:', Storage.getWeightWithPercent(data.handOverOperation.weight, percent))
						// создаём операцию сдачи для сохранения
						const handOverOperation = {
							weight: Math.round(+data.handOverOperation.weight * 10000) / 10000,
							weightWithPercent: Storage.getWeightWithPercent(data.handOverOperation.weight, percent),
							weaving: data.handOverOperation.weaving,
							count,
							isChain: data.handOverOperation.isChain,
							percent: percent,
							price: Storage.getChainPrice(data.handOverOperation.weaving, data.handOverOperation.isChain) * count
						}

						// добавляем операцию сдачи в массив сдач
						dataArray[i].weeks[j].weekHandOver.push(handOverOperation)

					}
				}
				break
			}
			break
		}
		Storage.save(dataArray)
		// console.log('итог', dataArray)

	}

	// сохранить простую операцию
	static saveOperation (data) {
		const dataArray = Storage.read() || []
		// console.log(dataArray)
		// console.log(data)

		for (let i = 0; i < dataArray.length; i++) {
			// если имя работника в массиве из памяти и из формы совпадают
			if (dataArray[i].workerName === data.workerName) {
				// проверка на существование номера недели
				for (let j = 0; j < dataArray[i].weeks.length; j++) {
					if (dataArray[i].weeks[j].weekNumber === data.weekNumber) {
						
						// создаём объект новой операции
						const newOperation = {
							value: data.singleOperation,
							isSingle: true,
							isPrevious: false
						}
						dataArray[i].weeks[j].weekItems.push(newOperation)
					}
				}
				break
			}
			break
		}
		Storage.save(dataArray)

	}

	static read (page) {
		const data = JSON.parse(localStorage.getItem('bella-workers'))
		// console.log('прочитал', data)
		return data || []
	}

	static save(dataArray) {
		localStorage.setItem('bella-workers', JSON.stringify(dataArray))
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
		// console.log('static', weekNumber)
		const dataArray = Storage.read()

		for(let i = 0; i < dataArray.length; i++) {
			// если имя совпадает
			if (dataArray[i].workerName === name) {
				// console.log('here', dataArray[i].weeks)
				for(let j = 0; j < dataArray[i].weeks.length; j++) {
					// если номер недели совпадает
					if(dataArray[i].weeks[j].weekNumber === weekNumber) {
						// возвращаем елементы внутри недели
						return dataArray[i].weeks[j] || 'empty'
					}
				}
			}
		}
	}
}
// localStorage.setItem('bellaPlus', JSON.stringify(data))
// JSON.parse(localStorage.getItem('bellaPlus'))