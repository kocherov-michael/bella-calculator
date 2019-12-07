import Storage from './Storage'
import Page from './Page'
// import StartPage from './StartPage'
// import WeeksListPage from './WeeksListPage'

export default class Handler {
	constructor (args = {}) {
		this.storage = new Storage()
		this.page = new Page()
		this.args = args
		

		if (args.menu) {
			this.menuHandler(args.menu)
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
			const operationValue = Math.abs(inputOperationElement.value.trim())
			Handler.addSingleOperationHandler(inputOperationElement, operationValue, workerName, weekNumber)
		})

		// операция Вычесть
		minusOperationElement.addEventListener('click', () => {
			const operationValue = Math.abs(inputOperationElement.value.trim()) * -1
			Handler.addSingleOperationHandler(inputOperationElement, operationValue, workerName, weekNumber)
		})
	}

	// обработка нажатий Прибавить и Вычесть в Операции
	static addSingleOperationHandler (inputOperationElement, operationValue, workerName, weekNumber) {

		// Если ничего не введено, то предупреждаем пользователя
		if (!operationValue) {
			inputOperationElement.classList.add('warning-input')
			inputOperationElement.placeholder = 'Введите число'
			inputOperationElement.value = ''
			setTimeout(() => {
				inputOperationElement.classList.remove('warning-input')
			}, 1000)
			return 
		}
		const newItemValues = {
			workerName,
			weekNumber,
			singleOperation: operationValue
		}
		Storage.saveOperation(newItemValues)
	}


	// открыть / скрыть меню в шапке 
	menuHandler (page) {
		const sectionElement =  document.querySelector(`[data-page="${page}"]`)
		const headerMenuElement = sectionElement.querySelector('[data-header-menu]')
		const headerMenuListElement = sectionElement.querySelector('[data-menu-list]')

		headerMenuElement.addEventListener('click', () => {
			headerMenuElement.classList.toggle('cross')
			headerMenuListElement.classList.toggle('menu-show')
		} )

		
	}
	
	// Обработчик кнопки Добавить сотрудника / неделю
	addItemHandler (page) {
		// console.log('смотри сюда', this)
		// текущая страница
		const sectionElement =  document.querySelector(`[data-page="${page}"]`)
		// кнопка Добавить
		const addNewElement = sectionElement.querySelector(`[data-add=${page}]`)
		addNewElement.setAttribute('data-current-worker', this.args.workerName)

		// вешаем обработчик на кнопку Сохранить формы добавления сотрудника
		const addFormElement =  document.querySelector(`[data-add-form=${page}]`)
		const activeFormElement =  addFormElement.querySelector(`[data-active-form]`)

		this.formHandler(addFormElement)
		this.activeFormElement = activeFormElement
		this.addFormElement = addFormElement

		addNewElement.addEventListener('click', () => {
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
		const currentWorker = addButtonElement.getAttribute('data-current-worker')
		// console.log(addButtonElement, this.args.workerName, currentWorker)
		// если имя работника в объекте и в вёрстке не совпадает, то стоп
		if (currentWorker !== this.args.workerName && this.args.addItem !== 'start') {
			return
		}

		const newItemValues = {
			workerName: this.args.workerName
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

		}
		if (newItemValues.inputValue) {

		}
		const result = this.storage.save(newItemValues)
		if (!result) return
		this.closeForm()
		this.page.addFieldList(this.args.addItem, nameForRender)
		// this.storage.read()
	}


	// обработчик нажатия на обычный элемент
	itemHandler(element) {
		// console.log(element)
		element.addEventListener('click', () => {
			// const name = element.querySelector('[data-item-name]').textContent
			const name = element.getAttribute('data-worker')
			const nextAttr = element.getAttribute('data-next')
			const currentParentElement = element.closest('[data-item-field]')
			const currentAttr = currentParentElement.getAttribute('data-item-field')
			const weekNumber = element.getAttribute('data-week-number')

			let dataObj
			if (currentAttr === 'start') {
				// загружаем недели для работника
				dataObj = Storage.getWorkerWeeks(name)
				// console.log(dataObj)
			}
			else if (currentAttr === 'weeksList') {
				// загружаем элементы для недели
				dataObj = Storage.getOneWeek(name, weekNumber)
			}
			else if (currentAttr === 'weekItems') {
				if (nextAttr === 'handOver') {
					// загружаем элементы для сдачи
					dataObj = Storage.getHandOverItems(name, weekNumber)
				} else {
					if (element.classList.contains ('closed')) {
						element.classList.remove('closed')
						setTimeout( () => {element.classList.remove('hidetext')}, 400)
					} else {
						element.classList.add('hidetext')
						setTimeout( () => {element.classList.add('closed')}, 400)
					}
					return
				}
				
			}
			
			// определяем текущую и следующую страницы
			const nextPage = document.querySelector(`[data-page="${nextAttr}"]`)
			const currentPage = document.querySelector(`[data-page="${currentAttr}"]`)

			this.page.changeNextPage(dataObj, currentPage, nextPage, name, weekNumber)
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
			const targetPageWorkerAttr = backButtonElement.getAttribute('data-header-back-worker')
			const targetPageElement = document.querySelector(`[data-page=${targetPageAttr}]`)
			// console.log(targetPage)
			this.page.changePreviousPage('', currentPageElement, targetPageElement, targetPageWorkerAttr)
			backButtonElement = null
		})
	}

}