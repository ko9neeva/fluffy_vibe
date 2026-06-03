//Проверяем кол-во товаров, скрываем\показываем кнопки
checkProducts("OneSize");
checkProducts("S");
checkProducts("M");
checkProducts("L");

//OneSize
const btnChoose_OneSize = document.getElementById("btnChoose_OneSize"); //Кнопка выбрать
const btnDel_OneSize = document.getElementById("btnDel_OneSize"); //Кнопка удалить
btnChoose_OneSize.addEventListener("click", function() { btnClickAdd("OneSize") });
btnDel_OneSize.addEventListener("click", function() { btnClickDel("OneSize") });

//S
const btnChoose_S = document.getElementById("btnChoose_S"); //Кнопка выбрать
const btnDel_S = document.getElementById("btnDel_S"); //Кнопка удалить
btnChoose_S.addEventListener("click", function() { btnClickAdd("S") });
btnDel_S.addEventListener("click", function() { btnClickDel("S") });

//M
const btnChoose_M = document.getElementById("btnChoose_M"); //Кнопка выбрать
const btnDel_M = document.getElementById("btnDel_M"); //Кнопка удалить
btnChoose_M.addEventListener("click", function() { btnClickAdd("M") });
btnDel_M.addEventListener("click", function() { btnClickDel("M") });

//L
const btnChoose_L = document.getElementById("btnChoose_L"); //Кнопка выбрать
const btnDel_L = document.getElementById("btnDel_L"); //Кнопка удалить
btnChoose_L.addEventListener("click", function() { btnClickAdd("L") });
btnDel_L.addEventListener("click", function() { btnClickDel("L") });

function checkProducts(size)
{
    //Данные с карточки
    const btnChoose = document.getElementById("btnChoose_" + size); //Кнопка выбрать
    const spCount = document.getElementById("spCount_" + size); //Кол-во товаров
    const btnDel = document.getElementById("btnDel_" + size); //Кнопка удалить

    const hoodies = JSON.parse(localStorage.getItem("Hoodies_" + size)); //Массив
    if (hoodies === null) {
        localStorage.setItem("Hoodies_" + size, JSON.stringify([])); 
        return;
    }

    let memoryCount = hoodies.length; //Длина массива
    if (memoryCount == 0){
        btnChoose.innerText='Выбрать';
        spCount.style.visibility = 'hidden';
        btnDel.style.visibility = 'hidden';
    } else {
        btnChoose.innerText='+';
        spCount.style.visibility = 'visible';
        spCount.textContent = memoryCount;
        btnDel.style.visibility = 'visible';
    }
}

function btnClickAdd(size) {
    const btnChoose = document.getElementById("btnChoose_" + size); //Кнопка выбрать
    const spCount = document.getElementById("spCount_" + size); //Кол-во товаров
    const btnDel = document.getElementById("btnDel_" + size); //Кнопка удалить

    spCount.textContent = parseInt(spCount.textContent) + 1; //Кол-во товаров на карточке

    let newHoodie = { 
        color: '0',
        measurements: ['0','0','0','0','0','0','0','0','0'],
        stripes: '0',
        id: Date.now().toString()       
    }
    const hoodies = JSON.parse(localStorage.getItem("Hoodies_" + size)); 
    hoodies.push(newHoodie);
    localStorage.setItem("Hoodies_" + size, JSON.stringify(hoodies)); 

    checkProducts(size); //Проверяем, надо ли показать кнопки
}

function btnClickDel(size) {
    const btnChoose = document.getElementById("btnChoose_" + size); //Кнопка выбрать
    const spCount = document.getElementById("spCount_" + size); //Кол-во товаров
    const btnDel = document.getElementById("btnDel_" + size); //Кнопка удалить
    
    spCount.textContent = parseInt(spCount.textContent) - 1; //Кол-во товаров на карточке

    const hoodies = JSON.parse(localStorage.getItem("Hoodies_" + size)); 
    hoodies.pop();
    localStorage.setItem("Hoodies_" + size, JSON.stringify(hoodies));

    checkProducts(size); //Проверяем, надо ли скрыть кнопки
}