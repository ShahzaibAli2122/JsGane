var sym = ['❆', '❅', '❄', '✵', '✣', '✪', '☆', '✧', '☸', '♫', '☼', '♪', '❖', '✜', '☢', '☊'], 
    nxtsym = [], 
    gridstate = [], 
    started = false, 
    onhold = null;

var topbar = document.getElementById('top-bar'),
    gridszel = document.getElementById('sz-lbl'), 
    gsdecr = document.getElementById('sz-decr'), 
    gsincr = document.getElementById('sz-incr'),
    gen = document.getElementById('gen'),
    nxt = document.getElementById('next'), 
    freeel = document.getElementById('free'), 
    ptsel = document.getElementById('pts'), 
    gridel = document.getElementById('grid'), 
    start = document.getElementById('start');

var initUsedSym = function() {
  var used = [], symsz = sym.length;
  for(var i = 0; i < usedsymsz; i++) {
    var tmp = Math.round(Math.random()*(symsz-1));
    while(used.indexOf(sym[tmp]) != -1) {
      tmp = Math.round(Math.random()*(symsz-1));
    }
    used.push(sym[tmp]);
  }
  return used;
};

var gridsz = parseInt(gridszel.innerHTML, 10), 
    nextsz = Math.round(gridsz/3), 
    scorelinesz = Math.ceil(gridsz/2), 
    usedsymsz = Math.round(gridsz*.75), 
    usedsym = initUsedSym(), 
    free = gridsz*gridsz, 
    score = 0;

var initNext = function() {
  var txt = '';
  nxtsym = [];
  for(var i = 0; i < nextsz; i++) {
    var r = Math.round(Math.random()*(usedsymsz-1));
    nxtsym.push(usedsym[r]);
    txt += "<li><span class='sym sym-" + r + "'>" + usedsym[r] + "</span></li>";
  }
  nxt.innerHTML = txt;
};

initNext();

var initGrid = function() {
  var txt = '';
  onhold = null;
  for(var i = 0; i < gridsz; i++) {
    txt += "<div id='gridrow-" + i + "' class='gridcomp gridrow'>";
    for(var j = 0; j < gridsz; j++) {
      gridstate[i*gridsz + j] = null;
      txt += 
        "<div id='gridcell-" + i + "-" + j + "' class='gridcomp gridcell'></div>";
    }
    txt += "</div>"
  }
  gridel.innerHTML = txt;
};

initGrid();

var initFree = function() {
  var t = 'Free cels: ' + free;
  freeel.innerHTML = t;
};

initFree();

var initPts = function() {
  var t = 'Score: ' + score;
  ptsel.innerHTML = t;
};

initPts();

topbar.addEventListener('click', function(e){
  var target = e.target;
  if(target == gsdecr) {
    if(gridsz > 3) gridszel.innerHTML = --gridsz;
    return;
  }
  if(target == gsincr) {
    if(gridsz < 17) gridszel.innerHTML = ++gridsz;
    return;
  }
  if(target == gen) {
    nextsz = Math.round(gridsz/3), 
    scorelinesz = Math.ceil(gridsz/2), 
    usedsymsz = Math.round(gridsz*.75), 
    usedsym = initUsedSym(), 
    free = gridsz*gridsz, 
    score = 0;
    initNext();
    initFree();
    initPts();
    initGrid();
    started = false;
  }
}, false);

var nextS = function() {
  for(var i = 0; i < nextsz; i++) {
    if (free === 0) {
      alert("game over!");
      return;
    }
    var t = Math.round(Math.random()*(gridsz*gridsz-1)), 
        col, row, cell;
    while(gridstate[t] != null) {
      t = Math.round(Math.random()*(gridsz*gridsz-1));
    }
    --free;
    freeel.innerHTML = 'Free cells: ' + free;
    gridstate[t] = nxtsym[i];
    col = t%gridsz;
    row = (t - col)/gridsz;
    cell = document.getElementById("gridcell-" + row + "-" + col);
    cell.innerHTML = nxtsym[i];
  }
  initNext();
};

start.addEventListener('click', function(){
  if(started) initNext();
  initGrid();
  nextS();
  started = true;
  console.log(gridstate);
}, false);

var check1Fill = function(idx, csym, advance) {
  console.log('checkfor ' + idx + '/' + csym);
  var count = 1, cidx = idx-1, lidx = idx-1, ridx = idx+1;
  console.log('will check left & right of ' + idx);
  console.log('start from ' + idx);
  while(cidx%gridsz !== (gridsz-1) && gridstate[cidx] == csym) {
    console.log('going left');
    console.log('have ' + csym + ' at ' + cidx);
    count++;
    lidx = cidx--;
  }
  console.log('at ' + lidx + ': ' + gridstate[lidx]);
  if(gridstate[lidx] != csym) lidx++;
  cidx = idx+1;
  while(cidx%gridsz !== 0 && gridstate[cidx] == csym) {
    console.log('going right');
    console.log('have ' + csym + ' at ' + cidx);
    count++;
    ridx = cidx++;
  }
  console.log('at ' + ridx + ': ' + gridstate[ridx]);
  if(gridstate[ridx] != csym) ridx--;
  console.log('between ' + lidx + ' & ' + ridx);
  console.log(count + ' vs min is ' + scorelinesz);
  if(count >= scorelinesz) {
    score += 10 + (count - scorelinesz);
    ptsel.innerHTML = 'Score: ' + score;
    for(var i = lidx; i <= ridx; i++) {
      gridstate[i] = null;
      ++free;
      freeel.innerHTML = 'Free cells: ' + free;
      var c = i%gridsz, 
          r = (i-c)/gridsz, 
          cel = document.getElementById('gridcell-' + r + '-' + c);
      console.log('clean ' + i + ' gridcell-' + r + '-' + c);
      cel.innerHTML = '';
    }
    return true;
  }
  return false;
};

var checkFill = function(idx, csym) {
  if(check1Fill(idx, csym, 1)) return true;
  if(check1Fill(idx, csym, gridsz)) return true;
  if(check1Fill(idx, csym, gridsz+1)) return true;
  return false;
};

grid.addEventListener('click', function(e){
  if(!started) return;
  var target = e.target, 
      elid = target.id, 
      idparts = elid.split('-'), 
      row = parseInt(idparts[1], 10), 
      col = parseInt(idparts[2], 10), 
      cid = row*gridsz + col;
  if(onhold == null && gridstate[cid] == null)
    return;
  if(onhold != null) {
    var prevcol = onhold%gridsz,
        prevrow = (onhold - prevcol)/gridsz,
        prevclicked = document.getElementById('gridcell-' + prevrow + '-' + prevcol);
    prevclicked.classList.remove('pulse');
    if(gridstate[cid] != null) {
      onhold = cid;
      console.log('hold ' + onhold);
      target.classList.add('pulse');
      return;
    }
    prevclicked.innerHTML = '';
    var csym = gridstate[onhold];
    target.innerHTML = csym;
    gridstate[cid] = csym;
    gridstate[onhold] = null;
    onhold = null;
    if(!checkFill(cid, csym)){
      nextS();
      var gl = gridstate.length;
      for(var i = 0; i < gl; i++) {
        if(i%gridsz <= scorelinesz) continue;
        csym = gridstate[i];
        if(csym != null) checkFill(i, csym);
      }
    }
    return;
  }
  if(gridstate[cid] != null) {
    onhold = cid;
    console.log('hold ' + onhold);
    target.classList.add('pulse');
    return;
  }
}, false);