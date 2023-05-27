class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (let i in this) {
      if (this[i] === undefined || this[i] === "" || this[i] === null) {
        return false;
      }
    }

    return true;
  }
}

class BD {
  constructor() {
    let id = localStorage.getItem("id");

    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }

  getProximoID() {
    let proximoID = localStorage.getItem("id");
    return parseInt(proximoID) + 1;
  }

  gravar(des) {
    let id = this.getProximoID();

    localStorage.setItem(id, JSON.stringify(des));

    localStorage.setItem("id", id);
  }

  recuperarTodosRegistros() {
    let despesas = Array();

    let id = localStorage.getItem("id");

    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));

      if (despesa === null) {
        continue;
      }

      despesa.id = i;
      despesas.push(despesa);
    }

    return despesas;
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array();

    despesasFiltradas = this.recuperarTodosRegistros();

    if (despesa.ano != "") {
      despesasFiltradas = despesasFiltradas.filter((f) => f.ano == despesa.ano);
    }

    if (despesa.mes != "") {
      despesasFiltradas = despesasFiltradas.filter((f) => f.mes == despesa.mes);
    }

    if (despesa.dia != "") {
      despesasFiltradas = despesasFiltradas.filter((f) => f.dia == despesa.dia);
    }

    if (despesa.tipo != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (f) => f.tipo == despesa.tipo
      );
    }

    if (despesa.valor != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (f) => f.valor == despesa.valor
      );
    }

    if (despesa.descricao != "") {
      despesasFiltradas = despesasFiltradas.filter(
        (f) => f.descricao == despesa.descricao
      );
    }

    return despesasFiltradas;
  }

  remover(id) {
    localStorage.removeItem(id);
  }
}

let bd = new BD();

function registerExpense() {
  let ano = document.getElementById("ano");
  let mes = document.getElementById("mes");
  let dia = document.getElementById("dia");
  let tipo = document.getElementById("tipo");
  let descricao = document.getElementById("descricao");
  let valor = document.getElementById("valor");

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  if (despesa.validarDados()) {
    let dia = document.getElementById("dia");

    if (parseInt(dia.value) <= 31) {
      bd.gravar(despesa);

      /* Mudando os nomes */
      document.getElementById("modalTitle").innerHTML =
        "Registro inserido com sucesso";
      document.getElementById("modalDescription").innerHTML =
        "Despesa foi cadastrada com sucesso!";
      document.getElementById("modalButton").innerHTML = "Voltar";

      document.getElementById("modalTitle").classList.remove("text-danger");
      document.getElementById("modalButton").classList.remove("btn-danger");

      /* Adicionando as classes */
      document.getElementById("modalTitle").classList.add("text-success");
      document.getElementById("modalButton").classList.add("btn-success");

      $("#modalRegistroDespesa").modal("show");

      ano.value = "";
      mes.value = "";
      dia.value = "";
      tipo.value = "";
      descricao.value = "";
      valor.value = "";
    } else {
      /* Mudando os nomes */
      document.getElementById("modalTitle").innerHTML = "Este dia não existe";
      document.getElementById("modalDescription").innerHTML =
        "Os dias só podem ser considerados entre 1 e 31!";
      document.getElementById("modalButton").innerHTML = "Voltar e corrigir";

      document.getElementById("modalTitle").classList.remove("text-success");
      document.getElementById("modalButton").classList.remove("btn-success");

      /* Adicionando as classes */
      document.getElementById("modalTitle").classList.add("text-danger");
      document.getElementById("modalButton").classList.add("btn-danger");

      $("#modalRegistroDespesa").modal("show");
    }
  } else {
    /* Mudando os nomes */
    document.getElementById("modalTitle").innerHTML =
      "Erro na inclusão do registro";
    document.getElementById("modalDescription").innerHTML =
      "Erro na gravação, verifique se todos os campos foram preenchidos corretamente!";
    document.getElementById("modalButton").innerHTML = "Voltar e corrigir";

    document.getElementById("modalTitle").classList.remove("text-success");
    document.getElementById("modalButton").classList.remove("btn-success");

    /* Adicionando as classes */
    document.getElementById("modalTitle").classList.add("text-danger");
    document.getElementById("modalButton").classList.add("btn-danger");

    $("#modalRegistroDespesa").modal("show");
  }
}

