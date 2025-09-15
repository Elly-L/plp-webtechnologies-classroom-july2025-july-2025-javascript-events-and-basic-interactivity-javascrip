// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', function(){
  document.body.classList.toggle('dark-mode');
  const icon=this.querySelector('i'); const text=this.querySelector('span');
  if(document.body.classList.contains('dark-mode')){
    icon.classList.replace('fa-moon','fa-sun'); text.textContent='Light Mode';
  } else { icon.classList.replace('fa-sun','fa-moon'); text.textContent='Dark Mode';}
});

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
      <div class="chart-container"><canvas id="stock-chart"></canvas></div>
    </div>`,
  portfolio:`
    <div class="card">
      <div class="card-header"><h2 class="card-title">Holdings</h2></div>
      <table><tr><th>Stock</th><th>Shares</th><th>Price</th><th>Value</th></tr>
      <tr><td>AAPL</td><td>50</td><td>$170</td><td>$8,500</td></tr>
      <tr><td>GOOG</td><td>20</td><td>$2800</td><td>$56,000</td></tr></table>
    </div>
    <div class="card">
      <div class="card-header"><h2 class="card-title">Allocation</h2></div>
      <div class="chart-container"><canvas id="pie-chart"></canvas></div>
    </div>`,
  trade:`
    <div class="card">
      <div class="card-header"><h2 class="card-title">Place Trade</h2></div>
      <form id="trade-form">
        <select required><option>Buy</option><option>Sell</option></select>
        <input type="text" placeholder="Stock Symbol" required/>
        <input type="number" placeholder="Shares" required/>
        <button type="submit">Submit</button>
      </form>
    </div>`,
  watchlist:`
    <div class="card">
      <div class="card-header"><h2 class="card-title">Watchlist</h2></div>
      <table><tr><th>Stock</th><th>Price</th><th>Change</th></tr>
      <tr><td>MSFT</td><td>$330</td><td style="color:green">+1.2%</td></tr>
      <tr><td>TSLA</td><td>$700</td><td style="color:red">-0.8%</td></tr></table>
    </div>`,
  news:`
    <div class="card"><div class="card-header"><h2 class="card-title">Market News</h2></div>
    <p><strong>Dow rises</strong> as tech stocks surge...</p>
    <p><strong>Oil prices</strong> fall on demand worries...</p></div>`,
  history:`
    <div class="card"><div class="card-header"><h2 class="card-title">Trade History</h2></div>
    <table><tr><th>Date</th><th>Stock</th><th>Action</th><th>Shares</th><th>Price</th></tr>
    <tr><td>2025-09-01</td><td>AAPL</td><td>Buy</td><td>10</td><td>$170</td></tr>
    <tr><td>2025-08-25</td><td>TSLA</td><td>Sell</td><td>5</td><td>$720</td></tr></table></div>`,
  settings:`
    <div class="card"><div class="card-header"><h2 class="card-title">Profile Settings</h2></div>
    <form>
      <input type="text" placeholder="Name" value="John Doe"/>
      <input type="email" placeholder="Email" value="john@example.com"/>
      <button type="submit">Save</button>
    </form></div>`
};

document.querySelectorAll('.sidebar-menu a').forEach(link=>{
  link.addEventListener('click',function(){
    document.querySelectorAll('.sidebar-menu a').forEach(a=>a.classList.remove('active'));
    this.classList.add('active');
    const page=this.dataset.page;
    pageContent.innerHTML=pages[page];
    if(page==="dashboard"){ initChart("1D"); setupTabs(); }
    if(page==="portfolio"){ initPie(); }
  });
});

async function fetchGraphQL(timeframe){
  if(timeframe==="1D") return {labels:["9:30","10:00","11:00","12:00","13:00","14:00","15:00"],values:[100,102,101,103,104,102,105]};
  if(timeframe==="1W") return {labels:["Mon","Tue","Wed","Thu","Fri"],values:[95,98,100,102,105]};
  if(timeframe==="1M") return {labels:["W1","W2","W3","W4"],values:[90,95,100,105]};
  if(timeframe==="3M") return {labels:["M1","M2","M3"],values:[85,95,105]};
  if(timeframe==="1Y") return {labels:["Q1","Q2","Q3","Q4"],values:[80,90,100,110]};
}

let stockChart;
async function initChart(tf){
  const ctx=document.getElementById("stock-chart").getContext("2d");
  const data=await fetchGraphQL(tf);
  if(stockChart) stockChart.destroy();
  stockChart=new Chart(ctx,{type:"line",
    data:{labels:data.labels,datasets:[{data:data.values,borderColor:"#1a73e8",
    backgroundColor:"rgba(26,115,232,0.1)",tension:0.3,fill:true}]},
    options:{maintainAspectRatio:true,responsive:true,plugins:{legend:{display:false}}}});
}

function setupTabs(){
  document.querySelectorAll('.tab').forEach(tab=>{
    tab.addEventListener('click',async function(){
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      this.classList.add('active'); await initChart(this.dataset.time);
    });
  });
}

let pieChart;
function initPie(){
  const ctx=document.getElementById("pie-chart").getContext("2d");
  if(pieChart) pieChart.destroy();
  pieChart=new Chart(ctx,{type:"pie",
    data:{labels:["AAPL","GOOG"],datasets:[{data:[8500,56000],
    backgroundColor:["#1a73e8","#4caf50"]}]},options:{responsive:true}});
}

// Default load
pageContent.innerHTML=pages.dashboard;
initChart("1D"); setupTabs();
