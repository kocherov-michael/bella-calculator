import NewItem from './NewItem'
import LocalStorage from './LocalStorage'
import Router from './Router'

export default class WeavingItem extends NewItem {
	// export default class WeeksListItem {
		constructor (args = {}) {
			super(args)
			this.element = this.create(args)
			// this.itemHandler(this.element)
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
		<div class="item__header-text">${args.weavingName}</div>
		<div class="item__header-arrow">
			<div class="weaving-item__percent"><span>${args.percent}</span>%</div>
		</div>
	</div>

	<div class="item__uppper">
		<span>Цепь:</span>
		<span>${args.chain}</span>
		<span>&nbsp;₽</span>
	</div>

	<div class="item__lower">
		<span>Браслет:</span>
		<span>${args.bracelet}</span>
		<span>&nbsp;₽</span>
	</div>`

		parentElement.append(newElement)
		setTimeout(()=> {
			newElement.scrollIntoView()
		},400)

		return newElement
		}

}