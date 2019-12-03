import Handler from './Handler'
import Item from './Item'
import Storage from './Storage'

export default class Page {
	constructor (args = {}) {
		this.storage = new Storage()

		if (args.start) {
			this.renderPage(args.start)
		}
	}
	addEventListener () {}

	renderPage (page) {
		// console.log(start)
		const handler = new Handler({
			menu: page,
			addItem: page
		})
		
		this.addFieldList(page)
		
	}
	
	addFieldList (page) {
		console.log(page)
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''
	
		const data = this.storage.read(page)
		console.log(data)
	
		data.forEach( (worker) => {
			
			const workerButton = new Item({
				field: itemFieldElement,
				text: worker,
				type: 'single'
			})
		})

	}

}