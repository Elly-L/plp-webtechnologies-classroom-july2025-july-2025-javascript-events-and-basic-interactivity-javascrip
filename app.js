// --- Theme toggle ---
document.getElementById('theme-toggle').addEventListener('click', function(){
  document.body.classList.toggle('dark-mode');
  const icon=this.querySelector('i'); const text=this.querySelector('span');
  if(document.body.classList.contains('dark-mode')){
    icon.classList.replace('fa-moon','fa-sun'); text.textContent='Light Mode';
  } else { icon.classList.replace('fa-sun','fa-moon'); text.textContent='Dark Mode';}
});

// --- Page content ---
const pageContent=document.getElementById('page-content');
const pages={
  dashboard:`
    <div class="card">
      <div class="card-header"><h2 class="card-title">Stock Performance</h2></div>
      <div class="tabs">
        <div class="tab active" data-time="1D">1D</div>
        <div class="tab" data-time="1W">1W</div>
        <div class="tab" data-time="1M">1M</div>
        <div class="tab" data-time="3M">3M</div>
        <div class="tab" data-time="1Y">1Y</div>
      </div>
      <canvas id="stock-chart"></canvas>
    </div>`,
  portfolio:`
    <div class="card"><h2 class="card-title">Portfolio Overview</h2>
    <canvas id="portfolio-chart"></canvas></div>`,
  trade:`
    <div class="card"><h2 class="card-title">Trade</h2>
      <form id="trade-form">
        <label>Symbol: <input type="text" id="symbol"></label><br><br>
        <label>Quantity: <input type="number" id="quantity"></label><br><br>
        <button type="submit">Buy</button>
      </form>
      <p id="trade-msg"></p>
    </div>`,
  watchlist:`<div class="card"><h2 class="card-title">Watchlist</h2><ul><li>AAPL</li><li>GOOGL</li><li>TSLA</li></ul></div>`,
  news:`<div class="card"><h2 class="card-title">Market News</h2><ul><li>Stocks rally after Fed decision.</li><li>Oil prices climb amid supply cuts.</li></ul></div>`,
  history:`<div class="card"><h2 class="card-title">Trade History</h2><table border="1" width="100%"><tr><th>Symbol</th><th>Qty</th><th>Action</th></tr><tr><td>AAPL</td><td>10</td><td>Buy</td></tr></table></div>`,
  settings:`<div class="card"><h2 class="card-title">Settings</h2><label><input type="checkbox"> Email Notifications</label></div>`
};

// --- Sidebar nav ---
document.querySelectorAll('.sidebar-menu a').forEach(link=>{
  link.addEventListener('click',function(){
    document.querySelectorAll('.sidebar-menu a').forEach(a=>a.classList.remove('active'));
    this.classList.add('active');
    const page=this.dataset.page;
    pageContent.innerHTML=pages[page];
    if(page==="dashboard"){ initChart("1D"); setupTabs(); }
    if(page==="portfolio"){ initPortfolio(); }
    if(page==="trade"){ setupTradeForm(); }
  });
});

// --- Simulated GraphQL fetch ---
async function fetchGraphQL(timeframe){
  if(timeframe==="1D") return {labels:["9:30","10:00","11:00","12:00","13:00","14:00","15:00"],values:[100,102,101,103,104,102,105]};
  if(timeframe==="1W") return {labels:["Mon","Tue","Wed","Thu","Fri"],values:[95,98,100,102,105]};
  if(timeframe==="1M") return {labels:["W1","W2","W3","W4"],values:[90,95,100,105]};
  if(timeframe==="3M") return {labels:["M1","M2","M3"],values:[85,95,105]};
  if(timeframe==="1Y") return {labels:["Q1","Q2","Q3","Q4"],values:[80,90,100,110]};
}

let stockChart;
async function initChart(timeframe){
  const ctx=document.getElementById("stock-chart").getContext("2d");
  const data=await fetchGraphQL(timeframe);
  if(stockChart) stockChart.destroy();
  stockChart=new Chart(ctx,{
    type:"line",
    data:{labels:data.labels,datasets:[{label:"Price",data:data.values,borderColor:"#1a73e8",fill:true,backgroundColor:"rgba(26,115,232,0.1)",tension:0.3}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}
  });
}

function setupTabs(){
  document.querySelectorAll('.tab').forEach(tab=>{
    tab.addEventListener('click',async function(){
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      this.classList.add('active');
      await initChart(this.dataset.time);
    });
  });
}

// --- Portfolio chart ---
function initPortfolio(){
  const ctx=document.getElementById("portfolio-chart").getContext("2d");
  new Chart(ctx,{
    type:"doughnut",
    data:{labels:["Stocks","Bonds","Cash"],datasets:[{data:[60,25,15],backgroundColor:["#1a73e8","#4caf50","#ff9800"]}]}
  });
}

// --- Trade form ---
function setupTradeForm(){
  const form=document.getElementById("trade-form");
  const msg=document.getElementById("trade-msg");
  form.addEventListener("submit",function(e){
    e.preventDefault();
    const symbol=document.getElementById("symbol").value;
    const qty=document.getElementById("quantity").value;
    msg.textContent=`Order placed: Buy ${qty} shares of ${symbol}`;
  });
}

// Load default page
pageContent.innerHTML=pages.dashboard;
initChart("1D"); setupTabs();
