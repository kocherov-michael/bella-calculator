import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import WeavingItem from './WeavingItem'
import Router from './Router'

export default class WeavingListPage extends DefaultPage {
	constructor (args = {}) {
		super(args)
		this.page = args.page
		this.workerName = args.workerName
		this.weekNumber = args.weekNumber
		this.previousAttr = args.previousAttr

		this.renderWeavingListPage(args)
	}

	renderWeavingListPage(args) {
		// console.log('WeavingListPage args', args)
		args.page = 'weavingList'
		if (args.previousAttr === 'quotation' || args.previousAttr === 'garbageList') {
			args.previousAttr = 'weeksList'
		}
		const {page, workerName, weekNumber, previousAttr} = args
		super.createHeader(args)
		super.createHeaderBackArrow(page, previousAttr, weekNumber, workerName)
		this.addForm(args)
		super.addCreateButton({ text: 'Добавить плетение', ...args })
		super.showHeaderName(page, workerName, weekNumber)
		this.addFieldList(page, workerName, weekNumber)
	}


	addForm(args) {
		const { page } = args
		const formContainerElement = document.querySelector(`[data-add-form="${page}"]`)
		// если на странице нет скрытых форм, то пропускаем
		if (!formContainerElement) return

		formContainerElement.innerHTML = ''
		formContainerElement.innerHTML = 
		`<div class="form active-form opacity" data-active-form>
		<div class="form__heading">
			<div class="form__heading-text">Введите плетение</div>
			<div class="form__heading-close" data-close-icon>&#10006;</div>
		</div>
		<div class="form__inputs">
			<input type="text" class="input" placeholder="Название" value="" name="weavingName">
			<input type="number" class="input" placeholder="Угар %" name="percent">
			<input type="number" class="input" placeholder="Цепь руб" name="chain">
			<input type="number" class="input" placeholder="Браслет руб" name="bracelet">
		</div>
		<div class="form__buttons">
			<div class="form__buttons-save">
				<button class="item item_warning" data-save-button>
					<div class="item__header">
						<div class="item__header-text">Сохранить</div>
						<div class="item__header-arrow">
							<div class="symbol"></div>
						</div>
					</div>
				</button>
			</div>
			<div class="form__buttons-cancel">
				<button class="item item_cancel" data-cancel-button>
					<div class="item__header">
						<div class="item__header-text">Отменить</div>
						<div class="item__header-arrow">
							<div class="cross">&#10006;</div>
						</div>
					</div>
				</button>
			</div>
		</div>
	</div>`
	}

	addFieldList (page, workerName, weekNumber) {
		const itemFieldElement = document.querySelector(`[data-item-field="${this.page}"]`)

		itemFieldElement.innerHTML = ''

		const weavingArr = LocalStorage.getWeavingArray()

		weavingArr.forEach( (weavingItem) => {
			
			const handOverButton = new WeavingItem({
				// родительский элемент
				field: itemFieldElement,
				type: 'weavingItem',
				weavingName: weavingItem.weavingName,
				percent: weavingItem.percent,
				chain: weavingItem.chain,
				bracelet: weavingItem.bracelet,
				id: weavingItem.id
			})

			// вешаем прослушку перетаскивания для удаления
			super.itemTouchHandler(handOverButton.element)
		})
	}

	// удаление элемента
	deleteElement(elementId) {
		LocalStorage.deleteWeaving(elementId)
	}

	// сохраняем плетение в память
	savePageItem(newItemValues) {
		const result = LocalStorage.saveWeavingItem(newItemValues)

		// если уже есть такое название плетения, то отмена
		if (!result) return
		
		this.closeForm()
		// Router.loadPage({page: 'weavingList'})
		this.addFieldList()
	}

}
