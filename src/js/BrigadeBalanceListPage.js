import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import WorkerItem from './WorkerItem'
import Router from './Router'
import OperationItem from './OperationItem'

export default class BrigadeBalanceList extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderBrigadeBalanceListPage(args)
	}

	// отрисовываем страницу бригады
	renderBrigadeBalanceListPage(args) {
		console.log('BalanceList args:', args)
		args.isBrigadier = true
		this.page = args.page = 'brigadeBalanceList'
		const {page, workerName, weekNumber} = args
		super.createHeader(args)
		super.createHeaderBackArrow(page, 'brigade', weekNumber)
		super.showHeaderName(page, workerName, weekNumber)
		this.addFieldList(page, workerName, weekNumber)
		super.createFormAddSingleOperation(page, workerName, weekNumber)
	}

	

	addFieldList (page, workerName, weekNumber) {
		// const {page, weekNumber} = args
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''

		const brigadeArr = LocalStorage.getOneWeek(weekNumber).brigade
		// const brigadeArr = LocalStorage.getOneWeek(weekNumber)
		console.log(brigadeArr)
		brigadeArr.forEach( (brigadeItem) => {
			
			const weekItemButton = new OperationItem({
				// родительский элемент
				field: itemFieldElement,
				// вес
				weight: brigadeItem.value,
				// type: 'weekItem',
				workerName,
				weekNumber,
				// previous: weekItem.isPrevious,
				id: brigadeItem.id
			})

			// вешаем прослушку перетаскивания для удаления
			super.itemTouchHandler(weekItemButton.element)
		})
	}

	

}