const moneyH = document.getElementById('money');
const dmoneyH = document.getElementById('dmoney');

document.getElementById('click').onclick = () => money += moneyMultiplier;
const productionDiv = document.getElementById('production');
const upgradesDiv = document.getElementById('upgrades');

document.getElementById('1x').onclick = () => buyMode = 1;
document.getElementById('10x').onclick = () => buyMode = 10;
document.getElementById('100x').onclick = () => buyMode = 100;

function createButton(text, onclick) {
    let el = document.createElement('button');
    el.innerHTML = text;
    el.onclick = onclick;
    document.body.appendChild(el);
    return el;
}

function createAuto(name) {
    let div = document.createElement('div');
    div.className = 'auto';

    let b = createButton(name);
    b.onclick = (function() {
        let a = autos[this.textContent];
        if (money >= a.cost * buyMode) {
            money -= a.cost * buyMode;
            a.cost *= Math.pow(buyMultiplier, buyMode);
            a.count += buyMode;

            p.textContent = `Count: ${a.count} -- Cost: $${a.cost.condense(2)} -- $${a.mps}/s`;
        }
    }).bind(b);
    div.appendChild(b);

    let p = document.createElement('p');
    let a = autos[name];
    p.textContent = `Count: ${a.count} -- Cost: $${a.cost.condense(2)} -- $${a.mps}/s`;
    b.p = p;
    div.appendChild(p);

    productionDiv.appendChild(div);
    return div;
}

function createUpgrade(name) {
    let div = document.createElement('div');
    div.className = 'auto';

    let b = createButton(name);
    b.onclick = (function() {
        let u = upgrades[this.textContent];
        if (money >= u.cost) {
            money -= u.cost;
            u.onbuy();
            u.deleteHTML();
        }
    }).bind(b);
    div.appendChild(b);

    let p = document.createElement('p');
    let u = upgrades[name];
    p.textContent = `Cost: $${u.cost.condense(2)}`;
    b.p = p;
    div.appendChild(p);

    upgradesDiv.appendChild(div);
    return div;
}