const settingsButton = document.querySelector('.ex-settings');
const cityList = document.querySelector('.ex-city-select');
const saveButton = document.querySelector('.ex-city-save');
const listDiv = document.querySelector('.time-list');
const infoDiv = document.querySelector('.ex-timer');
const cityDiv = document.querySelector('.ex-city');



// generate daylist name
const generateDayList = (max) => {
    let times = [];
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    console.log(03)
    console.log(month)

    let date = now.getDate();

    for (let i = 0; i < max; i++) {
        let time = `${year}-${month < 10 ? `0${month}` : `${month}`}-${date + i < 10 ? `0${date + i}` : `${date + i}`}`
        times.push(time);
    }

    return times;
}

// check time
const checkTime = (nowtime, time, infoDiv) => {
    let imsak = time[0].split(":").map(item => parseInt(item));
    let iftar = time[4].split(":").map(item => parseInt(item));

    if (nowtime.getHours() > imsak[0] && iftar[0] >= nowtime.getHours()) {

        let iftar_count = (iftar[0] * 60) + iftar[1];
        let now_count = (nowtime.getHours() * 60) + nowtime.getMinutes();
        if (iftar[0] == nowtime.getHours() && nowtime.getMinutes() <= iftar[1]) {
            let text = `İftara ${iftar[1] - nowtime.getMinutes()} dakika kaldı`;
            infoDiv.text = text;
        }
        else if (iftar[0] > nowtime.getHours()) {
            let kalan = iftar_count - now_count;
            let hour = parseInt(kalan / 60);
            let mn = kalan % 60;
            let text = `İftara ${hour} saat ${mn} dakika kaldı`;
            infoDiv.innerHTML = text;
        }

    } else {

    }
}

const addCities = async (slctCity) => {
    const selectDiv = document.querySelector('.ex-city-select');
    let res = await fetch('./cities.json');
    let cities = await res.json()
    for (let city of cities) {
        let cityOP = document.createElement('option');
        cityOP.innerText = city;
        cityOP.className = "ex-city-select-item";
        cityOP.value = city;

        if (slctCity == city) {
            cityOP.setAttribute('selected', true);
            console.log('sa')
        }

        selectDiv.appendChild(cityOP);
    }
}

const loadData = (data, isFirst = true) => {
    const nowDate = new Date();

    cityDiv.textContent = data.place.city;

    if (!isFirst) {
        listDiv.innerHTML = ' ';
        infoDiv.innerHTML = ' ';

    }



    let day_list = generateDayList(2);
    day_list.map((day, index) => {
        console.log(index)
        let time = `${nowDate.getFullYear()}-${nowDate.getMonth() + 1 < 10 ? `0${nowDate.getMonth() + 1}` : `${nowDate.getMonth() + 1}`}-${nowDate.getDate() < 10 ? `0${nowDate.getDate()}` : `${nowDate.getDate()}`}`
        let iftar = data.times[day][4];
        let sahur = data.times[day][0];
        let tr = document.createElement('tr');
        let datetb = document.createElement('td');
        datetb.innerHTML = `${nowDate.getDate() + index}/${nowDate.getMonth() + 1 < 10 ? `0${nowDate.getMonth() + 1}` : `${nowDate.getMonth() + 1}`}`;
        let akşamtb = document.createElement('td');
        akşamtb.innerHTML = iftar;
        let imsaktb = document.createElement('td');
        imsaktb.innerHTML = sahur;
        tr.appendChild(datetb);
        tr.appendChild(akşamtb);
        tr.appendChild(imsaktb);
        listDiv.appendChild(tr)

    })


    setInterval(() => {
        const nowtime = new Date();
        let time = data.times[`${nowtime.getFullYear()}-${nowtime.getMonth() + 1 < 10 ? `0${nowtime.getMonth() + 1}` : `${nowtime.getMonth() + 1}`}-${nowtime.getDate() < 10 ? `0${nowtime.getDate()}` : `${nowtime.getDate()}`}`]
        checkTime(nowtime, time, infoDiv);
    }, 1000)
}




settingsButton.addEventListener('click', (e) => {
    if (localStorage.getItem("isSettings")) {
        if (localStorage.getItem('isSettings') == "open") {
            cityList.classList.add("d-none");
            saveButton.classList.add("d-none");
            localStorage.setItem('isSettings', "close");
        } else {
            cityList.classList.remove("d-none");
            saveButton.classList.remove("d-none");
            localStorage.setItem('isSettings', "open");
        }
    }
});

saveButton.addEventListener('click', (e) => {
    if (localStorage.getItem("isSettings")) {
        if (localStorage.getItem('isSettings') == "open") {
            localStorage.setItem('city', cityList.value);
            fetchData(localStorage.getItem('city'), 3).then(reqData => {
                loadData(reqData, false);
            });

        }
    }
});

const fetchData = async (city, maxDay) => {
    const now = new Date();
    addCities(localStorage.getItem('city'));

    const nowDateText = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`}-${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}`
    // req 
    const options = {
        "method": "GET",
        "headers": {
            "content-type": "application/json",
        }
    };
    const res = await fetch(`https://namaz-vakti.vercel.app/api/timesFromPlace?country=Turkey&region=${city}&city=${city}&date=${nowDateText}&days=${maxDay}&timezoneOffset=180`, options);
    const record = await res.json();

    return record;
}


window.onload = function async() {
    if (!localStorage.getItem('isSettings')) {
        localStorage.setItem('isSettings', 'close');
    }
    if (!localStorage.getItem('city')) {
        localStorage.setItem('city', 'Ankara');
    }

    fetchData(localStorage.getItem('city'), 3).then(
        reqData => {
            loadData(reqData, true);
        })

}



