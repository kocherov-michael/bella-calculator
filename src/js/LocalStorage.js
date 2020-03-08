export default class LocalStorage {
	constructor (args = {}) {

	}

	static login(user) {
		// пользователь уже залогинился
		window.userEmail = user.userEmail
		localStorage.setItem('bella-user', JSON.stringify(user))

	}

	// выход из профиля
	static logout() {
		localStorage.removeItem('bella-user')
		localStorage.removeItem('bella-calculator')
		window.userEmail = null
		return true
	}

	// регистрируем нового пользователя
	static registerUser(user) {
		localStorage.setItem('bella-user', JSON.stringify(user))
		window.userEmail = user.userEmail
		return true
	}

	static read () {
		const dataObj = JSON.parse(localStorage.getItem('bella-calculator')) || {}
		return dataObj
	}

	static save(dataObj) {
		localStorage.setItem('bella-calculator', JSON.stringify(dataObj))

		const userEmail = window.userEmail

		// сохраняем объект глобальным, чтобы перезаписать его на новый
		window.dataObj = dataObj
		
		;(async () => {
			
				let promise = new Promise((resolve, reject) => {
					setTimeout(() => resolve("ждём"), 1000)
				});
				let result = await promise;
	
				databaseRequest()
		})()

		function databaseRequest () {
			if (window.dataObj !== null) {

				const userData = JSON.stringify(window.dataObj)
				const data = {userEmail, userData}

				
				fetch('assets/php/data.php', {
					method: 'post', 
					body: JSON.stringify(data),
					headers: {
						'content-type': 'application/json'
					}
				})
				// .then(response => response.json())
				// .then(result => console.log(result))
				
				window.dataObj = null
			} 
		}


	}

	// изменяем статус пользователя бригадиром 
	static setBrigadier(isBrigadier) {
		// return
		const dataObj = LocalStorage.read() || {}
		dataObj.isBrigadier = isBrigadier
		LocalStorage.save(dataObj)
	}

	// узнаём бригадир ли пользователь
	static isBrigadier() {
		// return true
		const dataObj = LocalStorage.read() || {}

		LocalStorage.saveWorker({workerName: 'Я'})
		// если бригадир никогда не устанавливался, то задаём ему false
		// и создаём работника "Я"
		if (dataObj.isBrigadier === undefined) {
			LocalStorage.setBrigadier(false)
		}
		
		return dataObj.isBrigadier = dataObj.isBrigadier || false
	}

	// установить либо получить fontSize
	static fontSize (fontSize) {
		const dataObj = LocalStorage.read() || {}
		if (fontSize) {
			dataObj.fontSize = fontSize
			LocalStorage.save(dataObj)
		} else {
			dataObj.fontSize = dataObj.fontSize || 18
			return dataObj.fontSize
		}
	}

	// сохраняем 1 неделю
	static saveOneWeek (data) {
		const dataObj = LocalStorage.read() || {}
		
		dataObj.weeks = dataObj.weeks || []

		// проверка на существование имени
		for (let i = 0; i < dataObj.weeks.length; i++) {
			if (dataObj.weeks[i].weekNumber === data.weekNumber) {
				return false
			}
		}

		// создаём список работников из последней недели
		const lastWeek = dataObj.weeks.length - 1

		const workersArr = []
		let workersId = 0

		if (lastWeek >= 0) {

			const lastWeekWorkewsArr = dataObj.weeks[lastWeek].workers
			for (let i = 0; i < lastWeekWorkewsArr.length; i++) {
				const workerName = lastWeekWorkewsArr[i].workerName
					
				workersArr.push({
					workerName: workerName,
					workerWeekItems: [], 
					workerWeekHandOver: [],
					id: ++workersId
				})
			}
		}
		else {
			workersArr.push({
				workerName: 'Я',
				workerWeekItems: [], 
				workerWeekHandOver: [],
				id: ++workersId
			})
		}


		dataObj.weeksId = dataObj.weeksId || 0

		dataObj.weeks.push({
			weekNumber: data.weekNumber,
			id: ++dataObj.weeksId,
			workers: workersArr,
			brigade: [],
			workersId,
		})

		LocalStorage.save(dataObj)
		return true
	}

	// загружаем 1 неделю
	static getOneWeek(weekNumber) {
		
		const dataObj = LocalStorage.read() || {}

		for(let i = 0; i < dataObj.weeks.length; i++) {
			// если номер недели совпадает
			if (dataObj.weeks[i].weekNumber === weekNumber) {
				// возвращаем елементы внутри недели
				return dataObj.weeks[i]
			}
		}
	}

	static saveWorker(data) {
		const dataObj = LocalStorage.read() || {}
		dataObj.weeks = dataObj.weeks || []

		// let weeksArray
		for (let i = 0; i < dataObj.weeks.length; i++) {
			// если номер недели в массиве из памяти и из формы совпадают
			if (dataObj.weeks[i].weekNumber === data.weekNumber) {
				// проверка на существование имени работника
				for (let j = 0; j < dataObj.weeks[i].workers.length; j++) {
					if (dataObj.weeks[i].workers[j].workerName === data.workerName) {
						return false
					}
				}
				dataObj.weeks[i].workersId = dataObj.weeks[i].workersId || 0
				dataObj.weeks[i].workers.push({
					workerName: data.workerName,
					workerWeekItems: [], 
					workerWeekHandOver: [],
					id: ++dataObj.weeks[i].workersId,
				})
				break
			}
		}
		LocalStorage.save(dataObj)
		return true
	}

	
	// сохранить операцию баланса бригады
	static saveBrigadeOperation (data) {
		const dataObj = LocalStorage.read() || {}
		dataObj.weeks = dataObj.weeks || []

		for (let i = 0; i < dataObj.weeks.length; i++) {
			// если номер недели в массиве из памяти и из формы совпадают
			if (dataObj.weeks[i].weekNumber === data.weekNumber) {
				// добавляем id
				dataObj.weeks[i].brigadeId = dataObj.weeks[i].brigadeId || 0

				// создаём объект новой операции
				dataObj.weeks[i].brigade.push({
					value: data.singleOperation,
					id: ++dataObj.weeks[i].brigadeId,
				})

				break
			}
		}
		LocalStorage.save(dataObj)

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

						break
					}
				}
			}
		}
		LocalStorage.save(dataObj)

	}

	// сохранить операцию сдачи
	static saveHandOverOperation (data) {
		const dataObj = LocalStorage.read() || {}

		for (let i = 0; i < dataObj.weeks.length; i++) {
			// если имя работника в массиве из памяти и из формы совпадают
			if (dataObj.weeks[i].weekNumber === data.weekNumber) {
				// проверка на существование номера недели
				for (let j = 0; j < dataObj.weeks[i].workers.length; j++) {
					if (dataObj.weeks[i].workers[j].workerName === data.workerName) {

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

		// сортируем названия по алфавиту
		dataObj.weavings.sort((a,b) =>
		{
			const aName = a.weavingName.toLowerCase()
			const	bName = b.weavingName.toLowerCase()
			
			if (aName < bName) {
				return -1
			}
			else if (aName > bName) {
				return 1
			}
			else {
				return 0
			}
		})

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

	// удаление недели
	static deleteWeek(elementId) {
		const dataObj = LocalStorage.read()
		// находим индекс удаляемого элемента
		const index = dataObj.weeks.findIndex( (week) => {

			return week.id === +elementId
		})
		if (index < 0) return true

		// сохраняем удалённый злемент
		const removedElement = dataObj.weeks.splice(index, 1)[0]

		const args = {
			dataObj,
			removedElement, 
			index, 
			way: ['weeks']
		}
		LocalStorage.saveRemovedElement(args)

		return true
	}

	
	// удаление работника
	static deleteWorker(elementId, weekNumber) {
		
		const dataObj = LocalStorage.read()
		// находим индекс удаляемого элемента
		const weeksIndex = dataObj
			.weeks
			.findIndex( (week) => week.weekNumber === weekNumber)

		const index = dataObj
			.weeks[weeksIndex]
			.workers
			.findIndex( (worker) => {

			return worker.id === +elementId
		})
		if (index < 0) return true

		// сохраняем удалённый злемент
		const removedElement = dataObj.weeks[weeksIndex].workers.splice(index, 1)[0]

		const args = {
			dataObj,
			removedElement, 
			index, 
			way: ['weeks', weeksIndex, 'workers']
		}
		LocalStorage.saveRemovedElement(args)

		return true
	}

	// удаление прихода в бригаду за неделю
	static deleteRecieving(elementId, weekNumber) {
		
		const dataObj = LocalStorage.read()
		// находим индекс удаляемого элемента
		const weeksIndex = dataObj
			.weeks
			.findIndex( (week) => week.weekNumber === weekNumber)

		const index = dataObj
			.weeks[weeksIndex]
			.brigade
			.findIndex( (item) => {

			return item.id === +elementId
		})
		if (index < 0) return true

		// сохраняем удалённый злемент
		const removedElement = dataObj.weeks[weeksIndex].brigade.splice(index, 1)[0]

		const args = {
			dataObj,
			removedElement, 
			index, 
			way: ['weeks', weeksIndex, 'brigade']
		}
		LocalStorage.saveRemovedElement(args)

		return true
	}

	
	// удаление операции недели
	static deleteWeekItem(elementId, workerName, weekNumber) {
		
		const dataObj = LocalStorage.read()
		// находим индекс удаляемого элемента
		const weekIndex = dataObj
			.weeks
			.findIndex( (week) => week.weekNumber === weekNumber)

		const workerIndex = dataObj
			.weeks[weekIndex]
			.workers
			.findIndex( (worker) => worker.workerName == workerName)

		const index = dataObj
			.weeks[weekIndex]
			.workers[workerIndex]
			.workerWeekItems
			.findIndex( (item) => item.id == elementId)


		if (index < 0) return true

		// сохраняем удалённый злемент
		const removedElement = dataObj
			.weeks[weekIndex]
			.workers[workerIndex]
			.workerWeekItems
			.splice(index, 1)[0]

		const args = {
			dataObj,
			removedElement, 
			index, 
			way: ['weeks', weekIndex, 'workers', workerIndex,  'workerWeekItems']
		}
		LocalStorage.saveRemovedElement(args)
		
		return true
	}

	// удаление операции сдачи
	static deleteHandOverItems(elementId, workerName, weekNumber) {
		
		const dataObj = LocalStorage.read()
		// находим индекс удаляемого элемента

		const weekIndex = dataObj
			.weeks
			.findIndex( (week) => week.weekNumber === weekNumber)

		const workerIndex = dataObj
			.weeks[weekIndex]
			.workers
			.findIndex( (worker) => worker.workerName == workerName)

		const index = dataObj
			.weeks[weekIndex]
			.workers[workerIndex]
			.workerWeekHandOver
			.findIndex( (item) => item.id == elementId)
		
		if (index < 0) return true

		// сохраняем удалённый злемент
		const removedElement = dataObj
			.weeks[weekIndex]
			.workers[workerIndex]
			.workerWeekHandOver
			.splice(index, 1)[0]

		const args = {
			dataObj,
			removedElement, 
			index, 
			way: ['weeks', weekIndex, 'workers', workerIndex, 'workerWeekHandOver']
		}
		LocalStorage.saveRemovedElement(args)
		
		return true
	}

	// удаление плетения
	static deleteWeaving(elementId) {
		const dataObj = LocalStorage.read()
		// находим индекс удаляемого элемента
		const index = dataObj.weavings.findIndex( (weaving) => {

			return weaving.id === +elementId
		})
		if (index < 0) return true

		// сохраняем удалённый злемент
		const removedElement = dataObj.weavings.splice(index, 1)[0]

		const args = {
			dataObj,
			removedElement, 
			index, 
			way: ['weavings']
		}
		LocalStorage.saveRemovedElement(args)

		return true
	}

	// сохранить удалённый элемент
	static saveRemovedElement (args) {
		const {dataObj, removedElement, index, way} = args
		dataObj.removedElements = dataObj.removedElements || []

		dataObj.removedId = dataObj.removedId || 0

		const removedObj = {
			element: removedElement,
			time: LocalStorage.getTime(),
			id: ++dataObj.removedId,
			way,
			index
		}

		dataObj.removedElements.push(removedObj)

		LocalStorage.save(dataObj)
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
		const dataObj = LocalStorage.read() || {}
		return dataObj.removedElements = dataObj.removedElements || []
	}

	// восстановить удалённый элемент
	static restoreElement(id) {
		const dataObj = LocalStorage.read() || {}
		const removedArray = dataObj.removedElements || []

		for (let i = 0; i < removedArray.length; i++) {
			if (removedArray[i].id === +id) {
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
					
					return elem.id > removedArray[i].element.id
				})
				// удаляем элемент из корзины
				const restoredElement = removedArray.splice(i, 1)[0].element
				// вставляем элемент обратно в используемую часть БД
				if (index < 0) {
					restoreWay.push(restoredElement)
				} else {
					restoreWay.splice(index, 0, restoredElement)
				}


				LocalStorage.save(dataObj)

			}
		}
	}

	// проверить на старость удалённых элементов, отфильтровать и сохранить
	static checkTrashcanAndSave (dataObj) {
		// если массива удалённых элементов ещё нет, то отмена
		if (!dataObj.removedElements) return
		// миллисекунды сейчас
		const now = new Date().getTime()
		// обходим удаённые элементы в обратном порядке, чтобы при удалении текущего элемента не изменядлся индекс у ещё не пройденных
		for (let i = dataObj.removedElements.length - 1; i >= 0; i--) {
			// удаляем элементы старше недели, либо у которых дата создания не указана
			if (!dataObj.removedElements[i].ms || ((now - dataObj.removedElements[i].ms) > 604800000)) {
				dataObj.removedElements.splice(i, 1)
			}
		}
		// сохраняем объект с отфильтрованной корзиной в localStorage
		localStorage.setItem('bella-calculator', JSON.stringify(dataObj))

	}

	// получить вес всех предыдущих недель работника
	// или вес всех недель, если конкретная неделя не указана
	static getWeightPreviousWeekItems(workerName, weekNumber) {
		const dataObj = LocalStorage.read() || {}
		// строка нужна для правильной работы кнопки Назад при отсутствии работников
		dataObj.weeks = dataObj.weeks || []
		
		// обозначаем аккумулирующую переменную для веса
		let summWeight = 0
		// и для бонуса
		let summBonus = 0
		
		// обходим все недели, ищем в них работника по имени
		for (let i = 0; i < dataObj.weeks.length; i++) {

			// находим неделю, до которой будем считать
			if (dataObj.weeks[i].weekNumber === weekNumber) {

				summWeight = Math.round(summWeight * 10000) / 10000
				return {summWeight, summBonus}

			}

			// ищем работника по имени
			for (let j = 0; j < dataObj.weeks[i].workers.length; j++ ) {
				if (dataObj.weeks[i].workers[j].workerName === workerName) {

					// проходимся по элементам недели работника
					for (let k = 0; k < dataObj.weeks[i].workers[j].workerWeekItems.length; k++) {
						summWeight += dataObj.weeks[i].workers[j].workerWeekItems[k].value
					}

					let weekSalary = 0
					// проходимся по сдаче работника
					for (let k = 0; k < dataObj.weeks[i].workers[j].workerWeekHandOver.length; k++) {
						summWeight -= dataObj.weeks[i].workers[j].workerWeekHandOver[k].weightWithPercent
						weekSalary += dataObj.weeks[i].workers[j].workerWeekHandOver[k].price
					}

					let bonus = 0
					if (weekSalary > 6600) {
						bonus = Math.round((weekSalary - 6600) * 2) / 10
					}

					summBonus += bonus
				}
			}

		}
		// если искомой недели не нашлось, то возвращаем что насуммировали
		return {summWeight:  Math.round(summWeight * 10000) / 10000, summBonus: Math.round(summBonus * 10) / 10}
	}

	// получаем зарплату и сдачу за неделю для одного работника
	static getWeekBalance(workerName, weekNumber) {
		const oneWeekObj = LocalStorage.getOneWorkerWeek(workerName, weekNumber)
		// если недель нет совсем, то возвращаем всё по нулям
		if (!oneWeekObj) return {weekSalary: 0, weight: 0, weekTotalWeight: 0}


		let weekSalary = 0
		// вес сдачи за неделю с процентами
		let weight = 0
		// баланс за наделю
		let weekWeight = 0
		for (let i = 0; i < oneWeekObj.workerWeekItems.length; i++) {
			weekWeight += oneWeekObj.workerWeekItems[i].value
		}
		for (let i = 0; i < oneWeekObj.workerWeekHandOver.length; i++) {
			// weight += oneWeekObj.workerWeekHandOver[i].weightWithPercent
			weight += round(oneWeekObj.workerWeekHandOver[i].weightWithPercent)
			weekWeight -= round(oneWeekObj.workerWeekHandOver[i].weightWithPercent)
			weekSalary += round(oneWeekObj.workerWeekHandOver[i].price)
		}

		weekSalary = Math.round(weekSalary * 10) / 10
		
		// бонус за неделю
		let bonus = 0
		if (weekSalary > 6600) {
			bonus = Math.round((weekSalary - 6600) * 2) / 10
		}

		// вес с предыдущих недель
		const {summWeight, summBonus} = LocalStorage.getWeightPreviousWeekItems(workerName, weekNumber)
		const previousWeekWeight = summWeight
		// Общий баланс к концу недели
		const weekTotalWeight = Math.round((previousWeekWeight + weekWeight) * 1000) / 1000
		// сумма бонусов за все предыдущие недели и текущую
		const totalBonus = Math.round(summBonus * 10 + bonus * 10) / 10

		return {weekSalary: round(weekSalary), weight: round(weight), weekTotalWeight, bonus, totalBonus}

		function round(number) {
			return Math.round(number * 1000) / 1000
		}
	}

	// получаем сдачу всех работников за 1 неделю
	static weekHandOverAllWorkers (weekNumber) {
		const dataObj = LocalStorage.read() || {}
		dataObj.weeks = dataObj.weeks || []

		let workersWeekHandOverWeight = 0
		let workersWeekSalary = 0
		for (let i = 0; i < dataObj.weeks.length; i++) {
			if (dataObj.weeks[i].weekNumber === weekNumber) {
				// если нашли искомую неделю, то обходим всех работников
				for (let j = 0; j < dataObj.weeks[i].workers.length; j++) {
					// в каждом работнике обходим его сдачу за неделю
					for (let k = 0; k < dataObj.weeks[i].workers[j].workerWeekHandOver.length; k++) {
						workersWeekHandOverWeight += dataObj.weeks[i].workers[j].workerWeekHandOver[k].weightWithPercent
						workersWeekSalary += dataObj.weeks[i].workers[j].workerWeekHandOver[k].price
					}
				}

			}
		}
		return {
			workersWeekHandOverWeight: Math.round(workersWeekHandOverWeight * 1000) / 1000, 
			workersWeekSalary: Math.round(workersWeekSalary * 10) / 10
		}
	}

	// получаем остаток предыдущих недель для бригады
	static getPreviousBrigadeWeekWeight (weekNumber) {
		const dataObj = LocalStorage.read() || {}
		dataObj.weeks = dataObj.weeks || []

		let previousWeeksAllWorkersHandOverWeight = 0
		for (let i = 0; i < dataObj.weeks.length; i++) {
			if (dataObj.weeks[i].weekNumber === weekNumber) {
				return Math.round(previousWeeksAllWorkersHandOverWeight * 1000) / 1000
			}

			// суммируем приход в бригаду за конкретную неделю
			for (let j = 0; j < dataObj.weeks[i].brigade.length; j++) {
				previousWeeksAllWorkersHandOverWeight += dataObj.weeks[i].brigade[j].value
			}

			// суммируем сдачу всех работников за конкретную неделю
			for (let j = 0; j < dataObj.weeks[i].workers.length; j++) {
				// в каждом работнике обходим его сдачу за неделю
				for (let k = 0; k < dataObj.weeks[i].workers[j].workerWeekHandOver.length; k++) {
					previousWeeksAllWorkersHandOverWeight -= dataObj.weeks[i].workers[j].workerWeekHandOver[k].weightWithPercent
				}
			}

		}
	}

	// получаем остаток текущей недели для бригады, учитывая предыдущие
	static getCurrentBrigadeWeekWeight (weekNumber) {
		const dataObj = LocalStorage.read() || {}
		dataObj.weeks = dataObj.weeks || []

		let currentBrigadeWeight = LocalStorage.getPreviousBrigadeWeekWeight(weekNumber)
		for (let i = 0; i < dataObj.weeks.length; i++) {
			if (dataObj.weeks[i].weekNumber === weekNumber) {

				// суммируем приход в бригаду за конкретную неделю
				for (let j = 0; j < dataObj.weeks[i].brigade.length; j++) {
					currentBrigadeWeight += dataObj.weeks[i].brigade[j].value
				}

				// суммируем сдачу всех работников за конкретную неделю
				for (let j = 0; j < dataObj.weeks[i].workers.length; j++) {
					// в каждом работнике обходим его сдачу за неделю
					for (let k = 0; k < dataObj.weeks[i].workers[j].workerWeekHandOver.length; k++) {
						currentBrigadeWeight -= dataObj.weeks[i].workers[j].workerWeekHandOver[k].weightWithPercent
					}
				}

			}
		}
		return Math.round(currentBrigadeWeight * 1000) / 1000
	}

	// Получить остаток всех недель бригады
	static getAbsolutelyTotalWeight () {
		const dataObj = LocalStorage.read() || {}
		dataObj.weeks = dataObj.weeks || []

		let result = 0
		// находим номер последней недели
		if (dataObj.weeks.length) {
			const lastWeekNumber = dataObj.weeks[dataObj.weeks.length - 1].weekNumber
			result = LocalStorage.getCurrentBrigadeWeekWeight(lastWeekNumber)
		}
		return result
	}

	// получаем приход в бригаду за неделю
	static getBrigadeWeekReceive (weekNumber) {
		const brigadeArr = LocalStorage.getOneWeek(weekNumber).brigade || []

		// суммируем полученный бригадой вес
		const brigadeWeekRecieve = brigadeArr.reduce((accum,curr) => {
			return Math.round((accum + curr.value) * 1000) / 1000
		}, 0)
		return brigadeWeekRecieve
	}


}