// Recuperando a classe da página
let bodyClass=document.body.classList;

if(bodyClass.contains("index")){
    const emprestimos=JSON.parse(localStorage.getItem("emprestimos")) || [];

    let total=0;
    let lucro=0;
    let pendente=0;

    emprestimos.forEach(emp=>{
        if(emp.status==="pendente"){
        total+=emp.valor;    
        pendente +=emp.valor;
        lucro+=emp.valor*((emp.juros || 0)/100);
        }
    })
    

    document.querySelector(".total p").textContent=`R$${total.toFixed(2)}`;
    document.querySelector(".lucro p").textContent=`R$${lucro.toFixed(2)}`;
    document.querySelector(".pendentes p").textContent=`R$${pendente.toFixed(2)}`;
}

else if(bodyClass.contains("emprestimo")){
    const form =document.querySelector(".form-emprestimo");
    const inputNome=form.querySelector('input[type="text"]');
    const inputValor=form.querySelector("input[type='number']");
    const selectJuros=form.querySelector("#juros");

    function salvarEmprestimo(){
 const emprestimos= JSON.parse(localStorage.getItem("emprestimos")) || [];

  const emprestimo={
        nome:inputNome.value,
        valor:Number(inputValor.value),
        juros:Number(selectJuros.value),
        status:"pendente"
    };


     emprestimos.push(emprestimo);

      localStorage.setItem("emprestimos", JSON.stringify(emprestimos));

       form.reset();
    alert("Empréstimo cadastrado com sucesso!");
    }

    form.addEventListener("submit", function(e){
        e.preventDefault();
        salvarEmprestimo();
    })
   
}

else if(bodyClass.contains("pendencia")){
const emprestimos = JSON.parse(localStorage.getItem("emprestimos"))||[];

const pendentes = emprestimos.filter(emp=>emp.status==="pendente");

const container = document.querySelector(".pendente");
container.innerHTML="";

if(pendentes.length===0){
    container.innerHTML="<p>Não há empréstimos pendentes</p>";
}else{
    pendentes.forEach(emp=>{
        const div=document.createElement("div");
        div.classList.add("card-pendente");
        div.style.border="1px solid #CAAB66";
        div.style.padding="10px";
        div.style.borderRadius="6px";

        div.innerHTML=`<p> <strong > Cliente : </strong > ${ emp.nome } </p>
        <p><strong >Valor : </strong> R$${emp.valor.toFixed(2) }</p>
        <p><strong>Juros : </strong> ${emp.juros } %</p>
        <button class="pago">Marcar como pago</button>`;

        div.querySelector(".pago").addEventListener('click', ()=>{
            emp.status="pago";
            localStorage.setItem("emprestimos", JSON.stringify(emprestimos));
            div.remove();
        })
        container.appendChild(div);
    })
}
}

else if(bodyClass.contains("graficos")){

    const emprestimos = JSON.parse(localStorage.getItem("emprestimos")) ||[];
    let total=0;
    let lucro=0;
    let pendentes=0;

    emprestimos.forEach(emp =>{
        total +=emp.valor;
        lucro +=emp.valor *((emp.juros ||0 )/100);
        if(emp.status==="pendente") pendentes +=emp.valor;
    });

    const ctx=document.getElementById('graficoEmprestimos').getContext("2d");

    new Chart(ctx,{
        type:"bar",
        data:{
            labels:["Total", "Lucro", "Pendentes"],
            datasets:[{
                label:"Valores (R$)",
                data:[total, lucro, pendentes],
                backgroundColor:["rgba(202, 171, 102, 0.9)",
                    "rgba(136, 136, 136, 0.8)", 
                    "rgba(255, 85, 85, 0.8)"],
                    borderColor:"#000",
                    borderWidth:1,
                    borderRadius:8,
            }]
        },
        options:{
            responsive:true,
            plugins:{
                legend:{ display: false
                },
                title:{
                    display:true,
                    text:"Resumo Financeiro - NeiBank",
                    color: "#CAAB66",
                    font:{size:18}
                }
            },
            scales:{
                x:{
                    ticks:{color:"#CAAB66"},
                    grid:{color:"rgba(202, 171, 102, 0.1)"}
                },
                y:{
                    beginAtZero:true,
                    ticks:{color:"#CAAB66"},
                    grid:{color:"rgba(202, 171, 102,0.1)"}
                }
            }
        }
    })
}

else if (bodyClass.contains("historico")) {
  const emprestimos = JSON.parse(localStorage.getItem("emprestimos")) || [];
  const pagos = emprestimos.filter(emp => emp.status === "pago");
  const container = document.querySelector(".historico");

  container.innerHTML = "";

  if (pagos.length === 0) {
    container.innerHTML = "<p>Nenhum empréstimo pago ainda.</p>";
  } else {
    pagos.forEach(emp => {
      const div = document.createElement("div");
      div.classList.add("card-historico");
      div.innerHTML = `
        <p><strong>Cliente:</strong> ${emp.nome}</p>
        <p><strong>Valor:</strong> R$${emp.valor.toFixed(2)}</p>
        <p><strong>Juros:</strong> ${emp.juros}%</p>
        <p><strong>Status:</strong> <span style="color:lightgreen;">${emp.status}</span></p>
      `;
      container.appendChild(div);
    });
  }
}
