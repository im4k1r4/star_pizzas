//Função para não ter que ficar digitando sempre o document.querySelector:
const sel = (el) => document.querySelector(el); // Função que recebe um elemento e retorna o elemento selecionado (nao tem bigode ou return por ser uma função simples, anonima)
const selAll = (el) => document.querySelectorAll(el); // Seleciona tudo

let cart = []; // Array do carrinho
let modalQtd = 1; // deixa como padrão a quantidade do modal como 1
let modalKey = 0 // Inicia como zero, mas quando eu abrir o modal, ele salva qual a pizza que abriu

// Listagem das pizzas:
pizzaJson.map((item, index) => { // .map faz a leitura de todos os elementos do array
    let pizzaItem = sel('.models .pizza-item').cloneNode(true); // seleciono o models e dentro pego o pizza-item. Pra clonar, uso o cloneNode true para pegar tudo que estiver dentro do item.
    
    pizzaItem.setAttribute('data-key', index); // Inserimos em pizzaItem a chave daquela pizza específica (uma chave pra cada item)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; // Adicionar a imagem
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; // Pego o pizzaItem, seleciono onde deve ficar o nome (classe html), adiciono no HTML o item.name
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `CG ${item.price.toFixed(2)}`; // Adiciono e formato o preço
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description; // Faço o mesmo com a descrição
    pizzaItem.querySelector('a').addEventListener('click', (e) => { // evento de clique, chamo uma função pra poder bloquear a abertura de uma nova tela qdo clicar na pizza
        e.preventDefault(); // previna a ação padrão
        let key = e.target.closest('.pizza-item').getAttribute('data-key') // a partir do "a", procurar o elemento mais próximo que tenha o .pizza-item, pega as infos da selecionada e armazena em key
        modalQtd = 1; // zera a quantidade do modal para 1 toda vez que o modal é fechado e reaberto
        modalKey = key; // Diz qual é a pizza

        // Adicionando os itens no modal:
        sel('.pizzaBig img').src = pizzaJson[key].img;        
        sel('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        sel('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        sel('.pizzaInfo--actualPrice').innerHTML = `CG ${pizzaJson[key].price.toFixed(2)}`;
        sel('.pizzaInfo--size.selected').classList.remove('selected'); // Resetar o tamanho selecionado do modal
        selAll('.pizzaInfo--size').forEach((size, sizeIndex) => { // Seleciono todos os itens de pizzaInfo--size e para cada um chamo uma fn com os parametros size e sizeIndex
            if(sizeIndex == 2) { // adiciona a classe de selecionado no size 2 (Grande) para vir como default
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        sel('.pizzaInfo--qt').innerHTML = modalQtd;

        sel('.pizzaWindowArea').style.opacity = 0; // mostrar o model com a opacidade zero
        sel('.pizzaWindowArea').style.display = 'flex'; // exibe o modal (flex)
        setTimeout(() =>{ // setar um timer
            sel('.pizzaWindowArea').style.opacity = 1; // coloca a opacidade 1 (visível)
        }, 200); // tempo do timer (1/5 de 1 segundo)
    });
    
    sel('.pizza-area').append(pizzaItem); // Adicionando conteúdo no final (cada item do arquivo "json")

    
}); 

// Eventos do Modal:
function closeModal() {
    sel('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        sel('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

// seleciona os itens de cancel, e para cada add um evento de clique e chama a função de fechar o modal
selAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => { 
    item.addEventListener('click', closeModal);
});

// Diminuir ou adicionar quantidade de pizzas:
sel('.pizzaInfo--qtmenos').addEventListener('click', () =>{
    if (modalQtd > 1) {
    modalQtd--;
    }
    sel('.pizzaInfo--qt').innerHTML = modalQtd;
});

sel('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modalQtd++;
    sel('.pizzaInfo--qt').innerHTML = modalQtd;
});

// Escolhendo tamanhos:
selAll('.pizzaInfo--size').forEach((size, sizeIndex) => { 
    size.addEventListener('click', (e) => {
        sel('.pizzaInfo--size.selected').classList.remove('selected'); // removo o selected
        size.classList.add('selected'); // adiciono selected no item que estou clicando
    });
});


sel ('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(sel('.pizzaInfo--size.selected').getAttribute('data-key')); // verifica qual tamanho está selecionado e armazena o data key (html) na variável size e transforma o número em inteiro
    
    // pra mesma pizza do mesmo tamanho  ficarem juntas, criaremos um identificador
    let identifier = pizzaJson[modalKey].id+'@'+size; // pega o key, adiciona um arroba e o tamanho

    // identificar se eu já tenho o item no carrinho:
    let key = cart.findIndex((item) => { // vou no carrinho
       return item.identifier == identifier // vejo quais itens do carrinho tem o mesmo identifier
    }); // se não encontrar, vai retornar -1

    if (key > -1) { // se encontrar identifiers iguais
        cart[key].qt += modalQtd; // muda a quantidade; pega o valor da direita e soma no valor da esquerda
    } else {
        cart.push({ // Atualizando/armazenando (push) o Array do cart com id, size e qt
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQtd
        });
    }   

    updateCart(); // função de atualizar o carrinho
    closeModal(); // fecha o modal quando add ao carrinho
});

sel('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) { // se o carrinho ter mais de 0 itens
    sel('aside').style.left = '0'; // muda o 'left' do menu openner que originalmente está em 100 (totalmente pra esquerda, ou seja nao aparece na tela)
    }
});

sel('.menu-closer').addEventListener('click', () => {
    sel('aside').style.left = '100vw'; // se clicar no X, volta o estado do left para 100 (totalmente a esquerda);
});

// Atualizar o carrinho:
function updateCart () {
    sel('.menu-openner span').innerHTML = cart.length; // Atualizar o número do carrinho do mobile

    if (cart.length > 0) { // se o meu carrinho ter itens eu exibo
        sel('aside').classList.add('show'); // se tiverem itens no carrinho vai add a classe show e mostrar o carrinho
        sel('.cart').innerHTML = ''; // Sempre rodo o update cart então preciso zerar antes de mostrar

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) { // pegar item a item pra exibir na tela
            let pizzaItem = pizzaJson.find((item) => { // acessar o Json e procurar nele os itens que tiverem o id que a gente tem. Find e não findIndex porque ele vai retornar o item inteiro
                return item.id == cart[i].id; // item.id vai ter que ser igual ao item do nosso carrinho (cart[i].id);
            });

            subtotal += pizzaItem.price * cart[i].qt; // preço da pizza multiplicado pela quantidade

            let cartItem = sel('.models .cart--item').cloneNode(true); // clona todo mundo
            let pizzaSizeName; 
            switch (cart[i].size) { // switch para trocar o numero index do size para um tamanho e retorno o tamanho para o PizzaSizeName
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; // Pego o pizza name pra ter o nome da pizza e também o tamanho e concateno
            cartItem.querySelector('img').src = pizzaItem.img; // Adicionar imagem
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; // adiciona o nome
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; // pegar do carrinho a quantidade
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) { // se ter mais de um item
                    cart[i].qt--; // diminui
                } else {
                    cart.splice(i, 1); // caso contrário, remove do carrinho com o splice (remove o i, e 1 item - só terá um)
                }
                updateCart(); // atualiza o carrinho e se responsabiliza por fechar o carrinho caso não tenha nenhum item
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++; // fn anônima, estou incrementando "um item no item"
                updateCart(); // atualiza o carrinho e se responsabiliza por fechar o carrinho caso não tenha nenhum item
            });
            

            sel('.cart').append(cartItem); // Exibir na tela os itens clonados
        }

        // depois do for calculo o restante dos itens:
        desconto = subtotal * 0.1; // 10%
        total = subtotal - desconto;

        sel('.subtotal span:last-child').innerHTML = `CG ${subtotal.toFixed(2)}`; // sempre tenho dois spans no html para esse dado; então seleciono o ultimo item do span (que é o valor no html);
        sel('.desconto span:last-child').innerHTML = `CG ${desconto.toFixed(2)}`;
        sel('.total span:last-child').innerHTML = `CG ${total.toFixed(2)}`;

    } else {
        sel('aside').classList.remove('show');
        sel('aside').style.left = '100vw'; // para fechar o mobile
    }
}




/*
CÓDIGOS USADOS:

.map: faz a leitura de todos os elementos do array
item.cloneNode: duplica um elemento node da estrutura de um documento DOM. Ele retorna um clone do elemento para o qual foi invocado.
.append: Pega o conteúdo da área e adiciona mais um conteúdo.
.toFixed(x): Número com tantos caracteres depois da vírgula
.preventDefault(): Cancela o evento se for cancelável
.target: o último elemento na hieraquia do DOM que recebeu o evento, ou seja, no exemplo acima, é o alvo do clique
.closest: retorna o ancestral mais próximo, em relação ao elemento atual, que possui o seletor fornecido como parâmetro. 

*/