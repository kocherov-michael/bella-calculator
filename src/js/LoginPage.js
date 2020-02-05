import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import Router from './Router'

export default class LoginPage extends DefaultPage {
	constructor (args = {}) {
		super(args)
		this.page = 'login'
		this.checkLoggedUser()
	}

	checkLoggedUser () {
		const checkObj = JSON.parse(localStorage.getItem('bella-user')) || {}
		if ( checkObj.userMail && checkObj.userPassword) {
			window.userMail = checkObj.userMail
			window.userPassword = checkObj.userPassword

			fetch('assets/php/dataRead.php', {
				method: 'post', 
				// body: JSON.stringify({mail: 'kocoer@mail'}),
				body: JSON.stringify(userMail),
				// body: 'kocherov@mail.ru',
				headers: {
					'content-type': 'application/json'
				}
			})
				.then(response => response.json())
				.then(result => console.log(result))
	
			Router.openFirstPage({page: 'weeksList'})
				
		} else {
			// Router.openFirstPage({page: 'login'})
			const currentPageElement = document.querySelector(`[data-page="login"]`)
			currentPageElement.classList.remove('hide')
			this.listenLoginPage()
		}
	}

	listenLoginPage() {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const loginButtonElement = currentPageElement.querySelector(`[data-login-button]`)
		const forgotButtonElement = currentPageElement.querySelector(`[data-forgot-button]`)
		const registrationButtonElement = currentPageElement.querySelector(`[data-registration-button]`)

		loginButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			// console.log('login')
		})

		forgotButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			// console.log('login')

			Router.changeNextPage({
				currentPageAttr: this.page, 
				nextPageAttr: 'restorePassword', 
				weekNumber: '', 
				workerName: ''
			})
		})

		registrationButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			// console.log('login')
		})

	}
}