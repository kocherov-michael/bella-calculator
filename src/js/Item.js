import Handler from './Handler'

export default class Item {
	constructor (args = {}) {
		// this.handler = new Handler()
		// if (args.start) {
			this.create(args)
		// }
	}

	create(args) {
		let classNameView
		let classNameType

		if (args.type === 'add') {
			classNameView = 'item_warning'
			classNameType = 'item_add'
		}

		// console.log(args)
		const parentElement = args.field
		const newElement = document.createElement('div')
		newElement.classList.add('item',classNameView, classNameType)
		// newElement.classList.add(className)

		newElement.innerHTML = 
		`<div class="item__header">
			<div class="item__header-text" data-item-name>${args.text}</div>
			<div class="item__header-arrow">
				<div class="chevron"></div>
			</div>
		</div>`
		parentElement.appendChild(newElement)

		const handler = new Handler({
			itemHandler: newElement
		})

		return newElement
	}
}