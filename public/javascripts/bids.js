const bidForm = document.getElementById('bid-form')
// const Auction = require('../../models/auction')


const socket = io()


//Message from server
socket.on('price', price => {
    console.log(price)
    outputMessage(price)
    // auctionTimer()
    highestBid(price)


})

//Bid Submitted
bidForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //Get Bid Price form show page
    const price = e.target.elements.price.value
    // const currentUser = req.user    

    // Emit bid price to the server 
    socket.emit('bidPrice', price)

    //Clear input 
    e.target.elements.price.value = ''
    e.target.elements.price.focus()
})

//Highest Bid Price
function highestBid(value) {
    let bid = 0
    if (value > bid ) {
        bid = value
       return document.getElementById('hi-bid').innerHTML = `
        <span>${bid}</span>`
    } else {
         return  document.getElementById('hi-bid').innerHTML = `
        <span>${value}</span>`
    }

}

//Output message to DOM
function outputMessage(price) {
    // var user = document.GetCurrentUser()
    const div = document.createElement('div')
    div.classList.add('bids')
    div.innerHTML = `<ul class="list-group list-group-flush">
    <li class="list-group-item"></li>
    <li class="list-group-item"><h4>$${price}</h4> </li>
  </ul>`

    document.querySelector('.submitted-bids').appendChild(div)
}

// CREATING AND FORMATING A TIMER
function auctionTimer() {
    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 10;
    const ALERT_THRESHOLD = 5;

    const COLOR_CODES = {
        info: {
            color: "green"
        },
        warning: {
            color: "orange",
            threshold: WARNING_THRESHOLD
        },
        alert: {
            color: "red",
            threshold: ALERT_THRESHOLD
        }
    };

    const TIME_LIMIT = 60;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;
    let remainingPathColor = COLOR_CODES.info.color;

    document.getElementById("timer").innerHTML = `
    <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
                <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${remainingPathColor}"
                d="
                    M 50, 50
                    m -45, 0
                    a 45,45 0 1,0 90,0
                    a 45,45 0 1,0 -90,0
                "
                ></path>
            </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">${formatTime(
      timeLeft
    )}</span>
  </div>
<div class="col" id="hi-bid">
     <span></span>
</div>
`;

    startTimer();

    function onTimesUp() {
        clearInterval(timerInterval);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
            document.getElementById("base-timer-label").innerHTML = formatTime(
                timeLeft
            );
            setCircleDasharray();
            setRemainingPathColor(timeLeft);

            if (timeLeft === 0) {
                onTimesUp();
                document.getElementById('bid-submit').disabled = true
                socket.disconnect()
            }
        }, 1000);
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds < 10) {
            seconds = `0${seconds}`;
        }

        return `${minutes}:${seconds}`;
    }

    function setRemainingPathColor(timeLeft) {
        const { alert, warning, info } = COLOR_CODES;
        if (timeLeft <= alert.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(warning.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(info.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(warning.color);
        }
    }

    function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }

    function setCircleDasharray() {
        const circleDasharray = `${(
            calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
            .getElementById("base-timer-path-remaining")
            .setAttribute("stroke-dasharray", circleDasharray);
    }
}

auctionTimer()