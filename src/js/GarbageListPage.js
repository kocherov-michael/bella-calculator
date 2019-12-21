import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import GarbageItem from './GarbageItem'

export default class GarbageListPage extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderWeekListPage(args)
	}
	renderWeekListPage(args) {
		args.isBrigadier = true
		const {page, workerName, weekNumber, previousAttr} = args
		super.createHeader(args)
		super.createHeaderBackArrow(page, previousAttr, weekNumber, workerName)
		super.showHeaderName(page, workerName, weekNumber)
		this.addForm(page)
		// this.addCreateButton(args)
		// super.addCreateButton({ text: 'Добавить неделю', ...args })
		this.addFieldList(args)
		// this.showFooterValues(page, name)
	}

	addFieldList (args) {
		const { page } = args
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''
	
		// получаем данные из памяти
		const removedArr = LocalStorage.getRemovedItems()

			for (let i = 0; i < removedArr.length; i++) {
				const place = (removedArr[i].way[removedArr[i].way.length - 1])
				let text
				
				if (place === 'weeks') {
					text = 'Неделя ' + removedArr[i].element.weekNumber
				}
				else if (place === 'workers') {
					text = removedArr[i].element.workerName
				}
				else if (place === 'weekHandOver') {
					text = `${removedArr[i].element.weightWithPercent} ${removedArr[i].element.weaving} ${removedArr[i].element.count}шт.`
				}
				const removedItemButton = new GarbageItem({
					// родительский элемент
					field: itemFieldElement,
					type: 'removedItem',
					removedItemName: 
						removedArr[i].element.value 
						|| removedArr[i].element.weavingName 
						|| text ,
					id: removedArr[i].id,
					time: removedArr[i].time
				})

				// вешаем прослушку для восстановления
				this.restoreHandler(removedItemButton.element)
			}

	}

	

	addForm (page) {
		const formContainerElement = document.querySelector(`[data-add-form="${page}"]`)

		formContainerElement.innerHTML = ''
		formContainerElement.innerHTML = 
		`<div class="form active-form opacity" data-active-form>
				<div class="form__heading">
				<div class="form__heading-text">Восстановить элемент?</div>
				<div class="form__heading-close" data-close-icon>&#10006;</div>
			</div>
			<div class="form__buttons">
				<div class="form__buttons-save">
					<button class="item item_warning" data-save-button>
						<div class="item__header">
							<div class="item__header-text">Восстановить</div>
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

		// this.formRestoreHandler (formContainerElement, args)
	}

	// обработчик восстановления элемента
	restoreHandler (element) {
		element.addEventListener('click', (event) => {
			// console.log(event.currentTarget.getAttribute('data-id'))
			const elementId = event.currentTarget.getAttribute('data-id')
			this.elementId = elementId
			// Обёртка с затемнением
			const addFormElement =  document.querySelector(`[data-add-form="garbageList"]`)
			// Ищем этот элемент чтобы скрыть раньше обёртки, а показать позже
			const activeFormElement =  addFormElement.querySelector(`[data-active-form]`)

			// вешаем обработчик на кнопку Восстановить и Отмена формы
			const restoreButtonElement = addFormElement.querySelector('[data-save-button]')
			this.restoreButtonElement = restoreButtonElement
			const cancelButtonElement = addFormElement.querySelector('[data-cancel-button]')
			const closeIconElement = addFormElement.querySelector('[data-close-icon]')


			restoreButtonElement.addEventListener('click', this.restoreListener.bind(this))

			cancelButtonElement.addEventListener('click', this.closeForm.bind(this))
			closeIconElement.addEventListener('click', this.closeForm.bind(this))



			// this.formRestoreHandler(addFormElement, elementId)
			this.activeFormElement = activeFormElement
			this.addFormElement = addFormElement

			// показваем форму при нажатии Добавить+
			addFormElement.classList.remove('hide')
			setTimeout( () => {
				addFormElement.classList.remove('opacity')
			}, 0)
			setTimeout( () => {
				activeFormElement.classList.remove('opacity')
			}, 200)

		})
	}

	// обработчик кнопки восстановить
	restoreListener () {
		LocalStorage.restoreElement(this.elementId)
		// закрываем форму
		this.closeForm()
		// обновляем список на странице
		this.addFieldList({page: 'garbageList'})
	}

	// Обработчик кнопок Восстановить и Отмена
	formRestoreHandler (addFormElement, elementId) {
		
		// const pageAttr = addFormElement.getAttribute('data-add-form')
		this.formElement = addFormElement
		const restoreButtonElement = addFormElement.querySelector('[data-save-button]')
		const cancelButtonElement = addFormElement.querySelector('[data-cancel-button]')
		const closeIconElement = addFormElement.querySelector('[data-close-icon]')

		restoreButtonElement.addEventListener('click', () => {
			
			LocalStorage.restoreElement(elementId)
			// закрываем форму
			this.closeForm()
			// обновляем список на странице
			this.addFieldList({page: 'garbageList'})
		})

		cancelButtonElement.addEventListener('click', this.closeForm.bind(this))
		closeIconElement.addEventListener('click', this.closeForm.bind(this))
	}
}