Уявіть, що ви працюєте розробником програмного забезпечення в банку. Ваше
завдання - створити SPA, щоб користувачам було зручно керувати курсами валют.

Ваш додаток повинен складатися з 2 сторінок:

## Сторінка 1

`Home` з конвертером з однієї валюти в іншу. На цій сторінці повинно бути ОДНЕ
текстове поле, в яке можна ввести текст, наприклад, `15 USD in UAH` і отримати
результат.

## Сторінка 2

`Rates` з поточними курсами валют. На цій сторінці користувач повинен бачити
"свіжі" курси валют по відношенню до базової валюти - наприклад, якщо базовою
валютою є гривня, користувач бачить, що 1 USD = 36.80 грн., а 1 EUR = 40.20 грн.

Створіть навігаційну панель (в будь-якому місці додатку, де, на вашу думку, це
буде краще) для переходу між сторінками.

При першому (і тільки ПЕРШОМУ) відкритті програми автоматично визначити валюту
за поточним місцезнаходженням користувача (не розглядайте варіант, коли
користувач використовує вкладку інкогніто).

Використовуйте ліниве завантаження (ВАЖЛИВО!) для прискорення роботи додатку.
Використовуйте redux для управління станом.

- Користувач повинен мати можливість змінити свій поточний курс. Додайте цю
  опцію там, де, на вашу думку, це буде краще.

Приклади різних API, які ви можете використовувати для цього завдання:

