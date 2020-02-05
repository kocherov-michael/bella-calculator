import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import Router from './Router'
import LoginPage from './LoginPage'

export default class RegistrationPage extends DefaultPage {
	constructor (args = {}) {
		super(args)
		this.page = 'registration'
		// this.checkLoggedUser()
		this.listenRegistrationButton()
		this.listenLoginButton()
	}

	listenRegistrationButton () {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const registrationButtonElement = currentPageElement.querySelector(`[data-registration-button]`)
		const registrationEmailElement = currentPageElement.querySelector(`[data-email-registration]`)
		const registrationPasswordElement = currentPageElement.querySelector(`[data-password-registration]`)

		registrationButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			// console.log(registrationEmailElement.value)
			// console.log(registrationPasswordElement.value)
			const correctEmail = LoginPage.validate(registrationEmailElement.value)
			// registrationEmailElement.value

			// localStorage.setItem('bella-user', JSON.stringify(dataObj))

			// Router.changeNextPage({
			// 	currentPageAttr: this.page, 
			// 	nextPageAttr: 'weeksList', 
			// 	weekNumber: ''
			// })
		})
	}

	listenLoginButton () {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const loginButtonElement = currentPageElement.querySelector(`[data-login-button]`)

		loginButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			// console.log('login')
			Router.changeNextPage({
				currentPageAttr: this.page, 
				nextPageAttr: 'login', 
				weekNumber: ''
			})
		})
	}
}