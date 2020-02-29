import LocalStorage from './LocalStorage'

export default class PageHandler {
	constructor (args = {}) {
	}

	// Обработчик кнопки Добавить сотрудника / неделю / плетение
	// 
	addItemHandler (args) {
		const { page, workerName, addButtonElement } = args
		this.handlerArgs = args
		// текущая страница
		const sectionElement =  document.querySelector(`[data-page="${page}"]`)
		// кнопка Добавить

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
			
			// высчитываем номер недели, следующий за последней в списке
			// если страница - список недель
			if (this.addDefaultWeekNumber){
				this.addDefaultWeekNumber(addFormElement)
			}

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
		// this.formElement = addFormElement
		this.addFormElement = addFormElement
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
		const inputsList = this.addFormElement.querySelectorAll('input')
		for (let i = 0; i < inputsList.length; i++) {
			inputsList[i].value = ''
		}

		this.activeFormElement.classList.add('opacity')
		this.addFormElement.classList.add('opacity')
		setTimeout( () => {
			this.addFormElement.classList.add('hide')
		}, 400)

	}

	// Сохраняем введённые значения формы
	saveFormValues() {

		const newItemValues = {}

		// если сохраняем работника, то номер недели уже должен быть
		if (this.handlerArgs.weekNumber) {
			newItemValues.weekNumber = this.handlerArgs.weekNumber
		}

		const inputsList = this.addFormElement.querySelectorAll('input')

		// проходимся по всем инпутам
		let checkFieldEmpty = 1
		for (let i = 0; i < inputsList.length; i++) {

			// если инпут пустой - отмена
			const fieldIsEmpty = this.showError(inputsList[i], inputsList[i].value)
			if (fieldIsEmpty) {
				checkFieldEmpty *= 0
				// продолжаем цикл чтобы проверить все поля
				continue
			}
			// по ключу инпута записываем его значение
			newItemValues[inputsList[i].name] = inputsList[i].value
		}
		// если какой либо из полей было пустым, то значение будет = 0
		if (!checkFieldEmpty) return

		// сохраняем новые элементы
		this.savePageItem(newItemValues)
	}

	// обработчик перетаскивания обычного элемента
	// 
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
			
			if ( difference > 40) {
				// элемент не виден, когда выходит за границы поля
				fieldElement.style.overflow = 'hidden'
				// перемещаем элемент в горизонтальной плоскости
				draggedElement.style.marginLeft = `-${difference - 40}px`
				draggedElement.style.marginRight = `${difference - 40}px`

				// Удаляем элемент операции
				if ( difference > 250 ) {
					const pageAttr = fieldElement.getAttribute('data-field')

					const elementId = draggedElement.getAttribute('data-id')
					const elementWorker = draggedElement.getAttribute('data-worker')
					const weekNumber = draggedElement.getAttribute('data-week-number')

					// console.log(elementId, pageAttr, elementWorker, weekNumber)
					// удаляем элемент из памяти
					this.deleteElement(elementId, weekNumber, elementWorker )
					// PageHandler.deleteElement(elementId, pageAttr, elementWorker, weekNumber)
					draggedElement.classList.add('deleted')
					
					if (elementWorker) {
						// this.page.showFooterValues(pageAttr, elementWorker, weekNumber)
						this.showFooterValues(this.page, this.workerName, this.weekNumber)
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

	// обработка нажатий Прибавить и Вычесть в Операции
	// 
	addSingleOperationHandler (inputOperationElement, operationValue, workerName, weekNumber) {

		// Если ничего не введено, то предупреждаем пользователя
		const ifEmpty = this.showError(inputOperationElement, operationValue)
		if (ifEmpty) return
		
		const newItemValues = {
			workerName,
			weekNumber,
			singleOperation: operationValue
		}

		if (this.page === 'weekItems') {
			LocalStorage.saveOperation(newItemValues)
		}
		else if (this.page === 'brigadeBalanceList') {
			LocalStorage.saveBrigadeOperation(newItemValues)
		}
		
		// добавляем элемент на страницу

		this.addFieldList(this.page, workerName, weekNumber)

		// обновляем показания в футуре
		this.showFooterValues(this.page, workerName, weekNumber)
		// очищаем инпут после ввода цифры
		inputOperationElement.value = ''
		// фокус на инпут чтобы клавиатура не пропадала
		inputOperationElement.focus()
	}

	// показать, что инпут пустой
	// 
	showError (element, currentValue) {
		const regular = /[\\!@#$%^&*()_"']/;
		// проверка на заполненность поля и на запрещённые знаки
		if (currentValue == "" || regular.test(currentValue)) {
			element.classList.add('warning-input')
			setTimeout(() => {
				element.classList.remove('warning-input')
			}, 2000)
			return true
		}
	}



}