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
		const handler = new Handler({
			menu: page,
			addItem: page,
			workerName: name,
			backButton: page
		})
		
		this.addFieldList(page, name)
		this.showHeaderName(page, name)

	}

	showHeaderName (page, name) {
		const headerTextElement = document.querySelector(`[data-header-text="${page}"]`)
		if (headerTextElement) {
			headerTextElement.textContent = name
		}
	}
	

	// Создаём список элементов из памяти
	addFieldList (page, name = '') {
		// console.log(page)
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''
	
		// получаем данные из памяти
		const data = this.storage.read()
	
		// если страница стартовая
		if (page === 'start') {

			data.forEach( (worker) => {
				
				const workerButton = new Item({
					// родительский элемент
					field: itemFieldElement,
					// имя работника
					text: worker.workerName,
					type: 'single'
				})
			})
		}
		// если страница с неделями
		else if ( page === 'weeksList') {
			// console.log(data)
			for( let i = 0; i < data.length; i++) {
				if ( data[i].workerName === name) {
					console.log(data[i].weeks)
					data[i].weeks.forEach( (week) => {
				
						const weekButton = new Item({
							// родительский элемент
							field: itemFieldElement,
							// номер недели
							text: week.weekNumber,
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
		// console.log(this)
	}

	// перелистываем страницу назад
	changePreviousPage (workerObj, currentPage, previousPage, name) {
		
		const containerElement = document.querySelector('[data-container]')

		previousPage.classList.remove('hide')
		containerElement.classList.add('fromNextToPrevious')
		
		const previousAttr = previousPage.getAttribute('data-page')
		// отрисовываем предыдущую страницу
		// this.renderPage(previousAttr, name)
		this.addFieldList(previousAttr, name)
		
		setTimeout( () => {
			containerElement.classList.add('previousPage')
		}, 0)

		setTimeout( () => {
			currentPage.classList.add('hide')
			containerElement.classList.remove('previousPage')
			containerElement.classList.remove('fromNextToPrevious')
		}, 400)
		// console.log(this)
		// console.log(this.handler)
	}

}