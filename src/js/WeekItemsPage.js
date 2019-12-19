import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import WorkerItem from './WorkerItem'
import Router from './Router'

export default class WeekItemsPage extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderWeekItemsPage(args)
	}

	// отрисовываем страницу бригады
	renderWeekItemsPage(args) {
		console.log('WeekItemsPage args:', args)
		args.isBrigadier = true
		args.page = 'weekItems'
		super.createHeader(args)
		super.createHeaderBackArrow(args.page, 'brigade', args.weekNumber)
		// this.showPreviousWeight(page, name, weekNumber)
		this.addFieldList(args)
		super.showHeaderName(args.page, args.workerName, args.weekNumber)
		this.createSalaryItem(args.page, args.workerName, args.weekNumber)
		// this.showSalaryValues(args.page, args.workerName, args.weekNumber)
		this.createFormAddSingleOperation(args.page, args.workerName, args.weekNumber)
		// this.showFooterValues(page, name, weekNumber)
	}

	addFieldList (args) {

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

		footerActionElement.innerHTML = 
		`<div class="week-orepations" data-form-add-operation-worker-name="${workerName}">
			<input type="number" class="week-orepations__input input" placeholder="Введите вес" data-input-week-operation="${weekNumber}">
			
			<button class="week-orepations__button item item_warning" data-addbutton-operation="${weekNumber}">Прибавить</button>
			<button class="week-orepations__button item item_subtract" data-minusbutton-operation="${weekNumber}">Вычесть</button>

		</div>`
		
		footerElement.prepend(footerActionElement)
	}



}