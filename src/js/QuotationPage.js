import DefaultPage from './DefaultPage'
import LocalStorage from './LocalStorage'
import WeavingItem from './WeavingItem'

export default class QuotationPage extends DefaultPage {
	constructor (args = {}) {
		super(args)

		this.renderQuotationPage(args)
	}

	renderQuotationPage(args) {
		console.log('QuotationPage args', args)
		args.page = 'quotation'
		if (args.previousAttr === 'weavingList' || args.previousAttr === 'garbageList') {
			args.previousAttr = 'weeksList'
		}
		const {page, workerName, weekNumber, previousAttr} = args

		super.createHeader(args)
		super.createHeaderBackArrow(page, previousAttr, weekNumber, workerName)
		super.showHeaderName(page, workerName, weekNumber)
		QuotationPage.getCurrency(QuotationPage.dataHandler)
	}

	// делаем API запрос
	static getCurrency (callback) {
		// данные взяты с https://partners.ifxdeal.com/ru/quotes_description.php/
		fetch('https://quotes.instaforex.com/api/quotesTick?m=json&q=silver,gold,usdrub')
			.then(response => response.json())
			.then(data => callback(data))
		
	}

	// обрабатываем API запрос
	static dataHandler (data) {
		const rubPerUsd = data[2].bid
		const usdPerSilverUncia = data[0].bid
		const usdPerGoldUncia = data[1].bid
		const silver = QuotationPage.calcPrice(usdPerSilverUncia, rubPerUsd)
		const gold = QuotationPage.calcPrice(usdPerGoldUncia, rubPerUsd)
		QuotationPage.setCurrencyValue(silver, gold)
		QuotationPage.showCurrencyChange (data[0].change, data[1].change)
	}

	// изменяет стрелочки зелёная или красная
	static changeMetallClass (metall, elem) {
		if (metall > 0) {
			elem.classList.remove('metall__change_decrease')
			elem.classList.add('metall__change_increase')
		} else {
			elem.classList.remove('metall__change_increase')
			elem.classList.add('metall__change_decrease')
		}
	}

	// паказываем падает или растёт металл
	static showCurrencyChange (silver, gold) {
		const silverChangeElement = document.querySelector('[data-silver-change]')
		const goldChangeElement = document.querySelector('[data-gold-change]')

		QuotationPage.changeMetallClass(silver, silverChangeElement)
		QuotationPage.changeMetallClass(gold, goldChangeElement)
		
	}

	// переводим стоимость унции в рубли 
	static calcPrice(metall, usd) {
		return Math.round(metall * usd * 1000000000 / 311034768) / 100
	}
	
	// выводим результаты на страницу
	static setCurrencyValue (silver, gold) {
		const silverMarketElement = document.querySelector('[data-silver-market]')
		const silverSterlingElement = document.querySelector('[data-silver-sterling]')
		const goldMarketElement = document.querySelector('[data-gold-market]')
		const goldSterlingElement = document.querySelector('[data-gold-sterling]')
		
		silverMarketElement.textContent = silver
		goldMarketElement.textContent = gold
		silverSterlingElement.textContent = Math.round(silver * 100 * 925 / 1000) / 100
		goldSterlingElement.textContent = Math.round(gold * 100 * 585 / 1000) / 100
	}
}