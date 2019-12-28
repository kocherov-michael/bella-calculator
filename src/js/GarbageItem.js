export default class GarbageItem {
	constructor (args = {}) {
		this.element = this.create(args)
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
}