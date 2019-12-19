// import Handler from './Handler'
import PageHandler from './PageHandler'
import Router from './Router'

export default class Page {
	constructor (args = {}) {

	}

	createHeader (args) {
		console.log('createHeader', args)
		const {page, isBrigadier, name = '', weekNumber = ''} = args
		// console.log(page)
		const headerElement = document.querySelector(`[data-header="${page}"]`)
		// const checked = Storage.isBrigadier() ? 'checked' : ''
		const checked = isBrigadier ? 'checked' : ''
		headerElement.innerHTML = ''
		headerElement.innerHTML = 
		`<div class="header__nav" data-header-nav="${page}">
		
		<div class="header__text" data-header-text="${page}"></div>
		<div class="header__menu" data-header-menu="${page}">
			<div class="menu-icon">
				<div class="menu-icon__line"></div>
			</div>
		</div>
		<div class="menu" data-menu-list>
			<button class="menu__item" data-next="quotation" data-quotation-link="${page}">Котировки</button>
			<button class="menu__item" data-next="weavingList"
			data-weaving-link="${page}">Плетения</button>
			<button class="menu__item" data-garbage-link="${page}">Восстановить удаления</button>
			<label class="menu__item check">
				<input class="check__input" type="checkbox" data-check-brigadier ${checked}>
				<div class="check__box">
					<div class="check__box-item"></div>
				</div>Я бригадир</label>
		</div>
	</div>`

		const handler = new PageHandler({
			page,
			name,
			weekNumber,
			menu: page,
			// addItem: page,
			// workerName: name,
			// backButton: page
		})

	}

	addCreateButton(args) {
		const { page, name, text, weekNumber } = args

		const fieldElement = document.querySelector(`[data-add-item="${page}"]`)

		// let text
		// if(page === ('start' || 'brigade')) {
		// 	text = 'Добавить сотрудника'
		// }
		// else if(page === 'weeksList') {
		// 	text = 'Добавить неделю'
		// }
		// else if(page === 'weavingList') {
		// 	text = 'Добавить плетение'
		// }

		fieldElement.innerHTML = ''
		fieldElement.innerHTML = 
		`<div class="item-field__items" data-item-field="${page}"></div>
		<div class="item item_warning item_add" data-add="${page}">
			<div class="item__header">
				<div class="item__header-text">${text}</div>
				<div class="item__header-arrow">
					<div class="chevron"></div>
				</div>
			</div>
		</div>`

		const handler = new PageHandler({
			page,
			name,
			weekNumber,
			// menu: page,
			addItem: page,
			workerName: name,
			// backButton: page
		})
	}

	// добавляем в шапку стрелку назад
	createHeaderBackArrow (page, previousPage = '', weekNumber = '', workerName = '') {

		const headerNavElement = document.querySelector(`[data-header-nav="${page}"]`)
		// // если предыдущая страница не обозначена, значит она идёт по порядку
		// if(!previousPage) {
		// 	previousPage = this.getPreviousPage(page)
		// }

		// создаём элемент стрелки назад в шапке
		const arrowBackElement = document.createElement('div')
		
		arrowBackElement.classList.add('header__arrow')
		// arrowBackElement.setAttribute('data-header-back', previousPage)
		// if (workerName !== '') {

		// 	arrowBackElement.setAttribute('data-header-back-worker', workerName)
		// }
		// // если на странице со сдачей, то добавляем номер недели
		// if (weekNumber !== '') {
		// 	arrowBackElement.setAttribute('data-header-back-week', weekNumber)
		// }
		headerNavElement.prepend(arrowBackElement)
  
		// создаём img стрелку назад
		const imgArrowElement = document.createElement('img')
		imgArrowElement.setAttribute('src', 'assets/img/arrow.svg')
		imgArrowElement.setAttribute('alt', 'назад')
		arrowBackElement.append(imgArrowElement)

		// обработчик кнопка назад
		arrowBackElement.addEventListener('click', () => {

			console.log('back')
			Router.changePreviousPage(page, previousPage)
			// let targetPageAttr = backButtonElement.getAttribute('data-header-back')
			// const targetPageWeekAttr = backButtonElement.getAttribute('data-header-back-week')
			// let targetPageWorkerAttr = backButtonElement.getAttribute('data-header-back-worker')

			// if (targetPageAttr === 'start' && !Storage.isBrigadier()) {
			// 	targetPageAttr = 'weeksList'
			// 	targetPageWorkerAttr = 'Я'
			// }

			// this.page.changePreviousPage(page, targetPageAttr, targetPageWorkerAttr, targetPageWeekAttr)
			// // backButtonElement = null
		})

	}
}