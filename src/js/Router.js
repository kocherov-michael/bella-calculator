import WeeksListPage from './WeeksListPage'
import BrigadePage from './BrigadePage'
import BrigadeBalanceListPage from './BrigadeBalanceListPage'
import WeekItemsPage from './WeekItemsPage'
import HandOverPage from './HandOverPage'
import WeavingListPage from './WeavingListPage'
import GarbageListPage from './GarbageListPage'
import QuotationPage from './QuotationPage'
import LocalStorage from './LocalStorage'

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
			const newPage = new WeeksListPage(args)
		}

		else if (page === 'brigade') {
			const newPage = new BrigadePage(args)
		}

		else if (page === 'brigadeBalanceList') {
			const newPage = new BrigadeBalanceListPage(args)
		}
		else if (page === 'weekItems') {
			const newPage = new WeekItemsPage(args)
		}
		else if (page === 'handOverItems') {
			const newPage = new HandOverPage(args)
		}
		else if (page === 'weavingList') {
			// console.log('new WeavingListPage', args)
			const newPage = new WeavingListPage(args)
		}
		else if (page === 'garbageList') {
			// console.log('garbageList', args)
			const newPage = new GarbageListPage(args)
		}
		else if (page === 'quotation') {
			// console.log('garbageList', args)
			const newPage = new QuotationPage(args)
		}
	}


	// перелистываем страницу вперёд
	static changeNextPage (args) {
		
		const {currentPageAttr, nextPageAttr, weekNumber, workerName = 'Я'} = args
		// если следующая страница и текущая - одна и та же, то отмена
		if (currentPageAttr === nextPageAttr) {
			return
		}

		if (nextPageAttr === 'brigade' ) {
			const isBrigadier = LocalStorage.isBrigadier()
			if (!isBrigadier) {
				nextPageAttr = 'weekItems'
			}
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

		// console.log(workerName)
		Router.loadPage ({
			page: nextPageAttr,
			nextPageAttr, 
			weekNumber, 
			workerName, 
			previousAttr: currentPageAttr || '', 
			currentPageAttr
		})

		// // console.log('nextPageAttr', nextPageAttr)
		// // Router.renderPage(args)
		// if (nextPageAttr === 'weeksList') {
		// 	this.renderWeekListPage(nextPageAttr, name)

		// 	// если не бригадир, то загружаем вторую страницу без задержки
		// 	// timeout = Storage.isBrigadier() ? 400 : 0
		// }
		// else if (nextPageAttr === 'brigade') {
		// 	// Router.renderBrigadePage({nextPageAttr, name, weekNumber, currentPageAttr})
		// 	console.log('nextPageAttr', nextPageAttr)
		// 	console.log('workerName', workerName)
		// 	Router.loadPage ({page: nextPageAttr, weekNumber})
		// 	// const newPage = new BrigadePage ({
		// 	// 	currentPageAttr,
		// 	// 	nextPageAttr,
		// 	// 	weekNumber
		// 	// })
		// }
		// else if (nextPageAttr === 'brigadeBalanceList') {
		// 	Router.loadPage ({page: nextPageAttr, weekNumber})
		// }
		// else if (nextPageAttr === 'weekItems') {
		// 	console.log('nextPageAttr', nextPageAttr)
		// 	console.log('workerName', workerName)
		// 	Router.loadPage ({page: nextPageAttr, weekNumber, workerName})
		// 	// this.renderWeekItemsPage(nextPageAttr, name, weekNumber)
		// }
		// else if (nextPageAttr === 'handOverItems') {
		// 	Router.loadPage ({page: nextPageAttr, weekNumber, workerName})
		// 	// this.renderHandOverItemsPage(nextPageAttr, name, weekNumber)
		// }
		// else if (nextPageAttr === 'weavingList') {
		// 	// console.log('heere')
		// 	console.log('nextPageAttr', nextPageAttr)
		// 	console.log('workerName', workerName)
		// 	Router.loadPage ({page: nextPageAttr, weekNumber, workerName, previousAttr: currentPageAttr || ''})
		// 	// this.renderWeavingListPage(nextPageAttr, name, weekNumber, currentPageAttr)
		// }
		// else if (nextPageAttr === 'quotation') {
		// 	Router.loadPage ({
		// 		page: nextPageAttr,
		// 		nextPageAttr, 
		// 		weekNumber, 
		// 		workerName, 
		// 		previousAttr: currentPageAttr || '', 
		// 		currentPageAttr
		// 	})
		// 	// this.renderQuotationPage(nextPageAttr, name, weekNumber, currentPageAttr)
		// }
		// else if (nextPageAttr === 'garbageList') {
		// 	Router.loadPage ({
		// 		page: nextPageAttr,
		// 		nextPageAttr, 
		// 		weekNumber, 
		// 		workerName, 
		// 		previousAttr: currentPageAttr || '', 
		// 		currentPageAttr
		// 	})
		// 	// this.renderGarbageListPage(nextPageAttr, name, weekNumber, currentPageAttr)
		// }
		

		// устанавливаем задержку для плавной прокрутки страниц
		setTimeout( () => {
			currentPageElement.classList.add('hide')
			containerElement.classList.remove('nextPage')
			currentPageElement.classList.remove('order-previous')
		}, timeout)
	}

	// перелистываем страницу назад
	static changePreviousPage (currentPageAttr, previousPageAttr, weekNumber, workerName = 'Я') {

		// если предыдущая страница и текущая - одна и та же, то отмена
		if (currentPageAttr === previousPageAttr) {
			return
		}

		if (previousPageAttr === 'brigade' ) {
			const isBrigadier = LocalStorage.isBrigadier()
			if (!isBrigadier) {
				previousPageAttr = 'weeksList'
			}

		}
		// если предыдущая страница не сохранилась, то возвращаемся в самое начало
		if (!previousPageAttr) {
			previousPageAttr = 'weeksList'
		}
		
		const containerElement = document.querySelector('[data-container]')
		const currentPageElement = document.querySelector(`[data-page=${currentPageAttr}]`)
		const previousPageElement = document.querySelector(`[data-page=${previousPageAttr}]`)

		previousPageElement.classList.remove('hide')
		containerElement.classList.add('fromNextToPrevious')
		
		// отрисовываем предыдущую страницу
		Router.loadPage ({page: previousPageAttr, weekNumber, workerName})


		// if (currentPageAttr === 'weavingList' && previousPageAttr === 'handOverItems') {
		// 	this.renderHandOverItemsPage(previousPageAttr, name, weekNumber)

		// } else if (previousPageAttr === 'start') {
		// 	this.renderStartPage('start')

		// }
		// else if (previousPageAttr === 'weeksList') {
		// 	// this.renderWeekListPage(previousPageAttr, name)
		// 	Router.loadPage ({page: previousPageAttr})
		// }
		// else if (previousPageAttr === 'weekItems') {
		// 	this.renderWeekItemsPage(previousPageAttr, name, weekNumber)
			
		// }
		// else if (previousPageAttr === 'handOverItems') {
		// 	this.renderHandOverItemsPage(previousPageAttr, name, weekNumber)
			
		// }
		//  else {
			
		// 	this.addFieldList(previousPageAttr, name, weekNumber)
		// 	// this.showFooterValues(previousPageAttr, name, weekNumber)
		// 	// если страница добавили сдачу, то при возвращении назад показываем актуальную сдачу
		// 	if (previousPageAttr === 'weekItems') {

		// 		this.showSalaryValues(previousPageAttr, name, weekNumber)
		// 	}

		// }
		
		
		setTimeout( () => {
			containerElement.classList.add('previousPage')
		}, 0)

		setTimeout( () => {
			currentPageElement.classList.add('hide')
			containerElement.classList.remove('previousPage')
			containerElement.classList.remove('fromNextToPrevious')
		}, 400)
	}


}