export default class Storage {
	constructor (args = {}) {

	}
	static saveWorker (data) {
		const dataObj = Storage.read() || {}
		// console.log('прочитали ил памяти', dataArray)
		dataObj.workers = dataObj.workers || []

		// if (data.weekNumber) {
		// 	let weeksArray
		// 	for (let i = 0; i < dataObj.workers.length; i++) {
		// 		// если имя работника в массиве из памяти и из формы совпадают
		// 		if (dataObj.workers[i].workerName === data.workerName) {
		// 			// проверка на существование номера недели
		// 			for (let j = 0; j < dataObj.workers[i].weeks.length; j++) {
		// 				if (dataObj.workers[i].weeks[j].weekNumber === data.weekNumber) {
		// 					// console.log('exist week')
		// 					return false
		// 				}
		// 			}
		// 			weeksArray = dataObj.workers[i].weeks
		// 			weeksArray.push({weekNumber: data.weekNumber, weekItems: [], weekHandOver: []})
		// 			dataObj.workers[i].weeks = weeksArray
		// 			break
		// 		}
		// 	}
			

		// } 
		// else 
		// if (data.workerName){

		// проверка на существование имени
		for (let i = 0; i < dataObj.workers.length; i++) {
			if (dataObj.workers[i].workerName === data.workerName) {
				// console.log('exist name')
				return false
			}
		}

		dataObj.workersId = dataObj.workersId || 0

		dataObj.workers.push({
			workerName: data.workerName,
			id: ++dataObj.workersId,
			weeks: []
		})
		// }

		Storage.save(dataObj)
		return true
	}

	// сохранить одну неделю
	static saveOneWeek (data) {
		const dataObj = Storage.read() || {}
		dataObj.workers = dataObj.workers || []

		// let weeksArray
		for (let i = 0; i < dataObj.workers.length; i++) {
			// если имя работника в массиве из памяти и из формы совпадают
			if (dataObj.workers[i].workerName === data.workerName) {
				// проверка на существование номера недели
				for (let j = 0; j < dataObj.workers[i].weeks.length; j++) {
					if (dataObj.workers[i].weeks[j].weekNumber === data.weekNumber) {
						// console.log('exist week')
						return false
					}
				}
				dataObj.workers[i].weeksId = dataObj.workers[i].weeksId || 0
				const weeksArray = dataObj.workers[i].weeks
				weeksArray.push({
					weekNumber: data.weekNumber,
					weekItems: [], 
					weekHandOver: [],
					weekWeight: 0,
					weekSalary: 0,
					id: ++dataObj.workers[i].weeksId
				})
				dataObj.workers[i].weeks = weeksArray
				break
			}
		}
		Storage.save(dataObj)
		return true
	}

	// получить вес всех предыдущих недель работника
	// или вес всех недель, если конкретная неделя не указана
	static getWeightPreviousWeekItems(workerName, weekNumber = '') {
		const dataObj = Storage.read() || {}
		
		for (let i = 0; i < dataObj.workers.length; i++) {
			// находим работника, у которого будем считать
			if (dataObj.workers[i].workerName === workerName) {
				const weeksArray = dataObj.workers[i].weeks
				// обозначаем аккумулирующую переменную для веса
				let summWeight = 0
				// находим индекс текушей недели в массиве, либо длинну массива, если номер не задан
				let indexCurrentWeek = weeksArray.findIndex( (week) => {
					return week.weekNumber === weekNumber 
				}) 
				// если индекс не указана, то обходим все недели
				if (indexCurrentWeek === -1) {
					indexCurrentWeek = weeksArray.length
				}

				// обходим недели до текущей недели
				for (let i = 0; i < indexCurrentWeek; i++) {
					summWeight += weeksArray[i].weekWeight
				}

				return summWeight
			}
		}
	}


	// сохранить операцию сдачи
	static saveHandOverOperation (data) {
		const dataObj = Storage.read() || {}
		// console.log(dataArray)
		// console.log(data)

		for (let i = 0; i < dataObj.workers.length; i++) {
			// если имя работника в массиве из памяти и из формы совпадают
			if (dataObj.workers[i].workerName === data.workerName) {
				// проверка на существование номера недели
				for (let j = 0; j < dataObj.workers[i].weeks.length; j++) {
					if (dataObj.workers[i].weeks[j].weekNumber === data.weekNumber) {

						// учитываем операцию сдачи в общем весе недели
						dataObj.workers[i].weeks[j].weekWeight -= +data.handOverOperation.weightWithPercent

						// добавляем id
						dataObj.workers[i].weeks[j].handOverId = dataObj.workers[i].weeks[j].handOverId || 0
						data.handOverOperation.id = ++dataObj.workers[i].weeks[j].handOverId

						// добавляем операцию сдачи в массив сдач
						dataObj.workers[i].weeks[j].weekHandOver.push(data.handOverOperation)
						break
					}
				}
			}
		}
		Storage.save(dataObj)

	}

