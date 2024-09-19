var localCarrinho = localStorage.getItem('carrinho');
if (localCarrinho) {
    var carrinho = JSON.parse(localCarrinho);
    if (carrinho.length > 0) {
        renderizarCarrinho();
        calcularTotal();
    } else {
        carrinhoVazio();
    }
} else {
    carrinhoVazio();
}

function renderizarCarrinho() {
    $("#listaCarrinho").empty();

    $.each(carrinho, function (index, itemCarrinho) {
        var itemDiv = `
                    <div class="item-carrinho">
                            <div class="area-img">
                                <img src="${itemCarrinho.item.imagem}">
                            </div>
                            <div class="area-details">
                                <div class="sup">
                                    <span class="name-prod">
                                    ${itemCarrinho.item.nome}
                                    </span>
                                    <a data-index="${index}" class="delete-item" href="#">
                                        <i class="ri-close-line"></i>
                                    </a>
                                </div>
                                <div class="middle">
                                    <span>${itemCarrinho.item.principal_caracteristica}</span>
                                </div>
                                <div class="preco-quantidade">
                                    <span>${itemCarrinho.item.preco_promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    <div class="count">
                                        <a class="minus" data-index="${index}" href="#">-</a>
                                        <input style="width: 30px; text-align: center; background: var(--branco) !important;" readonly class="qtd-item " type="text" value="${itemCarrinho.quantidade}">
                                        <a class="plus" data-index="${index}" href="#">+</a>
                                    </div>
                                </div>
                            </div>
                        </div>
        
        
        `;

        $("#listaCarrinho").append(itemDiv);

    });

    $(".delete-item").on('click', function () {
        var index = $(this).data('index');
        var itemname = carrinho[index].item.nome
        console.log('o indice é: ', index)
        app.dialog.confirm(`Tem certeza que quer remover ${itemname}?`, 'Remover', function () {
            carrinho.splice(index, 1);
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            app.views.main.router.refreshPage();
        });
    });



    $(".minus").on('click', function () {
        var index = $(this).data('index');
        console.log('o indice é: ', index)

        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
            carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderizarCarrinho();
            calcularTotal();
        } else {
            var itemname = carrinho[index].item.nome;
            app.dialog.confirm(`Gostaria de remover <strong>${itemname}</strong>?`, 'Remover', function () {
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                app.views.main.router.refreshPage();
            });
        }

    });



    $(".plus").on('click', function () {
        var index = $(this).data('index');
        console.log('o indice é: ', index);
        carrinho[index].quantidade++;
        carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho();
        calcularTotal();
    });



}

function calcularTotal() {
    var totalCarrinho = 0;
    $.each(carrinho, function (index, itemCarrinho) {
        totalCarrinho += itemCarrinho.total_item;
    });
    $("#subtotal").html(totalCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
}


function carrinhoVazio() {
    console.log('O carrinho está vazio');
    $("#listaCarrinho").empty();

    $("#toolbarTotais").addClass('display-none');
    $("#toolbarCheckout").addClass('display-none');

    $("#listaCarrinho").html(`
        <div class="text-align-center">
            <img width="300" src="img/empty.gif">
            <br><span class="color-gray">Carrinho Vazio...</span></br>
        </div>
        
        `);

}


$("#esvaziar").on('click', function () {
    app.dialog.confirm('Tem certeza que quer esvaziar o carrinho?', '<strong>Esvaziar</strong>', function () {
        localStorage.removeItem('carrinho');
        app.views.main.router.refreshPage();
    });
});