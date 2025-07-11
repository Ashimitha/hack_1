const PAIRS=9, T=60;
let moves=0, matches=0, current=1, score={1:0,2:0};
let first,second,lock=false, timeLeft=T, timerId;
const grid=document.querySelector('.grid-container'),
  movesD=document.getElementById('moves'),
  starsD=document.getElementById('stars'),
  s1=document.getElementById('score1'),
  s2=document.getElementById('score2'),
  turnD=document.getElementById('turn'),
  modal=document.getElementById('modal'),
  msg=document.getElementById('modal-message'),
  finalMovesD=document.getElementById('finalMoves'),
  finalStarsD=document.getElementById('finalStars');

document.getElementById('restart').onclick=init;
document.getElementById('modal-restart').onclick=()=>{modal.style.display='none';init();};

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}}

function createCard(v){
  const c=document.createElement('div');
  c.className='card';
  c.innerHTML=`
    <div class="card-inner">
      <div class="card-face card-front"></div>
      <div class="card-face card-back">${v}</div>
    </div>`;
  c.onclick=()=>flip(c);
  grid.appendChild(c);
}

function updateRating(){
  const s = moves <=12 ? 3 : moves <=18 ? 2 : 1;
  starsD.textContent = '★'.repeat(s) + '☆'.repeat(3-s);
}

function init(){
  clearInterval(timerId);
  moves=matches=0; current=1; score={1:0,2:0}; timeLeft=T;
  movesD.textContent=0; updateRating();
  s1.textContent=s2.textContent='0'; turnD.textContent='1';
  grid.innerHTML='';
  const arr=[...Array(PAIRS).keys()].flatMap(n=>[n+1,n+1]);
  shuffle(arr); arr.forEach(createCard);
  timerId=setInterval(()=>{
    if(--timeLeft<=0){clearInterval(timerId); end(); }
  },1000);
}

function flip(card){
  if(lock||card===first)return;
  card.classList.add('flipped');
  if(!first){ first=card; return; }
  second=card; lock=true;
  movesD.textContent=++moves; updateRating();
  const v1=first.querySelector('.card-back').textContent;
  const v2=second.querySelector('.card-back').textContent;
  if(v1===v2){
    [first,second].forEach(c=>c.classList.add('matched'));
    score[current]++; document.getElementById(`score${current}`).textContent=score[current];
    matches++; reset(true);
    if(matches===PAIRS) end();
  } else {
    setTimeout(()=>{
      first.classList.remove('flipped');
      second.classList.remove('flipped');
      reset(false);
    },800);
  }
}

function reset(isMatch){
  if(!isMatch) current = current===1 ? 2 : 1;
  turnD.textContent=current;
  [first,second,lock]=[null,null,false];
}

function end(){
  clearInterval(timerId);
  const finalStars = starsD.textContent;
  const winner = score[1]>score[2] ? `Player 1 wins` :
                 score[2]>score[1] ? `Player 2 wins` : `It's a draw`;
  msg.textContent = `${winner} ${score[1]}–${score[2]}!`;
  finalMovesD.textContent = moves;
  finalStarsD.textContent = finalStars;
  modal.style.display='flex';
}

init();
