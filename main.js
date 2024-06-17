import './style.css'
import Three_main from './three_main'
// import './login'

document.querySelector('#app').innerHTML = `
  <div>
  <canvas id="three-canvas"></canvas>
  </div>
`
const world = new Three_main();

world.start();

const loginBtn = document.querySelector('#login_btn');
const inputId = document.querySelector('#input_id');
const loginForm = document.querySelector('#login');

const handleLogin = () =>{
    loginForm.style.display = 'none';
    world.createUser(inputId.value);
}

loginBtn.addEventListener('click', handleLogin);
