const sizes = ['OneSize', 'S', 'M', 'L'];
const prices = [10000, 4300, 4500, 4700];
const colorValues = ['#ffffff00', '#c4e5f1', '#7CB0BE', '#93D2FB', '#E9E3E5', '#ECD1BE', '#736469'];

const btnPlaceAnOrder = document.getElementById("btnPlaceAnOrder");
btnPlaceAnOrder.addEventListener("click", function() { 
    const colorSelectors = document.querySelectorAll(".colorSelector");
    if (colorSelectors.length == 0) {
        alert("Корзина пуста!");
        return;
    }

    for (let i = 0; i < colorSelectors.length; i++) {
        if (colorSelectors[i].selectedIndex == 0){
            alert("Укажите цвет для худи!");
            return;
        }
    }

    const measures = document.querySelectorAll(".inputMeasurement");
    for (let i = 0; i < measures.length; i++) {
        if (measures[i].value == 0){
            alert("Укажите ВСЕ мерки!");
            return;
        }
    }

    alert("Спасибо за заказ!");
    //Удаляем таблицу
    for (let i = 0; i < sizes.length; i++){
        let hoodies = JSON.parse(localStorage.getItem("Hoodies_" + sizes[i]));
        hoodies.length = 0;
        localStorage.setItem("Hoodies_" + sizes[i], JSON.stringify(hoodies)); 
    }
    const productRows = document.querySelectorAll(".productData");
    productRows.forEach(row => row.remove());
    //Пересчитываем кол-во
    calcTotalCountAndPrice(); 
});

//Считаем кол-во худи и стоимость
calcTotalCountAndPrice(); 
//Добавляем в таблицу худи
addRows();

function calcTotalCountAndPrice() {
    let totalCount = 0;
    let hoodiesPrice = 0;
    let stripesPrice = 0;
    for (let i = 0; i < sizes.length; i++){
        let hoodies = JSON.parse(localStorage.getItem("Hoodies_" + sizes[i]));
        if (hoodies === null) continue;

        let count = hoodies.length;
        let stripesCount = 0;
        for (let j = 0; j < hoodies.length; j++){
            stripesCount += parseInt(hoodies[j].stripes);
        }

        totalCount += count;
        hoodiesPrice += prices[i] * count;
        stripesPrice += stripesCount * 1000;
    }

    const spCount = document.getElementById("count");
    const spHoodies = document.getElementById("hoodiesPrice");
    const spStripes = document.getElementById("stripesPrice");
    const spPrice = document.getElementById("totalPrice");
    spCount.textContent = "Количество товаров: " + totalCount + " шт.";
    spHoodies.textContent = "Стоимость худи: " + hoodiesPrice + " р.";
    spStripes.textContent = "Доплата за вышивки: " + stripesPrice + " р."
    spPrice.textContent = "Итого: " + (hoodiesPrice + stripesPrice) + " р.";
};

function addRows() { 
    for (let i = 0; i < sizes.length; i++) {
        const hoodies = JSON.parse(localStorage.getItem("Hoodies_" + sizes[i]));
        if (hoodies === null) return;
        //Таблица с худи определенного размера
        const table = document.getElementById("table_" + sizes[i]); 
        for (let j = 0; j < hoodies.length; j++)
        {
            const newRow = document.createElement("div");
            newRow.className ="productData row p-2 p-md-3"; 
            newRow.id = hoodies[j].id;
            //1.Размер      
            newRow.appendChild(colHoodieSize(sizes[i]));
            //2.Выбор цвета и его демонстрация
            newRow.appendChild(colHoodieColor(sizes[i], hoodies[j].id, hoodies[j].color));
            //3.Мерки
            if ( sizes[i] != "OneSize") { newRow.appendChild(formHoodieMeasurement(sizes[i], hoodies[j].id)); }
            //4.Вышивка + Цена
            newRow.appendChild(rowHoodiePrice(i, hoodies[j].id, hoodies[j].stripes));
            //5.Кнопка Удалить
            newRow.appendChild(colButtonDelete(sizes[i], hoodies[j].id));

            table.appendChild(newRow);
        }
    }
}

function colHoodieSize(size){
    const newColumn = document.createElement("div"); 
    newColumn.className = "col-12 col-md-7 d-flex flex-wrap align-items-center";
    newColumn.textContent = "Худи: " + size;
    return newColumn;
}

