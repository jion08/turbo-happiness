// 1. 시간 및 날짜 표시
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const date = now.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
    document.getElementById("time").innerText = `${hours}:${minutes}`;
    document.getElementById("date").innerText = date;
}
setInterval(updateTime, 1000); // 1초마다 업데이트
updateTime(); // 초기 실행

// 2. 날씨 정보 가져오기
async function fetchWeather() {
    const apiKey = "process.env.API_KEY"; // AccuWeather API 키
    const locationKey = "3558147"; // 예: 서울의 Location Key
    const url = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&language=ko-kr`;

    try {
        const response = await fetch(url); // API 호출
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // 상태 코드 확인
        }
        const data = await response.json(); // JSON 응답 데이터 처리
        const weatherText = data[0].WeatherText; // 날씨 설명
        const temperature = data[0].Temperature.Metric.Value; // 섭씨 온도

        // 결과를 HTML에 표시
document.getElementById("weather").innerText = `다산동 ${temperature}°C, ${weatherText}`;
    } catch (error) {
        console.error("날씨 API 오류:", error);
        document.getElementById("weather").innerText = "날씨 정보를 가져올 수 없습니다.";
    }
}

// 함수 실행
fetchWeather(); // 날씨 데이터 가져오기

// 3. JTBC 뉴스 RSS 가져오기
async function fetchRSS() {
    const rssUrl = "https://news-ex.jtbc.co.kr/v1/get/rss/issue"; // JTBC RSS URL
    const proxy = "https://cors-anywhere.herokuapp.com/"; // CORS 우회 프록시
    const url = `${proxy}${rssUrl}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text(); // RSS는 XML 데이터이므로 text() 사용

        // XML 파싱
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");

        if (items.length === 0) {
            throw new Error("RSS 데이터가 비어 있습니다.");
        }

        // 기사 목록을 랜덤으로 섞음
        let shuffledItems = Array.from(items).sort(() => 0.5 - Math.random());
        let rssContent = "<ul>";

        // 상위 3개 기사만 선택하여 표시 (링크 없이)
        for (let i = 0; i < Math.min(3, shuffledItems.length); i++) {
            const title = shuffledItems[i].getElementsByTagName("title")[0].textContent;
            rssContent += `<li>${title}</li>`;
        }
        rssContent += "</ul>";

        document.getElementById("rss").innerHTML = rssContent;
    } catch (error) {
        console.error("RSS 가져오기 오류:", error);
        const rssElement = document.getElementById("rss");
        if (rssElement) {
            rssElement.innerText = "RSS 정보를 가져올 수 없습니다.";
        }
    }
}

// HTML이 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
    fetchRSS(); // 초기 실행
    setInterval(fetchRSS, 60000); // 1분(60,000ms)마다 실행
});
 // 뉴스 데이터 가져오기

// 4. 배경 이미지 변경
function updateBackground() {
    const backgrounds = [
        "https://picsum.photos/1920/1080?random",
    ];
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    document.body.style.backgroundImage = `url(${backgrounds[randomIndex]})`;
}
setInterval(updateBackground, 600000); // 10분마다 변경
updateBackground(); // 초기 실행