- [Exchange Rates Data API Рекомендований до використання!!!](https://apilayer.com/marketplace/exchangerates_data-api)
  Ліміт запитів 100 на місяць, тому краще зареєструватися з декількох акаунтів.

- [API біржових курсів](https://exchangeratesapi.io/documentation/)
- [Fixer API (подібний до попереднього)](https://fixer.io/documentation)
- [Відкриті курси валют](https://openexchangerates.org/)

Це тестове завдання однієї з компаній на ринку IT,
[оригінал завдання](https://hackmd.io/@YGYcYPwrSpam-opsOJHMAw/rJ_UTnAVt)

Ми покроково розберемо як виконати дане завдання, щоб у вас був логарифм дій для
виконання інших тестових завдань.

В проєкті налаштовані Alias imports тому імпорти можна вказувати з папки
`components`

```jsx
import { Heading } from 'components';
```

## 1 Крок

- Потрібно підключити в проєкт npm пакет react-router-dom
  `npm i react-router-dom`
- Використай сторінки `Home` `Rates` і компонент `Header`
- В проєкті будуть такі маршрути:
  - `'/'` - сторінка `<Home>`, домашня сторінка з конвертером з однієї валюти в
    іншу.
  - `'/rates'` - сторінка `<Rates>`, сторінка зі "свіжими" курсами валют.
  - `'*'` коли користувач перейде за неіснуючим маршрутом, перенаправте його на
    основну сторінку, використовуючи компонент `<Navigate/>` з бібліотеки
    react-router-dom

## 2 Крок (на даному етапі користувач завжди дозволяє використовувати своє місцезнаходження)

- Визначити поточне місцезнаходження користувача, використовуючи метод
  [getCurrentPosition]
  (https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition)
- Коли ми отримали `latitude` і `longitude` місцезноходження нашого користувача,
  ми можемо отримати його поточну валюту використовуючи сервіс
  [opencagedata](https://opencagedata.com/)

### Функція для запиту на бекенд створена в папці `service/opencagedataApi`

### Потрібно лише розібратися як вона працює і що повертає.

Використовуйте цей рядок запиту

```bash
const apiKey = 'd4683b09d0c94ec0aebf0b2e043decbf';
const urlPosition = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${apiKey}&language=en`;

```

Для отримання поточної валюти потрібно використати наступну вкладеність
`results[0].annotations.currency.iso_code`

## 3 Крок

- Потрібно підключити в проєкт redux
  `npm install @reduxjs/toolkit react-redux redux-persist`
- Для підключення redux потрібно використовувати папку `reduxState` тому що
  Alias налаштовані саме з папки з назвою `reduxState`
- Використовуючи `createAsyncThunk`, потрібно створити thunk для того, щоб
  записати в стейт поточну валюту користувача. Нехай Redux-state виглядає
  наступним чином.

```bash
  currency: {
   baseCurrency:''
  }
```

- Потрібно налаштувати збереження властивості `baseCurrency` в `local storage`
  використовуючи бібліотеку `redux-persist`
- Використовуй цей
  [конфіг](https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist)
  для `store`

  ## 4 Крок

- Використовуючи метод `getState` додайте перевірку, щоб тільки при першому
  відкритті сторінки, програма визначала поточну валюту користувача

```bash
    const state = thunkAPI.getState();
    const { baseCurrency } = state.currency;

    if (baseCurrency) {
      return thunkAPI.rejectWithValue('We already have base currency!');
    }
```

- Потрібно опрацювати варіант, коли користувач не дозволить використовувати
  місцезнаходження. Створіть синхронний action і, якщо користувач не дозволить
  використовувати його місцезнаходження, запишіть в стейт базову валюту на
  вибір, наприклад `USD`.

- Створіть селектор і в компоненті `Header` зробіть рендер по умові для поточної
  валюти (додамо пізніше можливість обирання іншої поточної валюти)

```bash
     {baseCurrency && <p> Your base currency: {baseCurrency}</p> }
```

## 5 Крок

- Використайте компонент форми `ExchangeForm` в якому буде форма з одним
  інпутом, в який буде вводитися текст в форматі`15 USD in UAH`. Для валідації
  інпута можна використати регулярний вираз:

```bash
     ^\d+(\.\d{1,2})?\s[a-zA-Z]{3}\sin\s[a-zA-Z]{3}$
```

Ось що означає кожна частина цього виразу:\
 `^` - початок рядка.\
 `\d+` -відповідає одній або більше цифрам.\
 `(\.\d{1,2})?` - відповідає десятковому розділовому знаку (крапці) та одній або
двом цифрам після нього,\
 роблячи цю частину необов'язковою.\ `\s` - відповідає пробілу.\
 `[a-zA-Z]` - будь-яка літера англійської абетки, незалежно від регістру (велика
або мала літера).\
 `{3}` - рівно три рази, що вказує на кількість літер.\
 `\s` - знову відповідає пробілу.\
 `in` - відповідає тексту "in".\
 `\s`- знову відповідає пробілу.\
 `[a-zA-Z]` - будь-яка літера англійської абетки, незалежно від регістру (велика
або мала літера).\
 `{3}` - рівно три рази, що вказує на кількість літер.\
 `$` - кінець рядка.

- Відповідно до умов завдання, користувач вводить необхідні дані в форматі
  `15 USD in UAH`. В документації бекенда
  [Exchange Rates Data API](https://apilayer.com/marketplace/exchangerates_data-api)
  вказано, що потрібно передавати `to`, `from`, `amount`. Тому при сабміті форми
  з рядка `15 USD in UAH` потрібно отримати об'єкт

```bash
{
  to: 'UAH',
  from: 'USD',
  amount: 15
}
```

- Використовуючи `createAsyncThunk`, потрібно створити thunk для того, щоб
  відправити запит на бекенд і записати відповідь в Redux-state.

### Функція для запиту на бекенд створена в папці `service/exchangeAPI`

### Потрібно лише розібратися як вона працює і що повертає.

Нехай Redux-state виглядає наступним чином.

```bash
currency: {
    baseCurrency:''
    exchangeInfo: null,
    isLoading: false,
    isError: null,
 }
```

- Після отримання успішної відповіді запишемо у властивість `exchangeInfo`
  об'єкт з результатом конвертації валют

```bash
currency: {
    ...
   exchangeInfo: {
      to: 'UAH',
      from: 'USD',
      amount: 15,
      rate: 37.5,
      result: 562.5
    }
}
```

- Створіть селектор, щоб отримати зі стейту дані про конвертацію валют.
- Після успішної відповіді на сторінці потрібно відобразити результат операції,
  використовуючи компонент `<ExchangeInfo/>`, який очікує пропси
  `amount, from, to, rate, result`
- При запиті з помилкою інформуємо користувача, що щось пішло не так

```bash
  {exchangeInfo && <ExchangeInfo  />}
   {isError && (
          <Heading
            error
            title="Something went wrong...😐 Check the data validity and try again!"
          />
    )}
```

- Вказуємо в Redux-state початкові дані, якщо виникла помилка запиту.

```bash
  currency: {
   ...
    exchangeInfo: null
 }
```

- Під час запиту на бекенд відображаємо компонент `<Loader/>`

```bash
 {isLoading && <Loader />}
```

## 6 Крок. Переходимо до сторінки Rates

- Використовуючи `createAsyncThunk` потрібно створити thunk для відправки запиту
  на бекенд для отримання актуальних курсів валют відносно `baseCurrency`
  [endpoint](https://api.apilayer.com/exchangerates_data/latest?symbols&base=uah)

### Функція для запиту на бекенд створена в папці `service/exchangeAPI`

### Потрібно лише розібратися як вона працює і що повертає.

- При успішній відповіді повертається об'єкт, тому потрібно використати
  `Object.entries()` щоб було зручно працювати далі з цими даними.

Нехай Redux-state виглядає наступним чином.

```bash
currency: {
  baseCurrency: '',
  exchangeInfo: null,
  isLoading: false,
  isError: null,
  rates: [],
 }
```

- Для відображення актуальних курсів на сторінці потрібно використати
  `createSelector`, щоб відображати всі валюти крім базової
- З масиву масивів (так як ми використовували Object.entries()) потрібно
  створити масив об'єктів, щоб було зручно відображати розмітку.
- Потрібно порахувати курс відносно коефіцієнта, що надає нам бекенд

```bash
rates
  .filter(([key]) => key !== baseCurrency)
  .map(([key, value]) => ({ key, value: (1 / value).toFixed(2) }));
```

- Для відображення курсів використовуємо компонент `<RatesList/>`

```bash
{fileredRates.length > 0 && <RatesList rates={fileredRates} />}
```

## 7 Крок

- Додамо можливість змінювати поточну валюту.

- В компоненті `<Header/>` використаємо компонент `<SelectRates/>`

```bash
{baseCurrency && <SelectRates baseCurrency={baseCurrency} />}
```

- Для створення зручного інтерфейсу використаємо бібліотеку
  [react-select](https://www.npmjs.com/package/react-select)

- Для створення списку всіх валют, щоб можна було вибрати поточну валюту,
  пропоную використати symbols.json зі списком всіх валют (пропс `options` для
  компонента `<Select/>`)
- Також для компонента потрібно буде передати пропс value, щоб відображалася
  `baseCurrency`.
- Пропс `isSearchable` дозволяє вводити текст, щоб швидше знайти потрібну
  валюту.

```bash
<Select
  className={styles.select}
  classNamePrefix="react-select"
  value={{
    label: baseCurrency,
    value: baseCurrency,
  }}
  options={symbols}
  isSearchable
/>
```

- Для стилізації використовується файл зі стилями `ReactSelect.css`, така
  особливість бібліотеки.
  [Документація по стилізації](https://react-select.com/styles#the-classnameprefix-prop)

- При події `onChange` на `<Select/>` потрібно записати в стейт вибрану валюту,
  використовуючи `setBaseCurrensy`.

- На сторінці `<Rates/>` потрібно в масив залежностей `useEffect` додати
  `baseCurrency`, щоб при зміні поточної валюти у нас оновилися дані.

```bash
useEffect(() => {
    ...
}, [dispatch, baseCurrency]);
```

## 8 Крок

- Для того, щоб простіше було знайти потрібний курс використайте компонент
  `<Filter/>`
- Використовуючи `createSlice`, додайте в Redux-state значення фільтра.
- При вводі в інпут потрібно відображати відфільтровані курси. Для цього
  поправимо селектор відфільтрованих курсів

```bash
rates
  .filter(
    ([key]) => key !== baseCurrency && key.toLowerCase().includes(filter),
  )
  .map(([key, value]) => ({ key, value: (1 / value).toFixed(2) }));
```

На цьому етапі наше завдання виконане!😎 Вітаю з завершенням тестового завдання
і курсу react!🤩 Успіху! 💪