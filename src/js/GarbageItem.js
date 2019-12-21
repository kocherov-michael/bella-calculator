import NewItem from './NewItem'
import LocalStorage from './LocalStorage'
import Router from './Router'
// import Handler from './Handler'

export default class GarbageItem extends NewItem {
// export default class WeeksListItem {
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
		newElement.classList.add('weaving-item')
		newElement.setAttribute('data-id', args.id)

		newElement.innerHTML =
		`<div class="item__header">
		<div class="item__header-text">${args.removedItemName}</div>
		<div class="item__header-arrow">
			<div class="weaving-item__percent"></div>
		</div>
	</div>

	<div class="item__lower">
		<span>Удалено:</span>
		<span>${args.time}</span>
		
	</div>`

		parentElement.append(newElement)
		setTimeout(()=> {
			newElement.scrollIntoView()
		},400)

		return newElement
	}

	itemHandler (element) {
		// element.addEventListener('click', () => {
			
		// 	let nextPageAttr = element.getAttribute('data-next')
		// 	const currentPageAttr = 'weeksList'
		// 	const weekNumber = element.getAttribute('data-week-number')

		// 	// если кликаем на неделю, но не бригадир - идём в неделю работника "Я"
		// 	if (nextPageAttr === 'brigade' && !LocalStorage.isBrigadier()) {
		// 		nextPageAttr = 'weekItems'
		// 	}

		// 	Router.changeNextPage({currentPageAttr, nextPageAttr, weekNumber})
		// })
	}

}