function colHoodieColor(size, id, colorIndex){
    const newColumn = document.createElement("div"); 
    newColumn.className = "col-12 col-md-7 d-flex flex-wrap align-items-center"; 
    //Выпадающий список цветов     
    const colorSelector = document.createElement("select");
    colorSelector.className ="form-select colorSelector";
    const colors = ['цвет не выбран','снежная мята', 'зелёно-голубой', 'небесно-голубой', 'экрю', 'персик', 'теплый беж'];
    colors.forEach(color => {
        const colorOption = document.createElement("option");
        colorOption.textContent = color;
        colorSelector.appendChild(colorOption);
    })
    //Достаем выбранный цвет
    colorSelector.selectedIndex = parseInt(colorIndex); 
    newColumn.appendChild(colorSelector);
    //Демонстрация цвета
    const colorDemo = document.createElement("div"); 
    colorDemo.className ="colorDemo";
    colorDemo.style.backgroundColor = colorValues[colorSelector.selectedIndex];
    newColumn.appendChild(colorDemo);
    //Изменение цвета -> Изменение представления -> Изменение в localStorage
    colorSelector.addEventListener("change", function() {
        //Меняем демо цвета
        colorDemo.style.backgroundColor = colorValues[colorSelector.selectedIndex]; 
        //Сохраняем новый цвет для худи
        let hoodies = JSON.parse(localStorage.getItem("Hoodies_" + size)); //Массив
        for (let i = 0; i < hoodies.length; i++) {
            if (hoodies[i].id == id){
                hoodies[i].color = colorSelector.selectedIndex;
                break;
            }
        };
        localStorage.setItem("Hoodies_" + size, JSON.stringify(hoodies));})    
    return newColumn;   
}

function formHoodieMeasurement(hoodieSize, hoodieId) {
    // formInput -> colLeft(img)/colRight(правила ввода + rowMeasurement
    const formInput = document.createElement("div");
    formInput.className = "formInput row";
    //Левая колонка таблицы
    const colLeft = document.createElement("div"); 
    colLeft.className = "col-12 col-lg-4 colLeft";
    let info = document.createElement("div");
    info.className = "info";
    info.innerHTML ='Снимите мерки с животного <br> (размеры указывать в миллиметрах)';
    colLeft.appendChild(info);
    const instruction = document.createElement("img"); 
    instruction.className="instruction";
    instruction.src = "pictures/measurements.jpg";
    colLeft.appendChild(instruction);    
    formInput.appendChild(colLeft);
    //Правая колонка таблицы
    const colRight = document.createElement("div");  
    colRight.className = "col-12 col-lg-8 colRight";

    //Находим худи по айди
    const hoodies = JSON.parse(localStorage.getItem("Hoodies_" + hoodieSize));
    let hoodie = 0;
    for (let j = 0; j < hoodies.length; j++) {
        if (hoodies[j].id == hoodieId){
            hoodie = hoodies[j];
            break;
        }
    };
    const measurements = ['1. Обхват шеи (по ошейнику)','2. Обхват груди (сразу за передними лапами)', '3. Обхват талии (сразу перед задними лапами)', '4. Длина от ошейника до лапки', '5. Длина рукава (от места, где закончилась 4ая мерка до желаемой длины рукава)', '6. Обхват передней лапки (на конце рукава)', '7. Длина грудки (от ошейника по грудке до желаемой длины)', '8. Длина спинки (от ошейника по спинке до желаемой длины)', '9. Ширина спинки (от основания лапки через спинку, до основания второй лапки)'];
    for (let i = 0; i < measurements.length; i++) {
        //rowMeasurement -> firstCol(название мерки)/secondCol(введенное значение)
        const rowMeasurement = document.createElement("div"); 
        rowMeasurement.className = "row"; 
        //Первая колонка
        const firstCol = document.createElement("div");
        firstCol.className = "col-md-9";
        firstCol.textContent = measurements[i];
        rowMeasurement.appendChild(firstCol);
        //Вторая колонка
        const secondCol = document.createElement("div");
        secondCol.className = "col-md-3";
        const inputMeasurement = document.createElement("input");
        inputMeasurement.className = "inputMeasurement";
        //Берем данные из localStorage
        inputMeasurement.value = hoodie.measurements[i];
        secondCol.appendChild(inputMeasurement);
        rowMeasurement.appendChild(secondCol);

        colRight.appendChild(rowMeasurement); 
        //Изменение мерки -> Проверка данных -> Изменение в localStorage
        inputMeasurement.addEventListener("input", function()  {
            inputMeasurement.value = checkInputValue(inputMeasurement.value, ['0','1','2','3','4','5','6','7','8','9'], '0');
            
            const hoodies = JSON.parse(localStorage.getItem("Hoodies_" + hoodieSize));
            for (let k = 0; k < hoodies.length; k++) {
                if (hoodies[k].id == hoodieId) {
                    hoodies[k].measurements[i] = inputMeasurement.value;
                    break;
                }
            };
            localStorage.setItem("Hoodies_" + hoodieSize, JSON.stringify(hoodies)); 
        });
    }   
    formInput.appendChild(colRight);

    return formInput;
}
function checkInputValue(inputValue, allowedSymbols, defaultValue) {
    if (inputValue == '') return defaultValue;
    for (let char of inputValue) {
        let isCorrect = false;
        for (let allowed of allowedSymbols) {
            if (char == allowed) {
                isCorrect = true;
                break;
            }
        }
        if (isCorrect == false) return defaultValue;
    }
    return inputValue;
}

