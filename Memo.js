import * as THREE from 'three';

export class Memo {
    constructor(scene) {
        this.x = 0
        this.y = 0
        this.cont = ''
        this.color = 0xffffff
        this.heart = 0
        this.scene = scene;
        this.mesh = null;
    }
    init(x, y, cont, color, heart){
        this.x = x;
        this.y = y;
        this.cont = cont;
        this.color = color;
        this.heart = heart;
    }
    draw_mm() {
        // Canvas 생성
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Canvas 크기 설정
        canvas.width = 100;
        canvas.height = 100;
        
        // 배경 색상 설정
        context.fillStyle = this.color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // 텍스트 설정
        context.font = '15px Arial';
        context.fillStyle = 'black';
        context.textAlign = 'left';
        context.textBaseline = 'top';

        // 검은색이면 흰색출력
        if (this.color == "#000000"){
            context.fillStyle = 'white';
        }

        // 텍스트를 줄바꿈 문자('\n')로 나누기
        const lineHeight = 20;
        const lines = this.cont.split('\n');
        let wrappedLines = [];

        // 7글자 이상인 줄은 스플릿해서 wrappedLines에 넣기
        for (let l of lines) {
            if (l.length > 7) {
                for (let i = 0; i < l.length; i += 7) {
                    wrappedLines.push(l.substring(i, i + 7));
                }
            } else {
                wrappedLines.push(l);
            }
        }

        // 각 줄의 텍스트 그리기
        wrappedLines.forEach((line, index) => {
            context.fillText(line, 5, 5 + index * lineHeight);
        });
        
        // Canvas를 텍스처로 변환
        const texture = new THREE.CanvasTexture(canvas);
        
        // 메모 메쉬 생성
        const memo_geo = new THREE.PlaneGeometry(2.8, 2.8);
        const memo_mat = new THREE.MeshBasicMaterial({ map: texture });
        const memo = new THREE.Mesh(memo_geo, memo_mat);
        memo.position.set(this.x, this.y, -1.2 - Math.random()*0.1);
        this.mesh = memo;
        // Three.js 씬에 메모 추가
        this.scene.add(memo);
    }

    createModeStart(x, y) {
        this.x = x;
        this.y = y;
        const p = document.querySelector('#postForm');
        p.classList.remove('translate-x-full');
        p.classList.add('translate-x-0');  
    }

    createModeEnd() {
        const p = document.querySelector('#postForm');
        const textbox = document.querySelector('#textbox');
        textbox.value = "";
        p.classList.add('translate-x-full');
        p.classList.remove('translate-x-0');
    }

    upload(cont, color) {
        this.cont = cont;
        this.color = color;
        this.draw_mm();

        const memoData = {
            x: this.x,
            y: this.y,
            cont: this.cont,
            color: this.color
        };

        // 기존에 저장된 메모들을 가져옵니다.
        let memos = JSON.parse(localStorage.getItem('memos')) || [];

        // 새 메모를 추가합니다.
        memos.push(memoData);

        // 메모들을 로컬 저장소에 다시 저장합니다.
        localStorage.setItem('memos', JSON.stringify(memos));
        this.createModeEnd();
        // Fetch

        // fetch('', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization' : document.cookie['token'],
        //         'Content-Type' : 'application/json'
        //     },
        //     body: JSON.stringify({
        //         x: this.x,
        //         y: this.y,
        //         cont: this.cont,
        //         color: this.color,
        //     })
        // })
        // .then(res => res.json())
        // .then(data => {
        //     console.log('Success: ', data);
        // })
        // .catch(err => {
        //     console.error('Error', err)
        // })
    }
}