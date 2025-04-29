function f1() {
    setTimeout(() => {
        console.log(1);
    }, 2000);
}

function f2() {
    setTimeout(() => {
        console.log(2);
    }, 1000);
}

f1();
f2();
