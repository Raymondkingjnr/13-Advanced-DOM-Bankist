'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault(e);
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
/////////////////////////////////////////////////

//EVENTS DELEGATION
//SMOOTH SCROLLING WITH LINKS
/*
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});*/

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //MATCHING STRATEGY
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//////////////////////////////////////////////
//IMPLEMENTING SMOOTH SCROLLING WITH 'A' LINK

const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.getElementById('section--1');

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });

  //const s1coords = section1.getBoundingClientRect();
  //console.log(s1coords);

  //console.log(e.target.getBoundingClientRect());

  //scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  /*
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  */
});
const header = document.querySelector('.header');
////////////////////////////////////////
//DOM TRAVERSING
const h1 = document.querySelector('h1');

//going downward: Child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

//going upward: parents

console.log(h1.parentNode);
console.log(h1.parentElement);

//h1.closest('.header').style.background = 'var(--gradient-secondary)';

//going sideways: siblings
//we can also find the children inside an element using parentElement

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(1)';
});
///////////////////////////////////

//TABBED COMPONENT

tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  console.log(clicked);
  //Remove Active Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
//////////////////////////////////////////////
//PASSING ARGUMENTS INTO EVENTSHANDLERS

const handHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

/*
nav.addEventListener('mouseover', function (e) {
  handHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handHover(e, 1);
});
*/

nav.addEventListener('mouseover', handHover.bind(0.5));
nav.addEventListener('mouseout', handHover.bind(1));
///////////////////////////////

//STICKY NAVIGATION
/*
const initailCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function () {
  if (window.screenY > initailCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

///////////////////////////////////
//STICKY NAVIGATION: INTERSECTION OBESERVER API

/*
const obsCallBack = function (entries, observer) {
  entries.forEach(entry => {});
};

const obOptions = {
  root: null,
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallBack, obOptions);
observer.observe(section1);
*/

const heading = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerOberserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerOberserver.observe(heading);
/////////////////////////////////

//Reveal section

const allSection = document.querySelectorAll('.section');

const RevealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(RevealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//////////////////////////////////
//////////////////////////////////
//LOADING LAZY IMAGE
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-100px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////
//////////////////////////////////

//////////////////////////////////
/////////////////////////////////
//SLIDER IMG
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
let curSlide = 0;
const maxSlide = slides.length;
const slider = document.querySelector('.slider');
const dot = document.querySelector('.dots');

// slider.style.transform = `scale(0.4) translateX(-800px)`;
// slider.style.overflow = 'visible';

const creatDots = function () {
  slides.forEach(function (_, i) {
    dot.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

creatDots();

const activaDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dot__dot--active');
};
activaDot(0);

const gotoSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

gotoSlide(0);
//next slide

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  gotoSlide(curSlide);
  activaDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  gotoSlide(curSlide);
  activaDot(curSlide);
};
btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide;
});

dot.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    gotoSlide(slide);
    activaDot(slide);
  }
});

////////////////////////////////
///////////////////////////////

//THIS WILL CREATE A NODELIST
const allSelections = document.querySelectorAll('.section');
console.log(allSelections);
//////////////////////////////

document.getElementById('section--1');

//THIS RETURNS AN HTML COLLECTION IT CHANGES WITH THE DOM
const allButtons = document.getElementsByTagName('button');

console.log(allButtons);
/////////////////////////////////////
console.log(document.getElementsByClassName('btn'));

//CREATING AND INSERTING ELEMENTS
//.insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML =
  'We use cookies for improved functionality and anaylytics <button class = "btn btn--close-cookie">Got it!<button>';

//header.prepend(message);
header.append(message);

// header.before(message);
// header.after(message);

//DELETE ELEMENT
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    //message.remove();
    message.parentElement.removeChild(message);
  });

//STYLES

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(getComputedStyle(message).height);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 10 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');
//////////////////////////////////////////////

//SELECTING ELEMENTS
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

document.querySelector('.header');

const allSections = document.querySelectorAll('.section');

console.log(allSections);

document.getElementById('section--1');
const allButton = document.getElementsByTagName('button');
console.log(allButton);

console.log(document.getElementsByClassName('btn'));

/////////////////////////////////
//ATTRIBUTES EG SRC ALT CLASS AND ID'S
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.src);
console.log(logo.getAttribute('.src'));

const link = document.querySelector('.nav_link--btn');

//console.log(link.href);
//console.log(link.getAttribute('href'));

//DATA ATTRIBUTES

console.log(logo.dataset.versionNumber);

//CLASS
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

//////////////////////////////////////
//EVENTS AND EVENT HOLDERS  a signal generated by a DOM node
/*
const h1 = document.querySelector('h1');

const alertH1 = e => {
  alert('addEventListeners: Great! you are reading the Heading');
};
h1.addEventListener('mouseenter', alertH1);

//setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
*/

///////////////////////////////////////

//EVENTS PROPAGATION

/*
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
});
*/

//////////////////////////////////////////
