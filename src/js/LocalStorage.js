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
		// console.log(data)
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
		// console.log('weekNumber', weekNumber)
		
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
		// console.log('идёт сохранение работника data:', data)
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

	// сохранить операцию сдачи
	static saveHandOverOperation (data) {
		console.log(data)
		const dataObj = LocalStorage.read() || {}

		for (let i = 0; i < dataObj.weeks.length; i++) {
			// если имя работника в массиве из памяти и из формы совпадают
			if (dataObj.weeks[i].weekNumber === data.weekNumber) {
				// проверка на существование номера недели
				for (let j = 0; j < dataObj.weeks[i].workers.length; j++) {
					if (dataObj.weeks[i].workers[j].workerName === data.workerName) {

						// учитываем операцию сдачи в общем весе недели
						dataObj.weeks[i].workers[j].workerWeekWeight -= +data.handOverOperation.weightWithPercent

						// учитываем операцию сдачи в общей сдаче недели
						dataObj.weeks[i].workers[j].workerWeekSalary += +data.handOverOperation.price

						// добавляем id
						dataObj.weeks[i].workers[j].handOverId = dataObj.weeks[i].workers[j].handOverId || 0
						data.handOverOperation.id = ++dataObj.weeks[i].workers[j].handOverId

						// добавляем операцию сдачи в массив сдач
						dataObj.weeks[i].workers[j].workerWeekHandOver.push(data.handOverOperation)
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

	// получаем массив плетений из памяти
	static getWeavingArray () {
		const dataObj = LocalStorage.read() || {}
		
		// создаём плетения по умолчанию
		const weavingsDefaultArray = [
			{weavingName: "БСМ 20", percent: "7", chain: "242", bracelet: "99", id: 1},
			{weavingName: "БСМ 30", percent: "7", chain: "231", bracelet: "88", id: 2},
			{weavingName: "БСМ 40", percent: "7", chain: "220", bracelet: "88", id: 3},
			{weavingName: "БСМ 50", percent: "7", chain: "220", bracelet: "88", id: 4},
			{weavingName: "Фараон 30", percent: "7", chain: "385", bracelet: "154", id: 5},
			{weavingName: "Фараон 50", percent: "7", chain: "357.5", bracelet: "143", id: 6},
			{weavingName: "Фараон 80", percent: "7", chain: "500.5", bracelet: "198", id: 7},
			{weavingName: "КАРД витой", percent: "4", chain: "605", bracelet: "242", id: 8},
			{weavingName: "КАРД гладкий", percent: "7", chain: "810", bracelet: "324", id: 9},
			{weavingName: "КАРД плоский", percent: "4", chain: "671", bracelet: "269.5", id: 10},
			{weavingName: "КАРД узкий", percent: "4", chain: "786.5", bracelet: "313.5", id: 11},
			{weavingName: "КАРД ришелье", percent: "4", chain: "412.5", bracelet: "187", id: 12},
			{weavingName: "КАРД круглый", percent: "7", chain: "850", bracelet: "340", id: 13},
			{weavingName: "Роза 40", percent: "4", chain: "242", bracelet: "99", id: 14},
			{weavingName: "Роза 60", percent: "4", chain: "220", bracelet: "88", id: 15}
		]

		// если массив с плетениями ещё пуст, то записываем плетения по умолчанию
		dataObj.weavings = dataObj.weavings || weavingsDefaultArray

		// если Id плетений ещё не существует, то создаёт равным колличеству плетений в массиве
		if (!dataObj.weavingsId) {
			dataObj.weavingsId = dataObj.weavings.length
			LocalStorage.save(dataObj)
		}

		return dataObj.weavings
	}

	// сохраняем плетение в память
	static saveWeavingItem (data) {
		// получаем весь объект из localStorage
		const dataObj = LocalStorage.read() || {}

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

		LocalStorage.save(dataObj)

		return true
	}

	// получить одно плетение
	static getOneWeaving (weavingName) {
		const dataObj = LocalStorage.read() || {}
		for ( let i = 0; i < dataObj.weavings.length; i++) {
			if (dataObj.weavings[i].weavingName === weavingName) {
				return dataObj.weavings[i]
			}
		}
	}

}