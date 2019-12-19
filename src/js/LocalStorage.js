export default class LocalStorage {
	constructor (args = {}) {

	}

	static read () {
		const dataObj = JSON.parse(localStorage.getItem('bella-calculator')) || {}

		return dataObj
	}

	static save(dataObj) {
		localStorage.setItem('bella-calculator', JSON.stringify(dataObj))
	}

	static isBrigadier () {
		return true
	}

	// сохраняем 1 неделю
	static saveOneWeek (data) {
		console.log(data)
		const dataObj = LocalStorage.read() || {}
		
		dataObj.weeks = dataObj.weeks || []

		// проверка на существование имени
		for (let i = 0; i < dataObj.weeks.length; i++) {
			if (dataObj.weeks[i].weekNumber === data.weekNumber) {
				return false
			}
		}

		dataObj.weeksId = dataObj.weeksId || 0

		dataObj.weeks.push({
			weekNumber: data.weekNumber,
			id: ++dataObj.weeksId,
			workers: [],
			brigade: []
		})
		// }

		LocalStorage.save(dataObj)
		return true
	}

	// загружаем работников 1 недели
	static getOneWeek(weekNumber) {
		console.log('weekNumber', weekNumber)
		
		const dataObj = LocalStorage.read() || {}

		for(let i = 0; i < dataObj.weeks.length; i++) {
			// если номер недели совпадает
			if (dataObj.weeks[i].weekNumber === weekNumber) {
				// возвращаем елементы внутри недели
				return dataObj.weeks[i].workers
			}
		}
	}

	static saveWorker(data) {
		console.log('идёт сохранение работника data:', data)
		const dataObj = LocalStorage.read() || {}
		dataObj.weeks = dataObj.weeks || []

		// let weeksArray
		for (let i = 0; i < dataObj.weeks.length; i++) {
			// если номер недели в массиве из памяти и из формы совпадают
			if (dataObj.weeks[i].weekNumber === data.weekNumber) {
				// проверка на существование имени работника
				for (let j = 0; j < dataObj.weeks[i].workers.length; j++) {
					// console.log(dataObj.workers[i].workers)
					if (dataObj.weeks[i].workers[j].workerName === data.workerName) {
						console.log('имена совпадают - отмена')
						return false
					}
				}
				dataObj.weeks[i].workersId = dataObj.weeks[i].workersId || 0
				// const workersArray = dataObj.weeks[i].workers
				dataObj.weeks[i].workers.push({
					workerName: data.workerName,
					workerWeekItems: [], 
					workerWeekHandOver: [],
					workerWeekWeight: 0,
					workerWeekSalary: 0,
					id: ++dataObj.weeks[i].workersId
				})
				// dataObj.weeks[i].workers = workersArray
				break
			}
		}
		LocalStorage.save(dataObj)
		return true
	}

	// сохранить простую операцию
	static saveOperation (data) {
		const dataObj = LocalStorage.read() || {}
		dataObj.weeks = dataObj.weeks || []

		for (let i = 0; i < dataObj.weeks.length; i++) {
			// если номер недели в массиве из памяти и из формы совпадают
			if (dataObj.weeks[i].weekNumber === data.weekNumber) {
				// проверка на существование имени работника
				for (let j = 0; j < dataObj.weeks[i].workers.length; j++) {
					if (dataObj.weeks[i].workers[j].workerName === data.workerName) {

						// добавляем id
						dataObj.weeks[i].workers[j].operationId = dataObj.weeks[i].workers[j].operationId || 0

						// создаём объект новой операции
						dataObj.weeks[i].workers[j].workerWeekItems.push({
							value: data.singleOperation,
							id: ++dataObj.weeks[i].workers[j].operationId,
						})

						// учитываем операцию в общем весе недели
						dataObj.weeks[i].workers[j].workerWeekWeight += +data.singleOperation
						break
					}
				}
			}
		}
		LocalStorage.save(dataObj)

	}

	// получить 1 неделю работника
	static getOneWorkerWeek (workerName, weekNumber) {
		const dataObj = LocalStorage.read() || {}
		dataObj.weeks = dataObj.weeks || []

		for (let i = 0; i < dataObj.weeks.length; i++) {
			// если номер недели в массиве из памяти и из формы совпадают
			if (dataObj.weeks[i].weekNumber === weekNumber) {
				// проверка на существование имени работника
				for (let j = 0; j < dataObj.weeks[i].workers.length; j++) {
					if (dataObj.weeks[i].workers[j].workerName === workerName) {

						// возвращаем найденную неделю операций работника
						return dataObj.weeks[i].workers[j]
					}
				}
			}
		}
	}

}