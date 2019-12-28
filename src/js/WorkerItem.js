import LocalStorage from './LocalStorage'
import Router from './Router'

export default class WorkerItem {
	constructor (args = {}) {
		this.args = args
		this.workerName = args.workerName
		this.weekNumber = args.weekNumber
		this.element = this.create(args)
		this.itemHandler(this.element)
	}

	create (args) {
		const parentElement = args.field
		let newElement = document.createElement('div')
		newElement.classList.add('item')
		newElement.setAttribute('data-worker', args.workerName)
		newElement.setAttribute('data-week-number', args.weekNumber)
		newElement.setAttribute('data-id', args.id)

		const {weekSalary, weight, weekTotalWeight, bonus, totalBonus} = LocalStorage.getWeekBalance(this.workerName, this.weekNumber)

		this.args.nextPageAttr = 'weekItems'
		newElement.innerHTML = 
		`<div class="item__header">
			<div class="item__header-text" data-item-name>${args.text || 'у девочки нет имени'}</div>
			<div class="item__header-arrow">
				<div class="chevron"></div>
			</div>
		</div>
		<div class="item__uppper">
			<span>Остаток:</span>
			<span>${weekTotalWeight}</span>&nbsp;
			<span>г</span>
		</div>

		<div class="item__lower">
			<span>Зарплата:</span>
			<span>${weekSalary}</span>&nbsp;
			<span>руб</span>
		</div>
		<div class="item__lower">
			<span>Бонусные (всего):</span>
			<span>${bonus} (${totalBonus})</span>&nbsp;
			<span>руб</span>
		</div>`

		parentElement.appendChild(newElement)

		// прокручиваем до последнего добавленного элемента
		setTimeout(()=> {newElement.scrollIntoView()},400)
		
		return newElement
	}

	itemHandler (element) {
		const {workerName, nextPageAttr, weekNumber} = this.args
		// console.log('itemHandler', this.args)
		element.addEventListener('click', () => {
			
			// let nextPageAttr = element.getAttribute('data-next')
			const currentPageAttr = 'brigade'

			Router.changeNextPage({
				currentPageAttr, 
				nextPageAttr, 
				weekNumber, 
				workerName
			})
		})
	}
}