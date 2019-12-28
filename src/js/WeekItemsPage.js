import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import Router from './Router'
import OperationItem from './OperationItem'

export default class WeekItemsPage extends DefaultPage {
	constructor (args = {}) {
		super(args)
		this.page = 'weekItems'
		this.workerName = args.workerName
		this.weekNumber = args.weekNumber
		this.renderWeekItemsPage(args)
	}

	// отрисовываем страницу недели работника
	renderWeekItemsPage(args) {
		args.page = 'weekItems'
		const {page, workerName, weekNumber} = args
		super.createHeader(args)
		super.createHeaderBackArrow(page, 'brigade', weekNumber)
		this.showPreviousWeight()
		this.addFieldList()
		super.showHeaderName(page, workerName, weekNumber)
		this.createSalaryItem()
		super.createFormAddSingleOperation(page, workerName, weekNumber)
		this.showFooterValues(page, workerName, weekNumber)
	}

	addFieldList () {
		const itemFieldElement = document.querySelector(`[data-item-field="${this.page}"]`)
	
		itemFieldElement.innerHTML = ''

		const oneWeekObj = LocalStorage.getOneWorkerWeek(this.workerName, this.weekNumber)
		oneWeekObj.workerWeekItems.forEach( (weekItem) => {
			
			const weekItemButton = new OperationItem({
				// родительский элемент
				field: itemFieldElement,
				// вес
				weight: weekItem.value,
				type: 'weekItem',
				workerName: this.workerName,
				weekNumber: this.weekNumber,
				id: weekItem.id
			})

			// вешаем прослушку перетаскивания для удаления
			super.itemTouchHandler(weekItemButton.element)
		})

	}

	// показываем остаток с предфдущих недель
	showPreviousWeight() {
		const previousWeightElement = document.querySelector('[data-previous-weight="weekItems"]')
		const {summWeight} = LocalStorage.getWeightPreviousWeekItems(this.workerName, this.weekNumber)
		previousWeightElement.textContent = `${summWeight}`
	}

	// создаём главный элемент сдачи
	createSalaryItem () {
		const salaryFieldElement = document.querySelector(`[data-salary-field="${this.page}"]`)
		const isBrigadier = LocalStorage.isBrigadier()

		// очищаем поле
		salaryFieldElement.innerHTML = ''

		// получаем вес сдачи и зарплату
		const {weekSalary, weight, bonus, totalBonus} = LocalStorage.getWeekBalance(this.workerName, this.weekNumber)

		// const parentElement = args.field
		const newElement = document.createElement('div')
		newElement.classList.add('item')
		newElement.classList.add('salary-item')
		newElement.setAttribute('data-worker', this.workerName)
		newElement.setAttribute('data-next', 'handOverItems')
		newElement.setAttribute('data-week-number', this.weekNumber)
		let nonBrigadierTemplate = ''
		
		// если не бригадир, то добавим поле с бонусами
		if (!isBrigadier) {
			nonBrigadierTemplate = 
			`<div class="item__lower">
			<span>Бонусные (всего):</span>
			<span>${bonus} (${totalBonus})</span>&nbsp;
			<span>руб</span>
		</div>`
		}

		newElement.innerHTML = 
		`<div class="item__header">
		<div class="item__header-text">Сдача</div>
		<div class="item__header-arrow">
			<div class="chevron"></div>
		</div>
	</div>
	<div class="item__uppper">
		<span>Вес:</span>
		<span data-week-weight>${weight}</span>
		<span>&nbsp;г</span>
	</div>
	<div class="item__lower">
		<span>Зарплата:</span>
		<span data-week-salary>${weekSalary}</span>
		<span>&nbsp;руб</span>
	</div>
	${nonBrigadierTemplate}`
		
		salaryFieldElement.prepend(newElement)

		newElement.addEventListener('click', () => {
			Router.changeNextPage({
				currentPageAttr: this.page, 
				nextPageAttr: 'handOverItems', 
				weekNumber: this.weekNumber,
				workerName: this.workerName
			})
		})

		
	}

	// удаление элемента
	deleteElement(elementId, weekNumber, elementWorker) {
		LocalStorage.deleteWeekItem(elementId, elementWorker, weekNumber)
	}

	// показать значения в футере
	showFooterValues() {
		const footerElement = document.querySelector(`[data-footer="${this.page}"]`)
		
		const {weekSalary, weight, weekTotalWeight} = LocalStorage.getWeekBalance(this.workerName, this.weekNumber)

		// 1 неделя
		const footerWeekWeightElement = footerElement.querySelector('[data-week-total]')
		if (footerWeekWeightElement) footerWeekWeightElement.textContent = weekTotalWeight
	}


}