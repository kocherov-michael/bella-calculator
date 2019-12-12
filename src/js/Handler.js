import Storage from './Storage'
import Page from './Page'
// import StartPage from './StartPage'
// import WeeksListPage from './WeeksListPage'

export default class Handler {
	constructor (args = {}) {
		this.page = new Page()
		this.args = args
		

		if (args.menu) {
			this.menuHandler(args)
		}
		// кнопка назад в шапке
		if (args.backButton) {
			this.backButtonHandler(args.backButton)
		}
		if (args.addItem) {
			this.addItemHandler(args.addItem)
		}
		if (args.itemHandler) {
			this.itemHandler(args.itemHandler)
		}
		if (args.addSingleOperation) {
			this.addSingleOperationFormHandler(args.workerName, args.addSingleOperation)
		}
		if (args.addHandOverOperation) {
			this.addHandOverOperation(args.page, args.name, args.weekNumber)
		}
		
	}

	// форма добавления строки сдачи
	addHandOverOperation (page, workerName, weekNumber) {
		const footerActionElement = document.querySelector(`[data-footer-action="${page}"]`)
		const handOverFormElement = footerActionElement.querySelector(`[data-hand-over-operations="${workerName}"]`)
		const weightInputElement = handOverFormElement.querySelector(`[data-input-weight="${weekNumber}"]`)
		const countInputElement = handOverFormElement.querySelector(`[data-input-count="${weekNumber}"]`)
		const weavingSelectElement = handOverFormElement.querySelector(`[data-select-weaving="${weekNumber}"]`)
		const lengthSelectElement = handOverFormElement.querySelector(`[data-select-length="${weekNumber}"]`)
		const handOverButtonElement = handOverFormElement.querySelector(`[data-hand-over-button="${weekNumber}"]`)

		// операция добавить к сдаче
		handOverButtonElement.addEventListener('click', (event) => {
			event.preventDefault()

			// если какое-то полу не заполнено, то предупреждаем пользователя
			const weightIsEmpty = Handler.showError(weightInputElement, weightInputElement.value, '')
			const countIsEmpty = Handler.showError(countInputElement, countInputElement.value, '')
			const weavingIsEmpty = Handler.showError(weavingSelectElement, weavingSelectElement.value, 'choose')
			if (weightIsEmpty || countIsEmpty || weavingIsEmpty) return

			// получаем параметры плетения для вычисления сдачи
			const {weavingName, percent, chain, bracelet} = Storage.getOneWeaving(weavingSelectElement.value)
			
			// количество
			const count = Math.floor(+countInputElement.value)
			// цепь - правда или браслет - ложь
			const isChain = Boolean(+lengthSelectElement.value)
			// цена на цепь либо браслет
			const price = (isChain ? chain : bracelet) * count

			// создаём объект для записи в память сдачи
			const handOverObj = {
				weight: Math.round(+weightInputElement.value * 10000) / 10000,
				weightWithPercent: Handler.getWeightWithPercent(+weightInputElement.value, percent),
				weaving: weavingSelectElement.value,
				count,
				isChain,
				percent,
				price
			}
			// console.log(handOverObj)

			const newHandOverValues = {
				workerName,
				weekNumber,
				handOverOperation: handOverObj
			}
			
			// console.log(newHandOverValues)
			Storage.saveHandOverOperation(newHandOverValues)
			this.page.addFieldList(page, workerName, weekNumber)
			this.page.showFooterValues(page, workerName, weekNumber)

			// после ввода операции сбрасываем вес и количество
			weightInputElement.value = ''
			countInputElement.value = ''
		})

	}

	// форма добавления строки операции
	addSingleOperationFormHandler (workerName, weekNumber) {
		const footerElement = document.querySelector(`[data-footer="weekItems"]`)
		const formSingleOperationElement = footerElement.querySelector(`[data-form-add-operation-worker-name="${workerName}"]`)
		const inputOperationElement = formSingleOperationElement.querySelector(`[data-input-week-operation="${weekNumber}"]`)
		const addOperationElement = formSingleOperationElement.querySelector(`[data-addbutton-operation="${weekNumber}"]`)
		const minusOperationElement = formSingleOperationElement.querySelector(`[data-minusbutton-operation="${weekNumber}"]`)
		
		// операция Добавить
		addOperationElement.addEventListener('click', () => {
			// console.log('here')
			const operationValue = Math.abs(inputOperationElement.value.trim())
			this.addSingleOperationHandler(inputOperationElement, operationValue, workerName, weekNumber)
		})

		// операция Вычесть
		minusOperationElement.addEventListener('click', () => {
			const operationValue = Math.abs(inputOperationElement.value.trim()) * -1
			this.addSingleOperationHandler(inputOperationElement, operationValue, workerName, weekNumber)
		})
	}

