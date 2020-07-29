  export class Popup {
  /**
   * @param {String} contentSelector - селектор шаблона, хранящего в себе контент модального окна 
   * @param {String} openBtnSelector - селектор кнопки, открывающей модальное окно
   * @param {String} title - текс, помещяемый в заоголовок модального окна
   */
  constructor(contentSelector, openBtnSelector, title) {
    this.contentTemplate = document.querySelector(contentSelector).content.querySelector('div').innerHTML;
    this.openBtn = document.querySelector(openBtnSelector);
    this.title = title;
    
    this.render();
  }

  getTemplate(title = 'Модальное окно', content) {
    return `
      <h1 class="popup__title">${ title }</h1>
      <div class="popup__content">${ content }</div>
      <button class="popup__close" data-type="close"></button>
    `;
  } 

  render() {
    // Формирование ссылки на файл стилей модального окна
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'modal/style.css';
    document.head.appendChild(style);

    // Формирование контейнера для контента модального окна и добавление его на страницу
    this.popupContainer = document.createElement('div');
    this.popupContainer.classList.add('popup');
    this.popupContainer.innerHTML = this.getTemplate(this.title, this.contentTemplate);
    document.body.appendChild(this.popupContainer);

    // Добавление обработчиков кнопкам открытия и закрытия модального окна
    this.closeBtn = this.popupContainer.querySelector('[data-type="close"]');
    this.closeBtn.addEventListener('click', this.toggle);
    this.openBtn.addEventListener('click', this.toggle);
  }

  /**
   * Обработчик клика вне модального окна
   */
  outsideClickHandler = (evt) => {
    if (!evt.target.contains(this.popupContainer) && evt.target !== this.openBtn && !this.popupContainer.contains(evt.target)) {
      this.close();
    }
  }

  toggle = () => {
    if (this.popupContainer.classList.contains('popup--entered')) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Метод открытия модального окна
   */
  open() {
    const ref = function (fn) {
      requestAnimationFrame(function () {
        fn();
      });
    }

    this.popupContainer.classList.add('popup--enter');
    ref(() => {
      this.popupContainer.classList.add('popup--entering');
    });

    const openTransitionendHandler = () => {
      this.popupContainer.classList.add('popup--entered');
      this.popupContainer.classList.remove('popup--enter');
      this.popupContainer.classList.remove('popup--entering');

      this.popupContainer.removeEventListener('transitionend', openTransitionendHandler);
    }

    this.popupContainer.addEventListener('transitionend', openTransitionendHandler);
    document.addEventListener('click', this.outsideClickHandler);
  }

  /**
   * Метод закрытия модалного окна
   */
  close() {
    this.popupContainer.classList.add('popup--exit');

    const closeTransitionendHandler = () => {
      this.popupContainer.classList.remove('popup--exit');
      this.popupContainer.classList.remove('popup--entered');

      this.popupContainer.removeEventListener('transitionend', closeTransitionendHandler);
    }

    this.popupContainer.addEventListener('transitionend', closeTransitionendHandler);
    document.removeEventListener('click', this.outsideClickHandler);
  }
};