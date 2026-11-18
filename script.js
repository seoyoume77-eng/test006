// ==========================================
// 1. 기본 메뉴 상자 (처음부터 들어있는 맛있는 메뉴들)
// ==========================================
const DEFAULT_MENUS = [
  // 한식
  { id: 1, category: "한식", name: "김치찌개", emoji: "🍲", comment: "보글보글 얼큰한 국물에 흰 쌀밥 한 공기 뚝딱!" },
  { id: 2, category: "한식", name: "삼겹살", emoji: "🥓", comment: "지글지글 고기 굽는 소리는 언제나 설레죠!" },
  { id: 3, category: "한식", name: "비빔밥", emoji: "🥗", comment: "알록달록 신선한 야채와 고추장의 환상 조합!" },
  { id: 4, category: "한식", name: "불고기 덮밥", emoji: "🍱", comment: "달콤짭짤한 양념이 밥알에 쏙쏙 배어 있어요!" },
  { id: 5, category: "한식", name: "칼국수 & 파전", emoji: "🍜", comment: "따끈한 국물에 바삭한 파전 한 입이면 행복 충전!" },

  // 중식
  { id: 6, category: "중식", name: "짜장면 & 탕수육", emoji: "🍜", comment: "윤기 좌르르 짜장면에 바삭한 탕수육은 못 참죠!" },
  { id: 7, category: "중식", name: "마라탕", emoji: "🌶️", comment: "내가 좋아하는 재료를 가득 담아 얼큰하게 즐겨요!" },
  { id: 8, category: "중식", name: "짬뽕", emoji: "🦐", comment: "불향 가득 얼큰하고 시원한 국물이 일품이에요!" },
  { id: 9, category: "중식", name: "계란 볶음밥", emoji: "🍳", comment: "고슬고슬하게 볶아낸 밥에 짜장 소스를 쓱쓱!" },

  // 일식
  { id: 10, category: "일식", name: "초밥 (스시)", emoji: "🍣", comment: "신선하고 쫄깃한 초밥으로 기분 좋은 한 끼!" },
  { id: 11, category: "일식", name: "바삭 돈까스", emoji: "🍛", comment: "겉은 바삭, 속은 촉촉! 남녀노소 모두의 인기 메뉴!" },
  { id: 12, category: "일식", name: "일본식 라멘", emoji: "🍜", comment: "진하고 깊은 육수에 반숙 계란을 톡 터뜨려 먹어요!" },
  { id: 13, category: "일식", name: "연어 덮밥 (사케동)", emoji: "🐟", comment: "입안에서 사르르 녹는 부드러운 연어의 매력!" },

  // 양식
  { id: 14, category: "양식", name: "토마토 파스타", emoji: "🍝", comment: "새콤달콤 토마토 소스를 돌돌 말아 한 입 가득!" },
  { id: 15, category: "양식", name: "치즈 듬뿍 피자", emoji: "🍕", comment: "쭉 늘어나는 고소한 치즈 파티를 시작해 볼까요?" },
  { id: 16, category: "양식", name: "수제 햄버거", emoji: "🍔", comment: "두툼한 패티와 아삭한 양상추, 감자튀김까지 완벽!" },
  { id: 17, category: "양식", name: "크림 리조또", emoji: "🧀", comment: "고소하고 꾸덕한 크림 소스가 입안을 감싸줘요!" },

  // 분식
  { id: 18, category: "분식", name: "떡볶이 & 튀김", emoji: "🍢", comment: "매콤달콤 떡볶이 국물에 바삭한 김말이 튀김 콕!" },
  { id: 19, category: "분식", name: "참치 김밥 & 라면", emoji: "🍙", comment: "든든한 김밥 한 줄에 호로록 라면 국물은 최고의 짝꿍!" },
  { id: 20, category: "분식", name: "치즈 라볶이", emoji: "🧀", comment: "쫄깃한 면발과 떡, 고소한 치즈까지 한 냄비에!" },
  { id: 21, category: "분식", name: "순대 & 어묵탕", emoji: "🍢", comment: "따끈한 어묵 국물 한 모금에 속이 사르르 풀려요!" }
];

// ==========================================
// 2. 앱의 기억 저장소 (상태 변수들)
// ==========================================
const STORAGE_KEY = "yumi_today_menu_list_v1";
let menus = loadMenus();
let currentCategory = "전체";
let isRolling = false;

