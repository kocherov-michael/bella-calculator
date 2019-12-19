import DefaultPage from './DefaultPage'
// import Handler from './Handler'
import LocalStorage from './LocalStorage'
// import NewItem from './NewItem'
import WeekItem from './WeekItem'

export default class WeeksListPage extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderWeekListPage(args)
	}
	renderWeekListPage(args) {
		args.isBrigadier = true
		super.createHeader(args)
		this.addForm(args)
		this.addCreateButton(args)
		this.addFieldList(args)
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
				<div class="form__heading-text">Введите номер недели</div>
				<div class="form__heading-close" data-close-icon>&#10006;</div>
			</div>
			<div class="form__inputs">
				<input type="text" class="input" placeholder="Номер недели" value="" name="weekNumber">
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

	addCreateButton (args) {
		args.text = 'Добавить неделю'
		super.addCreateButton(args)

	}

	addFieldList (args) {
		const { page, name = 'Я' } = args
		const itemFieldElement = document.querySelector(`[data-item-field="${page}"]`)
	
		itemFieldElement.innerHTML = ''
	
		// получаем данные из памяти
		const weeksArr = LocalStorage.read().weeks || []

		// const workerWeeks = LocalStorage.getWorkerWeeks(name)
		weeksArr.forEach( (week) => {
			console.log(week)
				
				const weekButton = new WeekItem({
					// родительский элемент
					field: itemFieldElement,
					// номер недели
					text: week.weekNumber,
					type: 'week',
					weekNumber: week.weekNumber,
					// workerName: name,
					id: week.id
				})
			})
	}
}