	// обработка нажатий Прибавить и Вычесть в Операции
	addSingleOperationHandler (inputOperationElement, operationValue, workerName, weekNumber) {

		// Если ничего не введено, то предупреждаем пользователя
		const ifEmpty = Handler.showError(inputOperationElement, operationValue, '')
		if (ifEmpty) return
		
		const newItemValues = {
			workerName,
			weekNumber,
			singleOperation: operationValue
		}
		// console.log(newItemValues)
		Storage.saveOperation(newItemValues)
		// console.log('weekItems', workerName, weekNumber)
		this.page.addFieldList('weekItems', workerName, weekNumber)
		this.page.showFooterValues('weekItems', workerName, weekNumber)
		// console.log(document.body.scrollHeight)
		// window.scrollTo(0, 10000)
	}

	// показать, что инпут пустой
	static showError (element, currentValue, falseValue) {
		// console.log('error', currentValue == falseValue  )
		if (currentValue == falseValue) {
			element.classList.add('warning-input')
			setTimeout(() => {
				element.classList.remove('warning-input')
			}, 2000)
			return true
		}
	}


	// открыть / скрыть меню в шапке 
	menuHandler (args) {
		const sectionElement =  document.querySelector(`[data-page="${args.page}"]`)
		const headerMenuElement = sectionElement.querySelector('[data-header-menu]')
		const headerMenuListElement = sectionElement.querySelector('[data-menu-list]')
		const weavingLinkElement = sectionElement.querySelector('[data-weaving-link]')
		const quotationLinkElement = sectionElement.querySelector('[data-quotation-link]')


		headerMenuElement.addEventListener('click', () => {
			headerMenuElement.classList.toggle('cross')
			headerMenuListElement.classList.toggle('menu-show')
		} )

		weavingLinkElement.addEventListener('click', () => {
			
			this.page.changeNextPage(args.page, 'weavingList', args.name, args.weekNumber)

			setTimeout(() => {
				headerMenuElement.classList.toggle('cross')
				headerMenuListElement.classList.toggle('menu-show')
			}, 400)
			
		})

		quotationLinkElement.addEventListener('click', () => {
			
			this.page.changeNextPage(args.page, 'quotation', args.name, args.weekNumber)

			setTimeout(() => {
				headerMenuElement.classList.toggle('cross')
				headerMenuListElement.classList.toggle('menu-show')
			}, 400)
			
		})
		
	}
	
	// Обработчик кнопки Добавить сотрудника / неделю / плетение
	addItemHandler (page) {
		// текущая страница
		const sectionElement =  document.querySelector(`[data-page="${page}"]`)
		// кнопка Добавить
		const addButtonElement = sectionElement.querySelector(`[data-add=${page}]`)
		addButtonElement.setAttribute('data-current-worker', this.args.workerName)

		// Обёртка с затемнением
		const addFormElement =  document.querySelector(`[data-add-form=${page}]`)
		// Ищем этот элемент чтобы скрыть раньше обёртки, а показать позже
		const activeFormElement =  addFormElement.querySelector(`[data-active-form]`)
		
		// вешаем обработчик на кнопку Сохранить и Отмена формы добавления сотрудника
		this.formHandler(addFormElement)
		this.activeFormElement = activeFormElement
		this.addFormElement = addFormElement

		// показваем форму при нажатии Добавить+
		addButtonElement.addEventListener('click', () => {
			addFormElement.classList.remove('hide')
			setTimeout( () => {
				addFormElement.classList.remove('opacity')
			}, 0)
			setTimeout( () => {
				activeFormElement.classList.remove('opacity')
			}, 200)
		})
	}

	// Обработчик кнопок Сохранить и Отмена
	formHandler (addFormElement) {
		this.formElement = addFormElement
		const saveButtonElement = addFormElement.querySelector('[data-save-button]')
		const cancelButtonElement = addFormElement.querySelector('[data-cancel-button]')
		const closeIconElement = addFormElement.querySelector('[data-close-icon]')

		saveButtonElement.addEventListener('click', this.saveFormValues.bind(this))

		cancelButtonElement.addEventListener('click', this.closeForm.bind(this))
		closeIconElement.addEventListener('click', this.closeForm.bind(this))
	}

