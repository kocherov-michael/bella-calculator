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
		if (args.itemHandler) {
			this.itemHandler(args.itemHandler)
		}
		
	}
	menuHandler (page) {
		const sectionElement =  document.querySelector(`[data-page="${page}"]`)
		const headerMenuElement = sectionElement.querySelector('[data-header-menu]')
		const headerMenuListElement = sectionElement.querySelector('[data-menu-list]')

		headerMenuElement.addEventListener('click', () => {
			headerMenuElement.classList.toggle('cross')
			headerMenuListElement.classList.toggle('menu-show')
		} )

		
	}
	
	// Обработчик кнопки Добавить сотрудника / неделю
	addItemHandler (page) {
		const sectionElement =  document.querySelector(`[data-page="${page}"]`)
		const addNewElement = sectionElement.querySelector(`[data-add=${page}]`)

		// вешаем обработчик на кнопку Сохранить формы добавления сотрудника
		const addFormElement =  document.querySelector(`[data-add-form=${page}]`)
		this.formHandler(addFormElement)

		addNewElement.addEventListener('click', () => {
			addFormElement.classList.remove('hide')

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
		const newItemValues = {
			workerName: this.args.workerName
		}
		// console.log(this.args.workerName)
		this.formElement.querySelectorAll('input').forEach( (input) => {
			// console.log(input)
			// newItemValues.inputValue = input.getAttribute('value')
			newItemValues.inputValue = input.value
			newItemValues.inputName = input.name
			input.value = ''
		})
		console.log(newItemValues)
		this.storage.save(newItemValues)
		this.closeForm()
		this.page.addFieldList(this.args.addItem)
		// this.storage.read()
	}

	// обработчик нажатия на обычный элемент
	itemHandler(element) {
		element.addEventListener('click', () => {
			// console.log(element)
			const name = element.querySelector('[data-item-name]').textContent
			const attr = element.getAttribute('data-next')
			console.log(attr)
			const workerObj = this.storage.getWorkerWeeks(name)
			
			// Если next = weeks, то перелистываем на недели
			if (attr === 'weeks') {
				const nextPage = document.querySelector('[data-page="weeksList"]')
				const currentPage = document.querySelector('[data-page="start"]')
				this.page.changeNextPage(workerObj, currentPage, nextPage, name)
			}
		})
	}

}