import NewItem from './NewItem'
import LocalStorage from './LocalStorage'
import Router from './Router'

export default class WorkerItem extends NewItem {
	constructor (args = {}) {
		super(args)
		// console.log(args)
		this.args = args
		this.element = this.create(args)
		this.itemHandler(this.element)
		// console.log('ok')
	}

	create (args) {

		const parentElement = args.field
		let newElement = document.createElement('div')
		newElement.classList.add('item')
		// newElement.setAttribute('data-worker', args.workerName)
		newElement.setAttribute('data-id', args.id)

		newElement.classList.add('week-item', 'closedable', 'closed', 'hidetext')
		newElement.setAttribute('data-week-number', args.weekNumber)

		// преобразуем вид веса + или -
		let weightValue
		let weightClass = ''
		if (args.weight > 0) {
			weightValue = `+ ${args.weight}`
		}
		else {
			weightValue = `- ${Math.abs(args.weight)}`
			weightClass = 'item__header-text_minus'
		}

		newElement.innerHTML =
		`<div class="item__header">
		<div class="item__header-text ${weightClass}">${weightValue}</div>
		<div class="item__header-arrow">
			<div class="chevron"></div>
		</div>
	</div>

	<div class="item__lower">
		<span>Промежуточный баланс:</span>
		<span>5678</span>
		<span>&nbsp;г</span>
	</div>`
		// const parentElement = args.field
		// let newElement = document.createElement('div')
		// newElement.classList.add('item')
		// newElement.setAttribute('data-worker', args.workerName)
		// newElement.setAttribute('data-id', args.id)

		// // newElement.setAttribute('data-next', 'weekItems')
		// this.args.nextPageAttr = 'weekItems'
		// newElement.innerHTML = 
		// `<div class="item__header">
		// 	<div class="item__header-text" data-item-name>${args.text || 'у девочки нет имени'}</div>
		// 	<div class="item__header-arrow">
		// 		<div class="chevron"></div>
		// 	</div>
		// </div>`

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

			// если кликаем на неделю, но не бригадир - идём в неделю работника "Я"
			// if (nextAttr === 'brigade' && !LocalStorage.isBrigadier()) {
			// 	nextAttr = 'weekItems'
			// }

		})
	}

}