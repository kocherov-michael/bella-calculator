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
		if ( checkObj.userEmail && checkObj.userPassword) {
			window.userEmail = checkObj.userEmail
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
			this.renderLoginPage()
			this.listenLoginPage()
		}
	}

	// отрисовываем страницу входа
	renderLoginPage() {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)

		currentPageElement.innerHTML = ""
		currentPageElement.innerHTML = 
		`<form class="start-form">
		<div class="start-form__logo"></div>

		<div class="start-form__input email" data-error="Данная почта не зарегистрирована">
			<input type="email" class="email__text" placeholder="Почта" value="" name="email" data-email-login>
		</div>

		<div class="start-form__input password">
			<input type="password" class="password__text" placeholder="Пароль" value="" name="password" data-password-login>
			<div class="password__eye">
				<img src="assets/img/open_eye.svg" class="password-is-hidden" alt="show">
				<img src="assets/img/closed_eye.svg" class="password-is-visible" alt="hide">
			</div>
		</div>

		<button class="start-form__login login-button" data-login-button>Войти</button>
		
		<div class="start-form__forgot" data-forgot-button>Забыли пароль?</div>
	</form>
	<button class="start-form__registration login-button login-button_color_secondary" data-registration-button>Зарегистрироваться</button>`
	}

	listenLoginPage() {
		const currentPageElement = document.querySelector(`[data-page="${this.page}"]`)
		const loginButtonElement = currentPageElement.querySelector(`[data-login-button]`)
		const forgotButtonElement = currentPageElement.querySelector(`[data-forgot-button]`)
		const registrationButtonElement = currentPageElement.querySelector(`[data-registration-button]`)
		const loginEmailElement = currentPageElement.querySelector(`[data-email-login]`)
		const loginPasswordElement = currentPageElement.querySelector(`[data-password-login]`)

		loginButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			// console.log('login')
			const userEmail = LoginPage.validate(loginEmailElement)

			if (!userEmail) {
				return
			}

			const userPassword = LoginPage.isNotEmpty(loginPasswordElement)

			if (!userPassword) {
				return
			}

			const userObj = {userEmail, userPassword}

			const result = LocalStorage.login(userObj)

			// проверяем результаты запроса
			if (result === true) {
				Router.changeNextPage({
					currentPageAttr: this.page, 
					nextPageAttr: 'weeksList', 
					weekNumber: ''
				})
			} else if (result === 'wrong password') {
				// console.log('result:', result)
				LoginPage.showInputError(loginPasswordElement, 'Пароль введён неверно')
			} else if (result === 'wrong email') {
				// console.log('result:', result)
				LoginPage.showInputError(loginEmailElement, 'Данная почта не зарегистрирована')
			}

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
			Router.changeNextPage({
				currentPageAttr: this.page, 
				nextPageAttr: 'registration', 
				weekNumber: '', 
				workerName: ''
			})
		})

	}

	// показать ошибку Input
	static showInputError (inputElement, errorText) {
		const inputContainerElement = inputElement.closest('.start-form__input')
			inputContainerElement.setAttribute('data-error', errorText)
			inputContainerElement.classList.add('error')
	
			// прослушиваем ввод текста в инпут чтобы убрать ошибку
			inputElement.addEventListener('input', () => {
				inputContainerElement.classList.remove('error')
			})
	}

	// проверка валидности email
	static validate(inputElement) {
		const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		const email = inputElement.value.trim()

		if(reg.test(email) === false) {
			LoginPage.showInputError(inputElement, 'Адрес почты не корректен')

			return false
		}
		else {
			return email
		}
 }

 // проверка пустой ли пароль
 static isNotEmpty(inputElement) {
	const password = inputElement.value.trim()

	if (password.length === 0) {
		LoginPage.showInputError(inputElement, 'Пароль пустой')
		return false
	}
	else {
		return password
	}
 }


}