function rowHoodiePrice(sizeIndex, hoodieId, oldStripe){
    //Row -> stripesColumn/priceColumn
    const newRow = document.createElement("div");
    newRow.className = "row";
    //Кол-во вышивок
    const stripesColumn = document.createElement("div");
    stripesColumn.className = "col-12 col-md-6";
    stripesColumn.innerHTML = "Вышивка: ";
    const stripesCount = document.createElement("input");
    stripesCount.className="stripesCount";
    stripesCount.value = parseInt(oldStripe);
    stripesCount.type = "number";
    stripesColumn.appendChild(stripesCount);
    newRow.appendChild(stripesColumn);
    //Цена
    const priceColumn = document.createElement("div");
    priceColumn.className = "col-12 col-md-7";
    priceColumn.innerHTML  = "Цена: " + (prices[sizeIndex] + stripesCount.value * 1000) + " р. <br> (доплата за персональную вышивку + 1000 р.)";
    newRow.appendChild(priceColumn);
    //Изменение кол-ва вышивок -> 1.Проверка данных -> 2.Изменение в localStorage -> 3.Изменение цены товара -> 4.Изменение общей цены
    stripesCount.addEventListener("input", function () {
        stripesCount.value = checkInputValue(stripesCount.value, ['0','1','2','3','4','5','6','7','8','9'], '0');

        const hoodies = JSON.parse(localStorage.getItem("Hoodies_" + sizes[sizeIndex]));
        for (let i = 0; i < hoodies.length; i++) {
            if (hoodies[i].id == hoodieId){
                hoodies[i].stripes = stripesCount.value;
                break;
            }
        };
        localStorage.setItem("Hoodies_" + sizes[sizeIndex], JSON.stringify(hoodies));

        let overPrice = stripesCount.value * 1000;
        let totalPrice = overPrice + prices[sizeIndex];
        priceColumn.innerHTML = "Цена: " + totalPrice + " р. <br> (доплата за персональную вышивку + 1000 р.)"; 
        
        calcTotalCountAndPrice();
    });

    return newRow;
}

function colButtonDelete(hoodieSize, hoodieId){
    const newColumn = document.createElement("div");
    newColumn.className = "col-12 col-md-6";
    const btnDelete = document.createElement("button");
    btnDelete.className = "btn btn-md btn-outline-secondary";
    btnDelete.innerHTML = "Удалить";
    btnDelete.addEventListener("click", function() {deleteHoodie(hoodieSize, hoodieId)});
    newColumn.appendChild(btnDelete);
    return newColumn;
}
function deleteHoodie(size, id) {
    //1.Изменение в localStorage
    let hoodies = JSON.parse(localStorage.getItem("Hoodies_" + size));
    hoodies = hoodies.filter(hoodie => hoodie.id !== id);
    localStorage.setItem("Hoodies_" + size, JSON.stringify(hoodies)); 
    //2.Удаление строки
    let rowToDelete = document.getElementById(id);
    rowToDelete.remove();
    //3.Пересчет кол-ва и цены
    calcTotalCountAndPrice(); 
}