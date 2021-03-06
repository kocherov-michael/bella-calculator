import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import OperationItem from './OperationItem'

export default class BrigadeBalanceList extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderBrigadeBalanceListPage(args)
	}

	// отрисовываем страницу бригады
	renderBrigadeBalanceListPage(args) {
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
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''

		const brigadeArr = LocalStorage.getOneWeek(weekNumber).brigade
		brigadeArr.forEach( (brigadeItem) => {
			
			const weekItemButton = new OperationItem({
				// родительский элемент
				field: itemFieldElement,
				// вес
				weight: brigadeItem.value,
				workerName,
				weekNumber,
				id: brigadeItem.id
			})

			// вешаем прослушку перетаскивания для удаления
			super.itemTouchHandler(weekItemButton.element)
		})
	}

	// удаление элемента
	deleteElement(elementId, weekNumber) {
		LocalStorage.deleteRecieving(elementId, weekNumber)
	}

	// заглушка, не удалять
	showFooterValues() {
		
	}

}