const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price)
}

const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.price').forEach(node => {
        const price = node.textContent ? +node.textContent : 0
        node.textContent = toCurrency(price);
    })

    document.querySelectorAll('.date').forEach(node => {
        node.textContent = toDate(node.textContent)
    })

    if (document.querySelector('#cart')) {

        document.querySelector('#cart').addEventListener('click', event => {
            
            if (event.target.closest('.btn-remove-product')) {
    
                const btn = event.target.closest('.btn-remove-product')
                if (!btn.dataset.id) return
    
                const product_id = btn.dataset.id
                const csrf = btn.dataset.csrf
    
                fetch(`/cart/remove/${product_id}`, { method: "delete", headers: {'X-XSRF-TOKEN': csrf} })
                    .then(res => res.json())
                    .then(cart => {
                        const $cart = document.querySelector('#cart')
    
                        if (cart.products.length) {
                            const html = cart.products.map(p => {
                              return `
                              <tr>
                                <td>${p.title}</td>
                                <td>${p.count}</td>
                                <td>
                                    <button class="btn btm-small btn-floating btn-remove-product" data-id="${p.id}" data-csrf="${csrf}" title="Удалить">
                                        <i class="material-icons">delete</i>
                                    </button>
                                </td>
                              </tr>
                              `
                            }).join('')
                            $cart.querySelector('tbody').innerHTML = html
                            $cart.querySelector('.price').textContent = toCurrency(cart.price)
                          } else {
                            $cart.innerHTML = '<p>Корзина пуста</p>'
                          }
                        })
    
            }
    
        })
    
    }

    M.Tabs.init(document.querySelectorAll('.tabs'))

})


