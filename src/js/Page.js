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

	renderPage (page, name = '') {
		// console.log(start)
		const handler = new Handler({
			menu: page,
			addItem: page,
			workerName: name
		})
		
		this.addFieldList(page, name)
		
	}
	

	// Создаём список элементов из памяти
	addFieldList (page, name = '') {
		// console.log(page)
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''
	
		const data = this.storage.read()
		// console.log(data)
	
		if (page === 'start') {

			data.forEach( (worker) => {
				
				const workerButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					// имя работника
					text: worker.name,
					type: 'single'
				})
			})
		}
		else if ( page === 'weeksList') {
			// console.log(data)
			for( let i = 0; i < data.length; i++) {
				if ( data[i].name === name) {
					console.log(data[i].weeks)
					data[i].weeks.forEach( (week) => {
				
						const workerButton = new Item({
							// родительский элемент
							field: itemFieldElement,
							// номер недели
							text: week.number,
							type: 'week'
						})
					})
				}
			}
		}

	}

	// перелистываем страницу вперёд
	changeNextPage (workerObj, currentPage, nextPage, name) {
		// console.log('next')
		
		const containerElement = document.querySelector('[data-container]')

		nextPage.classList.remove('hide')
		containerElement.classList.add('nextPage')

		const nextAttr = nextPage.getAttribute('data-page')
		// this.addFieldList(nextAttr, name)
		this.renderPage(nextAttr, name)
		
		setTimeout( () => {
			currentPage.classList.add('hide')
			containerElement.classList.remove('nextPage')
		}, 400)
		
		// weeksList.classList.add('activePage')
	}

}