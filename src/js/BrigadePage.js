import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import WorkerItem from './WorkerItem'
import Router from './Router'


export default class BrigadePage extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderBrigadePage(args)
	}

	// отрисовываем страницу бригады
	renderBrigadePage(args) {
		// console.log('brigade args:', args)
		args.isBrigadier = true
		args.page = 'brigade'
		super.createHeader(args)
		this.addForm(args)
		this.createBrigadeButton(args)
		super.addCreateButton({ text: 'Добавить работника', ...args })
		this.addFieldList(args)
		super.createHeaderBackArrow(args.page, 'weeksList', args.weekNumber)
		super.showHeaderName(args.page, args.workerName, args.weekNumber)
		// this.showFooterValues(page, name)
	}

	addForm (args) {
		const { page } = args
		const formContainerElement = document.querySelector(`[data-add-form="${page}"]`)
		// если на странице нет скрытых форм, то пропускаем
		if (!formContainerElement) return

		formContainerElement.innerHTML = ''
		formContainerElement.innerHTML = 
		`<div class="form active-form opacity" data-active-form>
			<div class="form__heading">
				<div class="form__heading-text">Введите имя работника</div>
				<div class="form__heading-close" data-close-icon>&#10006;</div>
			</div>
			<div class="form__inputs">
				<input type="text" class="input" placeholder="Имя работника" value="" name="workerName">
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

	// заполняем список работниками
	addFieldList (args) {
		const { page, workerName = 'Я', weekNumber } = args
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''
	
		// получаем данные из памяти
		const weekArr = LocalStorage.getOneWeek(weekNumber) || []

		// const workerWeeks = LocalStorage.getWorkerWeeks(name)
		weekArr.forEach( (worker) => {
				
				const workerButton = new WorkerItem({
					// родительский элемент
					field: itemFieldElement,
					// номер недели
					weekNumber,
					text: worker.workerName,
					type: 'worker',
					workerName: worker.workerName,
					id: worker.id
				})
			})
	}

	// создаём кнопку баланса бригады
	createBrigadeButton (args) {
		const { page, workerName , weekNumber } = args
		const itemBrigadeElement = document.querySelector(`[data-brigade-field="${page}"]`)

		itemBrigadeElement.innerHTML = ''

		// получаем данные из памяти
		// const weekArr = LocalStorage.getOneWeek(weekNumber) || []

		// weekArr.brigade

		let newElement = document.createElement('div')
		newElement.classList.add('item')
		newElement.setAttribute('data-next', 'brigadeBalanceList')
		newElement.innerHTML = 
		`<div class="item__header">
			<div class="item__header-text" data-item-name>Бригада приход</div>
			<div class="item__header-arrow">
				<div class="chevron"></div>
			</div>
		</div>`
		itemBrigadeElement.appendChild(newElement)

		newElement.addEventListener('click', () => {
			console.log({currentPageAttr: page, nextPageAttr: 'brigadeBalanceList', weekNumber, brigade: true})
			Router.changeNextPage({
				currentPageAttr: page, 
				nextPageAttr: 'brigadeBalanceList', 
				weekNumber, 
				brigade: true
			})
		})

	}

}