// ==========================================
// 3. 화면에 있는 버튼과 상자들 찾아오기
// ==========================================
const categoryButtons = document.querySelectorAll(".cat-btn");
const resultBox = document.getElementById("resultBox");
const resultCategoryTag = document.getElementById("resultCategoryTag");
const resultEmoji = document.getElementById("resultEmoji");
const resultName = document.getElementById("resultName");
const resultComment = document.getElementById("resultComment");
const confettiLayer = document.getElementById("confettiLayer");
const pickBtn = document.getElementById("pickBtn");

const addMenuForm = document.getElementById("addMenuForm");
const menuCategoryInput = document.getElementById("menuCategoryInput");
const menuEmojiInput = document.getElementById("menuEmojiInput");
const menuNameInput = document.getElementById("menuNameInput");
const menuCommentInput = document.getElementById("menuCommentInput");

const poolCount = document.getElementById("poolCount");
const poolTags = document.getElementById("poolTags");
const resetBtn = document.getElementById("resetBtn");

// ==========================================
// 4. 귀여운 효과음 만들기 (별도 파일 없이 소리를 내는 마법)
// ==========================================
let audioCtx = null;
function playSound(type) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    if (type === "tick") {
      // 두구두구 돌아갈 때 나는 짧은 '톡' 소리
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } else if (type === "win") {
      // 메뉴가 뽑혔을 때 나는 '짜잔~!' 화음 소리
      const notes = [523.25, 659.25, 783.99, 1046.5]; // 도-미-솔-높은도
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        const startTime = audioCtx.currentTime + idx * 0.06;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    }
  } catch (e) {
    // 소리 재생이 막혀있어도 앱은 정상 작동하도록 무시합니다.
  }
}

// ==========================================
// 5. 메뉴 불러오기 & 저장하기
// ==========================================
function loadMenus() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("저장된 메뉴를 불러오지 못해 기본 메뉴를 사용합니다.");
  }
  return [...DEFAULT_MENUS];
}

function saveMenus() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
  } catch (e) {
    // 저장 공간 오류 무시
  }
}

// 현재 선택된 카테고리에 맞는 메뉴들만 골라내기
function getFilteredMenus() {
  if (currentCategory === "전체") {
    return menus;
  }
  return menus.filter((item) => item.category === currentCategory);
}

// ==========================================
// 6. 뽑기 통 화면 업데이트하기
// ==========================================
function renderPool() {
  const filtered = getFilteredMenus();
  poolCount.textContent = filtered.length;
  poolTags.innerHTML = "";

  if (filtered.length === 0) {
    poolTags.innerHTML = `<span style="font-size:0.82rem; color:#868e96;">이 종류에는 아직 메뉴가 없어요! 위에서 새로 추가해 보세요 😊</span>`;
    return;
  }

  filtered.forEach((item) => {
    const tag = document.createElement("span");
    tag.className = "menu-tag";
    tag.innerHTML = `
      <span>${item.emoji} ${item.name}</span>
      <button type="button" class="menu-tag-del" title="삭제하기" data-id="${item.id}">×</button>
    `;
    poolTags.appendChild(tag);
  });
}

// ==========================================
// 7. 두구두구 메뉴 뽑기 마법 (핵심 기능!)
// ==========================================
function pickRandomMenu() {
  if (isRolling) return;

  const candidates = getFilteredMenus();
  if (candidates.length === 0) {
    resultBox.classList.remove("winner");
    resultCategoryTag.textContent = "텅 빈 뽑기 통";
    resultEmoji.textContent = "😢";
    resultName.textContent = "메뉴가 없어요!";
    resultComment.textContent = "아래에서 새로운 메뉴를 추가하거나 다른 음식 종류를 골라주세요.";
    return;
  }

  isRolling = true;
  pickBtn.disabled = true;
  pickBtn.querySelector(".pick-btn-text").textContent = "두구두구 뽑는 중...";
  resultBox.classList.remove("winner");
  resultBox.classList.add("rolling");

  let step = 0;
  const totalSteps = 14; // 14번 빠르게 바뀐 뒤 멈춤

  const rollInterval = setInterval(() => {
    const randomTemp = candidates[Math.floor(Math.random() * candidates.length)];
    resultCategoryTag.textContent = `🎲 ${randomTemp.category} 후보`;
    resultEmoji.textContent = randomTemp.emoji;
    resultName.textContent = randomTemp.name;
    resultComment.textContent = "과연 어떤 메뉴가 걸릴까요? 두구두구...";
    playSound("tick");

    step++;
    if (step >= totalSteps) {
      clearInterval(rollInterval);
      finishPick(candidates);
    }
  }, 85);
}

