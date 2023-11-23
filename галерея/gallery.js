const images = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"];
let activeImage = 0; // номер картинки в массиве с помощье нег мы будем осуществлять изменение картинок
const sliderPlace = document.querySelector(".slider-line");
const widthOffset = document.querySelector(".slider").clientWidth;
sliderPlace.style.width = 3 * widthOffset + "px"; // на экране помещается одновременно три картинки в ширину
sliderPlace.style.heigth = widthOffset + "px";
sliderPlace.style.left = "-" + widthOffset + "px";
let flag = true; // флаг использую что бы не было бага с быстрым нажатием кнопок

// фунукция которая создаюет тег img и добавляет его
const initSlider = () => {
  const img = document.createElement("img");
  img.alt = "";
  img.src = "images/" + images[activeImage];
  sliderPlace.append(img);
  nextImageGenerate();
  prevImageGenerate();
};

// функция добавляет картинку с права от центра и при изменении nextImage кортинка меняется
const nextImageGenerate = () => {
  let nextImage = activeImage + 1; // следующая картинка в массиве images
  if (nextImage >= images.length) nextImage = 0; // проверка если мы вышли за приделы массива images
  const img = document.createElement("img");
  img.alt = "";
  img.src = "images/" + images[nextImage];
  sliderPlace.append(img);
};

// аналогично работает предыдущей функции только добовляет картинку с лева 
const prevImageGenerate = (w = false ) => {
  let prevImage = activeImage - 1; // предыдущиая картинка в массиве images
  if (prevImage < 0) prevImage = images.length - 1; // проверка если мы заходим в отрицательные индексы массивов images
  const img = document.createElement("img");
  img.alt = "";
  img.src = "images/" + images[prevImage];
  if (w) img.style.width = 0; // при сробатывании функции prevSlide чтобы в начале картинка была 0 размера и постепенно увеличивалась
  sliderPlace.prepend(img);
};
const nextSlide = () => {
  if (!flag) return; // что бы анимации полностью отработала, только после этого сработает еще раз кнопка
  flag = !flag; 
  activeImage++;
  if (activeImage >= images.length) activeImage = 0;
  // document.querySelector(".slider-line img").remove();
  nextImageGenerate();
  animate({// объект с пораметрами для анимации
    duration: 1000,  // длительность анимации 1 сек
    draw: function (progress) {
      document.querySelector(".slider-line img").style.width =
        widthOffset * (1 - progress) + "px"; // progress в течении секунды увеличивается от 0 до 1 и из за этого ширина картинки медленно уменьшается
    },
    removeElement: document.querySelector(".slider-line img"), 
  });
};

const prevSlide = () => {
  if (!flag) return;
  flag = !flag; // что бы анимации полностью отработала, только после этого сработает еще раз кнопка
  activeImage--;
  if (activeImage < 0) activeImage = images.length - 1;
  // document.querySelector(".slider-line img:last-child").remove();
  prevImageGenerate(true);
  animate({
    duration: 1000,
    draw: function (progress) {
      document.querySelector(".slider-line img").style.width =
        widthOffset * progress + "px"; // картинка постепенно увеличивается
    },
    removeElement: document.querySelector(".slider-line img:last-child"),
  });
};
initSlider();

document.querySelector(".next-button").addEventListener("click", nextSlide);
document.querySelector(".prev-button").addEventListener("click", prevSlide);

//animate функция анимации
//duration представляет собой продолжительность анимации в миллисекундах.
//draw - это функция, которая выполняет саму анимацию. Она вызывается с одним аргументом - текущим шагом анимации.
//removeElement - это элемент DOM, который будет удален после завершения анимации.

const animate = ({ duration, draw, removeElement }) => {

  const start = performance.now(); //start Это время начала анимации. Оно определяется с помощью performance.now(),
                                  // которая возвращает текущее время в миллисекундах с начала загрузки страницы.

  requestAnimationFrame(function animate(time) { // Эта функция используется для создания плавной анимации. 
                                                // Она принимает другую функцию, которая будет вызываться перед следующей перерисовкой экрана.
    let step = (time - start) / duration;
    if (step > 1) step = 1;// здесь вычисляется текущий шаг анимации. Он представляет собой
                          // отношение прошедшего времени к общей продолжительности анимации.
    draw(step);
    if (step < 1) { //это условие гарантирует, что шаг не превысит 1, что означает окончание анимации.
      requestAnimationFrame(animate);
    } else {
      removeElement.remove();
      flag = true;
    }
  });
};