	// сохранить простую операцию
	static saveOperation (data) {
		const dataObj = Storage.read() || {}
		// console.log(dataArray)
		// console.log(data)
		dataObj.workers = dataObj.workers || []

		for (let i = 0; i < dataObj.workers.length; i++) {
			// если имя работника в массиве из памяти и из формы совпадают
			if (dataObj.workers[i].workerName === data.workerName) {
				// проверка на существование номера недели
				for (let j = 0; j < dataObj.workers[i].weeks.length; j++) {
					if (dataObj.workers[i].weeks[j].weekNumber === data.weekNumber) {

						// добавляем id
						dataObj.workers[i].weeks[j].operationId = dataObj.workers[i].weeks[j].operationId || 0

						// создаём объект новой операции
						const newOperation = {
							value: data.singleOperation,
							id: ++dataObj.workers[i].weeks[j].operationId
						}
						// учитываем операцию в общем весе недели
						dataObj.workers[i].weeks[j].weekWeight += +data.singleOperation

						dataObj.workers[i].weeks[j].weekItems.push(newOperation)
						break
					}
				}
			}
		}
		Storage.save(dataObj)

	}

	static read () {
		const dataObj = JSON.parse(localStorage.getItem('bella-workers')) || {}
		// console.log('прочитал', dataObj)

		// return data.workers || []
		return dataObj
	}

	static save(dataObj) {
		// const dataObj = {workers: dataArray}
		localStorage.setItem('bella-workers', JSON.stringify(dataObj))
	}

	// загрузка недель по имени работника
	static getWorkerWeeks(name) {
		const dataObj = Storage.read()
		// console.log(dataArray)
		// console.log(name)
		for(let i = 0; i < dataObj.workers.length; i++) {
			if (dataObj.workers[i].workerName === name) {
				// console.log( dataArray)
				return dataObj.workers[i] || 'empty'
			}
		}
	}

	// загрузка 1 недели работника
	static getOneWeek(name, weekNumber) {
		// console.log('static', weekNumber)
		const dataObj = Storage.read() || {}

		for(let i = 0; i < dataObj.workers.length; i++) {
			// если имя совпадает
			if (dataObj.workers[i].workerName === name) {
				// console.log('here', dataArray[i].weeks)
				for(let j = 0; j < dataObj.workers[i].weeks.length; j++) {
					// если номер недели совпадает
					if(dataObj.workers[i].weeks[j].weekNumber === weekNumber) {
						// возвращаем елементы внутри недели
						return dataObj.workers[i].weeks[j] || 'empty'
					}
				}
			}
		}
	}

	// сохраняем плетение в память
	static saveWeavingItem (data) {
		// получаем весь объект из localStorage
		const dataObj = Storage.read() || {}

		// массив с плетениями
		dataObj.weavings = dataObj.weavings || []
		for(let i = 0; i < dataObj.weavings.length; i++) {
			// если такое плетение уже есть, то отмена
			if (dataObj.weavings[i].weavingName === data.weavingName) {
				return false
			}
			
		}
		// добавляем id
		dataObj.weavingsId = dataObj.weavingsId || 0
		data.id = ++dataObj.weavingsId

		dataObj.weavings.push(data)

		Storage.save(dataObj)

		return true
	}

	// получаем массив плетений из памяти
	static getWeavingArray () {
		const dataObj = Storage.read() || {}
		return dataObj.weavings || []
	}

	// получить одно плетение
	static getOneWeaving (weavingName) {
		const dataObj = Storage.read() || {}
		for ( let i = 0; i < dataObj.weavings.length; i++) {
			if (dataObj.weavings[i].weavingName === weavingName) {
				return dataObj.weavings[i]
			}
		}
	}

	// получить общий вес со всех работников
	static getAbsolutelyTotalWeight () {
		const dataObj = Storage.read() || {}
		dataObj.workers = dataObj.workers || []
		
		// для каждого работника считаем его остаток и складываем
		// если ещё нет работников, то остаток 0
		return dataObj.workers.reduce( (summ, worker) => {
				return summ + Storage.getWeightPreviousWeekItems(worker.workerName)
			}, 0)
	}
}