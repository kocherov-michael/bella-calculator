import WeeksListPage from './WeeksListPage'
import BrigadePage from './BrigadePage'

export default class Router {
	constructor (args = {}) {
		// this.page = args.page

		if (args.page === 'weeksList') {
			const page = new WeeksListPage ()
		}
	}

	static loadPage (args) {
		const {page} = args

		if (page === 'weeksList') {
			const newPage = new WeeksListPage (args)
		}

		if (page === 'brigade') {
			const newPage = new BrigadePage (args)
		}
	}


	// перелистываем страницу вперёд
	static changeNextPage (currentPageAttr, nextPageAttr, weekNumber = '', workerName = '') {
		// если следующая страница и текущая - одна и та же, то отмена
		console.log('changeNextPage')
		if (currentPageAttr === nextPageAttr) {
			return
		}

		const containerElement = document.querySelector('[data-container]')
		const currentPageElement = document.querySelector(`[data-page="${currentPageAttr}"]`)
		const nextPageElement = document.querySelector(`[data-page="${nextPageAttr}"]`)

		if (currentPageAttr === 'quotation' && nextPageAttr === 'weavingList') {
			currentPageElement.classList.add('order-previous')
		}
		nextPageElement.classList.remove('hide')
		containerElement.classList.add('nextPage')

		let timeout = 400

		console.log('nextPageAttr', nextPageAttr)
		// Router.renderPage(args)
		if (nextPageAttr === 'weeksList') {
			this.renderWeekListPage(nextPageAttr, name)

			// если не бригадир, то загружаем вторую страницу без задержки
			// timeout = Storage.isBrigadier() ? 400 : 0
		}
		else if (nextPageAttr === 'brigade') {
			// Router.renderBrigadePage({nextPageAttr, name, weekNumber, currentPageAttr})
			const newPage = new BrigadePage ({
				currentPageAttr,
				nextPageAttr,
				weekNumber
			})
		}
		else if (nextPageAttr === 'weekItems') {
			this.renderWeekItemsPage(nextPageAttr, name, weekNumber)
		}
		else if (nextPageAttr === 'handOverItems') {
			this.renderHandOverItemsPage(nextPageAttr, name, weekNumber)
		}
		else if (nextPageAttr === 'weavingList') {
			this.renderWeavingListPage(nextPageAttr, name, weekNumber, currentPageAttr)
		}
		else if (nextPageAttr === 'quotation') {
			this.renderQuotationPage(nextPageAttr, name, weekNumber, currentPageAttr)
		}
		else if (nextPageAttr === 'garbageList') {
			this.renderGarbageListPage(nextPageAttr, name, weekNumber, currentPageAttr)
		}
		

		// устанавливаем задержку для плавной прокрутки страниц
		setTimeout( () => {
			currentPageElement.classList.add('hide')
			containerElement.classList.remove('nextPage')
			currentPageElement.classList.remove('order-previous')
		}, timeout)
	}


}