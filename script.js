const fetchData = async () => {
    // div variables
    const listDiv = document.querySelector('.time-list');
    const infoDiv = document.querySelector('.ex-timer');
    const cityDiv = document.querySelector('.ex-city');
    // variables
    const now = new Date();
    const city = "Ankara";
    const maxDay = 3
    const nowDate = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`}-${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}`
    // req 
    const options = {
        "method": "GET",
        "headers": {
            "content-type": "application/json",
        }
    };
    const res = await fetch(`https://namaz-vakti.vercel.app/api/timesFromPlace?country=Turkey&region=${city}&city=${city}&date=${nowDate}&days=${maxDay}&timezoneOffset=180`, options);
    const record = await res.json();

    // change city
    cityDiv.textContent = record.place.city;

    let time = record.times[`${now.getFullYear()}-${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`}-${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}`]
    checkTime(now, time, infoDiv)

    // // change info
    setInterval(() => {
        const nowtime = new Date();
        let time = record.times[`${nowtime.getFullYear()}-${nowtime.getMonth() + 1 < 10 ? `0${nowtime.getMonth() + 1}` : `${nowtime.getMonth() + 1}`}-${nowtime.getDate() < 10 ? `0${nowtime.getDate()}` : `${nowtime.getDate()}`}`]
        checkTime(nowtime, time, infoDiv);
    }, 1000)

    // list days
    let day_list = generateDayList(2);
    day_list.map((day, index) => {
        console.log(index)
        let time = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`}-${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}`
        let iftar = record.times[day][4];
        let sahur = record.times[day][0];
        let tr = document.createElement('tr');
        let datetb = document.createElement('td');
        datetb.innerHTML = `${now.getDate() + index}/${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`}`;
        let akşamtb = document.createElement('td');
        akşamtb.innerHTML = iftar;
        let imsaktb = document.createElement('td');
        imsaktb.innerHTML = sahur;
        tr.appendChild(datetb);
        tr.appendChild(akşamtb);
        tr.appendChild(imsaktb);
        listDiv.appendChild(tr)

    })
}

fetchData();

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