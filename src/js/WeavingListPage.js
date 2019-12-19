import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import WeavingItem from './WeavingItem'

export default class WeavingListPage extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderWeavingListPage(args)
	}

	renderWeavingListPage(args) {
		console.log('WeavingListPage')
		args.page = 'weavingList'
		const {page, workerName, weekNumber, previousAttr} = args
		super.createHeader(args)
		super.createHeaderBackArrow(page, 'weeksList', weekNumber, previousAttr)
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
			<input type="number" class="input" placeholder="Цепь ₽" name="chain">
			<input type="number" class="input" placeholder="Браслет ₽" name="bracelet">
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
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)

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
		})
	}

}
