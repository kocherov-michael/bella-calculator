import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import WorkerItem from './WorkerItem'
import Router from './Router'
import OperationItem from './OperationItem'
import HandOverPage from './HandOverPage'

export default class WeekItemsPage extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderWeekItemsPage(args)
	}

	// отрисовываем страницу бригады
	renderWeekItemsPage(args) {
		// console.log('WeekItemsPage args:', args)
		args.page = 'weekItems'
		const {page, workerName, weekNumber} = args
		args.isBrigadier = true
		super.createHeader(args)
		super.createHeaderBackArrow(page, 'brigade', weekNumber)
		// this.showPreviousWeight(page, name, weekNumber)
		this.addFieldList(page, workerName, weekNumber)
		super.showHeaderName(page, workerName, weekNumber)
		this.createSalaryItem(page, workerName, weekNumber)
		// this.showSalaryValues(args.page, args.workerName, args.weekNumber)
		this.createFormAddSingleOperation(page, workerName, weekNumber)
		// this.showFooterValues(page, name, weekNumber)
	}

	addFieldList (page, workerName, weekNumber) {
		// const { page, workerName = 'Я', weekNumber } = args
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''

		const oneWeekObj = LocalStorage.getOneWorkerWeek(workerName, weekNumber)
		console.log(oneWeekObj)
		oneWeekObj.workerWeekItems.forEach( (weekItem) => {
			
			const weekItemButton = new OperationItem({
				// родительский элемент
				field: itemFieldElement,
				// вес
				weight: weekItem.value,
				type: 'weekItem',
				workerName: name,
				weekNumber,
				// previous: weekItem.isPrevious,
				id: weekItem.id
			})
		})

	}

	// создаём главный элемент сдачи
	createSalaryItem (page, workerName, weekNumber) {
		// const {workerName, weekNumber, page} = args
		const salaryFieldElement = document.querySelector(`[data-salary-field="${page}"]`)

		// очищаем поле
		salaryFieldElement.innerHTML = ''

		// const {newElement} = new Item({
		// 	// родительский элемент
		// 	field: salaryFieldElement,
		// 	// вес
		// 	text: 'Сдача',
		// 	type: 'salary',
		// 	workerName: name,
		// 	weekNumber
		// })

		// const parentElement = args.field
		const newElement = document.createElement('div')
		newElement.classList.add('item')
		newElement.classList.add('salary-item')
		newElement.setAttribute('data-worker', workerName)
		newElement.setAttribute('data-next', 'handOverItems')
		newElement.setAttribute('data-week-number', weekNumber)

		newElement.innerHTML = 
		`<div class="item__header">
		<div class="item__header-text">Сдача</div>
		<div class="item__header-arrow">
			<div class="chevron"></div>
		</div>
	</div>

	<div class="item__uppper">
		<span>Зарплата:</span>
		<span data-week-salary>0</span>
		<span>&nbsp;₽</span>
	</div>

	<div class="item__lower">
		<span>Вес:</span>
		<span data-week-weight>0</span>
		<span>&nbsp;г</span>
	</div>`
		
		salaryFieldElement.prepend(newElement)

		newElement.addEventListener('click', () => {
			Router.changeNextPage({
				currentPageAttr: page, 
				nextPageAttr: 'handOverItems', 
				weekNumber,
				workerName
				// brigade: true
			})
		})

		
	}

	// создаём форму добавления простой операции в футере
	createFormAddSingleOperation (page, workerName, weekNumber) {
		const footerElement = document.querySelector(`[data-footer="${page}"]`)
		// если элемент уже есть, то удаляем его
		const footerOldActionElement = footerElement.querySelector('.footer__actions')
		if (footerOldActionElement)  {
			footerElement.removeChild(footerOldActionElement)
		}

		const footerActionElement = document.createElement('div')
		footerActionElement.classList.add('footer__actions')

		const formSingleOperationElement = document.createElement('div')
		formSingleOperationElement.classList.add('week-orepations')
		footerActionElement.append(formSingleOperationElement)

		// инпут для ввода веса
		const inputOperationElement = document.createElement('input')
		inputOperationElement.classList.add('week-orepations__input', 'input')
		inputOperationElement.setAttribute('placeholder', 'Введите вес')
		formSingleOperationElement.append(inputOperationElement)

		// кнопка Прибавить
		const addOperationElement = document.createElement('button')
		addOperationElement.classList.add('week-orepations__button', 'item', 'item_warning')
		addOperationElement.textContent = 'Прибавить'
		formSingleOperationElement.append(addOperationElement)

		// кнопка Вычесть
		const minusOperationElement = document.createElement('button')
		minusOperationElement.classList.add('week-orepations__button', 'item', 'item_subtract')
		minusOperationElement.textContent = 'Вычесть'
		formSingleOperationElement.append(minusOperationElement)

		footerElement.prepend(footerActionElement)

		// операция Добавить
		addOperationElement.addEventListener('click', () => {
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
		const ifEmpty = WeekItemsPage.showError(inputOperationElement, operationValue, '')
		if (ifEmpty) return
		
		const newItemValues = {
			workerName,
			weekNumber,
			singleOperation: operationValue
		}
		
		LocalStorage.saveOperation(newItemValues)
		// добавляем элемент на страницу
		this.addFieldList('weekItems', workerName, weekNumber)
		// обновляем показания в футуре
		// this.showFooterValues('weekItems', workerName, weekNumber)
		// очищаем инпут после ввода цифры
		inputOperationElement.value = ''
	}

	// показать, что инпут пустой
	static showError (element, currentValue, falseValue) {
		
		if (currentValue == falseValue) {
			element.classList.add('warning-input')
			setTimeout(() => {
				element.classList.remove('warning-input')
			}, 2000)
			return true
		}
	}



}