function carregaListaDespesas() {
  let despesas = Array();

  despesas = bd.recuperarTodosRegistros();

  let listaDespesas = document.getElementById("listaDespesas");

  despesas.forEach(function (d) {
    let linha = listaDespesas.insertRow();

    linha.insertCell(0).innerHTML =
      (d.dia < 10 ? "0" + d.dia : d.dia) +
      "/" +
      (d.mes < 10 ? "0" + d.mes : d.mes) +
      "/" +
      d.ano;
    linha.insertCell(1).innerHTML =
      d.tipo == 1
        ? "Alimentação"
        : d.tipo == 2
        ? "Educação"
        : d.tipo == 3
        ? "Lazer"
        : d.tipo == 4
        ? "Saúde"
        : d.tipo == 5
        ? "Transporte"
        : "";
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;

    let btn = document.createElement("button");
    btn.innerHTML = "<i class='fas fa-times'></i>";
    btn.className = "btn btn-danger";
    btn.id = `id_despesa_${d.id}`;
    btn.onclick = function () {
      let id = this.id.replace("id_despesa_", "");
      bd.remover(id);

      /* Mudando os nomes */
      document.getElementById("modalTitle").innerHTML =
        "Registro removido com sucesso";
      document.getElementById("modalDescription").innerHTML =
        "Despesa foi removida com sucesso!";
      document.getElementById("modalButton").innerHTML = "Voltar";

      document.getElementById("modalTitle").classList.remove("text-danger");
      document.getElementById("modalButton").classList.remove("btn-danger");

      /* Adicionando as classes */
      document.getElementById("modalTitle").classList.add("text-success");
      document.getElementById("modalButton").classList.add("btn-success");

      window.location.reload();
    };
    linha.insertCell(4).append(btn);
  });
}

function pesquisarDespesa() {
  let ano = document.getElementById("ano").value;
  let mes = document.getElementById("mes").value;
  let dia = document.getElementById("dia").value;
  let tipo = document.getElementById("tipo").value;
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

  let despesas = bd.pesquisar(despesa);

  let listaDespesas = document.getElementById("listaDespesas");
  listaDespesas.innerHTML = "";

  despesas.forEach(function (d) {
    let linha = listaDespesas.insertRow();

    linha.insertCell(0).innerHTML =
      (d.dia < 10 ? "0" + d.dia : d.dia) +
      "/" +
      (d.mes < 10 ? "0" + d.mes : d.mes) +
      "/" +
      d.ano;
    linha.insertCell(1).innerHTML =
      d.tipo == 1
        ? "Alimentação"
        : d.tipo == 2
        ? "Educação"
        : d.tipo == 3
        ? "Lazer"
        : d.tipo == 4
        ? "Saúde"
        : d.tipo == 5
        ? "Transporte"
        : "";
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;

    let btn = document.createElement("button");
    btn.innerHTML = "<i class='fas fa-times'></i>";
    btn.className = "btn btn-danger";
    btn.id = `id_despesa_${d.id}`;
    btn.onclick = function () {
      let id = this.id.replace("id_despesa_", "");

      bd.remover(id);

      window.location.reload();

      /* Mudando os nomes */
      document.getElementById("modalTitle").innerHTML =
        "Registro removido com sucesso";
      document.getElementById("modalDescription").innerHTML =
        "Despesa foi removida com sucesso!";
      document.getElementById("modalButton").innerHTML = "Voltar";

      document.getElementById("modalTitle").classList.remove("text-danger");
      document.getElementById("modalButton").classList.remove("btn-danger");

      /* Adicionando as classes */
      document.getElementById("modalTitle").classList.add("text-success");
      document.getElementById("modalButton").classList.add("btn-success");

    };
    linha.insertCell(4).append(btn);
  });
}
