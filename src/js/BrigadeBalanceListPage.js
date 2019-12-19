import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import WorkerItem from './WorkerItem'
import Router from './Router'

export default class BrigadeBalanceList extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderBrigadeBalanceListPage(args)
	}

	// отрисовываем страницу бригады
	renderBrigadeBalanceListPage(args) {
		console.log('BalanceList args:', args)
		args.isBrigadier = true
		args.page = 'brigadeBalanceList'
		super.createHeader(args)
		// this.addForm(args)
		// this.createBrigadeButton(args)
		// super.addCreateButton({ text: 'Добавить работника', ...args })
		this.addFieldList(args)
		super.createHeaderBackArrow(args.page, 'brigade', args.weekNumber)
		// this.showFooterValues(page, name)
	}

	

	// заполняем список работниками
	addFieldList (args) {
		// const { page, workerName = 'Я', weekNumber } = args
		// const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		// itemFieldElement.innerHTML = ''
	
		// // получаем данные из памяти
		// const weekArr = LocalStorage.getOneWeek(weekNumber) || []

		// // const workerWeeks = LocalStorage.getWorkerWeeks(name)
		// weekArr.forEach( (worker) => {
				
		// 		const workerButton = new WorkerItem({
		// 			// родительский элемент
		// 			field: itemFieldElement,
		// 			// номер недели
		// 			text: worker.workerName,
		// 			type: 'worker',
		// 			workerName: workerName,
		// 			id: worker.id
		// 		})
		// 	})
	}

	

}