import NewItem from './NewItem'
import LocalStorage from './LocalStorage'
import Router from './Router'

export default class WorkerItem extends NewItem {
	constructor (args = {}) {
		super(args)
		this.element = this.create(args)
		this.itemHandler(this.element)
		// console.log('ok')
	}

	create (args) {
		const parentElement = args.field
		let newElement = document.createElement('div')
		newElement.classList.add('item')
		newElement.setAttribute('data-worker', args.workerName)
		newElement.setAttribute('data-id', args.id)

		newElement.setAttribute('data-next', 'brigade')
		newElement.innerHTML = 
		`<div class="item__header">
			<div class="item__header-text" data-item-name>${args.text || 'у девочки нет имени'}</div>
			<div class="item__header-arrow">
				<div class="chevron"></div>
			</div>
		</div>`

		parentElement.appendChild(newElement)
	
		// const handler = new Handler({
		// 	itemHandler: newElement,
		// 	deleteable: newElement
		// })

		// прокручиваем до последнего добавленного элемента
		setTimeout(()=> {newElement.scrollIntoView()},400)
		
		return newElement
	}

	itemHandler (element) {
		element.addEventListener('click', () => {
			
			let nextAttr = element.getAttribute('data-next')
			const currentAttr = 'brigade'
			const weekNumber = element.getAttribute('data-week-number')
			const workerName = element.getAttribute('data-worker')

			// если кликаем на неделю, но не бригадир - идём в неделю работника "Я"
			// if (nextAttr === 'brigade' && !LocalStorage.isBrigadier()) {
			// 	nextAttr = 'weekItems'
			// }

			Router.changeNextPage(currentAttr, nextAttr, weekNumber, workerName)
		})
	}
}