function finishPick(candidates) {
  // 최종 당첨 메뉴 하나 뽑기!
  const winner = candidates[Math.floor(Math.random() * candidates.length)];

  resultBox.classList.remove("rolling");
  resultBox.classList.add("winner");

  resultCategoryTag.textContent = `✨ 오늘의 ${winner.category} 추천 ✨`;
  resultEmoji.textContent = winner.emoji;
  resultName.textContent = winner.name;
  resultComment.textContent = `"${winner.comment}"`;

  playSound("win");
  burstConfetti();

  isRolling = false;
  pickBtn.disabled = false;
  pickBtn.querySelector(".pick-btn-text").textContent = "다시 뽑아볼까? 🎲";
}

// 축하 폭죽 터뜨리기
function burstConfetti() {
  confettiLayer.innerHTML = "";
  const icons = ["🎉", "✨", "🥳", "🍽️", "💛", "⭐"];
  for (let i = 0; i < 14; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent = icons[Math.floor(Math.random() * icons.length)];

    const tx = (Math.random() - 0.5) * 260 + "px";
    const ty = (Math.random() - 0.8) * 180 + "px";
    const rot = (Math.random() - 0.5) * 360 + "deg";

    piece.style.left = "50%";
    piece.style.top = "45%";
    piece.style.setProperty("--tx", tx);
    piece.style.setProperty("--ty", ty);
    piece.style.setProperty("--rot", rot);

    confettiLayer.appendChild(piece);
  }
}

// ==========================================
// 8. 버튼 클릭 이벤트 연결하기
// ==========================================

// (1) 카테고리 버튼 클릭
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (isRolling) return;
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;

    // 나만의 메뉴 추가 창의 카테고리도 자동으로 맞춰주기
    if (currentCategory !== "전체") {
      menuCategoryInput.value = currentCategory;
    }

    renderPool();
  });
});

// (2) 메뉴 뽑기 버튼 클릭
pickBtn.addEventListener("click", pickRandomMenu);

// (3) 나만의 메뉴 추가 폼 제출
addMenuForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = menuNameInput.value.trim();
  if (!name) return;

  const category = menuCategoryInput.value;
  const emoji = menuEmojiInput.value;
  let comment = menuCommentInput.value.trim();
  if (!comment) {
    comment = `유미님이 직접 고른 특별 메뉴! 오늘 ${name} 완전 딱이에요! 😋`;
  }

  const newMenu = {
    id: Date.now(),
    category,
    name,
    emoji,
    comment
  };

  menus.push(newMenu);
  saveMenus();
  renderPool();

  // 방금 넣은 메뉴를 결과 상자에 반갑게 보여주기
  resultBox.classList.remove("winner");
  resultCategoryTag.textContent = "새 메뉴 등록 완료!";
  resultEmoji.textContent = newMenu.emoji;
  resultName.textContent = `${newMenu.name} 추가됨!`;
  resultComment.textContent = `뽑기 통에 쏙 들어갔어요! 이제 뽑기 버튼을 눌러보세요.`;

  menuNameInput.value = "";
  menuCommentInput.value = "";
});

// (4) 뽑기 통에서 개별 메뉴 삭제하기
poolTags.addEventListener("click", (e) => {
  const delBtn = e.target.closest(".menu-tag-del");
  if (!delBtn) return;
  const targetId = Number(delBtn.dataset.id);
  menus = menus.filter((item) => item.id !== targetId);
  saveMenus();
  renderPool();
});

// (5) 기본 메뉴로 초기화 버튼
resetBtn.addEventListener("click", () => {
  menus = [...DEFAULT_MENUS];
  saveMenus();
  renderPool();
  resultBox.classList.remove("winner");
  resultCategoryTag.textContent = "초기화 완료";
  resultEmoji.textContent = "🔄";
  resultName.textContent = "기본 메뉴로 돌아왔어요!";
  resultComment.textContent = "다시 신나게 오늘의 메뉴를 뽑아보세요.";
});

// 처음 앱이 켜질 때 뽑기 통 목록 그리기
renderPool();
