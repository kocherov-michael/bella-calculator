import DefaultPage from './DefaultPage'
import Handler from './Handler'
import LocalStorage from './LocalStorage'
// import NewItem from './NewItem'
import WeekItem from './WeekItem'
import WorkerItem from './WorkerItem'

export default class BrigadePage extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderBrigadePage(args)
	}

	// отрисовываем страницу бригады
	renderBrigadePage(args) {
		console.log('brigade args:', args)
		args.isBrigadier = true
		args.page = 'brigade'
		super.createHeader(args)
		this.addForm(args)
		this.addCreateButton(args)
		this.addFieldList(args)
		super.createHeaderBackArrow('brigade', 'weeksList', args.weekNumber)
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
		const workersArr = LocalStorage.getOneWeek(weekNumber) || []

		// const workerWeeks = LocalStorage.getWorkerWeeks(name)
		workersArr.forEach( (worker) => {
				
				const workerButton = new WorkerItem({
					// родительский элемент
					field: itemFieldElement,
					// номер недели
					text: worker.workerName,
					type: 'worker',
					workerName: workerName,
					id: worker.id
				})
			})
	}

	// кнопка добавления работника
	addCreateButton (args) {
		args.text = 'Добавить работника'
		super.addCreateButton(args)
	}
}