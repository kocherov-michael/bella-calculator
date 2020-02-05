import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import Router from './Router'

export default class RestorePasswordPage extends DefaultPage {
	constructor (args = {}) {
		super(args)
		this.page = 'restorePassword'
		// this.checkLoggedUser()
		this.listenRestoreButton()
		this.listenBackButton()
	}

	// прослушка кнопки Восстановить
	listenRestoreButton () {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const restoreButtonElement = currentPageElement.querySelector(`[data-restore-button]`)

		restoreButtonElement.addEventListener('click', (event) => {

			event.preventDefault()

			;(async () => {
				let promise = new Promise((resolve, reject) => {
					console.log('показываем окно')
					setTimeout(() => resolve("ждём"), 3000)
				});
				let result = await promise;
				console.log('закрываем окно')

				showNotice(currentPageElement)

				// databaseRequest()
			})()
			Router.changePreviousPage(this.page, 'login', '')
		})
	}

	// прослушка кнопки Назад
	listenBackButton () {
		// console.log(this.page)
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const backButtonElement = currentPageElement.querySelector(`[data-back-button]`)

		backButtonElement.addEventListener('click', () => {

			Router.changePreviousPage(this.page, 'login', '')
		})
	}

	// показать уведомление, что пароль отправлен на почту
	showNotice (currentPageElement) {
		// const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		
	}
}