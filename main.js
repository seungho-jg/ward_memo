import './style.css'
import Three_main from './three_main'
import { Memo } from './Memo';

document.querySelector('#app').innerHTML = `
  <div>
  <canvas id="three-canvas"></canvas>
  </div>
`
const world = new Three_main();

world.start();

// login logic
const apiUrl = 'http://localhost:3000/api/auth';

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

// 쿠키확인
const islogin =true

if (islogin){
  loginForm.style.display = 'none';
  joinForm.style.display = 'none';
  world.login();
  world.createUser('정승호');

  const local = localStorage.getItem('memos');
  if (local){
    const memos = JSON.parse(local);
    memos.forEach(elem => {
      const memo = new Memo(world.scene);
      memo.init(elem.x, elem.y, elem.cont, elem.color, elem.heart);
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
      const data = await response.json();
      const token = data.token;
      setCookie('toekn', token, 7);
      window.location.href = '/index.html';
    } else {
      alert('로그인 실패');
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    alert('로그인 중 오류가 발생했습니다.');
  }
});

// 쿠키 설정 함수
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

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