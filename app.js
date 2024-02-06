$('.scratch-sidebar-close').on('click',function() {
    $('.scratch-sidebar').removeClass('scratch-sidebar--open');
    $('.scratch-sidebar-toggle').removeClass('scratch-sidebar-toggle--active')
});

$('.scratch-sidebar-toggle').on('click',function() {
    $('.scratch-sidebar').toggleClass('scratch-sidebar--open');
    if($('.scratch-sidebar').hasClass('scratch-sidebar--open')) {
        $(this).addClass('scratch-sidebar-toggle--active')
    } else {
        $(this).removeClass('scratch-sidebar-toggle--active')
    }
});

/////////////// work with api /////////////////
const access = getCookie('access');
const bearer = `Bearer ${access}`;
const userId = getUserId(access);
const DEFAULT_LESSON_TYPE = 'DEFAULT_LESSON';
let balanceData = null;

function getBalanceValue(balance) {
    if(!balance.length) {
        return null
    }
    return balance.filter(item => item.lesson_type == DEFAULT_LESSON_TYPE)[0].balance;
}
    
function getBalancePlural(balance) {
    if(!balance.length) {
        return null
    }
    return balance.filter(item => item.lesson_type == DEFAULT_LESSON_TYPE)[0].localized_plural;
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
    }

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

async function getData(url, lang = 'en') {
    const res = await fetch(url, {
    headers: {
        'Authorization': bearer,
        'Accept-Language': lang,
        'api-key': '9df4fa08e2ff50268af2856eb34a79276bf51152c8ffaf429371cdf18c79'
        }
    });
    if(res.ok) {
        return res.json()
    } else {
        console.log(`Error: ${res.status} ${res.statusText}`)
    }
}

async function postData(url,data) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
        body: JSON.stringify(data)
    });
    if(res.ok) {
        return res.json()
    } else {
        console.log(`Error: ${res.status} ${res.statusText}`)
    }
}

function getUserId(token){
    const info = parseJwt(token);
    return info.user_id
}

async function getBalance(lang = 'en') {
    let res = await getData(`${baseUrl}/balance/?id=${userId}`, lang);
    balanceData = res;
    return res;
}

async function getTransactions(filter) {
    let {id,type,size} = filter;
    const defaultSize = 5;
    let url = `${baseUrl}/transactions/?id=${id}`;
    if(type) {
        url += `&transaction_type=${type}`
    }
    if(size) {
        url += `&size=${size}`
    } else {
        url += `&size=${defaultSize}`
    }
    let res = await getData(url);
    return res
}
