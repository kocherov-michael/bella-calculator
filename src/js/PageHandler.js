import LocalStorage from './LocalStorage'
import Router from './Router'
// import DefaultPage from './DefaultPage'

export default class PageHandler {
// export default class PageHandler extends DefaultPage {
	constructor (args = {}) {
		// super(args)
		// this.args = args

		// if (args.addItem) {
		// 	this.addItemHandler(args.addItem)
		// }
	}

	// Обработчик кнопки Добавить сотрудника / неделю / плетение
	addItemHandler (args) {
		const { page, workerName, addButtonElement } = args
		this.handlerArgs = args
		// console.log(addButtonElement)
		// текущая страница
		const sectionElement =  document.querySelector(`[data-page="${page}"]`)
		// кнопка Добавить
		// const addButtonElement = sectionElement.querySelector(`[data-add="${page}"]`)
		// addButtonElement.setAttribute('data-current-worker', this.args.workerName)
		// if ( workerName) {
		// 	addButtonElement.setAttribute('data-current-worker', workerName)
		// }

		// Обёртка с затемнением
		const addFormElement =  document.querySelector(`[data-add-form="${page}"]`)
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
		
		const pageAttr = addFormElement.getAttribute('data-add-form')
		// если страница - восстановления элементов
		if (pageAttr === 'garbageList') {
			this.restoreItem()
		}
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
		// const addButtonElement =  document.querySelector(`[data-add="${this.args.addItem}"]`)

		const newItemValues = {}
		console.log('this.handlerArgs', this.handlerArgs)

		// если сохраняем работника, то номер недели уже должен быть
		if (this.handlerArgs.weekNumber) {
			newItemValues.weekNumber = this.handlerArgs.weekNumber
		}

		// if (this.args.workerName) {
		// 	newItemValues.workerName = this.args.workerName
		// }
		// сохраняем имя, если работник уже создан
		// const nameForRender = this.args.workerName

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

		// если страница добавления плетения
		// if (this.args.page === 'weavingList') {
		if (this.handlerArgs.page === 'weavingList') {
			const result = LocalStorage.saveWeavingItem(newItemValues)

			// если уже есть такое название плетения, то отмена
			if (!result) return
			
			this.closeForm()
			// this.page.addFieldList('weavingList')
			console.log('добавили плетение, а предыдущая страница не сохранилась в атрибутах')
			Router.loadPage({page: 'weavingList'})

		// } else if (this.args.page === 'start') {
		} else if (this.handlerArgs.page === 'start') {

			const result = Storage.saveWorker(newItemValues)
			if (!result) return
			this.closeForm()
			// this.page.addFieldList(this.args.addItem, nameForRender)
		}


		// else if (this.args.page === 'weeksList') {
		else if (this.handlerArgs.page === 'weeksList') {
			// если сохраняем неделю
			// const result = Storage.saveOneWeek(newItemValues)

			// newoop
			const result = LocalStorage.saveOneWeek(newItemValues)
			if (!result) return
			this.closeForm()
			// this.page.addFieldList(this.args.addItem, nameForRender)

			//newoop
			// Router.loadPage({page: 'weeksList'})
			
			this.addFieldList({page: 'weeksList'})
		}
		// else if (this.args.page === 'brigade') {
		else if (this.handlerArgs.page === 'brigade') {
			const result = LocalStorage.saveWorker(newItemValues)
			if (!result) return
			this.closeForm()
			// Router.loadPage({page: 'brigade', weekNumber: this.args.weekNumber})
			// Router.loadPage({page: 'brigade', weekNumber: this.handlerArgs.weekNumber})
			this.addFieldList({page: 'brigade', weekNumber: this.handlerArgs.weekNumber})
		}

		else {

			console.log('ошибка в обработчике')
		}
	}

	// обработчик перетаскивания обычного элемента
	itemTouchHandler (element) {
		const touchArray = []
		let firstTapPosition = null

		element.addEventListener("touchmove", (event) => {
			event.stopPropagation()
			// обозначаем перетаскиваемый элемент
			const draggedElement = event.currentTarget
			
			let touchPoint = event.changedTouches[0].pageX
			if (!firstTapPosition) {
				firstTapPosition = touchPoint
			}
			touchArray.push(touchPoint)
			
			let difference = firstTapPosition - touchPoint
			
			// поле, в котором находится элемент
			const fieldElement = draggedElement.closest('[data-field]')
			
			if ( difference > 0) {
				// элемент не виден, когда выходит за границы поля
				fieldElement.style.overflow = 'hidden'
				// перемещаем элемент в горизонтальной плоскости
				draggedElement.style.marginLeft = `-${difference}px`
				draggedElement.style.marginRight = `${difference}px`

				// Удаляем элемент операции
				if ( difference > 200 ) {
					const pageAttr = fieldElement.getAttribute('data-field')

					const elementId = draggedElement.getAttribute('data-id')
					const elementWorker = draggedElement.getAttribute('data-worker')
					const weekNumber = draggedElement.getAttribute('data-week-number')

					// console.log(elementId, pageAttr, elementWorker, weekNumber)
					// удаляем элемент из памяти
					PageHandler.deleteElement(elementId, pageAttr, elementWorker, weekNumber)
					draggedElement.classList.add('deleted')
					
					if (elementWorker) {
						// this.page.showFooterValues(pageAttr, elementWorker, weekNumber)
					}

					setTimeout( () => {

						draggedElement.style.display = 'none'
					}, 200)

				}
			}

			// если отпускаем палец, то элемент возвращается обратно
			draggedElement.addEventListener('touchend', (event) => {
				event.stopPropagation()
				touchArray.length = 0
				firstTapPosition = null
				draggedElement.style.transition = 'all 0.4s ease'
				draggedElement.style.marginLeft = ''
				draggedElement.style.marginRight = ''
				// после возвращения элемента на место плавность отключаем
				setTimeout( () => {
					fieldElement.style.overflow = 'auto'
					draggedElement.style.transition = ''
				}, 400)
			})
			
		} )
	}

	// удаление элемента
	static deleteElement(elementId, pageAttr, elementWorker, weekNumber) {
		if (pageAttr === 'weeksList') {
			LocalStorage.deleteWeek(elementId)
		}
		else if ( pageAttr === 'brigade') {
			LocalStorage.deleteWorker(elementId, weekNumber)
		}
		else if (pageAttr === 'weekItems') {
			LocalStorage.deleteWeekItem(elementId, elementWorker, weekNumber)
		}
		else if (pageAttr === 'handOverItems') {
			LocalStorage.deleteHandOverItems(elementId, elementWorker, weekNumber)
		}
		else if (pageAttr === 'weavingList') {
			LocalStorage.deleteWeaving(elementId)
		}
	}



}