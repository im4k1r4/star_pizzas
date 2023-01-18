const sel = (el) => document.querySelector(el); 
const selAll = (el) => document.querySelectorAll(el); 

let cart = [];
let modalQtd = 1; 
let modalKey = 0;

pizzaJson.map((item, index) => { 
    let pizzaItem = sel('.models .pizza-item').cloneNode(true); 
    
    pizzaItem.setAttribute('data-key', index); 
    pizzaItem.querySelector('.pizza-item--img img').src = item.img; 
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `CG ${item.price.toFixed(2)}`; 
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description; 
    pizzaItem.querySelector('a').addEventListener('click', (e) => { 
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key') 
        modalQtd = 1; 
        modalKey = key;

        sel('.pizzaBig img').src = pizzaJson[key].img;        
        sel('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        sel('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        sel('.pizzaInfo--actualPrice').innerHTML = `CG ${pizzaJson[key].price.toFixed(2)}`;
        sel('.pizzaInfo--size.selected').classList.remove('selected'); 
        selAll('.pizzaInfo--size').forEach((size, sizeIndex) => { 
            if(sizeIndex == 2) { 
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        })

        sel('.pizzaInfo--qt').innerHTML = modalQtd;

        sel('.pizzaWindowArea').style.opacity = 0; 
        sel('.pizzaWindowArea').style.display = 'flex'; 
        setTimeout(() =>{ 
            sel('.pizzaWindowArea').style.opacity = 1; 
        }, 200); 
    });
    
    sel('.pizza-area').append(pizzaItem); 

    
}); 

function closeModal() {
    sel('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        sel('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

selAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => { 
    item.addEventListener('click', closeModal);
});

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

selAll('.pizzaInfo--size').forEach((size, sizeIndex) => { 
    size.addEventListener('click', (e) => {
        sel('.pizzaInfo--size.selected').classList.remove('selected'); 
        size.classList.add('selected'); 
    });
});


sel ('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(sel('.pizzaInfo--size.selected').getAttribute('data-key')); 
    
    let identifier = pizzaJson[modalKey].id+'@'+size; 

    let key = cart.findIndex((item) => { 
       return item.identifier == identifier;
    }); 

    if (key > -1) {
        cart[key].qt += modalQtd; 
    } else {
        cart.push({ 
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQtd
        });
    }   

    updateCart();
    closeModal(); 
});

sel('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) { 
    sel('aside').style.left = '0'; 
    }
});

sel('.menu-closer').addEventListener('click', () => {
    sel('aside').style.left = '100vw'; 
});

function updateCart () {
    sel('.menu-openner span').innerHTML = cart.length; 

    if (cart.length > 0) { 
        sel('aside').classList.add('show'); 
        sel('.cart').innerHTML = ''; 

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item) => { 
                return item.id == cart[i].id; 
            });

            subtotal += pizzaItem.price * cart[i].qt; 

            let cartItem = sel('.models .cart--item').cloneNode(true);
            let pizzaSizeName; 
            switch (cart[i].size) { 
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

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`; 
            cartItem.querySelector('img').src = pizzaItem.img; 
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; 
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) { 
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1); 
                }
                updateCart(); 
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++; 
                updateCart(); 
            });
            

            sel('.cart').append(cartItem); 
        }

        desconto = subtotal * 0.1; 
        total = subtotal - desconto;

        sel('.subtotal span:last-child').innerHTML = `CG ${subtotal.toFixed(2)}`; 
        sel('.desconto span:last-child').innerHTML = `CG ${desconto.toFixed(2)}`;
        sel('.total span:last-child').innerHTML = `CG ${total.toFixed(2)}`;

    } else {
        sel('aside').classList.remove('show');
        sel('aside').style.left = '100vw'; 
    }
}


