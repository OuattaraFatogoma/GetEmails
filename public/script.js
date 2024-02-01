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
        display.value = emails.join("\n");
        copyBtn.style.display = "block";
    } catch (error) {
        // TODO: display error to user
    }finally{
        loading.close();
    }
    
});

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(display.value);
    // Todo alert copy successfully 
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

