import NewItem from './NewItem'
import LocalStorage from './LocalStorage'
import Router from './Router'
// import Handler from './Handler'

export default class WeekItem extends NewItem {
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
		newElement.setAttribute('data-week-number', args.weekNumber)
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
			
			let nextPageAttr = element.getAttribute('data-next')
			const currentPageAttr = 'weeksList'
			const weekNumber = element.getAttribute('data-week-number')

			// если кликаем на неделю, но не бригадир - идём в неделю работника "Я"
			if (nextPageAttr === 'brigade' && !LocalStorage.isBrigadier()) {
				nextPageAttr = 'weekItems'
			}

			Router.changeNextPage({currentPageAttr, nextPageAttr, weekNumber})
		})
	}
}