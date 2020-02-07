import LocalStorage from './LocalStorage'
import Router from './Router'
import BrigadeBalanceList from './BrigadeBalanceListPage'

export default class LoginPage {

	constructor (args = {}) {
		this.page = 'login'
		this.checkLoggedUser()
	}

	checkLoggedUser () {
		const checkObj = JSON.parse(localStorage.getItem('bella-user')) || {}
		if ( checkObj.userEmail && checkObj.userPassword) {
			window.userEmail = checkObj.userEmail
			window.userPassword = checkObj.userPassword

			Router.openFirstPage({page: 'weeksList'})
				
		} else {
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
			<div class="password__eye hide-password" data-eye>
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
		const eyePasswordElement = currentPageElement.querySelector(`[data-eye]`)

		loginButtonElement.addEventListener('click', (event) => {
			event.preventDefault()

			// проверяем корректность email
			const userEmail = LoginPage.validate(loginEmailElement)

			if (!userEmail) {
				return
			}

			// проверяем заполнен ли пароль
			const userPassword = LoginPage.isNotEmpty(loginPasswordElement, "Введите пароль")

			if (!userPassword) {
				return
			}

			// const userObj = {userEmail, userPassword}
			// console.log(userObj)
			;(async () => {
				try {
					let response = await fetch('assets/php/login.php', {
						method: 'post', 
						body: JSON.stringify({userEmail, userPassword}),
						headers: {
							'content-type': 'application/json'
						}
					})
					
					let result = await response.json()
					// проверяем результаты запроса
					if (result === 'wrong password') {
						LoginPage.showInputError(loginPasswordElement, 'Пароль введён неверно')
					} 
	
					else if (result === 'wrong email') {
						LoginPage.showInputError(loginEmailElement, 'Данная почта не зарегистрирована')
					}
	
					else if (!result.trim()){
						// если данные у пользователя пустая строка
						LocalStorage.login({userEmail, userPassword})
						Router.changeNextPage({
							currentPageAttr: 'login', 
							nextPageAttr: 'weeksList', 
							weekNumber: ''
						})
					}
	
					else if ( JSON.parse(result) instanceof Object) {
						
						LocalStorage.login({userEmail, userPassword})
						LocalStorage.save(JSON.parse(result))
	
						Router.changeNextPage({
							currentPageAttr: 'login', 
							nextPageAttr: 'weeksList', 
							weekNumber: ''
						})
					} 
	
					else  {
						console.log('непредвиденная ошибка')
					}
					this.error = false
				} catch(error) {
					console.log(error)
					this.error = true
				} finally {
					if (this.error) {
						LocalStorage.login({userEmail: 'test@bella.ru', userPassword: 'password'})

						Router.changeNextPage({
							currentPageAttr: 'login', 
							nextPageAttr: 'weeksList', 
							weekNumber: ''
						})
					}
					
				}
			})()
				
				

			// fetch('assets/php/login.php', {
			// 	method: 'post', 
			// 	body: JSON.stringify({userEmail, userPassword}),
			// 	headers: {
			// 		'content-type': 'application/json'
			// 	}
			// })
			// 	// .then(response => response.text())
			// 	// .then(text => console.log(text))
			// 	.then(response => {response.json()})
			// 	.then(result => {
			// 		console.log(result)

					
			// 		// проверяем результаты запроса
			// 		if (result === 'wrong password') {
			// 			LoginPage.showInputError(loginPasswordElement, 'Пароль введён неверно')
			// 		} 

			// 		else if (result === 'wrong email') {
			// 			LoginPage.showInputError(loginEmailElement, 'Данная почта не зарегистрирована')
			// 		}

			// 		else if (!result.trim()){
			// 			// если данные у пользователя пустая строка
			// 			LocalStorage.login({userEmail, userPassword})
			// 			Router.changeNextPage({
			// 				currentPageAttr: 'login', 
			// 				nextPageAttr: 'weeksList', 
			// 				weekNumber: ''
			// 			})
			// 		}

			// 		else if ( JSON.parse(result) instanceof Object) {
						
			// 			LocalStorage.login({userEmail, userPassword})
			// 			LocalStorage.save(JSON.parse(result))

			// 			Router.changeNextPage({
			// 				currentPageAttr: 'login', 
			// 				nextPageAttr: 'weeksList', 
			// 				weekNumber: ''
			// 			})
			// 		} 

			// 		else  {
			// 			console.log('непредвиденная ошибка')
			// 		}
			// 	})
		})

		forgotButtonElement.addEventListener('click', (event) => {
			event.preventDefault()

			Router.changeNextPage({
				currentPageAttr: this.page, 
				nextPageAttr: 'restorePassword', 
				weekNumber: '', 
				workerName: ''
			})
		})

		registrationButtonElement.addEventListener('click', (event) => {
			event.preventDefault()
			
			Router.changeNextPage({
				currentPageAttr: this.page, 
				nextPageAttr: 'registration', 
				weekNumber: '', 
				workerName: ''
			})
		})

		LoginPage.showHidePassword(eyePasswordElement, loginPasswordElement)

		// RestorePasswordPage.showNotice()
		
	}
	
	// скрыть / показать пароль
	static showHidePassword (eyePasswordElement, loginPasswordElement) {
		eyePasswordElement.addEventListener('click', (event) => {
			event.stopPropagation()
			// console.log(eyePasswordElement)
			const attribute = loginPasswordElement.getAttribute('type')
			if (attribute === 'password') {
				loginPasswordElement.setAttribute('type', 'text')
				eyePasswordElement.classList.remove('hide-password')
				eyePasswordElement.classList.add('show-password')
				loginPasswordElement.focus()
			} else if (attribute === 'text') {
				loginPasswordElement.setAttribute('type', 'password')
				eyePasswordElement.classList.remove('show-password')
				eyePasswordElement.classList.add('hide-password')
				loginPasswordElement.focus()
			}
	
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
		// проверяем пустой ли email
		let email = LoginPage.isNotEmpty(inputElement, 'Введите email')
		if (!email) {
			return false
		}

		const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		email = inputElement.value.trim()

		if(reg.test(email) === false) {
			LoginPage.showInputError(inputElement, 'Адрес почты не корректен')

			return false
		}
		else {
			return email
		}
	}

	// проверка пустое ли поле ввода
	static isNotEmpty(inputElement, text) {
		const val = inputElement.value.trim()

		if (val.length === 0) {
			LoginPage.showInputError(inputElement, text)
			return false
		}
		else {
			return val
		}
	}


}