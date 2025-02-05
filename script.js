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
    const apiKey = "NV7Hradt6EI3WxugDhR7cddClrBRxF3r"; // AccuWeather API 키
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

// 1시간(3600000ms)마다 업데이트
setInterval(fetchWeather, 3600000);
fetchWeather(); // 초기 실행

// 3. JTBC 뉴스 RSS 가져오기
async function fetchRSS() {
    const rssUrl = "https://rss.donga.com/politics.xml"; // JTBC RSS URL
    const proxy = "https://api.allorigins.win/raw?url="; // CORS 우회 프록시
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
let currentBackground = 1; // 현재 표시 중인 배경

function updateBackground() {
    const newImageUrl = `https://picsum.photos/1920/1080?random=${Date.now()}`; // 새 이미지 URL

    const nextBackground = currentBackground === 1 ? 2 : 1; // 다음 배경 선택
    const currentBgElement = document.getElementById(`background${currentBackground}`);
    const nextBgElement = document.getElementById(`background${nextBackground}`);

    // 새 이미지 설정
    nextBgElement.style.backgroundImage = `url(${newImageUrl})`;

    // 1초 후에 투명도 조절하여 배경 전환
    setTimeout(() => {
        nextBgElement.style.opacity = "1";
        currentBgElement.style.opacity = "0";
        currentBackground = nextBackground; // 현재 배경 업데이트
    }, 500);
}

// 10분(600000ms)마다 업데이트
setInterval(updateBackground, 600000);
updateBackground(); // 초기 실행
