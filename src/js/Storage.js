export default class Storage {
	constructor (args = {}) {

	}

	// изменяем статус пользователя бригадиром 
	static setBrigadier(isBrigadier) {
		const dataObj = Storage.read() || {}
		dataObj.isBrigadier = isBrigadier
		Storage.save(dataObj)
	}

	// узнаём бригадир ли пользователь
	static isBrigadier() {
		const dataObj = Storage.read() || {}

		Storage.saveWorker({workerName: 'Я'})
		// если бригадир никогда не устанавливался, то задаём ему false
		// и создаём работника "Я"
		if (dataObj.isBrigadier === undefined) {
			Storage.setBrigadier(false)
		}
		return dataObj.isBrigadier = dataObj.isBrigadier || false
	}
	
	static saveWorker (data) {
		const dataObj = Storage.read() || {}
		// console.log('прочитали ил памяти', dataArray)
		dataObj.workers = dataObj.workers || []

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
		// строка нужна для правильной работы кнопки Назад при отсутствии работников
		dataObj.workers = dataObj.workers || []
		
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

						// учитываем операцию сдачи в общей сдаче недели
						dataObj.workers[i].weeks[j].weekSalary += +data.handOverOperation.price

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
							id: ++dataObj.workers[i].weeks[j].operationId,
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
		// const myWay = dataObj.removedElements[0].element.way
		// console.log(dataObj.removedElements[6].element.way)

		for(let i = 0; i < dataObj.workers.length; i++) {
			// если имя совпадает
			if (dataObj.workers[i].workerName === name) {
				// console.log('here', dataArray[i].weeks)
				for(let j = 0; j < dataObj.workers[i].weeks.length; j++) {
					// если номер недели совпадает
					if(dataObj.workers[i].weeks[j].weekNumber === weekNumber) {
						// возвращаем елементы внутри недели
						return dataObj.workers[i].weeks[j] 
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
			Storage.save(dataObj)
		}

		return dataObj.weavings
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

	// удаление работника
	static deleteWorker(elementId) {
		const dataObj = Storage.read()
		// находим индекс удаляемого элемента
		const index = dataObj.workers.findIndex( (worker) => {

			return worker.id === +elementId
		})
		if (index < 0) return true

		// сохраняем удалённый злемент
		const removedElement = dataObj.workers.splice(index, 1)[0]

		dataObj.removedElements = dataObj.removedElements || []

		dataObj.removedId = dataObj.removedId || 0

		const removedObj = {
			element: removedElement,
			time: Storage.getTime(),
			id: ++dataObj.removedId,
			way: ['workers'],
			index
		}

		dataObj.removedElements.push(removedObj)

		Storage.save(dataObj)

		return true
	}

	// удаление недели
	static deleteWeek(elementId, workerName) {
		// console.log(elementId)
		const dataObj = Storage.read()
		// находим индекс удаляемого элемента
		for( let i =0; i < dataObj.workers; i++) {

		}
		const workersIndex = dataObj.workers.findIndex( (worker) => worker.workerName === workerName)
		// console.log(workersIndex)

		const index = dataObj.workers[workersIndex].weeks.findIndex( (week) => {

			return week.id === +elementId
		})
		if (index < 0) return true
		// console.log('index', index)

		// сохраняем удалённый злемент
		const removedElement = dataObj.workers[workersIndex].weeks.splice(index, 1)[0]

		dataObj.removedElements = dataObj.removedElements || []

		dataObj.removedId = dataObj.removedId || 0

		const removedObj = {
			element: removedElement,
			time: Storage.getTime(),
			id: ++dataObj.removedId,
			way: ['workers', [workersIndex], 'weeks'],
			index
		}

		dataObj.removedElements.push(removedObj)

		Storage.save(dataObj)

		return true
	}

	
	// удаление операции недели
	static deleteWeekItem(elementId, workerName, weekNumber) {
		// console.log(elementId)
		const dataObj = Storage.read()
		// находим индекс удаляемого элемента
		for( let i =0; i < dataObj.workers; i++) {

		}
		const workersIndex = dataObj
			.workers
			.findIndex( (worker) => worker.workerName === workerName)

		const weekIndex = dataObj
			.workers[workersIndex]
			.weeks
			.findIndex( (week) => week.weekNumber == weekNumber)

		const index = dataObj
			.workers[workersIndex]
			.weeks[weekIndex]
			.weekItems
			.findIndex( (item) => item.id == elementId)


		if (index < 0) return true
		// console.log('index', index)

		// сохраняем удалённый злемент
		const removedElement = dataObj
			.workers[workersIndex]
			.weeks[weekIndex]
			.weekItems
			.splice(index, 1)[0]
		
		// учитываем удаление элемента в общем весе недели
		dataObj
			.workers[workersIndex]
			.weeks[weekIndex]
			.weekWeight -= removedElement.value

		dataObj.removedElements = dataObj.removedElements || []

		dataObj.removedId = dataObj.removedId || 0
		
		const removedObj = {
			element: removedElement,
			time: Storage.getTime(),
			id: ++dataObj.removedId,
			way: ['workers', [workersIndex], 'weeks', [weekIndex], 'weekItems'],
			index
		}

		dataObj.removedElements.push(removedObj)

		Storage.save(dataObj)

		return true
	}

	// удаление операции сдачи
	static deleteHandOverItems(elementId, workerName, weekNumber) {
		// console.log(elementId)
		const dataObj = Storage.read()
		// находим индекс удаляемого элемента
		for( let i =0; i < dataObj.workers; i++) {

		}
		const workersIndex = dataObj
			.workers
			.findIndex( (worker) => worker.workerName === workerName)

		const weekIndex = dataObj
			.workers[workersIndex]
			.weeks
			.findIndex( (week) => week.weekNumber == weekNumber)

		const index = dataObj
			.workers[workersIndex]
			.weeks[weekIndex]
			.weekHandOver
			.findIndex( (item) => item.id == elementId)


		if (index < 0) return true
		console.log('index', index)

		// сохраняем удалённый злемент
		const removedElement = dataObj
			.workers[workersIndex]
			.weeks[weekIndex]
			.weekHandOver
			.splice(index, 1)[0]
		
		// учитываем удаление элемента в общем весе недели
		dataObj
			.workers[workersIndex]
			.weeks[weekIndex]
			.weekWeight += removedElement.weightWithPercent

		// учитываем удаление элемента в общей сдаче недели
		dataObj
			.workers[workersIndex]
			.weeks[weekIndex]
			.weekSalary -= removedElement.price

		dataObj.removedElements = dataObj.removedElements || []
		dataObj.removedId = dataObj.removedId || 0

		const removedObj = {
			element: removedElement,
			time: Storage.getTime(),
			id: ++dataObj.removedId,
			way: ['workers', [workersIndex], 'weeks', [weekIndex], 'weekHandOver'],
			index
		}

		dataObj.removedElements.push(removedObj)

		Storage.save(dataObj)

		return true
	}

	// удаление плетения
	static deleteWeaving(elementId) {
		const dataObj = Storage.read()
		// находим индекс удаляемого элемента
		const index = dataObj.weavings.findIndex( (weaving) => {

			return weaving.id === +elementId
		})
		if (index < 0) return true

		// сохраняем удалённый злемент
		const removedElement = dataObj.weavings.splice(index, 1)[0]

		dataObj.removedElements = dataObj.removedElements || []

		dataObj.removedId = dataObj.removedId || 0

		const removedObj = {
			element: removedElement,
			time: Storage.getTime(),
			id: ++dataObj.removedId,
			way: ['weavings'],
			index
		}

		dataObj.removedElements.push(removedObj)

		Storage.save(dataObj)

		return true
	}

	// получить сегодняшнюю дату
	static getTime () {
		const monthsArray = ['января', 'февраля', 'марта', 'апреля', 'мая','июня','июля','августа','сентября','октября','ноября','декабря']

		const date = new Date()
		const month = monthsArray[date.getMonth()]
		const day = date.getDate()
		const hour = date.getHours()
		// если минут до 10, то добавляем нолик вперёд
		const minutes = date.getMinutes().toString().length === 2 ? date.getMinutes() : `0${date.getMinutes()}`

		return `${day} ${month} в ${hour}:${minutes}`
	}

	// получаем удалённые элементы
	static getRemovedItems() {
		const dataObj = Storage.read() || {}
		return dataObj.removedElements = dataObj.removedElements || []
	}

	// восстановить удалённый элемент
	static restoreElement(id) {
		
		const dataObj = Storage.read() || {}
		const removedArray = dataObj.removedElements || []

		// console.log(removedArray)
		for (let i = 0; i < removedArray.length; i++) {
			if (removedArray[i].id === id) {
				// читаем сохранённый путь в элементе
				const wayArr = removedArray[i].way

				// получаем путь до массива, из которого удаляли
				let restoreWay = dataObj

				for (let j = 0; j < wayArr.length; j+=2) {
					if (wayArr[j+1] === undefined) {
						restoreWay = restoreWay[`${wayArr[j]}`]
					} else {
						restoreWay = restoreWay[`${wayArr[j]}`][`${wayArr[j+1]}`]
					}
				}
				const index = restoreWay.findIndex( (elem) => {
					// console.log(elem.id, '>', removedArray[i].element.id)
					return elem.id > removedArray[i].element.id
				})
				// удаляем элемент из корзины
				const restoredElement = removedArray.splice(i, 1)[0].element
				// вставляем элемент обратно в используемую часть БД
				restoreWay.splice(index, 0, restoredElement)

				Storage.save(dataObj)

			}
		}
	}
}