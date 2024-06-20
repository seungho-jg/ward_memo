import './style.css'
import Three_main from './three_main'
import { Memo } from './Memo'

document.querySelector('#app').innerHTML = `
  <div>
  <canvas id="three-canvas"></canvas>
  </div>
`
const world = new Three_main();

world.start();

// login logic
const apiUrl = 'http://18.207.221.141:8080/api/auth';

// DOM 요소 가져오기
const container = document.getElementById('Container');
const loginForm = document.getElementById('loginForm');
const joinForm = document.getElementById('joinForm');
const goToLogin = document.getElementById('gotologin');
const goToJoin = document.getElementById('gotojoin');

const loginButton = document.getElementById('login_btn');
const loginEmailInput = document.getElementById('login_email');
const loginPasswordInput = document.getElementById('login_password');

const joinButton = document.getElementById('join_btn');
const joinEmailInput = document.getElementById('join_email');
const joinNickInput = document.getElementById('join_nick');
const joinPasswordInput = document.getElementById('join_password');
const passwordConfirmInput = document.getElementById('password_confirm');

const uploadButton = document.getElementById('upload_btn');
const exitButton = document.getElementById('exit_btn');
const textbox = document.getElementById('textbox');
const colorPicker = document.getElementById('color_picker');
const cards = document.getElementById('cards');
const logoutBtn = document.getElementById('logoutBtn');

const handleLogout = ()=>{
  sessionStorage.setItem('islogin', 'false');
  window.location.href = '/index.html';
  logoutBtn.style.display = 'none';
}

logoutBtn.addEventListener('click', handleLogout);

const cards_list = []

const reload = ()=>{
  if (!cards_list) return;
  cards.innerHTML =""
  cards_list.forEach(elem => {
    makecard(elem[0],elem.writer || '정승호',elem[2],0);
  })
}
window.addEventListener('keydown', reload);


const makecard = (x, writer, cont, heart) => {
  if (cont.length == 0) return;
  if (Math.abs(world.camera.position.x - x) > 2) return;
  cards.innerHTML += `
  <div id="card" class="
          rounded-lg bg-slate-50 h-full w-52 p-4 opacity-90 flex flex-col gap-2 justify-between
          shadow-sm
           ">
          <div class="flex flex-col gap-1">
            <div class="font-medium text-gray-400">${writer}</div>
            <div class="overflow-hidden">${cont}</div>
          </div>
          <div class="flex flex-row justify-end ">
            <div>${heart}</div>
            <svg id="heart" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>
`
}

// 쿠키확인
let islogin = sessionStorage.getItem('auth');

if (islogin){
  loginForm.style.display = 'none';
  joinForm.style.display = 'none';
  cards.style.display = 'flex';
  logoutBtn.style.display = 'block';
  world.login();
  const nick = localStorage.getItem('nick')
  world.createUser('정승호');

  const local = localStorage.getItem('memos');
  if (local){
    const memos = JSON.parse(local);
    memos.forEach(elem => {
      const memo = new Memo(world.scene);
      memo.init(elem.x, elem.y, elem.cont, elem.color, elem.heart, elem.writer);
      cards_list.push([elem.x,'정승호',elem.cont,0]);
      makecard(elem.x,'정승호',elem.cont,0);
      memo.draw_mm();
    })
  }
} else {
  // 초기 화면 설정
  showLoginForm();
}


// 로그인 폼 표시 함수
function showLoginForm() {
  loginForm.style.display = 'flex';
  joinForm.style.display = 'none';
  cards.style.display = 'none';
  logoutBtn.style.display = 'none';
}

// 회원가입 폼 표시 함수
function showJoinForm() {
  loginForm.style.display = 'none';
  joinForm.style.display = 'flex';
}
goToLogin.addEventListener('click', ()=>{
  showLoginForm()
})
// 로그인 버튼 클릭 이벤트
loginButton.addEventListener('click', async () => {
  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {    
      const auth = response.headers.get("Authorization");
      sessionStorage.setItem('auth', auth);
      window.location.href = '/index.html';
    } else {
      alert('로그인 실패');
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    alert('로그인 중 오류가 발생했습니다.');
  }
});

// 회원가입 버튼 클릭 이벤트
goToJoin.addEventListener('click', () => {
  showJoinForm();
});

// 회원가입 확인 버튼 클릭 이벤트
joinButton.addEventListener('click', async () => {
  const email = joinEmailInput.value;
  const nick = joinNickInput.value;
  const password = joinPasswordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  console.log(email, nick, password, passwordConfirm)
  // 비밀번호 일치 확인
  if (password !== passwordConfirm) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  console.log(JSON.stringify({ email, nick, password }))
  try {
    const response = await fetch(`${apiUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, nick, password }),

    });
    if (response.ok) {
      alert('회원가입 성공!');
      // 회원가입 성공 후 처리
      showLoginForm(); // 로그인 폼으로 전환
    } else {
      alert('회원가입 실패');
    }
  } catch (error) {
    console.error('회원가입 오류:', error);
    alert('회원가입 중 오류가 발생했습니다.');
  }
});

// 메모 업로드 버튼 클릭 이벤트
uploadButton.addEventListener('click', () => {
  const memoText = textbox.value.trim();
  const memoColor = colorPicker.value;
  world.memoupload(memoText, memoColor);
  // API 호출

});

// 나가기 버튼 클릭 이벤트
exitButton.addEventListener('click', () => {
  const p = document.querySelector('#postForm');
  const textbox = document.querySelector('#textbox');
  textbox.value = "";
  p.classList.add('translate-x-full');
  p.classList.remove('translate-x-0'); 
  world.memo_mode = false;
  world.checkMouseHover();
});