const form = document.querySelector('form');
const site = document.querySelector('#site');
const email = document.querySelector('#email');
const title = document.querySelector('#title');
const country = document.querySelector('#country');
const city = document.querySelector('#city');
const include = document.querySelector('#include');
const exclude = document.querySelector('#exclude');
const display = document.querySelector('textarea');
const loading = document.querySelector('dialog');
const copyBtn = document.querySelector('.copy')
const notification = document.querySelector('.notification');
const closeNotification = document.querySelector('.notification>button');
const successAudio = document.querySelector('.successAudio');
const dangerAudio = document.querySelector('.dangerAudio');



form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = getMessage();

    try {
        loading.showModal();
        const response = await fetch('/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        if(response.status === 500) throw new Error("Something went wrong please try again");
        const emails = await response.json(); 
        display.value = emails.join(",\n");
        copyBtn.style.display = "block";
        notify("Emails List ready !");
    } catch (error) {
        notify("Something went wrong, try again", "danger");
    }finally{
        loading.close();
    }
    
});

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(display.value);
    notify("Copy to clipboard");
});



///// functions ////////

const getMessage = () =>{
    let message = `site:"${site.value}" +"${email.value}" "${title.value}"`;
    if(country.value) message += ` "${country.value}"`;
    if(city.value) message += ` +"${city.value}"`;
    if(include.value) message += ` +"${include.value}"`;
    if(exclude.value) message += ` -"${exclude.value}"`;
    return message;
}


const notify = (message, type = "success") => {
    if(type === "danger"){
        notification.style.backgroundColor = "darkred";
        dangerAudio.play();

    } else{
        successAudio.play();
    }
    notification.children[0].textContent = message;
    notification.style.transform = "translateY(100%)";
    setTimeout( () => notification.style.transform = "translateY(-300%)", 3000);
    closeNotification.addEventListener("click", () =>{
        notification.style.transform = "translateY(-300%)"
    });
}
