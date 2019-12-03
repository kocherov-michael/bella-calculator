import Storage from './Storage'
import Page from './Page'

export default class Handler {
	constructor (args = {}) {
		this.storage = new Storage()
		this.page = new Page()
		this.args = args

		if (args.menu) {
			this.menuHandler(args.menu)
		}
		if (args.addItem) {
			this.addItemHandler(args.addItem)
		}
		
	}
	menuHandler (page) {
		const sectionElement =  document.querySelector(`.${page}`)
		const headerMenuElement = sectionElement.querySelector('[data-header-menu]')
		const headerMenuListElement = sectionElement.querySelector('[data-menu-list]')

		headerMenuElement.addEventListener('click', () => {
			
			headerMenuListElement.classList.toggle('menu-show')
		} )

		// вешаем обработчик на кнопку Сохранить формы добавления сотрудника
		this.addFormElement =  document.querySelector(`[data-add-form=${page}]`)

		this.formHandler(this.addFormElement)
	}

	// Обработчик кнопки Добавить сотрудника
	addItemHandler (page) {
		const sectionElement =  document.querySelector(`.${page}`)
		const addWorkerElement = sectionElement.querySelector(`[data-add=${page}]`)

		addWorkerElement.addEventListener('click', () => {
			this.addFormElement.classList.remove('hide')

		})
	}

	// Обработчик кнопок Сохранить и Отмена
	formHandler (addFormElement) {
		this.formElement = addFormElement
		const saveButtonElement = addFormElement.querySelector('[data-save-button]')
		const cancelButtonElement = addFormElement.querySelector('[data-cancel-button]')
		const closeIconElement = addFormElement.querySelector('[data-close-icon]')

		saveButtonElement.addEventListener('click', this.saveFormValues.bind(this))

		cancelButtonElement.addEventListener('click', this.closeForm.bind(this))
		closeIconElement.addEventListener('click', this.closeForm.bind(this))
	}

	// закрываем форму
	closeForm () {
		this.formElement.classList.add('hide')
	}

	// Сохраняем введённые значения формы
	saveFormValues() {
		const newItemValues = {}
		this.formElement.querySelectorAll('input').forEach( (input) => {
			// console.log(input)
			// newItemValues.inputValue = input.getAttribute('value')
			newItemValues.inputValue = input.value
			newItemValues.inputName = input.name
		})
		// console.log(newItemValues)
		this.storage.save(newItemValues)
		this.closeForm()
		this.page.addFieldList(this.args.addItem)
		// this.storage.read()
	}

}