	// закрываем форму
	closeForm () {
		// очищаем все инпуты при закрытии формы
		const inputsList = this.formElement.querySelectorAll('input')
		for (let i = 0; i < inputsList.length; i++) {
			inputsList[i].value = ''
		}

		this.activeFormElement.classList.add('opacity')
		this.addFormElement.classList.add('opacity')
		setTimeout( () => {
			this.formElement.classList.add('hide')
		}, 400)
	}

	// Сохраняем введённые значения формы
	saveFormValues() {
		// кнопка Добавить, берём у неё имя работника
		const addButtonElement =  document.querySelector(`[data-add="${this.args.addItem}"]`)

		const newItemValues = {}

		if (this.args.workerName) {
			newItemValues.workerName = this.args.workerName
		}
		// сохраняем имя, если работник уже создан
		const nameForRender = this.args.workerName

		const inputsList = this.formElement.querySelectorAll('input')

		// проходимся по всем инпутам
		for (let i = 0; i < inputsList.length; i++) {
			// если инпут пустой - отмена
			if (!inputsList[i].value.trim()) {
				inputsList[i].value = ''
				return inputsList[i]
			}
			// по ключу инпута записываем его значение
			newItemValues[inputsList[i].name] = inputsList[i].value
			// console.log(inputsList[i].value)
		}

		// если страница добавления плетения
		if (this.args.page === 'weavingList') {
			const result = Storage.saveWeavingItem(newItemValues)

			// если уже есть такое название плетения, то отмена
			if (!result) return
			
			this.closeForm()
			this.page.addFieldList('weavingList')

		} else if (this.args.page === 'start') {

			const result = Storage.saveWorker(newItemValues)
			if (!result) return
			this.closeForm()
			this.page.addFieldList(this.args.addItem, nameForRender)
		}
		else if (this.args.page === 'weeksList') {
			// если сохраняем неделю
			console.log('сохраняем неделю')
			const result = Storage.saveOneWeek(newItemValues)
			if (!result) return
			this.closeForm()
			this.page.addFieldList(this.args.addItem, nameForRender)
		}
		else {
			console.log('ошибка в обработчике')
		}
	}


	// обработчик нажатия на обычный элемент
	itemHandler(element) {

		element.addEventListener('click', () => {
			const name = element.getAttribute('data-worker')
			const nextAttr = element.getAttribute('data-next')
			const currentParentElement = element.closest('[data-item-field]')
			const currentAttr = currentParentElement ? currentParentElement.getAttribute('data-item-field') 
				: element.closest('[data-field]').getAttribute('data-field')
			const weekNumber = element.getAttribute('data-week-number')

			// показываем / скрываем промежуточный баланс
			if (!nextAttr & currentAttr === 'weekItems') {
				if (element.classList.contains ('closed')) {
					element.classList.remove('closed')
					setTimeout( () => {element.classList.remove('hidetext')}, 400)
				} else {
					element.classList.add('hidetext')
					setTimeout( () => {element.classList.add('closed')}, 400)
				}
				return
			}
			
			this.page.changeNextPage(currentAttr, nextAttr, name, weekNumber)
		})
	}


	// обработчик на кноку назад в шапке
	backButtonHandler (page) {
		const currentPageElement = document.querySelector(`[data-page=${page}]`)
		let backButtonElement = currentPageElement.querySelector('[data-header-back]')

		// если на странице нет стрелки назад - прерываем выполнение
		if (!backButtonElement) return

		backButtonElement.addEventListener('click', () => {
			// backButtonElement
			const targetPageAttr = backButtonElement.getAttribute('data-header-back')
			const targetPageWeekAttr = backButtonElement.getAttribute('data-header-back-week')
			const targetPageWorkerAttr = backButtonElement.getAttribute('data-header-back-worker')
			// const targetPageElement = document.querySelector(`[data-page=${targetPageAttr}]`)
			// console.log(targetPage)
			this.page.changePreviousPage(page, targetPageAttr, targetPageWorkerAttr, targetPageWeekAttr)
			backButtonElement = null
		})

	}
	
	// получаем вес с процентами по весу
	static getWeightWithPercent (weight, percent) {
		return Math.round(weight * 10000 + weight * percent * 10000 / 100) / 10000
	}
}